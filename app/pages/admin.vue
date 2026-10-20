<script setup lang="ts">
const { identity, checking, logout, section, sectionTitle, navigation } = useAdminPage()
</script>

<template>
  <div v-if="checking" class="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-400" role="status">Проверяем доступ…</div>
  <AdminLogin v-else-if="!identity" />
  <UDashboardGroup v-else>
    <UDashboardSidebar id="vetro-admin" collapsible class="bg-slate-50/70" :ui="{ footer: 'border-t border-default' }">
      <template #header="{ collapsed }"><NuxtLink to="/admin" class="flex items-center gap-2 px-1 py-3 font-semibold tracking-tight text-slate-900"><span class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sky-500 text-sm text-white">V</span><span v-if="!collapsed">Vetro <span class="font-normal text-slate-400">/ admin</span></span></NuxtLink></template>
      <template #default="{ collapsed }"><p v-if="!collapsed" class="mb-2 mt-4 px-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">Управление сайтом</p><UNavigationMenu :collapsed="collapsed" :items="navigation" orientation="vertical" tooltip /></template>
      <template #footer="{ collapsed }"><div class="w-full space-y-2 py-2"><p v-if="!collapsed" class="truncate px-2 text-xs text-slate-500">{{ identity.email }}</p><UButton :label="collapsed ? undefined : 'Выйти'" icon="i-lucide-log-out" aria-label="Выйти" color="neutral" variant="ghost" block @click="logout" /></div></template>
    </UDashboardSidebar>
    <UDashboardPanel :id="section">
      <template #header><UDashboardNavbar :title="sectionTitle"><template #leading><UDashboardSidebarCollapse /></template><template #right><UButton :to="section.startsWith('objects') ? '/objects' : section.startsWith('services') ? '/services' : '/'" target="_blank" icon="i-lucide-external-link" label="Открыть сайт" color="neutral" variant="outline" size="sm" /></template></UDashboardNavbar></template>
      <template #body><AdminObjectResultsEditor v-if="section === 'objects-results'" /><AdminOtherObjectsEditor v-else-if="section === 'objects-other'" /><AdminServicesHelpCardEditor v-else-if="section === 'objects-request-card'" kind="objects-detail" /><AdminServicesHelpCardEditor v-else-if="section === 'objects-next-object'" kind="objects" /><AdminObjectsEditor v-else-if="section === 'objects'" /><AdminObjectDetailEditor v-else-if="section === 'objects-detail'" /><AdminServicesTeamEditor v-else-if="section === 'services-team'" /><AdminServicesWhyUsEditor v-else-if="section === 'services-why-us'" /><AdminServicePricesEditor v-else-if="section === 'services-prices'" /><AdminServiceRequestEditor v-else-if="section === 'services-request'" /><AdminServicesDetailEditor v-else-if="section === 'services-detail'" /><AdminServicesHelpCardEditor v-else-if="section === 'services-help-card'" /><AdminServicesEditor v-else-if="section === 'services'" /><AdminWhyEditor v-else-if="section === 'why'" /><AdminHowWorkEditor v-else-if="section === 'how-work'" /><AdminLicenseEditor v-else-if="section === 'license'" /><AdminCostsEditor v-else-if="section === 'costs'" /><AdminFaqEditor v-else-if="section === 'faq'" /><AdminContactsEditor v-else-if="section === 'contacts'" /><AdminFooterEditor v-else-if="section === 'footer'" /><AdminAboutCardEditor v-else-if="section === 'about-card'" /><AdminSkillsEditor v-else-if="section === 'skills'" /><AdminHeroEditor v-else-if="section === 'hero'" /><AdminHeaderEditor v-else /></template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
