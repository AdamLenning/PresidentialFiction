    const functions = require('firebase-functions');
    const firebase = require('firebase-admin');
    const express = require('express');

    const firebaseApp = firebase.initializeApp(
        functions.config().firebase
    );

    const app = express();

    // Create a new item in the museum: takes a title and a path to an image.
    var db = firebase.firestore();
    var itemsRef = db.collection('items');

    // Get a list of all of the items in the museum.
    app.get('/api/items', async (req, res) => {
    try{
        let querySnapshot = await itemsRef.get();
        res.send(querySnapshot.docs.map(doc => doc.data()));
    }catch(err){
        res.sendStatus(500);
    }
    });

    app.post('/api/items', async (req, res) => {
        try {
            let querySnapshot = await itemsRef.get();
            let numRecords = querySnapshot.docs.length;
            let item = {
                id: Math.random(),
                title: req.body.title,
                description: req.body.description,
                path: req.body.path
            };
            itemsRef.doc(item.id.toString()).set(item);
            res.send(item);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    });

    app.delete('/api/items/:id', async (req,res) => {
    let id = req.params.id.toString();
    var documentToDelete = itemsRef.doc(id);
    try{
        var doc = await documentToDelete.get();
        if(!doc.exists){
            res.status(404).send("Sorry, that item doesn't exist");
            return;
        }
        else{
            documentToDelete.delete();
            res.sendStatus(200);
            return;
        }
    }catch(err){
        res.status(500).send("Error deleting document: ",err);
    }
    });

    app.put('/api/items/:id', async (req, res) => {
        let id = req.params.id.toString();
        var documentToEdit = itemsRef.doc(id);
        try{
            documentToEdit.update({
                "title" : req.body.title,
                "description" : req.body.description
            });
            return;
        } catch(err) {
            res.status(500).send("Error editing document: ",err);
        }
    })

    exports.app = functions.https.onRequest(app);