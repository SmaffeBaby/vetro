<script setup lang="ts">
const { data, error } = await useFetch('/api/health')
</script>

<template>
  <main class="shell">
    <p class="eyebrow">VETRO / ОСНОВА ПРОЕКТА</p>
    <h1>Всё начинается<br>с чистой основы.</h1>
    <p class="intro">Nuxt + Supabase. Окружение для нового сайта готово.</p>
    <div class="status" role="status">
      <span class="dot" :class="{ offline: error || !data?.ok }" />
      {{ data?.ok ? 'Приложение и база данных доступны' : 'Нет соединения с базой данных' }}
    </div>
  </main>
</template>
