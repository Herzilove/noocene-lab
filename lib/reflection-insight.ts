export const reflectionSources = [
 {id:'fleming-lau-2014',title:'Fleming & Lau (2014) · How to measure metacognition',url:'https://doi.org/10.3389/fnhum.2014.00443',kind:'Methodischer Überblick',claim:'Sicherheit und Korrektheit sind unterschiedliche Größen. Eine geänderte Sicherheit allein belegt keinen Metakognitionsgewinn.',limit:'Die Studie validiert weder diese App noch ihre Übungen.'},
 {id:'schooler-2011',title:'Schooler et al. (2011) · Meta-awareness, perceptual decoupling and the wandering mind',url:'https://doi.org/10.1016/j.tics.2011.05.006',kind:'Theoretischer Forschungsüberblick',claim:'Meta-Awareness bezeichnet hier das ausdrückliche Bemerken eigener Bewusstseinsinhalte.',limit:'Bibliografie und Abstract geprüft. Keine Wirksamkeitsprüfung dieser Übung.'},
 {id:'ayduk-kross-2010',title:'Ayduk & Kross (2010) · From a distance',url:'https://doi.org/10.1037/a0019205',kind:'Empirische Studie',claim:'Untersucht Selbst-Distanzierung beim Nachdenken über negative Erlebnisse.',limit:'Die Befunde gelten für die untersuchten Bedingungen. Die Freund-Perspektive hier ist eine von uns entworfene Übung, keine validierte Übertragung.'},
];
export function reflectionInsight(thought:string,before:number,after:number){
 const absolute=thought.match(/\b(immer|nie|alle|niemand)\b/i)?.[0];
 return {
  title:absolute?'Eine Verallgemeinerung prüfen':'Deinen Gedanken als Gedanken sehen',
  reason:!thought.trim()?'Du hast keinen ersten Gedanken angegeben. Deshalb gibt es hier keine persönliche Textdeutung.':absolute?`In deinem Satz steht „${absolute}“. Prüffrage: Gilt das wirklich in jedem Fall?`:'Du hast deinen ersten Gedanken festgehalten. Du kannst nun seine Grundlage prüfen, ohne ihn sofort verwerfen zu müssen.',
  certainty:before===after?`Deine Einschätzung bleibt bei ${before}%. Gleich zu bleiben ist weder Erfolg noch Misserfolg.`:`Deine Einschätzung verändert sich von ${before}% auf ${after}%. Das beschreibt deinen Blick, nicht die Richtigkeit deines Gedankens.`,
  practice:'Freund-Perspektive: Was würdest du einem guten Freund in genau dieser Situation sagen?',
  sourceId:'fleming-lau-2014',
 };
}
