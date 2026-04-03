import { APIRequestContext } from '@playwright/test';

const projectId = 'fir-express-ts-app-4'; // aus environment.ts

export async function clearOpinions(request: APIRequestContext) {
  await request.delete(
    `http://localhost:8080/emulator/v1/projects/${projectId}/databases/(default)/documents/opinions`,
  );
}
