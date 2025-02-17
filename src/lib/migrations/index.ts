import * as migration_20250217_194512_init from './20250217_194512_init';
import * as migration_20250217_212904_tz from './20250217_212904_tz';

export const migrations = [
  {
    up: migration_20250217_194512_init.up,
    down: migration_20250217_194512_init.down,
    name: '20250217_194512_init',
  },
  {
    up: migration_20250217_212904_tz.up,
    down: migration_20250217_212904_tz.down,
    name: '20250217_212904_tz'
  },
];
