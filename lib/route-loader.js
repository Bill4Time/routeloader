// TODO: - Convert allowed_verbs to a regex expression to check instead
//-----------------------------------------------------------------------------
// Example Usage
//-----------------------------------------------------------------------------
// ---ROUTER CONFIGURATION (defaultRouter.js)
// var express = require('express');
// var router = express.Router();
//
// This expectes an object passed in with some default key value pairs set
// var RouteLoader = require('route-loader');
// RouteLoader.loadBatch(router, require('../routes/defaultRoutes/defaultRoutes'));
// module.exports = router;

// ---ROUTE CONFIGURATION (defaultRoutes.js)
// var routes = [];
// SimpleRender = require('./simpleRender');
// routes.push(SimpleRender('/', 'siteVersions/default/index/index', { title: 'Bill4Time' }));
//
// This is actually what the route-loader anticipates being passes in
// routes.push({ middleware: [function defaultRender(request, response, next) {
// 							response.render(response.locals.route.template_path, response.locals.route.template_data);
// 							}],
// 			path: '/test',
// 			template_data: { title: 'Bill4Time' },
// 			template_path: 'siteVersions/default/index/logan_placeholder',
// 			verb: 'get' });
// module.exports = routes;
//-----------------------------------------------------------------------------
_ = require('lodash');
exports.Route = Route = require('./route');
exports.TemplateRoutes = require('./template-routes');

exports.load = function RouteLoader(router, options) {
	_validateRouter(router);
	var new_route = new Route(options);
	registerRoute(router, new_route);
}

exports.loadBatch = function RouteLoader(router, route_collection) {
	_.each(route_collection, function(value, key, list) {
		var new_route = new Route(value);
		registerRoute(router, new_route);
	});
}

var _validateRouter = function validateRouter(router) {
	if(_.isUndefined(router) || _.isNull(router)) {
		throw new Error('The property "router" passed into the "Route" object is undefined or null, please make sure you have declared it and/or are passing the correct reference to the "Route".');
	}
	else if(!_.isObject(router)) {
		throw new Error('The property "router" is not a type of "Object". Please verify that you are passing the correct value type into the "Route".');
	}
}

// https://www.packtpub.com/books/content/understanding-express-routes
var registerRoute = function registerRoute(router, route) {
	console.log('Registering route');
	console.log('\tpath: ' + route.path);
	console.log('\ttemplate_path: ' + route.template_path);
	console.log('\tmiddleware: ');
	_.map(route.middleware, function(middleware_function) {
		// used to shift functions over for easier debug output
		process.stdout.write('\t\t');
		console.log(middleware_function);
		switch (route.verb) {
			case 'all':
				router.all(route.path, route.defaultMiddleware);
			break;
			case 'connect':
				router.connect(route.path, route.defaultMiddleware);
			break;
			case 'delete':
				router.delete(route.path, middleware_function);
			break;
			case 'get':
				router.get(route.path, middleware_function);
			break;
			case 'head':
				router.head(route.path, middleware_function);
			break;
			case 'notify':
				router.notify(route.path, middleware_function);
			break;
			case 'post':
				router.post(route.path, middleware_function);
			break;
			case 'options':
				router.options(route.path, middleware_function);
			break;
			case 'patch':
				router.patch(route.path, middleware_function);
			break;
			case 'put':
				router.put(route.path, middleware_function);
			break;
			case 'subscribe':
				router.subscribe(route.path, middleware_function);
			break;
			case 'trace':
				router.trace(route.path, middleware_function);
			break;
			case 'unsubscribe':
				router.unsubscribe(route.path, middleware_function);
			break;
			case 'use':
				router.use(route.path, middleware_function);
			break;
			default:
				new Error('An invalid router verb was used when using the route loader. Please verify that your verbs are correct.');
			break;
		}
	});
	console.log();
} 