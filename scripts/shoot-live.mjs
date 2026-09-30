import { chromium } from 'playwright'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await page.goto('https://astroyuvinut.github.io/', { waitUntil: 'networkidle' })
await page.waitForTimeout(4000) // let preloader finish + hero settle
await page.screenshot({ path: 'scripts/live.png' })
console.log('saved scripts/live.png')
await browser.close()
