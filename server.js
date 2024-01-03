const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const notes = require('./public/assets/db/notes.json');
console.log("NOTES HERE: ", notes)

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
  console.info(`${req.method} request received to see current notes`);
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a new note`);
  //Initializations for New Note
  let newNote = req.body;
  newNote.id = (new Date()).valueOf();
  console.log("Note: ", newNote);

  let notesArr = notes;
  if (typeof notesArr == null) {
    notesArr = [];
  }
  notesArr.push(newNote)
  let notesJSON = JSON.stringify(notesArr);
  fs.writeFile(`./public/assets/db/notes.json`, notesJSON, (err) =>
    err
      ? console.error(err)
      : console.log(
        `Note has been written to JSON file`
      ))
  res.json(notesArr)
});

app.delete('/api/notes/:id', (req, res) => {
  const reqID = req.params.id;
  console.log("REQ ID: ", reqID);
  let notesArr = notes;
  for (let i = 0; i < notes.length; i++) {
    if (reqID == notes[i].id) {
      console.log("match found")
      notesArr = notesArr.splice(i, 1);
      let notesJSON = JSON.stringify(notesArr)
      fs.writeFile(`./public/assets/db/notes.json`, notesJSON, (err) =>
        err
          ? console.error(err)
          : console.log(
            `Note has been written to JSON file`
          ))
      return res.json(notesArr)
    }
  }
  console.log("no match found");
  return res.json("no match found")
})



app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
