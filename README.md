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

You can also do it manually. Dont worry about copying env - `dotenv` source it from the root folder.

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
