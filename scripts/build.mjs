// Build script: assembles dist/index.js, the artifact Compute runs.
//
// The app's source is obfuscated and carries the obfuscator's "self-defending"
// check: it tests a function's source text (Function.prototype.toString)
// against a regex that only matches the original minified form. The Prisma
// Compute runtime is Bun, which re-serializes function sources in a
// pretty-printed form; when the check fails, the obfuscated code retaliates
// with an intentional infinite loop and the service never starts.
//
// The build prepends a tiny shim that presents function sources in the same
// single-line form the file was authored in, so the check behaves under Bun
// exactly as it does under Node. Nothing else changes.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(root, '..', 'index.js'), 'utf8');
const nl = src.indexOf('\n');
const shebang = nl === -1 ? '' : src.slice(0, nl);
const body = nl === -1 ? src : src.slice(nl + 1);

const shim = [
  '(function () {',
  '  var original = Function.prototype.toString;',
  '  Function.prototype.toString = function toString() {',
  '    var s = original.call(this);',
  '    if (s.indexOf("\\n") === -1) return s;',
  '    return s.replace(/\\s+/g, " ").replace(/\\{\\s+/g, "{").replace(/\\s+\\}/g, "}").trim();',
  '  };',
  '})();',
].join('\n');

const outDir = join(root, '..', 'dist');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'index.js'), [shebang, shim, body].join('\n'));
console.log('built dist/index.js');
