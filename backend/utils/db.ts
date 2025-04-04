import { Sequelize, Options } from 'sequelize';
import { MYSQL_URI } from './config';
import logger from './logger';

if (!MYSQL_URI) {
    logger.error('FATAL ERROR: MYSQL_URI environment variable is not defined.');
    process.exit(1);
}

const sequelizeOptions: Options = {
    dialect: 'mysql',
    pool: {
        max: 60,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    timezone: '+00:00',
    logging: false,
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
const sequelize = new Sequelize(MYSQL_URI, sequelizeOptions);

const connectToDatabase = async () => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        await sequelize.authenticate();
        logger.info('Database connection has been established successfully.');
    } catch (error: unknown) {
        logger.error('Unable to connect to the database:', error);
        throw error;
    }
};

export { sequelize, connectToDatabase };