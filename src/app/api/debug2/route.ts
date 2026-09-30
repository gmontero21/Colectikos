import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query('SELECT column_name FROM information_schema.columns WHERE table_name = \'User\'');
    return NextResponse.json(res.rows);
  } finally {
    await pool.end();
  }
}
