# Tarkov Gym Practice

> This project is currently a work in progress.

This repository contains a React-based web application designed to replicate the gym minigame mechanics from Escape from Tarkov. The tool allows players to practice the timing and spatial challenges of the Hideout workout system in a browser environment to build muscle memory without the in-game stamina costs or injury risks.

---

## Local Development

To build and test the site locally just follow the steps below:

0. Install Node.js

   ```bash
   # use nvm to install the correct version of Node.js
   nvm use
   ```

1. Install dependencies:

   ```bash
   npm install
   ```

1. Copy .env.example to .env (no values need to be changed)

1. Start development server:

   ```bash
   npm run dev
   ```

1. Access the site: [localhost:5173](http://localhost:5173/)

## VS Code Dev Container

1. Open VS Code command palette:

   ```
   cmd + shift + p / ctrl + shift + p
   ```

2. Start the dev container:
   ```
   > Dev Containers: open folder in container...
   ```
3. Select local path to tarkov-dev repo

4. After the container builds and starts it will auto run `npm install && npm run dev`

5. Access the site: [localhost:5173](http://localhost:5173/)

## History

This project was created to provide a dedicated training environment for the Escape from Tarkov community. Recognizing that the Hideout gym is a high-stakes mechanic for players, this tool serves as a lightweight, open-source alternative for skill development. It is built with a focus on mechanical accuracy, matching the visual assets, spatial scaling, and timing windows found in the live game.

## Pull Requests

We will eventually be able to support pull requests, but right now I'm just getting the initial version up and running.

## Contributors

- brianTFbell (https://github.com/briantfbell)
- Folken (https://github.com/folken88)
