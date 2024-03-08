describe('Google', () => {
    beforeAll(async () => {
        await page.goto('https://google.com', {
            headless: true,
        });
    });

    it('should be titled "Google"', async () => {
        await expect(page.title()).resolves.toMatch('Google');
    });
});