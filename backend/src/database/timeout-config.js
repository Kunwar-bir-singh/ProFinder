// Database timeout configuration
// Add these settings to your database config for better timeout handling

const dbConfig = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'postgres',
    
    // Timeout configurations
    pool: {
      max: 10,
      min: 0,
      acquire: 60000, // 60 seconds max time to acquire connection
      idle: 10000    // 10 seconds before connection is released
    },
    
    // Query timeout
    query_timeout: 30000, // 30 seconds
    
    // Transaction timeout (in milliseconds)
    transaction_timeout: 45000, // 45 seconds
    
    // Additional timeout settings
    acquireTimeoutMillis: 60000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    
    // Reconnection settings
    reconnect: true,
    retry: {
      match: [
        /ETIMEDOUT/,
        /EHOSTUNREACH/,
        /ECONNRESET/,
        /ECONNREFUSED/,
        /ETIMEDOUT/,
        /EAI_AGAIN/,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeTimeoutError/
      ],
      max: 3
    }
  },
};

module.exports = dbConfig;