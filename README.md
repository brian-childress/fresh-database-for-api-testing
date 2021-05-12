# Getting Started

## How it works?

The entire application is contianerized using [Docker](https://www.docker.com/) containers and [Docker Compose](https://docs.docker.com/compose/) for orchestration. Anytime we need a "new database" we can provision DROP/CREATE TABLEs delete or add data, whatever makes sense for each test or suite of tests. We leverage a concept of "sibling containers" in that we have two or more containers (API, Database, etc.) operating in individual containers side by side. Using Docker networking to communicate between containers. Then by using `cURL` and the [Docker socket](https://docs.docker.com/engine/api/sdk/examples/) we can execute commands from one container to another container as if we were operating on the target container the whole time. Docker socket communication leverages the Docker API to execute commands which we use to then execute database commands for our tests. The process of creating a new empty database is really pretty quick.

## Features

- Provides end-to-end (E2E) API testing
- JSON Web Token (JWT) user authorization
- Leverages existing database schema
- Database seed data from .csv files, easy to generate and understand

## Technologies

This application is set up like most web APIs using a common set of patterns and technologies. The API and database technologies are interchangeable, while the specific commands might change, the concepts should remain the same.

- NodeJS
- ExpressJS
- PostgreSQL
- JSON Web Token (JWT)
- Docker, Docker Compose

## Folder Structure

|- example-app  
|---- .env <-- Create for each environment  
|---- docker-compose.yml  
|---- dev.docker-compose.yml  
|---- testing.docker-compose.yml  
|---- api/  
|------- app.js <-- Main entrypoint for application  
|----- database/ <-- Database schemas, exported from database  
|----- middleware/  
|----- scripts/ <-- Scripts used export/import database schema, setup  
|----- services/  
|----- tests/  
|----- utilities/  

## Initial Setup

### Create an .env file

The _.env_ file is used to manage all of the sensitive environment variables (Credentials, API keys, etc.) that should **NOT** be checked into the source code. Each developer will need to create this file for their environment **AND ENSURE THE .env FILE IS NOT CHECKED INTO SOURCE CONTROL**. In production environments, consider using a secrets manager (Hashicorp Vault, AWS Secrets Manager, etc.) The .env file should be in the root of the repository.

Rename [.env.example](.env.example) to *.env* and provide correct values for your environment.

## Running the Application

From the root of the application folder run the following command to start the docker containers used for local development:

```sh
docker-compose -f docker-compose.yml -f dev.docker-compose.yml up
```

The Database tables, etc. can be initialized by running the initialization script in the api/ directory.

```sh
./scripts/initial-setup.sh
```

The API is now available at [http://localhost:8080](http://localhost:8080). **NOTE:** The database tables will be empty, but the table schemas have been created.


## Testing

_Testing with docker-compose_

```sh
docker-compose -f docker-compose.yml -f testing.docker-compose.yml up
```

_Log into running API container, the Node API is not actually running yet_

```sh
docker exec -it api bash
```

_Within the API container, execute tests:_

```sh
npm run test:integration
```