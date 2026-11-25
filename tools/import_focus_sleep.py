"""Curate Feature 2 from the supplied report; preserve its numerical tables.

Usage: python tools/import_focus_sleep.py <report.html>
The PDF screenshots are stored separately in assets/datasets/focus-sleep/.
"""
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1]).read_text(encoding='utf-8')


def report_section(name):
    return re.search(r'<section id="' + name + r'"[^>]*>(.*?)</section>', source, re.S)[1]


def source_tables(name):
    # Import only static report tables. Scripts, document instructions and page
    # navigation are not executed or incorporated into the showcase workflow.
    tables = re.findall(r'<table>.*?</table>', report_section(name), re.S)
    result = []
    for index, table in enumerate(tables):
        table = re.sub(r'<th(\s[^>]*)?>', lambda m: '<th scope="col"' + (m[1] or '') + '>', table)
        result.append('<div class="table-scroll research-table" role="region" tabindex="0" aria-label="' + name + ' evidence table ' + str(index + 1) + '">' + table + '</div>')
    return result


def table(headers, rows, caption):
    return '<div class="table-scroll research-table" role="region" tabindex="0" aria-label="' + html.escape(caption) + '"><table><caption>' + html.escape(caption) + '</caption><thead><tr>' + ''.join('<th scope="col">' + html.escape(v) + '</th>' for v in headers) + '</tr></thead><tbody>' + ''.join('<tr>' + ''.join('<td>' + html.escape(v) + '</td>' for v in row) + '</tr>' for row in rows) + '</tbody></table></div>'


def bullets(items):
    return '<ul>' + ''.join('<li>' + html.escape(item) + '</li>' for item in items) + '</ul>'


def note(text):
    return '<div class="research-note">' + html.escape(text) + '</div>'


def details(title, body):
    return '<details class="research-schema"><summary>' + html.escape(title) + '</summary>' + body + '</details>'


sections = []


def add(id, label, body):
    sections.append(dict(id=id, label=label, html=body))


add('overview', 'Feature Overview', '''
<p>Predict a child’s near-term attention from their own recent task performance. The evaluated work covers next-minute Slackline error rate and next-block Attention Robots error count.</p>
<div class="research-grid"><article class="research-card"><h3>Main task: next minute</h3><p>Ridge regression · MAE 0.193 · RMSE 0.237 · R² 0.238</p><p>1,016 out-of-fold predictions from 85 children.</p></article><article class="research-card"><h3>Second task: next block</h3><p>Random Forest · MAE 2.427 errors · RMSE 4.865 · R² 0.236</p><p>246 out-of-fold predictions from 82 children.</p></article></div>
''' + note('Scope update reported by the team: daily “best focus windows” were replaced with short-horizon prediction because the inspected datasets lack repeated time-of-day attention labels. The report lists this change and the Movement exclusion as awaiting supervisor review; no approval is implied here.') + '''
<h3>What is delivered</h3>''' + bullets([
    'Behavioral prediction models evaluated with child-level cross-validation; the child’s own history carries most of the signal.',
    'A focus score and low-focus alert, rather than a detector of sudden attention dips.',
    'Sleep remains pending PATS access. The proposed sleep task is typical duration, onset and efficiency from weekly summaries, not next-night prediction.',
]) + '<h3>Research cohort</h3><p>85 children aged 6–12: 58 with ADHD, 18 without ADHD and 9 with undetermined status. The original BALLADEER dataset spans 158 participants aged 6–18.</p>')

add('system', 'AI System', '<div class="system-tags"><span>Supervised regression</span><span>Personalized short-horizon forecasting</span><span>Behavioral lag features</span></div>' + table(
    ['Task', 'Inputs', 'Output', 'Selected model'], [
        ['Next-minute attention (main)', 'Child profile; recent and running-average error rate, reaction time and gaze on target', 'Next-minute error rate (0–1); derived focus score and low-focus alert', 'Ridge regression'],
        ['Next-block performance', 'Child profile and recent Attention Robots block history', 'Error count in the next task block', 'Random Forest'],
        ['Typical sleep (proposed)', 'PATS weekly actigraphy summaries and available attention measures, after access approval', 'Typical sleep duration, onset and efficiency', 'No trained sleep model supplied'],
    ], 'Prediction tasks') + '''
<h3>Focus score and alert</h3><p><code>Focus score = 100 × (1 − predicted error rate)</code>. A low-focus alert is raised above an error rate of <strong>0.43</strong>, the worst quarter of observed minutes in the report.</p>
''' + note('The report does not describe a calibrated clinical threshold. The model estimates expected performance from recent history and does not reliably anticipate abrupt one-minute drops.') + '<h3>Final input choice</h3><p>The final models use behavioral data. EEG was tested but did not improve the reported held-out results; age, sex and ADHD status added little.</p>')

