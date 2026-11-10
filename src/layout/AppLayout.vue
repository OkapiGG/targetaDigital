<script setup lang="ts">
// Estructura de Sakai con menú lateral para la tarjeta digital y el punto de venta.
import { computed } from 'vue'
import { useLayout } from '@/layout/composables/layout'
import AppMenu from './AppMenu.vue'
import AppTopbar from './AppTopbar.vue'

const { layoutConfig, layoutState, hideMobileMenu } = useLayout()

const containerClass = computed(() => ({
  'layout-overlay': layoutConfig.menuMode === 'overlay',
  'layout-static': layoutConfig.menuMode === 'static',
  'layout-overlay-active': layoutState.overlayMenuActive,
  'layout-mobile-active': layoutState.mobileMenuActive,
  'layout-static-inactive': layoutState.staticMenuInactive,
}))
</script>

<template>
  <div class="layout-wrapper app-layout" :class="containerClass">
    <AppTopbar />
    <div class="layout-sidebar">
      <AppMenu />
    </div>
    <div class="layout-main-container">
      <div class="layout-main">
        <RouterView />
      </div>
    </div>
    <div class="layout-mask" @click="hideMobileMenu"></div>
  </div>
</template>
