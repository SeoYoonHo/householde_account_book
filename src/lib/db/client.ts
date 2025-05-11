// src/lib/db/client.ts
import mysql from "mysql2/promise";

export async function query(
  sql: string,
  params?: unknown[]
): Promise<[unknown[], mysql.FieldPacket[]]> {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  });

  try {
    const result = await connection.query(sql, params);
    return result; // ✅ pool.query 와 완전히 동일하게 [rows, fields]
  } finally {
    await connection.end();
  }
}

export async function getConnection(): Promise<mysql.Connection> {
  return mysql.createConnection({
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  });
}