export const reflectionSources = [
 {id:'fleming-lau-2014',title:'Fleming & Lau (2014) · How to measure metacognition',url:'https://doi.org/10.3389/fnhum.2014.00443',kind:'Methodological review',claim:'Confidence and correctness are different quantities. A change in confidence alone does not establish improved metacognition.',limit:'This paper does not validate this app or its exercises.'},
 {id:'schooler-2011',title:'Schooler et al. (2011) · Meta-awareness, perceptual decoupling and the wandering mind',url:'https://doi.org/10.1016/j.tics.2011.05.006',kind:'Theoretical research review',claim:'Here, meta-awareness refers to explicitly noticing the contents of your own experience.',limit:'Bibliographic information and abstract checked. This exercise has not been evaluated for effectiveness.'},
 {id:'ayduk-kross-2010',title:'Ayduk & Kross (2010) · From a distance',url:'https://doi.org/10.1037/a0019205',kind:'Empirical study',claim:'Examines self-distancing when reflecting on negative experiences.',limit:'Findings apply to the conditions studied. Our friend-perspective prompt is a product-designed exercise, not a validated replication.'},
];
export function reflectionInsight(thought:string,before:number,after:number){
 // Keep recognizing legacy German entries while all interface output is English.
 const absolute=thought.match(/\b(always|never|everyone|everybody|nobody|all|immer|nie|alle|niemand)\b/i)?.[0];
 return {
  title:absolute?'Check a generalization':'See your thought as a thought',
  reason:!thought.trim()?'You did not enter a first thought, so no personal text interpretation is offered.':absolute?`Your sentence includes “${absolute}”. A question to try: is that true in every case?`:'You have captured your first thought. You can check what supports it without immediately rejecting it.',
  certainty:before===after?`Your confidence stays at ${before}%. Staying the same is neither success nor failure.`:`Your confidence changes from ${before}% to ${after}%. This describes your perspective, not whether your thought is correct.`,
  practice:'Friend perspective: what would you say to a good friend in this exact situation?',
  sourceId:'fleming-lau-2014',
 };
}
