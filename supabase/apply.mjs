// Apply schema.sql (and seed.sql) to your Supabase database.
// Connection details come from environment variables to avoid URL-encoding
// issues with special characters in the password.
//
// Required env vars: PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pg = require(join(
  'c:/Users/youss/OneDrive/Documents/NexuSolutions/AI Web  site/project-bolt-sb1-h1afxx4s/MathProject/client/node_modules/pg/lib/index.js'
))

const __dirname = dirname(fileURLToPath(import.meta.url))

const client = new pg.Client({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || 'postgres',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
  ssl: { rejectUnauthorized: false },
})

const files = ['schema.sql', 'seed.sql']

try {
  await client.connect()
  console.log('Connected to database.')
  for (const file of files) {
    const sql = await readFile(join(__dirname, file), 'utf8')
    console.log(`\nRunning ${file} ...`)
    await client.query(sql)
    console.log(`OK: ${file} applied successfully.`)
  }
  console.log('\nAll done! Your database is ready.')
} catch (err) {
  console.error('\nFailed:', err.message)
  process.exitCode = 1
} finally {
  await client.end()
}
