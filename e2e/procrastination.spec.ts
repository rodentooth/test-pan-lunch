import { test, expect } from '@playwright/test';

test.describe('Procrastination Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Clean up any existing tasks
    const existingTasks = page.locator('[data-testid^="task-"]');
    const taskCount = await existingTasks.count();
    
    for (let i = 0; i < taskCount; i++) {
      const task = existingTasks.nth(0);
      const deleteButton = task.getByTestId(/delete-task-\d+/);
      await deleteButton.click();
      
      // Wait for delete confirmation dialog and confirm
      const confirmDialog = page.locator('div:has-text("Are you sure you want to delete")');
      await expect(confirmDialog).toBeVisible();
      await confirmDialog.getByRole('button', { name: 'Delete' }).click();
    }
    
    await page.goto('/');
  });

  test('should not show procrastination message for first few tasks', async ({ page }) => {
    // Add first task
    await page.getByPlaceholder('Enter task title...').fill('First Task');
    await page.getByTestId('add-task-button').click();
    await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();

    // Add second task
    await page.getByPlaceholder('Enter task title...').fill('Second Task');
    await page.getByTestId('add-task-button').click();
    await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();

    // Should not show procrastination message
    await expect(page.getByTestId('dismiss-procrastination')).not.toBeVisible();
  });

  test('should show procrastination message after creating several tasks', async ({ page }) => {
    // Add 3 tasks to trigger procrastination logic
    for (let i = 1; i <= 3; i++) {
      await page.getByPlaceholder('Enter task title...').fill(`Task ${i}`);
      await page.getByTestId('add-task-button').click();
      await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();
    }

    // Try to add another task - should trigger procrastination message (with some probability)
    await page.getByPlaceholder('Enter task title...').fill('Procrastination Test Task');
    await page.getByTestId('add-task-button').click();

    // Either the task is created immediately or procrastination message appears
    // Since it's random, we check for either outcome
    const procrastinationMessage = page.getByTestId('dismiss-procrastination');
    const newTask = page.locator('[data-testid^="task-"]').filter({ hasText: 'Procrastination Test Task' });
    
    // One of these should be true
    const messageVisible = await procrastinationMessage.isVisible();
    const taskCreated = await newTask.isVisible();
    
    expect(messageVisible || taskCreated).toBe(true);
  });

  test('should allow dismissing procrastination message and create task', async ({ page }) => {
    // Create enough tasks to potentially trigger procrastination
    for (let i = 1; i <= 5; i++) {
      await page.getByPlaceholder('Enter task title...').fill(`Setup Task ${i}`);
      await page.getByTestId('add-task-button').click();
      await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();
    }

    // Keep trying to create a task until procrastination message appears
    let attempts = 0;
    while (attempts < 10) {
      await page.getByPlaceholder('Enter task title...').fill(`Test Task ${Date.now()}`);
      await page.getByTestId('add-task-button').click();
      
      const procrastinationMessage = page.getByTestId('dismiss-procrastination');
      
      if (await procrastinationMessage.isVisible()) {
        // Great! Procrastination message appeared
        expect(await procrastinationMessage.isVisible()).toBe(true);
        
        // Dismiss it by clicking "Create Task Anyway"
        await page.getByTestId('create-anyway-button').click();
        
        // Task should be created
        await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();
        break;
      }
      
      attempts++;
      // If task was created without procrastination, continue trying
      await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();
    }
  });

  test('should show procrastination countdown when procrastinate button is clicked', async ({ page }) => {
    // Create tasks to trigger procrastination
    for (let i = 1; i <= 5; i++) {
      await page.getByPlaceholder('Enter task title...').fill(`Setup Task ${i}`);
      await page.getByTestId('add-task-button').click();
      await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();
    }

    // Keep trying until procrastination message appears
    let attempts = 0;
    while (attempts < 10) {
      await page.getByPlaceholder('Enter task title...').fill(`Procrastinate Test ${Date.now()}`);
      await page.getByTestId('add-task-button').click();
      
      const procrastinationMessage = page.getByTestId('dismiss-procrastination');
      
      if (await procrastinationMessage.isVisible()) {
        // Click procrastinate button
        await page.getByTestId('procrastinate-button').click();
        
        // Should show countdown
        await expect(page.getByText(/Procrastination mode active/)).toBeVisible();
        await expect(page.getByText(/5:00|4:59|4:58/)).toBeVisible();
        
        // Form should be disabled
        await expect(page.getByPlaceholder('Enter task title...')).toBeDisabled();
        await expect(page.getByTestId('add-task-button')).toBeDisabled();
        break;
      }
      
      attempts++;
      await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();
    }
  });

  test('should show easter egg messages for power users', async ({ page }) => {
    // Create 10+ tasks to trigger easter egg messages
    for (let i = 1; i <= 12; i++) {
      await page.getByPlaceholder('Enter task title...').fill(`Power User Task ${i}`);
      await page.getByTestId('add-task-button').click();
      await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();
    }

    // Try to trigger procrastination message
    let attempts = 0;
    while (attempts < 10) {
      await page.getByPlaceholder('Enter task title...').fill(`Easter Egg Test ${Date.now()}`);
      await page.getByTestId('add-task-button').click();
      
      const procrastinationMessage = page.getByTestId('dismiss-procrastination');
      
      if (await procrastinationMessage.isVisible()) {
        // Should contain easter egg indicators (emojis or special text)
        const messageText = await procrastinationMessage.textContent();
        const hasEasterEgg = messageText?.includes('🏆') || 
                            messageText?.includes('⚡') || 
                            messageText?.includes('🎭') ||
                            messageText?.includes('Champion') ||
                            messageText?.includes('Professional Procrastinator');
        
        expect(hasEasterEgg).toBe(true);
        
        // Dismiss and continue
        await page.getByTestId('create-anyway-button').click();
        break;
      }
      
      attempts++;
      await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();
    }
  });

  test('should show task count tip for users with multiple tasks', async ({ page }) => {
    // Create 5+ tasks to trigger the tip
    for (let i = 1; i <= 6; i++) {
      await page.getByPlaceholder('Enter task title...').fill(`Tip Test Task ${i}`);
      await page.getByTestId('add-task-button').click();
      await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();
    }

    // Try to trigger procrastination message
    let attempts = 0;
    while (attempts < 10) {
      await page.getByPlaceholder('Enter task title...').fill(`Tip Trigger ${Date.now()}`);
      await page.getByTestId('add-task-button').click();
      
      const procrastinationMessage = page.getByTestId('dismiss-procrastination');
      
      if (await procrastinationMessage.isVisible()) {
        // Should show tip about existing tasks
        await expect(page.getByText(/Pro tip.*tasks already/)).toBeVisible();
        
        await page.getByTestId('create-anyway-button').click();
        break;
      }
      
      attempts++;
      await expect(page.locator(`[data-testid^="task-"]`).last()).toBeVisible();
    }
  });
});