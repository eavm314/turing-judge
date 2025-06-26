import { EPSILON } from '@/constants/symbols';
import { type JsonFsm } from '@/lib/schemas/finite-state-machine';
import { expect, type Page, test } from '@playwright/test';
import { addState, addTransition, moveState, switchFinal } from './utils/actions';
import {
  basicAutomata,
  endsWith01,
  epsilonTransitions,
  evenOnes,
  simpleNonDet,
} from './utils/expected-designs';

const compareJsonExport = async (page: Page, expected: JsonFsm) => {
  await page.getByRole('button', { name: 'Export' }).click();

  const jsonString = await page.getByTestId('editor-content').textContent();
  const json = JSON.parse(jsonString || '{}');

  expect(json.type).toBe('FSM');
  expect(json.automaton).toMatchObject(expected);
};

test.beforeEach(async ({ page }) => {
  await page.goto('/playground');
});

test.describe('Deterministic FSM Design', () => {
  test('should create basic FSM', async ({ page }) => {
    await expect(page.getByTestId('determinism-badge')).toHaveText('Deterministic');
    await compareJsonExport(page, basicAutomata);
  });

  test('should create FSM for "even ones"', async ({ page }) => {
    await moveState(page, 'q0', -100, 0);
    await addState(page, 'q1');
    await moveState(page, 'q1', 100, 0);
    await addTransition(page, 'q0', 'q0', ['0']);
    await addTransition(page, 'q0', 'q1', ['1']);
    await addTransition(page, 'q1', 'q0', ['1']);
    await addTransition(page, 'q1', 'q1', ['0']);
    await switchFinal(page, 'q0');

    await expect(page.getByTestId('determinism-badge')).toHaveText('Deterministic');
    await compareJsonExport(page, evenOnes);
  });

  test('should create FSM for "ends with 01"', async ({ page }) => {
    await moveState(page, 'q0', -200, 0);
    await addState(page, 'q1');
    await addState(page, 'q2');
    await moveState(page, 'q2', 200, 0);
    await addTransition(page, 'q0', 'q0', ['1']);
    await addTransition(page, 'q0', 'q1', ['0']);
    await addTransition(page, 'q1', 'q1', ['0']);
    await addTransition(page, 'q1', 'q2', ['1']);
    await addTransition(page, 'q2', 'q1', ['0']);
    await addTransition(page, 'q2', 'q0', ['1']);
    await switchFinal(page, 'q2');

    await expect(page.getByTestId('determinism-badge')).toHaveText('Deterministic');
    await compareJsonExport(page, endsWith01);
  });
});

test.describe('Non-deterministic FSM Design', () => {
  test('should create simple non-det FSM', async ({ page }) => {
    await moveState(page, 'q0', -200, 0);
    await addState(page, 'q2');
    await moveState(page, 'q2', 200, 0);
    await addTransition(page, 'q0', 'q0', ['0', '1']);
    await addTransition(page, 'q0', 'q2', ['1']);
    await switchFinal(page, 'q2');

    await expect(page.getByTestId('determinism-badge')).toHaveText('Non-deterministic');
    await compareJsonExport(page, simpleNonDet);
  });

  test('should create non-det FSM for "0* u 01"', async ({ page }) => {
    await moveState(page, 'q0', -200, 0);
    await addState(page, 'q1');
    await moveState(page, 'q1', -100, 100);
    await addState(page, 'q2');
    await moveState(page, 'q2', -100, -100);
    await addState(page, 'q3');
    await moveState(page, 'q3', 100, -100);
    await addState(page, 'q4');
    await moveState(page, 'q4', 100, 100);
    await addState(page, 'q5');
    await moveState(page, 'q5', 300, 100);

    await page.getByRole('button', { name: EPSILON }).click();

    await addTransition(page, 'q0', 'q1', [EPSILON]);
    await addTransition(page, 'q0', 'q2', [EPSILON]);
    await addTransition(page, 'q2', 'q3', ['0']);
    await addTransition(page, 'q3', 'q2', [EPSILON]);
    await addTransition(page, 'q1', 'q4', ['0']);
    await addTransition(page, 'q4', 'q5', ['1']);
    await switchFinal(page, 'q3');
    await switchFinal(page, 'q5');

    await expect(page.getByTestId('determinism-badge')).toHaveText('Non-deterministic');
    await compareJsonExport(page, epsilonTransitions);
  });
});
