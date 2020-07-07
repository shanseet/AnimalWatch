const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// look for ejs files
app.set("view engine", "ejs");
// for stylesheets
app.use(express.static("public"));
// parse req bodies
app.use(bodyParser.urlencoded({ extended: true }));


// connect mongoose
mongoose.connect('mongodb://localhost/animal_watch', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

// Define schema
const animalSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

let Animal = mongoose.model("Animal", animalSchema)

// Routes
app.get("/", (req, res) => {
    res.render('landing');
})

// RESTful routing: an architecture to map HTTP routes to CRUD functionality (7 routes)
// (CRUD: Create Read Update Destroy)
// INDEX (get)   /x       display list of all items
// CREATE (post) /x       post route for creating item
// NEW (get)     /x/new   display form for creating item
// SHOW (get)    /x/:id   shows info about 1 item   

app.get("/animals", (req, res) => {
    Animal.find({}, (err, animals) => {
        if (!err) {
            res.render('animals', { animals: animals })
        }
    })
})

app.post("/animals", (req, res) => {
    let { name, url, description } = req.body;
    Animal.create({ name: name, image: url, description: description }, (err, animal) => {
        if (!err) {
            console.log("New animal added!!");
            console.log(animal);
            res.redirect("/animals");
        }
    })
})

app.get("/animals/new", (req, res) => {
    res.render("new");
})

app.get("/animals/:id", (req, res) => {
    let id = req.params.id;
    Animal.findById(id, (err, animal) => {
        if (err) {
            res.send("error matching route id")
        } else {
            let animalToShow = animal;
            res.render("show", { animal: animalToShow });
        }
    });
})

app.get("*", (req, res) => {
    res.redirect('/');
})

app.listen(3000, () => console.log("AnimalWatch Server started!!"));