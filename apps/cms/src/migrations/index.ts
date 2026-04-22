import * as migration_20260413_010115 from './20260413_010115';
import * as migration_20260413_120000 from './20260413_120000';
import * as migration_20260415_040759 from './20260415_040759';
import * as migration_20260416_210500 from './20260416_210500';
import * as migration_20260416_211500 from './20260416_211500';
import * as migration_20260420_211000 from './20260420_211000';
import * as migration_20260421_120000 from './20260421_120000';

export const migrations = [
  {
    up: migration_20260413_010115.up,
    down: migration_20260413_010115.down,
    name: '20260413_010115',
  },
  {
    up: migration_20260413_120000.up,
    down: migration_20260413_120000.down,
    name: '20260413_120000',
  },
  {
    up: migration_20260415_040759.up,
    down: migration_20260415_040759.down,
    name: '20260415_040759'
  },
  {
    up: migration_20260416_210500.up,
    down: migration_20260416_210500.down,
    name: '20260416_210500',
  },
  {
    up: migration_20260416_211500.up,
    down: migration_20260416_211500.down,
    name: '20260416_211500',
  },
  {
    up: migration_20260420_211000.up,
    down: migration_20260420_211000.down,
    name: '20260420_211000',
  },
  {
    up: migration_20260421_120000.up,
    down: migration_20260421_120000.down,
    name: '20260421_120000',
  },
];
