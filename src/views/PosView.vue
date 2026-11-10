<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

interface Producto {
  cns: number
  nombre: string
  precio: number
  cantidad: number
}

interface Formulario {
  nombre: string
  cantidad: number | null
  precio: number | null
}

type Totales = Record<'subtotal' | 'iva' | 'total', number>

const toast = useToast()
const confirm = useConfirm()

const TASA_IVA = 0.16
const DURACION_TOAST_MS = 2500
const DURACION_RESALTADO_MS = 1300
const DURACION_CONTEO_MS = 700

const productos = ref<Producto[]>([
  { cns: 1, nombre: 'Impresora LaserJet Color', precio: 5200, cantidad: 2 },
  { cns: 2, nombre: 'Monitor LED 31 plg.', precio: 1700, cantidad: 3 },
])

const formVacio = (): Formulario => ({ nombre: '', cantidad: null, precio: null })
const form = ref(formVacio())
const editando = ref<number | null>(null)
const errores = ref<Partial<Record<keyof Formulario, string>>>({})
const resaltado = ref<number | null>(null)

const formatoMoneda = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })
const moneda = (n: number) => formatoMoneda.format(n || 0)

function validar() {
  const e: typeof errores.value = {}
  if (!form.value.nombre.trim()) e.nombre = 'Escribe el nombre del producto'
  if (!form.value.cantidad || form.value.cantidad < 1) e.cantidad = 'Cantidad mayor a 0'
  if (!form.value.precio || form.value.precio <= 0) e.precio = 'Precio mayor a 0'
  errores.value = e
  return Object.keys(e).length === 0
}

let temporizadorResaltado: ReturnType<typeof setTimeout> | undefined
function resaltar(cns: number) {
  clearTimeout(temporizadorResaltado)
  resaltado.value = cns
  temporizadorResaltado = setTimeout(() => (resaltado.value = null), DURACION_RESALTADO_MS)
}

function registrar() {
  const { nombre, cantidad, precio } = form.value
  if (!validar() || !cantidad || !precio) return
  const datos = { nombre: nombre.trim(), cantidad, precio }

  const p = productos.value.find((x) => x.cns === editando.value)
  if (p) {
    Object.assign(p, datos)
    resaltar(p.cns)
    toast.add({
      severity: 'info',
      summary: 'Actualizado',
      detail: datos.nombre,
      life: DURACION_TOAST_MS,
    })
  } else {
    const nuevo = { cns: productos.value.length + 1, ...datos }
    productos.value.push(nuevo)
    resaltar(nuevo.cns)
    toast.add({
      severity: 'success',
      summary: 'Registrado',
      detail: datos.nombre,
      life: DURACION_TOAST_MS,
    })
  }
  cancelar()
}

function editar(p: Producto) {
  editando.value = p.cns
  errores.value = {}
  form.value = { nombre: p.nombre, cantidad: p.cantidad, precio: p.precio }
}

function cancelar() {
  editando.value = null
  errores.value = {}
  form.value = formVacio()
}

function eliminar(p: Producto) {
  confirm.require({
    header: 'Eliminar producto',
    message: `¿Seguro que quieres eliminar "${p.nombre}"?`,
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Eliminar', severity: 'danger' },
    accept: () => {
      productos.value = productos.value
        .filter((x) => x.cns !== p.cns)
        .map((x, i) => ({ ...x, cns: i + 1 })) // re-numera el consecutivo
      if (editando.value === p.cns) cancelar()
      toast.add({
        severity: 'warn',
        summary: 'Eliminado',
        detail: p.nombre,
        life: DURACION_TOAST_MS,
      })
    },
  })
}

const subtotal = computed(() => productos.value.reduce((s, p) => s + p.precio * p.cantidad, 0))
const iva = computed(() => subtotal.value * TASA_IVA)
const total = computed(() => subtotal.value + iva.value)

const mostrado = ref<Totales>({ subtotal: 0, iva: 0, total: 0 })
let raf = 0
watch(
  subtotal,
  () => {
    cancelAnimationFrame(raf)
    const desde = { ...mostrado.value }
    const hasta: Totales = { subtotal: subtotal.value, iva: iva.value, total: total.value }
    const inicio = performance.now()
    const paso = (t: number) => {
      const k = Math.min(1, (t - inicio) / DURACION_CONTEO_MS)
      const e = 1 - Math.pow(1 - k, 3)
      for (const key of ['subtotal', 'iva', 'total'] as const) {
        mostrado.value[key] = desde[key] + (hasta[key] - desde[key]) * e
      }
      if (k < 1) raf = requestAnimationFrame(paso)
    }
    raf = requestAnimationFrame(paso)
  },
  { immediate: true },
)

