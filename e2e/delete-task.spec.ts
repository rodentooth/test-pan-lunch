import { test, expect } from '@playwright/test';

test.describe('Delete Task', () => {
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

  test('should show delete confirmation dialog', async ({ page }) => {
    // First, create a task to delete
    const taskTitle = `Delete Test Task ${Date.now()}`;
    const taskDescription = 'This task will be deleted';

    await page.getByPlaceholder('Enter task title...').fill(taskTitle);
    await page.getByPlaceholder('Description (optional)').fill(taskDescription);
    await page.getByTestId('add-task-button').click();
    await page.waitForLoadState('networkidle');

    // Find the task and click delete
    const taskElement = page.locator(`[data-testid^="task-"]`).filter({ hasText: taskTitle });
    await expect(taskElement).toBeVisible();
    
    const deleteButton = taskElement.getByRole('button', { name: 'Delete' });
    await deleteButton.click();

    // Verify confirmation dialog appears
    const confirmDialog = page.locator('.fixed.inset-0'); // The modal backdrop
    await expect(confirmDialog).toBeVisible();
    await expect(confirmDialog.getByRole('heading', { name: 'Delete Task' })).toBeVisible();
    await expect(page.getByText(`Are you sure you want to delete "${taskTitle}"?`)).toBeVisible();
    await expect(confirmDialog.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(confirmDialog.getByRole('button', { name: 'Delete' })).toBeVisible();
  });

  test('should cancel deletion when Cancel is clicked', async ({ page }) => {
    // First, create a task to delete
    const taskTitle = `Cancel Delete Task ${Date.now()}`;
    
    await page.getByPlaceholder('Enter task title...').fill(taskTitle);
    await page.getByTestId('add-task-button').click();
    await page.waitForLoadState('networkidle');

    // Find the task and click delete
    const taskElement = page.locator(`[data-testid^="task-"]`).filter({ hasText: taskTitle });
    const deleteButton = taskElement.getByRole('button', { name: 'Delete' });
    await deleteButton.click();

    // Verify confirmation dialog appears
    const confirmDialog = page.locator('.fixed.inset-0');
    await expect(confirmDialog).toBeVisible();
    await expect(confirmDialog.getByRole('heading', { name: 'Delete Task' })).toBeVisible();

    // Click Cancel in the dialog
    await confirmDialog.getByRole('button', { name: 'Cancel' }).click();

    // Verify dialog disappears and task is still visible
    await expect(confirmDialog).not.toBeVisible();
    await expect(page.getByText(taskTitle)).toBeVisible();
  });

  test('should delete task when confirmed', async ({ page }) => {
    // First, create a task to delete
    const taskTitle = `Confirm Delete Task ${Date.now()}`;
    const taskDescription = 'This task will be permanently deleted';

    await page.getByPlaceholder('Enter task title...').fill(taskTitle);
    await page.getByPlaceholder('Description (optional)').fill(taskDescription);
    await page.getByTestId('add-task-button').click();
    await page.waitForLoadState('networkidle');

    // Verify task exists
    const taskElement = page.locator(`[data-testid^="task-"]`).filter({ hasText: taskTitle });
    await expect(taskElement).toBeVisible();

    // Click delete button
    const deleteButton = taskElement.getByRole('button', { name: 'Delete' });
    await deleteButton.click();

    // Confirm deletion
    const confirmDialog = page.locator('.fixed.inset-0');
    await expect(confirmDialog).toBeVisible();
    await expect(confirmDialog.getByRole('heading', { name: 'Delete Task' })).toBeVisible();
    await confirmDialog.getByRole('button', { name: 'Delete' }).click();
    
    // Wait for the action to complete
    await page.waitForLoadState('networkidle');

    // Verify task is no longer visible in the task list
    await expect(taskElement).not.toBeVisible();
    await expect(page.getByText(taskDescription)).not.toBeVisible();
  });

  test('should handle deletion of task with long title', async ({ page }) => {
    // Create a task with a very long title
    const longTitle = `This is a very long task title that should be handled properly in the delete confirmation dialog ${Date.now()}`;
    
    await page.getByPlaceholder('Enter task title...').fill(longTitle);
    await page.getByTestId('add-task-button').click();
    await page.waitForLoadState('networkidle');

    // Find and delete the task
    const taskElement = page.locator(`[data-testid^="task-"]`).filter({ hasText: longTitle });
    const deleteButton = taskElement.getByRole('button', { name: 'Delete' });
    await deleteButton.click();

    // Verify confirmation dialog shows the title correctly
    const confirmDialog = page.locator('.fixed.inset-0');
    await expect(confirmDialog).toBeVisible();
    await expect(confirmDialog.getByRole('heading', { name: 'Delete Task' })).toBeVisible();
    // Check that the title appears in the confirmation (may be truncated but should be present)
    await expect(confirmDialog.filter({ hasText: longTitle })).toBeVisible();

    // Confirm deletion
    await confirmDialog.getByRole('button', { name: 'Delete' }).click();
    await page.waitForLoadState('networkidle');

    // Verify task is deleted from the task list
    await expect(taskElement).not.toBeVisible();
  });
});