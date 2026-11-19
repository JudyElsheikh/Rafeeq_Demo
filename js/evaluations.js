Rafeeq.evaluations = Object.fromEntries(Object.keys(Rafeeq.systems).map(id=>[id,[]]));
// Row: {modelId,status,metrics:{Accuracy:0.91,Precision:0.9,...}}. Use fractions for rates.
// Do not enter placeholder numbers. MAE/RMSE are native units; R² may be negative.
Rafeeq.bestModels = {}; // Explicit, justified choice: featureId: {modelId,reason}
