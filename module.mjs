// The app root: the whole Composer app. Its name decides which project on
// Prisma Cloud this app deploys to.
import { appRoot } from '@prisma/composer';
import web from './service.mjs';

export default appRoot('myappsw', ({ provision }) => {
  provision(web);
});
