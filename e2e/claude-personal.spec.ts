import {test,expect} from '@playwright/test';
test('Pre-consented demo uses Claude by default, shows tailored output and never silently substitutes a model error',async({page})=>{
 let calls=0;
 await page.route('**/api/personal',async route=>{
  const input=route.request().postDataJSON();expect(input.consent).toBe(true);calls++;
  if(calls===2)return route.fulfill({status:502,json:{error:'Test provider timeout'}});
  return route.fulfill({json:{mode:'live',reflection:{question:'Could a busy day explain this unanswered message?',perspectives:['The person may be busy.','You might need more context.'],insight:'A thought is not a fact.',practice:'Ask what happened.',sourceId:'schooler-2011'},provenance:{model:'mock-only',promptVersion:'test',inputTokens:10,outputTokens:10,latencyMs:2}}});
 });
 await page.goto('/innerspace');
 await expect(page.getByRole('checkbox',{name:/Reflect with Claude/})).toHaveCount(0);
 await page.getByRole('button',{name:/A message goes unanswered/}).click();await page.getByRole('button',{name:/^Next/}).click();
 await page.getByRole('button',{name:/Maybe it’s my fault/}).click();await page.getByRole('button',{name:/^Next/}).click();
 await expect(page.getByRole('heading',{name:'Could a busy day explain this unanswered message?'})).toBeVisible();
 await page.getByRole('button',{name:/The person may be busy/}).click();await page.getByRole('button',{name:/Show my discovery/}).click();
 await expect(page.getByRole('alert').filter({hasText:'Test provider timeout'})).toBeVisible();
 await page.getByRole('button',{name:/Keep going without Claude/}).click();
 await expect(page.getByText('A THOUGHT TO TRY · SOLO MODE',{exact:true})).toBeVisible();
 expect(calls).toBe(2);
});
