const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = 3000;

// Supabase client setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware setup
app.use(cors({ origin: 'http://13.209.41.253:5173/', credentials: true }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
    sameSite: 'None',
  },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy setup
passport.use(new LocalStrategy(async (email, password, done) => {
  try {
    // Search for user in Supabase using email
    const { data, error } = await supabase.from('users').select().eq('email', email).single();
    if (error) {
      return done(error);
    }
    if (!data) {
      return done(null, false, { message: 'Incorrect email.' });
    }
    if (data.password !== password) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, data);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id); // Save user ID to session
});

passport.deserializeUser(async (id, done) => {
  try {
    // Retrieve user from Supabase using ID
    const { data, error } = await supabase.from('users').select().eq('id', id).single();
    if (error) {
      return done(error);
    }
    done(null, data);
  } catch (error) {
    done(error);
  }
});

// Register route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Insert user into Supabase
    const { data, error } = await supabase.from('users').insert([{ email, password }]);
    if (error) {
      return res.status(400).send(error.message);
    }
    res.send('User registered');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Login route
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.send('Logged in');
});

// Logout route
app.post('/logout', (req, res) => {
  req.logout();
  res.send('Logged out');
});

// Current logged-in user route
app.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.status(401).send('Not authenticated');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
