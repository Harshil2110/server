const express = require('express');
var cors = require('cors');
const app = express();
const port = 3000;

// These lines will be explained in detail later in the unit
app.use(express.json());// process json
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
// These lines will be explained in detail later in the unit

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://harshil2110:harshil2110@version2.hyn8g.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// Global for general use
var userCollection;
var orderCollection;

client.connect(err => {
   userCollection = client.db("giftdelivery").collection("users");
   orderCollection = client.db("giftdelivery").collection("orders");
   
  // perform actions on the collection object
  console.log ('Database up!\n')
 
});


app.get('/', (req, res) => {
  res.send('<h3>Welcome to Gift Delivery server app!</h3>')
})

 
app.get('/getUserDataTest', (req, res) => {

	console.log("GET request received\n"); 

	userCollection.find({}, {projection:{_id:0}}).toArray( function(err, docs) {
		if(err) {
			console.log("Some error.. " + err + "\n");
			res.send(err); 
		} else {
			console.log( JSON.stringify(docs) + " have been retrieved.\n");
			res.status(200).send("<h1>" + JSON.stringify(docs) + "</h1>"); 
		}

	});

});


app.get('/getOrderDataTest', (req, res) => {

	console.log("GET request received\n"); 

	orderCollection.find({},{projection:{_id:0}}).toArray( function(err, docs) {
		if(err) {
		  	console.log("Some error.. " + err + "\n");
			res.send(err); 
		} else {
			console.log( JSON.stringify(docs) + " have been retrieved.\n");
			res.status(200).send("<h1>" + JSON.stringify(docs) + "</h1>"); 
		}

	});

});


app.post('/verifyUser', (req, res) => {

	console.log("POST request received : " + JSON.stringify(req.body) + "\n"); 

	loginData = req.body;

	userCollection.find({email:loginData.email, password:loginData.password}, {projection:{_id:0}}).toArray( function(err, docs) {
		if(err) {
		  	console.log("Some error.. " + err + "\n");
			res.send(err);
		} else {
		    console.log(JSON.stringify(docs) + " have been retrieved.\n");
		   	res.status(200).send(docs);
		}	   
		
	  });

});


app.post('/postOrderData', function (req, res) {
    
    console.log("POST request received : " + JSON.stringify(req.body) + "\n"); 
    
    orderCollection.insertOne(req.body, function(err, result) {
		if (err) {
			console.log("Some error.. " + err + "\n");
			res.send(err);
		}else {
			console.log("Order record with ID "+ result.insertedId + " have been inserted\n"); 
			res.status(200).send(result);
		}
		
	});
       
});

app.post('/signup', (req, res) => {
    console.log("POST request received for sign-up: " + JSON.stringify(req.body));

    const newUser = req.body; 

    userCollection.insertOne(newUser, function (err, result) {
        if (err) {
            console.log("Error inserting new user: " + err);
            res.send(err);
        } else {
            console.log("New user added with ID " + result.insertedId);
            res.status(200).send('<h3>User successfully registered!</h3>'); 
        }
    });
});

app.post('/getUserOrders', (req, res) => {
    console.log("POST request received to get user orders: " + JSON.stringify(req.body));

    const userEmail = req.body.email; 

    orderCollection.find({ customerEmail: userEmail }, { projection: { _id: 0 } }).toArray(function (err, orders) {
        if (err) {
            console.log("Error retrieving user orders: " + err);
            res.send(err);
        } else {
            console.log(orders.length + " orders found for user " + userEmail);
            res.status(200).send(orders);
        }
    });
});

app.post('/getUserOrdersForDeletion', (req, res) => {
    console.log("POST request received to get user orders for deletion: " + JSON.stringify(req.body));

    const userEmail = req.body.email; 

    orderCollection.find({ customerEmail: userEmail }, { projection: { _id: 0 } }).toArray(function (err, orders) {
        if (err) {
            console.log("Error retrieving user orders for deletion: " + err);
            res.send(err);
        } else {
            console.log(orders.length + " orders found for deletion for user " + userEmail);
            res.status(200).send(orders); 
        }
    });
});

app.delete('/deleteOrders', (req, res) => {
    console.log("DELETE request received to delete orders: " + JSON.stringify(req.body));

    const orderIds = req.body.orderIds; 

    orderCollection.deleteMany({ orderNo: { $in: orderIds } }, function (err, result) {
        if (err) {
            console.log("Error deleting orders: " + err);
            res.status(500).send(err);
        } else {
            console.log(result.deletedCount + " orders deleted");
            res.status(200).send({ deletedCount: result.deletedCount }); 
        }
    });
});

app.listen(port, () => {
  console.log(`Gift Delivery server app listening at http://localhost:${port}`) 
});
