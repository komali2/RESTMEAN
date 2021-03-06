"use strict";

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

//API ROUTES

//basic error handle function
function handleError(res, reason, message, code){
    console.log('ERROR: ' + reason);
    res.status(code || 500).json({"error": message});
}

/*
    "/contacts"
    GET: finds all contacts
    POST: creates a new contact
*/

app.get('/contacts', (req, res)=>{
    db.collection(CONTACTS_COLLECTION).find({}).toArray((err, docs)=>{
        if(err){
            handleError(res, err.message, 'Failed to get contacts.');
        } else{
            res.status(200).json(docs);
        }
    });
});

app.post('/contacts', (req, res)=>{
    let newContact = req.body;
    newContact.createDate = new Date();

    if(!(req.body.firstName || req.body.lastName)){
        handleError(res, 'Invalid User Input', 'Must provide a first and last name', 400);
    }

    db.collection(CONTACTS_COLLECTION).insertOne(newContact, (err, doc)=>{
        if(err){
            handleError(res, err.message, "Failed to create new contact");
        } else{
            res.status(201).json(doc.ops[0]);
        }
    });
});

/*
    "/contacts/:id"
    GET: find contact by id
    PUT: update contact by id
    DELETE: deletes contact by id
*/

app.get('/contacts/:id', (req, res)=>{
    db.collection(CONTACTS_COLLECTION).findOne({_id: new ObjectID(req.params.id)}, (err, doc)=>{
        if(err){
            handleError(res, err.message, 'Failed to get contact');
        } else{
            res.status(200).json(doc);
        }
    });
});

app.put('/contacts/:id', (req, res)=>{
    let updateDoc = req.body;
    delete updateDoc._id;

    db.collection(CONTACTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, (err, doc)=>{
        if(err){
            handleError(res, err.message, 'Failed to update contact');
        } else{
            res.status(204).end();
        }
    });
});

app.delete('/contacts/:id', (req, res)=>{
    db.collection(CONTACTS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, (err, result)=>{
        if(err){
            handleError(res, err.message, "Failed to delete contact");
        } else{
            res.status(204).end();
        }
    });
});
