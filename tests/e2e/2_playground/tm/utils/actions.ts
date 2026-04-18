import { expect, type Page } from '@playwright/test';

export const switchMode = async (page: Page, mode: 'States' | 'Transitions') => {
  await page.getByRole('button', { name: mode }).click();
};

export const switchFinal = async (page: Page, stateName: string) => {
  const state = page.getByTestId(stateName);
  await state.click();
  await page.getByRole('button', { name: 'Final' }).click();
};

export const moveState = async (page: Page, stateName: string, dx: number, dy: number) => {
  await switchMode(page, 'States');
  const state = page.getByTestId(stateName);
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

export const addState = async (page: Page, stateName: string) => {
  await switchMode(page, 'States');
  await page.getByRole('button', { name: 'Add State' }).click();
  await page.getByTestId('modal-input').fill(stateName);
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByTestId(stateName)).toBeVisible();
};

export const addAlphabetSymbol = async (page: Page, symbol: string) => {
  await page.getByTestId('alphabet-input').fill(symbol);
  await page.getByRole('button', { name: 'Add', exact: true }).click();
};

const selectRuleValue = async (page: Page, index: number, value: string) => {
  await page.locator('[data-transition-select]').nth(index).click();
  await page.getByRole('option', { name: value, exact: true }).click();
};

export const addTmRuleInModal = async (
  page: Page,
  read: string,
  write: string,
  move: 'L' | 'R' | 'S',
) => {
  await selectRuleValue(page, 0, read);
  await selectRuleValue(page, 1, write);
  await selectRuleValue(page, 2, move);
  await page.getByRole('button', { name: 'Add This Rule' }).click();
};

export const addTransitionRule = async (
  page: Page,
  from: string,
  to: string,
  rule: { read: string; write: string; move: 'L' | 'R' | 'S' },
) => {
  await switchMode(page, 'Transitions');

  const fromState = page.getByTestId(from);
  const toState = page.getByTestId(to);

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

  await addTmRuleInModal(page, rule.read, rule.write, rule.move);
  await page.getByRole('button', { name: 'OK' }).click();
};

export const editTransitionAndAddRule = async (
  page: Page,
  edgeName: string,
  rule: { read: string; write: string; move: 'L' | 'R' | 'S' },
) => {
  const edge = page.getByTestId(edgeName);
  await edge.dblclick();
  await addTmRuleInModal(page, rule.read, rule.write, rule.move);
  await page.getByRole('button', { name: 'OK' }).click();
};
