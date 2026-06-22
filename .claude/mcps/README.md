# AuthService MCP Tools

Two Model Context Protocol (MCP) tools for enhanced development and debugging of the AuthService application.

## Tools

### 1. `get_container_logs(container_name, lines?)`

Retrieves the last N lines of logs from a Docker container.

**Parameters:**
- `container_name` (string, required): The name or ID of the Docker container
- `lines` (number, optional): Number of log lines to retrieve (default: 50)

**Returns:**
- `container`: Container name
- `logs`: Full log output
- `lineCount`: Number of log lines returned
- `error`: Error message if retrieval failed

**Example:**
```typescript
await get_container_logs({
  container_name: 'auth-service',
  lines: 100
});
```

**Use Cases:**
- Debugging container startup failures
- Monitoring application logs
- Investigating runtime errors
- Checking container health issues

---

### 2. `query_test_db(sql_query, database?)`

Executes SELECT queries against the test database (SQLite).

**Parameters:**
- `sql_query` (string, required): The SELECT query to execute
- `database` (string, optional): Database file name in the data directory (default: database.sqlite)

**Returns:**
- `query`: The executed query
- `rows`: Array of result rows as objects
- `rowCount`: Number of rows returned
- `columns`: Array of column names
- `error`: Error message if query failed

**Restrictions:**
- Only SELECT queries are allowed for safety
- Queries execute with read-only database access
- Database path is restricted to the `data/` directory

**Example:**
```typescript
await query_test_db({
  sql_query: 'SELECT * FROM users WHERE status = "active"'
});
```

**Use Cases:**
- Verifying test data in the database
- Querying user records
- Debugging data-related issues
- Checking database state during tests
- Analyzing query results for integration testing

---

## Setup

1. Build the TypeScript files:
   ```bash
   npm run build
   ```

2. The compiled JavaScript will be available in the `dist/` directory.

3. Configure in Claude Code settings to enable MCP access.

## Security

- **get_container_logs**: Restricted to Docker CLI with standard access controls
- **query_test_db**: Read-only database access, SELECT-only queries, path validation

## Development

Watch mode for development:
```bash
npm run watch
```

Clean build artifacts:
```bash
npm run clean
```
