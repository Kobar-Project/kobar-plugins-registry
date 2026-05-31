# 🧩 KoBar Plugins Registry

Welcome to the official Plugin Registry for [KoBar](https://github.com/Kobar-Project/KoBar)! 

This repository serves as the central database for all community-created plugins available in the KoBar marketplace. The registry is fully automated and powered by GitHub Actions.

## ⚙️ How It Works

1. **Source of Truth:** Developers submit their GitHub repository names to the `plugins.json` file in this repository.
2. **Automated Bot:** A GitHub Action runs automatically every midnight (or when a new PR is merged).
3. **Data Fetching:** The bot visits every registered repository, reads their `kobar.json` metadata file, and fetches the latest version and release notes from the GitHub Releases API.
4. **Registry Generation:** The bot compiles all this data and generates a single `registry.json` file.
5. **Client App:** The KoBar desktop application downloads this lightweight `registry.json` file to instantly display the most up-to-date plugins to users without hitting API rate limits.

---

## 🚀 How to Submit Your Plugin

If you have developed a plugin for KoBar and want it to appear in the official Plugin Store, follow these simple steps:

### Step 1: Add a Manifest to Your Repository
Ensure your plugin's repository has a `kobar.json` (or `manifest.json`) file in its root directory. This file provides the store with your plugin's display information.

**Example `kobar.json`:**
```json
{
  "id": "my-awesome-plugin",
  "name": "Awesome Plugin",
  "description": "This plugin does amazing things for KoBar.",
  "author": "YourName",
  "image": "https://raw.githubusercontent.com/YourName/your-repo/main/banner.png",
  "categories": ["Utility", "Productivity"],
  "languages": ["en", "tr"]
}
```
*(Note: You do not need to specify the `version` here. The bot automatically fetches the version number and release notes from your latest GitHub Release!)*

### Step 2: Create a GitHub Release
Make sure you have created at least one **Release** on your GitHub repository (e.g., `v1.0.0`) and attached your plugin's `.zip` file to it.

### Step 3: Fork and Update `plugins.json`
1. Fork this `kobar-plugins-registry` repository.
2. Open the `plugins.json` file.
3. Add your repository path (`Username/RepositoryName`) to the array.

**Example `plugins.json`:**
```json
[
  "eedali/emoji-picker",
  "YourName/your-repo"
]
```

### Step 4: Open a Pull Request
Submit a Pull Request (PR) to this repository. Once the KoBar team reviews and merges your PR, the bot will automatically index your plugin, and it will appear in the KoBar app within a few minutes!

---

## 🔗 Links
* **KoBar Main Project:** [https://github.com/Kobar-Project/KoBar](https://github.com/Kobar-Project/KoBar)
* **Plugin Development Documentation:** *(Coming Soon)*

Made with ❤️ by the KoBar Community.
