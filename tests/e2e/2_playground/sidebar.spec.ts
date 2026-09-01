import { expect, test } from '@playwright/test';

test.describe('Playground side panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/playground');
    await expect(page.getByTestId('q0')).toBeVisible();
  });

  test('resize and collapse reset to defaults on reload', async ({ page }) => {
    const panel = page.getByTestId('side-menu');
    await expect(panel).toHaveCSS('width', '288px');

    // Drag the resize handle 80px to the left to widen the panel
    const handle = page.getByRole('separator', { name: 'Resize side panel' });
    const handleBox = await handle.boundingBox();
    if (!handleBox) throw new Error('Resize handle not visible');
    const startX = handleBox.x + handleBox.width / 2;
    const startY = handleBox.y + handleBox.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX - 80, startY, { steps: 4 });
    await page.mouse.up();
    await expect(panel).toHaveCSS('width', '368px');

    await page.reload();
    await expect(panel).toHaveCSS('width', '288px');

    await page.getByRole('button', { name: 'Collapse side panel' }).click();
    await expect(panel).toBeHidden();
    await expect(page.getByRole('button', { name: 'Open side panel' })).toBeVisible();

    await page.reload();
    await expect(panel).toHaveCSS('width', '288px');
  });

  test('sections collapse and reopen on reload', async ({ page }) => {
    await expect(page.getByTestId('test-input')).toBeVisible();

    await page.getByRole('button', { name: 'Testing' }).click();
    await expect(page.getByTestId('test-input')).toBeHidden();

    await page.reload();
    await expect(page.getByTestId('side-menu')).toBeVisible();
    await expect(page.getByTestId('test-input')).toBeVisible();
  });
});
