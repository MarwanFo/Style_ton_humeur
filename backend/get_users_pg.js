const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres@localhost:5433/style_ton_humeur?schema=public',
});

async function run() {
  await client.connect();
  const res = await client.query('SELECT email, "passwordHash" FROM "User"');
  console.log('Users in database:');
  console.table(res.rows);
  await client.end();
}

run().catch(console.error);
