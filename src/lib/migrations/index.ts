import * as migration_20250217_194512_init from './20250217_194512_init';

export const migrations = [
  {
    up: migration_20250217_194512_init.up,
    down: migration_20250217_194512_init.down,
    name: '20250217_194512_init'
  },
];
