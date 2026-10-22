<script setup lang="ts">
import type {ObjectPhoto} from '#shared/types/object-gallery'
import {mediaUrl} from '#shared/utils/media'
const props=defineProps<{photos:ObjectPhoto[];title:string}>()
const open=defineModel<boolean>('open',{default:false}),index=defineModel<number>('index',{default:0})
const dialog=useTemplateRef('dialog'),scale=ref(1),x=ref(0),y=ref(0),rotation=ref(0)
const photo=computed(()=>props.photos[index.value])
let previousOverflow='',lastFocus:HTMLElement|null=null
let drag:{id:number;x:number;y:number;startX:number;startY:number}|null=null
function reset(){scale.value=1;x.value=0;y.value=0;rotation.value=0}
function zoom(delta:number){scale.value=Math.max(1,Math.min(5,Math.round((scale.value+delta)*10)/10));if(scale.value===1){x.value=0;y.value=0}}
function choose(value:number){if(value>=0&&value<props.photos.length){index.value=value;reset()}}
function close(){open.value=false}
function key(event:KeyboardEvent){
 if(event.key==='ArrowLeft'){event.preventDefault();choose(index.value-1)}
 if(event.key==='ArrowRight'){event.preventDefault();choose(index.value+1)}
 if(['+','='].includes(event.key)){event.preventDefault();zoom(.5)}
 if(event.key==='-'){event.preventDefault();zoom(-.5)}
 if(event.key==='0'){event.preventDefault();reset()}
}
function down(event:PointerEvent){if(scale.value<=1)return;event.preventDefault();drag={id:event.pointerId,x:event.clientX,y:event.clientY,startX:x.value,startY:y.value};(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)}
function move(event:PointerEvent){if(!drag||drag.id!==event.pointerId)return;const el=event.currentTarget as HTMLElement;x.value=Math.max(-el.clientWidth*scale.value/2,Math.min(el.clientWidth*scale.value/2,drag.startX+event.clientX-drag.x));y.value=Math.max(-el.clientHeight*scale.value/2,Math.min(el.clientHeight*scale.value/2,drag.startY+event.clientY-drag.y))}
function finish(){drag=null}
function unlock(){document.body.style.overflow=previousOverflow;lastFocus?.focus()}
watch(open,async(value)=>{
 if(value){reset();await nextTick();if(!open.value||!dialog.value)return;previousOverflow=document.body.style.overflow;lastFocus=document.activeElement as HTMLElement;document.body.style.overflow='hidden';dialog.value.showModal()}
 else if(dialog.value?.open){dialog.value.close();unlock()}
})
onBeforeUnmount(()=>{if(dialog.value?.open){dialog.value.close();unlock()}})
</script>
<template>
 <Teleport to="body"><dialog ref="dialog" :aria-label="title" class="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-site-charcoal p-0 text-white backdrop:bg-black/90" @cancel.prevent="close" @close="close" @keydown="key">
  <div class="flex h-full flex-col">
   <div class="flex shrink-0 flex-wrap items-center justify-between gap-2 px-4 py-3 tablet:px-8"><p class="text-sm">{{index+1}} / {{photos.length}}</p><div class="flex items-center gap-1"><button type="button" aria-label="Уменьшить фото" :disabled="scale<=1" class="rounded p-3 disabled:opacity-30" @click="zoom(-.5)"><UIcon name="i-lucide-minus" class="size-5" /></button><button type="button" aria-label="Сбросить масштаб" class="min-w-16 rounded p-2 text-sm" @click="reset">{{Math.round(scale*100)}}%</button><button type="button" aria-label="Увеличить фото" :disabled="scale>=5" class="rounded p-3 disabled:opacity-30" @click="zoom(.5)"><UIcon name="i-lucide-plus" class="size-5" /></button><button type="button" aria-label="Повернуть фото" class="rounded p-3" @click="rotation=(rotation+90)%360"><UIcon name="i-lucide-rotate-cw" class="size-5" /></button><button type="button" autofocus aria-label="Закрыть просмотр" class="rounded p-3" @click="close"><UIcon name="i-lucide-x" class="size-6" /></button></div></div>
   <div class="relative min-h-0 flex-1">
    <div class="flex h-full touch-none items-center justify-center overflow-hidden" :class="scale>1?'cursor-grab active:cursor-grabbing':'cursor-zoom-in'" @wheel.prevent="zoom($event.deltaY<0?.2:-.2)" @dblclick="scale>1?reset():zoom(1)" @pointerdown="down" @pointermove="move" @pointerup="finish" @pointercancel="finish" @lostpointercapture="finish"><img v-if="photo" :src="mediaUrl(photo.imagePath)" :alt="photo.caption||`Фотография ${index+1}`" draggable="false" class="max-h-full max-w-full select-none object-contain" :style="{transform:`translate(${x}px,${y}px) scale(${scale}) rotate(${rotation}deg)`}" /></div>
    <button type="button" aria-label="Предыдущее фото в просмотре" :disabled="index===0" class="absolute left-2 top-1/2 size-10 -translate-y-1/2 rounded-full disabled:opacity-30 tablet:left-5 tablet:size-15" @click="choose(index-1)"><img src="/images/objects/gallery-prev.svg" alt="" class="size-full" /></button><button type="button" aria-label="Следующее фото в просмотре" :disabled="index===photos.length-1" class="absolute right-2 top-1/2 size-10 -translate-y-1/2 rounded-full disabled:opacity-30 tablet:right-5 tablet:size-15" @click="choose(index+1)"><img src="/images/objects/gallery-next.svg" alt="" class="size-full" /></button>
   </div>
   <div class="shrink-0 px-4 pb-4 pt-3 tablet:px-8"><p class="mb-3 text-center text-sm text-white/75">{{photo?.caption}}</p><div class="flex gap-2 overflow-x-auto pb-1" aria-label="Выбор фото в просмотре"><button v-for="(item,i) in photos" :key="item.id" type="button" :aria-label="`Просмотреть фото ${i+1}`" :aria-pressed="index===i" class="w-20 shrink-0 overflow-hidden rounded-lg border-2 tablet:w-28" :class="index===i?'border-site-brand':'border-transparent'" @click="choose(i)"><img :src="mediaUrl(item.imagePath)" :alt="item.caption" class="aspect-[173/90] w-full object-cover" /></button></div></div>
  </div>
 </dialog></Teleport>
</template>
<style scoped>button:focus-visible{outline:2px solid var(--color-site-brand);outline-offset:2px}button:not(:disabled){cursor:pointer}</style>
