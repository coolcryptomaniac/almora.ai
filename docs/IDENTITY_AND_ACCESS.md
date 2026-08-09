# Almora.ai identity and access

Public identities are deliberately limited to:

1. Citizen
2. Business
3. Local administration

The internal control room is not part of public navigation and is `noindex`.

## Citizen and business sign-in

Current supported design:
- Google sign-in
- email/password
- mobile OTP

Recommended next step:
- WebAuthn/passkeys for device-backed sign-in. Where the device uses fingerprint/face unlock, the biometric stays with the platform authenticator; Almora.ai should not store raw biometric templates.

## Local administration

Authentication is not authorization. A person can sign in successfully and still have no administrative access.

Local-administration access requires a manually approved access record after proof of role/authority is checked outside the public app. The control room re-checks this record before opening queues.

Suggested proof workflow:
- official department/office email where available
- official employee/office ID reviewed by an authorised human
- confirmation through a known official office/contact channel
- time-limited access for contractors/temporary staff
- audit log of who granted access and why
- periodic re-verification

## Aadhaar

Do not build a home-grown Aadhaar authentication flow.

If Aadhaar authentication is later required, integrate only through an authorised UIDAI Authentication User Agency / KUA / Sub-AUA arrangement and follow UIDAI security requirements. Do not use the Aadhaar number as an Almora.ai account identifier. Do not permanently store Aadhaar OTP, fingerprint, iris, face biometric payloads, or PID blocks.

For most Almora.ai use cases, mobile OTP + Google/passkeys + role verification are sufficient and materially lower-risk.

## Cross-service matching

Cross-service recommendations should use purpose-limited attributes only. Examples:
- jobs ↔ skills ↔ commute
- health navigation ↔ transport
- farming ↔ weather ↔ wildlife ↔ market access
- roads ↔ schools ↔ emergency access ↔ transport

Do not cross-match sensitive data simply because it exists. Sensitive attributes such as Aadhaar number, caste, religion, biometric data and private medical records must not become general-purpose matching features.
