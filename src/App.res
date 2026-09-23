/** Page shell (One Bit Forest, see DESIGN.md): the forest hero with the status
    bar and the page's only h1, then the works, the record, and contact. The
    chat widget floats bottom-left and can be opened from the hero's `ask`.

    The kind filter lives here so any section could reset it; today only the
    works section drives it. */
@react.component
let make = () => {
  let (active, setActive) = React.useState(() => None)
  let onSelect = (band: option<int>) => setActive(_ => band)

  <>
    <Hero />
    <main>
      <Works active onSelect />
      <Record />
    </main>
    <Colophon />
    <ChatWidget />
  </>
}
