# MusicApp

Angular 21 app scaffolded with routing and global SCSS.

## Quick start

```bash
npm install      # install dependencies
npm start        # start dev server at http://localhost:4200
npm run build    # production build to dist/music-app
npm test         # run unit tests (Vitest via ng test)
```

## Project structure

- `src/main.ts` bootstraps the Angular application.
- `src/app/app.config.ts` holds providers and app-level config.
- `src/app/app.routes.ts` defines the root routes.
- `src/app/app.ts` and `src/app/app.html` compose the shell component.
- `src/styles.scss` is the global stylesheet.

## Notes

- CLI analytics are disabled locally.
- Server-side rendering was not enabled during scaffolding.

For more Angular CLI commands and options, see the [Angular CLI docs](https://angular.dev/tools/cli).
