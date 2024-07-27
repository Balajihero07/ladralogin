const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/Database', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', () => console.log("Error in connecting to database"));
db.once('open', () => console.log("Connected to database"));

app.post("/signup", (req, res) => {
    const names = req.body.names;
    const email = req.body.email;
    const password = req.body.password;

    const data = {
        "names": names,
        "email": email,
        "password": password
    };

    db.collection('users').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record inserted successfully");
        res.redirect('home.html');
    });
});

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.collection('users').findOne({ email: email, password: password }, (err, user) => {
        if (err) {
            throw err;
        }
        if (user) {
            res.redirect('home.html');
    
        }
    });
});

app.get("/", (req, res) => {
    res.set({ "Access-Control-Allow-Origin": '*' });
    res.redirect('index.html');
});

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
