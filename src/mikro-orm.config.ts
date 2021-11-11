import { ConnectionOptions, EntityManager } from '@mikro-orm/core';
import { AsyncLocalStorage } from 'async_hooks';
// const storage = new AsyncLocalStorage<EntityManager>();

export default {
  entities: ['dist/entities'], // compiled JS files
  // entitiesTs: ['src/entities'],
  dbName: 'svtickets',
  type: 'mariadb', // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
  user: 'example',
  password: 'example',
  port: 3306,
  host: 'arturober.com',
  debug: true,
  // registerRequestContext: false, // disable automatic middleware
  // context: () => storage.getStore(), // use our AsyncLocalStorage instance
} as ConnectionOptions;
