import { test, expect } from '@playwright/test'

test('debug url', async ({ page }) => {
    await page.goto('/login')
    await page.fill('#email', 'admin@ordoc.ai')
    await page.fill('#password', 'admin123')
    await page.click('button[type="submit"]')

    await page.waitForTimeout(5000)
    console.log('Current URL:', page.url())

    // Take screenshot
    await page.screenshot({ path: 'debug-url.png' })
})
