Rafeeq.datasets = Object.fromEntries(Object.keys(Rafeeq.systems).map(id=>[id,[]]));
// Dataset schema: {name,source,url,type,size,fields,relevance,status,screenshots:[{src,caption}]}
// Allowed evidenced statuses: Identified, Access Pending, Downloaded, Inspected, Prepared,
// Used in Training, Used in Evaluation. Leave absent research as an empty array.
