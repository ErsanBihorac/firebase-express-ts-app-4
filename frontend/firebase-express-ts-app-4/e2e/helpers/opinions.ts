import { Page, expect } from '@playwright/test';

export async function createOpinion(page: Page, text: string) {
  const field = page.getByTestId('opinion-textfield');
  const submitBtn = page.getByTestId('create-opinion-btn');

  await field.fill(text);
  await expect(submitBtn).toBeEnabled();
  await submitBtn.click();

  // after submit, the form resets -> textarea becomes empty
  await expect(field).toHaveValue('');
}
