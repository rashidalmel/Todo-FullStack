# Backend Migration Notes

- All backend files (app.js, routes, models, config, controllers, package.json) have been moved to the `server/` directory.
- All import paths have been updated to reflect the new structure.
- Use `npm install` inside `server/` to install backend dependencies.
- Use `npm run dev` or `npm start` inside `server/` to run the backend.
- The `client/` folder (React app) is unchanged and can be deployed separately.
