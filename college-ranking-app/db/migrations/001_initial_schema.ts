import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Create users table
  await db.schema
    .createTable('users')
    .addColumn('id', 'bigserial', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute()

  // Create disciplines table
  await db.schema
    .createTable('disciplines')
    .addColumn('id', 'bigserial', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull().unique())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute()

  // Create colleges table
  await db.schema
    .createTable('colleges')
    .addColumn('id', 'bigserial', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('type', 'text', (col) => col.notNull().check(sql`type IN ('public', 'private')`))
    .addColumn('logo', 'text')
    .addColumn('votes', 'bigint', (col) => col.defaultTo(0))
    .addColumn('score', 'bigint')
    .addColumn('discipline_id', 'bigint', (col) => col.references('disciplines.id').onDelete('set null'))
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute()

  // Create comments table
  await db.schema
    .createTable('comments')
    .addColumn('id', 'bigserial', (col) => col.primaryKey())
    .addColumn('text', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute()

  // Create indexes for better performance
  await db.schema
    .createIndex('idx_colleges_discipline')
    .on('colleges')
    .column('discipline_id')
    .execute()

  await db.schema
    .createIndex('idx_colleges_score')
    .on('colleges')
    .column('score')
    .execute()

  // Insert initial disciplines
  await db
    .insertInto('disciplines')
    .values([
      { name: 'Software Engineering' },
      { name: 'Investment Banking' },
      { name: 'Medicine' },
      { name: 'Business Administration' },
    ])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop tables in reverse order
  await db.schema.dropTable('comments').execute()
  await db.schema.dropTable('colleges').execute()
  await db.schema.dropTable('disciplines').execute()
  await db.schema.dropTable('users').execute()
}
