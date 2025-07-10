import { test, expect } from '@playwright/test';

test.describe('Edit Task', () => {
  test.beforeEach(async ({ page }) => {
    // Clean up any existing tasks before each test
    await page.goto('/');
    
    // Delete all existing tasks to ensure clean state
    const tasks = page.locator('[data-testid^="task-"]');
    const taskCount = await tasks.count();
    
    for (let i = 0; i < taskCount; i++) {
      const deleteButton = tasks.nth(0).locator('[data-testid^="delete-task-"]');
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        // Wait for confirmation dialog and confirm deletion using specific confirmation dialog selector
        await page.locator('div:has-text("Are you sure you want to delete") form button:has-text("Delete")').click();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('should edit a task successfully', async ({ page }) => {
    // First, create a task to edit
    const originalTitle = `Original Task ${Date.now()}`;
    const originalDescription = 'Original description';
    const originalCategory = 'Original Category';

    await page.getByPlaceholder('Enter task title...').fill(originalTitle);
    await page.getByPlaceholder('Description (optional)').fill(originalDescription);
    await page.getByPlaceholder('Category (optional)').fill(originalCategory);
    await page.getByTestId('add-task-button').click();
    await page.waitForLoadState('networkidle');

    // Find the task that was just created
    const taskElement = page.locator(`[data-testid^="task-"]`).filter({ hasText: originalTitle });
    await expect(taskElement).toBeVisible();

    // Click the edit button - use role since it's more specific than text
    const editButton = taskElement.getByRole('button', { name: 'Edit' });
    await editButton.click();

    // Wait for edit form to appear
    await expect(page.getByRole('heading', { name: 'Edit Task', exact: true })).toBeVisible();

    // Update the task details within the edit form
    const newTitle = `Updated Task ${Date.now()}`;
    const newDescription = 'Updated description';
    const newCategory = 'Updated Category';

    // Target the edit form specifically using a more specific selector
    const editFormContainer = page.locator('.bg-gray-50'); // The edit form has this specific background class
    await editFormContainer.getByPlaceholder('Enter task title...').fill(newTitle);
    await editFormContainer.getByPlaceholder('Description (optional)').fill(newDescription);
    await editFormContainer.getByPlaceholder('Category (optional)').fill(newCategory);
    await editFormContainer.getByRole('combobox').selectOption('high'); // Change priority to high

    // Save the changes
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await page.waitForLoadState('networkidle');

    // Verify the task was updated
    const updatedTaskElement = page.locator(`[data-testid^="task-"]`).filter({ hasText: newTitle });
    await expect(updatedTaskElement).toBeVisible();
    await expect(updatedTaskElement.getByText(newDescription)).toBeVisible();
    await expect(updatedTaskElement.getByText(newCategory)).toBeVisible();
    await expect(updatedTaskElement.getByText('high')).toBeVisible();

    // Verify the original task title is no longer visible
    await expect(page.getByText(originalTitle)).not.toBeVisible();
  });

  test('should cancel edit without saving changes', async ({ page }) => {
    // First, create a task to edit
    const originalTitle = `Cancel Test Task ${Date.now()}`;
    const originalDescription = 'Original description for cancel test';

    await page.getByPlaceholder('Enter task title...').fill(originalTitle);
    await page.getByPlaceholder('Description (optional)').fill(originalDescription);
    await page.getByTestId('add-task-button').click();
    await page.waitForLoadState('networkidle');

    // Find the task and click edit
    const taskElement = page.locator(`[data-testid^="task-"]`).filter({ hasText: originalTitle });
    const editButton = taskElement.getByRole('button', { name: 'Edit' });
    await editButton.click();

    // Wait for edit form to appear
    await expect(page.getByRole('heading', { name: 'Edit Task', exact: true })).toBeVisible();

    // Make some changes in the edit form
    const editFormContainer = page.locator('.bg-gray-50');
    await editFormContainer.getByPlaceholder('Enter task title...').fill('Changed title that should not be saved');
    
    // Cancel the edit
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Verify the original task is still visible with original content
    // Use the task element to check content within the specific task
    const verifyTaskElement = page.locator(`[data-testid^="task-"]`).filter({ hasText: originalTitle });
    await expect(verifyTaskElement).toBeVisible();
    await expect(verifyTaskElement.getByText(originalDescription)).toBeVisible();
    await expect(page.getByText('Changed title that should not be saved')).not.toBeVisible();
  });

  test('should validate required title field during edit', async ({ page }) => {
    // First, create a task to edit
    const originalTitle = `Validation Test Task ${Date.now()}`;

    await page.getByPlaceholder('Enter task title...').fill(originalTitle);
    await page.getByTestId('add-task-button').click();
    await page.waitForLoadState('networkidle');

    // Find the task and click edit
    const taskElement = page.locator(`[data-testid^="task-"]`).filter({ hasText: originalTitle });
    const editButton = taskElement.getByRole('button', { name: 'Edit' });
    await editButton.click();

    // Wait for edit form to appear
    await expect(page.getByRole('heading', { name: 'Edit Task', exact: true })).toBeVisible();

    // Clear the title field in the edit form (should be invalid)
    const editFormContainer = page.locator('.bg-gray-50');
    await editFormContainer.getByPlaceholder('Enter task title...').fill('');
    
    // Try to save - the browser should prevent submission due to required attribute
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    // The form should still be visible (not submitted)
    await expect(page.getByText('Edit Task')).toBeVisible();
    
    // The original task should still be visible in its original state
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText(originalTitle)).toBeVisible();
  });
});