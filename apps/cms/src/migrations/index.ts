import * as migration_20260413_010115 from './20260413_010115';

export const migrations = [
  {
    up: migration_20260413_010115.up,
    down: migration_20260413_010115.down,
    name: '20260413_010115'
  },
];
