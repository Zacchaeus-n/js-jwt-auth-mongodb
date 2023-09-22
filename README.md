```
docker compose pull
```

```
docker compose up -d mongo
```

Check the logs to see if the mongo is up
```
docker compose logs -f mongo
```

Bring up rest of the services
```
docker compose up -d 
```

GOTO `http://localhost:8081/` and add the database `ekailasa_db`

```
node server.js
```