const claseFila = (data: Producto) => [
  data.cns === resaltado.value ? 'fila-animada' : '',
  data.cns === editando.value ? 'fila-editando' : '',
]

const importe = computed(() =>
  form.value.cantidad && form.value.precio ? moneda(form.value.cantidad * form.value.precio) : '—',
)
</script>

<template>
  <Toast position="bottom-center" />
  <ConfirmDialog />

  <div class="container pos">
    <header class="encabezado aparecer">
      <div class="logo"><i class="pi pi-shopping-cart"></i></div>
      <div>
        <h1>Punto de Venta</h1>
        <p>Caja 01 · {{ productos.length }} productos</p>
      </div>
    </header>

    <div class="pos-grid">
      <main class="principal">
        <form
          class="tarjeta aparecer d1"
          :class="{ 'en-edicion': editando !== null }"
          @submit.prevent="registrar"
        >
          <div class="tarjeta-titulo">
            <h2>{{ editando !== null ? 'Editar producto' : 'Nuevo producto' }}</h2>
            <span v-if="editando !== null" class="chip">Editando #{{ editando }}</span>
          </div>

          <div class="campos">
            <div class="campo ancho">
              <label for="nombre">Producto</label>
              <InputText
                id="nombre"
                v-model="form.nombre"
                placeholder="Nombre del producto…"
                :invalid="!!errores.nombre"
                fluid
              />
              <small v-if="errores.nombre" class="error">{{ errores.nombre }}</small>
            </div>
            <div class="campo">
              <label for="cantidad">Cantidad</label>
              <InputNumber
                v-model="form.cantidad"
                input-id="cantidad"
                :min="1"
                show-buttons
                placeholder="0"
                :invalid="!!errores.cantidad"
                fluid
              />
              <small v-if="errores.cantidad" class="error">{{ errores.cantidad }}</small>
            </div>
            <div class="campo">
              <label for="precio">Precio unitario</label>
              <InputNumber
                v-model="form.precio"
                input-id="precio"
                mode="currency"
                currency="MXN"
                locale="es-MX"
                placeholder="$0.00"
                :invalid="!!errores.precio"
                fluid
              />
              <small v-if="errores.precio" class="error">{{ errores.precio }}</small>
            </div>
          </div>

          <div class="acciones-form">
            <span class="importe"
              >Importe: <strong>{{ importe }}</strong></span
            >
            <div class="botones">
              <Button
                v-if="editando !== null"
                label="Cancelar"
                severity="secondary"
                outlined
                @click="cancelar"
              />
              <Button
                type="submit"
                :label="editando !== null ? 'Guardar cambios' : 'Registrar'"
                :icon="editando !== null ? 'pi pi-check' : 'pi pi-plus'"
                class="btn-registrar"
              />
            </div>
          </div>
        </form>

        <div class="tarjeta tabla aparecer d2">
          <DataTable
            :value="productos"
            data-key="cns"
            sort-field="cns"
            :sort-order="1"
            paginator
            :rows="5"
            :rows-per-page-options="[5, 10, 20]"
            paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            current-page-report-template="Visualizando {last} de {totalRecords} productos"
            :row-class="claseFila"
            striped-rows
            scrollable
            table-style="min-width: 44rem"
          >
            <template #empty>
              <div class="vacio">
                <i class="pi pi-inbox"></i>
                <p>Sin productos en la venta</p>
              </div>
            </template>

            <Column field="cns" header="Cns" sortable style="width: 6rem" />
            <Column field="nombre" header="Nombre del Producto" sortable />
            <Column field="precio" header="Precio U." sortable>
              <template #body="{ data }">{{ moneda(data.precio) }}</template>
            </Column>
            <Column field="cantidad" header="Cant." style="width: 6rem" />
            <Column header="Precio P.">
              <template #body="{ data }">
                <strong>{{ moneda(data.precio * data.cantidad) }}</strong>
              </template>
            </Column>
            <Column header="Acciones" style="width: 8rem">
              <template #body="{ data }">
                <div class="acciones">
                  <Button
                    icon="pi pi-pencil"
                    severity="success"
                    rounded
                    outlined
                    :aria-label="'Editar ' + data.nombre"
                    @click="editar(data)"
                  />
                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    rounded
                    outlined
                    :aria-label="'Eliminar ' + data.nombre"
                    @click="eliminar(data)"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </main>

      <aside class="ticket mono aparecer d3">
        <h2>Resumen</h2>
        <div class="linea-punteada"></div>
        <div class="fila-total">
          <span>Subtotal</span><strong>{{ moneda(mostrado.subtotal) }}</strong>
        </div>
        <div class="fila-total">
          <span>IVA (16%)</span><strong>{{ moneda(mostrado.iva) }}</strong>
        </div>
        <div class="linea-punteada"></div>
        <span class="etiqueta">Total a pagar</span>
        <div class="gran-total">{{ moneda(mostrado.total) }}</div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.pos {
  --acento: var(--p-primary-color);
  padding-block: clamp(24px, 4vw, 48px);
  color: var(--navy);
}

