import { execSync } from 'child_process';

interface GetContainerLogsInput {
  container_name: string;
  lines?: number;
}

interface GetContainerLogsResult {
  container: string;
  logs: string;
  lineCount: number;
  error?: string;
}

export async function get_container_logs(
  input: GetContainerLogsInput
): Promise<GetContainerLogsResult> {
  const { container_name, lines = 50 } = input;

  if (!container_name || container_name.trim() === '') {
    return {
      container: container_name,
      logs: '',
      lineCount: 0,
      error: 'Container name is required',
    };
  }

  try {
    const command = `docker logs --tail ${lines} ${container_name}`;
    const output = execSync(command, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const logLines = output.trim().split('\n').filter(line => line.length > 0);

    return {
      container: container_name,
      logs: output,
      lineCount: logLines.length,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      container: container_name,
      logs: '',
      lineCount: 0,
      error: `Failed to get logs: ${errorMessage}`,
    };
  }
}
