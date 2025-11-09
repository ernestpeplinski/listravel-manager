# Firestore Security Rules Configuration

## Current Rules

Your Firestore database currently has rules that allow authorized users to read from `config/authorizedUsers`.

## Required Update for Trips Collection

To enable the trip management system, you need to add rules for the `trips` collection.

### Step-by-step Instructions:

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: `listravelweb-e94c8`
3. Navigate to: **Firestore Database** → **Rules** tab
4. Add the following rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is authorized
    function isAuthorized() {
      let authorizedUsers = get(/databases/$(database)/documents/config/authorizedUsers).data.emails;
      return request.auth != null && request.auth.token.email in authorizedUsers;
    }

    // Config collection - read-only for authenticated users
    match /config/{document} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins can write via console
    }

    // Trips collection - public read, authorized write
    match /trips/{tripId} {
      allow read: if true; // Public access for your main app
      allow create: if isAuthorized();
      allow update: if isAuthorized();
      allow delete: if isAuthorized();
    }
  }
}
```

5. Click **"Publish"** to apply the rules

### What These Rules Do:

- **config collection**: All authenticated users can read (needed for authorization check), but only Firebase Console admins can modify
- **trips collection**: Only users whose emails are in `config/authorizedUsers` can:
  - Read all trips
  - Create new trips
  - Update existing trips
  - Delete trips

### Testing the Rules:

After publishing, you can test by:

1. Logging into your app with an authorized account
2. Trying to add a new trip
3. The trip should save successfully to Firestore

If you encounter permission errors, verify that:

- Your email is in the `config/authorizedUsers` document
- The rules have been published
- You're logged in with the correct account
