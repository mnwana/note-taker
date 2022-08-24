const express = require("express");
const path = require("path");
const fs = require("fs");
const exp = require("constants");
const uuid = require("./public/utils/uuid");
const noteData = require("./db/db.json");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// get route for homepage to load index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// get route for /notes to load notes.html
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// get route for /api/notes to return note data
app.get("/api/notes", (req, res) => {
  res.json(noteData);
});

// post route for /api/notes to add new note text and title to noteData
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  // if request body has note text and title, create a new note object with a randomly generated id
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };
    // add newNote to noteData array
    noteData.push(newNote);
    // write noteData array as string to notes json file
    fs.writeFile(
      path.join(__dirname, "/db/db.json"),
      JSON.stringify(noteData, null, 4),
      (err) =>
        // log response
        err
          ? console.error(err)
          : console.log(`Note ${newNote.title} has been saved`)
    );
    // create success response
    const response = {
      status: "success",
      body: newNote,
    };
    // log success response
    console.log(response);
    res.json(response);
  }
  // log note save error if error
  else {
    res.json("Error in saving note");
  }
});

// get route for default to load index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () =>
  console.log(`App listening http://localhost:${PORT} 🚀`)
);
