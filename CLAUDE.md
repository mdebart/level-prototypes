# Working in this repo (for Claude / Cursor)

- Source of truth for visuals: Figma file `6oQpFDicHimuttWqn7CtmG` (📚 App Component Library).
  Pages: Style Guide → Atoms → Molecules → Components → Templates.
- Use tokens from `src/styles/tokens.css` and the `.lv-*` type classes. No hardcoded
  colors or font sizes in components; add a token first if one is missing.
- One React component per Figma component set in `src/components/`, with a doc comment
  naming the Figma page and node id it came from. CSS Modules for styling.
- Figma assets go in `public/figma/` and are referenced via `asset('name.svg')`.
  Never reference temporary figma.com asset URLs at runtime.
- New feature prototype = new folder in `src/prototypes/<slug>/` + an entry in
  `registry.ts`. Prototypes must work at 375×812 and inside an iframe (`?embed=1`).
- Anything invented that is not in the library (e.g. the in-flight ring in
  `LockButton`) gets a comment saying so, so it can be swapped for the real component.
- Run `npm run build` before committing; it type-checks.
