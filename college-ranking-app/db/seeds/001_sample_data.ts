import { Kysely } from 'kysely'

export async function seed(db: Kysely<any>): Promise<void> {
  // Insert sample colleges
  await db
    .insertInto('colleges')
    .values([
      {
        name: 'Stanford University',
        type: 'private',
        discipline_id: 1, // Software Engineering
      },
      {
        name: 'MIT',
        type: 'private',
        discipline_id: 1, // Software Engineering
      },
      {
        name: 'Harvard University',
        type: 'private',
        discipline_id: 1, // Software Engineering
      },
      {
        name: 'UC Berkeley',
        type: 'public',
        discipline_id: 1, // Software Engineering
      },
      {
        name: 'University of Texas at Austin',
        type: 'public',
        discipline_id: 1, // Software Engineering
      },
      {
        name: 'University of Chicago',
        type: 'public',
        discipline_id: 1, // Software Engineering
      },
      {
        name: 'Columbia University',
        type: 'private',
        discipline_id: 1, // Software Engineering
      },
      {
        name: 'Princeton University',
        type: 'private',
        discipline_id: 1, // Software Engineering
      },
      {
        name: 'Carnegie Mellon University',
        type: 'private',
        discipline_id: 1, // Software Engineering
      },
      {
        name: 'Yale University',
        type: 'private',
        discipline_id: 1, // Software Engineering
      },
      {
        name: 'Caltech',
        type: 'private',
        discipline_id: 1, // Software Engineering
      },

      {
        name: 'University of Pennsylvania',
        type: 'private',
        discipline_id: 1, // Software Engineering
      },
      {
        name: 'Northwestern University',
        type: 'private',
        discipline_id: 1, // Software Engineering
      },
      {
        name: 'Duke University',
        type: 'private',
        discipline_id: 1, // Software Engineering
      },
      {
        name: 'Brown University',
        type: 'private',
        discipline_id: 1, // Software Engineering
      },
      {
        name: 'Dartmouth College',
        type: 'private',
        discipline_id: 1, // Software Engineering
      },
      {
        name: 'Vanderbilt University',
        type: 'private',
        discipline_id: 1, // Software Engineering
      },
      {
        name: 'Rice University',
        type: 'private',
        discipline_id: 1, // Software Engineering
      },
      {
        name: 'Georgetown University',
        type: 'private',
        discipline_id: 1, // Software Engineering
      },
      {
        name: 'Cornell University',
        type: 'private',
        discipline_id: 1, // Software Engineering
      },
    ])
    .execute()
}
