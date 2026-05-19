import {execFileSync} from 'node:child_process';

const output = execFileSync(
  'git',
  ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'],
  {encoding: 'utf8'},
);

const files = output.split('\0').filter(Boolean);

if (files.length === 0) {
  process.exit(0);
}

execFileSync('npx', ['prettier', '--write', '--ignore-unknown', ...files], {
  stdio: 'inherit',
});

execFileSync('git', ['add', '--', ...files], {
  stdio: 'inherit',
});
