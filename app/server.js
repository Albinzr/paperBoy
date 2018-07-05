// express default 
const express = require("express");  
const cors = require("cors");  
const morgan = require("morgan");  
const compression = require("compression");  
const fs = require("fs");  
// var https = require("https");  
const https = require("http");  
const helmet = require("helmet");  
// NOTE - Database
const mongoose = require('mongoose')
const database = require('../config/dbConfig')
const bodyParser = require('body-parser')


mongoose.Promise = global.Promise;
mongoose.connect(database.feedDB,{autoIndex: false});
const db = mongoose.connection;

db.on("error", () => {
	throw new Error(`unable to connect to database at ${database.feedDB}`);
});

const config = require('../config/dbConfig')
const app = express();
const publisherController = require('./controller/publisherController')
const feedUpdateController = require('./controller/feedUpdateController')
const feedController = require('./controller/feedController')

app.use(morgan("common"));  
app.use(helmet());  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({  
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(compression());

app.get("/", function(req, res) {  
    res.json({
        status: "My API is alive!"
    });
});

//publishers
app.get("/publisher", publisherController.read);
app.post('/publisher/new',publisherController.create)
// updater
app.get('/updateChecker',feedUpdateController.update)
// feed
app.get('/feed',feedController.read)

// const credentials = {  
//     key: fs.readFileSync("my-api.key", "utf8"),
//     cert: fs.readFileSync("my-api.cert", "utf8")
// };

const credentials = null

https  
    .createServer(credentials, app)
    .listen(3000, function() {
        console.log("Server listen to localhost 3000");
    });

module.exports = app;