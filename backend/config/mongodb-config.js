var MongoClient = require('mongodb').MongoClient

module.exports={
    mongo:MongoClient,
    address:'mongodb://localhost:27017/animals',
    find:function(entity,callback){
        MongoClient.connect(address, function (err, db) {
            if (err) throw err
            var dbo = db.db("test");
            db.collection('test').find(entity).toArray(function (err, result) {
                if (err) throw err
                if(callback) {
                    callback(result)
                }
                console.log(result)
            })
        })
    },
    insert:function(entity,callback){
        MongoClient.connect(address,function(err, db) {
            if (err) throw err;
            var dbo = db.db("test");
            dbo.collection("test").insertOne(entity, function(err, res) {
                if (err) throw err;
                if(callback) {
                    callback(res)
                }
                db.close();
            });
        })
    }
}
