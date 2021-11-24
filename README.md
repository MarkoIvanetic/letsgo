# letsgo ⚛️

- simple app that consumes [News API](https://newsapi.org/)
- it's purpose is to discover and showcase few technologies
- so no apologies for sloppy architecture and bad api
- granted, ideal stack for this project would resolve around Next.js

## Getting started

### .env
App requires root `.env` file. Here's the real one:
````
NODE_VERSION=16
NODE_ENV=development

# Api
# made this key for public
NEWS_API_KEY=49a77a082b3147d88f85dce779f9e5fc
API_PORT=8080

# Web
API_ENDPOINT=http://localhost:8080/
CHOKIDAR_USEPOLLING=true
````

### Installation

````
git clone git@github.com:MarkoIvanetic/letsgo.git
cd letsgo/
````
### :whale: Starting with docker

Easiest way to run the app is with docker `Docker`.

````
docker-compose up
````

This will install node dependencies in containers, propagate enviroment variables and sync changed data with volumes.

### :satellite: Starting each app seperately

You can also do it manually. Don't worry about copying env - `dotenv` source it from the root folder.

For starting the API:
````
cd api/
yarn
yarn start
````

API is not running on `port:8080`

For starting the web:
````
cd app/
yarn
yarn dev
````

App is not running on `port:3000`

---

### About the stack

- [Docker](https://www.docker.com/) - leading cause of imposter syndrom among developers
- [React](https://reactjs.org/) - our most beloved javascript library, especially since class components are off the hook.
- [React Query](https://react-query.tanstack.com/) - makes fetching, caching, synchronizing and updating server state in your React applications a breeze.
- [Typescript](https://www.typescriptlang.org/) - validates javascript with type checking, makes code more robust and confident.
- [Material UI](https://mui.com/) - UI library inspired by Google’s principles on building user interfaces. Uses [emotion](https://emotion.sh/docs/introduction) as it's style engine.
- [React Testing Library (TBA)](https://testing-library.com/docs/react-testing-library/intro/) - freaking Kent C. Dodds made a library that tests your app in a way it's being used in real world.
- [Reach UI (TBA)](https://reach.tech/) - provides unstyled components with built-in accessiblity.
