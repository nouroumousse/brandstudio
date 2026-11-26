import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const archive = 'brandstudio-source.tar.xz';
if (existsSync(archive)) {
  execFileSync('tar', ['-xJf', archive], { stdio: 'inherit' });
}
