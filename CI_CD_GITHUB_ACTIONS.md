# CI/CD Setup with GitHub Actions

This project uses two workflows:

- `.github/workflows/ci.yml`: runs quality checks and generates a CI report on each push/PR.
- `.github/workflows/cd.yml`: triggers deployment hooks for Render and Vercel after successful CI on `main`.

## What runs in CI
 
On every commit and PR:

1. Client checks
   - Install dependencies
   - Lint
   - Test
   - Build
2. Server checks
   - Install dependencies
   - Test
3. Report generation
   - Generates `ci-report.md`
   - Publishes report in workflow summary
   - Uploads report as workflow artifact

Note:

- CI uses direct `npx jest` execution for test reporting.
- CI report is always generated and uploaded as an artifact.

## Required GitHub Secrets for CD

In your repository settings, add these secrets:

- `RENDER_DEPLOY_HOOK_URL`
- `VERCEL_DEPLOY_HOOK_URL`

Path:

- Repository -> Settings -> Secrets and variables -> Actions -> New repository secret

## How to create deploy hooks

### Render

1. Open your Render service.
2. Go to Settings.
3. Find Deploy Hook.
4. Create/copy hook URL.
5. Save in GitHub secret `RENDER_DEPLOY_HOOK_URL`.

### Vercel

1. Open Vercel project.
2. Go to Settings -> Git -> Deploy Hooks.
3. Create hook for branch `main`.
4. Save in GitHub secret `VERCEL_DEPLOY_HOOK_URL`.

## Recommended branch protection

For `main`, enable branch protection and require status checks:

- CI / Client Checks
- CI / Server Checks
- CI / CI Report

This ensures broken code cannot be merged.

## Where to see the generated report

For each run:

1. GitHub -> Actions -> CI -> select run
2. Open Summary tab for a quick report
3. Open Artifacts and download `ci-report`

## Manual CD run

You can trigger deployment manually:

1. GitHub -> Actions -> CD
2. Run workflow

This is useful when you want to redeploy without a new commit.
