'use strict';
var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var i18n = require('i18next');
var middleware = require('i18next-http-middleware');
var Backend = require('i18next-fs-backend');
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

i18n
    .use(middleware.LanguageDetector)
    .use(Backend)
    .init({
        saveMissing: true,
        detectLngFromPath: 0,
        supportedLngs: ['en', 'fr'],
        fallbackLng: 'en',
        backend: {
            loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
            addPath: __dirname + '/locales/{{lng}}/{{ns}}.missing.json'
        },
    });

// i18n.registerAppHelper(app);

//it is important to put this line before the "view engine" middleware
app.use(middleware.handle(i18n));
app.set('view engine', 'pug');
app.set('view cache', false);
app.set('views', __dirname + '/public/views');
app.use(express.static(path.join(__dirname, 'public')));

/*
 * Routes
 */

app.get('/pdf', function(req, res) {
    res.sendFile('./build/CV_Zacaria_CHTATAR_fr.pdf', {
        root: __dirname + '/public/'
    });
});

app.get('/:lang?', function(req, res) {
    res.render('page', {
        root: __dirname + '/public/views'
    });
});


/*
 * Start it up
 */

app.listen(server_port, server_ip_address, function() {
    console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});
