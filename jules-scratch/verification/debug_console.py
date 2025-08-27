from playwright.sync_api import sync_playwright

def handle_console_message(msg):
    print(f"Console message: {msg.text}")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.on("console", handle_console_message)
    page.set_viewport_size({"width": 375, "height": 667})
    page.goto("http://localhost:5173/help")
    page.wait_for_load_state("networkidle")
    browser.close()
