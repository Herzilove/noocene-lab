import { test, expect } from '@playwright/test';
test('personal world preserves own words, stores only by choice and supports revisit and deletion',async ({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 await page.screenshot({path:'test-results/world-mobile.png',fullPage:true});
 await page.getByRole('button',{name:/Work Mode/}).click();
 await expect(page.getByRole('link',{name:/Let’s explore/})).toHaveAttribute('href','/innerspace?world=work');
 await page.goto('/innerspace?world=social');
 const answers=['Fiktiv: keine Antwort auf meine Nachricht','Ich bin unwichtig','Die Nachricht blieb zwei Stunden unbeantwortet','Vielleicht ist die Person beschäftigt','Ich warte und frage morgen nach'];
 for(let i=0;i<answers.length;i++){
  if(i!==2)await page.getByRole('button',{name:'✎ Eigene Worte',exact:true}).click();
  if(i===2){await page.getByRole('button',{name:/Gedeutet/}).click();await expect(page.getByRole('status')).toContainText('Deutung');}
  await page.getByRole('textbox').fill(answers[i]);
  if(i===2)await page.screenshot({path:'test-results/reality-check.png',fullPage:true});
  await page.getByRole('button',{name:i===4?/Mein Fundstück ansehen/:/^Weiter/}).click();
 }
 await expect(page.getByText('Ich bin unwichtig',{exact:true})).toBeVisible();
 await expect(page.getByText('Vielleicht ist die Person beschäftigt',{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('noocene:garden:v1'))).toBeNull();
 await page.screenshot({path:'test-results/discovery-world.png',fullPage:true});
 await page.getByRole('button',{name:/In meinen Garten legen/}).click();
 expect(await page.evaluate(()=>localStorage.getItem('noocene:garden:v1'))).toBeNull();
 await page.getByRole('button',{name:'Ja, auf diesem Gerät speichern',exact:true}).click();
 await page.getByRole('link',{name:/Dein Garten wartet/}).click();
 await expect(page).toHaveURL(/\/garden$/);
 await page.reload();
 await page.getByRole('button',{name:/FUNDSTÜCK 01/}).click();
 await page.getByRole('textbox').fill('Fiktiv: die Person war unterwegs.');
 await page.getByRole('button',{name:'Rückblick auf diesem Gerät speichern',exact:true}).click();
 await page.reload();
 await page.getByRole('button',{name:/FUNDSTÜCK 01/}).click();
 await expect(page.getByRole('textbox')).toHaveValue('Fiktiv: die Person war unterwegs.');
 await page.getByRole('button',{name:'Dieses Fundstück löschen',exact:true}).click();
 expect(await page.evaluate(()=>localStorage.getItem('noocene:garden:v1'))).toBeNull();
 await expect(page.getByText('Dein erstes Fundstück wartet noch.')).toBeVisible();
});
test('world selection is keyboard accessible and has no horizontal overflow',async({page})=>{
 await page.goto('/');
 await page.setViewportSize({width:1440,height:1000});
 await page.screenshot({path:'test-results/world-desktop.png',fullPage:true});
 await page.setViewportSize({width:360,height:800});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const choice=page.getByRole('button',{name:/Inner Weather/});
 await choice.focus();await page.keyboard.press('Enter');await expect(choice).toHaveAttribute('aria-pressed','true');
});
