const mysql = require('mysql2');
const config = require("../db_config.json");
const util = require("util");

// connection pool 생성
let pool = mysql.createPool(config);

pool.getConnection((err, connection) => {
    if (err) { // 연결 에러 처리
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error("DB ERROR : Database connection was closed");
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error("DB ERROR : Database has too many connections");
        }
        if (err.code === 'ECONNREFUSED') {
            console.error("DB ERROR : Database connection was refused");
        }
    }

    // connection이 있으면 연결되었으므로 connection을 다시 반환
    if (connection) connection.release();
    return
});

// pool.query()를 Promise화시켜 비동기에 사용
pool.query = util.promisify(pool.query);

module.exports = pool;