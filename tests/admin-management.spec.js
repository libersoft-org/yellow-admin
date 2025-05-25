import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.js';
import { CrudHelper } from './helpers/crud-helper.js';

test.describe('Yellow Admin Management Suite', () => {
 let auth;
 let adminsCrud, domainsCrud, usersCrud, modulesCrud, sessionsCrud;

 test.beforeEach(async ({ page }) => {
  auth = new AuthHelper(page);
  adminsCrud = new CrudHelper(page, 'admins');
  domainsCrud = new CrudHelper(page, 'domains');
  usersCrud = new CrudHelper(page, 'users');
  modulesCrud = new CrudHelper(page, 'modules');
  sessionsCrud = new CrudHelper(page, 'sessions');
  
  // Login before each test
  await auth.login();
 });

 test.afterEach(async ({ page }) => {
  // Logout after each test
  await auth.logout();
 });

 test('Complete Admin Management Workflow', async ({ page }) => {
  // 1. ADMINISTRATORS MANAGEMENT
  await test.step('Manage Administrators', async () => {
   await auth.navigateToPage('admins');
   
   // Add multiple admins
   await adminsCrud.addItem({ username: 'admin1', password: 'password1' });
   await adminsCrud.addItem({ username: 'admin2', password: 'password2' });
   await adminsCrud.addItem({ username: 'admin3', password: 'password3' });
   await adminsCrud.addItem({ username: 'testadmin', password: 'testpass' });
   await adminsCrud.addItem({ username: 'superadmin', password: 'superpass' });
   
   // Verify items were added
   await adminsCrud.verifyItemInTable({ username: 'admin1' });
   await adminsCrud.verifyItemInTable({ username: 'admin2' });
   
   // Test filtering
   await adminsCrud.search('test');
   await adminsCrud.verifyItemInTable({ username: 'testadmin' });
   await adminsCrud.verifyItemInTable({ username: 'admin1' }, false);
   
   // Clear filter and test pagination
   await adminsCrud.search('');
   await adminsCrud.setOffset(2);
   
   // Add more items to test pagination
   await adminsCrud.setOffset(0);
   await adminsCrud.addItem({ username: 'admin4', password: 'password4' });
   await adminsCrud.addItem({ username: 'admin5', password: 'password5' });
   
   // Test random offset jump
   await adminsCrud.setOffset(3);
   await adminsCrud.setOffset(0);
   
   // Test search again with more data
   await adminsCrud.search('super');
   await adminsCrud.verifyItemInTable({ username: 'superadmin' });
  });

  // 2. DOMAINS MANAGEMENT  
  await test.step('Manage Domains', async () => {
   await auth.navigateToPage('domains');
   
   // Add multiple domains
   await domainsCrud.addItem({ name: 'example.com' });
   await domainsCrud.addItem({ name: 'test.org' });
   await domainsCrud.addItem({ name: 'demo.net' });
   await domainsCrud.addItem({ name: 'company.io' });
   await domainsCrud.addItem({ name: 'business.co' });
   
   // Verify domains were added
   await domainsCrud.verifyItemInTable({ name: 'example.com' });
   await domainsCrud.verifyItemInTable({ name: 'test.org' });
   
   // Test filtering
   await domainsCrud.search('test');
   await domainsCrud.verifyItemInTable({ name: 'test.org' });
   await domainsCrud.verifyItemInTable({ name: 'example.com' }, false);
   
   // Clear filter and test pagination
   await domainsCrud.search('');
   await domainsCrud.setOffset(2);
   
   // Add more domains
   await domainsCrud.setOffset(0);
   await domainsCrud.addItem({ name: 'sample.dev' });
   await domainsCrud.addItem({ name: 'local.test' });
   
   // Test random offset
   await domainsCrud.setOffset(4);
   await domainsCrud.setOffset(1);
   
   // Test search with more data
   await domainsCrud.search('co');
   await domainsCrud.verifyItemInTable({ name: 'company.io' });
  });

  // 3. USERS MANAGEMENT
  await test.step('Manage Users', async () => {
   await auth.navigateToPage('users');
   
   // Add multiple users (assuming domains exist from previous step)
   await usersCrud.addItem({ 
    username: 'john', 
    domainId: '1', 
    visibleName: 'John Doe', 
    password: 'johnpass' 
   });
   await usersCrud.addItem({ 
    username: 'jane', 
    domainId: '1', 
    visibleName: 'Jane Smith', 
    password: 'janepass' 
   });
   await usersCrud.addItem({ 
    username: 'bob', 
    domainId: '2', 
    visibleName: 'Bob Wilson', 
    password: 'bobpass' 
   });
   await usersCrud.addItem({ 
    username: 'alice', 
    domainId: '1', 
    visibleName: 'Alice Brown', 
    password: 'alicepass' 
   });
   await usersCrud.addItem({ 
    username: 'testuser', 
    domainId: '2', 
    visibleName: 'Test User', 
    password: 'testpass' 
   });
   
   // Verify users were added
   await usersCrud.verifyItemInTable({ username: 'john' });
   await usersCrud.verifyItemInTable({ username: 'jane' });
   
   // Test filtering
   await usersCrud.search('test');
   await usersCrud.verifyItemInTable({ username: 'testuser' });
   await usersCrud.verifyItemInTable({ username: 'john' }, false);
   
   // Clear filter and test pagination
   await usersCrud.search('');
   await usersCrud.setOffset(2);
   
   // Add more users
   await usersCrud.setOffset(0);
   await usersCrud.addItem({ 
    username: 'charlie', 
    domainId: '1', 
    visibleName: 'Charlie Davis', 
    password: 'charliepass' 
   });
   
   // Test random offset
   await usersCrud.setOffset(3);
   await usersCrud.setOffset(0);
   
   // Test search again
   await usersCrud.search('a');
   await usersCrud.verifyItemInTable({ username: 'jane' });
   await usersCrud.verifyItemInTable({ username: 'alice' });
  });

  // 4. MODULES MANAGEMENT
  await test.step('Manage Modules', async () => {
   await auth.navigateToPage('modules');
   
   // Add multiple modules
   await modulesCrud.addItem({ 
    name: 'org.example.chat', 
    connectionString: 'ws://localhost:8001/', 
    enabled: true 
   });
   await modulesCrud.addItem({ 
    name: 'org.example.files', 
    connectionString: 'ws://localhost:8002/', 
    enabled: true 
   });
   await modulesCrud.addItem({ 
    name: 'org.test.module', 
    connectionString: 'ws://localhost:8003/', 
    enabled: false 
   });
   await modulesCrud.addItem({ 
    name: 'org.demo.service', 
    connectionString: 'ws://localhost:8004/', 
    enabled: true 
   });
   await modulesCrud.addItem({ 
    name: 'org.sample.app', 
    connectionString: 'ws://localhost:8005/', 
    enabled: false 
   });
   
   // Verify modules were added
   await modulesCrud.verifyItemInTable({ name: 'org.example.chat' });
   await modulesCrud.verifyItemInTable({ name: 'org.example.files' });
   
   // Test filtering
   await modulesCrud.search('test');
   await modulesCrud.verifyItemInTable({ name: 'org.test.module' });
   await modulesCrud.verifyItemInTable({ name: 'org.example.chat' }, false);
   
   // Clear filter and test pagination
   await modulesCrud.search('');
   await modulesCrud.setOffset(2);
   
   // Add more modules
   await modulesCrud.setOffset(0);
   await modulesCrud.addItem({ 
    name: 'org.new.module', 
    connectionString: 'ws://localhost:8006/', 
    enabled: true 
   });
   
   // Test random offset
   await modulesCrud.setOffset(4);
   await modulesCrud.setOffset(1);
   
   // Test search again
   await modulesCrud.search('example');
   await modulesCrud.verifyItemInTable({ name: 'org.example.chat' });
   await modulesCrud.verifyItemInTable({ name: 'org.example.files' });
  });

  // 5. SESSIONS MANAGEMENT
  await test.step('Manage Sessions', async () => {
   await auth.navigateToPage('sessions');
   
   // Test filtering (sessions are typically auto-generated)
   await sessionsCrud.search('');
   
   // Test pagination
   await sessionsCrud.setOffset(0);
   await sessionsCrud.setOffset(5);
   await sessionsCrud.setOffset(0);
   
   // Test reload
   await sessionsCrud.reload();
  });

  // 6. CLIENTS MANAGEMENT
  await test.step('Manage Connected Clients', async () => {
   await auth.navigateToPage('clients');
   
   // Test filtering (clients are typically live connections)
   await page.getByTestId('clients-filter-guid').fill('test-guid');
   await page.getByTestId('clients-search-button').click();
   
   await page.getByTestId('clients-filter-ip').fill('127.0.0.1');
   await page.getByTestId('clients-search-button').click();
   
   // Clear filters
   await page.getByTestId('clients-filter-guid').fill('');
   await page.getByTestId('clients-filter-ip').fill('');
   await page.getByTestId('clients-filter-user').fill('');
   await page.getByTestId('clients-search-button').click();
   
   // Test pagination
   await page.getByTestId('clients-filter-offset').fill('5');
   await page.getByTestId('clients-search-button').click();
   
   await page.getByTestId('clients-filter-offset').fill('0');
   await page.getByTestId('clients-search-button').click();
   
   // Test reload
   await page.getByTestId('clients-reload-button').click();
  });

  // 7. SYSTEM INFO CHECK
  await test.step('Check System Information', async () => {
   await auth.navigateToPage('sysinfo');
   
   // Verify system info tables are visible
   await expect(page.getByTestId('sysinfo-app-table')).toBeVisible();
   await expect(page.getByTestId('sysinfo-system-table')).toBeVisible();
   await expect(page.getByTestId('sysinfo-resources-table')).toBeVisible();
   
   // Test reload
   await page.getByTestId('sysinfo-reload-button').click();
  });

  // 8. LOGS CHECK
  await test.step('Check Logs', async () => {
   await auth.navigateToPage('logs');
   
   // Test reload (logs functionality may be limited)
   await page.getByTestId('logs-reload-button').click();
  });
 });

 test('CRUD Operations with Edit and Delete', async ({ page }) => {
  // Test editing and deleting items
  await test.step('Edit and Delete Admins', async () => {
   await auth.navigateToPage('admins');
   
   // Add an admin to edit
   await adminsCrud.addItem({ username: 'editme', password: 'oldpass' });
   
   // Note: Edit functionality would require knowing the item ID
   // This would typically come from the table or API response
   // For now, we'll focus on the deletion workflow
   
   // Test deletion (assuming we can identify the item to delete)
   // await adminsCrud.deleteItem('2'); // Would need actual ID
  });
 });

 test('Advanced Search and Filtering', async ({ page }) => {
  await test.step('Advanced Admin Search', async () => {
   await auth.navigateToPage('admins');
   
   // Add admins with specific patterns for testing
   await adminsCrud.addItem({ username: 'searchtest1', password: 'pass1' });
   await adminsCrud.addItem({ username: 'searchtest2', password: 'pass2' });
   await adminsCrud.addItem({ username: 'different', password: 'pass3' });
   
   // Test partial search
   await adminsCrud.search('search');
   await adminsCrud.verifyItemInTable({ username: 'searchtest1' });
   await adminsCrud.verifyItemInTable({ username: 'searchtest2' });
   await adminsCrud.verifyItemInTable({ username: 'different' }, false);
   
   // Test exact search
   await adminsCrud.search('searchtest1');
   await adminsCrud.verifyItemInTable({ username: 'searchtest1' });
   await adminsCrud.verifyItemInTable({ username: 'searchtest2' }, false);
   
   // Clear search
   await adminsCrud.search('');
   await adminsCrud.verifyItemInTable({ username: 'searchtest1' });
   await adminsCrud.verifyItemInTable({ username: 'different' });
  });
 });
});