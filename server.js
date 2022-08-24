const express = require("express");
const path = require("path");
const fs = require("fs");
const exp = require("constants");
const uuid = require("./public/utils/uuid");
const noteData = require('./db/db.json');

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
  
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  res.json(noteData);
});

app.post("/api/notes", (req,res) => {
    const {title, text} = req.body;
    if(title && text){
    const newNote = {
        title,
        text, 
        id: uuid(),
    };

    fs.readFile(path.join(__dirname, "/db/db.json"), (err,data) => {
        if(err){
            console.log(err);
        }
        else {
            noteData.push(newNote);
            fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(noteData, null,4),(err) => 
            err 
            ? console.error(err)
            : console.log(`Note ${newNote.title} has been saved`)
            );
        }
    });

    const response = {
        status: "success",
        body: newNote,
    };

    console.log(response);
    res.json(response);
}
else {
    res.json("Error in saving note");
}
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () =>
  console.log(`App listening http://localhost:${PORT} 🚀`)
);
