# DbLocatorExample

This repository shows the features of the DbLocator .NET library using a minimal API and small React app.

[https://github.com/chizer1/DbLocator](https://github.com/chizer1/DbLocator)

## How to Run

### 1. Download Node and NPM

https://nodejs.org/en
https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

### 2. Download .NET 9

https://dotnet.microsoft.com/en-us/download/dotnet/9.0

### 3. SQL Server Setup

You will need an instance of SQL Server running. For local development, you can either:

- Use the SQL Server image in this repository by running docker compose up from the root. This requires Docker Desktop to be installed (https://docs.docker.com/get-started/get-docker/)
- Install SQL Server directly on your machine (https://www.microsoft.com/en-us/sql-server/sql-server-downloads
- Spin up a new SQL Server instance in the cloud. Note: This library may not play nicely with Azure SQL as this library has code that relies on traditional SQL Server logins which Azure SQL doesn't support.

### 4. Run the dotnet API

```sh
## Update appsettings.json with your SQL connection string first
cd API
dotnet run
```

### 5. Run react app

```sh
cd Client
npm i
npm run dev
```
