import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgres://postgres:postgres@localhost:5432/postgres'
});

async function check() {
  try {
    await client.connect();
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname='eyesoul_brand'");
    if (res.rowCount > 0) {
      console.log('DATABASE_EXISTS');
    } else {
      console.log('DATABASE_MISSING');
    }
  } catch (err) {
    console.log('CONNECTION_ERROR', err.message);
  } finally {
    await client.end();
  }
}

check();
