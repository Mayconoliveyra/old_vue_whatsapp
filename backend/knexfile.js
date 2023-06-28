const { sqlServerConect } = require("./.env")

module.exports = {
  client: 'mssql',
  connection: sqlServerConect,
  pool: {
    min: 2,
    max: 7
  },
  migrations: {
    tableName: 'wpp_migrations'
  }
};
