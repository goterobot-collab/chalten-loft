/**
 * ONE-TIME SETUP: Get Gmail OAuth2 refresh token for chaltenloft@gmail.com
 *
 * Steps:
 * 1. Go to https://console.cloud.google.com/apis/credentials
 * 2. Create OAuth 2.0 Client ID → Desktop app → Download JSON
 * 3. Set CLIENT_ID and CLIENT_SECRET below (or as env vars)
 * 4. Run: node scripts/get-gmail-token.mjs
 * 5. Open the URL shown, authorize → copy the code
 * 6. Paste the code → you'll get the refresh_token
 * 7. Add to Vercel: GOOGLE_GMAIL_REFRESH_TOKEN=<token>
 */

import { google } from 'googleapis'
import readline from 'readline'

// Strip literal \n and whitespace (same issue as in gmail-reader.ts cleanEnv)
const clean = (v) => (v || '').replace(/\\n/g, '').replace(/\s+/g, '').trim()
const CLIENT_ID = clean(process.env.GOOGLE_OAUTH_CLIENT_ID) || 'YOUR_CLIENT_ID'
const CLIENT_SECRET = clean(process.env.GOOGLE_OAUTH_CLIENT_SECRET) || 'YOUR_CLIENT_SECRET'
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob' // Desktop app

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/gmail.readonly'],
  prompt: 'consent', // Force to get refresh_token
})

console.log('\n=== GMAIL OAUTH2 SETUP ===')
console.log('\n1. Open this URL in Chrome (logged in as chaltenloft@gmail.com):')
console.log('\n' + authUrl)
console.log('\n2. Authorize the app → copy the code shown\n')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
rl.question('3. Paste the code here: ', async (code) => {
  rl.close()
  try {
    const { tokens } = await oauth2Client.getToken(code.trim())
    console.log('\n=== SUCCESS ===')
    console.log('\nAdd this to Vercel env vars:')
    console.log(`GOOGLE_OAUTH_CLIENT_ID=${CLIENT_ID}`)
    console.log(`GOOGLE_OAUTH_CLIENT_SECRET=${CLIENT_SECRET}`)
    console.log(`GOOGLE_GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`)
    console.log('\nAlso add to .env.local for local dev.')
  } catch (err) {
    console.error('\nError getting token:', err)
  }
})
