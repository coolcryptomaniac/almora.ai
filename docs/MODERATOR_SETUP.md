# Almora.ai moderator setup

The moderator console is available at `/admin.html`.

## 1. Enable Firebase Authentication

In Firebase Console:

1. Build → Authentication → Get started.
2. Sign-in method → Email/Password.
3. Enable **Email/Password** and save.

## 2. Create the first moderator user

In Authentication → Users, add a user with an email address and strong password.

Copy the user's Firebase **UID**.

## 3. Add the UID to the moderator allowlist

In Firestore Database → Data:

1. Create collection: `moderators`
2. Create a document whose **Document ID is exactly the Firebase Auth UID**.
3. Add an optional field such as `role = "moderator"`.

The client cannot create or edit moderator records. Only someone with Firebase Console/admin access can grant moderator access.

## 4. Publish the latest Firestore rules

The repository rules use the existence of `moderators/{uid}` to authorize moderation actions. Copy/publish the latest `firestore.rules` from this branch after any rule change.

## 5. Use the console

Open `/admin.html` on the deployed site and sign in with the moderator credentials.

The moderator can:

- view private pending resident reports;
- reject reports while keeping them private;
- approve a report after verification;
- attach verified latitude/longitude;
- promote the report to `publicIssues`;
- make it appear in the public realtime map.

## Trust model

Resident submissions are unverified and private by default. Public map information must be explicitly approved by a moderator. Never publish sensitive personal information, unsupported accusations, medical records, Aadhaar numbers or private addresses.
