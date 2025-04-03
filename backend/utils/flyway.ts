import { MYSQL_URI } from './config';
import { Flyway, FlywayCliStrategy } from 'node-flyway';
import { FlywayConfig } from 'node-flyway/dist/types/types';
import logger from './logger';

const obtainFlywayConfig = (maintainExistingTables: boolean): FlywayConfig => {
  const mysqlUrlMatch = MYSQL_URI!.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  
  if (!mysqlUrlMatch) {
    logger.error('Invalid MySQL URI format');
    process.exit(1);
  }

  const [, user, password, host, port, database] = mysqlUrlMatch;

  const flywayConfig: FlywayConfig = {
    url: `jdbc:mysql://${host}:${port}/${database}`,
    user: user,
    password: password,
    defaultSchema: database,
    migrationLocations: ['db_migration'],
  };

  if (maintainExistingTables) {
    flywayConfig.advanced = {
      baselineOnMigrate: true,
      baselineVersion: '0',
      cleanDisabled: false
    };
  }

  return flywayConfig;
};

const runFlywayMigrations = async () => {
  const flywayConfig: FlywayConfig = obtainFlywayConfig(true);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const flyway = new Flyway(
    flywayConfig,
    {
      flywayCliLocation: '/opt/flyway',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      flywayCliStrategy: FlywayCliStrategy.LOCAL_CLI_ONLY
    }
  );

  try {
    logger.info('Running Flyway migrations...');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const result = await flyway.migrate();
    logger.info('Flyway migrations completed:', result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('Flyway migration failed:', error.message);
    } else {
      logger.error('Flyway migration failed with unknown error');
    }
    process.exit(1); // Exit if migrations fail
  }
};

export { runFlywayMigrations };
