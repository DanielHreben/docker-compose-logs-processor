# docker-compose-logs-processor

Process docker-compose logs so they can be handled properly by tools like `pino-pretty`.
See <https://github.com/pinojs/pino/issues/178> for details.

## Usage

```bash
set -euo pipefail
docker-compose -f ./docker-compose.yml up --exit-code-from important-container | npx docker-compose-logs-processor | npx pino-pretty
```
