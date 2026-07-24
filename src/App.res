/** Page shell. A printed catalogue: masthead rule, the featured plates, the
    listing every kind shares, the maker's own record, and back matter.

    The band filter lives here rather than inside the listing because the
    featured plates cite catalogue numbers that a filter could have unmounted;
    citing has to be able to clear it.

    The page is capped at 1440px because a listing that stretches to a 2560px
    display stops reading as a table — the fixed columns stay tiny while name
    and description absorb every surplus pixel.

    Direction contract lives in .impeccable/surfaces/src-app-res.md;
    the visual system it implements is DESIGN.md ("The Parts Catalogue"). */
@react.component
let make = () => {
  let (active, setActive) = React.useState(() => None)
  let onSelect = (band: option<int>) => setActive(_ => band)

  /* pb clears the fixed chat launcher so the colophon is never occluded. */
  <div className="min-h-screen pb-12 pl-7 md:pl-10">
    <div className="mx-auto w-full max-w-[1440px] rule-r">
      <Masthead />
      <main>
        <FeaturedStrip onCite={() => onSelect(None)} />
        <Catalogue active onSelect />
        <Record />
      </main>
      <Colophon />
    </div>
    <ChatWidget />
  </div>
}
