import express from "express";
import dotenv from "dotenv";
import * as utils from "./utils/utils.js";
dotenv.config();


const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));
// app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render("index.ejs");
});

app.get("/project", (req, res) =>
  res.render("project.ejs")
);
app.get("/gallery", (req, res) =>
  res.render("gallery.ejs")
);
app.get("/contact", (req, res) =>
  res.render("contact.ejs")
)
app.post("/mail", async (req, res) => {
  await utils
  .sendMessage(req.body.sub, req.body.txt)
  .then(() => {
    res.send({result: "success"});
  })
  .catch((error) => {
    res.send({result: "failure"});
  });
  // console.log("mail button clicked");
  
});

app.listen(port, () => {

console.log(`Server running on http://localhost:${port}`);
});

