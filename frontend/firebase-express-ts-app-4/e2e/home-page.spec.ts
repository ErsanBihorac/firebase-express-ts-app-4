import { test, expect } from '@playwright/test';
import { ensureUserExists, login } from './helpers/auth';

// erstellt ein User damit dieser im signin test erfolgreich angemeldet werden kann um dann zur HomePage komponente zu kommen

test.beforeAll(async ({ request }) => {
  const user = { email: 'testuser@example.com', password: 'password123' };
  await ensureUserExists(request, user);
});

test.beforeEach(async ({ page }) => {
  const user = { email: 'testuser@example.com', password: 'password123' };
  await login(page, user);
});

test('HomePage shows core UI', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('signedin-text')).toBeVisible();
  await expect(page.getByTestId('signout-btn')).toBeVisible();

  await expect(page.getByTestId('author-email')).toBeVisible();
  await expect(page.getByTestId('opinion')).toBeVisible();
  await expect(page.getByTestId('likecount')).toBeVisible();

  await expect(page.getByTestId('dislike-btn')).toBeVisible();
  await expect(page.getByTestId('like-btn')).toBeVisible();
});

test('Displays new Opinion on like', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('like-btn').click();
  await expect(page.getByTestId('author-email')).toContainText('amra@mail.com');
  await expect(page.getByTestId('opinion')).toContainText('Oranges are good');
  await expect(page.getByTestId('likecount')).toContainText('Likes: 2');
});

test('Displays new Opinion on dislike', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('dislike-btn').click();
  await expect(page.getByTestId('author-email')).toContainText('amra@mail.com');
  await expect(page.getByTestId('opinion')).toContainText('Oranges are good');
  await expect(page.getByTestId('likecount')).toContainText('Likes: 2');
});
