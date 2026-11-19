window.Rafeeq = {};
Rafeeq.categories = {core:'Core AI', engineering:'AI Engineering', non:'Non-AI', optional:'Optional AI'};
Rafeeq.useCases = [
 ['UC1','Child Throughout the Day','A companion through everyday moments','sun'],
 ['UC2','Child at Home','Learning, homework and daily routines','home'],
 ['UC3','Child at School','Support within the classroom','school'],
 ['UC4','Parent','An informed, connected support system','people'],
 ['UC5','Psychiatrist','A clearer view of progress over time','medical'],
 ['Shared','Shared Functional Capabilities','Connected across the ecosystem','layers'],
 ['Additional','Additional Features','Extending the Rafeeq experience','spark']
];
// [id, feature name, use case, classification keys, implementation phases, badge detail]
Rafeeq.features = [
 ['companion','Personalized Agentic Companion','UC1',['engineering'],[2],'LLM + Agent'],
 ['overwhelm','Early Overwhelm Detection','UC1',['core'],[1]],
 ['focus-sleep','Personalized Focus and Sleep Prediction','UC1',['core'],[1]],
 ['calm','Calm Down Menu','UC1',['optional'],[3,4],'Rules First'],
 ['rewards','Personalized Rewards and Badges','UC1',['optional'],[3,4],'Rules First'],
 ['focus-mode','Focus Mode','UC1',['non'],[3]],
 ['notifications','Personalized Notifications and Reminders','UC1',['optional'],[3,4],'Rules First'],

 ['lesson','Lesson Explanation','UC2',['engineering'],[2],'LLM + RAG'],
 ['recap','Lesson Recap and Revision','UC2',['engineering'],[2],'LLM + RAG'],
 ['assistant','AI Homework Assistant','UC2',['engineering'],[2],'OCR + LLM'],
 ['homework','Homework Photo Checker','UC2',['core'],[1]],
 ['off-task','Off-Task Detection During Homework','UC2',['core'],[1]],
 ['chores','Gamified Chores','UC2',['core','non'],[1,3],'Photo Verification / Missions and Rewards'],
 ['classroom','Classroom Attention and Engagement Guidance','UC3',['core'],[1],'Guidance'],
 ['belongings','Belongings Reminders','UC3',['non'],[3]],
 ['insights','Insight Summaries and Trends','UC4',['engineering'],[2]],
 ['check-in','Weekly Parent Check-In','UC4',['non'],[3]],
 ['routine','Routine and Chores Builder','UC4',['non'],[3]],
 ['day-plan','Day Plan and Planning Notifications','UC4',['non'],[3]],
 ['questionnaire','Early-Signs Questionnaire','UC4',['non'],[3],'Rule-Based Scoring'],
 ['medication','Medication Check','UC4',['non'],[3]],

 ['report','Weekly Clinical Report','UC5',['engineering'],[2]],

 ['initiation','Task Initiation','Shared',['optional'],[3,4],'Rules First'],
 ['breakdown','Task Breakdown','Shared',['engineering'],[2],'LLM'],
 ['multisensory','Multisensory Tests and Reading-Aloud Checks','Shared',['core','non'],[3,4],'Core AI Components / Interfaces'],
 ['timers','Visual Timers and Gradual Transitions','Shared',['non'],[3]],
 ['storage','Shared Data Storage, Consent and Access Controls','Shared',['non'],[3]],
 ['dashboards','Parent and Teacher Role-Based Dashboards','Shared',['non'],[3]],

 ['video','AI Video and Channel Checker','Additional',['core'],[4],'Multimodal'],
 ['screen','Context-Aware Screen Time','Additional',['optional'],[3,4],'Rules First'],
 ['stories','Personalised Stories and Focus Games','Additional',['engineering','optional'],[2,3,4],'AI Stories / Optional AI Games'],
 ['resources','ADHD Resources for Parents and Teachers','Additional',['optional'],[3,4],'AI-Assisted Retrieval']
].map(([id,name,uc,categories,phases,detail=''])=>({id,name,uc,categories,phases,detail}));
Rafeeq.feature = id => Rafeeq.features.find(f=>f.id===id);
// Exact wording from the latest supplied feature document.
Rafeeq.descriptions = {
  "companion": "Rafeeq features one consistent 3D animated character for all children, with a personalized interaction experience for each child. The character adapts its voice, tone, response speed, and communication style to the child\u2019s preferences. A short onboarding game helps identify the child\u2019s preferred sound, light, and texture experiences. The companion responds to the child\u2019s mood, celebrates achievements, and encourages them through friendly invitations rather than commands. Children can unlock clothes, hats, accessories, and pets as rewards, allowing them to customize their character\u2019s appearance while keeping the main character the same for everyone.\nAgent with long-term memory. The companion is an AI agent. It remembers the child\u2019s interests, what he found hard and what helped him before, and it can act for him: start a timer, add a task, open a lesson or start a quiz, always within the parent\u2019s settings. Its replies pass through safety filters suitable for children. It goes with the child throughout the day and connects the other Rafeeq features, such as lessons, homework, Focus Mode and the Calm Down Menu.",
  "overwhelm": "Heart rate, movement, sleep and inactivity from the watch, with opt-in voice and camera cues. When signs rise, the companion steps in, offers the Calm Down Menu, and the teacher or parent gets context. It works across settings (home, school and in between), depending on which devices are available and on consent.",
  "rewards": "Digital rewards and achievement badges for personal progress, such as a 7-day routine streak, with progress tracking and positive feedback. One reward system is reused across homework, chores, routines, lessons and other activities, and rewards include customisation items for the companion (clothes, hats, accessories, pets). It is separate from the companion itself.",
  "focus-sleep": "Sleep metrics from the watch, together with his sleep, schedule and interaction history, show his best focus time and a good bedtime, and reveal patterns such as focus dropping at 5 PM on Mondays. Study time is recommended around these windows. A light simulation of his habits (a behavioural digital twin) tests which interventions will probably work, and the model keeps adapting as his longitudinal history grows.",
  "calm": "When overwhelmed, the child opens a menu to name the feeling, pick a calming activity, take a short break, or follow a step-by-step exercise. It includes a calm mini-space (breathing animation, soft sounds, fidget-style interaction). He can open it himself at any time, and the companion offers it when early overwhelm detection sees signs rising. Activities are personalised to what helps him.",
  "focus-mode": "A study mode that silences distracting notifications and keeps the child in the current task, with focus sessions and a visual timer. He can turn it on whenever he needs it, at home, at school or anywhere else. It combines with task initiation and task breakdown (Section 10) and, during homework, with off-task detection.",
  "notifications": "The child gets only the essential reminders: what he is doing right now, what is next, and gentle transition reminders before an activity changes. Timing and presentation (sound, animation, wording, how early) are personalised to him, and notifications are kept minimal so they never overwhelm. The complete daily schedule goes to the parent (UC4).",
  "lesson": "When he missed content or a lesson is new, the companion explains it step by step in different forms (text, speech, video, visuals). Small quizzes come during the explanation, and a comprehension test after it. Every quiz and test is multisensory: he can choose an answer (MCQ), say it aloud, type it, write it by hand, or drag and build. Some questions ask him to read aloud, so his reading in Arabic and English is tested too.",
  "recap": "Revises a lesson with a summary of the main points, then tests him on it with the same multisensory answer options, including reading aloud in Arabic and English. Mistakes he keeps making (from tests and homework photos) come back in the recap.",
  "assistant": "The child or parent uploads the homework (a photo or a file). Rafeeq reads the assignment, divides it into small, manageable steps ordered around his best focus times, and guides him through them one at a time, using the shared task initiation and task breakdown capabilities (Section 10). Connecting to school platforms such as Google Classroom is a possible future integration (Section 14), not part of the first build.",
  "homework": "He takes a photo of his worksheet. Rafeeq reads his handwriting (Arabic and English), checks each step of a math solution, and spots mistakes he keeps repeating, such as flipping a sign or forgetting to carry. Feedback is gentle and points to the step to look at again, rather than giving the answer.",
  "off-task": "With the opt-in home camera, gaze, head position and phone detection show when he drifts away from homework. The companion gives a gentle nudge, or suggests a break if he has been working for a long time. Video is processed on the device and never leaves it.",
  "chores": "A chore becomes a small challenge in missions, with progress, feedback, points and badges. Certain chores, such as cleaning the room or folding clothes, can be supported by camera-based verification from a photo the child takes. These are examples, not a complete list:\nClean your room: make the bed, pick up clothes from the floor, put toys away, organise the desk, then a final check of the whole room (a \u201cbefore\u201d and an \u201cafter\u201d photo).\nFold clothes: the photo shows whether the clothes are folded.\nOther chores, such as clearing the dishes or taking out the trash, are games the child marks done and the parent confirms. More chores and verification methods may be explored through further research and added as future enhancements (Section 14). The parent can always override the AI\u2019s result.",
  "classroom": "A dedicated single-student camera (fidgeting, movement, focus) combined with watch metrics. Rafeeq tells the teacher what is happening, why, how to respond and what to avoid, for a class or shadow teacher. An in-app nudge to the child is tried first. Moments when attention dropped are logged, so the missed lesson content can be covered at home (UC2). In class, it also uses the shared early overwhelm detection (UC1).",
  "belongings": "Calm reminders to pack his things before leaving school.",
  "routine": "The parent enters normal daily chores, sports and activities. Rafeeq formats them into a clear schedule.",
  "day-plan": "The parent receives the complete daily schedule and all planning and management notifications, so the parent always knows what is planned for the day without nagging the child. The child does not get every notification: he only gets the essential reminders for what is happening now or next (UC1, personalized notifications and reminders), so he is not overwhelmed.",
  "medication": "The medication reminder goes to the parent, who confirms whether it was taken and when. This feeds the clinician report.",
  "check-in": "A short weekly questionnaire for symptoms the app cannot measure (Section 8). It also produces a conversation guide for the family.",
  "insights": "Best focus windows, meltdown triggers and which reminder styles work, delivered daily and weekly as insights, not logs. Includes reading progress and repeated homework mistakes.",
  "questionnaire": "A short questionnaire explains symptoms in plain language and suggests whether to talk to a doctor.",
  "report": "Medication adherence and timing, the 18 ADHD symptoms through the week (Section 8), trends over weeks and months (better, same or worse), and patterns between appointments. The report can be exported (PDF or FHIR-style, to fit the clinic\u2019s records) and viewed weekly, biweekly or monthly.",
  "initiation": "Helps the child begin an activity by offering a manageable first step, encouragement and a choice of where to begin. A short countdown starts the task, and the companion starts alongside him, celebrates starting, adapts the task if he struggles, and tracks time to start to monitor progress. Starting is one of the hardest parts of ADHD, and this will be tested with children and parents. Used in: the AI homework assistant, gamified chores, Focus Mode, lesson activities and daily routines.",
  "breakdown": "Divides a complex activity into smaller, manageable steps (for example: find the notebook, read page 15, short break, continue) and presents one instruction at a time, so the child never faces the whole task at once. Used in: the AI homework assistant, gamified chores (missions), Focus Mode, lesson activities and daily routines.",
  "multisensory": "Every quiz and test, in the explanation and the recap, lets him answer by choosing (MCQ), saying it aloud, typing, writing by hand, or dragging and building. Spoken and written answers are graded by meaning, not exact wording. Some questions ask him to read aloud in Arabic or English: Rafeeq catches skipped and misread words, measures reading pace and tracks reading progress over the weeks.",
  "timers": "A visual timer for each task shows time passed and time left. Warnings come in stages (10 minutes, 5, 2) before the next activity, so transitions are gradual instead of \u201cstop now\u201d. This supports time blindness and hard transitions. Used in: Focus Mode, daily routines, the AI homework assistant, gamified chores, lesson activities, and the child\u2019s transition reminders.",
  "video": "The parent pastes a YouTube link or a channel. Rafeeq analyses pacing, scene changes, loudness, flashing lights and language, then returns an Overstimulation Score, an Educational Score and a verdict (watch now, watch with a break, or not today). It uses the child\u2019s state, sensory profile and bedtime, and always shows the reason. Parents set the thresholds and have the final say.",
  "screen": "Limits depend on homework status, total exposure, current overstimulation and bedtime, not a fixed timer. Content is grouped into a daily Balance Score. When overload is detected, the device lowers brightness, mutes notifications or switches to grayscale. The app also supports healthy transitions away from the screen.",
  "stories": "Stories and games built around his interests, so attention practice feels like play.",
  "resources": "Short guides on what ADHD is and how to interact with the child, to ease guilt and confusion."
};
Rafeeq.standouts = {
  "companion": "Most companion apps give every child the same character and tone, and only chat. Rafeeq\u2019s companion remembers him and can act.",
  "overwhelm": "Links body signals to a response. Others only cue the child to refocus.",
  "rewards": "Motivates without physical rewards or competition.",
  "focus-sleep": "Study and routine follow his own rhythm, and focus loss is prevented instead of reacted to.",
  "calm": "Teaches regulation, not just \u201ccalm down\u201d.",
  "focus-mode": "Helps him concentrate wherever he is, not only at a desk at home.",
  "notifications": "Keeps the child calm and on track without flooding him with alerts.",
  "lesson": "Missed content is explained by his own companion, at home, when he is ready, and tested in the way he answers best.",
  "recap": "A quick refresher, separate from learning something new.",
  "assistant": "Turns a whole assignment into one clear next step.",
  "homework": "Catches the mistake he keeps making, not just the wrong answer.",
  "off-task": "Notices drifting early and nudges gently, without a parent watching over him.",
  "chores": "Makes everyday responsibilities engaging, and checks the result instead of only trusting a tap.",
  "classroom": "Tells the teacher what to do in the moment, with understanding, not just commands.",
  "belongings": "Reduces lost items.",
  "routine": "Parents get a schedule without building it by hand.",
  "day-plan": "Keeps the child calm and the parent informed.",
  "medication": "Keeps medication data accurate without pressure on the child.",
  "check-in": "Completes the symptom picture for the doctor.",
  "insights": "Parents get what to do next, not a spreadsheet.",
  "questionnaire": "A first step before a clinic visit. It is a guide, not a diagnosis.",
  "report": "Shows change over time, not one score or a pile of raw data."
};
// Research notes supplied by the team. These describe requirements, not completed work.
Rafeeq.capabilityGroups = {
 Shared: [
  {id:'initiation',classification:'Rule-based initially; optional AI personalization',why:'May adapt the first step and encouragement based on the child’s responses; basic countdowns and choices do not need AI.',data:'Task start times, task selections, responses to prompts, and parent/child feedback (only if personalization is implemented).'},
  {id:'breakdown',classification:'AI-assisted when dynamically generated',why:'An LLM can divide complex or uploaded tasks into manageable steps; predefined steps need no AI.',data:'Example tasks, reviewed step sequences, and curriculum/task context.'},
  {id:'multisensory',classification:'Core AI components + pretrained models',why:'Speech recognition, semantic grading, handwriting recognition, and skipped/misread-word detection use AI; MCQ and drag-and-drop interfaces do not.',data:'Arabic/English reading audio, reference passages, annotated errors, graded answers, and handwriting samples.'},
  {id:'timers',classification:'Non-AI; rules + UI',why:'Countdowns and staged transition warnings are standard programming rather than AI.',data:'No training dataset; schedules, task durations, and settings are operational inputs.'}
 ],
 Additional: [
  {id:'video',classification:'Core AI; multimodal analysis',why:'Analyzes video pacing, scene changes, audio and language to estimate potential overstimulation and educational relevance.',data:'Video frames, audio features, annotated content, and expert-reviewed scoring criteria.'},
  {id:'screen',classification:'Optional AI; rules initially',why:'Can adapt limits based on behavior, but initial context-based rules need no AI.',data:'Usage history, content categories, homework status, and bedtime.'},
  {id:'stories',classification:'AI-assisted for stories; optional for games',why:'Generated stories use language models; conventional focus games can use fixed rules.',data:'Child interests, age-appropriate story examples, and safety evaluations.'},
  {id:'resources',classification:'Optional AI-assisted retrieval',why:'Curated resources can be displayed without AI; optional retrieval or explanation can use a pretrained model.',data:'Professionally reviewed ADHD educational content; no training dataset required.'}
 ]
};
