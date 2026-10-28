<script setup lang="ts">
import type {ObjectGallerySettings} from '#shared/types/object-gallery'
import {mediaUrl} from '#shared/utils/media'
const props=defineProps<{objectId:string}>()
const {data:gallery}=await useSiteQuery<ObjectGallerySettings>(()=>`/api/object-gallery/${encodeURIComponent(props.objectId)}`,{})
const carousel=useTemplateRef('carousel'),selected=ref(0),viewerOpen=ref(false),viewerIndex=ref(0)
function select(index:number){selected.value=index}
function choose(index:number){carousel.value?.emblaApi?.scrollTo(index);selected.value=index}
function open(index:number){viewerIndex.value=index;viewerOpen.value=true}
</script>
<template>
 <section v-if="gallery?.photos.length" class="object-gallery" aria-label="Фотографии с объекта">
  <h2 class="text-3xl font-bold leading-tight tablet:text-4xl desktop:text-[56px]">{{gallery.title}}</h2>
  <div class="relative mt-8 tablet:mt-12">
   <UCarousel ref="carousel" :items="gallery.photos" :ui="{viewport:'overflow-hidden rounded-[24px] tablet:rounded-[32px]',container:'ms-0',item:'basis-full ps-0'}" @select="select">
    <template #default="{item,index}"><button type="button" class="block w-full cursor-zoom-in" :aria-label="`Открыть фото ${index+1}: ${item.caption||item.filename}`" @click="open(index)"><img :src="mediaUrl(item.imagePath)" :alt="item.caption||`Фотография объекта ${index+1}`" width="1730" height="900" :loading="index?'lazy':'eager'" draggable="false" class="aspect-[173/90] w-full object-cover" /></button></template>
   </UCarousel>
   <button v-if="gallery.photos.length>1" type="button" aria-label="Предыдущее фото" :disabled="selected===0" class="object-gallery-arrow absolute left-3 top-1/2 size-10 -translate-y-1/2 rounded-full disabled:opacity-40 tablet:left-12 tablet:size-15" @click="carousel?.emblaApi?.scrollPrev()"><img src="/images/objects/gallery-prev.svg" alt="" class="size-full" /></button>
   <button v-if="gallery.photos.length>1" type="button" aria-label="Следующее фото" :disabled="selected===gallery.photos.length-1" class="object-gallery-arrow absolute right-3 top-1/2 size-10 -translate-y-1/2 rounded-full disabled:opacity-40 tablet:right-12 tablet:size-15" @click="carousel?.emblaApi?.scrollNext()"><img src="/images/objects/gallery-next.svg" alt="" class="size-full" /></button>
  </div>
  <div class="object-gallery-thumbnails mt-5 flex gap-2 overflow-x-auto pb-2 tablet:mt-8" aria-label="Миниатюры фотографий"><button v-for="(photo,index) in gallery.photos" :key="photo.id" type="button" :aria-label="`Выбрать фото ${index+1}`" :aria-pressed="selected===index" class="w-22 shrink-0 overflow-hidden rounded-lg border-2 tablet:w-32" :class="selected===index?'border-site-brand':'border-transparent'" @click="choose(index)"><img :src="mediaUrl(photo.imagePath)" :alt="photo.caption" width="128" height="68" loading="lazy" class="aspect-[173/90] w-full object-cover" /></button></div>
  <ObjectsGalleryViewer v-model:open="viewerOpen" v-model:index="viewerIndex" :photos="gallery.photos" :title="gallery.title" />
 </section>
</template>
