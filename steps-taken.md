Let's checkout out the project configuration:
- `pnpm-lock.yaml` + locked pnpm version of `packageManager` in `package.json`. Good.
- TanstackRouter. A really good choice. I like it. `.cta.json` tells me it was initialized with create-tsrouter-app.
- Sane tsconfig. `@/*` is setup as an src alias. Got it.
- vite.config.js. Looks fine. Maybe I would've tried out a few different things here:
  - `vite.config.ts` has been a thing for a long time now.
  - Check out if SWC's version of react transform (and maybe even a relay one as well) are a significant improvement. For such a small project HRM/build times are not a problem.
  - Check out if the beta of rolldown-powered-vite fits our needs. Once again, project is super fast to compile as-is.
- Biome seems like a good choice. I haven't played much with it. Let's reconfigure the editor to use the biome's formatting, instead of my default's prettier.
- `package.json` time.
  - Relay config in package json looks legit. Nothing to add.
  - Tailwind **4**. Nice. No need to upgrade from 3 myself. (This makes me think that this template repo wasn't setup that long ago)
  - _Speaking of upgrades. Let's try to stay up-to-date with `pnpm upgrade --interactive --latest` where possible.
    - Relay v20
    - Vite v7. _Lemme check breaking changes..._ We're good.
    - Check that everything copiles/works/typeckecks. _Would be weird if it didn't._

Let's begin by scratching out the design

I would imagine a command-pallete centric design, ala Spotlight. And a 40/60 split column. Left side would house the repo info, and a list of issues. Right side would display issue discussion.

Let's go:
- `pnpm install`
- `pnpm dev`
- What scoped did we want for the token? Ah `repo` and `user`.
- `Authentication: Bearer undefined` my ass. Have I tried restarting the dev server?

Let's start with the command pallete. I've been using radix a lot for these kinds of components from scratch. Base-ui is gaining tracktion. But honestly let's not dwell on this a lot, and just yoink the one from chadcn/ui.
