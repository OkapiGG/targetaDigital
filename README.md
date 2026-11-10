# RHINACRED · Tarjeta digital de empleado

Aplicación Vue 3 + TypeScript basada en la plantilla UI **Sakai de PrimeVue**,
personalizada con el diseño de RHINACRED.

La pantalla conserva el formulario del colaborador, el cálculo de RFC, la
previsualización de fotografía, el código de barras CODE128 y la impresión de la
tarjeta.

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

- `src/layout/`: layout y encabezado adaptados de Sakai.
- `src/router/`: enrutador con la vista de credenciales.
- `src/views/CredentialView.vue`: formulario y tarjeta digital.
- `src/assets/layout/`: estilos SCSS oficiales de Sakai.
- `src/themes/rhinacred.ts`: tema Aura personalizado.
- `src/utils/rfc.ts`: cálculo de RFC existente.

Consulta [la documentación de la integración de Sakai](docs/SAKAI.md) para conocer
las fuentes oficiales, versiones, adaptaciones y licencia.

## GitHub Pages

Se conserva la ruta base `/targetaDigital/`. El enrutador usa URLs con `#/` para
permitir recargar la aplicación en GitHub Pages.

El comando existente `npm run deploy` compila y publica `dist/` mediante `gh-pages`.
