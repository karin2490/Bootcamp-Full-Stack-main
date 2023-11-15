const express = require('express');
const bodyParser=require('body-parser')
const app = express();

const { promisify } = require('util');
const  MongoClient  = require('mongodb').MongoClient;

const url='mongodb://mongodb-container:27017';
//const url='mongodb://localhost:27017';
const dbName='mock_database';
const collectionName='users';

const hostname = '0.0.0.0';
const port = 8080;

app.use(bodyParser.json());

// GET method route
app.get('/', function (req, res) {
    res.send('GET request to the homepage');
});
  
// POST method route
app.post('/', function (req, res) {
    res.send('POST request to the homepage');
});

// GET method route
app.get('/secret', function (req, res, next) {
    res.send('Never be cruel, never be cowardly. And never eat pears!');
    console.log('This is a console.log message.');
});

/*
Your implementation here 
*/


// GET method route
// Retrieve all documents in collection
app.get('/api/all', async function (req, res) {
   try{
   
        const client=await MongoClient.connect(url);
        const dbo=client.db(dbName);
        const query={};
        const result=await dbo.collection(collectionName).find(query).toArray();
        if(result.length>0){           
            res.status(200).send(result);
        }else{           
            res.status(200).send("The collection is empty");
        }
        client.close();
    }catch(e){
        res.status(500).json({error:'something went wrong'});
    }
    
});

// GET method route
// Query by a certain field(s)
app.get('/api/get/:gender', async function (req, res) {
  try{
        const client=await MongoClient.connect(url);
        const dbo=client.db(dbName);       
        
        const gender =req.params.gender;
       
        const result=await dbo.collection(collectionName).find(gender).toArray();
        console.log(result);        

        if(result.length>0){            
            res.status(200).send(result);
        }else{            
            res.status(200).send("The collection is empty");
        }
        client.close();
    }catch(e){
        res.status(500).json({error:'something went wrong'});
    }
    
});

/* PUT method. Modifying the message based on certain field(s). 
If not found, create a new document in the database. (201 Created)
If found, message, date and offset is modified (200 OK) */
// ...
app.put('/api/put/:email', async function (req, res) {
    try{
        const client=await MongoClient.connect(url);
        const dbo=client.db(dbName);
           
        const emailUser=req.params.email;
        console.log('emailUser: '+emailUser);
        console.log('body: '+req.body.data);

        const result =await dbo.collection(collectionName).replaceOne({email:emailUser}, req.body);
       
        if(result.length>0){      
            res.json({updadeCount: result.modifiedCount});      
            res.status(200).send("Document updated");
        }else{           
            res.status(201).send("Document created");
        }
        client.close();
    }catch(e){
        res.status(500).json({error:'something went wrong'});
    }
    
});

/* DELETE method. Modifying the message based on certain field(s).
If not found, do nothing. (204 No Content)
If found, document deleted (200 OK) */
// ...

app.delete('/api/delete/:email', async function (req, res) {

    const client=await MongoClient.connect(url);
    const dbo=client.db(dbName);
    
    const emailUser=req.params.email;
    console.log('emailUser: '+emailUser);
    const result=await dbo.collection(collectionName).deleteMany({email:emailUser});
    console.log('result: '+result.deletedCount);
    
    if(result.length>0){     
        res.json({updadeCount: result.deletedCount});        
        res.status(200).send("Document deleted");
    }else{
        res.status(204).send("No content");
    }
    client.close();

});

app.listen(port, hostname);
console.log(`Running on http://${hostname}:${port}`);