/* ---------- Encabezado ---------- */
.encabezado {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}
.encabezado h1 {
  font-size: 32px;
}
.encabezado p {
  margin-top: 2px;
  color: var(--muted);
  font-size: 14px;
}
.logo {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: var(--acento);
  color: #fff;
  font-size: 20px;
  box-shadow: 0 8px 20px -8px var(--acento);
}

/* ---------- Distribución ---------- */
.pos-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}
.principal {
  flex: 999 1 600px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.tarjeta {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 22px;
  box-shadow:
    0 1px 2px rgba(16, 24, 40, 0.04),
    0 8px 24px -12px rgba(16, 24, 40, 0.1);
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}
.tarjeta.tabla {
  padding: 8px;
  overflow: hidden;
}
.tarjeta.en-edicion {
  border-color: var(--acento);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--acento) 12%, transparent);
}

.tarjeta-titulo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.tarjeta-titulo h2 {
  font-size: 18px;
}
.chip {
  background: var(--acento);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 999px;
}

/* ---------- Formulario ---------- */
.campos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}
.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.campo.ancho {
  grid-column: span 2;
}
.campo label {
  font-size: 13px;
  font-weight: 600;
  color: #3a4252;
}
.error {
  color: #c8321f;
}

.acciones-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}
.importe {
  color: var(--muted);
  font-size: 14px;
}
.importe strong {
  color: var(--navy);
}
.botones {
  display: flex;
  gap: 10px;
}

.btn-registrar {
  transition:
    transform 0.15s,
    box-shadow 0.2s;
}
.btn-registrar:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px -10px var(--acento);
}
.btn-registrar:active {
  transform: scale(0.96);
}
.btn-registrar :deep(.p-button-icon) {
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.btn-registrar:hover :deep(.p-button-icon) {
  transform: rotate(90deg);
}

/* ---------- DataTable ---------- */
.acciones {
  display: flex;
  gap: 8px;
}
.acciones .p-button {
  transition: transform 0.15s;
}
.acciones .p-button:hover {
  transform: translateY(-2px);
}

.tabla :deep(.p-datatable-tbody > tr > td) {
  font-size: 15px;
}

/* fila recién registrada / editada */
.tabla :deep(.fila-animada) {
  animation:
    entrar 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
    destello 1.3s ease-out;
}
@keyframes entrar {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes destello {
  0% {
    background: color-mix(in srgb, var(--acento) 22%, transparent);
  }
  100% {
    background: transparent;
  }
}
.tabla :deep(.fila-editando) {
  box-shadow: inset 3px 0 0 var(--acento);
  background: color-mix(in srgb, var(--acento) 6%, transparent) !important;
}

.vacio {
  text-align: center;
  padding: 40px 0;
  color: var(--muted);
}
.vacio i {
  font-size: 36px;
  color: var(--acento);
  animation: flotar 3s ease-in-out infinite;
}
@keyframes flotar {
  50% {
    transform: translateY(-6px);
  }
}

/* ---------- Ticket de totales ---------- */
.ticket {
  flex: 1 1 300px;
  min-width: 0;
  position: relative;
  background: #fffdf7;
  border-radius: var(--radius) var(--radius) 0 0;
  padding: 26px 24px 30px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  filter: drop-shadow(0 10px 18px rgba(16, 24, 40, 0.1));
}
.ticket::after {
  /* borde dentado de ticket */
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -10px;
  height: 10px;
  background: radial-gradient(circle at 10px -2px, transparent 9px, #fffdf7 10px) repeat-x;
  background-size: 20px 10px;
}
.ticket h2 {
  font-size: 18px;
}
.linea-punteada {
  border-top: 2px dashed #dcd6c6;
}
.fila-total {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
}
.fila-total span {
  color: #4a5262;
}
.etiqueta {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}
.gran-total {
  font-size: 36px;
  font-weight: 700;
  color: var(--acento);
  letter-spacing: -0.03em;
  word-break: break-all;
}

/* ---------- Entrada escalonada ---------- */
.aparecer {
  animation: aparecer 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.d1 {
  animation-delay: 0.06s;
}
.d2 {
  animation-delay: 0.14s;
}
.d3 {
  animation-delay: 0.22s;
}
@keyframes aparecer {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 640px) {
  .campo.ancho {
    grid-column: auto;
  }
}
@media (prefers-reduced-motion: reduce) {
  .pos * {
    animation: none !important;
  }
}
</style>
