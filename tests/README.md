# Yellow Admin Playwright Test Suite

This test suite provides comprehensive end-to-end testing for the Yellow Admin interface.

## Prerequisites

1. **Database Setup**: Ensure the database starts empty except for an admin user with:
   - Username: `admin`
   - Password: `admin`

2. **Server Running**: The Yellow Server should be running and accessible

3. **Admin Interface**: The Yellow Admin interface should be running on port 4000 (or configured port)

## Installation

Install Playwright and dependencies:

```bash
npm install
npx playwright install
```

## Configuration

The tests can be configured using environment variables:

- `PLAYWRIGHT_ADMIN_URL`: Admin interface URL (default: `http://localhost:4000`)
- `PLAYWRIGHT_SERVER_URL`: WebSocket server URL (default: `ws://localhost:8085/`)

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (visible browser)
```bash
npm run test:headed
```

### Run tests with UI mode
```bash
npm run test:ui
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run specific test files
```bash
npx playwright test auth.spec.js
npx playwright test admin-management.spec.js
```

### Run with custom configuration
```bash
PLAYWRIGHT_ADMIN_URL=http://localhost:3000 PLAYWRIGHT_SERVER_URL=ws://localhost:9000/ npm test
```

## Test Structure

### `auth.spec.js`
- Basic login/logout functionality
- Navigation between different admin pages
- UI element visibility verification

### `admin-management.spec.js`
- Comprehensive CRUD operations for:
  - Administrators
  - Domains
  - Users
  - Modules
  - Sessions
  - Connected Clients
- Search and filtering functionality
- Pagination testing
- Random offset jumps
- System information verification

### Helper Classes

#### `AuthHelper`
- `login(username, password)`: Login with credentials
- `logout()`: Logout from admin interface
- `navigateToPage(pageName)`: Navigate to specific admin page

#### `CrudHelper`
- `addItem(itemData)`: Add new items to any admin section
- `editItem(itemId, itemData)`: Edit existing items
- `deleteItem(itemId)`: Delete items with confirmation
- `search(searchTerm)`: Search/filter items
- `setOffset(offset)`: Test pagination with offset
- `reload()`: Reload page data
- `verifyItemInTable(itemData, shouldExist)`: Verify items in tables

## Test Scenarios Covered

1. **Authentication Flow**
   - Login with admin credentials
   - Navigate through all admin sections
   - Logout functionality

2. **Administrator Management**
   - Add multiple administrators
   - Search and filter administrators
   - Test pagination with various offsets
   - Verify administrators appear in table

3. **Domain Management**
   - Add multiple domains
   - Search domains by name
   - Test pagination and offset jumps
   - Verify domain listings

4. **User Management**
   - Add users with domain associations
   - Search users by username
   - Test pagination functionality
   - Verify user data in tables

5. **Module Management**
   - Add modules with connection strings
   - Enable/disable modules
   - Search modules by name
   - Test pagination and filtering

6. **Session & Client Management**
   - View active sessions
   - Filter sessions by various criteria
   - View connected clients
   - Filter clients by GUID, IP, and user

7. **System Information**
   - Verify system info tables are visible
   - Test system info reload functionality

8. **Logs**
   - Access logs section
   - Test logs reload functionality

## Test Data

The tests create sample data for thorough testing:

- **Admins**: admin1-5, testadmin, superadmin
- **Domains**: example.com, test.org, demo.net, company.io, business.co
- **Users**: john, jane, bob, alice, testuser, charlie (with associated domains)
- **Modules**: org.example.chat, org.example.files, org.test.module, etc.

## Expected Test Flow

1. Login with admin/admin credentials
2. Navigate to each admin section
3. Add multiple items (5-7 per section)
4. Test search/filtering functionality
5. Test pagination with various offsets
6. Add more items to test with larger datasets
7. Perform additional searches to verify functionality
8. Verify system information and logs access
9. Logout successfully

## Notes

- Tests run sequentially to avoid conflicts
- Each test starts with a fresh login
- Database should be reset between test runs for consistent results
- Tests are designed to work with the data-testid attributes added to the admin interface
- Some CRUD operations (like edit/delete) may require additional implementation based on how the admin interface handles item IDs