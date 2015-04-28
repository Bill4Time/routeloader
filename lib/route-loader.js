// TODO: - Convert allowed_verbs to a regex expression to check instead
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
    } else if(!_.isObject(router)) {
        throw new Error('The property "router" is not a type of "Object". Please verify that you are passing the correct value type into the "Route".');
    }
}

// Configured to match the supported express methods
// http://expressjs.com/api.html#app.METHOD
var registerRoute = function registerRoute(router, route) {
    console.log('Registering route');
    console.log('\tpath: ' + route.path);
    console.log('\ttemplate_path: ' + route.template_path);
    console.log('\tmiddleware: ');
    _.map(route.middleware, function(middleware_function) {
        // used to shift functions over for easier debug output
        process.stdout.write('\t\t');
        console.log(middleware_function);
        switch(route.verb) {
            case 'checkout':
                router.checkout(route.path, route.defaultMiddleware);
                break;
            case 'connect':
                router.connect(route.path, route.defaultMiddleware);
                break;
            case 'copy':
                router.copy(route.path, route.defaultMiddleware);
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
            case 'lock':
                router.lock(route.path, middleware_function);
                break;
            case 'merge':
                router.merge(route.path, middleware_function);
                break;
            case 'mkactivity':
                router.mkactivity(route.path, middleware_function);
                break;
            case 'mkcol':
                router.mkcol(route.path, middleware_function);
                break;
            case 'move':
                router.move(route.path, middleware_function);
                break;
            case 'notify':
                router.notify(route.path, middleware_function);
                break;
            case 'options':
                router.options(route.path, middleware_function);
                break;
            case 'patch':
                router.patch(route.path, middleware_function);
                break;
            case 'post':
                router.post(route.path, middleware_function);
                break;
            case 'propfind':
                router.propfind(route.path, middleware_function);
                break;
            case 'proppatch':
                router.proppatch(route.path, middleware_function);
                break;
            case 'purge':
                router.purge(route.path, middleware_function);
                break;
            case 'put':
                router.put(route.path, middleware_function);
                break;
            case 'report':
                router.report(route.path, middleware_function);
                break;
            case 'search':
                router.search(route.path, middleware_function);
                break;
            case 'subscribe':
                router.subscribe(route.path, middleware_function);
                break;
            case 'trace':
                router.trace(route.path, middleware_function);
                break;
            case 'unlock':
                router.unlock(route.path, middleware_function);
                break;
            case 'unsubscribe':
                router.unsubscribe(route.path, middleware_function);
                break;
            default:
                new Error('An invalid router verb was used when using the route loader. Please verify that your verbs are correct.');
                break;
        }
    });
    console.log();
}
