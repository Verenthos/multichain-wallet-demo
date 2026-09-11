import { test, expect, type Page } from '@playwright/test'
import type { MockConfig } from '../src/wallet/mock'

const SOLANA_ADDRESS = 'MockSo1anaAddress1111111111111111111111111'
const SUI_ADDRESS = '0x' + '1234'.repeat(16)

// The dev server runs with VITE_WALLET_MOCK=true (see playwright.config.ts), so the factory returns
// the mock adapter. addInitScript runs before any page script, which is when the mock reads its config.
async function openApp(page: Page, config: MockConfig = {}) {
  await page.addInitScript((c) => {
    window.__walletMock = c
  }, config)
  await page.goto('/')
}

test('starts disconnected', async ({ page }) => {
  await openApp(page)
  await expect(page.getByTestId('status')).toHaveText('disconnected')
  await expect(page.getByTestId('address')).toHaveText('none')
  await expect(page.getByTestId('connect')).toBeEnabled()
})

test('shows connecting while the wallet prompt is open', async ({ page }) => {
  await openApp(page, { connectDelayMs: 1000 })
  await page.getByTestId('connect').click()
  await expect(page.getByTestId('status')).toHaveText('connecting')
  await expect(page.getByTestId('connect')).toBeDisabled()
  await expect(page.getByTestId('chain-sui')).toBeDisabled()
  await expect(page.getByTestId('status')).toHaveText('connected')
})

test('shows the address once connected', async ({ page }) => {
  await openApp(page)
  await page.getByTestId('connect').click()
  await expect(page.getByTestId('status')).toHaveText('connected')
  await expect(page.getByTestId('address')).toHaveText(SOLANA_ADDRESS)
  await expect(page.getByTestId('disconnect')).toBeVisible()
})

test('shows an error when the wallet rejects the connection', async ({ page }) => {
  await openApp(page, { rejectConnect: true })
  await page.getByTestId('connect').click()
  await expect(page.getByTestId('status')).toHaveText('error')
  await expect(page.getByTestId('error')).toHaveText('User rejected the request.')
  await expect(page.getByTestId('address')).toHaveText('none')
  await expect(page.getByTestId('connect')).toBeEnabled()
})

test('switching chain disconnects and connects on the new chain', async ({ page }) => {
  await openApp(page)
  await page.getByTestId('connect').click()
  await expect(page.getByTestId('address')).toHaveText(SOLANA_ADDRESS)

  await page.getByTestId('chain-sui').click()
  await expect(page.getByTestId('status')).toHaveText('disconnected')
  await expect(page.getByTestId('address')).toHaveText('none')

  await page.getByTestId('connect').click()
  await expect(page.getByTestId('status')).toHaveText('connected')
  await expect(page.getByTestId('address')).toHaveText(SUI_ADDRESS)

  await page.getByTestId('chain-solana').click()
  await expect(page.getByTestId('status')).toHaveText('disconnected')
  await expect(page.getByTestId('address')).toHaveText('none')
})
