<script setup lang="ts">
// Estructura de Sakai adaptada a la pantalla de credenciales, sin navegación lateral.
import { computed } from 'vue'
import { useLayout } from '@/layout/composables/layout'
import AppTopbar from './AppTopbar.vue'

const { layoutConfig, layoutState } = useLayout()

const containerClass = computed(() => ({
  'layout-overlay': layoutConfig.menuMode === 'overlay',
  'layout-static': layoutConfig.menuMode === 'static',
  'layout-overlay-active': layoutState.overlayMenuActive,
  'layout-mobile-active': layoutState.mobileMenuActive,
  'layout-static-inactive': layoutState.staticMenuInactive,
}))
</script>

<template>
  <div class="layout-wrapper credential-layout" :class="containerClass">
    <AppTopbar />
    <div class="layout-main-container">
      <div class="layout-main">
        <RouterView />
      </div>
    </div>
  </div>
</template>