add('models', 'Candidate Models', table(['Candidate', 'Role / outcome', 'Reason or constraint'], [
    ['Median baseline', 'Evaluated for both tasks', 'Reference prediction without the child’s recent history'],
    ['Persistence baseline', 'Evaluated for both tasks', 'Repeat the previous minute or block; the forecasting benchmark'],
    ['Ridge regression', 'Selected for next-minute attention', 'Lowest main-task MAE; regularized regression'],
    ['Random Forest', 'Selected for next-block errors', 'Lowest block-task MAE; shallow trees to limit overfitting'],
    ['XGBoost', 'Evaluated for both tasks', 'Compared with the same grouped protocol; not selected'],
    ['LSTM', 'Considered; not trained', 'Only 4 blocks or 5 minutes per sequence from about 85 children; insufficient sequence length and volume'],
], 'Candidates and baselines') + '<h3>Training choices</h3>' + bullets([
    'Fixed, conservative hyperparameters and strong regularization; no hyperparameter search was reported.',
    'Error counts modeled as log(1 + errors), with metrics reported on the original scale.',
    'Models selected by lowest MAE, then retrained on all available children and saved, according to the report.',
]) + note('Exact hyperparameter values and model binaries were not attached. The notebook is linked in Examples & Colab.'))

image_captions = [
    ('screenshot-1-1.png', 'BALLADEER: Slackline CGX EEG, participant UB0004'),
    ('screenshot-2-1.png', 'BALLADEER: expanded Slackline TAGS event fields'),
    ('screenshot-2-2.png', 'BALLADEER: Attention Robots GAME_DATA blocks'),
    ('screenshot-3-1.png', 'BALLADEER: Emotiv EPOC X column groups'),
    ('screenshot-4-1.png', 'Movement: B26_F accelerometer sample'),
    ('screenshot-5-1.png', 'Movement: demographic and mental-health columns'),
]
images = [dict(src='assets/datasets/focus-sleep/' + file, caption=caption) for file, caption in image_captions]
gallery = '<div class="screenshot-grid">' + ''.join('<button type="button" class="thumbnail" data-evidence-image="' + str(i) + '"><img loading="lazy" src="' + image['src'] + '" alt="' + html.escape(image['caption']) + '"><span>' + html.escape(image['caption']) + '</span></button>' for i, image in enumerate(images)) + '</div>'

