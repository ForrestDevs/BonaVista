import * as migration_20250212_054439_init from './20250212_054439_init';

export const migrations = [
  {
    up: migration_20250212_054439_init.up,
    down: migration_20250212_054439_init.down,
    name: '20250212_054439_init'
  },
];
