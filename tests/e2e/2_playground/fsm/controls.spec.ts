import { EPSILON } from '@/constants/symbols';
import { expect, test } from '@playwright/test';
import { addState, addTransition, deleteState, moveState, switchMode } from './utils/actions';

test.beforeEach(async ({ page }) => {
  await page.goto('/playground');
});

test.describe('Basic controls', () => {
  test('should change styles', async ({ page }) => {
    const banner = page.getByRole('banner');
    await expect(banner).not.toContainText('You have unsaved changes');

    const initialState = page.getByTestId('q0');

    await expect(initialState).toBeVisible();
    await expect(initialState).toContainClass('border-foreground');

    await initialState.click();
    await expect(initialState).toContainClass('border-green-500');
    await expect(initialState).not.toContainClass('outline');

    const finalButton = page.getByRole('button', { name: 'Final' });
    await finalButton.click();
    await expect(initialState).toContainClass('outline');
    await expect(banner).toContainText('You have unsaved changes');

    await finalButton.click();
    await finalButton.press('Escape');
    await expect(initialState).not.toContainClass('outline');
    await expect(initialState).toContainClass('border-foreground');
  });

  [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ].forEach(([dx, dy]) => {
    test(`should move state (${dx}, ${dy})`, async ({ page }) => {
      const banner = page.getByRole('banner');
      await expect(banner).not.toContainText('You have unsaved changes');

      const length = 100;
      await moveState(page, 'q0', dx * length, dy * length);

      await expect(banner).toContainText('You have unsaved changes');
    });
  });

  test('should add and edit state', async ({ page }) => {
    const banner = page.getByRole('banner');
    await expect(banner).not.toContainText('You have unsaved changes');
    await page.getByRole('button', { name: 'Add State' }).click();

    const input = page.getByTestId('modal-input');
    const textError = page.locator('p.text-destructive');
    const okButton = page.getByRole('button', { name: 'OK' });

    await expect(input).toHaveValue('');
    await expect(textError).not.toBeAttached();

    await okButton.click();
    await expect(textError).toBeAttached();
    await expect(textError).toHaveText('State name must contain 1 to 3 characters');

    const validateNameErrors = async () => {
      await input.fill('new1');
      await expect(textError).toHaveText('State name must contain 1 to 3 characters');

      await input.fill('');
      await expect(textError).toHaveText('State name must contain 1 to 3 characters');

      await input.fill('++');
      await expect(textError).toHaveText('State name can only contain letters and numbers');

      await input.fill('q0');
      await expect(textError).toHaveText('State name must be unique');
    };

    await validateNameErrors();

    await input.fill('new');
    await expect(textError).not.toBeAttached();

    await okButton.click();

    const newState = page.getByTestId('new');
    await expect(newState).toBeVisible();

    await expect(banner).toContainText('You have unsaved changes');

    await moveState(page, 'new', 100, 0);
    newState.dblclick();

    await expect(input).toHaveValue('new');
    await expect(textError).not.toBeAttached();

    await validateNameErrors();

    await input.fill('q1');
    await expect(textError).not.toBeAttached();

    await okButton.click();

    await expect(page.getByTestId('q1')).toBeVisible();
  });

  test('should delete state', async ({ page }) => {
    const banner = page.getByRole('banner');
    await expect(banner).not.toContainText('You have unsaved changes');

    await addState(page, 'q1');
    await expect(banner).toContainText('You have unsaved changes');

    await deleteState(page, 'q1');
    await expect(page.getByTestId('q1')).not.toBeVisible();
  });

  test('should not delete initial state', async ({ page }) => {
    await deleteState(page, 'q0');
    await expect(page.getByTestId('q0')).toBeVisible();
    const notificationsRegion = page.getByRole('region');
    await expect(notificationsRegion).toBeAttached();

    const notification = notificationsRegion.getByText('Initial state cannot be removed');
    await expect(notification).toBeVisible();
  });

  test('should add, edit and delete transition', async ({ page }) => {
    await addState(page, 'q1');
    await moveState(page, 'q1', 200, 0);

    await addTransition(page, 'q0', 'q1', ['0']);

    const transition = page.getByTestId('q0->q1');
    await expect(transition).toBeVisible();
    await expect(transition).toContainText('0');
    await expect(transition).toContainClass('border-foreground');

    await transition.click();
    await expect(transition).toContainClass('border-green-500');

    await transition.dblclick();
    await page.getByRole('checkbox', { name: '1' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    await expect(transition).toContainText('0,1');
    await transition.click();
    await transition.press('Backspace');

    await expect(transition).not.toBeVisible();
  });

  test('should add auto-transition', async ({ page }) => {
    await addTransition(page, 'q0', 'q0', ['1']);
    const transition = page.getByTestId('q0->q0');
    await expect(transition).toBeVisible();
    await expect(transition).toContainText('1');
  });
});

test.describe('Alphabet controls', () => {
  test('should add and delete symbols', async ({ page }) => {
    const banner = page.getByRole('banner');
    await expect(banner).not.toContainText('You have unsaved changes');

    await switchMode(page, 'Transitions');

    const state = page.getByTestId('q0');

    const box = await state.boundingBox();
    if (!box) throw new Error('Node not visible');

    const fromX = box.x + box.width / 2;
    const fromY = box.y + box.height / 2;

    await page.mouse.move(fromX, fromY);
    await page.mouse.down();
    await page.mouse.move(fromX + 10, fromY, { steps: 2 });
    await page.mouse.up();

    await expect(page.getByRole('checkbox', { name: '0' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: '1' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: '2' })).not.toBeVisible();
    await expect(page.getByRole('checkbox', { name: EPSILON })).not.toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();

    await page.getByTestId('alphabet-input').click();
    await page.getByTestId('alphabet-input').fill('2');
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await page.getByTestId('alphabet-input').click();

    await page.mouse.move(fromX, fromY);
    await page.mouse.down();
    await page.mouse.move(fromX + 10, fromY, { steps: 2 });
    await page.mouse.up();

    await expect(page.getByRole('checkbox', { name: '0' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: '1' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: '2' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: EPSILON })).not.toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();

    await page.getByRole('button', { name: EPSILON }).click();
    await page.locator('span:has-text("1") + button:has-text("x")').click();

    await page.mouse.move(fromX, fromY);
    await page.mouse.down();
    await page.mouse.move(fromX + 10, fromY, { steps: 2 });
    await page.mouse.up();

    await expect(page.getByRole('checkbox', { name: '0' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: '1' })).not.toBeVisible();
    await expect(page.getByRole('checkbox', { name: '2' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: EPSILON })).toBeVisible();
  });

  test('should not add duplicate symbols nor special characters', async ({ page }) => {
    const input = page.getByTestId('alphabet-input');
    const addButton = page.getByRole('button', { name: 'Add', exact: true });

    await input.fill('1');
    await addButton.click();
    await expect(page.locator('span:has-text("1") + button:has-text("x")')).toHaveCount(1);

    await input.fill('!');
    await addButton.click();
    await expect(page.locator('span:has-text("!") + button:has-text("x")')).toHaveCount(0);

    await input.fill('*');
    await addButton.click();
    await expect(page.locator('span:has-text("*") + button:has-text("x")')).toHaveCount(0);
  });

  test('should not remove used symbols', async ({ page }) => {
    await addTransition(page, 'q0', 'q0', ['1']);
    const removeButton = page.locator('span:has-text("1") + button');
    await removeButton.click();

    const notificationsRegion = page.getByRole('region');
    await expect(notificationsRegion).toBeAttached();
    const notification = notificationsRegion.getByText('Cannot remove symbol');
    await expect(notification).toBeVisible();
  });
});
