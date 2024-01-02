const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3001;
const noteData = require('./db/notes.json');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('/api/notes', (req, res) =>
  console.info(`${req.method} request received to get notes`)
);

app.post('/api/notes', (req, res) =>
  console.ingo(`${req.method} request received to add a new note`);
  console.log("Note: ", req.body);
);
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
