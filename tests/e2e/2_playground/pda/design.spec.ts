import { BOTTOM, EPSILON } from '@/constants/symbols';
import { type JsonPda } from '@/lib/schemas/pushdown-automaton';
import { expect, type Page, test } from '@playwright/test';
import {
  addAlphabetSymbol,
  addStackAlphabetSymbol,
  addState,
  addTransitionRule,
  editTransitionAndAddRule,
  moveState,
  removeAlphabetSymbol,
  removeStackAlphabetSymbol,
  switchFinal,
} from './utils/actions';
import { anbn, balancedParentheses } from './utils/expected-designs';

const compareJsonExport = async (page: Page, expected: JsonPda) => {
  await page.getByRole('button', { name: 'Export' }).click();

  const jsonString = await page.getByTestId('editor-content').textContent();
  const json = JSON.parse(jsonString || '{}');

  expect(json.type).toBe('PDA');
  expect(json.automaton).toMatchObject(expected);
};

test.beforeEach(async ({ page }) => {
  await page.goto('/playground?type=pda');
});

test.describe('PDA designs', () => {
  test('should create PDA for balanced parentheses', async ({ page }) => {
    await removeAlphabetSymbol(page, '0');
    await removeAlphabetSymbol(page, '1');

    await addAlphabetSymbol(page, '(');
    await addAlphabetSymbol(page, ')');
    await page.getByRole('button', { name: EPSILON }).click();

    await removeStackAlphabetSymbol(page, 'A');
    await addStackAlphabetSymbol(page, '*');

    await switchFinal(page, 'q0');

    await addTransitionRule(page, 'q0', 'q0', {
      input: '(',
      pop: BOTTOM,
      push: ['*', BOTTOM],
    });

    await editTransitionAndAddRule(page, 'q0->q0', {
      input: '(',
      pop: '*',
      push: ['*', '*'],
    });

    await editTransitionAndAddRule(page, 'q0->q0', {
      input: ')',
      pop: '*',
      push: [],
    });

    await expect(page.getByTestId('determinism-badge')).toHaveText('Deterministic');
    await compareJsonExport(page, balancedParentheses);
  });

  test('should create PDA for a^n b^n', async ({ page }) => {
    await removeAlphabetSymbol(page, '0');
    await removeAlphabetSymbol(page, '1');

    await addAlphabetSymbol(page, 'a');
    await addAlphabetSymbol(page, 'b');
    await page.getByRole('button', { name: EPSILON }).click();

    await moveState(page, 'q0', -200, 0);
    await addState(page, 'q1');
    await moveState(page, 'q1', 0, 140);
    await addState(page, 'q2');
    await moveState(page, 'q2', 200, 0);

    await addTransitionRule(page, 'q0', 'q0', {
      input: 'a',
      pop: BOTTOM,
      push: ['A', BOTTOM],
    });

    await editTransitionAndAddRule(page, 'q0->q0', {
      input: 'a',
      pop: 'A',
      push: ['A', 'A'],
    });

    await addTransitionRule(page, 'q0', 'q1', {
      input: 'b',
      pop: 'A',
      push: [],
    });

    await addTransitionRule(page, 'q1', 'q1', {
      input: 'b',
      pop: 'A',
      push: [],
    });

    await addTransitionRule(page, 'q1', 'q2', {
      input: EPSILON,
      pop: BOTTOM,
      push: [BOTTOM],
    });

    await switchFinal(page, 'q2');

    await expect(page.getByTestId('determinism-badge')).toHaveText('Deterministic');
    await compareJsonExport(page, anbn);
  });
});
