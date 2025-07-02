import { test, expect } from '@playwright/test';

test.describe('Add New Task', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
  });

  test('should add a new task successfully', async ({ page }) => {
    // Wait for the page to load
    await expect(page.getByRole('heading', { name: 'Task Manager' })).toBeVisible();

    // Fill in the task form
    const taskTitle = 'Test Task from E2E';
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

    // Check if the task title is visible
    await expect(page.getByText(taskTitle)).toBeVisible();
    
    // Check if the task description is visible
    await expect(page.getByText(taskDescription)).toBeVisible();
    
    // Check if the category badge is visible
    await expect(page.getByText(taskCategory)).toBeVisible();
    
    // Check if the priority badge is visible and shows "high"
    await expect(page.getByText('high')).toBeVisible();

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
    const taskTitle = 'Minimal Task';

    // Fill only the required title field
    await page.getByPlaceholder('Enter task title...').fill(taskTitle);

    // Submit the form
    await page.getByTestId('add-task-button').click();

    // Wait for the page to update
    await page.waitForLoadState('networkidle');

    // Verify the task appears in the list
    await expect(page.getByText(taskTitle)).toBeVisible();
    
    // Should have default medium priority
    await expect(page.getByText('medium')).toBeVisible();
  });

  test('should clear form after successful submission', async ({ page }) => {
    const taskTitle = 'Task to test form clearing';

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
    const taskTitle = 'Task to toggle';
    await page.getByPlaceholder('Enter task title...').fill(taskTitle);
    await page.getByTestId('add-task-button').click();
    await page.waitForLoadState('networkidle');

    // Find the task and its checkbox
    const taskElement = page.locator(`[data-testid^="task-"]`).filter({ hasText: taskTitle });
    const checkbox = taskElement.locator('input[type="checkbox"]');

    // Initially unchecked
    await expect(checkbox).not.toBeChecked();

    // Click to mark as complete
    await checkbox.click();
    await page.waitForLoadState('networkidle');

    // Should now be checked and text should be crossed out
    await expect(checkbox).toBeChecked();
    await expect(taskElement.locator('h3')).toHaveClass(/line-through/);
  });
});