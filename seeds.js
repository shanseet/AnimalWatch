const mongoose  = require("mongoose"),
    Animal      = require("./models/animal"),
    Comment     = require("./models/comment");

let data = [
    {
        name: "Raccoon",
        image: "https://images.unsplash.com/photo-1497752531616-c3afd9760a11?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80",
        description: "Raccoons are active-at-night, or nocturnal, mammals that live throughout much of the world, from North and South America to Asia, in wooded areas and big cities alike."
    },
    {
        name: "Koala",
        image: "https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60",
        description: "Koalas are marsupials, related to kangaroos."
    },
    {
        name: "Green Sea Turtle",
        image: "https://www.nwf.org/-/media/NEW-WEBSITE/Shared-Folder/Wildlife/Reptiles/reptile_green-sea-turtle_600x300.ashx",
        description: "Green sea turtles are the world’s largest species of hard-shelled sea turtle."
    },
    {
        name: "Tiger",
        image: "https://images.unsplash.com/photo-1503066211613-c17ebc9daef0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60",
        description: "Easily recognized by its coat of reddish-orange with dark stripes, the tiger is the largest wild cat in the world. The big cat's tail is three feet long. On average the big cat weighs 450 pounds, about the same as eight ten-year-old kids."
    }
]

function seedDB() {
    //Remove all campgrounds
    Animal.deleteMany({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("removed animals!");
            // remove all comments
            // Comment.remove({}, function (err) {
            //     if (err) {
            //         console.log(err);
            //     }
            //     console.log("removed comments!");
            // });


            //add a few campgrounds
            data.forEach(function (seed) {
                Animal.create(seed, function (err, animal) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("added an animal");
                        //create a comment for each animal
                        Comment.create(
                            {
                                text: "Yes!! My all time favourite animal!",
                                author: "Enthusiast"
                            }, function (err, comment) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    animal.comments.push(comment);
                                    animal.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;