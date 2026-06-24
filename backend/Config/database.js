const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const dbName = 'node_bbms';

const sequelize = new Sequelize(dbName, 'root', '', {
    host: 'localhost',
    port: 3307,
    dialect: 'mysql',
    logging: false, // disable logging for cleaner terminal output
});

async function initializeDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3307,
            user: 'root',
            password: ''
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await connection.end();
        console.log(`Database '${dbName}' created or already exists.`);
    } catch (err) {
        console.error('Error during database auto-creation:', err.message);
    }
}

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err.message);
    });

// Attach initializeDatabase to sequelize so both are exported elegantly
sequelize.initializeDatabase = initializeDatabase;

module.exports = sequelize;