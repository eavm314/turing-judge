import { BLANK } from '@/constants/symbols';
import { type JsonTm } from '@/lib/schemas/turing-machine';
import { expect, type Page, test } from '@playwright/test';
import {
  addState,
  addTransitionRule,
  editTransitionAndAddRule,
  moveState,
  switchFinal,
} from './utils/actions';
import { invertBinary, unaryIncrement } from './utils/expected-designs';

const compareJsonExport = async (page: Page, expected: JsonTm) => {
  await page.getByRole('button', { name: 'Export' }).click();

  const jsonString = await page.getByTestId('editor-content').textContent();
  const json = JSON.parse(jsonString || '{}');

  expect(json.type).toBe('TM');
  expect(json.automaton).toMatchObject(expected);
};

test.beforeEach(async ({ page }) => {
  await page.goto('/playground?type=tm');
});

test.describe('TM designs', () => {
  test('should create unary increment machine', async ({ page }) => {
    await addTransitionRule(page, 'q0', 'q0', {
      read: '1',
      write: '1',
      move: 'R',
    });

    await moveState(page, 'q0', -100, 0);
    await addState(page, 'q1');
    await moveState(page, 'q1', 100, 0);
    await addTransitionRule(page, 'q0', 'q1', {
      read: BLANK,
      write: '1',
      move: 'S',
    });

    await switchFinal(page, 'q1');

    await expect(page.getByTestId('determinism-badge')).toHaveText('Deterministic');
    await compareJsonExport(page, unaryIncrement);
  });

  test('should create binary invert machine', async ({ page }) => {
    await addTransitionRule(page, 'q0', 'q0', {
      read: '0',
      write: '1',
      move: 'R',
    });

    await editTransitionAndAddRule(page, 'q0->q0', {
      read: '1',
      write: '0',
      move: 'R',
    });

    await moveState(page, 'q0', -100, 0);
    await addState(page, 'q1');
    await moveState(page, 'q1', 100, 0);
    await addTransitionRule(page, 'q0', 'q1', {
      read: BLANK,
      write: BLANK,
      move: 'S',
    });

    await switchFinal(page, 'q1');

    await expect(page.getByTestId('determinism-badge')).toHaveText('Deterministic');
    await compareJsonExport(page, invertBinary);
  });
});
