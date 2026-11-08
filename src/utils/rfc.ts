// Cálculo del RFC de persona física según el algoritmo publicado por el SAT.

const IGNORED_WORDS = [
  'DA', 'DAS', 'DE', 'DEL', 'DER', 'DI', 'DIE', 'DD', 'EL', 'LA', 'LAS', 'LE', 'LES',
  'LOS', 'MAC', 'MC', 'VAN', 'VON', 'Y',
]
const COMMON_FIRST_NAMES = ['JOSE', 'J', 'MARIA', 'MA', 'M']
const OFFENSIVE_WORDS = [
  'BUEI', 'BUEY', 'CACA', 'CACO', 'CAGA', 'CAGO', 'CAKA', 'CAKO', 'COGE', 'COJA', 'COJE',
  'COJI', 'COJO', 'CULO', 'FETO', 'GUEY', 'JOTO', 'KACA', 'KACO', 'KAGA', 'KAGO', 'KAKA',
  'KOGE', 'KOJO', 'KULO', 'MAME', 'MAMO', 'MEAR', 'MEAS', 'MEON', 'MION', 'MOCO', 'MULA',
  'PEDA', 'PEDO', 'PENE', 'PUTA', 'PUTO', 'QULO', 'RATA', 'RUIN',
]
const HOMOCLAVE_CHARS = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ'
const CHECK_DIGIT_CHARS = '0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ'

export interface RfcInput {
  names: string
  firstSurname: string
  secondSurname: string
  birthdate: string // YYYY-MM-DD
}

// Mayúsculas y sin acentos, conservando la Ñ.
function normalize(value: string) {
  return value
    .toUpperCase()
    .replace(/Ñ/g, '\u0000')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\u0000/g, 'Ñ')
    .replace(/[^A-ZÑ& ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function withoutIgnoredWords(value: string) {
  return value
    .split(' ')
    .filter((word) => word && !IGNORED_WORDS.includes(word))
    .join(' ')
}

function homoclaveValue(char: string) {
  if (char === ' ') return '00'
  if (char === '&') return '10'
  if (char === 'Ñ') return '40'
  if (char >= 'A' && char <= 'I') return String(char.charCodeAt(0) - 'A'.charCodeAt(0) + 11)
  if (char >= 'J' && char <= 'R') return String(char.charCodeAt(0) - 'J'.charCodeAt(0) + 21)
  return String(char.charCodeAt(0) - 'S'.charCodeAt(0) + 32)
}

function homoclave(fullName: string) {
  const digits = '0' + [...fullName].map(homoclaveValue).join('')
  let sum = 0
  for (let i = 0; i < digits.length - 1; i++) {
    sum += Number(digits.slice(i, i + 2)) * Number(digits[i + 1])
  }
  const lastThreeDigits = sum % 1000
  return (
    HOMOCLAVE_CHARS.charAt(Math.floor(lastThreeDigits / 34)) +
    HOMOCLAVE_CHARS.charAt(lastThreeDigits % 34)
  )
}

function checkDigit(rfc12: string) {
  const sum = [...rfc12].reduce(
    (total, char, i) => total + CHECK_DIGIT_CHARS.indexOf(char) * (13 - i),
    0,
  )
  const remainder = sum % 11
  if (remainder === 0) return '0'
  return remainder === 1 ? 'A' : String(11 - remainder)
}

export function generateRfc({ names, firstSurname, secondSurname, birthdate }: RfcInput) {
  const paternal = withoutIgnoredWords(normalize(firstSurname))
  const maternal = withoutIgnoredWords(normalize(secondSurname))
  const nameWords = withoutIgnoredWords(normalize(names)).split(' ')
  const name =
    nameWords.length > 1 && COMMON_FIRST_NAMES.includes(nameWords[0] ?? '')
      ? nameWords.slice(1).join(' ')
      : nameWords.join(' ')

  let letters: string
  if (!maternal) {
    letters = paternal.slice(0, 2) + name.slice(0, 2)
  } else if (paternal.length <= 2) {
    letters = paternal.charAt(0) + maternal.charAt(0) + name.slice(0, 2)
  } else {
    const firstInnerVowel = paternal.slice(1).match(/[AEIOU]/)?.[0] ?? 'X'
    letters = paternal.charAt(0) + firstInnerVowel + maternal.charAt(0) + name.charAt(0)
  }
  if (OFFENSIVE_WORDS.includes(letters)) letters = letters.slice(0, 3) + 'X'

  const [year = '', month = '', day = ''] = birthdate.split('-')
  const rfc12 =
    letters +
    year.slice(-2) +
    month +
    day +
    homoclave([firstSurname, secondSurname, names].map(normalize).filter(Boolean).join(' '))
  return rfc12 + checkDigit(rfc12)
}
