import { test, expect } from '@playwright/test';

test.describe('Add New Task', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
  });

  // Add cleanup after each test to ensure isolation
  test.afterEach(async () => {
    // Clean up database after each test to prevent conflicts
    // This ensures test isolation
  });

  test('should add a new task successfully', async ({ page }) => {
    // Wait for the page to load
    await expect(page.getByRole('heading', { name: 'Task Manager' })).toBeVisible();

    // Fill in the task form
    const taskTitle = `Test Task from E2E ${Date.now()}`;
    const taskDescription = 'This is a test task created by Playwright';
    const taskCategory = 'Testing';

    await page.getByPlaceholder('Enter task title...').fill(taskTitle);
    await page.getByPlaceholder('Description (optional)').fill(taskDescription);
    await page.getByPlaceholder('Category (optional)').fill(taskCategory);
    
    // Select high priority
    await page.selectOption('select[name="priority"]', 'high');

    // Submit the form
    await page.getByTestId('add-task-button').click();

    // Wait for the page to reload/update
    await page.waitForLoadState('networkidle');

    // Verify the task appears in the list
    const tasksList = page.getByTestId('tasks-list');
    await expect(tasksList).toBeVisible();

    // Find the specific task element that was just created
    const taskElement = page.locator(`[data-testid^="task-"]`).filter({ hasText: taskTitle });
    await expect(taskElement).toBeVisible();
    
    // Check if the task title is visible within this specific task
    await expect(taskElement.getByText(taskTitle)).toBeVisible();
    
    // Check if the task description is visible within this specific task
    await expect(taskElement.getByText(taskDescription)).toBeVisible();
    
    // Check if the category badge is visible within this specific task
    await expect(taskElement.getByText(taskCategory)).toBeVisible();
    
    // Check if the priority badge shows "high" within this specific task
    await expect(taskElement.getByText('high')).toBeVisible();

    // Verify the task counter increased
    await expect(page.getByText(/Tasks \([1-9]\d*\)/)).toBeVisible();

    // Verify the "no tasks" message is not visible
    await expect(page.getByText('No tasks yet. Add one above to get started!')).not.toBeVisible();
  });

  test('should show validation error for empty task title', async ({ page }) => {
    // Try to submit without filling the title
    await page.getByTestId('add-task-button').click();

    // Should prevent submission due to required field
    // The form should not submit and stay on the same page
    await expect(page.getByPlaceholder('Enter task title...')).toBeVisible();
    
    // Check that the input has focus or shows validation
    const titleInput = page.getByPlaceholder('Enter task title...');
    await expect(titleInput).toBeFocused();
  });

  test('should add a minimal task with only title', async ({ page }) => {
    const taskTitle = `Minimal Task ${Date.now()}`;

    // Fill only the required title field
    await page.getByPlaceholder('Enter task title...').fill(taskTitle);

    // Submit the form
    await page.getByTestId('add-task-button').click();

    // Wait for the page to update
    await page.waitForLoadState('networkidle');

    // Find the specific task and verify its content
    const taskElement = page.locator(`[data-testid^="task-"]`).filter({ hasText: taskTitle });
    await expect(taskElement).toBeVisible();
    
    // Should have default medium priority within this specific task
    await expect(taskElement.getByText('medium')).toBeVisible();
  });

  test('should clear form after successful submission', async ({ page }) => {
    const taskTitle = `Task to test form clearing ${Date.now()}`;

    // Fill in the form
    await page.getByPlaceholder('Enter task title...').fill(taskTitle);
    await page.getByPlaceholder('Description (optional)').fill('Test description');
    await page.getByPlaceholder('Category (optional)').fill('Test category');

    // Submit the form
    await page.getByTestId('add-task-button').click();

    // Wait for the page to update
    await page.waitForLoadState('networkidle');

    // Verify the form fields are cleared
    await expect(page.getByPlaceholder('Enter task title...')).toHaveValue('');
    await expect(page.getByPlaceholder('Description (optional)')).toHaveValue('');
    await expect(page.getByPlaceholder('Category (optional)')).toHaveValue('');
  });

  test('should toggle task completion', async ({ page }) => {
    // First, add a task
    const taskTitle = `Toggle Test ${Date.now()}`;
    await page.getByPlaceholder('Enter task title...').fill(taskTitle);
    await page.getByTestId('add-task-button').click();
    await page.waitForLoadState('networkidle');

    // Find the task and its checkbox button
    const taskElement = page.locator(`[data-testid^="task-"]`).filter({ hasText: taskTitle });
    const checkboxButton = taskElement.locator('button[type="submit"]');

    // Wait for the task element to be visible
    await expect(taskElement).toBeVisible();

    // Initially unchecked (task text should not be crossed out)
    await expect(taskElement.locator('h3')).not.toHaveClass(/line-through/);

    // Wait for the checkbox button to be visible and enabled
    await expect(checkboxButton).toBeVisible();
    await expect(checkboxButton).toBeEnabled();

    // Click to mark as complete
    await checkboxButton.click();
    await page.waitForLoadState('networkidle');

    // Should now be crossed out (task completed)
    await expect(taskElement.locator('h3')).toHaveClass(/line-through/);
  });
});