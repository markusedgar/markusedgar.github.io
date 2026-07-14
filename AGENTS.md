# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Project-specific design contract

- Visual sources of truth: `../style-bible/assets/home-light.png` and `../style-bible/assets/home-dark.png`.
- Full art direction and content contract: `../style-bible/STYLE-BIBLE.md`.
- Quality gate: an independent fresh-context reviewer must score at least 90/100 overall, every category at least 8/10, with no critical or must-fix findings.
- The builder never grades itself. Record independent reviews under `../style-bible/reviews/`.
- The site must be an authored, responsive exhibition/workbench rather than a template portfolio. No hero-plus-three-cards, stock gradients, rounded card grid, fake terminal, or generic AI imagery.
- Light and dark modes are equal. Motion carries sequence or state; it is never ambient decoration.
- Use canonical content codes from one registry. Never reproduce the provisional `WK-03`, `FN-07`, or `FIELD TEST 04` labels from the visual reference.
- Target a portable static production build. GitHub Pages is the primary release target; Render Static Sites remains compatible.
