import { expect, type Page } from '@playwright/test';

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
