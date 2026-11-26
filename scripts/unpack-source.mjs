import {
  existsSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { execFileSync } from 'node:child_process';

const archive = 'brandstudio-source.tar.xz';
const payloadDirectory = 'bds-payload';

if (!existsSync(archive) && existsSync(payloadDirectory)) {
  const parts = readdirSync(payloadDirectory)
    .filter((name) => /^part-\\d+\\.b64$/.test(name))
    .sort();

  if (parts.length > 0) {
    const encoded = parts
      .map((name) => readFileSync(`${payloadDirectory}/${name}`, 'utf8'))
      .join('');
    writeFileSync(archive, Buffer.from(encoded, 'base64'));
  }
}

if (existsSync(archive)) {
  execFileSync('tar', ['-xJf', archive], { stdio: 'inherit' });
}
