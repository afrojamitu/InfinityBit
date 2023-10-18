const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(cookieParser());
app.use(session({
  secret: '35bc1bce2bffb74cc107d211933841e656d7837a284ba82b6dc5166dad38661e2ef3473282ad219acf69c3df77d64feb898452c000b4ffbbd3a41bdc1aefa650',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    maxAge: 0
   }
}));

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const validUsername = 'demo@infinitybit.io';
  const validPassword = '#Password123';

  if (email === validUsername && password === validPassword) {
    res.redirect('/main');
  } else {
    res.send('Invalid email or password. Please try again.');
  }
});

app.get('/main', (req, res) => {
  res.sendFile(__dirname + '/public/main.html');
});

app.post('/login', (req, res) => {
  console.log('Received login request:', req.body);

  const { email, password } = req.body;

  const validEmail = 'demo@infinitybit.io';
  const validPassword = '#Password123';

  if (email === validEmail && password === validPassword) {
    req.session.isLoggedIn = true;
    req.session.userEmail = email;
    req.session.save();

    res.redirect('/main');
  } else {
    res.send('Invalid email or password. Please try again.');
  }
});

app.get('/main', (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  res.sendFile(path.join(__dirname, '/public/main.html'), { isLoggedIn: isLoggedIn });
});

app.get('/login-status', (req, res) => {
  const isLoggedIn = req.session.isLoggedIn || true;
  res.json({ isLoggedIn: isLoggedIn });
});


app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
    } else {
      res.clearCookie('connect.sid'); 
      res.redirect('/login.html');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
