<script setup lang="ts">
import { paginationItems } from '#shared/utils/pagination'
const props = withDefaults(defineProps<{ page: number; total: number; pageSize?: number; visibleCount?: number }>(), { pageSize: 7 })
const emit = defineEmits<{ 'update:page': [page: number]; more: [] }>()
const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const showPagination = computed(() => props.total > (props.visibleCount ?? Math.min(props.total, props.pageSize)))
const items = computed(() => paginationItems(props.page, totalPages.value))
</script>

<template>
  <div v-if="showPagination" class="catalog-pagination mx-auto w-full max-w-[480px]">
    <nav aria-label="Постраничная навигация" class="grid items-center gap-[10px]" :style="{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }">
      <template v-for="item in items" :key="item">
        <button v-if="typeof item === 'number'" type="button" :aria-label="`Страница ${item}`" :aria-current="item === page ? 'page' : undefined" class="pagination-page min-h-11 w-full max-w-15 justify-self-center rounded-[10px] border-2 border-site-brand text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-brand" :class="item === page ? 'bg-site-brand text-white' : 'text-black hover:bg-site-brand-tint'" @click="emit('update:page', item)">{{ item }}</button>
        <span v-else class="text-center text-base font-semibold text-black" aria-hidden="true">…</span>
      </template>
    </nav>
    <button v-if="page < totalPages" type="button" class="mt-5 min-h-15 w-full rounded-[10px] border-2 border-site-brand px-4 py-3 text-base font-semibold text-black transition-colors hover:enabled:bg-site-brand-tint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-brand" @click="emit('more')">Загрузить ещё</button>
  </div>
</template>

<style scoped>
.pagination-page { aspect-ratio: 1; }
@media (prefers-reduced-motion: reduce) { .catalog-pagination button { transition: none; } }
</style>
