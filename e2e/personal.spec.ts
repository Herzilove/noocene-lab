import { test, expect } from '@playwright/test';
test('personal reflection carries own thought into evidence and discovery, then clears it',async ({page})=>{
 await page.goto('/innerspace');
 await page.getByRole('button',{name:'Kontakt',exact:true}).click();
 const answers=['Fiktiv: keine Antwort auf meine Nachricht','Ich bin unwichtig','Die Nachricht blieb zwei Stunden unbeantwortet','Vielleicht ist die Person beschäftigt','Ich warte und frage morgen nach'];
 for(const answer of answers){
  await page.getByRole('textbox').fill(answer);
  await page.getByRole('button',{name:/^(Weiter|Meine Entdeckung)/}).click();
 }
 await expect(page.getByText('Ich bin unwichtig',{exact:true})).toBeVisible();
 await expect(page.getByText('Vielleicht ist die Person beschäftigt',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:/Einen weiteren Moment/}).click();
 await expect(page.getByRole('textbox')).toHaveValue('');
});
