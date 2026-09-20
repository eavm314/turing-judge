import { test, expect, type Page } from '@playwright/test';

const expectNoHorizontalScroll = async (page: Page) => {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
};

test('Home Page', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'TuringJudge' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Go to Playground' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
});

test('decorative glows do not widen the document', async ({ page }) => {
  await page.goto('/');
  await expectNoHorizontalScroll(page);
});

test('scrolled sections resolve to fully opaque', async ({ page }) => {
  await page.goto('/');

  const revealed = page.getByTestId('reveal').first();
  await revealed.scrollIntoViewIfNeeded();
  await expect(revealed).toHaveCSS('opacity', '1');
});

test.describe('reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('below-the-fold content is visible without an observer', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Ready to test your automata?' })).toBeVisible();
    await expect(page.getByTestId('reveal').last()).toHaveCSS('opacity', '1');
  });
});
