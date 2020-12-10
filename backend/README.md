npm install -g supervisor
npm install -g node-inspector

supervisor --inspect ./bin/www
node-inspector & -p 8888
http://localhost:8888/?ws=localhost:8888&port=8080

