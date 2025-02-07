# DbLocatorExample

This repository shows and explains the features of this .NET Library using a minimal and small React app.

## How to Run

### 1. Download Node and NPM
https://nodejs.org/en
https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

### 2. Download .NET 9
https://dotnet.microsoft.com/en-us/download/dotnet/9.0

### 3. Add GitHub package source 
`dotnet nuget add source https://nuget.pkg.github.com/chizer1/index.json --name DbLocator --username <YourGitHubUsername> --password <YourGitHubPAT>`

### 4. SQL Server Setup
You will need an instance of SQL Server running. For local development, you can either:

- Use the SQL Server image in this repository by running docker compose up from the root. This requires Docker Desktop to be installed (https://docs.docker.com/get-started/get-docker/)
- Install SQL Server directly on your machine (https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

Once you have a server running, then in two different terminals:

### 5. Run the dotnet API 
```sh
cd API
dotnet run
```

### 6. Run react app
```sh
cd Client
npm i
npm run dev
```

Library: [https://github.com/chizer1/DbLocator](https://github.com/chizer1/DbLocator)
