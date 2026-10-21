<script setup lang="ts">
const { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, load, save, addCard, removeCard, moveCard, discard } = useAdminAboutLetters()
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 py-8 tablet:px-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><div class="mb-2 flex items-center gap-2"><h1 class="text-2xl font-semibold tracking-tight">Благодарственные письма</h1><UBadge v-if="loaded" :color="isDirty ? 'warning' : 'success'" variant="subtle">{{ isDirty ? 'Есть изменения' : 'Опубликована' }}</UBadge></div><p class="text-sm text-slate-500">Письма на странице «О компании». Все поля карточек и порядок их отображения редактируются здесь.</p></div>
      <div class="flex gap-2"><UButton label="Отменить" color="neutral" variant="outline" :disabled="loading || saving || !isDirty" @click="discard" /><UButton label="Сохранить" icon="i-lucide-check" :loading="saving" :disabled="loading || !isDirty" @click="save" /></div>
    </div>
    <div v-if="loading" class="space-y-5"><USkeleton class="h-64 w-full" /><USkeleton class="h-64 w-full" /></div>
    <div v-else class="space-y-6">
      <UAlert v-if="error" color="error" variant="soft" :description="error" role="alert"><template #actions><UButton label="Загрузить заново" color="error" variant="outline" size="xs" :disabled="saving" @click="load" /></template></UAlert>
      <UAlert v-if="notice" color="success" variant="soft" :description="notice" role="status" />
      <form v-if="loaded" id="about-letters-settings" @submit.prevent="save">
        <fieldset :disabled="saving" class="space-y-6">
          <UCard><UFormField label="Заголовок блока"><UTextarea v-model="form.title" :rows="2" maxlength="240" class="w-full" /></UFormField></UCard>
          <p class="text-sm text-slate-500">{{ form.cards.length }} / 50 писем</p>
          <UCard v-for="(card, index) in form.cards" :key="card.id">
            <template #header><div class="flex flex-wrap items-center justify-between gap-3"><h2 class="font-semibold">Письмо {{ index + 1 }}</h2><div class="flex gap-1"><UButton icon="i-lucide-arrow-up" :aria-label="`Поднять карточку ${index + 1}`" color="neutral" variant="ghost" :disabled="index === 0" @click="moveCard(index, -1)" /><UButton icon="i-lucide-arrow-down" :aria-label="`Опустить карточку ${index + 1}`" color="neutral" variant="ghost" :disabled="index === form.cards.length - 1" @click="moveCard(index, 1)" /><UButton icon="i-lucide-trash-2" :aria-label="`Удалить карточку ${index + 1}`" color="error" variant="ghost" @click="removeCard(index)" /></div></div></template>
            <div class="space-y-5">
              <UFormField label="Организация"><UInput v-model="card.organization" maxlength="240" class="w-full" /></UFormField>
              <UFormField label="Название или номер письма"><UInput v-model="card.reference" maxlength="240" class="w-full" /></UFormField>
              <UFormField label="Метка услуги"><UInput v-model="card.tag" maxlength="120" class="w-full" /></UFormField>
              <UFormField label="Текст письма"><UTextarea v-model="card.text" maxlength="6000" :rows="5" class="w-full" /></UFormField>
              <UFormField label="Имя автора"><UInput v-model="card.author" maxlength="240" class="w-full" /></UFormField>
              <UFormField label="Должность автора"><UInput v-model="card.position" maxlength="240" class="w-full" /></UFormField>
            </div>
          </UCard>
          <p v-if="!form.cards.length" class="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">Писем пока нет. Пустой блок не отображается на сайте.</p>
          <UButton label="Добавить письмо" icon="i-lucide-plus" color="neutral" variant="outline" :disabled="form.cards.length >= 50" @click="addCard" />
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4"><p class="text-xs text-slate-400">Сохранено: {{ updatedLabel }}</p><UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty" /></div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