columns = table(['Source / columns', 'Meaning and handling'], [
    ['Slackline TAGS: timestamp, label, port, value', 'Unix-millisecond event timestamp; value contains the event dictionary. Label and port are constant in the sample.'],
    ['reacted; correct; duplicated; flagType', 'Missed event, correctness, repeated presses and stimulus flags. The guide describes a wrong press as a likely commission.'],
    ['reactionTime; generalTime; focus', 'Reaction time in seconds, seconds since level start, and gaze label Target / non_focusable. Gaze is an observation, not a direct measure of internal attention.'],
    ['Attention Robots: velocidadTrabajoBloque1–4; omisionBloque1–4; comisionBloque1–4', 'Per-block work speed, omissions and commissions. No aciertos column exists in the inspected sample.'],
    ['Attention Robots: maxBots; timeChecked; weight; looked_col / looked_row', 'maxBots is a 14-number list whose interpretation is unconfirmed. Eye tracking has time, constant weight 100, and a 40 × 14 gaze grid.'],
    ['CGX: timestamps; AF7 … AF8; A2; ExG 1/2; ACC32–34; Packet Counter / TRIGGER', 'Device-clock seconds; EEG and ear reference; unused ExG constant −833333; acceleration artifacts; packet gaps. Guide suggests high-pass filtering and alignment with TAGS. These are inspected signals, not final-model inputs.'],
    ['Emotiv EPOC X: Timestamp; EEG.*; CQ.* / EQ.*; MOT.*; PM.*; POW.*', '169 columns, 40,048 rows; skiprows=1. Mixed rates: EEG 128 Hz, quality 128 / 2 Hz, motion 32 Hz, performance 0.1 Hz, power 8 Hz. Many blanks reflect differing rates.'],
    ['Movement sensors: loggingTime; accelerationX/Y/Z; userAcceleration; Activity; pedometer', 'Local +08:00 row time; raw acceleration includes gravity; userAcceleration removes gravity; inferred activity; cumulative steps need differences. Location columns contain GPS and must be excluded from shared extracts.'],
    ['Movement questionnaires: ID; SEX; BMI; height / weight; SDQ; a1–a26', '58 children, no age column. Guide gives SDQ coding 1–3, missing SDQ19; SNAP-IV coding 1–4 (inattention a1–a9, hyperactivity a10–a18, oppositional a19–a26). The report flags an out-of-range SDQ value.'],
], 'Dataset column guide')
add('datasets', 'Datasets', '<p>Dataset statuses and findings below are reported by the team. The supplied PDF adds real-file screenshots and column descriptions; it is inspection evidence, not additional training results.</p>' + source_tables('data')[0] + '''
<h3>Dataset screenshots</h3><p>BALLADEER screenshots cover participant UB0004. Movement screenshots are sample sensor and questionnaire files. Open an image to inspect it at full size.</p>''' + gallery + details('Column guide: behavioral fields, inspected sensors and questionnaires', columns) + '''
<p><a class="button" href="assets/datasets/focus-sleep/dataset-column-guide.pdf" target="_blank" rel="noopener noreferrer">Open full dataset guide</a></p>
''' + note('Source discrepancy: the PDF says Movement sensor and questionnaire files link by child ID, while the report says the inspected IDs could not be matched. The PDF also describes C10_T as a 60-minute recording at about 30 Hz, whereas the report summarizes the sample as short recordings at about 100 Hz. Movement remains excluded as reported; these inconsistencies need a raw-file check, which was not supplied.'))

add('preparation', 'Data Preparation', table(['Stage', 'Reported work'], [
    ['Local inspection', 'Scripts inspected folder trees, schemas and sample rows on the data-holding laptop. Raw BALLADEER data totals 57.7 GB.'],
    ['Extraction and cohort', 'Filtered to ages 6–12; extracted task results, responses and EEG summaries for 85 children into approximately 25 MB of compact tables (rafeeq_features.zip).'],
    ['Next-minute features', 'Split 5-minute Slackline levels into 1-minute windows. Computed error rate, reaction time and gaze-on-target history to predict the next minute.'],
    ['Next-block features', 'Used four Attention Robots blocks and the child’s previous / running-average performance to predict the following block.'],
    ['Cleaning and missing values', 'The report states cleaning, feature engineering and leakage-safe imputation were implemented. Exact imputation settings were not included in the attachments.'],
    ['Targets', 'Error rate for the main task; log(1 + errors) during block-task training, evaluated back on the error-count scale.'],
    ['EEG exclusion', 'Emotiv features did not help held-out performance. CGX band-power export had an incorrectly estimated sampling rate, making the frequency bands unreliable. Final models use behavioral data only.'],
    ['Movement exclusion', 'No age column, uncertain sensor/questionnaire ID matching, separator mismatch and invalid SDQ value. GPS omitted from shared extraction.'],
], 'Reported preparation steps') + note('The screenshot guide includes EEG filtering and signal-quality suggestions. Those inspection notes are not presented as completed preprocessing of the final behavioral models.'))

add('evaluation-set', 'Evaluation Set', '<p><strong>Five-fold GroupKFold by child.</strong> Every child’s rows stay in a single fold. The report states zero child overlap was verified in every fold; each out-of-fold prediction is from a model that did not train on that child.</p>' + table(['Task', 'Prediction rows', 'Children', 'Target'], [
    ['Task 2: next Slackline minute (main)', '1,016', '85', 'Error rate, range 0–1'],
    ['Task 1: next Attention Robots block', '246', '82', 'Errors per block'],
], 'Evaluation cohorts') + bullets([
    'A random row split was avoided because rows from the same child are correlated and could inflate scores.',
    'Both tasks compare a median baseline and a persistence baseline with Ridge, Random Forest and XGBoost.',
    'Reported scores are out-of-fold cross-validation results, not a separate external test-set evaluation.',
    'After evaluation, selected models were retrained on all available children. The attachments do not provide a separate final held-out test result.',
]))

