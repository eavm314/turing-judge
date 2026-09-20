import { expect, test, type Page } from '@playwright/test';

const expectNoHorizontalScroll = async (page: Page) => {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
};

test.describe('Platform navigation', () => {
  test('header fits and burger menu navigates', async ({ page }) => {
    await page.goto('/');
    await expectNoHorizontalScroll(page);

    // Desktop nav links are hidden; the burger opens them in a sheet
    await expect(page.getByRole('link', { name: 'Problem Set' })).toBeHidden();
    await page.getByRole('button', { name: 'Open menu' }).tap();
    await page.getByRole('link', { name: 'Docs' }).tap();
    await expect(page).toHaveURL(/\/docs$/);
  });

  test('docs sidebar is reachable through the drawer', async ({ page }) => {
    await page.goto('/docs');
    await expectNoHorizontalScroll(page);

    await page.getByRole('button', { name: 'Introduction' }).tap();
    await expect(page.getByRole('heading', { name: 'Documentation' })).toBeVisible();
    await page.getByRole('link', { name: 'Finite State Machine' }).tap();
    await expect(page).toHaveURL(/\/docs\/fsm$/);
    await expect(page.getByRole('button', { name: 'Finite State Machine' })).toBeVisible();
  });
});

test.describe('Playground on mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/playground');
    await expect(page.getByTestId('q0')).toBeVisible();
  });

  test('layout fits and the side panel opens as a sheet', async ({ page }) => {
    await expectNoHorizontalScroll(page);

    await page.getByRole('button', { name: 'Open automaton panel' }).tap();
    await expect(page.getByRole('heading', { name: 'Automaton Panel' })).toBeVisible();
    await expect(page.getByTestId('alphabet-input')).toBeVisible();
    await expect(page.getByTestId('test-input')).toBeVisible();

    await page.getByRole('button', { name: 'Close' }).tap();
    await expect(page.getByRole('heading', { name: 'Automaton Panel' })).toBeHidden();
  });

  test('states can be added, renamed and deleted by touch', async ({ page }) => {
    await page.getByRole('button', { name: 'Add State' }).tap();
    await page.getByTestId('modal-input').fill('q1');
    await page.getByRole('button', { name: 'OK' }).tap();
    await expect(page.getByTestId('q1')).toBeVisible();

    // Tapping a state surfaces its toolbar
    await page.getByTestId('q1').tap();
    await page.getByRole('button', { name: 'Rename state' }).tap();
    await page.getByTestId('modal-input').fill('q2');
    await page.getByRole('button', { name: 'OK' }).tap();
    await expect(page.getByTestId('q2')).toBeVisible();

    await page.getByTestId('q2').tap();
    await page.getByRole('button', { name: 'Delete state' }).tap();
    await expect(page.getByTestId('q2')).toBeHidden();
  });

  test('manual simulation shows the bottom overlay with the canvas visible', async ({ page }) => {
    await page.getByRole('button', { name: 'Open automaton panel' }).tap();
    await page.getByRole('button', { name: 'Manual Simulation' }).tap();

    // The sheet auto-closes so the canvas stays visible; the overlay takes over
    await expect(page.getByRole('heading', { name: 'Automaton Panel' })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Stop simulation' })).toBeVisible();
    await expect(page.getByTestId('q0')).toBeVisible();

    await page.getByRole('button', { name: 'Stop simulation' }).tap();
    await expect(page.getByRole('button', { name: 'Stop simulation' })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Add State' })).toBeVisible();
  });
});
