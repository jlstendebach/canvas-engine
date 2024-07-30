# Canvas Engine (working title)
An object-oriented, canvas-based graphics framework aimed a quick and easy development of custom graphics, simulations, and games.

# Usage
To target the latest version:
- `import { ... } from "https://cdn.jsdelivr.net/gh/jlstendebach/canvas-engine/index.js"`

To target a specific release:
- `import { ... } from "https://cdn.jsdelivr.net/gh/jlstendebach/canvas-engine@v0.1.0/index.js"`

If you have pulled the library, you can link to it directly:
- `import { ... } from "path/to/library/index.js"`

# Testing
This library uses [Jest](https://jestjs.io/) for testing. To test, run the following command: 
- `npm test`

# Running Locally
- Run command `npm install http-server`
- Navigate to the your project's repo
- Run command `http-server`
- Open `http://localhost:8080/` in your browser (port may be different based on config)