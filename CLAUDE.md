# Project Generator - Enterprise Application Wizard

## What is this?
A standalone HTML-based project generator that creates comprehensive project seed files for Claude Code to automatically build enterprise applications. Think of it as a "Create New Project" wizard similar to Visual Studio, but designed specifically for Claude Code automation.

## Why we built this
We needed a way to quickly scaffold new enterprise projects without manually writing all the boilerplate code and configuration. This tool:
- Eliminates repetitive project setup tasks
- Ensures consistent project structure across teams
- Captures best practices and patterns in templates
- Generates Claude Code-optimized instructions for automatic project creation

## How it works
1. **Open the HTML file** in any browser (no server needed)
2. **Fill out the wizard** - 7 steps covering all project aspects:
   - Project type and template selection
   - Basic configuration (name, version, description)
   - Technology stack (backend, frontend, database)
   - Database setup and connection strings
   - Security and authentication settings
   - Advanced features (caching, real-time, messaging)
   - Review and generate
3. **Generate PROJECT_SEED.md** - Downloads a markdown file with all configurations
4. **Use with Claude Code**:
   - Create an empty project folder
   - Place the generated .md file in it
   - Ask Claude: "Build this project based on PROJECT_SEED.md"
   - Claude automatically creates the entire project structure

## Key Features
- **Google Material Dark Theme** - Modern, colorful, easy on the eyes
- **5 Pre-built Templates**:
  - XOS Enterprise (full-stack with all features)
  - Simple API (basic REST API)
  - Microservices (Docker-ready)
  - SaaS Multi-tenant
  - Custom (configure from scratch)
- **Flexible Configuration** - Every field accepts custom values, not limited to dropdowns
- **Template Save/Load** - Save configurations as reusable templates in browser storage
- **Smart Defaults** - Pre-filled with sensible defaults from the XOS/CVS architecture
- **Real-time Preview** - See connection strings and configurations as you type

## Technology Stack Support
- **Backend**: .NET 8, Node.js, Python, Java, or custom
- **Frontend**: React + XOS Components, Angular, Vue, Blazor, or custom
- **Database**: PostgreSQL, MySQL, MongoDB, SQL Server, or custom
- **Caching**: Redis, SQLite, Memcached, In-Memory, or custom
- **Real-time**: SignalR, Socket.io, WebSockets, or custom
- **Authentication**: JWT, OAuth2, SAML, API Keys, or custom

## Output Format
The generated PROJECT_SEED.md file is optimized for Claude Code with:
- Clear step-by-step instructions
- All configuration files ready to create
- Proper folder structure definitions
- Database connection strings
- Package dependencies
- Setup and verification commands

## Deployment
This is a single HTML file with everything embedded (CSS, JavaScript). You can:
- Use it locally by opening in a browser
- Deploy to any static hosting (Netlify, GitHub Pages, etc.)
- Share via email or cloud storage
- No build process or dependencies required

## Use Cases
- Starting new enterprise projects
- Creating consistent microservices
- Prototyping applications quickly
- Teaching project structure and setup
- Standardizing team development practices

## Related Documentation
When Claude Code builds projects from this generator, it uses patterns from:
- `@claude_docs` - XOS framework patterns and guidelines
- MVVM architecture for frontend components
- Repository pattern for data access
- Dependency injection throughout
- Proper error handling and logging

## Version
1.0.0 - Initial release with full enterprise application support

## GitHub Repository
https://github.com/leantos/project_generator.git

## Quick Start
1. Download or clone the repository
2. Open `index.html` in any modern browser
3. Follow the wizard to configure your project
4. Download the generated `PROJECT_SEED.md`
5. Use with Claude Code to build your project automatically

## Contributing
Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License
MIT License - See LICENSE file for details