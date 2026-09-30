import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query('SELECT id, username, "avatarUrl", genero, "rangoEdad", "lugarFavorito" FROM "User"');
    return NextResponse.json(res.rows);
  } finally {
    await pool.end();
  }
}
