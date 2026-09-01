import { test, expect } from '@playwright/test';

test.describe('Sign In', () => {
  test('signin page shows credentials form and provider buttons', async ({ page }) => {
    await page.goto('/signin');
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Google' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'GitHub' })).toBeVisible();
  });

  test('signin modal opens with credentials form', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign In' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel('Email')).toBeVisible();
    await expect(dialog.getByLabel('Password')).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('empty credentials show validation errors', async ({ page }) => {
    await page.goto('/signin');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Invalid email address.')).toBeVisible();
    await expect(page.getByText('Password is required.')).toBeVisible();
  });
});

test.describe('Access control', () => {
  test('unauthenticated /admin redirects to home', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL('/');
  });

  test('unauthenticated /profile redirects to home', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL('/');
  });
});
