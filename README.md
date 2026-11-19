# Rafeeq — AI Development Showcase

A responsive, static research showcase built with HTML5, CSS3 and vanilla JavaScript. No backend, framework, API key, or build step is needed.

## Run locally

From this directory:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Open **http://localhost:8000**. Stop the server with Ctrl+C. All pages also work when opened directly, although a static server is recommended. Google Fonts is an optional enhancement; system fonts work offline.

## Pages

- `index.html`: one scrolling home page with a banner, five expandable use cases (UC1-UC5), and four phase cards with independently scrollable feature lists. Only Phase 1 opens a page.
- `phase1.html`: the eight-step pipeline with connecting arrows, followed by six numbered feature links.
- `feature.html?id=overwhelm`: existing technical page. Other IDs: `focus-sleep`, `homework`, `off-task`, `chores`, `classroom`. Technical-page content awaits the next design pass.
- Former feature and phase overview URLs redirect to the relevant section of the home page.

The home page shows the five primary use cases requested in the revised design. Shared and Additional feature records remain in the data layer and the full phase plan.

The data contains **35 unique feature IDs and 36 use-case placements**. Symptom tracking is shared between Parent and Psychiatrist and is counted once. Gamified Chores remains one user-facing feature with two implementation components. Personalised Stories and Focus Games retain their combined source feature and separate phase implementation entries. Phase-entry counts are not unique-feature counts.

## Add real research evidence

All research data lives in `js/`. The scripts are loaded in dependency order; no module server or bundler is required.

1. `features.js`: feature names, use cases, classifications, phases and badge details.
2. `phases.js`: exact phase plan, eight prototype steps and editable starting system configurations. The last two Phase 4 entries retain Core AI classification and a source-plan review indicator.
3. `models.js`: populate `Rafeeq.models[featureId]` with real candidate records. Each record supports `id`, `name`, `family`, `type`, `status`, `strengths`, `limitations`, and `rationale`.
4. `datasets.js`: populate `Rafeeq.datasets[featureId]` with dataset records. Add actual screenshots to `assets/datasets/` and reference relative paths. Allowed statuses: Identified, Access Pending, Downloaded, Inspected, Prepared, Used in Training, Used in Evaluation. Only assign a status supported by evidence.
5. `evaluations.js`: populate rows with matching `modelId`, `status`, and `metrics`. Exact metric keys must match `systems[featureId].metrics` in `phases.js`. Rates use fractions (for example, 0.91); the table and chart display raw values. No charts render for missing data, and zero is a valid measurement. Candidate rankings are never inferred. Set `bestModels[featureId] = { modelId, reason }` only with actual evaluation evidence.
6. `examples.js`: populate input, prediction, ground truth, processing stages and attachment URLs. Objects display as JSON. Images and JSON files can also be previewed in the browser for the current session; these attachments are not saved and do not run inference.
7. `models.js`: record an explicit `decisions[featureId]` with `modelId`, `status`, `reason`, `alternatives`, `advantages`, `limitations`, `metrics`, and `dataset`. Status should be Not Yet Selected, Under Evaluation, Provisionally Selected, or Final Selection. No model is automatically selected.

Example dataset shape (replace all fields with verified values):

```js
Rafeeq.datasets.overwhelm = [{
  name: 'Verified dataset name', source: 'Original publisher',
  url: 'https://publisher.example/dataset', type: 'Time series',
  size: null, fields: null, relevance: 'Describe the relevant signals',
  status: 'Identified',
  screenshots: [{ src: 'assets/datasets/actual-screenshot.png', caption: 'Describe the actual evidence' }]
}];
```

Null or absent values display as not supplied. Do not add fabricated dataset samples, metric values, progress, dates, or predictions. The three empty model slots represent room for future candidates, not trained models.

## Interactions and accessibility

Use-case sections expand with a click or keyboard activation. Classification badges use distinct forest green, blue, olive, and olive shades. Scrollbars are hidden while wheel, touch, and keyboard scrolling remain available. Phase cards have no top accent stripe, and their last feature has no bottom divider. The header uses the text-only Rafeeq name. Each use case has a consistent accent and tag color across the home page, phase lists, and Phase 1 feature links. Phase lists scroll independently and can receive keyboard focus. Phase 1 is a clickable card; Phases 2-4 display their feature plans without navigation. The pipeline scrolls horizontally on smaller screens. No sidebar or presentation controls are shown.

Existing technical pages retain screenshot galleries, local attachment previews, and evidence placeholders. Screenshot modals support Escape, left/right navigation, zoom controls, and focus return. No personal or research data is uploaded. Reduced-motion, visible focus, semantic controls, and responsive layouts are included.

## Validation

Serve locally and visit `/tests/browser-check.html` to run the revised layout checks. The last browser run, before the latest palette and wordmark refinements, passed 74 checks, including section order, exact feature and phase counts, accordion controls, Phase 1 navigation, matching use-case colors, scrollable phase lists, feature destinations, legacy redirects, and overflow at 320, 390, 700, 768, 850, 1024, and 1440 pixels. Desktop reference screenshots are saved in `tests/desktop.png` and `tests/phase1.png`.
