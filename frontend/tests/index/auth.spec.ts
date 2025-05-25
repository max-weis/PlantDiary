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
  await expect(page.getByText('Login to your PlantDiary account')).toBeVisible();

  // Fill in the default admin credentials
  await page.getByTestId('email-input').fill('admin@plantdiary.com');
  await page.getByTestId('password-input').fill('admin123');
  await page.getByTestId('login-button').click();
  
  // Verify successful login by checking for dashboard
  await expect(page.getByText('Dashboard').first()).toBeVisible();
});

test('show error for invalid email format', async ({ page }) => {
  await page.goto('/login');

  // Fill in an invalid email format
  await page.getByTestId('email-input').fill('invalid-email');
  await page.getByTestId('password-input').fill('password123');
  
  // Trigger validation by blurring the email field
  await page.getByTestId('email-input').blur();
  
  // Check that the error message appears
  await expect(page.getByText('Please enter a valid email address')).toBeVisible();
  
  // Verify that the login button is disabled
  await expect(page.getByTestId('login-button')).toBeDisabled();
});

test('show error for empty email', async ({ page }) => {
  await page.goto('/login');

  // Fill in password but leave email empty
  await page.getByTestId('email-input').fill('');
  await page.getByTestId('password-input').fill('password123');

  // Check that the error message appears
  await expect(page.getByText('Please enter a valid email address')).toBeVisible();
});

