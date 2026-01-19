---
name: clean-start
description: Reset a project to a zero state, removing all untracked and ignored files, and preparing for a fresh setup. Use when onboarding, troubleshooting, or preparing for CI.
---

# Clean Start Skill

## Step 1: Wipe all files not checked into git

From the repository root, remove all files and directories that are not tracked by git (i.e., all files ignored by .gitignore and not committed). This ensures a truly clean state for onboarding, troubleshooting, or CI.

**Recommended command (run from the repo root):**

```sh
git clean -fdX
```

This will delete all ignored and untracked files and folders. Use with caution.
