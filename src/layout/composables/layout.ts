// Adaptado de primefaces/sakai-vue, src/layout/composables/layout.js (licencia MIT).
import { reactive } from 'vue'

const DESKTOP_MIN_WIDTH = 992

const layoutConfig = reactive({
  preset: 'Aura',
  primary: 'orange',
  darkTheme: false,
  menuMode: 'static' as 'static' | 'overlay',
})

const layoutState = reactive({
  staticMenuInactive: false,
  overlayMenuActive: false,
  mobileMenuActive: false,
})

function toggleMenu() {
  if (layoutConfig.menuMode === 'overlay') {
    layoutState.overlayMenuActive = !layoutState.overlayMenuActive
  }
  if (window.innerWidth >= DESKTOP_MIN_WIDTH) {
    layoutState.staticMenuInactive = !layoutState.staticMenuInactive
  } else {
    layoutState.mobileMenuActive = !layoutState.mobileMenuActive
  }
}

function hideMobileMenu() {
  layoutState.overlayMenuActive = false
  layoutState.mobileMenuActive = false
}

export function useLayout() {
  return { layoutConfig, layoutState, toggleMenu, hideMobileMenu }
}
