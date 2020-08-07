const { text } = require('express');

const express   = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Animal      = require("./models/animal"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds");

// look for ejs files
app.set("view engine", "ejs");

// for stylesheets
app.use(express.static(__dirname + "public"));
// dirname - refers to current dir, to be safe

// parse req bodies
app.use(bodyParser.urlencoded({ extended: true }));

// connect mongoose
mongoose.connect('mongodb://localhost/animal_watch', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

// seedDB();

// Routes
app.get("/", (req, res) => {
    res.render('landing');
})

// RESTful routing: an architecture to map HTTP routes to CRUD functionality (7 routes)
// (CRUD: Create Read Update Destroy)
// INDEX (get)   /x           display list of all items
// CREATE (post) /x           post route for creating item
// NEW (get)     /x/new       display form for creating item
// SHOW (get)    /x/:id       shows info about 1 item
// EDIT (get)    /x/:id/edit  update 1 item, and then redirect somewhere else
// UPDATE (put)  /x/:id       post route for editing item
// DESTROY       /x/:id       delete the item

app.get("/animals", (req, res) => {
    Animal.find({}, (err, animals) => {
        if (!err) {
            res.render('animals/index', { animals: animals })
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
    res.render("animals/new");
})

app.get("/animals/:id", (req, res) => {
    let id = req.params.id;
    Animal.findById(id).populate("comments").exec((err, animal) => {
        if (err) {
            res.send("error matching route id")
        } else {
            res.render("animals/show", { animal: animal });
        }
    });
})

app.get("/animals/:id/comments/new", (req, res) => {
    Animal.findById(req.params.id, (err, animal) => {
        if (!err) {
            res.render("comments/new", { animal: animal });
        }
    })
})

app.post("/animals/:id/comments", (req, res) => {
    Animal.findById(req.params.id, (err, animal) => {
        if (err) {
            console.log("error matching route id")
            res.redirect("/animals");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (!err) {
                    animal.comments.push(comment);
                    animal.save();
                    console.log("added new comment!")
                    res.redirect("/animals/" + req.params.id);
                }
            })
        }
    });
})

app.get("*", (req, res) => {
    res.redirect('/');
})

app.listen(3000, () => console.log("AnimalWatch Server started!!"));