results = source_tables('results')
add('comparison', 'Model Comparison', '<p>Lower MAE and RMSE are better; higher R² is better. Selection used <strong>lowest MAE</strong>. All values are preserved from the team report.</p><h3>Task 2 · Next-minute error rate (main)</h3><p>1,016 predictions · 85 children · error-rate units</p>' + results[0] + '<h3>Task 1 · Next-block error count</h3><p>246 predictions · 82 children · errors per block</p>' + results[1] + '''
<div class="research-grid"><article class="research-card research-decision"><h3>Selected: Ridge</h3><p>Main-task MAE 0.193; R² 0.238 versus −0.081 for persistence. Predicts expected attention level from the child’s recent history.</p></article><article class="research-card research-decision"><h3>Selected: Random Forest</h3><p>Block-task MAE 2.427 versus 2.650 for persistence, about 8% lower. Persistence has better RMSE (4.813 vs 4.865) and R² (0.253 vs 0.236), so the improvement is specific to MAE.</p></article></div>
''' + details('Earlier experiments and input decisions', bullets([
    'Whole-session error prediction in 68 children with EEG did not beat the median baseline: median R² −0.09; best model −0.11.',
    'Whole-session speed: Ridge with profile features R² 0.29; adding EEG reduced it to 0.23.',
    'Earlier next-block EEG experiment: error R² 0.32 → 0.28 with XGBoost; speed R² 0.61 → 0.61 with Ridge. These experiments are reported separately and are not in the final notebook.',
])) + '<h3>Limitations</h3>' + re.search(r'<ul.*?</ul>', report_section('limits'), re.S)[0])

colab='https://colab.research.google.com/drive/1uhc9fUquC7rcPyc8tk2Z8KODLj-aHCMj?usp=sharing'
add('examples', 'Examples & Colab', '<p>The first two rows are reported held-out predictions. The last two are app-style illustrations with no reference outcome.</p>' + source_tables('examples')[0] + note('The held-out Slackline example underestimates a real drop: predicted focus 75 versus actual 57. This supports the report’s limit on abrupt-dip prediction.') + '<h3>Runnable notebook</h3><p><a class="button primary" target="_blank" rel="noopener noreferrer" href="' + colab + '">Open Colab Notebook</a></p><p>In Colab, choose Runtime → Run all and upload <code>rafeeq_features.zip</code> when prompted. The report estimates about one minute on CPU. The archive itself was not attached here.</p>' + table(['Reported deliverable', 'Contents'], [
    ['Rafeeq_F2_Focus_Sleep_Prediction.ipynb', 'Eight research steps, training, evaluation, saved models, examples and extraction script appendix.'],
    ['rafeeq_features.zip', 'Approximately 25 MB of extracted BALLADEER tables; required by the notebook.'],
    ['Notebook outputs', 'Saved .joblib models, results.json, comparison and data-overview charts. Reported outputs were not attached.'],
    ['inspect_datasets.py / extract_features.py', 'Local schema inspection and compact-table extraction scripts described in the report.'],
], 'Notebook and reported artifacts') + details('Future work reported by the team', bullets([
    'After PATS access: predict typical sleep duration, onset and efficiency, and test links with Go/No-Go and Conners attention scores.',
    'Request the Tübingen ambulatory-assessment dataset through its authors for repeated time-of-day observations.',
    'Collect repeated attention-game scores and watch sleep in Rafeeq to learn daily focus windows in future.',
])))

payload=dict(description='Personalized attention forecasting: research, evaluation and results.', source='Team report: Maroska and Marwan · 23 November 2026. Dataset screenshots and column guide: Maroska · 23 November 2026. Results are reported by the team; models were not rerun for this showcase.',sections=sections,images=images)
(ROOT/'js/focus-sleep.js').write_text('// Curated from the supplied Feature 2 report and dataset column guide.\nRafeeq.researchWorkspaces["focus-sleep"] = '+json.dumps(payload,ensure_ascii=False)+';\n',encoding='utf-8')
print('Imported Feature 2: 8 sections, exact result tables, 6 supplied screenshots.')
