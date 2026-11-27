// The service declaration of the app: one Node service running the server
// in index.js. On Compute it gets its port through PORT (from
// service.port()) and binds every interface, which index.js already does.
import { compute } from '@prisma/composer-prisma-cloud';
import nodeBuild from '@prisma/composer/node';

export default compute({
  name: 'web',
  deps: {},
  build: nodeBuild({ module: import.meta.url, entry: './dist/index.js' }),
});
