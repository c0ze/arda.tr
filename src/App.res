/** Page shell: the fixed aurora backdrop and sticky navbar above the stacked
    content sections. */
@react.component
let make = () => {
  <div className="relative min-h-screen">
    <AuroraBackground />
    <Navbar />
    <main>
      <Hero />
      <About />
      <Portfolio />
      <MusicProjects />
      <Blog />
      <Footer />
    </main>
    <ChatWidget />
  </div>
}
