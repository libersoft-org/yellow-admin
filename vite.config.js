import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function getGitCommitHash() {
 try {
  return execSync('cd .git && git rev-parse --short HEAD').toString().trim();
 } catch (e) {
  //console.error('Error getting git commit hash:', e);
  return null;
 }
}

export default defineConfig({
 plugins: [sveltekit()],
 define: {
  __BUILD_DATE__: new Date(),
  __COMMIT_HASH__: JSON.stringify(getGitCommitHash()),
 },
 server: {
  https: (fs.existsSync(path.resolve(__dirname, 'server.key')) ?
   {
    key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
    cert: fs.readFileSync(path.resolve(__dirname, 'server.crt'))
   } : null),
  allowedHosts: true,
  host: true,
  port: 4000
 }
});
