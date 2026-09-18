# Design notes

The brief was 'modern, consistent, small amount of animation, aimed at business
owners'. This is what that turned into, and why, so that later changes do not
quietly undo the reasoning.

## Who the site is for

A managing director or operations manager at a UK manufacturer, distributor,
ecommerce business or retailer. They are not technical. They are sceptical,
usually because a previous supplier overpromised. They are trying to work out
whether Coravant is worth thirty minutes of their time.

Every page is written for that reader. If a sentence needs the reader to know
what ABAP, OData or a REST API is, it belongs on a service page or not at all.

## Visual direction

Engineered rather than SaaS. The audience runs warehouses and order books, so
the reference points are technical drawings and precision instruments, not
gradient cards and floating shadows.

That rules out the current house style of AI-generated marketing sites, which
is worth naming so nobody drifts back into it: cream backgrounds with terracotta
accents, identical rounded cards each with the same soft shadow, tracked-out
all-caps eyebrow labels, arrows appended to button text, and a monospace font
used decoratively for small labels.

## Colour

Built out from the existing logo indigo rather than replacing it.

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--brand` | `#272661` | `#9795ec` | Primary actions, links, the diagram |
| `--accent` | `#8a6410` | `#e2b252` | Section marks, rules, icon highlights |
| `--bg` | `#f7f7fb` | `#111129` | Page background |
| `--surface` | `#ffffff` | `#191936` | Panels and cards |
| `--text` | `#17172e` | `#e9e9f5` | Body copy |

Brass is an annotation colour. It marks where something begins: the rule above a
section heading, a tick in a list, the pulse travelling the hero diagram. It is
never body text on a light background, where it does not clear 4.5:1. Buttons are
always indigo, so a coloured button always means 'this does something'.

Every combination is checked by the axe scan in `tests/site.spec.ts`, in both
themes, on every run.

## Type

Two families, doing clearly different jobs.

**Archivo** for headings. A grotesque designed for signage, so it holds up at
large sizes and heavy weights without looking like a default UI font. Set at
`-0.02em` tracking, `text-wrap: balance`.

**IBM Plex Sans** for body. Humanist, with engineering heritage, and distinct
enough from Archivo that the pairing reads as deliberate. Body measure is capped
at 68 characters.

Both are self-hosted through Fontsource. No Google Fonts request, so no GDPR
question about visitor IPs and one less third-party dependency on first paint.

## Motion

One orchestrated moment: the hero diagram draws itself together on load, showing
four disconnected business systems becoming one. It exists to explain
integration to somebody who would switch off if you used the word.

Everything else is response to an action: hover and focus states, the theme
toggle, the mobile menu. There is deliberately **no** fade-and-rise on scroll.
Applied to every section it is the single commonest tell of a generated page, and
it makes a page feel slower rather than richer.

All of it collapses to its end state under `prefers-reduced-motion`.

## Structure

Structural devices carry information rather than decorate.

The brass rule above a heading marks a new idea. Numbers appear only on 'How
working with us goes', because that content genuinely is a sequence. The services
grid shares borders between cells rather than floating separate cards, so it
reads as one table of capabilities, like a spec sheet.

## Copy rules

- Name the problem before naming the service.
- Specifics beat adjectives. 'Six developers' beats 'a dedicated team'.
- Say what you will not do. Telling a reader when not to spend is the most
  credible thing on a consultancy website.
- No exclamation marks, no 'passionate', no 'solutions' as a noun on its own.
- British English throughout.
