const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const PORT = process.env.PORT || 3001;
//const noteData = require('./db/notes.json');
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

app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received to get notes`);
  fs.readFile(`./public/assets/db/notes.json`, (err) =>
    err
      ? console.error(err)
      : console.log(
        `Notes HERE`
      )).then(notes => {
        console.log(notes)
        if (typeof notes == null) {
          notes = [];
        }
        //json parse new object onto existing
        let notesArr = JSON.parse(notes);
        //pushing new review to array
        console.log("HERE", notesArr);
        res.json(notesArr);
      })
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a new note`);
  console.log("Note: ", req.body);
  fs.readFile(`./public/assets/db/notes.json`, (err) =>
    err
      ? console.error(err)
      : console.log(
        `Notes HERE`
      )).then(notes => {
        console.log(notes)
        if (typeof notes == null) {
          notes = [];
        }
        //json parse new object onto existing
        let notesArr = JSON.parse(notes);
        //pushing new review to array
        console.log("HERE", notesArr);
        notesArr.push(req.body);
        let notesJSON = JSON.stringify(notesArr)
        fs.writeFile(`./public/assets/db/notes.json`, notesJSON, (err) =>
          err
            ? console.error(err)
            : console.log(
              `Note has been written to JSON file`
            ))
        res.json(notesArr);
      })
});
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
