import { test, expect, type Page } from '@playwright/test';

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

const signInAsAdmin = async (page: Page) => {
  await page.goto('/signin');
  await page.getByLabel('Email').fill(adminEmail!);
  await page.getByLabel('Password').fill(adminPassword!);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('/');
};

test.describe('Admin user management', () => {
  test.skip(
    !adminEmail || !adminPassword,
    'Requires a seeded admin with ADMIN_EMAIL and ADMIN_PASSWORD set',
  );

  test.beforeEach(async ({ page }) => {
    await signInAsAdmin(page);
  });

  test('admin can sign in with credentials and open user management', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
    await expect(page.getByRole('cell', { name: adminEmail! })).toBeVisible();
  });

  test('create user dialog validates input', async ({ page }) => {
    await page.goto('/admin');
    await page.getByRole('button', { name: 'Create User' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Create User' }).click();
    await expect(dialog.getByText('Name is required.')).toBeVisible();
    await expect(dialog.getByText('Invalid email address.')).toBeVisible();
    await expect(dialog.getByText('Password must be at least 8 characters.')).toBeVisible();
  });

  test('admin can view their profile with role and linked accounts', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();
    await expect(page.getByText('ADMIN')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Change Password' })).toBeVisible();
    await expect(page.getByText('Linked Accounts')).toBeVisible();
  });
});
