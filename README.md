# letsgo

- simple app that consumes [News API](https://newsapi.org/)
- this app is by no means production ready. It's purpose is to showcase few technologies

## Getting started

### .env
App requires root `.env` file

````
NODE_VERSION=NODE_VERSION
NODE_ENV=NODE_ENV

# Api
NEWS_API_KEY=NEWS_API_KEY
API_PORT=API_PORT

# Web
API_ENDPOINT=API_ENDPOINT
CHOKIDAR_USEPOLLING=true
````

### Starting with docker
Easiest way to run the app is with docker `Docker`.

````
docker-compose up
````

This will
