import { describe, it } from 'node:test';
import assert from 'node:assert';
import { spawn } from 'child_process';

const spawnStripPrefix = () => spawn('node', ['./src/index.js'])

describe('strip-docker-compose-prefix', function () {
  it('should handle valid JSON log line', (t, done) => {
    const stripPrefix = spawnStripPrefix();

    // Docker-compose like input
    const input = `container_name_1  | {"message": "Log message", "level": "info"}`;
    stripPrefix.stdin.write(input);
    stripPrefix.stdin.end();

    let data = '';
    stripPrefix.stdout.on('data', (chunk) => data += chunk);

    stripPrefix.on('close', (code) => {
      // The script should exit with code 0
      assert.strictEqual(code, 0);

      // The output should be a JSON string with the container name and the log message
      const expectedOutput = JSON.stringify({ containerName: 'container_name_1', message: 'Log message', level: 'info' });
      assert.strictEqual(data.trim(), expectedOutput);

      done();
    });
  });

  it('should handle invalid JSON log line', (t, done) => {
    const stripPrefix = spawnStripPrefix();

    // Docker-compose like input, but invalid JSON
    const input = `container_name_1  | Not a JSON string`;
    stripPrefix.stdin.write(input);
    stripPrefix.stdin.end();

    let data = '';
    stripPrefix.stdout.on('data', (chunk) => data += chunk);

    stripPrefix.on('close', (code) => {
      // The script should exit with code 0
      assert.strictEqual(code, 0);

      // The output should be the original log line
      assert.strictEqual(data.trim(), input);

      done();
    });
  });
});