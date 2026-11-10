<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import JsBarcode from 'jsbarcode'
import { generateRfc } from '@/utils/rfc'

const employee = reactive({
  names: 'Susana',
  firstSurname: 'Rojas',
  secondSurname: 'Mérida',
  birthdate: '1992-08-22',
  rfc: 'ROMS920822A10',
  role: 'Diseñadora UX/UI Lead',
  department: 'Producto & Diseño',
})
const photo = ref(
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCy523dcSu9r3YOHWnpy0hDn4z_W_ippzTpX_qzR6zKjnT25QAzG6msk1DdvsH5HikN7LirW6mYSAwX_No6JdsfqFdQ6yqK3LszKWIeLkzN5UOxqOziBwAlaKrsamfgfWGApnZZzdyAIuox6ZFni9bDCoAGemVD4iMvHz7tJ1mjhft0M-LsVHwuLydv3splr9GPO82yFGXk6i85fhcjYis14gl9fJf2T-dlPF4fldbd',
)
const photoError = ref('')
const formError = ref('')
const previewUpdated = ref(false)
const barcode = ref<SVGSVGElement | null>(null)

employee.rfc = generateRfc(employee)

watchEffect(() => {
  if (!barcode.value || !employee.rfc) return
  JsBarcode(barcode.value, employee.rfc, {
    format: 'CODE128',
    displayValue: false,
    margin: 0,
    background: 'transparent',
    lineColor: '#172033',
  })
})

function generateCard() {
  if (!employee.names.trim() || !employee.firstSurname.trim()) {
    formError.value = 'Captura al menos el nombre y el apellido paterno.'
    return
  }
  if (!employee.birthdate || new Date(employee.birthdate) > new Date()) {
    formError.value = 'Captura una fecha de nacimiento válida.'
    return
  }
  formError.value = ''
  employee.rfc = generateRfc(employee)
  previewUpdated.value = true
}

function changePhoto(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    photoError.value = 'Selecciona una imagen JPG, PNG o WEBP.'
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    photoError.value = 'La imagen debe pesar menos de 5 MB.'
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string') photo.value = reader.result
    photoError.value = ''
  }
  reader.onerror = () => {
    photoError.value = 'No se pudo abrir la imagen. Intenta con otra.'
  }
  reader.readAsDataURL(file)
}

function printCard() {
  window.print()
}
</script>

