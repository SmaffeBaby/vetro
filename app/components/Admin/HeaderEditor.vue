<script setup lang="ts">
const { form, loading, saving, error, notice, isDirty, logoPreview, updatedLabel, save, load, discard, addItem, removeItem, moveItem, uploadLogo } = useAdminHeader()
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 py-8 tablet:px-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><div class="mb-2 flex items-center gap-2"><h1 class="text-2xl font-semibold tracking-tight text-slate-900">Хедер</h1><UBadge :color="isDirty && !loading ? 'warning' : 'success'" variant="subtle" size="sm">{{ isDirty && !loading ? 'Есть изменения' : 'Опубликован' }}</UBadge></div><p class="text-sm text-slate-500">Логотип, навигация и кнопка в верхней части сайта.</p></div>
      <div class="flex gap-2"><UButton label="Отменить" color="neutral" variant="outline" :disabled="loading || saving || !isDirty" @click="discard" /><UButton icon="i-lucide-check" label="Сохранить" :loading="saving" :disabled="loading || !isDirty" @click="save" /></div>
    </div>
    <div v-if="loading" class="space-y-5"><USkeleton class="h-52 w-full" /><USkeleton class="h-80 w-full" /></div>
    <div v-else class="space-y-6">
      <UAlert v-if="error" color="error" variant="soft" :description="error" role="alert"><template #actions><UButton label="Загрузить заново" color="error" variant="outline" size="xs" @click="load" /></template></UAlert>
      <UAlert v-if="notice" color="success" variant="soft" :description="notice" role="status" />
      <form id="header-settings" class="space-y-6" @submit.prevent="save">
        <UCard>
          <template #header><div class="flex items-start gap-3"><div class="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500"><UIcon name="i-lucide-image" class="size-5" /></div><div><h2 class="font-semibold">Логотип</h2><p class="mt-1 text-sm text-slate-500">SVG сохранится в настройках сайта.</p></div></div></template>
          <div class="grid gap-6 tablet:grid-cols-[1fr_240px]">
            <div class="space-y-4">
              <UFormField label="SVG-код логотипа" description="Самостоятельный SVG до 200 КБ, без скриптов и внешних ресурсов."><UTextarea v-model="form.logoSvg" name="logoSvg" aria-label="SVG-код логотипа" :rows="7" class="w-full font-mono" :ui="{ base: 'font-mono text-xs' }" /></UFormField>
              <label class="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"><UIcon name="i-lucide-upload" class="size-4" />Загрузить SVG<input type="file" accept="image/svg+xml,.svg" class="sr-only" @change="uploadLogo"></label>
            </div>
            <div><p class="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">Предпросмотр</p><div class="flex min-h-36 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6"><img :src="logoPreview" alt="Предпросмотр логотипа" class="max-h-24 max-w-full"></div><p class="mt-3 text-xs leading-5 text-slate-400">Пропорции оригинального логотипа сохраняются.</p></div>
          </div>
        </UCard>
        <UCard>
          <template #header><div class="flex items-start justify-between gap-4"><div class="flex gap-3"><div class="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500"><UIcon name="i-lucide-list" class="size-5" /></div><div><h2 class="font-semibold">Пункты меню</h2><p class="mt-1 text-sm text-slate-500">Названия, ссылки и порядок отображения.</p></div></div><UBadge color="neutral" variant="subtle">{{ form.menuItems.length }} / 12</UBadge></div></template>
          <div class="space-y-4">
            <div v-if="!form.menuItems.length" class="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">В меню пока нет пунктов.</div>
            <div v-for="(item, index) in form.menuItems" :key="item.id" class="flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <div class="flex size-8 shrink-0 items-center justify-center self-center rounded-md bg-white text-xs font-medium text-slate-400 ring-1 ring-slate-200">{{ index + 1 }}</div>
              <UFormField :label="`Название пункта ${index + 1}`" class="min-w-40 flex-1"><UInput v-model="item.label" :name="`menu-label-${index}`" :aria-label="`Название пункта ${index + 1}`" placeholder="Например, О компании" maxlength="80" class="w-full" /></UFormField>
              <UFormField :label="`Ссылка пункта ${index + 1}`" class="min-w-40 flex-1"><UInput v-model="item.href" :name="`menu-href-${index}`" :aria-label="`Ссылка пункта ${index + 1}`" placeholder="/#about или /about" class="w-full" /></UFormField>
              <div class="flex gap-1 pb-0.5"><UButton icon="i-lucide-arrow-up" color="neutral" variant="ghost" :aria-label="`Поднять пункт ${index + 1}`" :disabled="index === 0" @click="moveItem(index, -1)" /><UButton icon="i-lucide-arrow-down" color="neutral" variant="ghost" :aria-label="`Опустить пункт ${index + 1}`" :disabled="index === form.menuItems.length - 1" @click="moveItem(index, 1)" /><UButton icon="i-lucide-trash-2" color="error" variant="ghost" :aria-label="`Удалить пункт ${index + 1}`" @click="removeItem(index)" /></div>
            </div>
            <UButton icon="i-lucide-plus" label="Добавить пункт" color="neutral" variant="outline" :disabled="form.menuItems.length >= 12" @click="addItem" />
          </div>
        </UCard>
        <UCard>
          <template #header><div class="flex gap-3"><div class="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500"><UIcon name="i-lucide-mouse-pointer-2" class="size-5" /></div><div><h2 class="font-semibold">Кнопка заявки</h2><p class="mt-1 text-sm text-slate-500">Текст кнопки в правой части хедера.</p></div></div></template>
          <UFormField label="Название кнопки" description="До 60 символов."><UInput v-model="form.buttonLabel" name="buttonLabel" aria-label="Название кнопки" maxlength="60" class="w-full max-w-96" /></UFormField>
        </UCard>
      </form>
      <div class="flex flex-wrap items-center justify-between gap-4 pb-4"><p class="text-xs text-slate-400">Последнее сохранение: {{ updatedLabel }}</p><UButton form="header-settings" type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty" /></div>
    </div>
  </div>
</template>
