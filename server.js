var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

var CONTACTS_COLLECTION = 'contacts';

var app = express();

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

//create a global database variable
var db;

//connect to db server, then start our server

mongodb.MongoClient.connect(process.env.MONGODB_URI, (err, database)=>{
    if(err){
        console.log(err);
        process.exit(1);
    }

    //save db object from callback for reuse
    //you can probably do the same for sockets, other DBs, etc
    db = database;
    console.log("DB connection ready");

    //initialize app
    var server = app.listen(process.env.PORT || 8080, ()=>{
        var port = server.address().port;
        console.log('App now running on port,', port);
    });
});