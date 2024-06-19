const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      bcrypt.compare(password, results[0].password, (err, match) => {
        if (err) throw err;
        if (match) {
          req.session.loggedin = true;
          req.session.username = username;
          res.redirect('/home');
        } else {
          res.sendFile(path.join(__dirname,  'views', 'alert', 'alert3.html'));
        }
      });
    } else {
      res.sendFile(path.join(__dirname, 'views','alert', 'alert3.html'));
    }
  });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  
  // Cek apakah username sudah ada
  db.query('SELECT username FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error checking for duplicate username:', err);
      res.status(500).send('Server error');
      return;
    }
    
    if (results.length > 0) {
      res.status(409).sendFile(path.join(__dirname,'views', 'alert', 'alert1.html'));
      return;
    }
    
    // Jika username tidak ada, lanjutkan dengan proses registrasi
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        res.status(500).send('Server error');
        return;
      }
      
      db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err, results) => {
        if (err) {
          console.error('Error inserting user:', err);
          res.status(500).send('Server error');
          return;
        }
        res.sendFile(path.join(__dirname, 'views','alert', 'alert2.html'));
      });
    });
  });
});

app.get('/blog', (req, res) => {
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname, 'views', 'blog.html'));
  } else {
    res.sendFile(path.join(__dirname, 'views','alert', 'alert4.html'));
  }
});

app.get('/home', (req, res) => {
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
  } else {
    res.sendFile(path.join(__dirname, 'views','alert', 'alert4.html'));
  }
});

app.get('/shop', (req, res) => {
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname, 'views', 'shop.html'));
  } else {
    res.sendFile(path.join(__dirname, 'views','alert', 'alert4.html'));
  }
});


app.get('/about-us', (req, res) => {
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname, 'views', 'about-us.html'));
  } else {
    res.sendFile(path.join(__dirname, 'views','alert', 'alert4.html'));
  }
});

app.get('/kualitas-terbaik-page', (req, res) => {
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname, 'views', 'kualitas-terbaik-page.html'));
  } else {
    res.sendFile(path.join(__dirname, 'views','alert', 'alert4.html'));
  }
});

app.get('/pengolahan-terbaik-page', (req, res) => {
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname, 'views', 'pengolahan-terbaik-page.html'));
  } else {
    res.sendFile(path.join(__dirname, 'views','alert', 'alert4.html'));
  }
});

app.get('/produk-terbaik-page', (req, res) => {
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname, 'views', 'produk-terbaik-page.html'));
  } else {
    res.sendFile(path.join(__dirname, 'views','alert', 'alert4.html'));
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('Error logging out');
    }
    res.redirect('/');
  });
});


// Endpoint untuk mengambil data produk
app.get('/products', (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
