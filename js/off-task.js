// Off-task content curated from the supplied November 2026 experiment report.
(() => {
 const table = (caption, headers, rows) => `<div class="table-scroll research-table" role="region" tabindex="0" aria-label="${caption}"><table><caption>${caption}</caption><thead><tr>${headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(cell=>`<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 const more = (title, html) => `<details class="research-schema"><summary>${title}</summary>${html}</details>`;
 Rafeeq.researchWorkspaces['off-task'] = {
  description: 'Feature details',
  pipeline: {
   navigation: true,
   steps: ['Feature and pipeline', 'AI system type', 'Choose candidate pretrained models', 'Choose evaluation datasets', 'Compare results and select the best candidates', 'Further steps & notebook links'],
  },
  sections: [
   {id:'overview', label:'Feature & Pipeline', html:`
    <h3>What does this feature do?</h3>
    <p>Off-task detection checks whether the child is doing their homework or has drifted away from it. It follows their behaviour during a study session to identify when they stay off-task for too long, so Rafeeq can offer support at the right time.</p>
    <p>The feature supports both <strong>paper homework</strong> and <strong>digital homework</strong>. It uses the task mode alongside gaze, head position, study materials and activity: looking down at a notebook can be on-task, just as looking at a laptop screen can be on-task during digital work.</p>
    <div class="offtask-io-grid">
     <article class="offtask-io-card"><span class="eyebrow">INPUT</span><h3>Expected input</h3><p>Live camera frames and short clips showing the child and their study area, together with the chosen task mode: paper/book work or laptop work.</p><ul><li>Face, gaze and head position</li><li>Hands, study materials and visible objects</li><li>Activity over time and homework context</li></ul>
      <div class="offtask-camera-setups"><h4>Expected camera setup</h4><div class="offtask-camera-grid">
       <figure><div class="offtask-camera-crop"><img src="assets/images/off-task-homework-example.png" alt="Paper homework setup with the laptop diagonally beside the child and notebook."></div><figcaption><strong>Paper homework</strong><p>Laptop positioned diagonally to show the face, hands and notebook. Looking down at the page can be on-task.</p></figcaption></figure>
       <figure><div class="offtask-camera-crop"><img src="assets/images/off-task-homework-example.png" alt="Digital homework setup with the laptop directly in front of the child."></div><figcaption><strong>Digital homework</strong><p>Laptop positioned in front to show the face and eye direction. Looking toward the screen can be on-task.</p></figcaption></figure>
      </div><p class="offtask-camera-note">Illustrative image, not evaluation footage.</p></div>
     </article>
     <article class="offtask-io-card"><span class="eyebrow">OUTPUT</span><h3>Expected output</h3><div class="offtask-output-labels"><strong>On-task</strong><strong>Off-task</strong></div><p>Track how long the child stays off-task. If it continues for too long, send a notification to the child or parent depending on the severity.</p><p>A brief glance away should not trigger the same response as a prolonged off-task period.</p></article>
    </div>

    <figure class="offtask-diagram offtask-session" aria-labelledby="offtask-session-caption">
     <figcaption id="offtask-session-caption">Intended session pipeline <span>Planned integration</span></figcaption>
     <div class="offtask-node"><strong>Task mode + camera input</strong><span>Online: laptop work &middot; Offline: paper / book work</span></div>
     <div class="offtask-down" aria-hidden="true">&darr;</div>
     <div class="offtask-node"><strong>Camera & workspace calibration</strong><span>MediaPipe face visibility + required study materials</span></div>
     <div class="offtask-down" aria-hidden="true">&darr;</div>
     <div class="offtask-streams" aria-label="Visual evidence streams">
      <div class="offtask-node"><strong>Gaze</strong><span>Direction + target</span></div>
      <div class="offtask-node"><strong>Head pose</strong><span>Pitch &middot; yaw &middot; roll</span></div>
      <div class="offtask-node"><strong>Objects</strong><span>Laptop &middot; phone &middot; book</span></div>
      <div class="offtask-node"><strong>Activity</strong><span>Reading &middot; writing &middot; other actions</span></div>
     </div>
     <div class="offtask-down" aria-hidden="true">&darr;</div>
     <div class="offtask-node"><strong>Synchronized, mode-aware features</strong><span>Route to the online or offline XGBoost classifier</span></div>
     <div class="offtask-down" aria-hidden="true">&darr;</div>
     <div class="offtask-node"><strong>Task classification over time</strong><span>Track on-task / off-task behaviour and the duration of off-task periods</span></div>
     <div class="offtask-down" aria-hidden="true">&darr;</div>
     <div class="offtask-outcomes"><strong>On-task</strong><strong>Off-task</strong></div>
     <div class="offtask-down" aria-hidden="true">&darr;</div>
     <div class="offtask-node"><strong>Prolonged off-task behaviour?</strong><span>Notify the child or parent depending on severity</span></div>
    </figure>
`},
   {id:'system', label:'AI system type', html:`
    <div class="system-tags"><span>Computer vision</span><span>Pretrained deep learning</span><span>Supervised binary classification</span><span>Feature fusion</span></div>
    <h3>A computer-vision system with a trained final classifier</h3>
    <p>The feature combines several visual models to understand the camera input, then uses a supervised classifier to decide whether the child is on-task or off-task. The final decision uses the combined evidence and homework mode.</p>
    <div class="offtask-io-grid"><article class="offtask-io-card"><h3>Pretrained visual models</h3><p>CNN and transformer models extract gaze, head pose, objects and activity. We compare their released weights first, then consider fine-tuning if Rafeeq evaluation shows a need.</p></article><article class="offtask-io-card"><h3>Supervised task classifier</h3><p>XGBoost learns from extracted features paired with manually labelled on-task/off-task intervals. Random Forest is a comparison baseline; an offline LSTM was also tested experimentally.</p></article></div>
    ${table('AI tasks within the system', ['Pipeline part','AI task','What it contributes'], [
     ['Gaze','Direction estimation and spatial target localization','Where the eyes point and the likely target in the scene'],
     ['Head pose','Angle estimation','Which direction the head faces: pitch, yaw and roll'],
     ['Objects','Object detection','Locations and labels of visible study materials and objects'],
     ['Activity','Video classification','The action being performed across a short clip'],
     ['Synchronized, mode-aware features','Feature fusion + supervised binary classification','Combine the outputs and task mode to predict on-task or off-task']
    ])}
    <h3>From prediction to notification</h3><p>Application logic tracks off-task duration and decides whether to notify the child or parent according to severity. This response logic is separate from training the classifier; duration and severity thresholds still need validation.</p>`},
   {id:'calibration', label:'Calibration', html:`
    <p><strong>Why we need calibration:</strong> before homework starts, Rafeeq checks that the camera can see the child and the study materials needed for the selected task. This helps ensure the setup is ready before the session begins.</p><p>This calibration is a setup check: confirm face visibility and the required workspace, then ask for adjustments if anything needed is out of view.</p>
    <ol><li>Choose online or offline homework and position the camera and study materials.</li><li>Use <strong>MediaPipe Face Landmarker</strong> to check face visibility.</li><li>Use the selected <strong>workspace/object detector</strong> to locate relevant laptop, book or phone objects. Only materials required for the task need to be present; a phone is not required.</li><li>If ready, show <strong>“Face detected – workspace ready. Let’s start.”</strong> Otherwise, ask for a camera or materials adjustment and check again.</li></ol>
    <p>MediaPipe continues supplying face landmarks during the session for gaze and head-pose inputs.</p>
    ${more('What calibration establishes', '<p>This is an initial visibility and setup check. It does not yet establish accurate gaze mapping to the screen or desk. Paper detection is not established by the object experiment. This flow has not yet been implemented or evaluated.</p>')}`},
   {id:'components', label:'Choose candidate pretrained models', html:
    `<p>Additional training is not automatically an improvement. We decided to evaluate the pretrained visual models first, keeping their released weights fixed. <strong>Random Forest and XGBoost are the exception:</strong> these final task classifiers must be trained on labelled feature data before we can use them for Rafeeq.</p>
    <section class="offtask-model-group" aria-labelledby="offtask-gaze-models"><h3 id="offtask-gaze-models">1. Gaze</h3>
    <p>Gaze helps Rafeeq understand where the child is looking. It has two parts: estimating the direction of the eyes, and locating the point they are looking at in the camera image.</p>
    <h4>Gaze estimation</h4><p class="offtask-notebook-label">Notebook 01</p><p><strong>What it receives:</strong> images of the face and eyes, with the supporting face/head information required by the model.</p><p><strong>What it produces:</strong> a direction in 3D space showing where the eyes are pointing, for example downward toward the desk or ahead toward the screen. It does not identify a particular book or screen by itself.</p>` +
    table('Gaze estimation candidates', ['Model','Specifications / released checkpoint','Checkpoint training data','Role in the comparison'], [
     ['L2CS-Net','ResNet-50 CNN<br><strong>Parameters:</strong> 23.88 million parameters<br><strong>Checkpoint:</strong> <code>L2CSNet_gaze360.pkl</code>','Gaze360','Evaluated; smaller efficiency alternative'],
     ['RT-GENE','Dual-eye CNN + head pose<br><strong>Parameters:</strong> 32.85 million parameters<br><strong>Checkpoint:</strong> <code>Model_allsubjects1.h5</code>','RT-GENE only; mixed MPII/UTMV variants excluded','Evaluated as a baseline'],
     ['UniGaze-H','ViT-Huge/14<br><strong>Parameters:</strong> 632.05 million parameters<br><strong>Checkpoint:</strong> <code>unigaze_h14_cross_X</code>','ETH-XGaze supervised training; MPII listed for validation','Evaluated; leading recorded accuracy candidate']
    ]) +
    more('MPIIFaceGaze evaluation data and limits', '<p>Evaluation used the same requested 2,000 images across 15 participants, with model-specific preprocessing. RT-GENE produced 1,874 predictions, so the strict three-model comparison uses those common image IDs. Camera/rotation calibration still needs independent validation.</p><p>UniGaze-H uses the cross-X checkpoint, not the joint checkpoint, but independence from MPII-based validation or checkpoint selection is not established. The L2CS checkpoint came from a hash-checked community mirror; this does not independently authenticate it as the author-distributed file. Identity overlap across source datasets was not independently audited.</p>') +
    more('Excluded gaze candidates', '<p>UniGaze-B uses a ViT-Base/16 joint checkpoint that includes MPIIFaceGaze training, so it was excluded from this comparison. The original Gaze360 model was removed because its checkpoint download returned HTTP 403. This did not prevent using L2CS-Net weights trained on the Gaze360 dataset.</p>') +
    `<h4>Gaze-target localization</h4><p class="offtask-notebook-label">Notebook 02</p><p><strong>What it receives:</strong> the full camera image and a box marking the child’s head.</p><p><strong>What it produces:</strong> a likely gaze location in that image. During integration, Rafeeq can compare this location with the detected study materials to help distinguish looking at homework from looking elsewhere.</p>` +
    table('Gaze-target candidates', ['Model','Specifications / released checkpoint','Checkpoint training data','Role in the comparison'], [
     ['GazeFollow-spatial','Spatial gaze-target model<br><strong>Checkpoint:</strong> <code>model_gazefollow.pt</code>','GazeFollow','Faster comparison alternative'],
     ['Gaze-LLE-ViT-B','ViT-B model<br><strong>Checkpoint:</strong> <code>gazelle_dinov2_vitb14.pt</code>','GazeFollow','Stronger recorded target-localization accuracy']
    ]) +
    more('GazeFollow evaluation data and limits', '<p>Both candidates were evaluated on the same 4,782 samples from a GazeFollow test mirror, using annotated head boxes. Both were trained on GazeFollow, so mirror membership must be checked against the official held-out split before calling this an independent test.</p><p>These results do not establish performance with automatically detected heads, out-of-frame gaze or homework-specific targets. Connecting a target location to a particular book, laptop or phone remains integration work. Only two target-localization candidates were evaluated.</p>') +
    `</section><section class="offtask-model-group" aria-labelledby="offtask-head-models"><h3 id="offtask-head-models">2. Head pose</h3><p class="offtask-notebook-label">Notebook 03</p><p>Head pose describes the direction and tilt of the child’s head. It gives Rafeeq supporting evidence about whether the child is facing the screen, bending toward a notebook or turning away.</p><p><strong>What it receives:</strong> a cropped image of the child’s face. <strong>What it produces:</strong> three angles, measured in degrees:</p><ul><li><strong>Pitch:</strong> looking up or down, like nodding “yes.” Lowering the head to write changes pitch.</li><li><strong>Yaw:</strong> turning the face left or right, like shaking the head “no.” Turning to look beside the desk changes yaw.</li><li><strong>Roll:</strong> tilting the head toward either shoulder. Leaning one ear toward a shoulder changes roll.</li></ul><p>Head direction is only one clue: the eyes can look in a different direction, and looking down can be appropriate during paper homework.</p>` +
    table('Head-pose candidates', ['Model','Specifications','Released-weight training data','Role in the comparison'], [
     ['6DRepNet','6D head-pose representation<br><strong>Parameters:</strong> 39.32 million parameters','300W-LP','Leading recorded accuracy candidate'],
     ['WHENet','Head-pose estimation network<br><strong>Parameters:</strong> 4.33 million parameters','300W-LP + CMU Panoptic','Comparison baseline'],
     ['MobileNetV2-Pose','MobileNetV2-based pose model<br><strong>Parameters:</strong> 2.23 million parameters','300W-LP','Smaller alternative; replaced the proposed MediaPipe comparison']
    ]) +
    more('AFLW2000-3D evaluation data and limits', '<p>All candidates used the same 2,000 AFLW2000-3D images and face crops derived from supplied landmarks. The released 6DRepNet checkpoint was selected using AFLW2000 performance, so this is not an untouched independent test.</p><p>The experiment does not separately establish downward reading/writing accuracy or stability across video frames. Live face detection and the rest of Rafeeq are outside the measured processing path.</p>') +
    `</section><section class="offtask-model-group" aria-labelledby="offtask-object-models"><h3 id="offtask-object-models">3. Objects</h3><p class="offtask-notebook-label">Notebook 04</p><p>Object detection helps Rafeeq understand what is in the study area.</p><p><strong>What it receives:</strong> a camera image of the child’s workspace. <strong>What it produces:</strong> a label and a rectangular box around each detected laptop, phone or book.</p><p>These locations can be combined with gaze and activity to interpret what the child is doing. A visible phone alone does not mean the child is off-task; it may be unused or relevant to the homework.</p>` +
    table('Workspace and object candidates', ['Model','Specifications / variant','Released-weight training data','Role in the comparison'], [
     ['RT-DETR-l','RT-DETR detector<br>large variant','COCO','Comparison baseline'],
     ['YOLO26m','YOLO detector<br>medium variant','COCO','Practical speed candidate; replaced the planned YOLO11m'],
     ['RF-DETR Medium','RF-DETR detector<br>medium variant','COCO','Recorded overall detection-score leader']
    ]) +
    more('COCO evaluation data and limits', '<p>Evaluation used the same 500 selected COCO val2017 images, with 213 laptop, 252 phone and 1,103 book annotations. The set was selected for containing these objects, so it does not test scenes without them.</p><p>COCO does not establish coverage of worksheets, pencils or exercise notebooks. Separate per-class results were not supplied; the aggregate small-object result does not identify a phone-specific winner. Test actual camera distances, clutter and partly hidden objects before final selection.</p>') +
    `</section><section class="offtask-model-group" aria-labelledby="offtask-activity-models"><h3 id="offtask-activity-models">4. Activity</h3><p class="offtask-notebook-label">Notebook 05</p><p>Activity recognition looks at what the child is doing across several video frames, rather than judging a single still image.</p><p><strong>What it receives:</strong> a short video clip. <strong>What it produces:</strong> an activity prediction, mapped in our comparison to reading, writing, computer use, phone use, eating or drinking.</p><p>Rafeeq interprets that activity using the homework mode. Computer use may be expected for digital homework, while writing may be expected for paper homework.</p>` +
    table('Activity-recognition candidates', ['Model','Specifications / released checkpoint','Released-weight training data','Role in the comparison'], [
     ['VideoMAE','Base video transformer<br>native 16-frame input<br><strong>Checkpoint:</strong> <code>MCG-NJU/videomae-base-finetuned-kinetics</code>','Released Kinetics-400 action-classification weights','Stronger preliminary activity candidate'],
     ['TimeSformer','Base video transformer<br>native 8-frame input<br><strong>Checkpoint:</strong> <code>facebook/timesformer-base-finetuned-k400</code>','Released Kinetics-400 action-classification weights','Alternative retained for further experiments']
    ]) +
    more('ASTime evaluation data and limits', '<p>The comparison used 94 derived segments from 10 selected videos of participants P015 and P016, covering reading, writing, phone use, computer use, eating and drinking. Only two activity models were evaluated.</p><p>Multiple segments share people and recordings. Derived boundaries need visual review; broad ASTime activities do not perfectly match Kinetics labels. Unsupported native predictions count as errors. Pretrained-source overlap with these recordings was not independently audited.</p><p>The segments were subsequently reused for notebook 06 development, so they are no longer an untouched final test. NTU RGB+D was not downloaded or used for this experiment.</p>') +
    `</section><section class="offtask-model-group" aria-labelledby="offtask-classifier-models"><h3 id="offtask-classifier-models">5. Synchronized, mode-aware features</h3><p class="offtask-notebook-label">Notebook 06</p><p>This is the stage that brings the evidence together to make the homework decision.</p><p><strong>What it receives:</strong> gaze, head-pose, object and activity outputs aligned to the same moment, together with the selected homework mode. “Synchronized” means the signals refer to the same time; “mode-aware” means they are interpreted differently for paper and digital homework.</p><p><strong>What it produces:</strong> an <strong>on-task</strong> or <strong>off-task</strong> prediction from the appropriate online/offline classifier. The application then tracks how long off-task behaviour continues before deciding whether to notify the child or parent.</p>` +
    table('Final task-classifier candidates', ['Model','Specifications','Training data in notebook 06','Role'], [
     ['Random Forest','200 trees<br>maximum depth 12<br>minimum leaf size 3<br>balanced class weights','Separate online and offline prototype feature records','Trained baseline for both task modes'],
     ['XGBoost','200 trees<br>maximum depth 4<br>learning rate 0.05<br>row/column sampling 0.8','Separate online and offline prototype feature records','Trained; selected for development'],
     ['Offline LSTM','One 32-unit LSTM layer + linear output<br>sequences of 8 ordered records','142 offline training sequences; 82 validation sequences','Experimental trained temporal baseline; no online LSTM']
    ]) +
    more('Prototype training data and limits', '<p>The prototype sampled 3,000 online records from Students Attention v3 and 3,000 offline ASTime frames. Online inputs use 37 source features; offline inputs use 88 body/coarse-hand features from a frozen MediaPipe pose extractor because ASTime faces are blurred.</p><p>Online participant/session identifiers are unavailable, so source-row block splits do not establish independence by child. Offline training used P015 and validation used P016, only two people. Activity-derived task labels are development assumptions that require homework context.</p><p>These classifiers have not yet been trained on synchronized outputs from all selected Rafeeq components. The next training dataset must use the integrated pipeline’s actual feature schema and manually labelled Rafeeq recordings. Notification duration and severity thresholds also need validation.</p>') +
    `</section>`},
   {id:'results', label:'Compare results and select the best candidates', html:
    `<p>Results are grouped by the same five pipeline parts. Each comparison uses its own metric: lower angle/target error is better; higher detection scores, accuracy and F1 are better. Candidate choices below are for development.</p>
    <section class="offtask-model-group" aria-labelledby="offtask-gaze-results"><h3 id="offtask-gaze-results">1. Gaze</h3>
    <h4>Gaze estimation</h4><p class="offtask-notebook-label">Notebook 01</p><p>2,000 requested MPIIFaceGaze images. Angle errors are measured in degrees.</p>` +
    table('Gaze estimation: accuracy and coverage', ['Model','Successful / requested','Failures','Coverage','Mean angular error','Median angular error','Pitch MAE','Yaw MAE'], [
     ['L2CS-Net','2,000 / 2,000','0','100%','23.52','21.27','15.69','15.57'],
     ['RT-GENE','1,874 / 2,000','126','93.7%','13.24','12.28','9.43','7.56'],
     ['UniGaze-H','2,000 / 2,000','0','100%','<strong>5.51</strong>','<strong>4.50</strong>','<strong>4.52</strong>','<strong>2.43</strong>'],
     ['UniGaze-B','Not evaluated','Not applicable','Not applicable','Not applicable','Not applicable','Not applicable','Not applicable']
    ]) +
    `<p><strong>Leading candidate: UniGaze-H.</strong> It had the lowest gaze error and complete prediction coverage. On the same 1,874 successful image IDs shared by all three models, mean errors were 5.48 degrees for UniGaze-H, 13.24 for RT-GENE and 23.28 for L2CS-Net, so it also leads the direct comparison.</p><p>L2CS-Net remains a smaller efficiency alternative. RT-GENE missed 126 predictions and fell below the recorded 95% coverage requirement. Camera validation, checkpoint-selection independence and laptop performance still need checking; the saved automatic selection remains unresolved.</p>` +
    `<h4>Gaze-target localization</h4><p class="offtask-notebook-label">Notebook 02</p><p>4,782 GazeFollow samples, measured on an NVIDIA Tesla T4. Both models achieved 100% prediction coverage.</p>` +
    table('Gaze-target results', ['Model','Average target error','Heatmap AUC','Model inference','End-to-end latency','End-to-end FPS'], [
     ['GazeFollow-spatial','0.0835','0.9163','<strong>19.78 ms</strong>','<strong>44.26 ms</strong>','<strong>22.59</strong>'],
     ['Gaze-LLE-ViT-B','<strong>0.0453</strong>','<strong>0.9561</strong>','73.62 ms','105.80 ms','9.45']
    ]) +
    `<p><strong>Leading accuracy candidate: Gaze-LLE.</strong> Its average target error was about 46% lower, and it had the higher heatmap AUC. GazeFollow-spatial remains the faster alternative, processing images about 2.4 times faster in this experiment.</p><p>Target error is distance in normalized image coordinates; heatmap AUC is not classification accuracy. The practical choice depends on runtime with the other components. Test-split membership and performance with live head detection still need verification.</p>
    </section>
    <section class="offtask-model-group" aria-labelledby="offtask-head-results"><h3 id="offtask-head-results">2. Head pose</h3><p class="offtask-notebook-label">Notebook 03</p><p>2,000 AFLW2000-3D images on an NVIDIA RTX 4050 Laptop GPU. All candidates produced predictions for every image. Angle errors are in degrees.</p>` +
    table('Head-pose results', ['Model','Pitch error','Yaw error','Roll error','Overall average error','End-to-end FPS','Parameters'], [
     ['6DRepNet','<strong>5.56</strong>','<strong>3.34</strong>','<strong>4.27</strong>','<strong>4.39</strong>','<strong>68.49</strong>','39.32 million'],
     ['WHENet','9.02','5.97','7.91','7.64','38.33','4.33 million'],
     ['MobileNetV2-Pose','6.20','4.13','4.76','5.03','49.63','<strong>2.23 million</strong>']
    ]) +
    `<p><strong>Leading candidate: 6DRepNet.</strong> It had the lowest error on every angle and the highest measured throughput. MobileNetV2-Pose remains a smaller alternative, with about 18 times fewer parameters, although it was slower here.</p><p>Pitch was the hardest angle for all three models. Downward reading/writing poses and video stability still need testing. The released 6DRepNet checkpoint was selected using AFLW2000 performance, so this is a benchmark comparison rather than an untouched independent test.</p>
    </section>
    <section class="offtask-model-group" aria-labelledby="offtask-object-results"><h3 id="offtask-object-results">3. Objects</h3><p class="offtask-notebook-label">Notebook 04</p><p>500 COCO val2017 images on an NVIDIA RTX 4050 Laptop GPU. All candidates processed every image; this does not mean every object was detected.</p>` +
    table('Object-detection results', ['Model','mAP50','mAP50-95','Small-object AP','End-to-end FPS','Approximate time / image'], [
     ['RT-DETR-l','67.6%','50.4%','21.9%','23.80','42.01 ms'],
     ['YOLO26m','67.3%','50.3%','<strong>29.3%</strong>','<strong>32.12</strong>','<strong>31.13 ms</strong>'],
     ['RF-DETR Medium','<strong>69.4%</strong>','<strong>50.8%</strong>','27.0%','17.21','58.12 ms']
    ]) +
    `<p><strong>Practical candidate: YOLO26m.</strong> It was fastest and had the best aggregate small-object score. <strong>RF-DETR Medium is the recorded accuracy leader</strong>, but its mAP50-95 lead over YOLO26m was only 0.5 percentage points.</p><p>mAP measures detection and box placement, not ordinary classification accuracy. Keep RF-DETR for accuracy comparisons and RT-DETR as a baseline. Per-class scores, clutter and partly hidden objects still need evaluation; the small-object score does not establish a phone-specific winner.</p>
    </section>
    <section class="offtask-model-group" aria-labelledby="offtask-activity-results"><h3 id="offtask-activity-results">4. Activity</h3><p class="offtask-notebook-label">Notebook 05</p><p>94 ASTime segments on an NVIDIA A100-SXM4-80GB. Both models produced predictions for every segment.</p>` +
    table('Activity-recognition results', ['Model','Correct','Accuracy','Six-activity macro-F1','Coverage','Model inference / clip','End-to-end / clip'], [
     ['VideoMAE','30 / 94','<strong>31.91%</strong>','<strong>37.57%</strong>','100%','<strong>30.07 ms</strong>','2,731.25 ms'],
     ['TimeSformer','18 / 94','19.15%','24.55%','100%','36.80 ms','<strong>1,406.88 ms</strong>']
    ]) +
    table('Correct predictions by activity', ['Activity','VideoMAE correct','TimeSformer correct'], [
     ['Computer use','8 / 12','8 / 12'],['Drinking','1 / 11','0 / 11'],['Eating','4 / 10','3 / 10'],['Phone use','5 / 29','0 / 29'],['Reading','11 / 20','7 / 20'],['Writing','1 / 12','0 / 12']
    ]) +
    `<p><strong>Stronger preliminary candidate: VideoMAE.</strong> It had higher accuracy and macro-F1, plus lower model-only inference time. TimeSformer had lower end-to-end time in this video-loading and decoding setup, so it remains an alternative.</p><div class="research-note"><strong>Strong candidate for later fine-tuning: activity recognition.</strong> Both models remain weak, especially on writing, phone use and drinking. VideoMAE correctly recognized only one of twelve writing segments. After evaluating on actual Rafeeq recordings, consider adapting the chosen activity model using suitable ASTime training videos and matching action annotations, followed by labelled Rafeeq clips.</div><p>First verify segment labels and the native-action mapping. Keep training data separate from final testing; the already reused P015/P016 development videos are not an untouched test. Fine-tuning is conditional, and VideoMAE is not guaranteed to remain the better model after adaptation. Clip timings are not webcam-frame FPS.</p>
    </section>
    <section class="offtask-model-group" aria-labelledby="offtask-classifier-results"><h3 id="offtask-classifier-results">5. Synchronized, mode-aware features</h3><p class="offtask-notebook-label">Notebook 06</p><p>These are prototype classifier validation results. The online model uses source CSV features; the offline model uses body-pose features. Neither has yet been trained on synchronized outputs from the complete Rafeeq pipeline.</p>` +
    table('Full usable-record classifier validation', ['Mode','Model','Validation records','Accuracy','Macro-F1','Off-task precision','Off-task recall','Off-task F1'], [
     ['Online','Random Forest','967','92.76%','92.75%','94.05%','90.85%','92.42%'],
     ['Online','XGBoost','967','92.76%','92.75%','94.05%','90.85%','92.42%'],
     ['Offline','Random Forest','1,121','52.27%','51.28%','54.76%','37.24%','44.33%'],
     ['Offline','XGBoost','1,121','52.63%','52.25%','54.57%','42.83%','47.99%']
    ]) +
    `<p><strong>Selected development candidate: XGBoost.</strong> Online, it made the same validation classifications as Random Forest while using less saved storage and lower measured batch prediction time. Offline, it had a small lead on the full validation set and higher off-task recall.</p><p><strong>The offline result is still weak:</strong> XGBoost achieved 52.63% accuracy, only slightly above the approximately 51.03% majority-class baseline. It missed all usable validation computer-use and drinking examples. The current data and body-only features are insufficient for a reliable homework detector.</p>` +
    more('Offline LSTM and fair common-endpoint comparison', '<p>LSTM predicts eight-record sequences. Its 82 outputs cannot be directly ranked against 1,121 single-record predictions, so the report also compared all models on the same 82 sequence endpoints.</p>' +
    table('Offline comparison on the same 82 endpoints', ['Model','Accuracy','Macro-F1','Off-task precision','Off-task recall','Off-task F1'], [
     ['Random Forest','62.20%','<strong>55.89%</strong>','40.00%','38.46%','39.22%'],
     ['XGBoost','59.76%','55.63%','38.71%','<strong>46.15%</strong>','<strong>42.11%</strong>'],
     ['LSTM','62.20%','51.14%','35.29%','23.08%','27.91%']
    ]) + '<p>Random Forest leads macro-F1 slightly on these endpoints; XGBoost detects more off-task examples. Always predicting on-task would score 68.29% accuracy on this imbalanced subset. LSTM showed overfitting and no demonstrated advantage; its windows covered 56.80% of requested offline validation frames.</p>') +
    more('Saved model size and batch prediction time', '<p>Prepared-batch measurements exclude camera capture and all visual feature extraction. RF and XGBoost ran on CPU; the experimental LSTM used CUDA.</p>' +
    table('Classifier storage and prediction timing', ['Mode','Model','Saved size','Batch-amortized prediction latency'], [
     ['Online','Random Forest','2.745 MiB','0.0783 ms / record'],['Online','XGBoost','0.302 MiB','0.0098 ms / record'],['Offline','Random Forest','1.401 MiB','0.0672 ms / record'],['Offline','XGBoost','0.249 MiB','0.0087 ms / record'],['Offline','LSTM','0.090 MiB','0.0065 ms / sequence']
    ]) + '<p>LSTM also requires its saved preprocessor. These times do not establish full-system laptop speed.</p>') +
    `<p><strong>Next for the final classifier:</strong> train XGBoost on manually labelled Rafeeq recordings using the integrated feature schema, then test on separate people/sessions. The online split has unknown participant/session provenance; the offline split contains only two people. No final deployment accuracy or full-system speed has been established.</p>
    </section>`},
   {id:'data', label:'Choose evaluation datasets', html:`
    <p>We chose labelled datasets that match the output of each component, and used the same sample for all candidates within that comparison. The final task classifiers are different: they need labelled training data as well as validation data.</p>
    <section class="offtask-model-group" aria-labelledby="offtask-gaze-data"><h3 id="offtask-gaze-data">1. Gaze</h3>
    <h4>Gaze estimation</h4><p class="offtask-notebook-label">Notebook 01</p>
    <p><strong>Chosen dataset:</strong> MPIIFaceGaze. Its gaze-direction labels and camera information let us compare predicted eye directions against known directions.</p>
    <p><strong>Sample used:</strong> a fixed selection of 2,000 images across 15 participants, using seed 42. Every candidate received the same image IDs, with the preprocessing required by its model.</p>
    <h4>Gaze-target localization</h4><p class="offtask-notebook-label">Notebook 02</p>
    <p><strong>Chosen dataset:</strong> GazeFollow. Its scene images, head boxes and labelled gaze targets match the task of locating where a person is looking within an image.</p>
    <p><strong>Sample used:</strong> 4,782 samples from the GazeFollow test mirror. Both candidates received the same images and annotated head boxes.</p>
    ${more('Gaze dataset limitations', '<p>MPIIFaceGaze: the UniGaze-H checkpoint lists MPII for validation, so complete independence from checkpoint selection is not established. Camera/rotation calibration still needs independent checking. RT-GENE succeeded on 1,874 images; strict three-way scoring uses those common images.</p><p>GazeFollow: both models were trained on GazeFollow. Verify the mirror against the official held-out split before claiming independent testing. Supplied head boxes do not establish live head-detection or homework-target performance.</p>')}
    </section>
    <section class="offtask-model-group" aria-labelledby="offtask-head-data"><h3 id="offtask-head-data">2. Head pose</h3><p class="offtask-notebook-label">Notebook 03</p>
    <p><strong>Chosen dataset:</strong> AFLW2000-3D. Its head-angle labels let us compare predicted pitch, yaw and roll against reference angles, including difficult head orientations.</p>
    <p><strong>Sample used:</strong> 2,000 images. All candidates used the same face crops derived from dataset landmarks and a consistent angle convention.</p>
    ${more('Head-pose dataset limitations', '<p>The released 6DRepNet checkpoint was selected using AFLW2000 performance, so this benchmark is not an untouched independent test. It does not separately establish downward reading/writing accuracy or stability across video frames.</p>')}
    </section>
    <section class="offtask-model-group" aria-labelledby="offtask-object-data"><h3 id="offtask-object-data">3. Objects</h3><p class="offtask-notebook-label">Notebook 04</p>
    <p><strong>Chosen dataset:</strong> COCO val2017. It provides labelled object boxes for the laptops, phones and books relevant to our initial workspace comparison.</p>
    <p><strong>Sample used:</strong> 500 selected images containing these objects, with 213 laptop, 252 phone and 1,103 book annotations. Every detector processed the same images.</p>
    ${more('Object dataset limitations', '<p>The selected images contain target objects, so they do not test scenes with none present. The current comparison does not establish worksheet, pencil or exercise-notebook detection. Per-class results and actual homework camera-distance tests are still needed.</p>')}
    </section>
    <section class="offtask-model-group" aria-labelledby="offtask-activity-data"><h3 id="offtask-activity-data">4. Activity</h3><p class="offtask-notebook-label">Notebook 05</p>
    <p><strong>Chosen dataset:</strong> ASTime. It contains video activities relevant to homework, allowing comparison on reading, writing, phone use, computer use, eating and drinking.</p>
    <p><strong>Sample used:</strong> 10 selected videos from participants P015 and P016, approximately 375 MB. We derived 94 activity segments from their transition annotations and compared both models on the same time intervals.</p>
    ${table('Activity sample', ['Activity','Segments'], [['Reading','20'],['Writing','12'],['Phone use','29'],['Computer use','12'],['Eating','10'],['Drinking','11']])}
    ${more('Activity dataset limitations', '<p>These are derived classification windows, not the official ASTime localization benchmark. Several segments share people or recordings, and boundaries need visual review. ASTime labels do not perfectly match Kinetics action labels. Unsupported predictions count as errors. These segments were later reused for classifier development and are no longer an untouched final test.</p>')}
    </section>
    <section class="offtask-model-group" aria-labelledby="offtask-classifier-data"><h3 id="offtask-classifier-data">5. Synchronized, mode-aware features</h3><p class="offtask-notebook-label">Notebook 00: dataset preparation / Notebook 06: training and validation</p>
    <p><strong>Why we combined two datasets:</strong> Students Attention v3 represents online learning, while ASTime provides activities closer to paper/book work. Notebook 00 combined them into one prototype dataset container with a task-mode field, while keeping separate feature schemas for the two modes.</p>
    ${table('Combined prototype training dataset', ['Task mode','Source','Sampled records','Labels'], [
     ['Online','Students Attention v3 feature CSV','3,000','1,500 on-task / 1,500 off-task'],
     ['Offline','Frames sampled from selected ASTime segments','3,000','1,500 on-task / 1,500 off-task'],
     ['Total','Combined container prepared in notebook 00','6,000','3,000 on-task / 3,000 off-task']
    ])}
    <p><strong>What we trained:</strong> notebook 06 trained Random Forest and XGBoost separately for online and offline work, plus an experimental offline LSTM. Online inputs retained 37 source features. Because ASTime faces are blurred, offline inputs used 88 body/coarse-hand features extracted with a frozen MediaPipe pose model.</p>
    <p><strong>Why this is a prototype:</strong> these public sources approximate parts of the intended task, but they are not actual Rafeeq homework data and do not contain all synchronized outputs from our selected components.</p>
    <p><strong>What the final classifier needs:</strong> train XGBoost on manually labelled Rafeeq recordings using a fixed, consistent feature schema produced by the integrated pipeline. Training and live inference must use the same feature definitions and preprocessing. Evaluate on separate people/sessions.</p>
    ${more('Training splits and data limitations', '<p>After feature checks, 2,983 online and 2,965 offline records were usable. Online training/validation contained 2,016 / 967 records. Participant/session identifiers are unavailable, so the source-row block split is only an exploratory proxy for independence.</p><p>Offline training used participant P015 (1,844 valid records) and validation used P016 (1,121), only two people. The LSTM used 142 training and 82 validation sequences. Provisional offline labels treated reading/writing as on-task and phone/computer use, eating and drinking as off-task; real homework needs task and break context.</p><p>The ASTime videos were reused for development. They cannot also serve as an untouched final test of a system developed using them.</p>')}
    </section>`},
   {id:'future-data', label:'Planned Rafeeq dataset', html:`
    <h3>Our own labelled Rafeeq dataset for XGBoost</h3>
    <p>Record homework videos from the intended camera position, covering paper/book and digital tasks. Manually mark the start and end of each <strong>on-task</strong> or <strong>off-task</strong> interval, using the assigned homework as context. Include reading, writing, thinking, looking away, phone interactions, breaks and partial occlusion.</p>
    <p>Run the selected visual components on those same videos and align their outputs with the labelled intervals. The people label task behaviour; the models extract gaze, head-pose, object and activity features. Review ambiguous intervals rather than forcing unreliable labels.</p>
    <div class="research-note"><strong>Illustrative dataset example:</strong> the rows below are invented to show the planned structure. They are not collected recordings, model predictions or evaluation results.</div>
    ${table('Example final XGBoost training rows', ['Video / interval','Task mode (provided)','Gaze (extracted)','Head pose (extracted)','Objects (extracted)','Activity (extracted)','Task label (manual)'], [
     ['paper_01.mp4 / 00:00-00:05','Offline','Downward / notebook region','Angled down toward desk','Book; laptop','Writing','On-task (0)'],
     ['paper_01.mp4 / 00:05-00:10','Offline','Downward / phone region','Angled down toward phone','Phone; book; laptop','Phone use','Off-task (1)'],
     ['digital_01.mp4 / 00:00-00:05','Online','Ahead / screen region','Facing laptop','Laptop; book','Reading / computer use','On-task (0)']
    ])}
    <p><strong>Manually labelled:</strong> the on-task/off-task answer for each video interval, judged against the assigned homework. <strong>Extracted by the models:</strong> gaze, head pose, objects and activity for that same interval. <strong>Provided by the application:</strong> online/offline task mode.</p>
    <p>Match everything by video and timestamp to create one training row. XGBoost uses task mode and extracted features as inputs, and learns to predict the manual task label.</p>
    <p>These human-readable examples will become consistent numeric and encoded features: gaze directions and target coordinates, pitch/yaw/roll angles, object boxes/scores, activity scores and missing-evidence flags. Looking down alone cannot distinguish writing from phone use; the other signals and task context matter.</p>
    <p><strong>Training plan:</strong> train the selected XGBoost classifier on Rafeeq-labelled training recordings, using the same feature schema and preprocessing as the application. Use separate participants/sessions for validation and an untouched final evaluation set. Video IDs, participant IDs and manual task labels are metadata/targets, not classifier input features.</p>
    ${more('Additional annotation and recording details', '<p>Store video/clip IDs, participant/session IDs, timestamps, task mode, assigned homework, label intervals and synchronized component outputs. Keep calibration/setup and evidence-validity information so failures can be investigated.</p><p>If a visual component needs fine-tuning, add the specialist labels it requires: action intervals, object boxes, gaze targets or calibrated head-pose labels. An on-task/off-task label alone cannot train every visual model.</p>')}`},
   {id:'next', label:'Next Steps', html:`
    <h3>Build and evaluate the complete pipeline</h3>
    <ol><li><strong>Bring the selected components together.</strong> Build camera/workspace calibration, gaze, head pose, object detection and activity recognition into one pipeline with synchronized, mode-aware features.</li><li><strong>Create and manually label our Rafeeq recordings.</strong> Define separate training, validation and final evaluation partitions by participant/session.</li><li><strong>Check the frozen visual components and train XGBoost.</strong> Extract the real integrated features, inspect component errors on development recordings and train the final classifier on Rafeeq-labelled training data.</li><li><strong>Test the combined system on our evaluation data.</strong> Measure task accuracy, macro-F1, missed off-task periods, false alarms, notification timing and full-pipeline runtime.</li><li><strong>Decide which components need adaptation.</strong> Use observed errors to identify persistent weaknesses. If fine-tuning is needed, train the affected candidates on suitable training data and compare against their frozen baselines.</li><li><strong>Evaluate the revised pipeline again.</strong> Use validation recordings for development decisions and fresh untouched recordings for final claims after any adaptation.</li></ol>
    <p>Notebook 07 is the intended integration/evaluation stage. Fine-tuning decisions follow testing on representative Rafeeq recordings; complete-system results are still pending.</p>`},
   {id:'fine-tuning', label:'Fine-Tuning If Needed', html:`
    <h3>Possible fine-tuning datasets</h3><p>Keep pretrained visual weights initially. The following sources are options if Rafeeq evaluation shows adaptation is needed. <strong>Activity recognition is the strongest current visual fine-tuning candidate.</strong> XGBoost training on our own labelled data is a planned part of building the final classifier.</p>
    <div class="offtask-adaptation">
    ${table('Conditional fine-tuning and training sources', ['Pipeline part','Candidate','Possible dataset','When / labels required'], [
     ['Gaze: direction','UniGaze-H','<a href="https://ait.ethz.ch/xgaze">ETH-XGaze official dataset</a>; <a href="https://github.com/facebookresearch/gaze360">Gaze360</a>; labelled Rafeeq gaze data','If persistent gaze errors remain after calibration; calibrated gaze-direction labels.'],
     ['Gaze: target','Gaze-LLE','<a href="https://github.com/ejcgt/attention-target-detection">GazeFollow / VideoAttentionTarget</a>; Rafeeq target annotations','If screen/desk target errors persist; head boxes and target coordinates, with temporal inputs if supported.'],
     ['Head pose','6DRepNet','<a href="https://github.com/cleardusk/3DDFA">300W-LP resources</a>; labelled Rafeeq head poses','If relevant pose errors persist; consistent rotation/angle labels. Preserve evaluation partitions.'],
     ['Objects','YOLO26m; RF-DETR retained for comparison','<a href="https://cocodataset.org/#download">COCO train2017</a>; annotated Rafeeq images','If objects are missed or new classes are needed; bounding boxes and class labels.'],
     ['<strong class="fine-tune-priority">Activity: strongest current candidate</strong>','<strong>VideoMAE; TimeSformer remains an alternative</strong>','<strong><a href="https://huggingface.co/datasets/Jambo1988/ASTime">ASTime training videos + annotations</a></strong>; later, Rafeeq activity clips','<strong>Weak writing, phone-use and drinking recognition.</strong> Review action intervals and label mapping before training.' + more('Why is it the strongest candidate for fine-tuning?', '<p>VideoMAE was the better activity model, but it achieved only <strong>31.91% accuracy</strong> and <strong>37.57% macro-F1</strong>. It correctly identified just <strong>1 of 12 writing segments</strong>, <strong>5 of 29 phone-use segments</strong> and <strong>1 of 11 drinking segments</strong>.</p><p>These weaknesses affect the activities Rafeeq needs to distinguish during homework. Suitable ASTime training videos and action annotations could help adapt the model to those activities. We will decide whether to fine-tune after testing on actual Rafeeq recordings.</p>')],
     ['Final task classifier','XGBoost','Our own manually labelled Rafeeq recordings','Planned supervised training using actual synchronized features and on-task/off-task interval labels.']
    ])}
    </div>
    ${more('Training and evaluation rules', '<p>Choose adaptation data and thresholds using training/validation partitions. Preserve a final untouched evaluation set; if an evaluation set has influenced model changes, use fresh recordings for final claims. Do not train on evaluation samples and continue calling their scores independent.</p><p>Dataset links identify the sources recorded in the report. No fine-tuning or new data collection has been performed for this showcase page.</p>')}`}
  ,{id:'resources', label:'Notebooks and supporting files', html:
    `<h3>Notebook links</h3><p>Open the uploaded notebooks directly. Notebooks 02-04 will be linked after they are uploaded; notebook 07 is the planned integration stage.</p>` +
    table('Shared notebooks', ['Notebook','Purpose','Link'], [
     ['00','Build the combined prototype training dataset','<a href="https://drive.google.com/file/d/1OUDIawVJi8V7OL_H6xlbQG_zhB_UaH6U/view" target="_blank" rel="noopener noreferrer">Open notebook 00</a>'],
     ['01','Gaze estimation comparison','<a href="https://drive.google.com/file/d/1WMx5qOFZ22V0Sq8aSN3iRLYsO7VcTcNl/view" target="_blank" rel="noopener noreferrer">Open notebook 01</a>'],
     ['02','Gaze-target localization comparison','Awaiting upload'],
     ['03','Head-pose comparison','Awaiting upload'],
     ['04','Workspace/object comparison','Awaiting upload'],
     ['05','Activity recognition comparison','<a href="https://drive.google.com/file/d/16xNtiP8IywKzavuHIPJhCBU7rSbMF0hk/view" target="_blank" rel="noopener noreferrer">Open notebook 05</a>'],
     ['06','Final task-classifier training and validation','<a href="https://drive.google.com/file/d/13j-L1nJ1MRxrpU5JKnJ-ZKWwqFrvRZ1u/view" target="_blank" rel="noopener noreferrer">Open notebook 06</a>'],
     ['07','Complete-pipeline integration and evaluation','Planned']
    ]) +
    `<p><a href="https://drive.google.com/drive/folders/1w66qH08DiZnZdOzr8WUXyUvPswo8kDBL?usp=sharing" target="_blank" rel="noopener noreferrer">Open off-task feature folder</a></p>`}
  ]
 };
 const workspace = Rafeeq.researchWorkspaces['off-task'];
 const content = Object.fromEntries(workspace.sections.map(section => [section.id, section]));
 workspace.sections = [
  {...content.overview, html: content.overview.html + more('Camera and Workspace Calibration Details', content.calibration.html)},
  content.system,
  {id:'components', label:'Choose candidate pretrained models', html:content.components.html},
  {id:'evaluation', label:'Choose evaluation datasets', html:content.data.html},
  {id:'comparison', label:'Compare results and select the best candidates', html:content.results.html},
  {id:'next', label:'Further steps & notebook links', html:content.next.html + content['future-data'].html + content['fine-tuning'].html + content.resources.html}
 ];
})();
