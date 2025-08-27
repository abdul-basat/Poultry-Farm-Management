from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.set_viewport_size({"width": 375, "height": 667})
    page.goto("http://localhost:5173/help")
    page.wait_for_load_state("networkidle")
    print(page.content())
    page.screenshot(path="jules-scratch/verification/06_help_page_with_toggle_en.png")
    # Switch to Urdu
    page.click('[data-testid="language-toggle-button"]')
    page.wait_for_load_state("networkidle")
    page.screenshot(path="jules-scratch/verification/07_help_page_with_toggle_ur.png")
    browser.close()
