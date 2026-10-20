<script setup lang="ts">
const {form,objects,loading,saving,loaded,error,notice,isDirty,updatedLabel,load,save,discard,toggleObject,moveObject,removeObject}=useAdminOtherObjects()
const objectName=(id:string)=>objects.value.find(o=>o.id===id)?.title||id
</script>
<template>
 <div class="mx-auto w-full max-w-5xl space-y-6 px-5 py-8 tablet:px-8">
  <div class="flex flex-wrap items-start justify-between gap-4"><div><h1 class="text-2xl font-semibold">Другие объекты</h1><p class="mt-2 text-sm text-slate-500">Общий блок для детальных страниц объектов. Показывается до трёх карточек перед блоком заявки.</p></div><div class="flex gap-2"><UButton label="Отменить" variant="outline" color="neutral" :disabled="loading||saving||!isDirty" @click="discard"/><UButton label="Сохранить" :loading="saving" :disabled="loading||!isDirty" @click="save"/></div></div>
  <USkeleton v-if="loading" class="h-80"/>
  <UAlert v-if="error" :description="error" color="error"><template #actions><UButton label="Загрузить заново" :disabled="saving" @click="load"/></template></UAlert>
  <UAlert v-if="notice" :description="notice" color="success"/>
  <form v-if="loaded&&!loading" @submit.prevent="save"><fieldset :disabled="saving" class="space-y-6">
   <UCard><div class="space-y-5"><UFormField label="Заголовок"><UTextarea v-model="form.title" :rows="2" maxlength="240" class="w-full"/></UFormField><UFormField label="Текст кнопки" description="Кнопка ведёт на /objects."><UInput v-model="form.buttonLabel" maxlength="80" class="w-full"/></UFormField></div></UCard>
   <UCard><template #header><h2 class="font-semibold">Выбор объектов</h2><p class="mt-2 text-sm leading-relaxed text-slate-500">Если ничего не выбрано, показываются первые три объекта по сортировке каталога. Текущий и скрытые объекты исключаются. Фото, название и пояснение берутся из редактора объекта; при пустом пояснении используется адрес.</p></template><div class="space-y-4"><UCheckbox v-for="object in objects" :key="object.id" :model-value="form.objectIds.includes(object.id)" :label="object.title+(object.published?'':' (скрыт)')" @update:model-value="toggleObject(object.id,$event)"/></div></UCard>
   <UCard v-if="form.objectIds.length"><template #header><h2 class="font-semibold">Порядок карточек</h2><p class="mt-1 text-sm text-slate-500">Показываются первые три доступных объекта из этого списка.</p></template><ol class="space-y-3"><li v-for="(id,index) in form.objectIds" :key="id" class="flex items-center justify-between gap-3"><span class="text-sm">{{index+1}}. {{objectName(id)}}</span><div class="flex shrink-0"><UButton icon="i-lucide-arrow-up" :aria-label="`Поднять объект ${index+1}`" variant="ghost" color="neutral" :disabled="index===0" @click="moveObject(index,-1)"/><UButton icon="i-lucide-arrow-down" :aria-label="`Опустить объект ${index+1}`" variant="ghost" color="neutral" :disabled="index===form.objectIds.length-1" @click="moveObject(index,1)"/><UButton icon="i-lucide-trash-2" :aria-label="`Убрать объект ${index+1}`" variant="ghost" color="error" @click="removeObject(id)"/></div></li></ol></UCard>
   <div class="flex flex-wrap items-center justify-between gap-4"><p class="text-xs text-slate-400">Сохранено: {{updatedLabel}}</p><UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty"/></div>
  </fieldset></form>
 </div>
</template>
