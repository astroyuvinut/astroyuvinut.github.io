import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(1100) // mid-count
await page.screenshot({ path: 'scripts/preloader.png' })
console.log('saved scripts/preloader.png')
await browser.close()
