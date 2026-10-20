<script setup lang="ts">
const {form,options,selectedId,previewHref,loading,saving,loaded,error,notice,isDirty,load,save,discard,selectObject,addCard,removeCard,moveCard}=useAdminObjectResults()
</script>
<template>
 <div class="mx-auto w-full max-w-5xl space-y-6 px-5 py-8 tablet:px-8">
  <div class="flex flex-wrap items-start justify-between gap-4"><div><h1 class="text-2xl font-semibold">Результаты</h1><p class="mt-2 text-sm text-slate-500">Показатели сохраняются отдельно для каждого объекта. Пустой блок скрывается вместе с разделителями.</p></div><div class="flex gap-2"><UButton label="Отменить" variant="outline" color="neutral" :disabled="loading||saving||!isDirty" @click="discard"/><UButton label="Сохранить" :loading="saving" :disabled="loading||!isDirty" @click="save"/></div></div>
  <div class="flex flex-wrap items-end gap-3"><UFormField label="Объект" class="min-w-0 flex-1"><USelect :model-value="selectedId" :items="options" :disabled="saving||loading||!options.length" aria-label="Выбрать объект для результатов" class="w-full" @update:model-value="selectObject($event)"/></UFormField><UButton :to="previewHref" target="_blank" label="Открыть объект" variant="outline" color="neutral"/></div>
  <USkeleton v-if="loading" class="h-80"/>
  <UAlert v-if="error" :description="error" color="error"><template #actions><UButton label="Загрузить заново" :disabled="saving" @click="load"/></template></UAlert>
  <UAlert v-if="notice" :description="notice" color="success"/>
  <p v-if="!loading&&!error&&!options.length" class="text-sm text-slate-500">Сначала добавьте объект в разделе «Детальная страница объекта».</p>
  <form v-if="loaded&&!loading" @submit.prevent="save"><fieldset :disabled="saving" class="space-y-6">
   <UCard><UFormField label="Заголовок блока"><UTextarea v-model="form.title" :rows="2" maxlength="240" class="w-full"/></UFormField></UCard>
   <p class="text-sm text-slate-500">{{form.cards.length}} / 16 показателей</p>
   <UCard v-for="(card,index) in form.cards" :key="card.id"><template #header><div class="flex items-center justify-between gap-4"><h2 class="font-semibold">Показатель {{index+1}}</h2><div class="flex"><UButton icon="i-lucide-arrow-up" :aria-label="`Поднять показатель ${index+1}`" variant="ghost" color="neutral" :disabled="index===0" @click="moveCard(index,-1)"/><UButton icon="i-lucide-arrow-down" :aria-label="`Опустить показатель ${index+1}`" variant="ghost" color="neutral" :disabled="index===form.cards.length-1" @click="moveCard(index,1)"/><UButton icon="i-lucide-trash-2" :aria-label="`Удалить показатель ${index+1}`" variant="ghost" color="error" @click="removeCard(index)"/></div></div></template><div class="space-y-5"><UFormField :label="`Значение показателя ${index+1}`" description="Например: 0, 100%, 24/7 или < 2 ч."><UInput v-model="card.value" maxlength="100" class="w-full"/></UFormField><UFormField :label="`Пояснение показателя ${index+1}`"><UTextarea v-model="card.text" :rows="2" maxlength="1000" class="w-full"/></UFormField></div></UCard>
   <UButton label="Добавить показатель" icon="i-lucide-plus" variant="outline" :disabled="form.cards.length>=16" @click="addCard"/>
   <div><UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty"/></div>
  </fieldset></form>
 </div>
</template>
