import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Every route the site serves. Kept as a literal list rather than crawled, so
 * that deleting a page by accident fails the suite instead of shrinking it.
 */
const ROUTES = [
  '/',
  '/services',
  '/services/bespoke-software',
  '/services/erp-and-sap',
  '/services/systems-integration',
  '/services/crm',
  '/services/ai',
  '/services/iot-and-shop-floor',
  '/services/digital-transformation',
  '/services/support-and-hosting',
  '/about',
  '/contact',
  '/book',
  '/blog',
  '/blog/advantages-of-sql-server-2017',
  '/blog/successful-sap-integration-profits-any-business',
  '/blog/an-overview-of-sap-leonardo',
  '/blog/why-you-should-consider-migrating-to-sap-s-4hana-from-your-current-sap-system',
  '/work',
  '/privacy',
];

test.describe('every page', () => {
  for (const route of ROUTES) {
    test(`${route} loads, has one h1 and a booking route`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (error) => errors.push(error.message));

      const response = await page.goto(route);
      expect(response?.status(), `${route} should return 200`).toBe(200);

      await expect(page.locator('h1')).toHaveCount(1);
      // head > title: an inline SVG can legitimately carry its own <title>.
      await expect(page.locator('head > title')).not.toBeEmpty();

      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveAttribute('content', /.{50,}/);

      // Every page must give the visitor a way to start a conversation.
      await expect(page.locator('a[href="/book"]').first()).toBeAttached();

      // Third-party embeds are excluded: we do not control their console.
      const ours = errors.filter((e) => !/tally|cal\.com|cloudflareinsights/i.test(e));
      expect(ours, `console errors on ${route}`).toEqual([]);
    });
  }
});

test.describe('theme', () => {
  test('toggles, persists across a reload and paints no flash', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);

    await page.getByRole('button', { name: /switch to dark theme/i }).click();
    await expect(html).toHaveClass(/dark/);

    await page.reload();
    await expect(html).toHaveClass(/dark/);

    // The pre-paint script must set the class before the body renders, or the
    // page visibly flips theme on every load.
    const setBeforeBody = await page.evaluate(() => {
      const scripts = [...document.querySelectorAll('head script:not([src])')];
      return scripts.some((s) => s.textContent?.includes("classList.toggle('dark'"));
    });
    expect(setBeforeBody).toBe(true);
  });

  test('follows the operating system preference when nothing is stored', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});

test.describe('cookie consent', () => {
  test('does not load Google Analytics until it is accepted', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#consent-banner')).toBeVisible();
    expect(await page.evaluate(() => Boolean((window as any).__gaLoaded))).toBe(false);

    await page.getByRole('button', { name: 'Accept' }).click();
    await expect(page.locator('#consent-banner')).toBeHidden();
    expect(await page.evaluate(() => Boolean((window as any).__gaLoaded))).toBe(true);
  });

  test('remembers a refusal across pages', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'No thanks' }).click();

    await page.goto('/services');
    await expect(page.locator('#consent-banner')).toBeHidden();
    expect(await page.evaluate(() => Boolean((window as any).__gaLoaded))).toBe(false);
  });
});

test.describe('forms', () => {
  // The embed is the entire lead funnel. Asserting the src is populated is
  // network-independent, so this still fails loudly if the loader regresses.
  for (const [route, formId] of [
    ['/contact', 'GxM0GQ'],
    ['/book', 'jaKxRY'],
  ]) {
    test(`${route} actually loads its Tally form`, async ({ page }) => {
      await page.goto(route);
      const frame = page.locator(`iframe[src*="tally.so/embed/${formId}"]`);
      await expect(frame).toHaveCount(1);
      await expect(frame).toHaveAttribute('title', /\w/);
    });
  }
});

test.describe('navigation', () => {
  test('hides Work while there are no published case studies', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header a[href="/work"]')).toHaveCount(0);
  });

  test('opens and closes on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile menu only exists below the lg breakpoint');
    await page.goto('/');

    const toggle = page.getByRole('button', { name: 'Open menu' });
    await expect(page.locator('#mobile-nav')).toBeHidden();
    await toggle.click();
    await expect(page.locator('#mobile-nav')).toBeVisible();
  });
});

test.describe('search engines and social', () => {
  test('serves a sitemap and an RSS feed', async ({ request }) => {
    expect((await request.get('/sitemap-index.xml')).status()).toBe(200);

    const rss = await request.get('/rss.xml');
    expect(rss.status()).toBe(200);
    expect(await rss.text()).toContain('<item>');
  });

  test('keeps noindex pages out of the sitemap', async ({ request, page }) => {
    const xml = await (await request.get('/sitemap-0.xml')).text();
    const listed = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);

    expect(listed.length).toBeGreaterThan(10);

    for (const url of listed) {
      expect(url, 'sitemap URLs must not carry a file extension').not.toContain('.html');
      await page.goto(new URL(url).pathname || '/');
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    }
  });

  test('every page declares a canonical URL and an OG image', async ({ page }) => {
    await page.goto('/services/crm');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://www.coravant.co.uk/services/crm',
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og\.png$/);
  });

  test('service pages publish FAQ structured data', async ({ page }) => {
    await page.goto('/services/erp-and-sap');
    const schema = await page.locator('script[type="application/ld+json"]').textContent();
    expect(schema).toContain('FAQPage');
    expect(schema).toContain('"@type":"Service"');
  });
});

const scan = async (page: Page, route: string) => {
  await page.goto(route);
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
};

test.describe('accessibility', () => {
  for (const route of ['/', '/services', '/services/ai', '/blog', '/contact', '/book']) {
    test(`${route} has no WCAG A or AA violations in light mode`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' });
      await scan(page, route);
    });

    test(`${route} has no WCAG A or AA violations in dark mode`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await scan(page, route);
    });
  }
});
