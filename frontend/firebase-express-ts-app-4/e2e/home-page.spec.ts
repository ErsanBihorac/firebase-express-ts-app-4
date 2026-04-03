import { test, expect } from '@playwright/test';
import { ensureUserExists, login } from './helpers/auth';
import { clearOpinions } from './helpers/firestore';
import { createOpinion } from './helpers/opinions';

test.describe.configure({ mode: 'serial' });

// erstellt ein User damit dieser im signin test erfolgreich angemeldet werden kann um dann zur HomePage komponente zu kommen

test.beforeAll(async ({ request }) => {
  const user = { email: 'testuser@example.com', password: 'password123' };
  await ensureUserExists(request, user);
});

test.beforeEach(async ({ page, request }) => {
  await clearOpinions(request);

  const user = { email: 'testuser@example.com', password: 'password123' };
  await login(page, user);

  await page.goto('/create-opinion');
  await createOpinion(page, 'Opinion #1');
  await createOpinion(page, 'Opinion #2');
});

test('HomePage shows core UI', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('signedin-text')).toBeVisible();
  await expect(page.getByTestId('signout-btn')).toBeVisible();

  await expect(page.getByTestId('email-field')).toBeVisible();
  await expect(page.getByTestId('opinion-field')).toBeVisible();

  await expect(page.getByTestId('dislike-btn')).toBeVisible();
  await expect(page.getByTestId('like-btn')).toBeVisible();
});

test('Displays new Opinion on like', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('opinion-field')).toContainText('Opinion #1');
  await page.getByTestId('like-btn').click();
  await expect(page.getByTestId('opinion-field')).toContainText('Opinion #2');
});

test('Displays new Opinion on dislike', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('opinion-field')).toContainText('Opinion #1');
  await page.getByTestId('dislike-btn').click();
  await expect(page.getByTestId('opinion-field')).toContainText('Opinion #2');
});
