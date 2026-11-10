# Integración de Sakai

RHINACRED usa la base de la plantilla UI **Sakai de PrimeVue**, adaptada para
conservar la pantalla de credenciales existente y sus funciones de RFC, fotografía,
código de barras e impresión, junto con el punto de venta.

## Fuentes oficiales

- Plantilla: <https://github.com/primefaces/sakai-vue>
- Versión consultada: Sakai 5.0.0, commit
  `ec6b6ef53ad4fa7f2861277f50f2d9e236c40372`.
- Estilos oficiales: <https://github.com/primefaces/sakai-assets>, submódulo de
  la plantilla en el commit `eaa70ece4cfa9aeb8f60b36dce5a422b6bae8003`.
- Licencia MIT de PrimeTek: [SAKAI-MIT.md](../licenses/SAKAI-MIT.md).

## Estructura utilizada

| Archivo                            | Función                                                                                 |
| ---------------------------------- | --------------------------------------------------------------------------------------- |
| `src/App.vue`                      | Punto de entrada con `RouterView`, como en Sakai.                                       |
| `src/router/index.ts`              | Rutas hijas de `AppLayout`: credenciales (`/`) y punto de venta (`/pos`).               |
| `src/layout/AppLayout.vue`         | Estructura de Sakai: `layout-wrapper`, topbar, `layout-main-container` y `layout-main`. |
| `src/layout/AppTopbar.vue`         | Encabezado personalizado con la marca RHINACRED y el botón del menú.                    |
| `src/layout/AppMenu.vue`           | Menú lateral con las clases `layout-menu` de Sakai.                                     |
| `src/layout/composables/layout.ts` | Configuración reactiva de layout adaptada del composable de Sakai a TypeScript.         |
| `src/assets/layout/`               | SCSS oficial de Sakai, copiado sin modificaciones.                                      |
| `src/assets/styles.scss`           | Compila los estilos de layout en la capa CSS `sakai`.                                   |
| `src/assets/tailwind.css`          | Tailwind 4 con `tailwindcss-primeui` y los puntos de corte de Sakai.                    |
| `src/themes/rhinacred.ts`          | Preset basado en Aura con la paleta naranja del proyecto.                               |
| `src/views/CredentialView.vue`     | Pantalla original, ahora como vista dentro de la plantilla.                             |
| `src/views/PosView.vue`            | Punto de venta migrado del proyecto `puntoVentas` a TypeScript.                         |
| `src/assets/main.css`              | Personalización visual de RHINACRED sobre la base de Sakai.                             |

## Adaptaciones

Se usa el menú lateral estático de Sakai para cambiar entre la tarjeta digital y el
punto de venta; no se incluye el footer de demostración. No se incluyen dashboards
ni páginas de ejemplo que no forman parte de la actividad.

Los campos y botones PrimeVue usan el tema Aura personalizado. El punto de venta
adopta la paleta naranja y las tipografías del proyecto en lugar del índigo y las
fuentes Inter y JetBrains Mono originales.

Los estilos propios tienen prioridad sobre las capas `sakai` y `primevue`. Tailwind
se integra sin su reinicio global Preflight para conservar las medidas y estilos
existentes.

Se conserva Vue 3, TypeScript, Vite y las dependencias originales del cálculo de RFC
y del código de barras. No se reemplaza la lógica de `src/utils/rfc.ts`.

El enrutador utiliza hash history para funcionar en GitHub Pages sin reglas de
reescritura del servidor. Se conserva `base: '/targetaDigital/'` y el comando de
despliegue existente. Esta migración no publica cambios automáticamente.
