<script setup lang="ts">
const { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, load, save, discard } = useAdminNotFound()
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 py-8 tablet:px-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><h1 class="text-2xl font-semibold">Страница 404</h1><p class="mt-2 text-sm text-slate-500">Страница для несуществующих адресов и удалённых услуг, объектов и пунктов услуг.</p></div>
      <div class="flex flex-wrap gap-2"><UButton to="/404" target="_blank" label="Открыть страницу" icon="i-lucide-external-link" color="neutral" variant="outline" /><UButton label="Отменить" color="neutral" variant="outline" :disabled="saving || !isDirty" @click="discard" /><UButton label="Сохранить" :loading="saving" :disabled="loading || !isDirty" @click="save" /></div>
    </div>
    <USkeleton v-if="loading" class="h-80 w-full" />
    <div v-else class="space-y-6">
      <UAlert v-if="error" color="error" :description="error" role="alert"><template #actions><UButton label="Загрузить заново" :disabled="saving" @click="load" /></template></UAlert>
      <UAlert v-if="notice" color="success" :description="notice" role="status" />
      <form v-if="loaded" @submit.prevent="save"><fieldset :disabled="saving" class="space-y-6">
        <UCard><template #header><h2 class="font-semibold">Заголовок и описание</h2></template><div class="space-y-5">
          <UFormField label="Заголовок"><UTextarea v-model="form.title" :rows="2" maxlength="240" class="w-full" /></UFormField>
          <UFormField label="Поясняющий текст"><UTextarea v-model="form.text" :rows="3" maxlength="4000" class="w-full" /></UFormField>
        </div></UCard>
        <UCard><template #header><h2 class="font-semibold">Кнопки перехода</h2></template><div class="grid gap-5 tablet:grid-cols-2">
          <UFormField label="Название основной кнопки"><UInput v-model="form.primaryLabel" maxlength="80" class="w-full" /></UFormField>
          <UFormField label="Адрес основной кнопки" description="Внутренний адрес сайта, например /"><UInput v-model="form.primaryHref" maxlength="2048" class="w-full" /></UFormField>
          <UFormField label="Название второй кнопки"><UInput v-model="form.secondaryLabel" maxlength="80" class="w-full" /></UFormField>
          <UFormField label="Адрес второй кнопки" description="Внутренний адрес сайта, например /services"><UInput v-model="form.secondaryHref" maxlength="2048" class="w-full" /></UFormField>
        </div></UCard>
        <UCard><template #header><h2 class="font-semibold">Оформление</h2></template><USwitch v-model="form.showLogo" label="Показывать фоновый логотип Ветро" /></UCard>
        <div class="flex flex-wrap items-center justify-between gap-4"><p class="text-xs text-slate-400">Сохранено: {{ updatedLabel }}</p><UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty" /></div>
      </fieldset></form>
      <div v-if="loaded"><h2 class="mb-3 font-semibold">Предпросмотр</h2><div class="overflow-hidden rounded-xl border border-slate-200"><ErrorPage :content="form" class="min-h-[600px]" @navigate="navigateTo($event)" /></div></div>
    </div>
  </div>
</template>
