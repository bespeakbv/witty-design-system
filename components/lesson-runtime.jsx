// lesson-runtime.jsx
// Destructureert alle bouwblok-componenten van window en exposeert
// window.renderLesson(lesson) — een helper die een LESSON-array
// ([{kind, props}]) in #root rendert.
//
// Laadt ná alle component-scripts, vóór de inline <script type="text/babel">
// waar LESSON gedefinieerd wordt.

const {
  TekstBouwblok, Quote, ExternalLink, MediaCarousel, Chat, Hotspot, Stepper,
  VraagTekst, VraagAfbeeldingen, VraagPoll, VraagStelling, VraagVolgorde, VraagConnect,
} = window;

const KIND = {
  tekst: TekstBouwblok,
  quote: Quote,
  "external-link": ExternalLink,
  "media-carousel": MediaCarousel,
  chat: Chat,
  hotspot: Hotspot,
  stepper: Stepper,
  "vraag-tekst": VraagTekst,
  "vraag-afb": VraagAfbeeldingen,
  poll: VraagPoll,
  stelling: VraagStelling,
  volgorde: VraagVolgorde,
  connect: VraagConnect,
};

function Lesson({ lesson }) {
  return (
    <>
      {lesson.map((b, i) => {
        const Comp = KIND[b.kind];
        if (!Comp) {
          console.warn(`[witty-lessons] onbekend kind "${b.kind}" — blok ${i} overgeslagen`);
          return null;
        }
        return React.createElement(Comp, { key: i, ...b.props });
      })}
    </>
  );
}

window.renderLesson = function renderLesson(lesson) {
  ReactDOM.createRoot(document.getElementById("root")).render(<Lesson lesson={lesson} />);
};
