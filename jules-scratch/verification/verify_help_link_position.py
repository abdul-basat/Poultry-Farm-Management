from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()

    # Desktop view
    page.set_viewport_size({"width": 1280, "height": 720})
    page.goto("http://localhost:5173/")
    page.wait_for_load_state("networkidle")
    page.screenshot(path="jules-scratch/verification/06_desktop_sidebar.png")

    # Mobile view
    page.set_viewport_size({"width": 375, "height": 667})
    page.goto("http://localhost:5173/")
    page.wait_for_load_state("networkidle")
    page.get_by_role("button", name="Open sidebar").click()
    page.wait_for_selector('a[href="/help"]')
    page.screenshot(path="jules-scratch/verification/07_mobile_sidebar.png")

    browser.close()
