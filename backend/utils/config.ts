import 'dotenv/config';

const PORT = process.env.PORT;
const MYSQL_URI = process.env.MYSQL_URI;
const NODE_ENV = process.env.NODE_ENV || 'dev';

export { PORT, MYSQL_URI, NODE_ENV };

