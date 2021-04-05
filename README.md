Clicker is a simple game where you need to click on as many blocks as possible.
New blocks appear every 3 seconds.

Blocks with different colors cost different amount of points:
1. Green - 1 point
2. Blue - 2 points
3. Yellow - 3 points
4. Red - 4 points

Instructions to setup a server: 

1. Setup npm dependencies
```
    npm i
```

2. Setup a postgres container by bootstraping a docker-compose file
```
    docker-compose up -d
``` 

3. Launch migrations to bootstrap a database, scoreboard table and fill the table with some test data

``` 
    1. cd src/migrations
    2. db-migrate up
```

TODO LIST: 
1. migration for creating a scoreboard table (DONE)
2. logger (DONE)
3. finish readme (DONE)
5. typescript (DONE)
6. migrate frontend to vue.js
7. html fixes (points positioning, fonts, responsive design)
8. build docker image (DONE)
9. build kuber pod and operate it (DONE)