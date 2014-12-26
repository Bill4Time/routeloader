#route-loader

This is a node module created to simplify the functionality of the [Express](https://github.com/strongloop/express) node modules router so that developers can code readable and segmented route modules, for each router they create.

## Overview
The Express web server (in node) is a great way to configure the server side of web sites and web applications. With Express 4.0 comes the separation of Router objects from the App itself. Because of this change it seemed like a good idea to create an easier way to load routes, and segment them so that managing multiple files or routes didn't explode in one location.

To use the route-loader module all you have to do is require the module, create some routes, and load them into the router.
## Installation
```javascript
// to install in the local directory
npm install route-loader

// to install in the local directory and save to the package.json
npm install route-loader --save
```
## Example Usage
The directory structure is:  
/Users/username/node project/  
&nbsp;&nbsp;&nbsp;&nbsp;|__node_modules  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__route-loader  
&nbsp;&nbsp;&nbsp;&nbsp;|__routers  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__default-router.js  
&nbsp;&nbsp;&nbsp;&nbsp;|__routes  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__default-routes.js  
&nbsp;&nbsp;&nbsp;&nbsp;|__server.js (This is the express-js configuration file.)

### Server Configuration
In your server configuration all you will need to do is load express, then load the router you've configured in a separate file. In this case it's our default-router.js. Then once loaded, register the router with express. It's as simple as that.

```javascript
// server.js

// Express
var app = express();
...
var defaultRouter = require('./routers/default-router');
...
app.use('/', defaultRouter);
```

That's all it takes!

### The Router
When creating a router all you need to do is create module file. Call it whatever you want. And then just load the routes.

```javascript
// default-router.js

// Load express and it's router
var express = require('express');
var router = express.Router();
// Load route-loader
var routeLoader = require('route-loader');

// This is the call that registers the routes from default routes to the router
routeLoader.loadBatch(router, require('../routes/default-routes'));

module.exports = router;
```

### The Routes
In order to register routes you need to create a javascript object that has the route's information configured in it. For the sake of ease, the route-loader comes with some template routes that return the information configured by default, so that you the developer need to interact minimally with the code.

```javascript
// default-routes.js

// Load the template routes from the route-loader module
templateRoutes = require('route-loader').TemplateRoutes;

var routes = [];
// This adds a javascript object to the routes array with the configured route path of '/' and points that route to the template called index
routes.push(templateRoutes.simpleRender('/', 'index'));

module.exports = routes;
```
The above code is directly equivalent to this code below:
```javascript
// default-routes.js

// Load the template routes from the route-loader module
templateRoutes = require('route-loader').TemplateRoutes;

var routes = [];
routes.push(templateRoutes.simpleRender('/', 'index'));
routes.push({ middleware: [function defaultRender(request, response, next) {
 							response.render(response.locals.route.template_path, response.locals.route.template_data);
 						}],
 						path: '/',
 						template_data: {},
 						template_path: 'index',
 						verb: 'get' });
 						
module.exports = routes;
```

There is a lot more to discuss about these configurations. To read more about it view more in the modules section

## Modules
- [Route Loader](documentation/RouteLoader.md)
- [Route](documentation/Route.md)
- [Template Route](documentation/TemplateRoute.md)
