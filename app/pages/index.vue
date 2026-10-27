<template>
  <div class="min-h-screen bg-white">
    <Header />
    <main>
      <Hero />
      <Skills />
      <AboutCard />
      <ObjectsPreview />
      <Why />
      <HowWork />
      <div class="home-license-costs mx-auto grid max-w-480 gap-5 px-5 pb-16 tablet:px-8 tablet:pb-24 desktop:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)] desktop:px-[4.95%] desktop:pb-32">
        <License />
        <Costs />
      </div>
      <FAQ />
      <Contacts />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
@media (max-width: 767px) {
  .home-license-costs { gap: 0; padding-inline: 0; padding-bottom: 56px; }
  .home-license-costs :deep(.site-license) { margin-inline: 0; }
}
</style>
