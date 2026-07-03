# Jira Click-to-Edit ONLY via Pen Icon

Tired of accidentally triggering the inline editor in Jira just by clicking around a ticket? This Tampermonkey user script disables accidental clicks and double-clicks on editable fields. It ensures that editing is **only** activated when you explicitly click on the small **Pen Icon** (edit icon).

All other actions, including the "Save" (Checkmark) and "Cancel" (X) buttons, continue to work perfectly.

---

## ✨ Features

* **No Accidental Editing:** Prevents Jira from opening the edit mode when you click or double-click on text blocks, headers, or descriptions.
* **Pen-Icon Only:** Forces you to click the small edit pencil icon to start editing a field.
* **Fully Compatible:** Does not interfere with the saving or discarding of your changes (the checkmark and close icons work as normal).
* **Generic URL Matching:** Automatically works across various Jira subdomains and instances.

---

## 🚀 Installation

1. Make sure you have the **Tampermonkey** browser extension installed.
2. Create a new script in Tampermonkey.
3. Paste the code from the `jira-click-edit.user.js` file into the editor.
4. Save the script.

---

## 🛠️ Configuration & Domain Matching

By default, the script is configured with flexible Regular Expressions (`@include`) to automatically match standard Jira URLs containing `/browse/`:

```javascript
// ==UserScript==
...
// @include      /^https:\/\/jira\..*\/browse\/.* $ /
// @include      /^https:\/\/.*\.jira\..*\/browse\/.* $ /
...
