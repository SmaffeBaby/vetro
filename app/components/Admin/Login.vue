<script setup lang="ts">
const { credentials, pending, error, login } = useAdminAuth()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
    <div class="w-full max-w-100">
      <NuxtLink to="/" class="mb-8 flex justify-center" aria-label="На главную"><img src="/images/header/logo.svg" alt="Ветро" width="264" height="48" class="h-auto w-44"></NuxtLink>
      <UCard>
        <div class="mb-7 text-center">
          <div class="mx-auto mb-4 flex size-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600"><UIcon name="i-lucide-lock-keyhole" class="size-5" /></div>
          <h1 class="text-xl font-semibold text-slate-900">Панель управления</h1>
          <p class="mt-2 text-sm text-slate-500">Войдите в учётную запись администратора</p>
        </div>
        <form class="space-y-5" @submit.prevent="login">
          <UFormField label="Email" name="email" required><UInput v-model="credentials.email" name="email" type="email" autocomplete="username" placeholder="you@example.com" size="lg" class="w-full" required /></UFormField>
          <UFormField label="Пароль" name="password" required><UInput v-model="credentials.password" name="password" type="password" autocomplete="current-password" placeholder="Введите пароль" size="lg" class="w-full" required /></UFormField>
          <UAlert v-if="error" color="error" variant="soft" :description="error" role="alert" />
          <UButton type="submit" size="lg" block :loading="pending" label="Войти" />
        </form>
      </UCard>
      <p class="mt-6 text-center text-xs text-slate-400">Vetro · Управление сайтом</p>
    </div>
  </div>
</template>
