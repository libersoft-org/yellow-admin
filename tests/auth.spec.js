import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.js';

test.describe('Authentication', () => {
 let auth;

 test.beforeEach(async ({ page }) => {
  auth = new AuthHelper(page);
 });

 test('Login and logout flow', async ({ page }) => {
  // Test login
  await auth.login();
  
  // Verify we're logged in by checking sidebar and menu
  await expect(page.getByTestId('admin-sidebar')).toBeVisible();
  await expect(page.getByTestId('admin-menu')).toBeVisible();
  await expect(page.getByTestId('menu-admins')).toBeVisible();
  await expect(page.getByTestId('menu-logout')).toBeVisible();
  
  // Test logout
  await auth.logout();
  
  // Verify we're back to login page
  await expect(page.getByTestId('login-username')).toBeVisible();
  await expect(page.getByTestId('login-password')).toBeVisible();
  await expect(page.getByTestId('login-button')).toBeVisible();
 });

 test('Navigation between pages', async ({ page }) => {
  await auth.login();
  
  // Test navigation to different admin pages
  await auth.navigateToPage('admins');
  await expect(page.getByTestId('admins-add-button')).toBeVisible();
  
  await auth.navigateToPage('domains');
  await expect(page.getByTestId('domains-add-button')).toBeVisible();
  
  await auth.navigateToPage('users');
  await expect(page.getByTestId('users-add-button')).toBeVisible();
  
  await auth.navigateToPage('modules');
  await expect(page.getByTestId('modules-add-button')).toBeVisible();
  
  await auth.navigateToPage('sessions');
  await expect(page.getByTestId('sessions-reload-button')).toBeVisible();
  
  await auth.navigateToPage('clients');
  await expect(page.getByTestId('clients-reload-button')).toBeVisible();
  
  await auth.navigateToPage('sysinfo');
  await expect(page.getByTestId('sysinfo-reload-button')).toBeVisible();
  
  await auth.navigateToPage('logs');
  await expect(page.getByTestId('logs-reload-button')).toBeVisible();
 });
});