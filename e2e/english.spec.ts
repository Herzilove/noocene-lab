import { test, expect } from '@playwright/test';
test('all public and admin surfaces use English, including server errors',async({page})=>{
 test.setTimeout(60000);
 await page.setViewportSize({width:390,height:844});
 const routes=[['/','Step out of'],['/innerspace','What happened?'],['/garden','A place to grow'],['/research','A fresh perspective.'],['/privacy','You choose'],['/quest','Surprise'],['/quest/discovery','Start with'],['/admin/research','Trials.']];
 for(const[path,heading]of routes){
  await page.goto(path);
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.getByRole('heading',{level:1})).toContainText(heading);
  await expect(page.getByRole('navigation',{name:'Main navigation'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path+' must fit mobile').toBe(true);
 }
 await page.getByLabel('Admin token',{exact:true}).fill('test-invalid-token-12345678901234567890');
 await page.getByRole('button',{name:/Load protected data/}).click();
 await expect(page.getByRole('main').getByRole('alert')).toHaveText('Access unavailable. Please check your admin token.');
 const denied=await page.evaluate(async()=>{const response=await fetch('/api/research');return {status:response.status,body:await response.json()};});
 expect(denied.status).toBe(401);
 expect(denied.body).toEqual({error:'Access denied.'});
});
