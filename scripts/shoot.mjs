import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })

// let the load animations settle
await page.waitForTimeout(2500)

// move the cursor onto the figure so the reveal + circuit glow are visible
await page.mouse.move(905, 470, { steps: 24 })
await page.waitForTimeout(1200)

await page.screenshot({ path: 'scripts/hero.png' })
console.log('saved scripts/hero.png')
await browser.close()
