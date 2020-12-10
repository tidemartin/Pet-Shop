var mysql = require('mysql')

module.exports={
    createConnection:function () {
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'mall_pet_db'
        })
        return connection
    }
}
