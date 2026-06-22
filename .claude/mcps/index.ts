import { get_container_logs } from './get_container_logs';
import { query_test_db } from './query_test_db';

export const tools = {
  get_container_logs: {
    name: 'get_container_logs',
    description:
      'Retrieves the last N lines of logs from a Docker container. Useful for debugging container issues and monitoring service health.',
    inputSchema: {
      type: 'object',
      properties: {
        container_name: {
          type: 'string',
          description: 'The name or ID of the Docker container',
        },
        lines: {
          type: 'number',
          description: 'Number of log lines to retrieve (default: 50)',
          default: 50,
        },
      },
      required: ['container_name'],
    },
    handler: get_container_logs,
  },
  query_test_db: {
    name: 'query_test_db',
    description:
      'Executes SELECT queries against the test database (SQLite). Returns query results with row count and column information. Only SELECT queries are allowed for safety.',
    inputSchema: {
      type: 'object',
      properties: {
        sql_query: {
          type: 'string',
          description: 'The SELECT query to execute',
        },
        database: {
          type: 'string',
          description:
            'Database file name in the data directory (default: database.sqlite)',
          default: 'database.sqlite',
        },
      },
      required: ['sql_query'],
    },
    handler: query_test_db,
  },
};

export default tools;
