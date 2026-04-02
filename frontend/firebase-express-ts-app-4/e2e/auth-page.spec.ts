import { test, expect } from '@playwright/test';

// erstellt ein User damit dieser im signin test erfolgreich angemeldet werden kann
test.beforeAll(async ({ request }) => {
  await request.post(
    'http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-key',
    {
      data: {
        email: 'testuser@example.com',
        password: 'password123',
        returnSecureToken: true,
      },
    },
  );
});

test('auth page shows login form', async ({ page }) => {
  await page.goto('/auth');

  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();

  await expect(page.getByTestId('auth-btn')).toBeVisible();
});

test('sign in flow', async ({ page }) => {
  await page.goto('/auth');

  await page.getByTestId('signinmode-btn').click();

  //nutze eine unique email, da der emulator nach jedem ausgeführten test die email als user speichert und eine mail nicht mehrfach verwendet werden kann zum registrieren
  const uniqueEmail = `user+${Date.now()}@example.com`;

  await page.getByLabel('Email').fill(uniqueEmail);
  await page.getByLabel('Password').fill('userexample');

  await page.getByTestId('auth-btn').click();

  await expect(page).toHaveURL('/');
});

test('login flow', async ({ page }) => {
  await page.goto('/auth');

  await page.getByTestId('loginmode-btn').click();

  // benutzt den vorher registrierten nutzer zum anmelden im beforeEach
  await page.getByLabel('Email').fill('testuser@example.com');
  await page.getByLabel('Password').fill('password123');

  await Promise.all([page.waitForURL('**/'), page.getByTestId('auth-btn').click()]);
  await expect(page.getByTestId('home-title')).toBeVisible();
});
