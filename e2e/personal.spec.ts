import { test, expect } from '@playwright/test';
test('three steps produce grounded insights, cited help and a voluntary revisit',async ({page})=>{
 test.setTimeout(60000);
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 await expect(page.getByText('Social Orbit',{exact:true})).toHaveCount(0);
 await page.screenshot({path:'test-results/world-mobile.png',fullPage:true});
 await page.getByRole('link',{name:/Let’s take a look/}).click();
 await expect(page).toHaveURL(/\/innerspace$/);
 expect(await page.locator('.journey-route>div').count()).toBe(3);
 const answers=['The message went unanswered for two hours','Everyone ignores me','Maybe the person is busy'];
 for(let i=0;i<3;i++){
  await page.getByRole('button',{name:'✎ Make it yours',exact:true}).click();
  await page.getByRole('textbox').fill(answers[i]);
  if(i===1){await page.getByText('◉ Quick reality check',{exact:true}).click();await page.getByRole('button',{name:'Interpreted',exact:true}).click();await expect(page.getByRole('status').filter({hasText:'interpretation'})).toBeVisible();}
  await page.getByRole('button',{name:i===2?/See what I noticed/:/^Next/}).click();
 }
 await expect(page.getByRole('heading',{name:'Check a generalization'})).toBeVisible();
 await expect(page.getByText(/Your sentence includes “Everyone”/)).toBeVisible();
 await page.getByRole('button',{name:/Ask an open question/}).click();
 await page.getByText('⌁ Sources & further support',{exact:true}).click();
 await expect(page.getByRole('link',{name:/Fleming & Lau/})).toHaveAttribute('href','https://doi.org/10.3389/fnhum.2014.00443');
 await expect(page.getByRole('link',{name:/Schooler et al/})).toBeVisible();
 await expect(page.getByRole('link',{name:/Ayduk & Kross/})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('noocene:garden:v1'))).toBeNull();
 await page.screenshot({path:'test-results/discovery-world.png',fullPage:true});
 await page.getByRole('button',{name:/Save to my garden/}).click();
 expect(await page.evaluate(()=>localStorage.getItem('noocene:garden:v1'))).toBeNull();
 await page.getByRole('button',{name:'Yes, save on this device',exact:true}).click();
 await page.getByRole('link',{name:/Take me to my garden/}).click();
 await expect(page).toHaveURL(/\/garden$/);
 await page.reload();
 await page.getByRole('button',{name:/DISCOVERY 01/}).click();
 await expect(page.getByText(answers[0],{exact:true})).toBeVisible();
 await expect(page.getByText('Ask an open question',{exact:true})).toBeVisible();
 await page.getByRole('textbox').fill('Fictional: the person was traveling.');
 await page.getByRole('button',{name:'Save my check-in',exact:true}).click();
 await page.reload();
 await page.getByRole('button',{name:/DISCOVERY 01/}).click();
 await expect(page.getByRole('textbox')).toHaveValue('Fictional: the person was traveling.');
 await page.getByRole('button',{name:'Delete this discovery',exact:true}).click();
 expect(await page.evaluate(()=>localStorage.getItem('noocene:garden:v1'))).toBeNull();
});
test('one entry point is keyboard accessible and mobile has no horizontal overflow',async({page})=>{
 await page.goto('/');
 await page.setViewportSize({width:1440,height:1000});
 await page.screenshot({path:'test-results/world-desktop.png',fullPage:true});
 await page.setViewportSize({width:360,height:800});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const entry=page.getByRole('link',{name:/Let’s take a look/});
 await entry.focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(/\/innerspace$/);
});
