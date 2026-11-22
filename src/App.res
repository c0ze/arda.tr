/** Page shell (The Index, see DESIGN.md): the bar, the hero with the page's
    only h1, then the works, about and contact. The chat widget floats at the
    bottom and can be opened from the hero.

    The kind filter lives here so any section could reset it; today only the
    works section drives it. */
@react.component
let make = () => {
  let (active, setActive) = React.useState(() => None)
  let onSelect = (band: option<int>) => setActive(_ => band)

  <>
    <Bar />
    <main>
      <Hero />
      <Works active onSelect />
      <About />
    </main>
    <Colophon />
    <ChatWidget />
  </>
}
