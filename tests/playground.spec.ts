import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/playground');
});

test.describe('Basic Control', () => {
  test('should switch final state', async ({ page }) => {
    await expect(page.getByRole('banner')).not.toContainText('You have unsaved changes');

    const initialState = page.getByTestId('state-q0');

    await expect(initialState).toBeVisible();
    await expect(initialState).toContainClass('border-foreground');

    await initialState.click();
    await expect(initialState).toContainClass('border-green-500');
    await expect(initialState).not.toContainClass('outline');

    await page.getByRole('button', { name: 'Final' }).click();
    await expect(initialState).toContainClass('outline');
    await expect(page.getByRole('banner')).toContainText('You have unsaved changes');

    await page.getByRole('button', { name: 'Final' }).click();
    await page.getByRole('button', { name: 'Final' }).press('Escape');
    await expect(initialState).not.toContainClass('outline');
    await expect(initialState).toContainClass('border-foreground');
  });

  [
    [1, 0],
    [0, 1],
    [1, 1],
    [-1, 0],
    [0, -1],
    [-1, -1],
  ].forEach(([dx, dy]) => {
    test(`should move state (${dx}, ${dy})`, async ({ page }) => {
      await expect(page.getByRole('banner')).not.toContainText('You have unsaved changes');

      const initialState = page.getByTestId('state-q0');
      const box = await initialState.boundingBox();
      if (!box) throw new Error('Node not visible');

      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;

      await page.mouse.move(startX, startY);
      await page.mouse.down();

      const length = 10;
      const steps = 5;
      await page.mouse.move(startX + length * steps * dx, startY + length * steps * dy, { steps });
      await page.mouse.up();

      const newBox = await initialState.boundingBox();
      if (!newBox) throw new Error('Node not visible');

      const newX = newBox.x + newBox.width / 2;
      const newY = newBox.y + newBox.height / 2;

      expect(newX).toBe(startX + length * (steps - 1) * dx);
      expect(newY).toBe(startY + length * (steps - 1) * dy);

      await expect(page.getByRole('banner')).toContainText('You have unsaved changes');
    });
  });
});
