# AI Coding Instructions for NFT Art Gallery Project

## Project Overview
This is a Node.js/Express web application showcasing NFT art collections. The project uses ES6 modules, EJS templating, and serves as a portfolio for digital artwork with contact functionality.

## Architecture & Core Patterns

### Application Structure
- **Entry Point**: `app.js` - Express server with ES6 module imports
- **Views**: EJS templates in `views/` with Bootstrap 5 styling
- **Static Assets**: Served from `public/` directory (CSS, JS, images, audio)
- **Utilities**: Email functionality in `utils/utils.js` using nodemailer

### Data Flow
- **Project Data**: Hard-coded array `["Project 1", "Project 2", "Project 3"]` in `app.js`
- **Dynamic Routing**: `/Projects/:id` validates ID range (1-3) and renders individual project pages
- **Template Data**: Projects passed as `projectArray` to EJS templates

### Key Conventions

#### File Organization
```
views/
├── partials/header.ejs    # Shared navigation and head tags
├── partials/footer.ejs    # Shared footer
├── errors/404.ejs         # Custom 404 page
└── [page].ejs            # Individual page templates
```

#### EJS Template Patterns
- **Partial Inclusion**: `<%- include('partials/header'); %>`
- **Data Embedding**: Complex project details defined as arrays within templates (see `projects.ejs` lines 28-45)
- **Dynamic Styling**: Inline styles and gradients generated via template logic

#### Route Patterns
- **Static Pages**: Multiple routes (`/`, `/home`) can render same template
- **Collection Route**: `/Projects` renders list view with data
- **Detail Route**: `/Projects/:id` with validation and 404 handling
- **API Endpoint**: `/mail` POST for contact form submission

### Development Workflows

#### Starting the Application
```bash
npm run dev    # Development with nodemon
npm start      # Production
```

#### Environment Configuration
- Uses `dotenv` for mail configuration
- Required env vars: `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MESSAGE_TO`

### Frontend Integration

#### Bootstrap + Custom CSS
- Bootstrap 5.2.3 CDN for layout/components
- Custom gradients and NFT-themed styling in `/css/style.css`
- Font integration: Orbitron (primary), Eater, Freckle Face, Rubik 80s Fade

#### JavaScript Patterns
- **Contact Form**: `public/js/contact.js` handles form validation and async email submission
- **Client-Server Communication**: Fetch API to `/mail` endpoint with loading states

### Email System
- **Configuration**: Gmail SMTP via nodemailer in `utils/utils.js`
- **Error Handling**: Proper async/await with try-catch and error propagation
- **Security**: Environment variables for credentials

### Error Handling
- **Validation**: Route parameter validation with range checking
- **404 Handling**: Custom error pages for invalid routes and project IDs
- **Email Errors**: Graceful failure with user feedback

### Project-Specific Notes
- **Project Scaling**: To add new projects, update the data array in `app.js` and corresponding template logic
- **Asset Management**: Images stored in `public/images/` with specific naming (SUN.ico for favicon)
- **Responsive Design**: Bootstrap grid system with custom hover effects on project cards
- **SEO**: Proper meta tags and structured data in templates

When modifying this codebase:
1. Maintain ES6 module syntax throughout
2. Follow the established EJS partial pattern for shared components
3. Keep project data centralized in `app.js` until database integration
4. Preserve the Bootstrap + custom CSS styling approach
5. Test email functionality with proper environment variables