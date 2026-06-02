// Apply all SQL migrations to your Supabase database automatically.
// Auto-derives the PG host from VITE_SUPABASE_URL so you only need to supply PGPASSWORD.
//
// How to run:
//   PGPASSWORD=your_db_password node supabase/apply.mjs
//
// Find your DB password in: Supabase Dashboard → Settings → Database → Database password

import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pg = require(join(
  'c:/Users/youss/OneDrive/Documents/NexuSolutions/AI Web  site/project-bolt-sb1-h1afxx4s/MathProject/client/node_modules/pg/lib/index.js'
))

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Auto-derive PG host from VITE_SUPABASE_URL ──────────────────────────────
// VITE_SUPABASE_URL = https://fwywhawuokbwxgzczujl.supabase.co
// PG host           = db.fwywhawuokbwxgzczujl.supabase.co

function pgHostFromSupabaseUrl(url) {
  if (!url) return null
  const match = url.match(/https?:\/\/([^.]+)\.supabase\.co/)
  return match ? `db.${match[1]}.supabase.co` : null
}

// Load .env.local so VITE_SUPABASE_URL is available without extra setup
async function loadEnv() {
  try {
    const envPath = join(__dirname, '../client/.env.local')
    const text    = await readFile(envPath, 'utf8')
    for (const line of text.split('\n')) {
      const m = line.match(/^([^#=\s]+)\s*=\s*(.+)$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
    }
  } catch { /* .env.local not found — rely on process.env */ }
}

await loadEnv()

const pgHost = process.env.PGHOST || pgHostFromSupabaseUrl(process.env.VITE_SUPABASE_URL)
const pgPass = process.env.PGPASSWORD

if (!pgHost) {
  console.error('ERROR: Cannot determine PG host.')
  console.error('Set PGHOST=db.<project>.supabase.co  OR  add VITE_SUPABASE_URL to client/.env.local')
  process.exit(1)
}
if (!pgPass) {
  console.error('ERROR: PGPASSWORD is not set.')
  console.error('Find it in: Supabase Dashboard → Settings → Database → Database password')
  console.error('\nThen run:  PGPASSWORD=yourpassword node supabase/apply.mjs')
  process.exit(1)
}

// ── SQL files to run in order ────────────────────────────────────────────────
const files = [
  'schema.sql',               // base tables, RLS, indexes
  'seed.sql',                 // badge definitions, Grade 4 topics
  'create_user_progress.sql', // user_progress table (TEXT lesson_ref, no FK)
  'add_streak_column.sql',    // profiles.last_quiz_date for streaks
  'link_child_code.sql'       // kid link_code + link_child_by_code RPC + parent-read RLS
  , 'create_notifications.sql' // notifications table + RPC for parent alerts
]

const client = new pg.Client({
  host:     pgHost,
  port:     Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || 'postgres',
  user:     process.env.PGUSER     || 'postgres',
  password: pgPass,
  ssl:      { rejectUnauthorized: false },
})

try {
  await client.connect()
  console.log(`Connected to ${pgHost}\n`)

  for (const file of files) {
    const sql = await readFile(join(__dirname, file), 'utf8')
    console.log(`Running ${file} ...`)
    await client.query(sql)
    console.log(`  OK\n`)
  }

  console.log('All migrations applied. Database is ready.')
} catch (err) {
  console.error('Failed:', err.message)
  process.exitCode = 1
} finally {
  await client.end()
}
