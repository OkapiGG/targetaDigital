// Adaptado de primefaces/sakai-vue, src/layout/composables/layout.js (licencia MIT).
import { reactive } from 'vue'

const layoutConfig = reactive({
  preset: 'Aura',
  primary: 'orange',
  darkTheme: false,
  menuMode: 'static' as 'static' | 'overlay',
})

const layoutState = reactive({
  staticMenuInactive: true,
  overlayMenuActive: false,
  mobileMenuActive: false,
})

export function useLayout() {
  return { layoutConfig, layoutState }
}
