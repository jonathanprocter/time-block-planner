# Google Calendar Integration - Troubleshooting Guide

**Time-Block Planner Application**  
**Last Updated:** January 17, 2026

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Common Error Messages](#common-error-messages)
3. [Step-by-Step Diagnostics](#step-by-step-diagnostics)
4. [Frequently Asked Questions](#frequently-asked-questions)
5. [Contact & Support](#contact--support)

---

## Getting Started

### What You Need

To connect Google Calendar to Time-Block Planner, you need:

1. **Google Cloud Project** - Free to create
2. **OAuth Client ID** - From Google Cloud Console
3. **API Key** - From Google Cloud Console
4. **Google Calendar API** - Must be enabled in your project

### Quick Setup Checklist

- [ ] Created Google Cloud Project
- [ ] Enabled Google Calendar API
- [ ] Created OAuth 2.0 Client ID
- [ ] Created API Key
- [ ] Added authorized JavaScript origins
- [ ] Configured OAuth consent screen
- [ ] Added required scopes

**Need detailed setup instructions?** Click the "Setup Guide" button in Settings.

---

## Common Error Messages

### 🔴 "Invalid Client ID format"

**What it means:** The Client ID you entered doesn't match the expected format.

**How to fix:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID
4. Copy the entire Client ID (it should look like: `123456789-abc123def456.apps.googleusercontent.com`)
5. Paste it exactly into the Client ID field
6. Make sure there are no extra spaces

**Correct format:** `[numbers]-[alphanumeric].apps.googleusercontent.com`

---

### 🔴 "Invalid API Key format"

**What it means:** The API Key you entered doesn't match the expected format.

**How to fix:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your API Key
4. Click "Show Key" and copy it
5. Paste it exactly into the API Key field (should be 39 characters)
6. Make sure there are no extra spaces

**Correct format:** 39 characters containing letters, numbers, hyphens, and underscores

---

### 🔴 "Failed to load Google API library"

**What it means:** The application couldn't load required Google libraries.

**How to fix:**
1. **Check your internet connection** - Make sure you're online
2. **Disable ad blockers** - Some ad blockers prevent Google scripts from loading
3. **Check browser extensions** - Disable privacy/security extensions temporarily
4. **Try a different browser** - Test in Chrome, Firefox, or Edge
5. **Refresh the page** - Press Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

**Still not working?** Check your browser console (F12) for error messages.

---

### 🔴 "Authentication failed"

**What it means:** The OAuth authentication process didn't complete successfully.

**Common causes:**
- You closed the popup window
- You clicked "Deny" instead of "Allow"
- Your browser blocked the popup
- Network connection interrupted

**How to fix:**
1. Click the **Connect** button again
2. When the Google popup appears, click **Allow**
3. Grant all requested permissions
4. If you don't see a popup, check if your browser blocked it (look for a popup icon in the address bar)

---

### 🔴 "Token expired"

**What it means:** Your access token has expired (tokens last about 1 hour).

**How to fix:**
1. Click the **Disconnect** button
2. Click the **Connect** button again
3. Re-authorize the application
4. Your connection will be restored

**Note:** You'll see a warning 5 minutes before your token expires.

---

### 🔴 "API quota exceeded"

**What it means:** You've reached the daily limit of 1,000,000 API calls.

**How to fix:**
1. **Wait until tomorrow** - Quota resets at midnight Pacific Time
2. **Reduce sync frequency** - Disable auto-sync or sync less often
3. **Request quota increase** - Go to Google Cloud Console → Quotas

**Note:** The 1,000,000 daily limit is very generous. If you're hitting it, you may have auto-sync enabled with a very short interval.

---

### 🔴 "Permission denied"

**What it means:** The application doesn't have the required permissions.

**How to fix:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Library**
3. Search for "Google Calendar API"
4. Click on it and press **Enable**
5. Go to **OAuth consent screen**
6. Add these scopes:
   - `https://www.googleapis.com/auth/calendar.readonly`
   - `https://www.googleapis.com/auth/calendar.events`
7. Save changes
8. Disconnect and reconnect in the app

---

### 🔴 "Calendar not found"

**What it means:** The selected calendar no longer exists or you don't have access to it.

**How to fix:**
1. Click the **calendar dropdown** in Settings
2. Select a different calendar (try "Primary Calendar")
3. Try importing events again

---

### 🔴 "No internet connection"

**What it means:** Your device isn't connected to the internet.

**How to fix:**
1. Check your WiFi or ethernet connection
2. Try opening another website to verify connectivity
3. Restart your router if needed
4. Once connected, try the operation again

---

### 🟡 "Your Google Calendar connection will expire in 5 minutes"

**What it means:** Your access token is about to expire.

**What to do:**
- If you're actively using the app, disconnect and reconnect now
- If you're done working, you can ignore this message
- The connection will automatically clean up when it expires

---

## Step-by-Step Diagnostics

### Running the Diagnostic Tool

The built-in diagnostic tool can help identify connection issues.

**How to run diagnostics:**
1. Go to **Settings** → **Google Calendar Integration**
2. Click the **Run Diagnostics** button
3. Wait for all checks to complete
4. Review the results

### Understanding Diagnostic Results

#### ✅ Green (Pass)
Everything is working correctly for this check.

#### ⚠️ Yellow (Warning)
Not critical, but something to be aware of. Usually means a feature isn't configured yet.

#### ❌ Red (Fail)
This check failed and needs attention.

### Diagnostic Checks Explained

#### 1. Libraries Loaded
**What it checks:** Whether Google's JavaScript libraries loaded successfully.

**If it fails:**
- Check your internet connection
- Disable ad blockers
- Refresh the page
- Try a different browser

#### 2. Credentials Valid
**What it checks:** Whether your Client ID and API Key are in the correct format.

**If it fails:**
- Verify your credentials in Google Cloud Console
- Check for typos or extra spaces
- Make sure you copied the complete credentials

#### 3. Network Connectivity
**What it checks:** Whether your device can reach Google's servers.

**If it fails:**
- Check your internet connection
- Check firewall settings
- Try disabling VPN temporarily
- Contact your network administrator

#### 4. Token Status
**What it checks:** Whether you have a valid, non-expired access token.

**If it fails:**
- Click Disconnect and reconnect
- Make sure you completed the authorization
- Check that you granted all permissions

#### 5. API Access
**What it checks:** Whether the app can successfully call the Calendar API.

**If it fails:**
- Make sure Calendar API is enabled in Google Cloud Console
- Verify you granted calendar permissions
- Check that your project isn't suspended

---

## Frequently Asked Questions

### Q: How do I get a Client ID and API Key?

**A:** Follow these steps:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable Google Calendar API
4. Create OAuth 2.0 Client ID (Web application type)
5. Create API Key
6. Configure OAuth consent screen
7. Copy both credentials to the app

**Detailed instructions:** Click "Setup Guide" in the app.

---

### Q: Is my data secure?

**A:** Yes! Here's how we protect your data:

- ✓ Credentials stored locally in your browser only
- ✓ No data sent to external servers
- ✓ Tokens expire after 1 hour
- ✓ You can revoke access anytime
- ✓ Minimal permissions requested (calendar read/write only)
- ✓ All communication over HTTPS

---

### Q: Why do I need to reconnect every hour?

**A:** Google's access tokens expire after approximately 1 hour for security. This is a Google security feature, not a limitation of our app. You'll receive a warning 5 minutes before expiration.

---

### Q: Can I use this with multiple Google accounts?

**A:** Yes, but you'll need to disconnect and reconnect to switch accounts. The app connects to one Google account at a time.

---

### Q: What permissions does the app need?

**A:** The app requests two permissions:

1. **calendar.readonly** - Read your calendar events
2. **calendar.events** - Create and modify calendar events

These are the minimum permissions needed for the integration to work.

---

### Q: Why can't I see my events?

**A:** Check these things:

1. Make sure "Show Google Calendar events in time blocks" is checked
2. Verify you selected the correct calendar in the dropdown
3. Click "Import Events" to refresh
4. Make sure the events are on the date you're viewing
5. Check that events have specific times (all-day events aren't shown)

---

### Q: How often does auto-sync run?

**A:** When enabled, auto-sync runs every 5 minutes. This imports new events from Google Calendar and exports new time blocks.

**To enable:** Check "Enable Auto-Sync" in Settings → Google Calendar Integration

---

### Q: What happens if I hit the API quota?

**A:** The daily quota is 1,000,000 API calls, which is very generous. If you somehow exceed it:

- You'll see an error message
- The quota resets at midnight Pacific Time
- You can request a quota increase in Google Cloud Console
- Consider reducing sync frequency

---

### Q: Can I use this offline?

**A:** No, Google Calendar integration requires an internet connection. However, your time blocks are stored locally and work offline. Only the sync features require internet.

---

### Q: How do I disconnect?

**A:** 
1. Go to **Settings** → **Google Calendar Integration**
2. Click the **Disconnect** button
3. Confirm the disconnection

Your credentials will remain saved for easy reconnection.

---

### Q: What's Debug Mode?

**A:** Debug Mode enables detailed logging of all OAuth operations. Use it when:

- Troubleshooting connection issues
- Reporting bugs
- Understanding what's happening behind the scenes

**To enable:** Click "Enable Debug Mode" in Settings, then check your browser console (F12).

---

### Q: How do I download debug logs?

**A:**
1. Enable Debug Mode
2. Reproduce the issue
3. Click "Download Debug Log"
4. Share the log file when reporting issues

---

### Q: The app says my credentials are invalid, but they're correct!

**A:** Try these steps:

1. Copy the credentials again from Google Cloud Console
2. Make sure there are no extra spaces before or after
3. Verify the Client ID ends with `.apps.googleusercontent.com`
4. Verify the API Key is exactly 39 characters
5. Try pasting into a text editor first to check for hidden characters

---

### Q: Can I test my setup without connecting?

**A:** Yes! Click the **Test Connection** button. It will:

- Validate your credentials format
- Check library loading
- Test network connectivity
- Verify everything is configured correctly

This won't require authorization, so it's safe to test anytime.

---

### Q: What browsers are supported?

**A:** The app works best on:

- ✓ Google Chrome (recommended)
- ✓ Mozilla Firefox
- ✓ Microsoft Edge
- ✓ Safari (macOS)

**Note:** Make sure your browser is up to date and JavaScript is enabled.

---

### Q: Why do I see "popup blocked"?

**A:** Your browser is blocking the Google authorization popup.

**How to fix:**
1. Look for a popup icon in your address bar
2. Click it and allow popups for this site
3. Try connecting again

---

### Q: Can I sync with multiple calendars?

**A:** Currently, you can connect to one calendar at a time. Select your preferred calendar from the dropdown in Settings.

---

### Q: What if my question isn't answered here?

**A:** Try these resources:

1. **Run Diagnostics** - Often identifies the issue automatically
2. **Enable Debug Mode** - See detailed logs of what's happening
3. **Check Browser Console** - Press F12 and look for error messages
4. **Review Setup Guide** - Click "Setup Guide" in the app
5. **Contact Support** - See contact information below

---

## Step-by-Step Diagnostic Procedures

### Procedure 1: Complete Connection Test

**Use when:** Setting up for the first time or troubleshooting connection issues.

1. Go to Settings → Google Calendar Integration
2. Enter your Client ID and API Key
3. Click **Test Connection**
4. Review the results:
   - All green? Click **Connect**
   - Any red? Follow the specific guidance for that check
5. If all checks pass, click **Connect Google Calendar**
6. Authorize the app in the popup
7. Select your calendar from the dropdown
8. Click **Import Events** to test

---

### Procedure 2: Troubleshooting Import Failures

**Use when:** Events won't import from Google Calendar.

1. Verify you're connected (green dot in status)
2. Check token hasn't expired (look at countdown)
3. Select the correct calendar from dropdown
4. Make sure you're viewing the correct date
5. Click **Import Events**
6. If it fails, click **Run Diagnostics**
7. Check the API Access result
8. If API Access fails, verify Calendar API is enabled in Google Cloud Console

---

### Procedure 3: Troubleshooting Export Failures

**Use when:** Time blocks won't export to Google Calendar.

1. Verify you're connected (green dot in status)
2. Make sure you have time blocks created for the current date
3. Click **Export to Calendar**
4. If it fails with permission error:
   - Check OAuth consent screen has calendar.events scope
   - Disconnect and reconnect to refresh permissions
5. If it fails with quota error:
   - Wait until tomorrow or request quota increase

---

### Procedure 4: Recovering from Token Expiration

**Use when:** You see "Token expired" error.

1. Click **Disconnect** button
2. Wait 2 seconds
3. Click **Connect Google Calendar**
4. Authorize the app again
5. Your connection is restored
6. Try your operation again

---

### Procedure 5: Fixing Library Loading Issues

**Use when:** Diagnostics shows libraries failed to load.

1. Check internet connection
2. Disable ad blockers and privacy extensions
3. Clear browser cache (Ctrl+Shift+Delete)
4. Refresh the page (Ctrl+F5)
5. If still failing, try a different browser
6. Check browser console (F12) for specific errors

---

## Contact & Support

### Before Contacting Support

Please try these steps first:

1. ✓ Run the diagnostic tool
2. ✓ Check this troubleshooting guide
3. ✓ Review the setup guide
4. ✓ Enable debug mode and download logs
5. ✓ Check browser console for errors

### What to Include When Reporting Issues

To help us resolve your issue quickly, please provide:

1. **Diagnostic Results** - Screenshot or text from Run Diagnostics
2. **Debug Log** - Download and attach the debug log file
3. **Error Message** - Exact text of any error messages
4. **Browser Information** - Browser name and version
5. **Steps to Reproduce** - What you were doing when the error occurred
6. **Screenshots** - If applicable

### Getting Debug Information

**To get diagnostic results:**
1. Click **Run Diagnostics**
2. Take a screenshot of the results
3. Or copy the text from each section

**To get debug logs:**
1. Click **Enable Debug Mode**
2. Reproduce the issue
3. Click **Download Debug Log**
4. Attach the downloaded file

**To get browser console logs:**
1. Press F12 to open developer tools
2. Click the Console tab
3. Look for red error messages
4. Right-click and select "Save as..." to export

### Support Resources

- **Setup Guide:** Click "Setup Guide" button in the app
- **Google Cloud Console:** https://console.cloud.google.com/
- **Google Calendar API Docs:** https://developers.google.com/calendar
- **OAuth 2.0 Documentation:** https://developers.google.com/identity/protocols/oauth2

### Known Issues

**Issue:** Token expires after 1 hour  
**Status:** Expected behavior (Google security feature)  
**Workaround:** Disconnect and reconnect when needed

**Issue:** All-day events don't appear in time blocks  
**Status:** By design (time blocks require specific times)  
**Workaround:** Convert to timed events in Google Calendar

**Issue:** Popup blocked by browser  
**Status:** Browser security feature  
**Workaround:** Allow popups for this site

---

## Tips for Best Experience

### 1. Keep Credentials Handy
Save your Client ID and API Key in a password manager for easy access.

### 2. Monitor Token Expiration
Watch the countdown timer and reconnect before it expires if you're actively working.

### 3. Use Auto-Sync Wisely
Enable auto-sync if you frequently update Google Calendar, but disable it if you're hitting quota limits.

### 4. Test Before Important Work
Use the Test Connection button before important sync operations to ensure everything is working.

### 5. Enable Debug Mode When Troubleshooting
Turn on debug mode before reproducing issues - it captures valuable diagnostic information.

### 6. Keep Browser Updated
Use the latest version of your browser for best compatibility and security.

### 7. Regular Diagnostics
Run diagnostics periodically to catch issues early.

---

## Glossary

**Access Token:** A temporary credential that allows the app to access your Google Calendar. Expires after about 1 hour.

**API Key:** A credential that identifies your Google Cloud project. Required for making API calls.

**Client ID:** A credential that identifies your OAuth application. Required for user authentication.

**OAuth 2.0:** The authorization protocol used to securely connect to Google Calendar.

**Scope:** A permission that defines what the app can access (e.g., read calendars, write events).

**Token Expiration:** When an access token is no longer valid and needs to be refreshed.

**Quota:** The limit on how many API calls you can make per day (1,000,000 for Calendar API).

**GAPI:** Google API Client Library - JavaScript library for making API calls.

**GIS:** Google Identity Services - JavaScript library for OAuth authentication.

---

**Last Updated:** January 17, 2026  
**Version:** 1.0  
**Application:** Time-Block Planner

---

*This guide is based on Google's OAuth 2.0 and Calendar API documentation as of January 2026. For the most up-to-date information, please refer to official Google documentation.*
