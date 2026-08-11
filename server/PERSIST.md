Persistence options
-------------------

This project defaults to using the `MONGO_URI` from `server/.env`. If not provided, the server will start an in-memory MongoDB (development-only) so you can continue working.

To persist data, either:

1) Use a local `mongod` service

 - Install MongoDB Community Edition and start the service.
 - Ensure it's listening on the default port 27017.
 - Create `server/.env` with:

```
MONGO_URI=mongodb://localhost:27017/wifi-attendance
PORT=5000
```

2) Use MongoDB Atlas (cloud)

 - Create a free cluster at https://cloud.mongodb.com
 - Create a database user and whitelist your IP (or 0.0.0.0/0 for dev)
 - Copy the connection string and set it in `server/.env`:

```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/wifi-attendance
PORT=5000
```

Helper script

Use the helper if you prefer to set `.env` from the command line:

```bash
node setEnv.js "MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/wifi-attendance"
```

After setting `MONGO_URI`, restart the server:

```bash
npm run dev
```
