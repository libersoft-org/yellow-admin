import { expect } from '@playwright/test';

export class CrudHelper {
 constructor(page, section) {
  this.page = page;
  this.section = section; // 'admins', 'domains', 'users', 'modules', 'sessions'
 }

 async addItem(itemData) {
  // Click add button
  await this.page.getByTestId(`${this.section}-add-button`).click();
  
  // Wait for modal to appear
  await expect(this.page.getByTestId('modal')).toBeVisible();
  
  // Fill form based on section type
  switch (this.section) {
   case 'admins':
    await this.page.getByTestId('admin-form-username').fill(itemData.username);
    await this.page.getByTestId('admin-form-password').fill(itemData.password);
    break;
   
   case 'domains':
    await this.page.getByTestId('domain-form-name').fill(itemData.name);
    break;
   
   case 'users':
    await this.page.getByTestId('user-form-username').fill(itemData.username);
    // Support both domainId (for ID selection) and domainName (for text selection)
    if (itemData.domainId) {
     await this.page.getByTestId('user-form-domain').selectOption(itemData.domainId);
    } else if (itemData.domainName) {
     await this.page.getByTestId('user-form-domain').selectOption({ label: itemData.domainName });
    }
    await this.page.getByTestId('user-form-visible-name').fill(itemData.visibleName);
    await this.page.getByTestId('user-form-password').fill(itemData.password);
    break;
   
   case 'modules':
    await this.page.getByTestId('module-form-name').fill(itemData.name);
    await this.page.getByTestId('module-form-connection').fill(itemData.connectionString);
    if (itemData.enabled !== undefined) {
     if (itemData.enabled) {
      await this.page.getByTestId('module-form-enabled').check();
     } else {
      await this.page.getByTestId('module-form-enabled').uncheck();
     }
    }
    break;
  }
  
  // Submit form
  const submitTestId = `${this.section.slice(0, -1)}-form-submit`; // Remove 's' from end
  await this.page.getByTestId(submitTestId).click();
  
  // Wait for modal to close
  await expect(this.page.getByTestId('modal')).not.toBeVisible();
 }

 async editItem(itemId, itemData) {
  // Click edit button for specific item
  await this.page.getByTestId(`${this.section}-edit-${itemId}`).click();
  
  // Wait for modal to appear
  await expect(this.page.getByTestId('modal')).toBeVisible();
  
  // Clear and fill form fields (similar to addItem but clearing first)
  switch (this.section) {
   case 'admins':
    await this.page.getByTestId('admin-form-username').fill('');
    await this.page.getByTestId('admin-form-username').fill(itemData.username);
    if (itemData.password) {
     await this.page.getByTestId('admin-form-password').fill(itemData.password);
    }
    break;
   
   case 'domains':
    await this.page.getByTestId('domain-form-name').fill('');
    await this.page.getByTestId('domain-form-name').fill(itemData.name);
    break;
  }
  
  // Submit form
  const submitTestId = `${this.section.slice(0, -1)}-form-submit`;
  await this.page.getByTestId(submitTestId).click();
  
  // Wait for modal to close
  await expect(this.page.getByTestId('modal')).not.toBeVisible();
 }

 async deleteItem(itemId) {
  // Click delete button for specific item
  await this.page.getByTestId(`${this.section}-delete-${itemId}`).click();
  
  // Wait for confirmation modal
  await expect(this.page.getByTestId('modal')).toBeVisible();
  
  // Confirm deletion
  await this.page.getByTestId('delete-confirm-button').click();
  
  // Wait for modal to close
  await expect(this.page.getByTestId('modal')).not.toBeVisible();
 }

 async search(searchTerm) {
  // Fill search field based on section
  const filterTestId = `${this.section}-filter-${this.section === 'admins' || this.section === 'users' ? 'username' : 'name'}`;
  await this.page.getByTestId(filterTestId).fill(searchTerm);
  
  // Click search button
  await this.page.getByTestId(`${this.section}-search-button`).click();
  
  // Wait a moment for results to load
  await this.page.waitForTimeout(1000);
 }

 async setOffset(offset) {
  await this.page.getByTestId(`${this.section}-filter-offset`).fill(offset.toString());
  await this.page.getByTestId(`${this.section}-search-button`).click();
  await this.page.waitForTimeout(1000);
 }

 async reload() {
  await this.page.getByTestId(`${this.section}-reload-button`).click();
  await this.page.waitForTimeout(1000);
 }

 async getTableRowCount() {
  const table = this.page.getByTestId(`${this.section}-table`);
  const rows = table.locator('tbody tr');
  return await rows.count();
 }

 async verifyItemInTable(itemData, shouldExist = true) {
  const table = this.page.getByTestId(`${this.section}-table`);
  
  let searchText;
  switch (this.section) {
   case 'admins':
    searchText = itemData.username;
    break;
   case 'domains':
    searchText = itemData.name;
    break;
   case 'users':
    searchText = itemData.username;
    break;
   case 'modules':
    searchText = itemData.name;
    break;
  }
  
  if (shouldExist) {
   // Use getByRole to find a cell that starts with the search text for usernames
   if (this.entityType === 'users') {
    await expect(table.getByRole('cell', { name: new RegExp('^' + searchText + '@') })).toBeVisible();
   } else {
    await expect(table.getByText(searchText).first()).toBeVisible();
   }
  } else {
   await expect(table.getByText(searchText)).toHaveCount(0);
  }
 }
}