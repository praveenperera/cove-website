import { createClient } from '@libsql/client'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

async function main() {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url) {
    console.error('TURSO_DATABASE_URL is not set')
    process.exit(1)
  }

  const db = createClient({ url, authToken })

  const scriptDir = dirname(fileURLToPath(import.meta.url))
  const migrationPath = resolve(scriptDir, '../migrations/0001_feature_votes.sql')
  const sql = readFileSync(migrationPath, 'utf-8')

  // split on semicolons only outside of BEGIN...END blocks
  const statements: string[] = []
  let current = ''
  let inBlock = false

  for (const line of sql.split('\n')) {
    const trimmed = line.trim().toUpperCase()
    if (trimmed === 'BEGIN') inBlock = true
    if (trimmed.startsWith('END;') || trimmed === 'END') inBlock = false

    current += line + '\n'

    if (!inBlock && line.trimEnd().endsWith(';')) {
      const stmt = current.trim().replace(/;$/, '')
      if (stmt.length > 0) statements.push(stmt)
      current = ''
    }
  }

  console.log(`Running ${statements.length} statements from ${migrationPath}`)

  for (const statement of statements) {
    console.log(`  -> ${statement.slice(0, 60)}...`)
    await db.execute(statement)
  }

  console.log('Migration complete')
}

main()
