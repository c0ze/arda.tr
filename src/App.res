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
      <Footer />
    </main>
  </div>
}
