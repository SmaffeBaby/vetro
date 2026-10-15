<script setup lang="ts">
const { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, load, save, addField, removeField, moveField, addOption, removeOption, moveOption, discard } = useAdminCosts()
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 py-8 tablet:px-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><div class="mb-2 flex items-center gap-2"><h1 class="text-2xl font-semibold tracking-tight">Стоимость</h1><UBadge v-if="loaded" :color="isDirty ? 'warning' : 'success'" variant="subtle">{{ isDirty ? 'Есть изменения' : 'Опубликована' }}</UBadge></div><p class="text-sm text-slate-500">Списки формы расчёта: названия, варианты выбора и текст кнопки.</p></div>
      <div class="flex gap-2"><UButton label="Отменить" color="neutral" variant="outline" :disabled="loading || saving || !isDirty" @click="discard" /><UButton label="Сохранить" icon="i-lucide-check" :loading="saving" :disabled="loading || !isDirty" @click="save" /></div>
    </div>
    <div v-if="loading" class="space-y-5"><USkeleton class="h-64 w-full" /><USkeleton class="h-80 w-full" /></div>
    <div v-else class="space-y-6">
      <UAlert v-if="error" color="error" variant="soft" :description="error" role="alert"><template #actions><UButton label="Загрузить заново" color="error" variant="outline" size="xs" :disabled="saving" @click="load" /></template></UAlert>
      <UAlert v-if="notice" color="success" variant="soft" :description="notice" role="status" />
      <form v-if="loaded" id="costs-settings" @submit.prevent="save">
        <fieldset :disabled="saving" class="space-y-6">
          <p class="text-sm text-slate-500">{{ form.fields.length }} / 12 списков</p>
          <UCard v-for="(field, index) in form.fields" :key="field.id">
            <template #header><div class="flex flex-wrap items-center justify-between gap-3"><h2 class="font-semibold">Список {{ index + 1 }}</h2><div class="flex gap-1"><UButton icon="i-lucide-arrow-up" :aria-label="`Поднять список ${index + 1}`" color="neutral" variant="ghost" :disabled="index === 0" @click="moveField(index, -1)" /><UButton icon="i-lucide-arrow-down" :aria-label="`Опустить список ${index + 1}`" color="neutral" variant="ghost" :disabled="index === form.fields.length - 1" @click="moveField(index, 1)" /><UButton icon="i-lucide-trash-2" :aria-label="`Удалить список ${index + 1}`" color="error" variant="ghost" :disabled="form.fields.length === 1" @click="removeField(index)" /></div></div></template>
            <div class="space-y-5"><UFormField :label="`Название списка ${index + 1}`"><UInput v-model="field.label" :aria-label="`Название списка ${index + 1}`" maxlength="120" class="w-full" /></UFormField><div class="space-y-3"><p class="text-sm font-medium">Варианты выпадающего списка ({{ field.options.length }} / 50)</p><div v-for="(_, optionIndex) in field.options" :key="optionIndex" class="flex items-center gap-1"><UInput v-model="field.options[optionIndex]" :aria-label="`Список ${index + 1}: вариант ${optionIndex + 1}`" maxlength="160" class="min-w-0 flex-1" /><UButton icon="i-lucide-arrow-up" :aria-label="`Поднять вариант ${optionIndex + 1} списка ${index + 1}`" color="neutral" variant="ghost" :disabled="optionIndex === 0" @click="moveOption(field, optionIndex, -1)" /><UButton icon="i-lucide-arrow-down" :aria-label="`Опустить вариант ${optionIndex + 1} списка ${index + 1}`" color="neutral" variant="ghost" :disabled="optionIndex === field.options.length - 1" @click="moveOption(field, optionIndex, 1)" /><UButton icon="i-lucide-trash-2" :aria-label="`Удалить вариант ${optionIndex + 1} списка ${index + 1}`" color="error" variant="ghost" :disabled="field.options.length === 1" @click="removeOption(field, optionIndex)" /></div><UButton label="Добавить вариант" icon="i-lucide-plus" color="neutral" variant="outline" :disabled="field.options.length >= 50" @click="addOption(field)" /></div></div>
          </UCard>
          <UButton label="Добавить список" icon="i-lucide-plus" color="neutral" variant="outline" :disabled="form.fields.length >= 12" @click="addField" />
          <UCard><template #header><h2 class="font-semibold">Кнопка</h2></template><UFormField label="Текст кнопки"><UInput v-model="form.buttonLabel" aria-label="Текст кнопки стоимости" maxlength="60" class="w-full" /></UFormField></UCard>
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4"><p class="text-xs text-slate-400">Сохранено: {{ updatedLabel }}</p><UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty" /></div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
