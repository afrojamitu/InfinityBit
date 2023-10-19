const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

// Middleware for parsing URL-encoded data and serving static files from the 'public' directory
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Middleware for parsing cookies and managing sessions
app.use(cookieParser());
app.use(session({
  secret: '35bc1bce2bffb74cc107d211933841e656d7837a284ba82b6dc5166dad38661e2ef3473282ad219acf69c3df77d64feb898452c000b4ffbbd3a41bdc1aefa650',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 3600000 // Maximum age of the session cookie in milliseconds (1 hour in this case)
  }
}));

// Route for handling POST requests to '/login'
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // demo valid email and password for login 
  const validUsername = 'demo@infinitybit.io';
  const validPassword = '#Password123';

  if (email === validUsername && password === validPassword) {
    req.session.isLoggedIn = true;
    req.session.userEmail = email;
    req.session.save();

    res.redirect('/main'); // Redirect the user to the '/main' page after successful login
  } else {
    res.send('Invalid email or password. Please try again.');
  }
});

// Route for serving the '/main' page to authenticated users
app.get('/main', (req, res) => {
  res.sendFile(__dirname + '/public/main.html');
});


app.get('/main', (req, res) => {
  const isLoggedIn = req.session.isLoggedIn; // Check if the user is logged in

  // Send the 'main.html' file along with the 'isLoggedIn' flag to the client
  res.sendFile(path.join(__dirname, '/public/main.html'), { isLoggedIn: isLoggedIn });
});

// Route for checking the login status of the user
app.get('/login-status', (req, res) => {
  const isLoggedIn = req.session.isLoggedIn || false; // Check if the user is logged in (default to false if not logged in)
  res.json({ isLoggedIn: isLoggedIn });
});

// Route for handling user logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err); // Log error if session destruction fails
    } else {
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.redirect('/login.html');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
