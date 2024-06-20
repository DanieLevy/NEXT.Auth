const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const usersFilePath = path.join(__dirname, 'users.json');

// Function to read users from the JSON file
const readUsersFromFile = () => {
  if (!fs.existsSync(usersFilePath)) {
    return [];
  }
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(data);
};

// Function to write users to the JSON file
const writeUsersToFile = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
};

let users = readUsersFromFile();

const generateToken = (user) => {
  return jwt.sign({ username: user.username, name: user.name }, 'secret', { expiresIn: '1h' });
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());

  server.post('/api/signup', async (req, res) => {
    const { username, password, email, name } = req.body;
    const existingUserByUsername = users.find((u) => u.username === username);
    const existingUserByEmail = users.find((u) => u.email === email);
    if (existingUserByUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Email already taken' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { username, password: hashedPassword, email, name };
    users.push(user);
    writeUsersToFile(users);
    const token = generateToken(user);
    res.json({ token });
  });

  server.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Username or password is incorrect' });
    }
    const token = generateToken(user);
    res.json({ token });
  });

  server.post('/api/checkUser', (req, res) => {
    const { email, name, image } = req.body;
    const user = users.find((u) => u.email === email);

    if (user) {
      // if user has no image, update the image
      if (!user.image) {
        user.image = image;
        writeUsersToFile(users);
      }
      const token = generateToken(user);
      res.json({ exists: true, token });
    } else {
      // Create a new user with the provided user credentials
      const newUser = { email, name, image };
      users.push(newUser);
      writeUsersToFile(users);
      const token = generateToken(newUser);
      res.json({ exists: false, token });

    }
  });

  server.get('/api/me', verifyToken, (req, res) => {
    const user = users.find((u) => u.username === req.user.username);
    res.json({ user });
  });

  server.get('/api/status', (req, res) => {
    res.json({ status: 'Server is running!' });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
    console.log('> Server is running!');
    console.log('> Press Ctrl+C to stop');
    console.log('> Users:', users);
  }
  );
});
