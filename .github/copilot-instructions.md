# AI Coding Instructions for NFT Art Gallery Project

## Project Overview
Node.js/Express web application showcasing NFT art collections built with ES6 modules, EJS templating, and Bootstrap 5. Currently uses hard-coded data with MySQL infrastructure prepared but not yet integrated.

## Architecture & Data Flow

### Entry Point: `app.js`
- ES6 module syntax (`import`/`export`) throughout codebase
- Express server on port 3000 with middleware: `express.json()`, `express.static("public")`
- **Critical**: Project data currently hard-coded as `data =["Aurora", "Flares", "Solar winds"]` (line 6)
- Database utilities exist (`utils/database.js`) but are NOT imported/used yet

### Dual Data Strategy (Transition State)
This project is mid-migration from hard-coded to database-driven:
- **Current**: Array data passed as `projectArray` to templates
- **Prepared**: `utils/database.js` exports `connect()` and `getAllProjects()` for MySQL2/promise
- **Migration Path**: Replace array in `app.js` with `await getAllProjects()` when ready

### Route Architecture
```javascript
// Static pages (multiple routes → single template allowed)
GET / or /home → index.ejs
GET /project → featuredProject.ejs
GET /gallery → gallery.ejs
GET /contact → contact.ejs

// Dynamic collection routes
GET /Projects → projects.ejs (passes projectArray)
GET /Projects/:id → project.ejs (validates id: 1-3, passes projectArray + which)

// API endpoint
POST /mail → utils.sendMessage() → JSON {result: "success|failure"}
```

### Template Component System
**Reusable Partials**: `<%- include('partials/header'); %>`
- `partials/projectCard.ejs`: Self-contained card with embedded `projectDetails` array (icons, gradients, badges)
- `partials/header.ejs` + `partials/footer.ejs`: Shared layout

**Data Embedding Pattern**: Complex metadata lives IN templates, not routes
```javascript
// Example from projectCard.ejs lines 7-28
const projectDetails = [
  { icon: 'fas fa-crown', gradient: 'linear-gradient(...)', badge: 'Treble Clef' },
  // ... matched by array index to projectArray
];
```

### Environment Configuration
Required `.env` variables (validated in `utils.js` and `database.js`):
```bash
# Email (nodemailer Gmail SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_TLS=true
MAIL_USERNAME=your_gmail
MAIL_PASSWORD=app_password  # NOT regular password
MESSAGE_TO=recipient_email

# Database (MySQL2 - configured but unused)
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=nft_gallery
MYSQL_PORT=3306
```

## Development Workflows

### Running Locally
```bash
npm run dev    # Nodemon auto-restart
npm start      # Production mode
```

### Database Setup (Future)
```bash
# Schema in scratch/buildDB.sql
mysql -u root -p < scratch/buildDB.sql
# Then uncomment database imports in app.js
```

### Frontend Validation Pattern
`public/js/contact.js` implements Bootstrap validation + async submission:
1. Prevent default submit, validate with `form.checkValidity()`
2. Add `.was-validated` class for Bootstrap styling
3. Fetch POST to `/mail` with loading state management
4. Reset form only on success

## Critical Patterns & Gotchas

### URL Routing Case Sensitivity
- Collection route: `/Projects` (capital P)
- Detail route: `/Projects/:id` (capital P)
- Ensure templates use correct casing in links

### Project ID Validation
```javascript
// app.js lines 39-43
let id = parseInt(req.params.id);
if(isNaN(id) || id < 1 || id > data.length) {
  return res.status(404).render("errors/404.ejs");
}
```
**Must update validation when data source changes**

### Template Variable Naming
- Route passes `projectArray` (not `projects` or `data`)
- Detail pages also receive `which` (current project ID)
- Example: `projectArray[which - 1]` (arrays are 0-indexed)

### Dynamic Styling in Templates
`project.ejs` uses inline `<style>` with EJS:
```html
<body class="project-<%= which || 1 %>">
```
Project backgrounds (.project-1, .project-2, .project-3) defined per-template, not in global CSS.

### Error Handling Middleware
Order matters in `app.js`:
1. Routes
2. Error handler: `app.use((err, req, res, next) => {...})`
3. 404 handler: `app.use((req, res) => {...})` (MUST be last)

## External Dependencies

- **Bootstrap 5.2.3**: CDN-loaded in template `<head>`
- **Font Awesome 6.0.0**: Icons (CDN)
- **Google Fonts**: Orbitron, Eater, Freckle Face, Rubik 80s Fade
- **MySQL2**: Database driver (installed but not active)
- **Nodemailer**: Email via Gmail SMTP (requires app password)

## Modification Checklist

### Adding a New Project
1. Update `data` array in `app.js` (e.g., `["Aurora", "Flares", "Solar winds", "New Project"]`)
2. Add corresponding entry to `projectDetails` arrays in:
   - `views/partials/projectCard.ejs`
   - `views/projects.ejs` (if duplicated)
3. Update ID validation: `id > data.length` (auto-adjusts)
4. Add project-specific styling to `views/project.ejs` (`.project-4` class)

### Switching to Database
1. Uncomment/add `import * as db from "./utils/database.js";` in `app.js`
2. Replace `let data = [...]` with `await db.connect(); let data = await db.getAllProjects();`
3. Update templates to use database fields (see `scratch/buildDB.sql` for schema)
4. Modify ID validation to check against database length

### Email Troubleshooting
- Gmail requires "App Password" (not regular password) - generate in Google Account settings
- Test with `console.log` in `utils/utils.js` line 24-27
- Check SMTP settings match Gmail requirements (port 587, TLS)