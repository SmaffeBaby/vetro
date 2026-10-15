<script setup lang="ts">
const { data: header } = await useHeader()
const emit = defineEmits<{ request: [] }>()
</script>

<template>
  <header class="site-header relative z-20 bg-white">
    <div class="relative mx-auto grid min-h-22 max-w-480 grid-cols-[1fr_auto_auto] items-center gap-x-4 px-5 tablet:min-h-28 tablet:px-8 desktop:min-h-35 desktop:grid-cols-[auto_minmax(0,1fr)_auto] desktop:gap-x-6 desktop:px-[4.95%]">
      <HeaderLogo :svg="header.logoSvg" :path="header.logoPath" />
      <HeaderMenu :items="header.menuItems">
        <HeaderButton :label="header.buttonLabel" @click="emit('request')" />
      </HeaderMenu>
      <div class="order-2 hidden tablet:block desktop:order-3">
        <HeaderButton :label="header.buttonLabel" @click="emit('request')" />
      </div>
    </div>
  </header>
</template>
