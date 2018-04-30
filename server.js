// server.js

// require express framework and additional modules
var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose');
var User = require('./models/user')
var PirateShip = require('./models/pirate-ship')
var session = require('express-session')

// middleware
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	saveUnitialized : true,
	resave:true,
	secret:'SuperSecretCookie',
	cookie:{maxAge:30*60*1000}
}));
mongoose.connect('mongodb://localhost/simple-login');


// signup route with placeholder response
app.get('/signup', function (req, res) {
  //render takes a relative path to whatever directory we designated as having all the view files.
  res.render('signup');
});


//going to get the data from the signup form, hash it, and store in the database
app.post("/signup", function(req, res){
	User.createSecure(req.body.email, req.body.password, function(err, newUserDocument){
		res.redirect("/profile")
	})
});

app.post("/sessions", function(req, res){
	User.authenticate(req.body.email, req.body.password, function(err, existingUserDocument){
		if (err) console.log("error is " + err)
		req.session.userId = existingUserDocument.id
		res.redirect("/profile")
	})
})

app.get("/profile", function(req, res){
	if (!req.session || !req.session.userId){
		res.redirect('/login')
		return
	}
	User.findOne({_id : req.session.userId}, function(err, userDocument){
		res.render('profile', {user : userDocument})
	})
})

app.post('/new-ship', function(req, res){
	User.findOne({_id : req.session.userId}, function(err, userDocument){
		var newShip = new PirateShip({
			name: req.body.shipName,
			crewSize: req.body.shipSize
		})

		if (userDocument.pirateShips){
			userDocument.pirateShips.push(newShip)
		} else {
			userDocument.pirateShips = [newShip]
		}
		userDocument.save(function(err, updatedDocument){
			res.redirect('/profile')
		})
	})
})

// login route with placeholder response
app.get('/login', function (req, res) {
  res.render('login');
});

// listen on port 3000
app.listen(3000, function () {
  console.log('server started on locahost:3000');
});