import { expect, test } from '@playwright/test';

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

// Register form tests
test('register user', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('get-started').click();
  await expect(page.getByText('Create your account')).toBeVisible();

  const email = `${Math.random()}@test.com`;
  await page.getByTestId('email-input').fill(email);
  await page.getByTestId('username-input').fill('testuser');
  await page.getByTestId('password-input').fill('password');
  await page.getByTestId('confirm-password-input').fill('password');
  await page.getByRole('button', { name: 'Create account' }).click();
  
  await expect(page.getByText('Creating account...')).toBeVisible();
});

test('register form shows error for invalid email', async ({ page }) => {
  await page.goto('/register');

  // Fill in an invalid email format
  await page.getByTestId('email-input').fill('invalid-email');
  await page.getByTestId('username-input').fill('testuser');
  await page.getByTestId('password-input').fill('password123');
  await page.getByTestId('confirm-password-input').fill('password123');
  
  // Trigger validation by blurring the email field
  await page.getByTestId('email-input').blur();
  
  // Check that the error message appears
  await expect(page.getByText('Please enter a valid email address')).toBeVisible();
  
  // Verify that the register button is disabled
  await expect(page.getByTestId('create-account-button')).toBeDisabled();
});

test('register form shows error for short username', async ({ page }) => {
  await page.goto('/register');

  // Fill in a short username
  await page.getByTestId('email-input').fill('test@example.com');
  await page.getByTestId('username-input').fill('ab');
  await page.getByTestId('password-input').fill('password123');
  await page.getByTestId('confirm-password-input').fill('password123');
  
  // Trigger validation by blurring the username field
  await page.getByTestId('username-input').blur();
  
  // Check that the error message appears
  await expect(page.getByText('Username must be at least 3 characters')).toBeVisible();
  
  // Verify that the register button is disabled
  await expect(page.getByTestId('create-account-button')).toBeDisabled();
});

test('register form shows error for invalid username characters', async ({ page }) => {
  await page.goto('/register');

  // Fill in username with invalid characters
  await page.getByTestId('email-input').fill('test@example.com');
  await page.getByTestId('username-input').fill('user@name');
  await page.getByTestId('password-input').fill('password123');
  await page.getByTestId('confirm-password-input').fill('password123');
  
  // Trigger validation by blurring the username field
  await page.getByTestId('username-input').blur();
  
  // Check that the error message appears
  await expect(page.getByText('Username can only contain letters, numbers, and underscores')).toBeVisible();
  
  // Verify that the register button is disabled
  await expect(page.getByTestId('create-account-button')).toBeDisabled();
});

test('register form shows error for short password', async ({ page }) => {
  await page.goto('/register');

  // Fill in a short password
  await page.getByTestId('email-input').fill('test@example.com');
  await page.getByTestId('username-input').fill('testuser');
  await page.getByTestId('password-input').fill('123');
  await page.getByTestId('confirm-password-input').fill('123');
  
  // Trigger validation by blurring the password field
  await page.getByTestId('password-input').blur();
  
  // Check that the error message appears
  await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
  
  // Verify that the register button is disabled
  await expect(page.getByTestId('create-account-button')).toBeDisabled();
});

test('register form shows error for mismatched passwords', async ({ page }) => {
  await page.goto('/register');

  // Fill in mismatched passwords
  await page.getByTestId('email-input').fill('test@example.com');
  await page.getByTestId('username-input').fill('testuser');
  await page.getByTestId('password-input').fill('password123');
  await page.getByTestId('confirm-password-input').fill('different123');
  
  // Trigger validation by blurring the confirm password field
  await page.getByTestId('confirm-password-input').blur();
  
  // Check that the error message appears
  await expect(page.getByText("Passwords don't match")).toBeVisible();
  
  // Verify that the register button is disabled
  await expect(page.getByTestId('create-account-button')).toBeDisabled();
});

test('register form shows error for empty confirm password', async ({ page }) => {
  await page.goto('/register');

  // Fill in password but leave confirm password empty
  await page.getByTestId('email-input').fill('test@example.com');
  await page.getByTestId('username-input').fill('testuser');
  await page.getByTestId('password-input').fill('password123');
  await page.getByTestId('confirm-password-input').fill('test');
  await page.getByTestId('confirm-password-input').fill('');
  
  // Trigger validation by blurring the confirm password field
  await page.getByTestId('confirm-password-input').blur();
  
  // Check that the error message appears
  await expect(page.getByText('Please confirm your password')).toBeVisible();
  
  // Verify that the register button is disabled
  await expect(page.getByTestId('create-account-button')).toBeDisabled();
});

test('register form enables button when all fields are valid', async ({ page }) => {
  await page.goto('/register');

  // Fill in all valid fields
  await page.getByTestId('email-input').fill('test@example.com');
  await page.getByTestId('username-input').fill('testuser');
  await page.getByTestId('password-input').fill('password123');
  await page.getByTestId('confirm-password-input').fill('password123');
  
  // Wait a moment for validation to complete
  await page.waitForTimeout(100);
  
  // Verify that the register button is enabled
  await expect(page.getByTestId('create-account-button')).toBeEnabled();
});

