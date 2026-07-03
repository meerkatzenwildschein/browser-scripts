# Mammouth AI Autoprompt

This user script makes using **Mammouth AI** even faster and more seamless. When you type a search term directly into your browser's address bar, you will be redirected to Mammouth AI, and this script ensures your query is **automatically submitted** without you having to manually click "Send" or press Enter.

---

##  Setup in 2 Steps

To use this setup, you need to install the Tampermonkey script and configure Mammouth AI as a custom search engine in your browser.

### Step 1: Install the Tampermonkey Script

1. Make sure you have the **Tampermonkey** browser extension installed.
2. Create a new script in Tampermonkey and paste the code from the `mammouth-ai-autoprompt.user.js` file (or click "Install" if you are opening the raw file URL from this repository).
3. Save the script.

### Step 2: Add Mammouth AI as a Browser Search Engine

To be able to type your queries directly into the address bar, you must add Mammouth AI as a search engine.

#### For Google Chrome / Brave / Edge:
1. Open your browser settings and go to **Search engines** (or navigate directly to `chrome://settings/searchEngines`).
2. Under "Site search" (or "Search engines"), click **Add**.
3. Fill in the following details:
   * **Search engine:** `Mammouth AI`
   * **Shortcut:** `m` (or any shortcut of your choice, e.g., `ai`)
   * **URL with %s in place of query:**
     ```text
     https://mammouth.ai/app/a/default?prompt=%s
     ```
4. Click **Save**.

#### For Mozilla Firefox:
1. Navigate to `https://mammouth.ai/`.
2. Right-click inside the prompt input field on the Mammouth AI website.
3. Select **"Add a Keyword for this Search..."** from the context menu.
4. Give it a name (e.g., `Mammouth AI`) and a keyword (e.g., `m`).
5. Alternatively, you can add it via the Firefox Settings under **Search** using the search engine manager with this URL:
   ```text
   https://mammouth.ai/app/a/default?prompt=%s

