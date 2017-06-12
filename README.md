# data.management-nodejs-integration.egnyte

[![Node.js](https://img.shields.io/badge/Node.js-4.4.3-blue.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-2.15.1-blue.svg)](https://www.npmjs.com/)
![Platforms](https://img.shields.io/badge/platform-windows%20%7C%20osx%20%7C%20linux-lightgray.svg)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://opensource.org/licenses/MIT)

[![oAuth2](https://img.shields.io/badge/oAuth2-v1-green.svg)](http://developer.autodesk.com/)
[![Data-Management](https://img.shields.io/badge/Data%20Management-v1-green.svg)](http://developer.autodesk.com/)
[![OSS](https://img.shields.io/badge/OSS-v2-green.svg)](http://developer.autodesk.com/)
[![Model-Derivative](https://img.shields.io/badge/Model%20Derivative-v2-green.svg)](http://developer.autodesk.com/)

# Description

This sample is based on [Augusto](https://forge.autodesk.com/author/augusto-goncalves)'s [Box-Forge integration sample](https://github.com/Autodesk-Forge/data.management-nodejs-integration.box) and shows a simple integration between [Data Management API](https://developer.autodesk.com/en/docs/data/v2/overview/) and [Egnyte](https://www.egnyte.com). The front-end will look like:
  
![](www/img/indexpage.png)

### Live version

[https://forge-egnyte-integration.herokuapp.com](https://forge-egnyte-integration.herokuapp.com)

# Setup

In order to use this sample you need Autodesk developer credentials. Visit the [Forge Developer Portal](https://developer.autodesk.com), sign up for an account, then [create an app](https://developer.autodesk.com/myapps/create). For this new app, use <b>https://localhost:3000/api/forge/callback/oauth</b> as Callback URL. Finally take note of the <b>Client ID</b> and <b>Client Secret</b>.

You also need an Egnyte Developer credentials. Visit the [Egnyte Developer](https://developers.egnyte.com), Log in or Sign up, follow the steps to an Egnyte application. For this new app, use <b>https://localhost:3000/api/egnyte/callback/oauth</b> as redirect_uri. Finally, take note of the <b>client_id</b> and <b>client_secret</b>.

Follow the steps outlined in this blog post to generate the SSL key for local https testing [https://forge.autodesk.com/blog/enable-https-local-nodejs](https://forge.autodesk.com/blog/enable-https-local-nodejs)

### Run locally

Install [NodeJS](https://nodejs.org).

Clone this project or download it. It's recommended to install [GitHub desktop](https://desktop.github.com/). To clone it via command line, use the following (<b>Terminal</b> on MacOSX/Linux, <b>Git Shell</b> on Windows):

    git clone https://github.com/adamenagy/data.management-nodejs-integration.egnyte

To run it, install the required packages, set the enviroment variables with your client ID & secret and finally start it. Via command line, navigate to the folder where this repository was cloned and use the following:

Mac OSX/Linux (Terminal)

    npm install
    export FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM FORGE DEVELOPER PORTAL>>
    export FORGE_CLIENT_SECRET=<<YOUR FORGE CLIENT SECRET>>
    export EGNYTE_CLIENT_ID=<<YOUR CLIENT ID FROM EGNYTE DEVELOPER>>
    export EGNYTE_CLIENT_SECRET=<<YOUR EGNYTE CLIENT SECRET>>
    npm run dev

Windows (use <b>Node.js command line</b> from Start menu)

    npm install
    set FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM FORGE DEVELOPER PORTAL>>
    set FORGE_CLIENT_SECRET=<<YOUR FORGE CLIENT SECRET>>
    set EGNYTE_CLIENT_ID=<<YOUR CLIENT ID FROM EGNYTE DEVELOPER>>
    set EGNYTE_CLIENT_SECRET=<<YOUR EGNYTE CLIENT SECRET>>
    npm run dev

Open the browser: [https://localhost:3000](https://localhost:3000).

<b>Important:</b> do not use <b>npm start</b> locally, this is intended for PRODUCTION only with HTTPS (SSL) secure cookies.

### Deploy on Heroku

To deploy this application to Heroku, the <b>Callback URL</b> & <b>redirect_uri</b> must use your .herokuapp.com address. After clicking on the button below, at the Heroku Create New App page, set your Client ID & Secret and the correct callback URL.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Packages used

All Autodesk Forge NPM packages are included by default, see complete list of what's available at [NPM website](https://www.npmjs.com/browse/keyword/autodesk). OAuth and Data Management API are used. [Egnyte SDK](https://developers.egnyte.com/Egnyte_SDK) for NodeJS/JavaScript is **egnyte-js-sdk** that you can install using npm `npm install egnyte-js-sdk`. Some other non-Autodesk packaged are used, including [express](https://www.npmjs.com/package/express) and its session/cookie middlewares ([express-session](https://www.npmjs.com/package/express-session) and [cookie-parser](https://www.npmjs.com/package/cookie-parser)) for user session handling. The front-end uses [bootsrap](https://www.npmjs.com/package/bootstrap) and [jquery](https://www.npmjs.com/package/jquery).

# Tips & tricks

For local development/testing, consider use [nodemon](https://www.npmjs.com/package/nodemon) package, which auto restart your node application after any modification on your code. To install it, use:

    sudo npm install -g nodemon

Then, instead of <b>npm run dev</b>, use the following:

    npm run nodemon

Which executes <b>nodemon server.js --ignore www/</b>, where the <b>--ignore</b> parameter indicates that the app should not restart if files under <b>www</b> folder are modified.

## Troubleshooting

After installing Github desktop for Windows, on the Git Shell, if you see a <b>*error setting certificate verify locations*</b> error, use the following:

    git config --global http.sslverify "false"

# License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT).
Please see the [LICENSE](LICENSE) file for full details.

## Written by

Adam Nagy (Forge Partner Development)<br />
http://forge.autodesk.com<br />
