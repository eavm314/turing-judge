import { test, expect } from '@playwright/test';

test('Home Page', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'TuringJudge' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Go to Playground' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
});
