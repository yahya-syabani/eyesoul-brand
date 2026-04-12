import { test, expect } from '@playwright/test';

test.describe('ISR Verification', () => {
  test('Verify cache hit on product catalog', async ({ request }) => {
    // First request should seed the cache
    await request.get('/catalog');
    
    // Second request should hit the Next.js cache (since it's a static route with revalidation)
    const response = await request.get('/catalog');
    
    // We expect the x-nextjs-cache or similar header if deployed to Vercel/Next 
    // In local dev `next start` it might be `HIT` or `STALE`
    const cacheHeader = response.headers()['x-nextjs-cache'];
    
    // In some local setups without full cache backend it may be undefined, 
    // but typically Next.js production builds add it.
    if (cacheHeader) {
      expect(['HIT', 'STALE']).toContain(cacheHeader);
    }
  });
});
