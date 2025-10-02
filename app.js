
import express from "express";
import dotenv from "dotenv";
import * as utils from "./utils/utils.js";
dotenv.config();
let data =["Project 1", "Project 2", "Project 3"];

const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.render("index.ejs");
});

app.get("/home", (_req, res) => {
  res.render("index.ejs");
});

app.get("/featured-project", (_req, res) => {
  res.render("featuredProject.ejs");
});

app.get("/gallery", (_req, res) =>
    res.render("gallery.ejs")
);

app.get("/contact", (_req, res) =>
    res.render("contact.ejs")
);

app.get('/Projects', (_req, res) =>
    res.render('projects.ejs', { projectArray: data })
);

app.get("/project/:id", (req, res) => {
  let id = req.params.id;
  if(id > data.length) {
    throw new Error("No project with that ID");
  }
  res.render("project.ejs", {projectArray: data, which: id});
});

app.post("/mail", async (req, res) => {
  await utils
      .sendMessage(req.body.sub, req.body.txt)
      .then(() => {
        res.send({result: "success"});
      })
      .catch((_error) => {
        res.send({result: "failure"});
      });
});

// Error handling middleware
// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  console.error('Error message:', err.message);
  res.status(500).send('Something went wrong!');
});

// 404 handler
app.use((req, res) => {
  console.log('404 - Page not found:', req.url);
  res.status(404).send('Page not found');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
