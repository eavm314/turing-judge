import { BLANK } from '@/constants/symbols';
import { expect, test } from '@playwright/test';
import {
  addState,
  addTmRuleInModal,
  addTransitionRule,
  connectStates,
  editTransitionAndAddRule,
  moveState,
} from './utils/actions';

test.beforeEach(async ({ page }) => {
  await page.goto('/playground?type=tm');
});

test.describe('TM controls', () => {
  test('should add and edit transition rules with the TM modal', async ({ page }) => {
    await addState(page, 'q1');
    await moveState(page, 'q1', 200, 0);

    await addTransitionRule(page, 'q0', 'q1', {
      read: '0',
      write: '1',
      move: 'R',
    });

    const edge = page.getByTestId('q0->q1');
    await expect(edge).toBeVisible();
    await expect(edge).toContainText('0/1,R');

    await editTransitionAndAddRule(page, 'q0->q1', {
      read: BLANK,
      write: BLANK,
      move: 'S',
    });

    await edge.click();
    await expect(edge).toContainText(`${BLANK}/${BLANK},S`);
  });

  test('should not create a transition without rules', async ({ page }) => {
    await addState(page, 'q1');
    await moveState(page, 'q1', 200, 0);

    await connectStates(page, 'q0', 'q1');
    await expect(page.getByRole('button', { name: 'OK' })).toBeDisabled();
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByTestId('q0->q1')).toHaveCount(0);
  });

  test('should enable the confirm button only once the rules change', async ({ page }) => {
    await addState(page, 'q1');
    await moveState(page, 'q1', 200, 0);

    await addTransitionRule(page, 'q0', 'q1', {
      read: '0',
      write: '1',
      move: 'R',
    });

    const confirm = page.getByRole('button', { name: 'OK' });
    const deleteRule = page.getByRole('button', { name: 'Delete rule' });

    await page.getByTestId('q0->q1').dblclick();
    await expect(confirm).toBeDisabled();

    await addTmRuleInModal(page, BLANK, BLANK, 'S');
    await expect(confirm).toBeEnabled();

    await deleteRule.last().click();
    await expect(confirm).toBeDisabled();

    await deleteRule.first().click();
    await expect(confirm).toBeEnabled();
  });

  test('should create a self-loop TM transition', async ({ page }) => {
    await addTransitionRule(page, 'q0', 'q0', {
      read: '1',
      write: '1',
      move: 'R',
    });

    const edge = page.getByTestId('q0->q0');
    await expect(edge).toBeVisible();
    await expect(edge).toContainText('1/1,R');
  });
});
