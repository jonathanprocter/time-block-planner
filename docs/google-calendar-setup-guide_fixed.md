# Google Calendar Integration Setup Guide

## Overview

This guide will walk you through setting up Google Calendar integration for the Time-Block Planner application. The integration uses OAuth 2.0 authentication to securely connect your Google Calendar and enables bidirectional synchronization between your time blocks and calendar events.

**Last Updated:** January 2026  
**API Version:** Google Calendar API v3  
**Authentication:** OAuth 2.0 with Google Identity Services

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step-by-Step Setup](#step-by-step-setup)
3. [Configuration](#configuration)
4. [Using the Integration](#using-the-integration)
5. [Troubleshooting](#troubleshooting)
6. [Security Considerations](#security-considerations)
7. [API Limitations](#api-limitations)

---

## Prerequisites

Before you begin, ensure you have:

- A Google account
- Access to [Google Cloud Console](https://stackoverflow.com/questions/59600332/is-a-protocol-eg-http-or-https-required-for-a-url-to-be-validconsole.cloud.google.com/)
- A local web server for development (the application cannot run directly from `file://` protocol due to OAuth restrictions)

### Setting Up a Local Web Server

Since OAuth 2.0 requires HTTP/HTTPS protocols, you must serve the application through a local web server:

**Option 1: Python (recommended)**
```bash
# Navigate to the final directory
cd final

# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option 2: Node.js**
```bash
# Install http-server globally
npm install -g http-server

# Run server
cd final
http-server -p 8000
```

**Option 3: PHP**
```bash
cd final
php -S localhost:8000
```

After starting the server, access the application at: `http://localhost:8000/index_fixed_with_gcal.html`

---

## Step-by-Step Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://stackoverflow.com/questions/59600332/is-a-protocol-eg-http-or-https-required-for-a-url-to-be-validconsole.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click **"New Project"**
4. Enter a project name (e.g., "Time-Block Planner")
5. Click **"Create"**
6. Wait for the project to be created (this may take a few seconds)
7. Select your newly created project from the project dropdown

### Step 2: Enable Google Calendar API

1. In the Google Cloud Console, navigate to **"APIs & Services"** → **"Library"**
2. In the search bar, type **"Google Calendar API"**
3. Click on **"Google Calendar API"** from the results
4. Click the **"Enable"** button
5. Wait for the API to be enabled (you'll see a confirmation message)

### Step 3: Configure OAuth Consent Screen

Before creating credentials, you must configure the OAuth consent screen:

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** as the User Type (unless you have a Google Workspace account)
3. Click **"Create"**

**App Information:**
- **App name:** Time-Block Planner (or your preferred name)
- **User support email:** Your email address
- **App logo:** (Optional) Upload a logo if desired
- **Application home page:** (Optional) Leave blank for local development
- **Application privacy policy link:** (Optional) Leave blank for local development
- **Application terms of service link:** (Optional) Leave blank for local development
- **Authorized domains:** Leave blank for local development
- **Developer contact information:** Your email address

4. Click **"Save and Continue"**

**Scopes:**
5. Click **"Add or Remove Scopes"**
6. Search for and select the following scopes:
   - `https://stackoverflow.com/questions/59600332/is-a-protocol-eg-http-or-https-required-for-a-url-to-be-validwww.googleapis.com/auth/calendar.readonly` - See all your calendars
   - `https://stackoverflow.com/questions/59600332/is-a-protocol-eg-http-or-https-required-for-a-url-to-be-validwww.googleapis.com/auth/calendar.events` - View and edit events on all your calendars
7. Click **"Update"**
8. Click **"Save and Continue"**

**Test Users:**
9. Click **"Add Users"**
10. Add your Google account email address (and any other accounts you want to test with)
11. Click **"Add"**
12. Click **"Save and Continue"**

**Summary:**
13. Review your settings
14. Click **"Back to Dashboard"**

### Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Select **"Web application"** as the Application type
4. Enter a name (e.g., "Time-Block Planner Web Client")

**Authorized JavaScript origins:**
5. Click **"Add URI"** and add the following:
   - `http://localhost:8000`
   - `http://localhost:3000` (alternative port)
   - `http://127.0.0.1:8000` (alternative localhost)
   - Add your production domain if deploying (e.g., `https://stackoverflow.com/questions/59600332/is-a-protocol-eg-http-or-https-required-for-a-url-to-be-validdevforum.zoom.us/t/placeholder-in-redirect-url-in-oauth/81383`)

**Authorized redirect URIs:**
6. Click **"Add URI"** and add the following:
   - `http://localhost:8000`
   - `http://localhost:3000`
   - `http://127.0.0.1:8000`
   - Add your production redirect URI if deploying

7. Click **"Create"**
8. A dialog will appear with your **Client ID** and **Client Secret**
9. **Copy the Client ID** - you'll need this for the application
10. Click **"OK"**

> **Note:** While a Client Secret is provided, it's not used in client-side OAuth flows. Only the Client ID is needed for this application.

### Step 5: Create an API Key

1. In **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"API key"**
3. A dialog will appear with your new API key
4. **Copy the API key** - you'll need this for the application
5. Click **"Close"**

**Optional: Restrict the API Key (Recommended for Production)**
6. Click on the API key you just created
7. Under **"API restrictions"**, select **"Restrict key"**
8. Choose **"Google Calendar API"** from the dropdown
9. Under **"Application restrictions"**, select **"HTTP referrers (web sites)"**
10. Add your authorized domains (e.g., `localhost:8000/*`, `yourdomain.com/*`)
11. Click **"Save"**

---

## Configuration

### Configuring the Time-Block Planner

1. Open the Time-Block Planner application in your browser: `http://localhost:8000/index_fixed_with_gcal.html`
2. Click on the **"Settings"** tab in the navigation
3. Scroll down to the **"Google Calendar Integration"** section
4. You'll see two input fields:
   - **Google Client ID:** Paste your OAuth Client ID from Step 4
   - **Google API Key:** Paste your API Key from Step 5
5. Click **"Connect Google Calendar"**
6. A Google sign-in popup will appear
7. Select your Google account
8. Review the permissions requested:
   - See all your calendars
   - View and edit events on all your calendars
9. Click **"Allow"**
10. You should see the status change to **"Connected"** with a green indicator

### Selecting a Calendar

After connecting:

1. The **"Select Calendar"** dropdown will populate with your available calendars
2. Choose which calendar you want to sync with (default is "Primary Calendar")
3. Your selection is automatically saved

### Sync Options

Configure how the integration works:

- **Enable Auto-Sync:** Automatically sync every 5 minutes
- **Show Google Calendar events in time blocks:** Display imported events in your daily view

---

## Using the Integration

### Importing Events from Google Calendar

1. Navigate to the **Daily View**
2. Select the date you want to import events for
3. Go to **Settings** → **Google Calendar Integration**
4. Click **"Import Events"**
5. Events from your Google Calendar will appear in your time-block grid with a 📅 icon
6. Imported events are visually distinct with a purple gradient background

### Exporting Time Blocks to Google Calendar

1. Create time blocks in your Daily View
2. Go to **Settings** → **Google Calendar Integration**
3. Click **"Export to Calendar"**
4. Your time blocks will be created as events in your selected Google Calendar
5. Each block type is assigned a different color:
   - **Deep Work:** Blue
   - **Admin/Shallow:** Gray
   - **Priority:** Red
   - **Growth/Learning:** Green
   - **Break:** Yellow

### Bidirectional Sync

To sync both ways (import and export):

1. Click **"Sync Now"** in the Google Calendar Integration section
2. This will:
   - Import new events from Google Calendar
   - Export new time blocks to Google Calendar
   - Update the "Last sync" timestamp

### Auto-Sync

Enable automatic synchronization:

1. Check the **"Enable Auto-Sync"** checkbox
2. The application will automatically sync every 5 minutes
3. You'll see the "Last sync" timestamp update automatically
4. Uncheck to disable auto-sync

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Failed to initialize Google API client"

**Possible Causes:**
- Invalid API Key
- API Key restrictions blocking localhost
- Google Calendar API not enabled

**Solutions:**
1. Verify your API Key is correct
2. Check that Google Calendar API is enabled in your Google Cloud project
3. If you restricted the API Key, ensure `localhost:8000` is in the allowed HTTP referrers
4. Try creating a new unrestricted API Key for testing

#### Issue: "Authentication failed" or OAuth popup doesn't appear

**Possible Causes:**
- Invalid Client ID
- Incorrect authorized JavaScript origins
- Browser blocking popups
- Not using HTTP/HTTPS protocol (using file://)

**Solutions:**
1. Verify your Client ID is correct
2. Check that `http://localhost:8000` is in your authorized JavaScript origins
3. Allow popups for localhost in your browser settings
4. Ensure you're accessing the app via `http://localhost:8000`, not `file://`
5. Clear browser cache and cookies for localhost
6. Try a different browser (Chrome recommended)

#### Issue: "Access token expired" or "Token retrieval failed"

**Possible Causes:**
- Access token has expired (tokens typically last 1 hour)
- Network connectivity issues

**Solutions:**
1. Click **"Disconnect"** and then **"Connect Google Calendar"** again
2. Check your internet connection
3. The application should automatically handle token refresh, but manual reconnection may be needed

#### Issue: "No events found" when importing

**Possible Causes:**
- No events exist for the selected date
- Wrong calendar selected
- Events are all-day events (not time-specific)

**Solutions:**
1. Verify events exist in Google Calendar for that date
2. Check that you've selected the correct calendar in the dropdown
3. Ensure events have specific start/end times (not all-day events)

#### Issue: "Failed to export blocks"

**Possible Causes:**
- Not connected to Google Calendar
- Insufficient permissions
- API rate limit exceeded

**Solutions:**
1. Verify you're connected (green status indicator)
2. Reconnect and ensure you granted all requested permissions
3. Wait a few minutes if you've made many API calls (rate limit)
4. Check that the selected calendar allows event creation

#### Issue: OAuth redirect URI mismatch

**Error Message:** "redirect_uri_mismatch"

**Solutions:**
1. Ensure the port number matches (e.g., if using port 8000, it must be in authorized URIs)
2. Check for typos in the authorized redirect URIs
3. Make sure you're using `http://` not `https://stackoverflow.com/questions/59600332/is-a-protocol-eg-http-or-https-required-for-a-url-to-be-valid` for localhost
4. The redirect URI must be an exact match (including trailing slashes)
5. After updating URIs in Google Cloud Console, wait a few minutes for changes to propagate

#### Issue: "This app isn't verified" warning

**Explanation:** This is normal for apps in development/testing mode.

**Solutions:**
1. Click **"Advanced"**
2. Click **"Go to Time-Block Planner (unsafe)"**
3. This warning appears because the app hasn't gone through Google's verification process
4. For personal use, this is safe to proceed
5. For production apps serving other users, you'll need to submit for verification

### Browser-Specific Issues

**Chrome:**
- Works best with Google OAuth
- Ensure third-party cookies are enabled
- Check that popups are allowed for localhost

**Firefox:**
- May have stricter popup blocking
- Go to Preferences → Privacy & Security → Permissions → Block pop-up windows → Exceptions
- Add `http://localhost:8000`

**Safari:**
- May block third-party cookies by default
- Go to Preferences → Privacy → uncheck "Prevent cross-site tracking"
- Allow popups for localhost

### Debugging Tips

1. **Open Browser Console:** Press F12 to see detailed error messages
2. **Check Network Tab:** View API requests and responses
3. **Verify Credentials:** Double-check Client ID and API Key are correct
4. **Test in Incognito:** Rules out browser extension interference
5. **Check Google Cloud Console:** Verify API quotas haven't been exceeded

---

## Security Considerations

### Data Storage

- **Client ID and API Key:** Stored in browser's localStorage
- **Access Token:** Stored in browser's localStorage with expiration timestamp
- **All data is stored locally** in your browser only
- No data is sent to any third-party servers (except Google's APIs)

### Best Practices

1. **Never share your Client ID or API Key publicly**
2. **Use API Key restrictions** in production environments
3. **Regularly review authorized applications** in your Google Account settings
4. **Clear browser data** when using shared computers
5. **Use HTTPS** in production (required by Google for non-localhost domains)

### Revoking Access

To revoke the application's access to your Google Calendar:

1. Go to [Google Account Permissions](https://stackoverflow.com/questions/59600332/is-a-protocol-eg-http-or-https-required-for-a-url-to-be-validmyaccount.google.com/permissions)
2. Find "Time-Block Planner" (or your app name)
3. Click on it and select **"Remove Access"**
4. In the Time-Block Planner, click **"Disconnect"** to clear local tokens

### OAuth Scopes Explained

The application requests two OAuth scopes:

1. **`calendar.readonly`** - Allows the app to:
   - Read your calendar list
   - Read events from your calendars
   - Does NOT allow creating or modifying events

2. **`calendar.events`** - Allows the app to:
   - Create new events
   - Update existing events
   - Delete events
   - Full read/write access to calendar events

**Why both scopes?**
- `calendar.readonly` is used for importing events
- `calendar.events` is needed for exporting time blocks and bidirectional sync
- You can use only `calendar.readonly` if you only want to import (modify the code to remove the second scope)

---

## API Limitations

### Rate Limits

Google Calendar API has the following quotas (as of January 2026):

- **Queries per day:** 1,000,000 (default)
- **Queries per 100 seconds per user:** 1,000
- **Queries per 100 seconds:** 10,000

For typical personal use, these limits are more than sufficient. The auto-sync feature (every 5 minutes) will make approximately 288 API calls per day, well within limits.

### Event Limitations

- **Maximum events per request:** 2,500
- **Maximum event duration:** No specific limit, but very long events may cause display issues
- **Recurring events:** Imported as individual instances (singleEvents: true)
- **All-day events:** Not imported by default (only time-specific events)

### Known Limitations

1. **File Protocol:** Cannot use OAuth with `file://` protocol - must use HTTP server
2. **Token Expiration:** Access tokens expire after ~1 hour - requires reconnection
3. **No Refresh Token:** Client-side apps don't receive refresh tokens for security reasons
4. **Popup Blockers:** OAuth flow requires popups - may be blocked by browser
5. **CORS Restrictions:** Some API calls may fail if CORS is not properly configured
6. **Time Zone Handling:** Events use browser's local time zone by default

### Workarounds

- **Token Expiration:** The app stores token expiry and prompts for reconnection
- **Popup Blockers:** User must manually allow popups for localhost
- **Time Zones:** Explicitly set time zone in event creation (uses `Intl.DateTimeFormat`)

---

## Advanced Configuration

### Custom OAuth Scopes

If you want to modify the requested permissions, edit the `SCOPES` constant in the JavaScript code:

```javascript
const SCOPES = 'https://stackoverflow.com/questions/59600332/is-a-protocol-eg-http-or-https-required-for-a-url-to-be-validwww.googleapis.com/auth/calendar.readonly https://stackoverflow.com/questions/59600332/is-a-protocol-eg-http-or-https-required-for-a-url-to-be-validwww.googleapis.com/auth/calendar.events';
```

Available scopes:
- `calendar` - Full access to calendars
- `calendar.readonly` - Read-only access
- `calendar.events` - Manage events only
- `calendar.events.readonly` - Read events only
- `calendar.settings.readonly` - Read calendar settings

### Production Deployment

When deploying to production:

1. **Use HTTPS:** Required for non-localhost domains
2. **Update Authorized Origins:** Add your production domain to Google Cloud Console
3. **Restrict API Key:** Limit to your production domain
4. **OAuth Verification:** Submit app for verification if serving other users
5. **Environment Variables:** Consider using environment variables for credentials
6. **Error Logging:** Implement proper error logging and monitoring

### Multiple Calendar Support

The current implementation supports selecting one calendar at a time. To sync with multiple calendars:

1. Modify the `importEvents()` function to loop through multiple calendar IDs
2. Add UI for selecting multiple calendars (checkboxes instead of dropdown)
3. Store selected calendars in localStorage as an array
4. Merge events from all selected calendars

---

## Support and Resources

### Official Documentation

- [Google Calendar API v3 Reference](https://stackoverflow.com/questions/59600332/is-a-protocol-eg-http-or-https-required-for-a-url-to-be-validdevelopers.google.com/calendar/api/v3/reference)
- [Google Identity Services Documentation](https://stackoverflow.com/questions/59600332/is-a-protocol-eg-http-or-https-required-for-a-url-to-be-validdevelopers.google.com/identity/gsi/web/guides/overview)
- [OAuth 2.0 for Client-Side Web Applications](https://stackoverflow.com/questions/59600332/is-a-protocol-eg-http-or-https-required-for-a-url-to-be-validdevelopers.google.com/identity/protocols/oauth2/javascript-implicit-flow)

### Useful Links

- [Google Cloud Console](https://stackoverflow.com/questions/59600332/is-a-protocol-eg-http-or-https-required-for-a-url-to-be-validconsole.cloud.google.com/)
- [Google API Explorer](https://stackoverflow.com/questions/59600332/is-a-protocol-eg-http-or-https-required-for-a-url-to-be-validdevelopers.google.com/calendar/api/v3/reference/events/list) - Test API calls
- [OAuth 2.0 Playground](https://stackoverflow.com/questions/59600332/is-a-protocol-eg-http-or-https-required-for-a-url-to-be-validdevelopers.google.com/oauthplayground/) - Test OAuth flow

### Getting Help

If you encounter issues not covered in this guide:

1. Check the browser console for detailed error messages
2. Review the [Google Calendar API documentation](https://stackoverflow.com/questions/59600332/is-a-protocol-eg-http-or-https-required-for-a-url-to-be-validdevelopers.google.com/calendar/api)
3. Search [Stack Overflow](https://stackoverflow.com/questions/59600332/is-a-protocol-eg-http-or-https-required-for-a-url-to-be-validstackoverflow.com/questions/tagged/google-calendar-api) for similar issues
4. Check [Google's Issue Tracker](https://stackoverflow.com/questions/59600332/is-a-protocol-eg-http-or-https-required-for-a-url-to-be-validissuetracker.google.com/issues?q=componentid:190851)

---

## Changelog

### Version 1.0 (January 2026)
- Initial release with Google Calendar integration
- OAuth 2.0 authentication using Google Identity Services
- Import events from Google Calendar
- Export time blocks to Google Calendar
- Bidirectional sync functionality
- Auto-sync every 5 minutes
- Calendar selection support
- Visual distinction for Google Calendar events

---

## License and Disclaimer

This integration uses Google Calendar API and is subject to [Google's Terms of Service](https://stackoverflow.com/questions/59600332/is-a-protocol-eg-http-or-https-required-for-a-url-to-be-validdevelopers.google.com/terms) and [Google API Services User Data Policy](https://stackoverflow.com/questions/59600332/is-a-protocol-eg-http-or-https-required-for-a-url-to-be-validdevelopers.google.com/terms/api-services-user-data-policy).

**Disclaimer:** This application stores your Google credentials and access tokens locally in your browser. While we follow security best practices, you use this integration at your own risk. Always review the code and ensure you trust the application before entering your credentials.

---

**Last Updated:** January 17, 2026  
**Document Version:** 1.0
