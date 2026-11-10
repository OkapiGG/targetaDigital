<script setup lang="ts">
import { useLayout } from '@/layout/composables/layout'

const { toggleMenu } = useLayout()
</script>

<template>
  <header class="layout-topbar site-header">
    <div class="layout-topbar-logo-container">
      <button
        type="button"
        class="layout-menu-button layout-topbar-action"
        aria-label="Mostrar u ocultar el menú"
        @click="toggleMenu"
      >
        <i class="pi pi-bars"></i>
      </button>
      <RouterLink class="brand" :to="{ name: 'credential' }" aria-label="Rhinacred, inicio">
        <span class="brand-mark">R</span>
        <span class="brand-name">RHINA<span>CRED</span></span>
      </RouterLink>
    </div>
  </header>
</template>
