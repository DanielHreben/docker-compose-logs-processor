#!/usr/bin/env node

const readline = require('readline');
/**
 * 
 * @param {string} input 
 * @returns {any}
 */
function parseJsonGracefully(input) {
  try {
    return JSON.parse(input)
  } catch { }
}

/**
 * @param {any} input 
 * @returns {boolean}
 */
function isObject(input) {
  return !!input && typeof input === 'object' && !Array.isArray(input);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});


rl.on('line', (line) => {
  const logLineStartPosition = line.indexOf('|');
  const containerName = line.substring(0, logLineStartPosition).trimEnd();
  const logLine = line.substring(logLineStartPosition + 1).trimStart();

  const parsedLogLine = parseJsonGracefully(logLine);
  const shouldWrapLogLine = isObject(parsedLogLine);

  console.log(shouldWrapLogLine ? JSON.stringify(Object.assign({ containerName }, parsedLogLine)) : line);
});


process.on('exit', (code) => {
  if (code !== 0) {
    process.exit(code);
  }
});
