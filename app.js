const express = require('express'),
      app = express(),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      passport = require('passport'),
      session = require('express-session'),
      LocalStrategy = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose');

// CONNECT TO DB
mongoose.connect('mongodb://dbuser:dbuser@ds117719.mlab.com:17719/cms-prospera-example');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

const locationSchema = new mongoose.Schema({
  name: String,
  address: String,
  state: String,
  zip: String,
  city: String,
  phone: String,
  image: String,
  info: String
});

const Location = mongoose.model('Location', locationSchema);

// Location.create({
//   name: 'Mongoose Mansion',
//   city: 'Omaha',
//   phone: '402-222-2222',
//   image: 'https://images.pexels.com/photos/735301/pexels-photo-735301.jpeg?h=350&auto=compress&cs=tinysrgb',
//   info: 'Much good. So wow. Yay mansion'
// })

const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

UserSchema.plugin(passportLocalMongoose); // allows for user authentication
var User = mongoose.model('User', UserSchema); // create new user model based of the UserSchema

// run express-session
app.use(session({
  secret: "nobodyShouldKnowThis", // used to encode and decode a session
  resave: false, // required for a session
  saveUninitialized: false // required for a session
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // encrypt session data
passport.deserializeUser(User.deserializeUser()); // unencrypt session data

/* =================================================
                        ROUTES
=================================================  */
// ROOT ROUTE
app.get('/', function(req, res){
  res.redirect('dashboard');
});

// SHOW DASHBARD WITH LOCATIONS
app.get('/dashboard', function(req, res){
  Location.find({}, function(err, locations){
    if(err){
      console.log(err);
      res.redirect('back');
    } else{
      res.render('dashboard', {locations: locations});
    }
  });
});

// ALL LOCATIONS
app.get('/dashboard/locations', function(req, res){
  Location.find({}, function(err, locations){
    if(err){
      console.log(err);
      res.redirect('back');
    } else{
      res.render('locations', {locations: locations});
    }
  });
});

// NEW LOCATION SHOW FORM
app.get('/dashboard/locations/new', function(req, res){
    res.render('new');
});

// CREATE A LOCATION ROUTE
app.post('/dashboard', function(req, res){
  Location.create(req.body.location, function(err, newLocation){
    if(err){
      res.redirect('back');
    } else{
      res.redirect('/dashboard');
    }
  });
});

app.get('/dashboard/new-user', function(req, res){
  res.render('new-user');
});

app.post('/dashboard/new-user', function(req, res){
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.redirect('back');
    } else{
      passport.authenticate('local')(req, res, function(){
        res.render('new-user', {user: user});
      });
    }
  });
});

// SHOW A SINGLE LOCATION
app.get('/dashboard/locations/:id', function(req, res){
  Location.findById(req.params.id, function(err, foundLocation){
    if(err){
      console.log(err);
      res.redirect('back');
    } else{
      res.render('show', {location: foundLocation});
    }
  });
});

// EDIT ROUTE
app.get('/dashboard/locations/:id/edit', function(req, res){
  Location.findById(req.params.id, function(err, foundLocation){
    if(err){
      console.log(err);
      res.redirect('back');
    } else{
      res.render('edit', {location: foundLocation});
    }
  })
});

// UPDATE A SINGLE LOCATION
app.put('/dashboard/locations/:id', function(req, res){
  Location.findByIdAndUpdate(req.params.id, req.body.location, function(err, updatedLocation){
    if(err){
      console.log(err);
      res.redirect('back');
    } else{
      res.redirect('/dashboard/locations/' + req.params.id);
    }
  });
});

// DELETE A SINGLE LOCATION
app.delete('/dashboard/locations/:id', function(req, res){
  Location.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
      res.redirect('dashboard/locations');
    } else{
      res.redirect('/');
    }
  });
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', passport.authenticate('local',
  {
    successRedirect: '/secret',
    failureRedirect: '/login'
  }
));


// secret route you can only get to if you're logged in
app.get('/secret', isLoggedIn, function(req, res){
  User.find({}, function(err, users){
    if(err){
      console.log(err);
      res.redirect('back');
    } else{
      res.render('secret', {users: users});
    }
  });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/dashboard');
})

// ISLOGGED IN MIDDLEWARE
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

app.listen(3000, process.env.IP, function(){
  console.log('SERVER IS RUNNING');
});
