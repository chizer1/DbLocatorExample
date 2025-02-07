# DbLocatorExample

This repository shows and explains the features of this .NET Library using a minimal and small React app.

## How to Run

1. SQL Server Setup
You will need an instance of SQL Server running. For local development, you can either:

    Use the SQL Server image in this repository by running docker compose up from the root. This requires Docker Desktop to be installed (https://docs.docker.com/get-started/get-docker/)
    Install SQL Server directly on your machine (https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

Once you have a server running, then in two different terminals:

2. Run the dotnet API 
```sh
cd API
dotnet run
```

3. Run react app
```sh
cd Client
npm i
npm run dev
```

Library: [https://github.com/chizer1/DbLocator](https://github.com/chizer1/DbLocator)
