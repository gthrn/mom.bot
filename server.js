function server() {
    let express = require('express');
    let fs = require('fs');

    app = express();
    port = process.env.PORT || 3000;
    
    bodyParser = require('body-parser');
    
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Routes | Registriert automatisch alle File im Routes Ordner
    var routesPath = "./api/routes/";
    fs.readdir(routesPath, (err, files) => {
        files.forEach(file => {
            var routes = require(routesPath+file);
            routes(app); //register the route

        });
    })

    app.listen(port);
}

module.exports = server;