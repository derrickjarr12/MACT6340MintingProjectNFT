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




app. get("/", (_req, res) => {
  res.render("index.ejs");
});
app.get("/home", (_req, res) => {
  res.render("index.ejs")
});

app.get("/featured-project", (_req, res) =>
  res.render("featuredProject.ejs")
);
app.get("/gallery", (_req, res) =>
  res.render("gallery.ejs")
);
app.get("/contact", (_req, res) =>
  res.render("contact.ejs")
);

app.get("/projects", (_req, res) =>
  res.render("projects.ejs", { projectArray: data })
);
app.post("/mail", async (req, res) => {
  await utils
  .sendMessage(req.body.sub, req.body.txt)
  .then(() => {
    res.send({result: "success"});
  })
  .catch((_error) => {
    res.send({result: "failure"});
  });
  // console.log("mail button clicked");
  
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
