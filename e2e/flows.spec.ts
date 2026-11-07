import { test, expect } from '@playwright/test';
test('mobile quest completes without consent and server refuses unauthenticated export', async ({page,request}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await page.screenshot({path:'test-results/landing-mobile.png',fullPage:true});
  await page.goto('/quest');
  await page.getByRole('button',{name:/Los geht/}).click();
  await expect(page.getByText('Demo · keine echte KI')).toBeVisible();
  await page.getByRole('button',{name:/^A /}).click();
  await page.getByRole('button',{name:/Antwort festhalten/}).click();
  await page.getByRole('button',{name:/Weiter zur Reflexion/}).click();
  await page.getByRole('button',{name:/Noch einmal entscheiden/}).click();
  await page.getByRole('button',{name:/^C /}).click();
  await page.getByRole('button',{name:/Antwort festhalten/}).click();
  await page.getByRole('button',{name:/Meine Entdeckung ansehen/}).click();
  await expect(page.getByText('DIE AUFLÖSUNG')).toBeVisible();
  await page.screenshot({path:'test-results/quest-discovery.png',fullPage:true});
  expect((await request.get('/api/research')).status()).toBe(401);
});
