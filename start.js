/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

'use strict';

var app = require('./server/server');

// In case of production environment (e.g. herokuapp) https will
// be provided automatically, otherwise we need to set up the local https
// support using https library and our locally saved keys
if (process.env.NODE_ENV === "production") {
  // start server
  var server = app.listen(app.get('port'), function () {
    if (process.env.FORGE_CLIENT_ID == null || process.env.FORGE_CLIENT_SECRET == null)
      console.log('*****************\nWARNING: Forge Client ID & Client Secret not defined as environment variables.\n*****************');

    if (process.env.ONEDRIVE_CLIENT_ID == null || process.env.ONEDRIVE_CLIENT_SECRET == null)
      console.log('*****************\nWARNING: OneDrive Client ID & Client Secret not defined as environment variables.\n*****************');

    console.log('Starting at ' + (new Date()).toString());
    console.log('Server listening on port ' + server.address().port);
  });
} else {
  // Setting up local https support
  var fs = require('fs');
  var https = require('https');

  var options = {
    key: fs.readFileSync('/etc/apache2/ssl/server.key'),
    cert: fs.readFileSync('/etc/apache2/ssl/server.crt'),
    passphrase: 'erny97',
    requestCert: false,
    rejectUnauthorized: false
  };

  // start server
  var server = https.createServer(options, app).listen(app.get('port'), function () {
    if (process.env.FORGE_CLIENT_ID == null || process.env.FORGE_CLIENT_SECRET == null)
      console.log('*****************\nWARNING: Forge Client ID & Client Secret not defined as environment variables.\n*****************');

    if (process.env.ONEDRIVE_CLIENT_ID == null || process.env.ONEDRIVE_CLIENT_SECRET == null)
      console.log('*****************\nWARNING: OneDrive Client ID & Client Secret not defined as environment variables.\n*****************');

    console.log('Starting at ' + (new Date()).toString());
    console.log('Server listening on port ' + server.address().port);
  });
}
