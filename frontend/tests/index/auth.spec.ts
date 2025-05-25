import { expect, test } from '@playwright/test';

test('register user', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('get-started').click();
  await expect(page.getByText('Create your account')).toBeVisible();

  const email = `${Math.random()}@test.com`;
  await page.getByTestId('email-input').fill(email);
  await page.getByTestId('password-input').fill('password');
  await page.getByTestId('confirm-password-input').fill('password');
  await page.getByRole('button', { name: 'Create account' }).click();
  
  await expect(page.getByText('Dashboard').first()).toBeVisible();
});

test('login with default user', async ({ page }) => {
  await page.goto('/');

  // Navigate to login page (assuming there's a login link/button)
  await page.getByTestId('login-link').click();
  await expect(page.getByText('Sign in to your account')).toBeVisible();

  // Fill in the default admin credentials
  await page.getByTestId('email-input').fill('admin@plantdiary.com');
  await page.getByTestId('password-input').fill('admin123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Verify successful login by checking for dashboard
  await expect(page.getByText('Dashboard').first()).toBeVisible();
});

