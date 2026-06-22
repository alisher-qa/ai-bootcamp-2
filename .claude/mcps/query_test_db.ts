import sqlite3 from 'sqlite3';
import * as path from 'path';

interface QueryTestDbInput {
  sql_query: string;
  database?: string;
}

interface QueryTestDbResult {
  query: string;
  rows: any[];
  rowCount: number;
  columns?: string[];
  error?: string;
}

export async function query_test_db(
  input: QueryTestDbInput
): Promise<QueryTestDbResult> {
  const { sql_query, database = 'database.sqlite' } = input;

  if (!sql_query || sql_query.trim() === '') {
    return {
      query: sql_query,
      rows: [],
      rowCount: 0,
      error: 'SQL query is required',
    };
  }

  // Only allow SELECT queries for safety
  if (!/^\s*SELECT\s+/i.test(sql_query.trim())) {
    return {
      query: sql_query,
      rows: [],
      rowCount: 0,
      error: 'Only SELECT queries are allowed',
    };
  }

  return new Promise(resolve => {
    try {
      const dbPath = path.join(process.cwd(), 'data', database);
      const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, err => {
        if (err) {
          resolve({
            query: sql_query,
            rows: [],
            rowCount: 0,
            error: `Failed to open database: ${err.message}`,
          });
          return;
        }

        db.all(sql_query, (err, rows) => {
          if (err) {
            resolve({
              query: sql_query,
              rows: [],
              rowCount: 0,
              error: `Query failed: ${err.message}`,
            });
          } else {
            const columns = rows && rows.length > 0 ? Object.keys(rows[0] as object) : [];
            resolve({
              query: sql_query,
              rows: rows || [],
              rowCount: rows?.length || 0,
              columns,
            });
          }

          db.close();
        });
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      resolve({
        query: sql_query,
        rows: [],
        rowCount: 0,
        error: `Unexpected error: ${errorMessage}`,
      });
    }
  });
}
