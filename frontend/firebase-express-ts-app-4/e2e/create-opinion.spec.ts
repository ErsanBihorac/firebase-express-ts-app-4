import { test, expect } from '@playwright/test';
import { ensureUserExists, login } from './helpers/auth';

test.beforeAll(async ({ request }) => {
  const user = { email: 'testuser@example.com', password: 'password123' };
  await ensureUserExists(request, user);
});

test.beforeEach(async ({ page }) => {
  const user = { email: 'testuser@example.com', password: 'password123' };
  await login(page, user);
});

test('CreateOpinion shows core UI', async ({ page }) => {
  await page.goto('/create-opinion');

  await expect(page.getByTestId('signedin-text')).toBeVisible();
  await expect(page.getByTestId('signout-btn')).toBeVisible();

  await expect(page.getByTestId('opinion-textfield')).toBeVisible();
  await expect(page.getByTestId('create-opinion-btn')).toBeVisible();

  await expect(page.getByTestId('view-opinions-btn')).toBeVisible();
  await expect(page.getByTestId('rate-opinion-btn')).toBeVisible();
});

test('Cleared textfield after creation', async ({ page }) => {
  await page.goto('/create-opinion');

  await page.getByTestId('opinion-textfield').fill('test opinion');
  await page.getByTestId('create-opinion-btn').click();

  await expect(page.getByTestId('opinion-textfield')).toHaveValue('');
});