<template>
  <main class="container workspace">
    <div class="page-heading">
      <p class="eyebrow">Plataforma de identidad profesional</p>
      <h1>Credencial <span>digital</span></h1>
    </div>

    <div class="workspace-grid">
      <section class="panel" aria-labelledby="form-title">
        <div class="panel-heading">
          <h2 id="form-title">Datos del colaborador</h2>
          <p>Completa los campos y pulsa “Generar” para calcular el RFC.</p>
        </div>

        <form class="employee-form" @submit.prevent="generateCard" @input="previewUpdated = false">
          <div class="field">
            <label for="names">Nombre(s)</label>
            <InputText
              id="names"
              v-model="employee.names"
              class="form-input"
              autocomplete="given-name"
              placeholder="Ej. Susana"
              maxlength="60"
            />
          </div>
          <div class="field-row">
            <div class="field">
              <label for="first-surname">Apellido paterno</label>
              <InputText
                id="first-surname"
                v-model="employee.firstSurname"
                class="form-input"
                autocomplete="family-name"
                placeholder="Ej. Rojas"
                maxlength="40"
              />
            </div>
            <div class="field">
              <label for="second-surname">Apellido materno</label>
              <InputText
                id="second-surname"
                v-model="employee.secondSurname"
                class="form-input"
                placeholder="Ej. Mérida"
                maxlength="40"
              />
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label for="birthdate">Fecha de nacimiento</label>
              <input
                id="birthdate"
                v-model="employee.birthdate"
                class="form-input"
                type="date"
                autocomplete="bday"
              />
            </div>
            <div class="field">
              <label for="rfc">RFC</label>
              <InputText
                id="rfc"
                :model-value="employee.rfc"
                readonly
                class="form-input mono uppercase"
                placeholder="Pulsa “Generar”"
              />
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label for="role">Cargo / puesto</label>
              <InputText
                id="role"
                v-model="employee.role"
                class="form-input"
                autocomplete="organization-title"
                placeholder="Ej. Diseñadora UX/UI Lead"
                maxlength="80"
              />
            </div>
            <div class="field">
              <label for="department">Área / departamento</label>
              <div class="select-wrapper">
                <select id="department" v-model="employee.department" class="form-input">
                  <option>Producto &amp; Diseño</option>
                  <option>Ingeniería &amp; Software</option>
                  <option>Operaciones Globales</option>
                  <option>Ventas &amp; Analytics</option>
                  <option>Recursos Humanos</option>
                </select>
                <i class="pi pi-chevron-down" aria-hidden="true"></i>
              </div>
            </div>
          </div>
          <div class="field">
            <label for="photo">Fotografía</label>
            <div class="photo-upload">
              <input
                id="photo"
                class="photo-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                aria-describedby="photo-help photo-error"
                @change="changePhoto"
              />
              <div class="upload-avatar">
                <i class="pi pi-user" aria-hidden="true"></i>
                <img v-if="photo" :src="photo" alt="" @error="photo = ''" />
              </div>
              <div class="upload-copy">
                <strong>Cambiar fotografía</strong>
                <span id="photo-help">JPG, PNG o WEBP · máx. 5 MB</span>
              </div>
              <i class="pi pi-upload upload-icon" aria-hidden="true"></i>
            </div>
            <p id="photo-error" class="field-error" role="alert">{{ photoError }}</p>
          </div>
          <p class="field-error" role="alert">{{ formError }}</p>
          <Button type="submit" class="generate-button">
            <span>{{ previewUpdated ? 'Tarjeta generada' : 'Generar tarjeta' }}</span>
            <i :class="previewUpdated ? 'pi pi-check' : 'pi pi-arrow-right'" aria-hidden="true"></i>
          </Button>
          <span class="sr-only" role="status">{{
            previewUpdated ? 'Tarjeta digital generada.' : ''
          }}</span>
        </form>
      </section>

      <section class="preview-panel" aria-labelledby="preview-title">
        <h2 id="preview-title" class="preview-title">Tarjeta digital</h2>
        <article class="credential" aria-label="Vista previa de la credencial">
          <header class="credential-header">
            <div class="brand brand-small">
              <span class="brand-mark">R</span>
              <span class="brand-name">RHINA<span>CRED</span></span>
            </div>
          </header>
          <div class="credential-body">
            <div class="portrait">
              <span class="portrait-initials"
                >{{ employee.names.trim().charAt(0) || 'N'
                }}{{ employee.firstSurname.trim().charAt(0) || 'A' }}</span
              >
              <img v-if="photo" :src="photo" alt="Fotografía del colaborador" @error="photo = ''" />
            </div>
            <h3 class="employee-name">
              <span>{{ employee.names.trim() || 'Nombre' }}</span>
              <span>{{
                [employee.firstSurname, employee.secondSurname]
                  .filter((value) => value.trim())
                  .join(' ') || 'Apellidos'
              }}</span>
            </h3>
            <p class="employee-role">{{ employee.role.trim() || 'Cargo / puesto' }}</p>
            <p class="employee-department">{{ employee.department }}</p>
            <p class="employee-id">
              <span>RFC</span> <strong class="mono">{{ employee.rfc || 'SIN ASIGNAR' }}</strong>
            </p>
            <svg
              v-show="employee.rfc"
              ref="barcode"
              class="barcode"
              preserveAspectRatio="none"
              aria-hidden="true"
            ></svg>
          </div>
        </article>
        <Button class="print-button" type="button" @click="printCard">
          <i class="pi pi-print" aria-hidden="true"></i><span>Imprimir tarjeta</span>
        </Button>
      </section>
    </div>
  </main>
</template>
