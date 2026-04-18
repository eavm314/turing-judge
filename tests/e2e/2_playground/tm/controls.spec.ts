import { BLANK } from '@/constants/symbols';
import { expect, test } from '@playwright/test';
import { addState, addTransitionRule, editTransitionAndAddRule, moveState } from './utils/actions';

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
