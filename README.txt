PLAYZO GAME PAGE REDESIGN PATCH

Copy these files into the matching locations in your existing project:

1. src/pages/GameDetails/GamePage.tsx  -> replace existing GamePage.tsx
2. src/games/GameSuite.tsx             -> replace existing GameSuite.tsx
3. public/playzo-mark.svg              -> add this new SVG brand icon
4. index.html                          -> replace existing index.html

The new GamePage wraps ALL eight game routes in the same responsive arcade layout.
The Space Shooter replacement uses real bullet state, moving invaders, hit detection,
wave progression, keyboard controls, pointer steering, and touch FIRE controls.

Keep your existing SnakeGame.tsx and Game2048.tsx files. GameSuite imports them.

After copying, run from the project root:
  npm run build
  npm run lint
  npm run dev

Note: The mission progress panel is intentionally labelled as a visual challenge reminder;
it is not connected to gameplay progress yet. Test all games locally before deployment.
