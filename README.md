# RHINACRED · Tarjeta digital y punto de venta

Aplicación Vue 3 + TypeScript basada en la plantilla UI **Sakai de PrimeVue**,
personalizada con el diseño de RHINACRED. El menú lateral de Sakai da acceso a
dos módulos:

- **Tarjeta digital** (`#/`): formulario del colaborador, cálculo de RFC,
  previsualización de fotografía, código de barras CODE128 e impresión de la
  tarjeta.
- **Punto de venta** (`#/pos`): registro, edición y eliminación de productos en
  un `DataTable` con el Subtotal, el IVA (16 %) y el Total a pagar.

## Ejecutar

```sh
npm ci
npm run dev
```

## Verificar y compilar

```sh
npm run build
```

Este comando ejecuta la comprobación de TypeScript y la compilación para producción.

## Estructura

- `src/layout/`: layout, encabezado y menú lateral adaptados de Sakai.
- `src/router/`: enrutador con las vistas de ambos módulos.
- `src/views/CredentialView.vue`: formulario y tarjeta digital.
- `src/views/PosView.vue`: punto de venta.
- `src/assets/layout/`: estilos SCSS oficiales de Sakai.
- `src/themes/rhinacred.ts`: tema Aura personalizado.
- `src/utils/rfc.ts`: cálculo de RFC existente.

Consulta [la documentación de la integración de Sakai](docs/SAKAI.md) para conocer
las fuentes oficiales, versiones, adaptaciones y licencia.

## GitHub Pages

Se conserva la ruta base `/targetaDigital/`. El enrutador usa URLs con `#/` para
permitir recargar la aplicación en GitHub Pages.

El comando existente `npm run deploy` compila y publica `dist/` mediante `gh-pages`.
