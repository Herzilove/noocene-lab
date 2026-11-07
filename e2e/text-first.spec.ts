import {test,expect} from '@playwright/test';
test('writing comes first; blanks never call Claude and examples fill the same editable field',async({page})=>{
 let calls=0;await page.route('**/api/personal',route=>{calls++;return route.fulfill({status:502,json:{error:'test-only'}});});
 await page.setViewportSize({width:390,height:844});
 await page.goto('/innerspace');
 const input=page.getByRole('textbox',{name:'Your moment',exact:true});
 await expect(input).toBeVisible();await expect(input).toHaveValue('');
 await page.screenshot({path:'test-results/text-first-mobile.png',fullPage:true,animations:'disabled'});
 await expect(page.getByRole('button',{name:/^Next/})).toBeDisabled();
 await input.fill('   ');await expect(page.getByRole('button',{name:/^Next/})).toBeDisabled();
 expect(calls).toBe(0);await expect(page.getByText(/Add a moment and a thought for Claude/)).toHaveCount(0);
 const firstChoice=page.getByRole('button',{name:/A message goes unanswered/});
 expect(await input.evaluate((el)=>el.compareDocumentPosition(document.querySelector('.prompt-options')!)&Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
 await firstChoice.click();await expect(input).toHaveValue('A message goes unanswered.');
 await page.getByRole('button',{name:/More ideas/}).click();await expect(page.getByRole('button',{name:/I’m about to make a decision/})).toBeVisible();
 await input.fill('My own fictional moment.');await page.getByRole('button',{name:/^Next/}).click();
 await expect(page.getByRole('textbox',{name:'Your first thought',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:/^Next/})).toBeDisabled();expect(calls).toBe(0);
});
