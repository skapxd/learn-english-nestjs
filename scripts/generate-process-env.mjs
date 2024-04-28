import { readFileSync, writeFileSync } from 'node:fs';

try {
  const fileEnv = readFileSync('.env', 'utf8');

  const arr = fileEnv
    .split(/\n|\r/)
    .map((line) => line.trim())
    .map((line) => (line.startsWith('#') ? '' : line))
    .filter(Boolean)
    .map((line) => line.split('=')[0] + ': string');

  const template = [
    'declare namespace NodeJS {',
    '  export interface ProcessEnv {',
    ...arr.map((line) => '    ' + line + ';'),
    '  }',
    '}',
    '',
  ];

  writeFileSync('process.d.ts', template.join('\n'));
} catch (error) {}
