import * as migration_20260413_010115 from './20260413_010115';
import * as migration_20260413_120000 from './20260413_120000';

export const migrations = [
  {
    up: migration_20260413_010115.up,
    down: migration_20260413_010115.down,
    name: '20260413_010115'
  },
  {
    up: migration_20260413_120000.up,
    down: migration_20260413_120000.down,
    name: '20260413_120000'
  },
];
