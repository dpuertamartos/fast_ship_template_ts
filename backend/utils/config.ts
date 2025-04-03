import 'dotenv/config';

const PORT: string = process.env.PORT || '3001';
const MYSQL_URI: string = process.env.MYSQL_URI!;
const NODE_ENV: string = process.env.NODE_ENV || 'dev';
const BASE_URI: string = '/api';
const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET!;
const DOMINIO: string = process.env.DOMINIO || '';
const JWT_SECRET: string = process.env.JWT_SECRET!;
const TOKEN_EXPIRATION: number = parseInt(process.env.TOKEN_EXPIRATION || '24 * 60 * 60 * 30');

export {
    PORT, 
    MYSQL_URI, 
    NODE_ENV, 
    BASE_URI,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    DOMINIO,
    JWT_SECRET,
    TOKEN_EXPIRATION
};

