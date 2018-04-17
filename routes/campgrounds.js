const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware/');

// INDEX
router.get('/', function(req, res) {
    Campground.find({},
        function(err, campgrounds) {
            if (err) {
                console.log(err);
            } else {
                res.render('campgrounds/index', {campgrounds: campgrounds});
            }
        }
    );
});

// NEW
router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('campgrounds/new')
});

// CREATE
router.post('/', middleware.isLoggedIn, function(req, res) {
    let name = req.body.name;
    let price = req.body.price;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = { 
        name: name,
        price: price,
        image: image,
        description: desc,
        author: author
    };
    
    Campground.create(
        newCampground,
        function(err, newlyCreated) {
            if (err) {
                console.log(err);
            } else {
                console.log(newlyCreated);
                res.redirect('/campgrounds');
            }
        }
    );
});

// SHOW
router.get('/:id', function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

// EDIT
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

// UPDATE
router.put('/:id', (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground,
        (err, updatedCampground) => {
            if (err) {
                res.redirect('/campgrounds');
            } else {
                res.redirect(`/campgrounds/${req.params.id}`);
            }
        });
});

// DESTROY
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, err => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            req.flash('success', 'Campground deleted');
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;