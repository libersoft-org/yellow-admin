import { expect } from '@playwright/test';

export class AuthHelper {
 constructor(page) {
  this.page = page;
 }

 async login(username = 'admin', password = 'password') {
  await this.page.goto('/');

  // Wait for login form to be visible
  await expect(this.page.getByTestId('login-username')).toBeVisible();

  // Fill in credentials - use env var or default to ws://localhost:8084/
  const serverUrl = process.env.PLAYWRIGHT_SERVER_URL || 'ws://localhost:8084/';
  await this.page.getByTestId('login-server').fill(serverUrl);
  await this.page.getByTestId('login-username').fill(username);
  await this.page.getByTestId('login-password').fill(password);

  // Click login button
  await this.page.getByTestId('login-button').click();

  // Wait for successful login - sidebar should be visible
  await expect(this.page.getByTestId('admin-sidebar')).toBeVisible();
  await expect(this.page.getByTestId('admin-menu')).toBeVisible();
 }

 async logout() {
  await this.page.getByTestId('menu-logout').click();

  // Wait for login form to appear again
  await expect(this.page.getByTestId('login-username')).toBeVisible();
 }

 async navigateToPage(pageName) {
  await this.page.getByTestId(`menu-${pageName}`).click();
  await expect(this.page.getByTestId('admin-content')).toBeVisible();
 }
}
