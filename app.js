import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from 'cors';
import * as utils from "./utils/utils.js";
import * as db from "./utils/database.js";

(async () => {
  const app = express();
  app.use(cors());
  const port = process.env.PORT || 3000;
  app.set("view engine", "ejs");
  app.use(express.json());
  app.use(express.static("public"));

  let data;
  try {
      await db.connect();
      data = await db.getAllProjects();
      console.log('Database connected successfully, loaded', data.length, 'projects');
  } catch (error) {
      console.error('Database connection failed:', error.message);
      console.log('Falling back to demo data...');
          data = [
            { id: 1, project_name: "Featured Project", img_url: process.env.AURORA_IMG_URL, project_description: "Featured Project", quantity: 100, price_eth: 0.1 },
            { id: 2, project_name: "Upcoming Project", img_url: process.env.FLARES_IMG_URL, project_description: "Upcoming Project", quantity: 100, price_eth: 0.1 },
            { id: 3, project_name: "Upcoming Project", img_url: process.env.SOLARWINDS_IMG_URL, project_description: "Upcoming Project", quantity: 100, price_eth: 0.1 }
          ];
  }

  // Artwork gallery detail pages
  app.get("/artwork/visual-art", (_req, res) => {
    res.render("artwork_visual_art.ejs");
  });
  app.get("/artwork/tech-art", (_req, res) => {
    res.render("artwork_tech_art.ejs");
  });
  app.get("/artwork/sun-burst", (_req, res) => {
    res.render("artwork_sun_burst.ejs");
  });
  app.get("/artwork/soundwave", (_req, res) => {
    res.render("artwork_soundwave.ejs");
  });

  app.get("/", (_req, res) => {
    res.render("index.ejs", {
      sunburstImg: "/images/sunBurst.png",
      techImg: "/images/TECH.png",
      visualArtImg: "/images/VISUAL_ART.png"
    });
  });

  app.get("/home", (_req, res) => {
    res.render("index.ejs", {
      sunburstImg: "/images/sunBurst.png",
      techImg: "/images/TECH.png",
      visualArtImg: "/images/VISUAL_ART.png"
    });
  });

  app.get("/about", (_req, res) => {
    res.render("about.ejs");
  });

  app.get("/project", (_req, res) => {
    res.render("featuredProject.ejs");
  });

  app.get("/gallery", (_req, res) =>
    res.render("gallery.ejs")
  );

  // Gallery image detail data
  const galleryImages = [
    {
      id: 1,
      src: "/images/Native_African_ American.jpeg",
      title: "Native African American",
      desc: "A celebration of Native and African American heritage in digital form.",
      nft: "NFT Collection #001"
    },
    {
      id: 2,
      src: "/images/VisuaTech_ Diode.jpeg",
      title: "VisualTech Diode",
      desc: "Tech-inspired digital art with a futuristic diode motif.",
      nft: "NFT Collection #002"
    },
    {
      id: 3,
      src: "/images/BURST.jpeg",
      title: "BURST",
      desc: "An explosion of color and energy in digital form.",
      nft: "NFT Collection #003"
    },
    {
      id: 4,
      src: "/images/EtherMusic.jpeg",
      title: "EtherMusic",
      desc: "Music and ether merge in this surreal digital artwork.",
      nft: "NFT Collection #004"
    }
  ];

  app.get("/gallery/image/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const image = galleryImages.find(img => img.id === id);
    if (!image) {
      return res.status(404).render("errors/404.ejs");
    }
    res.render("imageDetail.ejs", { image });
  });

  app.get("/contact", (_req, res) =>
      res.render("contact.ejs")
  );

  // Demo routes
  app.get("/plasma-art", (_req, res) => {
    res.render("plasma-art.ejs");
  });

  app.get("/distortion", (_req, res) => {
    res.render("distortion.ejs");
  });

  app.get("/dj-ai-studio", (_req, res) => {
    res.render("dj-ai-studio.ejs");
  });

  app.get("/dj-sampler", (_req, res) => {
    res.render("dj-sampler.ejs");
  });

  app.get('/Projects', (_req, res) =>
      res.render('projects.ejs', { projectArray: data })
  );

  // Add lowercase route for better UX
  app.get('/projects', (_req, res) =>
      res.render('projects.ejs', { projectArray: data })
  );

  app.get("/Projects/:id", (req, res) => {
    let id = parseInt(req.params.id);
    if(isNaN(id) || id < 1 || id > data.length) {
      return res.status(404).render("errors/404.ejs");
    }
    if (id === 2) {
      return res.redirect('/distortion'); // Route Flares detail to Distortion page with video
    }
    if (id === 3) {
      return res.redirect('/dj-ai-studio'); // Route SolarWinds detail to DJ AI Studio page
    }
    res.render("project.ejs", {projectArray: data, which: id});
  });

  // Add lowercase route for individual projects
  app.get("/projects/:id", (req, res) => {
    let id = parseInt(req.params.id);
    if(isNaN(id) || id < 1 || id > data.length) {
      return res.status(404).render("errors/404.ejs");
    }
    if (id === 2) {
      return res.redirect('/distortion');
    }
    if (id === 3) {
      return res.redirect('/dj-ai-studio');
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
})();
