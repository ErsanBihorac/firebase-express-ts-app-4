import { APIRequestContext, expect, Page } from '@playwright/test';

// helpers/auth.ts
export async function ensureUserExists(
  request: APIRequestContext,
  user: { email: string; password: string },
) {
  await request
    .post('http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-key', {
      data: { ...user, returnSecureToken: true },
    })
    .catch(() => {});
}

export async function login(page: Page, user: { email: string; password: string }) {
  await page.goto('/auth');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await Promise.all([page.waitForURL('**/'), page.getByTestId('auth-btn').click()]);
}
