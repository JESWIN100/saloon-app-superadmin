const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'sg2plzcpnl506716.prod.sin2.secureserver.net',
  user: 'gulfdigit',
  password: 'Telepathy321#',
  database: 'gulfdigit'
});

module.exports = connection;
