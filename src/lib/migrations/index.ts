import * as migration_20250212_054439_init from './20250212_054439_init';
import * as migration_20250212_223103_store_hours from './20250212_223103_store_hours';
import * as migration_20250213_182155_store_hours2 from './20250213_182155_store_hours2';

export const migrations = [
  {
    up: migration_20250212_054439_init.up,
    down: migration_20250212_054439_init.down,
    name: '20250212_054439_init',
  },
  {
    up: migration_20250212_223103_store_hours.up,
    down: migration_20250212_223103_store_hours.down,
    name: '20250212_223103_store_hours',
  },
  {
    up: migration_20250213_182155_store_hours2.up,
    down: migration_20250213_182155_store_hours2.down,
    name: '20250213_182155_store_hours2'
  },
];
