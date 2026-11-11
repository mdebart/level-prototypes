# Level App Prototypes

Working, coded prototypes of the Level Home app, built from the
[📚 App Component Library](https://www.figma.com/design/6oQpFDicHimuttWqn7CtmG/) and
embeddable on my portfolio.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

## Prototypes

| Prototype | Full page | Embed |
|---|---|---|
| Home · Lock / Unlock | `/#/p/home-lock` | `/#/p/home-lock?embed=1` |

Extra params for `home-lock`: `locked=1`, `state=offline`, `state=jammed`.

## Embed on the portfolio

```html
<iframe
  src="https://<github-user>.github.io/level-prototypes/#/p/home-lock?embed=1"
  title="Level — lock / unlock prototype"
  style="width:100%; aspect-ratio:375/812; max-width:420px; border:0; background:transparent"
  loading="lazy"
  allow="vibrate"></iframe>
```

The screen scales to fit whatever box the iframe gives it.

## Structure

```
src/
  styles/tokens.css       Figma variables → CSS custom properties
  components/             Library components (one per Figma component set)
  prototypes/<slug>/      One folder per feature prototype
  prototypes/registry.ts  Register new prototypes here
public/figma/             Assets exported from Figma (SVG/PNG)
public/fonts/             Suisse Int'l .woff2 (licensed — add your own)
```

## Deploy

Pushing to `main` builds and deploys to GitHub Pages via
`.github/workflows/deploy.yml`. One-time: repo **Settings → Pages → Source: GitHub Actions**.
