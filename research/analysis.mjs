const fields = new Set(['participantId','trialId','questionId','condition','consent','synthetic','completed','initialCorrect','finalCorrect','initialConfidence','finalConfidence','durationSeconds']);
export function validateTrials(rows) {
  if(!Array.isArray(rows)||!rows.length) throw Error('A nonempty trial array is required.');
  const seen=new Set(); const participants=new Map();
  for(const r of rows) {
    if(!r||typeof r!=='object'||Object.keys(r).some(k=>!fields.has(k))) throw Error('Unexpected fields: export only permitted data.');
    for(const key of ['participantId','trialId','questionId']) if(typeof r[key]!=='string'||!/^[a-zA-Z0-9_-]{1,80}$/.test(r[key])) throw Error('Invalid identifier.');
    if(seen.has(r.trialId)) throw Error('Duplicate trial ID.'); seen.add(r.trialId);
    if(!['independent','socratic'].includes(r.condition)||r.consent!==true||typeof r.synthetic!=='boolean'||typeof r.completed!=='boolean') throw Error('Invalid condition, consent or provenance.');
    if(r.synthetic!==rows[0].synthetic) throw Error('Synthetic and real trials must be analyzed separately.');
    if(participants.has(r.participantId)&&participants.get(r.participantId)!==r.condition) throw Error('Between-participant pilot cannot mix conditions for a participant.');
    participants.set(r.participantId,r.condition);
    if(![0,1].includes(r.initialCorrect)||!Number.isFinite(r.initialConfidence)||r.initialConfidence<0||r.initialConfidence>100) throw Error('Invalid initial response.');
    if(r.completed&&(![0,1].includes(r.finalCorrect)||!Number.isFinite(r.finalConfidence)||r.finalConfidence<0||r.finalConfidence>100)) throw Error('Invalid final response.');
    if(!r.completed&&(r.finalCorrect!==null||r.finalConfidence!==null)) throw Error('Incomplete trials must have null final fields.');
    if(!Number.isFinite(r.durationSeconds)||r.durationSeconds<0) throw Error('Invalid duration.');
  }
  return rows;
}
const mean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:null;
export function analyze(rows) {
  validateTrials(rows);
  const conditions={};
  for(const condition of ['independent','socratic']) {
    const all=rows.filter(r=>r.condition===condition), done=all.filter(r=>r.completed);
    const ids=[...new Set(all.map(r=>r.participantId))];
    conditions[condition]={participants:ids.length,startedTrials:all.length,completedTrials:done.length,
      completionRate:all.length?done.length/all.length:null,
      accuracyBefore:mean(done.map(r=>r.initialCorrect)),accuracyAfter:mean(done.map(r=>r.finalCorrect)),
      selfCorrections:done.filter(r=>r.initialCorrect===0&&r.finalCorrect===1).length,
      initiallyIncorrect:done.filter(r=>r.initialCorrect===0).length,
      regressions:done.filter(r=>r.initialCorrect===1&&r.finalCorrect===0).length,
      brierBefore:mean(done.map(r=>(r.initialConfidence/100-r.initialCorrect)**2)),
      brierAfter:mean(done.map(r=>(r.finalConfidence/100-r.finalCorrect)**2)),
      meanDurationSeconds:mean(done.map(r=>r.durationSeconds)),
      participantMeanAccuracyChange:mean(ids.map(id=>mean(done.filter(r=>r.participantId===id).map(r=>r.finalCorrect-r.initialCorrect))).filter(v=>v!==null))};
  }
  const a=conditions.independent.participantMeanAccuracyChange,b=conditions.socratic.participantMeanAccuracyChange;
  return {schemaVersion:1,synthetic:rows[0].synthetic,conditions,primaryDifference:b===null||a===null?null:b-a,
    interpretation:rows[0].synthetic?'Synthetic pipeline validation only; no human efficacy conclusion.':'Exploratory pilot; no definitive efficacy or long-term metacognition conclusion.'};
}
