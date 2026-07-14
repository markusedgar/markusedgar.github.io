# Design QA — final

## Comparison target

- Source visual truth: `../style-bible/assets/home-light.png` and `../style-bible/assets/home-dark.png`
- Rendered implementation: `qa/evidence/home-light-1487.png`, `qa/evidence/dark-1487-hero-viewport.png`, the responsive captures listed in `qa/EVIDENCE.md`, and the browser-rendered Iteration 05 interaction capture
- Viewport: 1487 × 1058 for the source/home comparison; 768 × 1024 and 390 × 844 for responsive checks
- State: homepage in explicit light and dark themes; Work index in both themes; mobile navigation open with keyboard focus
- Full-view comparison evidence: `qa/evidence/design-qa-light-comparison.png` and `qa/evidence/design-qa-dark-comparison.png`
- Focused evidence: `qa/evidence/review04-work-rows-mobile-light.png`, `qa/evidence/review04-work-rows-mobile-dark.png`, and `qa/evidence/review05-menu-focus-mobile-light.png`

The original-resolution full-view composites keep typography, rules, imagery, controls, and the two-part hero readable, so a second desktop crop was not needed. Focused evidence was used where desktop scale would not prove mobile metadata or keyboard focus.

## Findings

No actionable P0, P1, or P2 findings remain.

The approved concepts and implementation share the required split exhibition field, heavy engineered proposition, quiet mono instrument layer, warm neutral/black themes, signal yellow, documentary image, relationship diagram, and ruled workbench system. The implementation intentionally uses an attributable Global Jams photograph and gives the hero a slower exhibition pace; these are content-led applications of the style bible rather than template drift.

### Required fidelity surfaces

- **Fonts and typography:** Inter Tight and IBM Plex Mono provide the prescribed display/instrument voices. Hierarchy, optical weight, wrapping, and line height remain stable across themes and breakpoints. Functional type has a verified 12px floor.
- **Spacing and layout rhythm:** The desktop 58/42-style exhibition field, square rules, open surfaces, and ruled shelves match the governing composition. Tablet and mobile recompose instead of miniaturizing; 390px has no horizontal overflow.
- **Colors and visual tokens:** Warm canvas, black field, muted rules, and one semantic signal yellow map cleanly across equal light/dark structures with legible active and focus states.
- **Image quality and asset fidelity:** The documentary Global Jams image is authentic, context-rich, untinted, correctly cropped, and credited. No stock-future imagery or fake illustrative assets replace the visual target.
- **Copy and content:** The proposition, current inquiry, states, codes, project archive, Lab Log, and About text form a coherent standalone story grounded in Markus's profile and named body of work.
- **Icons and controls:** Phosphor icons remain consistent in stroke, scale, alignment, labeling, and state. Controls are functional rather than decorative.
- **Interaction and accessibility:** Deep links, filters, theme persistence, system theme, menu focus containment, inert covered content, Escape/focus restoration, skip link, visible focus, alt text, reduced motion, and exclusive current navigation are verified.

## Comparison history

1. **Iteration 02:** full-page dark captures produced compositing artifacts; settled non-stitched dark viewport captures proved the implementation itself rendered correctly.
2. **Iteration 03:** functional microtype below 12px and hidden mobile Work metadata were found. All metadata was raised to the 12px minimum and the mobile rows were recomposed to preserve code, state, title, format, period, and action.
3. **Iteration 04:** mobile menu focus containment and duplicate current navigation remained. The menu gained focus entry/looping, inert covered content, Escape cleanup and focus restoration; active-state logic was made mutually exclusive.
4. **Iteration 05:** fresh-context independent review scored 93.9/100, every category at least 8/10, with zero criticals and zero must-fix findings.

## Primary interactions tested

- Theme preference and system theme
- Work editorial filters and URL state
- Direct project deep links
- Mobile menu open, forward/backward focus loop, Escape, inert cleanup, and focus restoration
- Exclusive active navigation on Work, Publish, and project routes
- Reduced-motion media preference

Browser console errors and page errors: none in the verified flows.

## Follow-up polish

- P3: consider a more authored project-opening continuity transition while retaining the reduced-motion path.

## Final result

final result: passed

