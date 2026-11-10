<script setup lang="ts">
// Menú lateral con la estructura de clases de Sakai (layout-menu).
import { useLayout } from '@/layout/composables/layout'

const { hideMobileMenu } = useLayout()

const items = [
  { label: 'Tarjeta digital', icon: 'pi pi-id-card', to: { name: 'credential' } },
  { label: 'Punto de venta', icon: 'pi pi-shopping-cart', to: { name: 'pos' } },
]
</script>

<template>
  <ul class="layout-menu">
    <li class="layout-root-menuitem">
      <div class="layout-menuitem-root-text">Aplicaciones</div>
      <ul>
        <li v-for="item in items" :key="item.label">
          <RouterLink :to="item.to" exact-active-class="active-route" @click="hideMobileMenu">
            <i class="layout-menuitem-icon" :class="item.icon"></i>
            <span class="layout-menuitem-text">{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>
    </li>
  </ul>
</template>
