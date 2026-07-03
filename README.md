# My Userscript Collection 🚀

A curated collection of custom userscripts designed to enhance, tweak, and automate web applications for a smoother browsing experience. 

These scripts are built to be compatible with any modern userscript manager, such as **Tampermonkey**, **Violentmonkey**, **Greasemonkey**, or **FireMonkey**.

---

## 🛠️ Included Scripts

### 1. Mammouth AI Autoprompt
Automates and optimizes search queries specifically for [mammouth.ai](https://mammouth.ai). It intercepts search requests or pre-fills prompts to streamline your AI search workflow directly from your browser.
*   **Path:** `/mammouth-ai-autoprompt/`
*   **Install Link:** _[Link to your raw user.js once uploaded]_

### 2. Jira Click-to-Edit Tweak
Prevents accidental inline editing in Jira issues. Instead of entering edit mode with a single click or double-click anywhere on the text field, this script restricts editing purely to clicking the official "pencil" icon.
*   **Path:** `/jira-click-to-edit/`
*   **Install Link:** _[Link to your raw user.js once uploaded]_

---

## ⚙️ How to Install

1. Make sure you have a userscript manager extension installed in your browser:
   * [Tampermonkey](https://www.tampermonkey.net/) (Recommended)
   * [Violentmonkey](https://violentmonkey.github.io/)
   * [Greasemonkey](https://www.greasemonkey.net/)
2. Navigate to the folder of the script you want to install.
3. Click on the script file (e.g., `mammouth-autoprompt.user.js`).
4. Click the **"Raw"** button in the top-right corner of the GitHub file viewer.
5. Your userscript manager will automatically detect the script and prompt you to install it.

---

## 📁 Repository Structure

```text
.
├── README.md                          <-- This file
├── mammouth-ai-autoprompt/            <-- Mammouth AI Helper
│   ├── README.md
│   └── mammouth-autoprompt.user.js
└── jira-click-to-edit/                <-- Jira Workflow Fix
    ├── README.md
    └── jira-click-edit.user.js
