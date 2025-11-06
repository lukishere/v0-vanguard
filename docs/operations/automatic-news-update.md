# 📑 Automatic Monthly News Updates

A short run-book for adding and operating a scheduled Firebase Function that refreshes the `/news` collection once a month.

## 1. Overview

| Aspect | Value |
|--------|-------|
| **What** | `updateNewsMonthly` (2nd-gen Cloud Function) |
| **When** | `0 9 1 * *` UTC → 09:00 UTC on the **1st** day of each month |
| **Where** | `functions/src/news-updater.ts` |
| **Why** | Keeps the public `/news` page fresh with tech/AI headlines without manual content curation |

## 2. Prerequisites

1. Project on **Blaze** plan (scheduled functions require it).
2. `firebase-tools` ≥ 13 locally.
3. Admin SDK initialised in **Functions** runtime (already done in `news-updater.ts`).
4. Environment secrets (only if 3rd-party News API later).

## 3. Implementation Steps (once)

```bash
pnpm i -w firebase-functions firebase-admin
mkdir -p functions/src
# add news-updater.ts ➜ see code in repo
```

1. Add import + export in `functions/src/index.ts`:
```ts
export * from "./news-updater";
```
2. Deploy & test:
```bash
firebase deploy --only functions:updateNewsMonthly,functions:updateNewsManual
```
3. Hit manual endpoint once to seed data:
```bash
curl -X POST https://<region>-<project>.cloudfunctions.net/updateNewsManual
```

## 4. Local Testing

```bash
firebase emulators:start --only functions,firestore
# Trigger via localhost:
curl -X POST http://localhost:5001/<project>/us-central1/updateNewsManual
```

## 5. CI / GitHub Actions (optional free-tier trigger)

`.github/workflows/update-news.yml` 👉 triggers the HTTPS function monthly if you prefer to stay on **Spark**.

## 6. Cost Notes

| Component | Est. monthly | Comment |
|-----------|-------------|---------|
| **Cloud Scheduler** | $0.10 | 1 job × $0.10 |
| **Function invocations** | <$0.05 | ~1 run + manual tests |
| **Firestore writes** | ≤6× per run | Batched writes; negligible |

## 7. Rollback / Disable

```bash
firebase functions:delete updateNewsMonthly
```

## 8. Next Improvements

* Plug real **NewsAPI** or GPT-generated summaries.
* Store historical editions in `/news_editions/{yyyy_mm}`.
* Add Slack/webhook alert on failure. 