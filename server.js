const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const notes = require('./public/assets/db/notes.json');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

// GET Route to notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

// GET handling for past notes
app.get('/api/notes', (req, res) => {
  res.json(notes);
});
// POST handling for new notes
app.post('/api/notes', (req, res) => {
  //Initializations for New Note
  let newNote = req.body;
  // note: id is unix timestamp of initialization
  newNote.id = (new Date()).valueOf();

  // Initializations for db call
  let notesArr = notes;
  if (typeof notesArr == null) {
    notesArr = [];
  }

  // Adds new note to notesArr and pushees it to the database
  notesArr.push(newNote)
  let notesJSON = JSON.stringify(notesArr);
  fs.writeFile(`./public/assets/db/notes.json`, notesJSON, (err) =>
    err
      ? console.error(err)
      : null
      )
  res.json(notesArr)
});

// DELETE Btn Handling
app.delete('/api/notes/:id', (req, res) => {
  const reqID = req.params.id;
  let notesArr = notes;
  for (let i = 0; i < notes.length; i++) {
    if (reqID == notes[i].id) {
      // Removes matching id from db
      notesArr = notesArr.splice(i, 1);
      let notesJSON = JSON.stringify(notesArr)
      fs.writeFile(`./public/assets/db/notes.json`, notesJSON, (err) =>
        err
          ? console.error(err):null
      )
      return res.json(notesArr)
    }
  }
  return res.json("no match found")
})



app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
