import { test, expect } from '@playwright/test';
test('three steps produce grounded insights, cited help and a voluntary revisit',async ({page})=>{
 test.setTimeout(60000);
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 await expect(page.getByText('Social Orbit',{exact:true})).toHaveCount(0);
 await page.screenshot({path:'test-results/world-mobile.png',fullPage:true});
 await page.getByRole('link',{name:/Meinen Moment erkunden/}).click();
 await expect(page).toHaveURL(/\/innerspace$/);
 expect(await page.locator('.journey-route>div').count()).toBe(3);
 const answers=['Die Nachricht blieb zwei Stunden unbeantwortet','Alle ignorieren mich','Vielleicht ist die Person beschäftigt'];
 for(let i=0;i<3;i++){
  await page.getByRole('button',{name:'✎ Eigene Worte',exact:true}).click();
  await page.getByRole('textbox').fill(answers[i]);
  if(i===1){await page.getByText('◉ Kurzer Reality Check',{exact:true}).click();await page.getByRole('button',{name:'Gedeutet',exact:true}).click();await expect(page.getByRole('status').filter({hasText:'Deutung'})).toBeVisible();}
  await page.getByRole('button',{name:i===2?/Meine Denkwerkzeuge/:/^Weiter/}).click();
 }
 await expect(page.getByRole('heading',{name:'Eine Verallgemeinerung prüfen'})).toBeVisible();
 await expect(page.getByText(/In deinem Satz steht „Alle“/)).toBeVisible();
 await page.getByRole('button',{name:/Eine offene Frage stellen/}).click();
 await page.getByText('⌁ Quellen & weitere Hilfen',{exact:true}).click();
 await expect(page.getByRole('link',{name:/Fleming & Lau/})).toHaveAttribute('href','https://doi.org/10.3389/fnhum.2014.00443');
 await expect(page.getByRole('link',{name:/Schooler et al/})).toBeVisible();
 await expect(page.getByRole('link',{name:/Ayduk & Kross/})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('noocene:garden:v1'))).toBeNull();
 await page.screenshot({path:'test-results/discovery-world.png',fullPage:true});
 await page.getByRole('button',{name:/In meinen Garten legen/}).click();
 expect(await page.evaluate(()=>localStorage.getItem('noocene:garden:v1'))).toBeNull();
 await page.getByRole('button',{name:'Ja, auf diesem Gerät speichern',exact:true}).click();
 await page.getByRole('link',{name:/Dein Garten wartet/}).click();
 await expect(page).toHaveURL(/\/garden$/);
 await page.reload();
 await page.getByRole('button',{name:/FUNDSTÜCK 01/}).click();
 await expect(page.getByText(answers[0],{exact:true})).toBeVisible();
 await expect(page.getByText('Eine offene Frage stellen',{exact:true})).toBeVisible();
 await page.getByRole('textbox').fill('Fiktiv: die Person war unterwegs.');
 await page.getByRole('button',{name:'Rückblick auf diesem Gerät speichern',exact:true}).click();
 await page.reload();
 await page.getByRole('button',{name:/FUNDSTÜCK 01/}).click();
 await expect(page.getByRole('textbox')).toHaveValue('Fiktiv: die Person war unterwegs.');
 await page.getByRole('button',{name:'Dieses Fundstück löschen',exact:true}).click();
 expect(await page.evaluate(()=>localStorage.getItem('noocene:garden:v1'))).toBeNull();
});
test('one entry point is keyboard accessible and mobile has no horizontal overflow',async({page})=>{
 await page.goto('/');
 await page.setViewportSize({width:1440,height:1000});
 await page.screenshot({path:'test-results/world-desktop.png',fullPage:true});
 await page.setViewportSize({width:360,height:800});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const entry=page.getByRole('link',{name:/Meinen Moment erkunden/});
 await entry.focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(/\/innerspace$/);
});
