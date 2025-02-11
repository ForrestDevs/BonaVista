import * as migration_20250211_223154_init from './20250211_223154_init';

export const migrations = [
  {
    up: migration_20250211_223154_init.up,
    down: migration_20250211_223154_init.down,
    name: '20250211_223154_init'
  },
];
