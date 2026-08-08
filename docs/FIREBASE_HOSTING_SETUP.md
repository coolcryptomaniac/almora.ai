# Firebase Hosting deployment setup

Firebase Hosting is the primary production host for Almora.ai. GitHub remains the source of truth and GitHub Pages is only a manual fallback.

## Required GitHub secret

The workflow expects:

`FIREBASE_SERVICE_ACCOUNT_ALMORAAI`

Recommended setup:

1. Install Firebase CLI locally and sign in.
2. From a clone of this repository run `firebase init hosting:github`.
3. Select the `almoraai` Firebase project.
4. Allow the Firebase CLI to create the restricted GitHub Actions service account and repository secret.

Do not paste or commit a service-account JSON into the repository.

## Production

Push/merge to `main` triggers Firebase Hosting deployment after the GitHub secret is configured.

## Preview channels

Pull requests create Firebase Hosting preview deployments using the same restricted deploy identity.

## Custom domain

Connect `almora.ai` and optionally `www.almora.ai` in Firebase Hosting. Also add those hostnames to the reCAPTCHA Enterprise key used by Firebase App Check.

## App Check

Keep enforcement off until Firebase App Check metrics show valid requests from the Firebase Hosting/custom-domain origins. Then progressively enforce AI Logic and Firestore.
