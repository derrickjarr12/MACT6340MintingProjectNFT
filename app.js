
import express from "express";
import dotenv from "dotenv";
import * as utils from "./utils/utils.js";
import * as db from "./utils/database.js";
dotenv.config();

// Connect to database on startup
await db.connect();

// Fetch projects from database
let data;
try {
  data = await db.getAllProjects();
  console.log(`✅ Loaded ${data.length} projects from MySQL database`);
  console.log("Project data:", JSON.stringify(data, null, 2));
} catch (error) {
  console.error("❌ Database connection failed:", error.message);
  console.log("Using fallback data...");
  data = ["Aurora", "Flares", "Solar winds"];
}

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

app.get("/project", (_req, res) => {
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

app.get("/Projects/:id", (req, res) => {
  let id = parseInt(req.params.id);
  const projectCount = Array.isArray(data) ? data.length : 0;
  
  if(isNaN(id) || id < 1 || id > projectCount) {
    return res.status(404).render("errors/404.ejs");
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
