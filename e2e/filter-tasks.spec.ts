import { test, expect } from '@playwright/test';

test.describe('Filter Tasks', () => {
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

  test('should display filter tabs with correct counts', async ({ page }) => {
    // Create tasks with different completion statuses
    const activeTask = `Active Task ${Date.now()}`;
    const completedTask = `Completed Task ${Date.now()}`;

    // Add first task (will be active)
    await page.getByPlaceholder('Enter task title...').fill(activeTask);
    await page.getByTestId('add-task-button').click();
    await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();

    // Add second task and mark it as completed
    await page.getByPlaceholder('Enter task title...').fill(completedTask);
    await page.getByTestId('add-task-button').click();
    await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();

    // Mark the second task as completed
    const completedTaskElement = page.locator(`[data-testid^="task-"]`).filter({ hasText: completedTask });
    const taskId = await completedTaskElement.getAttribute('data-testid');
    const taskNumber = taskId?.replace('task-', '') || '';
    await page.getByTestId(`toggle-task-${taskNumber}`).click();

    // Check filter tabs are visible
    await expect(page.getByTestId('filter-tabs')).toBeVisible();
    await expect(page.getByTestId('filter-all')).toBeVisible();
    await expect(page.getByTestId('filter-active')).toBeVisible();
    await expect(page.getByTestId('filter-completed')).toBeVisible();

    // Verify counts (should be 2 all, 1 active, 1 completed)
    await expect(page.getByTestId('filter-all').locator('span')).toContainText('2');
    await expect(page.getByTestId('filter-active').locator('span')).toContainText('1');
    await expect(page.getByTestId('filter-completed').locator('span')).toContainText('1');
  });

  test('should filter to show only active tasks', async ({ page }) => {
    // Create both active and completed tasks
    const activeTask = `Active Filter Test ${Date.now()}`;
    const completedTask = `Completed Filter Test ${Date.now()}`;

    // Add active task
    await page.getByPlaceholder('Enter task title...').fill(activeTask);
    await page.getByTestId('add-task-button').click();
    await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();

    // Add completed task
    await page.getByPlaceholder('Enter task title...').fill(completedTask);
    await page.getByTestId('add-task-button').click();
    await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();

    // Mark second task as completed
    const completedTaskElement = page.locator(`[data-testid^="task-"]`).filter({ hasText: completedTask });
    const taskId1 = await completedTaskElement.getAttribute('data-testid');
    const taskNumber1 = taskId1?.replace('task-', '') || '';
    await page.getByTestId(`toggle-task-${taskNumber1}`).click();

    // Click Active filter
    await page.getByTestId('filter-active').click();

    // Wait for URL to update with filter parameter
    await page.waitForURL('**/?filter=active');

    // Verify URL contains filter parameter
    expect(page.url()).toContain('filter=active');

    // Verify only active task is visible
    await expect(page.getByText(activeTask)).toBeVisible();
    await expect(page.getByText(completedTask)).not.toBeVisible();

    // Verify task count shows 1
    await expect(page.getByText('Tasks (1)')).toBeVisible();
  });

  test('should filter to show only completed tasks', async ({ page }) => {
    // Create both active and completed tasks
    const activeTask = `Active Completed Filter Test ${Date.now()}`;
    const completedTask = `Completed Completed Filter Test ${Date.now()}`;

    // Add active task
    await page.getByPlaceholder('Enter task title...').fill(activeTask);
    await page.getByTestId('add-task-button').click();
    await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();

    // Add completed task
    await page.getByPlaceholder('Enter task title...').fill(completedTask);
    await page.getByTestId('add-task-button').click();
    await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();

    // Mark second task as completed
    const completedTaskElement = page.locator(`[data-testid^="task-"]`).filter({ hasText: completedTask });
    const taskId2 = await completedTaskElement.getAttribute('data-testid');
    const taskNumber2 = taskId2?.replace('task-', '') || '';
    await page.getByTestId(`toggle-task-${taskNumber2}`).click();

    // Click Completed filter
    await page.getByTestId('filter-completed').click();

    // Wait for URL to update with filter parameter
    await page.waitForURL('**/?filter=completed');

    // Verify URL contains filter parameter
    expect(page.url()).toContain('filter=completed');

    // Verify only completed task is visible
    await expect(page.getByText(completedTask)).toBeVisible();
    await expect(page.getByText(activeTask)).not.toBeVisible();

    // Verify task count shows 1
    await expect(page.getByText('Tasks (1)')).toBeVisible();
  });

  test('should show all tasks when All filter is selected', async ({ page }) => {
    // Create both active and completed tasks
    const activeTask = `Active All Filter Test ${Date.now()}`;
    const completedTask = `Completed All Filter Test ${Date.now()}`;

    // Add tasks
    await page.getByPlaceholder('Enter task title...').fill(activeTask);
    await page.getByTestId('add-task-button').click();
    await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();

    await page.getByPlaceholder('Enter task title...').fill(completedTask);
    await page.getByTestId('add-task-button').click();
    await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();

    // Mark second task as completed
    const completedTaskElement = page.locator(`[data-testid^="task-"]`).filter({ hasText: completedTask });
    const taskId3 = await completedTaskElement.getAttribute('data-testid');
    const taskNumber3 = taskId3?.replace('task-', '') || '';
    await page.getByTestId(`toggle-task-${taskNumber3}`).click();

    // First filter to active
    await page.getByTestId('filter-active').click();

    // Then click All filter
    await page.getByTestId('filter-all').click();

    // Wait for URL to be cleared of filter parameters
    await page.waitForURL('http://localhost:3000/');

    // Verify URL doesn't contain filter parameter (default)
    expect(page.url()).not.toContain('filter=');

    // Verify both tasks are visible
    await expect(page.getByText(activeTask)).toBeVisible();
    await expect(page.getByText(completedTask)).toBeVisible();

    // Verify task count shows 2
    await expect(page.getByText('Tasks (2)')).toBeVisible();
  });

  test('should persist filter when navigating back to page', async ({ page }) => {
    // Create a completed task
    const completedTask = `Persist Filter Test ${Date.now()}`;
    
    await page.getByPlaceholder('Enter task title...').fill(completedTask);
    await page.getByTestId('add-task-button').click();
    await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();

    // Mark task as completed
    const taskElement = page.locator(`[data-testid^="task-"]`).filter({ hasText: completedTask });
    const taskId4 = await taskElement.getAttribute('data-testid');
    const taskNumber4 = taskId4?.replace('task-', '') || '';
    await page.getByTestId(`toggle-task-${taskNumber4}`).click();

    // Filter to completed tasks
    await page.getByTestId('filter-completed').click();

    // Navigate away and back
    await page.goto('/');
    await page.goto('/?filter=completed');
    await page.waitForLoadState('networkidle');

    // Verify filter is still active
    await expect(page.getByTestId('filter-completed')).toHaveClass(/bg-primary|bg-blue/);
    await expect(page.getByText(completedTask)).toBeVisible();
    await expect(page.getByText('Tasks (1)')).toBeVisible();
  });

  test('should show appropriate empty state for each filter', async ({ page }) => {
    // Start with empty state
    await expect(page.getByTestId('empty-tasks-message')).toContainText('No tasks yet');

    // Add one active task
    const activeTask = `Empty State Test ${Date.now()}`;
    await page.getByPlaceholder('Enter task title...').fill(activeTask);
    await page.getByTestId('add-task-button').click();
    await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();

    // Filter to completed (should show empty state)
    await page.getByTestId('filter-completed').click();

    await expect(page.getByTestId('empty-tasks-message')).toContainText('No completed tasks found');

    // Filter to active (should show the task)
    await page.getByTestId('filter-active').click();

    await expect(page.getByText(activeTask)).toBeVisible();
    await expect(page.getByTestId('empty-tasks-message')).not.toBeVisible();
  });

  test('should update filter counts when task completion status changes', async ({ page }) => {
    // Create a task
    const taskTitle = `Count Update Test ${Date.now()}`;
    
    await page.getByPlaceholder('Enter task title...').fill(taskTitle);
    await page.getByTestId('add-task-button').click();
    await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();

    // Initially: 1 all, 1 active, 0 completed
    await expect(page.getByTestId('filter-all').locator('span')).toContainText('1');
    await expect(page.getByTestId('filter-active').locator('span')).toContainText('1');
    await expect(page.getByTestId('filter-completed').locator('span')).toContainText('0');

    // Mark task as completed
    const taskElement = page.locator(`[data-testid^="task-"]`).filter({ hasText: taskTitle });
    const taskId5 = await taskElement.getAttribute('data-testid');
    const taskNumber5 = taskId5?.replace('task-', '') || '';
    await page.getByTestId(`toggle-task-${taskNumber5}`).click();

    // Now: 1 all, 0 active, 1 completed
    await expect(page.getByTestId('filter-all').locator('span')).toContainText('1');
    await expect(page.getByTestId('filter-active').locator('span')).toContainText('0');
    await expect(page.getByTestId('filter-completed').locator('span')).toContainText('1');

    // Mark task as active again
    await page.getByTestId(`toggle-task-${taskNumber5}`).click();

    // Back to: 1 all, 1 active, 0 completed
    await expect(page.getByTestId('filter-all').locator('span')).toContainText('1');
    await expect(page.getByTestId('filter-active').locator('span')).toContainText('1');
    await expect(page.getByTestId('filter-completed').locator('span')).toContainText('0');
  });
});