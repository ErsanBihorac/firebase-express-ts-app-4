import { test, expect } from '@playwright/test';
import { ensureUserExists, login } from './helpers/auth';
import { clearOpinions } from './helpers/firestore';
import { createOpinion } from './helpers/opinions';

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ request }) => {
  const user = { email: 'testuser@example.com', password: 'password123' };
  await ensureUserExists(request, user);
});

test.beforeEach(async ({ page, request }) => {
  // clear opinions from previous test
  await clearOpinions(request);

  const user = { email: 'testuser@example.com', password: 'password123' };
  await login(page, user);

  // seed for opinion creation
  await page.goto('/create-opinion');
  await createOpinion(page, 'test opinion #1');
  await createOpinion(page, 'test opinion #2');
});

test('ViewOpinion shows core UI', async ({ page }) => {
  await page.goto('/view-opinion');

  await expect(page.getByTestId('signedin-text')).toBeVisible();
  await expect(page.getByTestId('signout-btn')).toBeVisible();

  await expect(page.getByTestId('prev-opinion-btn')).toBeVisible();
  await expect(page.getByTestId('next-opinion-btn')).toBeVisible();

  await expect(page.getByTestId('create-opinion-btn')).toBeVisible();
  await expect(page.getByTestId('rate-opinion-btn')).toBeVisible();
  await expect(page.getByTestId('delete-opinion-btn')).toBeVisible();

  await expect(page.getByTestId('author-field')).toBeVisible();
  await expect(page.getByTestId('opinion-field')).toBeVisible();
  await expect(page.getByTestId('likecount-field')).toBeVisible();
});

test('Show first opinion when page was entered', async ({ page }) => {
  await page.goto('/view-opinion');

  await expect(page.getByTestId('opinion-field')).toContainText('test opinion #1');
});

test('Show second opinion when next opinion button was clicked', async ({ page }) => {
  await page.goto('/view-opinion');

  await page.getByTestId('next-opinion-btn').click();
  await expect(page.getByTestId('opinion-field')).toContainText('test opinion #2');
});

test('Show first opinion when previous opinion button was clicked', async ({ page }) => {
  await page.goto('/view-opinion');

  await page.getByTestId('next-opinion-btn').click();
  await expect(page.getByTestId('opinion-field')).toContainText('test opinion #2');
  await page.getByTestId('prev-opinion-btn').click();
  await expect(page.getByTestId('opinion-field')).toContainText('test opinion #1');
});

test('Show second opinion when first opinion was deleted', async ({ page }) => {
  await page.goto('/view-opinion');

  await expect(page.getByTestId('opinion-field')).toContainText('test opinion #1');
  await page.getByTestId('delete-opinion-btn').click();
  await expect(page.getByTestId('opinion-field')).toContainText('test opinion #2');
});

test('Show first opinion when second opinion was deleted', async ({ page }) => {
  await page.goto('/view-opinion');

  await page.getByTestId('next-opinion-btn').click();
  await expect(page.getByTestId('opinion-field')).toContainText('test opinion #2');
  await page.getByTestId('delete-opinion-btn').click();
  await expect(page.getByTestId('opinion-field')).toContainText('test opinion #1');
});
