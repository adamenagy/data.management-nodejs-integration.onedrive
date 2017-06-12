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

'use strict'  // http://www.w3schools.com/js/js_strict.asp

// token handling in session
var token = require('./token') 

// web framework
var express = require('express') 
var router = express.Router() 

// config information, such as client ID and secret
var config = require('./config') 

const msGraph = require("@microsoft/microsoft-graph-client").Client 
var msGraphClient = undefined 

// Add some logging

var request = require('request') 

function respondWithError(res, error) {
    if (error.statusCode) {
        res.status(error.statusCode).end(error.statusMessage) 
    } else {
        res.status(500).end(error.message) 
    }
}

// return name & picture of the user for the front-end
// the forge @me endpoint returns more information
router.get('/onedrive/profile', function (req, res) {
    var tokenSession = new token(req.session) 

    msGraphClient
        .api('/me')
        .select("displayName")
        .get(function (error, data) {
            if (error) {
                console.log(error)
                respondWithError(data, error)
                return 
            }
            var profile = {
              'name': data.displayName,
              'picture': ""
            }
            res.json(profile) 
    }) 
}) 

router.get('/onedrive/authenticate', function (req, res) {

    // "appId": "d9374d19-03b6-4663-a6dd-6790fdb229f9"

    // scopes:
    // https://dev.onedrive.com/auth/graph_oauth.htm

    req.session.onedriveURL = "https://login.microsoftonline.com" 

    var url =
        req.session.onedriveURL + '/common/oauth2/v2.0/authorize?' +
        'client_id=' + config.onedrive.credentials.client_id +
        '&client_secret=' + config.onedrive.credentials.client_secret +
        '&redirect_uri=' + config.onedrive.callbackURL +
        '&scope=user.read%20files.readwrite%20files.readwrite.all%20sites.read.all' +
        '&response_type=code'
    res.end(url) 
}) 

// wait for Onedrive callback (oAuth callback)
router.get('/api/onedrive/callback/oauth', function (req, res) {
    var code = req.query.code 
    var tokenSession = new token(req.session) 

    request({
        url: req.session.onedriveURL + "/common/oauth2/v2.0/token",
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'client_id=' + config.onedrive.credentials.client_id +
        '&client_secret=' + config.onedrive.credentials.client_secret +
        '&redirect_uri=' + config.onedrive.callbackURL +
        '&code=' + code +
        '&grant_type=authorization_code'
    }, function (error, response, body) {
        if (error != null) {
            console.log(error)  // connection problems

            if (body.errors != null)
                console.log(body.errors)

            respondWithError(res, error)

            return
        }

        var json = JSON.parse(body) 
        tokenSession.setOnedriveToken(json.access_token)
        
        msGraphClient = msGraph.init({
            defaultVersion: 'v1.0',
            debugLogging: true,
            authProvider: function (done) {
                done(null, json.access_token) 
            }
        }) 

        //tokenSession.setOnedriveClient(msGraphClient)

        res.redirect('/') 
    })
}) 

router.get('/onedrive/isAuthorized', function (req, res) {
    var tokenSession = new token(req.session) 
    res.end(tokenSession.isOnedriveAuthorized() ? 'true' : 'false') 
}) 

router.get('/onedrive/getTreeNode', function (req, res) {

    var tokenSession = new token(req.session) 
    if (!tokenSession.isOnedriveAuthorized()) {
        res.status(401).end('Please box login first') 
        return 
    }

    var id = decodeURIComponent(req.query.id) 

    // item id's look like this:
    // <drive id>!<file id>
    // e.g. BF0BDCFE22A2EFD6!161
    var driveId = id.split('!')[0] 
    var path = '' 

    try {
        if (id === '#') {
            path = '/drives'
        } else if (id === driveId) {
            path = '/drives/' + driveId + '/root/children'
        } else {
            path = '/drives/' + driveId + '/items/' + id + '/children'
        }

        msGraphClient
          .api(path)
          .get(function (error, data) {
              if (error) {
                  console.log(error)
                  respondWithError(data, error)
                  return 
              }

              var treeList = []
              for (var key in data.value) {
                  var item = data.value[key]
                  var treeItem = {
                      id: item.id,
                      text: item.name,
                      type: item.folder ? 'folder' : 'file',
                      children: item.folder ? !!item.folder.childCount : false
                      // !! turns an object into boolean
                  } 

                  // In case we are listing the drives
                  if (id === '#') {
                      treeItem.text = item.id
                      treeItem.type = 'drive'
                      treeItem.children = true
                  }
                  treeList.push(treeItem) 
              }

              res.json(treeList)
          }) 
    } catch (err) {
        respondWithError(res, err)
    }
}) 

module.exports = router 
