import { expect, test } from '@playwright/test';

test('complete plant form stepper', async ({ page }) => {
  // Navigate to the add plant page
  await page.goto('/plants/new');

  // Verify we're on step 1
  await expect(page.getByText('Basic Information')).toBeVisible();
  await expect(page.getByText('Tell us about your plant')).toBeVisible();

  // Step 1: Basic Information
  await page.getByTestId('common-name').fill('Monstera');
  await page.getByTestId('latin-name').fill('Monstera deliciosa');
  await page.getByTestId('purchase-date').fill('2024-01-15');

  // Upload an image (create a test file)
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles({
    name: 'test-plant.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('fake-image-data')
  });

  // Click next to go to step 2
  await page.getByRole('button', { name: 'Next: Container & Location' }).click();

  // Verify we're on step 2
  await expect(page.getByText('Container & Location')).toBeVisible();
  await expect(page.getByText('Tell us about your plant\'s home')).toBeVisible();

  // Step 2: Container & Location
  await page.getByTestId('pot-type').click();
  await page.getByRole('option', { name: 'Terracotta' }).click();
  
  await page.getByTestId('pot-size').fill('8');
  await page.getByTestId('soil-mix').fill('Premium potting mix with perlite and bark chips for drainage');
  await page.getByTestId('location').fill('Living Room - South Window');

  // Click next to go to step 3
  await page.getByRole('button', { name: 'Next: Care Schedule' }).click();

  // Verify we're on step 3
  await expect(page.getByText('Set up the care routine for your plant')).toBeVisible();

  // Step 3: Care Schedule
  await page.getByTestId('watering-frequency').fill('7');
  await page.getByTestId('fertilizing-frequency').fill('14');
  await page.getByTestId('additional-care').fill('Mist leaves weekly. Rotate plant monthly for even growth. Watch for spider mites.');

  // Click next to go to step 4
  await page.getByRole('button', { name: 'Next: Review' }).click();

  // Verify we're on step 4 (Review)
  await expect(page.getByText('Review & Submit')).toBeVisible();
  await expect(page.getByText('Please review your plant information before submitting')).toBeVisible();

  // Step 4: Review - Verify all data is displayed correctly
  await expect(page.getByText('Monstera').first()).toBeVisible();
  await expect(page.getByText('Monstera deliciosa').first()).toBeVisible();
  await expect(page.getByText('2024-01-15')).toBeVisible();
  await expect(page.getByText('1 image(s) uploaded')).toBeVisible();
  
  await expect(page.getByText('Terracotta')).toBeVisible();
  await expect(page.getByText('8 inches')).toBeVisible();
  await expect(page.getByText('Living Room - South Window')).toBeVisible();
  await expect(page.getByText('Premium potting mix with perlite and bark chips for drainage')).toBeVisible();
  
  await expect(page.getByText('Every 7 day(s)')).toBeVisible();
  await expect(page.getByText('Every 14 day(s)')).toBeVisible();
  await expect(page.getByText('Mist leaves weekly. Rotate plant monthly for even growth. Watch for spider mites.')).toBeVisible();

  // Submit the form
  await page.getByRole('button', { name: 'Save Plant' }).click();

  // Verify success and navigation
  await expect(page.getByText('Plant added successfully!')).toBeVisible();
  await expect(page.getByText('Dashboard').first()).toBeVisible();
});

test('navigate back through stepper', async ({ page }) => {
  await page.goto('/plants/new');

  // Fill step 1 and go to step 2
  await page.getByTestId('common-name').fill('Test Plant');
  await page.getByRole('button', { name: 'Next: Container & Location' }).click();

  // Fill step 2 and go to step 3
  await page.getByTestId('pot-size').fill('6');
  await page.getByRole('button', { name: 'Next: Care Schedule' }).click();

  // Go back to step 2
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByText('Container & Location')).toBeVisible();
  await expect(page.getByTestId('pot-size')).toHaveValue('6'); // Verify data persisted

  // Go back to step 1
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByText('Basic Information')).toBeVisible();
  await expect(page.getByTestId('common-name')).toHaveValue('Test Plant'); // Verify data persisted
});

test('form validation on each step', async ({ page }) => {
  await page.goto('/plants/new');

  // Step 1: Try to proceed without required field
  await page.getByRole('button', { name: 'Next: Container & Location' }).click();
  await expect(page.getByText('Common name is required')).toBeVisible();

  // Fill required field and proceed
  await page.getByTestId('common-name').fill('Valid Plant Name');
  await page.getByRole('button', { name: 'Next: Container & Location' }).click();

  // Step 2: Test pot size validation
  await page.getByTestId('pot-size').fill('-5');
  await page.getByTestId('pot-size').blur();
  await expect(page.getByText('Pot size must be positive')).toBeVisible();

  // Fix validation error and proceed
  await page.getByTestId('pot-size').fill('6');
  await page.getByRole('button', { name: 'Next: Care Schedule' }).click();

  // Step 3: Test frequency validation
  await page.getByTestId('watering-frequency').fill('0');
  await page.getByTestId('watering-frequency').blur();
  await expect(page.getByText('Watering frequency must be at least 1 day')).toBeVisible();

  await page.getByTestId('fertilizing-frequency').fill('0');
  await page.getByTestId('fertilizing-frequency').blur();
  await expect(page.getByText('Fertilizing frequency must be at least 1 day')).toBeVisible();
});

test('cancel button works from any step', async ({ page }) => {
  await page.goto('/plants/new');

  // Test cancel from step 1
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByText('Dashboard').first()).toBeVisible();

  // Go back and test cancel from step 2
  await page.goto('/plants/new');
  await page.getByTestId('common-name').fill('Test Plant');
  await page.getByRole('button', { name: 'Next: Container & Location' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByText('Dashboard').first()).toBeVisible();
});

test('progress indicator shows correct step', async ({ page }) => {
  await page.goto('/plants/new');

  // Check step 1 is active
  const step1 = page.locator('[data-step="1"]').first();
  await expect(step1).toHaveClass(/bg-primary/);

  // Go to step 2
  await page.getByTestId('common-name').fill('Test Plant');
  await page.getByRole('button', { name: 'Next: Container & Location' }).click();

  // Check step 2 is active and step 1 is completed
  const step2 = page.locator('[data-step="2"]').first();
  await expect(step2).toHaveClass(/bg-primary/);
  await expect(step1).toHaveClass(/bg-primary/); // Should still be marked as completed
}); 