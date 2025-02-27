import * as migration_20250217_194512_init from './20250217_194512_init';
import * as migration_20250217_212904_tz from './20250217_212904_tz';
import * as migration_20250226_211513_collection from './20250226_211513_collection';
import * as migration_20250227_033846_productIndex from './20250227_033846_productIndex';
import * as migration_20250227_044257_productPriceIndex from './20250227_044257_productPriceIndex';
import * as migration_20250227_045351_productPriceIndex2 from './20250227_045351_productPriceIndex2';

export const migrations = [
  {
    up: migration_20250217_194512_init.up,
    down: migration_20250217_194512_init.down,
    name: '20250217_194512_init',
  },
  {
    up: migration_20250217_212904_tz.up,
    down: migration_20250217_212904_tz.down,
    name: '20250217_212904_tz',
  },
  {
    up: migration_20250226_211513_collection.up,
    down: migration_20250226_211513_collection.down,
    name: '20250226_211513_collection',
  },
  {
    up: migration_20250227_033846_productIndex.up,
    down: migration_20250227_033846_productIndex.down,
    name: '20250227_033846_productIndex',
  },
  {
    up: migration_20250227_044257_productPriceIndex.up,
    down: migration_20250227_044257_productPriceIndex.down,
    name: '20250227_044257_productPriceIndex',
  },
  {
    up: migration_20250227_045351_productPriceIndex2.up,
    down: migration_20250227_045351_productPriceIndex2.down,
    name: '20250227_045351_productPriceIndex2'
  },
];
