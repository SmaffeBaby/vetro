<script setup lang="ts">
const {form,options,categoryOptions,previewHref,loading,saving,loaded,error,notice,isDirty,imagePreview,load,save,discard,selectObject,createObject,selectImage,removeImage}=useAdminObject()
const {data:services,error:servicesError,refresh:reloadServices}=await useServices()
function setSinceYear(value:unknown){form.sinceYear=value===''||value==null?null:Number(value)}
function toggleService(id:string,checked:boolean|'indeterminate'){if(saving.value)return;if(checked===true&&!form.serviceIds.includes(id))form.serviceIds.push(id);else if(checked===false)form.serviceIds=form.serviceIds.filter(i=>i!==id)}
</script>
<template>
 <div class="mx-auto w-full max-w-5xl space-y-6 px-5 py-8 tablet:px-8">
  <div class="flex flex-wrap items-start justify-between gap-4"><div><h1 class="text-2xl font-semibold">Детальная страница объекта</h1><p class="mt-2 text-sm text-slate-500">Эти же название, адрес и фото отображаются в каталоге.</p></div><div class="flex gap-2"><UButton label="Отменить" variant="outline" color="neutral" :disabled="loading||saving||!isDirty" @click="discard"/><UButton label="Сохранить" :loading="saving" :disabled="loading||!isDirty||!!servicesError" @click="save"/></div></div>
  <div class="flex flex-wrap items-end gap-3"><UFormField label="Объект" class="min-w-0 flex-1"><USelect :model-value="form.revision?form.id:undefined" :items="options" placeholder="Новый объект" :disabled="saving||loading" class="w-full" @update:model-value="selectObject($event)"/></UFormField><UButton label="Добавить объект" icon="i-lucide-plus" :disabled="saving||loading" @click="createObject"/><UButton v-if="form.revision&&form.published" :to="previewHref" target="_blank" label="Открыть объект" color="neutral" variant="outline"/></div>
  <USkeleton v-if="loading" class="h-80"/>
  <UAlert v-if="error" :description="error" color="error"><template #actions><UButton label="Загрузить заново" :disabled="saving" @click="load"/></template></UAlert>
  <UAlert v-if="notice" :description="notice" color="success"/>
  <UAlert v-if="servicesError" description="Не удалось загрузить услуги. Сохранение недоступно до загрузки списка." color="error"><template #actions><UButton label="Повторить" @click="reloadServices()"/></template></UAlert>
  <form v-if="loaded&&!loading" @submit.prevent="!servicesError&&save()"><fieldset :disabled="saving" class="space-y-6">
   <UCard><template #header><h2 class="font-semibold">Каталог и публикация</h2></template><div class="space-y-5">
    <UFormField label="ID / адрес страницы" description="Латинские буквы, цифры и дефисы. После первого сохранения не меняется."><UInput v-model="form.id" :disabled="form.revision>0" maxlength="80" class="w-full"/></UFormField>
    <UFormField label="Название / заголовок"><UTextarea v-model="form.title" :rows="2" maxlength="240" class="w-full"/></UFormField>
    <UFormField label="Адрес"><UTextarea v-model="form.address" :rows="2" maxlength="500" class="w-full"/></UFormField>
    <div class="grid gap-5 tablet:grid-cols-2"><UFormField label="Категория"><USelect v-model="form.categoryId" :items="categoryOptions" class="w-full"/></UFormField><UFormField label="Сортировка"><UInput v-model.number="form.sortOrder" type="number" min="0" max="999999" class="w-full"/></UFormField></div>
    <UCheckbox v-model="form.published" label="Опубликовать объект" description="Скрытые объекты доступны только в админке."/>
   </div></UCard>
   <UCard><template #header><h2 class="font-semibold">Текст и свойства</h2></template><div class="space-y-5">
    <UFormField label="Пояснение"><UTextarea v-model="form.subtitle" :rows="2" maxlength="1000" class="w-full"/></UFormField>
    <UFormField label="Описание" description="Переносы строк и абзацы сохраняются."><UTextarea v-model="form.description" :rows="8" maxlength="12000" class="w-full"/></UFormField>
    <div class="grid gap-5 tablet:grid-cols-2"><UFormField label="Площадь" description="Например, 42 000 м². Пустое поле скрывается."><UInput v-model="form.area" maxlength="100" class="w-full"/></UFormField><UFormField label="Год начала обслуживания" description="Необязательное поле."><UInput :model-value="form.sinceYear??undefined" type="number" min="1900" max="2100" class="w-full" @update:model-value="setSinceYear"/></UFormField></div>
   </div></UCard>
   <UCard><template #header><h2 class="font-semibold">Услуги на объекте</h2><p class="mt-1 text-sm text-slate-500">Количество в свойствах рассчитывается автоматически. Ссылки ведут на выбранные услуги.</p></template><div class="space-y-4"><UCheckbox v-for="service in services.cards" :key="service.id" :model-value="form.serviceIds.includes(service.id)" :label="service.title" @update:model-value="toggleService(service.id,$event)"/></div></UCard>
   <UCard><template #header><h2 class="font-semibold">Фото PNG</h2><p class="mt-1 text-sm text-slate-500">Media / Objects / Photos. Замена и удаление применяются при сохранении.</p></template><img v-if="imagePreview" :src="imagePreview" alt="Предпросмотр объекта" class="mb-5 max-h-80 rounded-2xl object-contain"/><div class="flex flex-wrap items-center gap-3"><input type="file" accept="image/png,.png" aria-label="Загрузить фото объекта" class="max-w-full text-sm" @change="selectImage"/><UButton label="Удалить фото" color="error" variant="outline" :disabled="!imagePreview" @click="removeImage"/></div></UCard>
   <UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty||!!servicesError"/>
  </fieldset></form>
 </div>
</template>
