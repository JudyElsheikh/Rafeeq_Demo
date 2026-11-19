// Populate with real candidate names and evaluation evidence. Slots are not tested models.
Rafeeq.models = Object.fromEntries(Object.keys(Rafeeq.systems).map(id=>[id,[]]));
// Model schema: {id,name,family,type,status,strengths,limitations,rationale}
Rafeeq.decisions = {};
// Decision schema: {modelId,status,reason,alternatives,advantages,limitations,metrics,dataset}
