#!/usr/bin/env node
/**
 * Quick Supabase connection test - no browser needed
 * Usage: VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... node scripts/test-supabase-connection.js
 */

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

console.log("=== Supabase Connection Test ===");
console.log("URL:", url || "NOT SET");
console.log("Key length:", key ? key.length + " chars" : "NOT SET");

if (!url || !key) {
  console.error(
    "\n❌ FAIL: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY",
  );
  process.exit(1);
}

const testUrl = `${url}/rest/v1/`;
console.log("\nTesting:", testUrl);

fetch(testUrl, {
  method: "GET",
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
  },
})
  .then((res) => {
    console.log("Status:", res.status, res.statusText);
    if (res.ok) {
      console.log("\n✅ SUCCESS: Supabase is reachable!");
      process.exit(0);
    } else {
      return res.text().then((body) => {
        console.log("Response body:", body);
        console.error("\n❌ FAIL: Supabase returned non-OK status");
        process.exit(1);
      });
    }
  })
  .catch((err) => {
    console.error("Error:", err.message);
    console.error("\n❌ FAIL: Could not reach Supabase");
    process.exit(1);
  });
