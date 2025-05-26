import { EPSILON } from '@/constants/symbols';
import { test, expect, type Page } from '@playwright/test';

export const switchMode = async (page: Page, mode: string) => {
  const modeButton = page.getByRole('button', { name: mode });
  await modeButton.click();
};

export const switchFinal = async (page: Page, stateId: string) => {
  const state = page.getByTestId(`state-${stateId}`);
  await state.click();
  const finalButton = page.getByRole('button', { name: 'Final' });
  await finalButton.click();
};

export const moveState = async (page: Page, stateId: string, dx: number, dy: number) => {
  await switchMode(page, 'States');
  const state = page.getByTestId(`state-${stateId}`);
  const box = await state.boundingBox();
  if (!box) throw new Error('Node not visible');

  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();

  const steps = 2;
  await page.mouse.move(startX + steps * dx, startY + steps * dy, { steps });
  await page.mouse.up();

  const newBox = await state.boundingBox();
  if (!newBox) throw new Error('Node not visible');

  const newX = newBox.x + newBox.width / 2;
  const newY = newBox.y + newBox.height / 2;

  expect(newX).toBe(startX + (steps - 1) * dx);
  expect(newY).toBe(startY + (steps - 1) * dy);
};

export const addState = async (page: Page, stateId: string) => {
  await switchMode(page, 'States');
  const addButton = page.getByRole('button', { name: 'Add State' });
  await addButton.click();
  const input = page.getByTestId('modal-input');
  const okButton = page.getByRole('button', { name: 'OK' });

  await input.fill(stateId);
  await okButton.click();

  const newState = page.getByTestId(`state-${stateId}`);
  await expect(newState).toBeVisible();
};

export const deleteState = async (page: Page, stateId: string) => {
  const state = page.getByTestId(`state-${stateId}`);
  await state.click();
  await state.press('Backspace');
};

export const addTransition = async (
  page: Page,
  from: string,
  to: string,
  inputSymbols: string[],
) => {
  await switchMode(page, 'Transitions');

  const fromState = page.getByTestId(`state-${from}`);
  const toState = page.getByTestId(`state-${to}`);

  const fromBox = await fromState.boundingBox();
  const toBox = await toState.boundingBox();
  if (!fromBox || !toBox) throw new Error('Node not visible');

  const fromX = fromBox.x + fromBox.width / 2;
  const fromY = fromBox.y + fromBox.height / 2;
  const toX = toBox.x + toBox.width / 2 + 10;
  const toY = toBox.y + toBox.height / 2;

  await page.mouse.move(fromX, fromY);
  await page.mouse.down();
  await page.mouse.move(toX, toY, { steps: 2 });
  await page.mouse.up();

  await expect(page.getByLabel('Add Transition')).toContainText('None');
  for (const symbol of inputSymbols) {
    await page.getByRole('checkbox', { name: symbol }).click();
  }

  await page.getByRole('button', { name: 'OK' }).click();
};

test.beforeEach(async ({ page }) => {
  await page.goto('/playground');
});

test.describe('Basic controls', () => {
  test('should change styles', async ({ page }) => {
    const banner = page.getByRole('banner');
    await expect(banner).not.toContainText('You have unsaved changes');

    const initialState = page.getByTestId('state-q0');

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

    const newState = page.getByTestId('state-new');
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

    await expect(page.getByTestId('state-q1')).toBeVisible();
  });

  test('should delete state', async ({ page }) => {
    const banner = page.getByRole('banner');
    await expect(banner).not.toContainText('You have unsaved changes');

    await addState(page, 'q1');
    await expect(banner).toContainText('You have unsaved changes');

    await deleteState(page, 'q1');
    await expect(page.getByTestId('state-q1')).not.toBeVisible();
  });

  test('should not delete initial state', async ({ page }) => {
    await deleteState(page, 'q0');
    await expect(page.getByTestId('state-q0')).toBeVisible();
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

    const state = page.getByTestId(`state-q0`);

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
