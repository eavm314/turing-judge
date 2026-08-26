import { BOTTOM, EPSILON } from '@/constants/symbols';
import { expect, test } from '@playwright/test';
import {
  addStackAlphabetSymbol,
  addState,
  addTransitionRule,
  editTransitionAndAddRule,
  moveState,
} from './utils/actions';

test.beforeEach(async ({ page }) => {
  await page.goto('/playground?type=pda');
});

test.describe('PDA controls', () => {
  test('should add and edit transition rules with the PDA modal', async ({ page }) => {
    await addState(page, 'q1');
    await moveState(page, 'q1', 200, 0);

    await addTransitionRule(page, 'q0', 'q1', {
      input: '0',
      pop: BOTTOM,
      push: ['A', BOTTOM],
    });

    const edge = page.getByTestId('q0->q1');
    await expect(edge).toBeVisible();
    await expect(edge).toContainText(`0,${BOTTOM}/A${BOTTOM}`);

    await page.getByRole('button', { name: EPSILON }).click();
    await editTransitionAndAddRule(page, 'q0->q1', {
      input: EPSILON,
      pop: 'A',
      push: [],
    });

    await edge.click();
    await expect(edge).toContainText(`${EPSILON},A/${EPSILON}`);
  });

  test('should add and delete stack alphabet symbols', async ({ page }) => {
    await addStackAlphabetSymbol(page, 'Z');
    await expect(page.locator('span:has-text("Z") + button:has-text("x")')).toHaveCount(1);

    await page.locator('span:has-text("Z") + button:has-text("x")').click();
    await expect(page.locator('span:has-text("Z") + button:has-text("x")')).toHaveCount(0);
  });

  test('should not remove a stack symbol used in transitions', async ({ page }) => {
    await addState(page, 'q1');
    await moveState(page, 'q1', 200, 0);

    await addTransitionRule(page, 'q0', 'q1', {
      input: '0',
      pop: BOTTOM,
      push: ['A', BOTTOM],
    });

    await page.locator('span:has-text("A") + button:has-text("x")').click();

    const notificationsRegion = page.getByRole('region', { name: /Notifications/ });
    await expect(notificationsRegion).toContainText('Cannot remove symbol');
  });
});
