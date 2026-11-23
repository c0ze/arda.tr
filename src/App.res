/** Page shell (Kara Duman, see DESIGN.md): the bar; the name and the works
    beside the plume of smoke; about; contact. The chat widget floats at the
    bottom and opens from the contact section.

    The plume is the right 45% of the first screen and sits behind nothing.
    On narrow screens it is a band between the bar and the name. */
@react.component
let make = () =>
  <>
    <Bar />
    <main>
      <div className="ix-wrap land">
        <div className="land__plume ix-smoke">
          // data-smoke-video names the film brand/smoke.js plays over the image.
          {React.cloneElement(
            <img
              className="ix-art ix-art--drift"
              src="/art/plume.webp"
              alt=HeroContent.plumeAlt
              width="1280"
              height="1960"
            />,
            {"data-smoke-video": "/art/plume-smoke.mp4", "data-smoke-media": "(min-width: 60rem)"},
          )}
          <Embers />
        </div>
        <div className="land__words">
          <Hero />
          <Works />
        </div>
      </div>
      <About />
    </main>
    <Colophon />
    <ChatWidget />
  </>
