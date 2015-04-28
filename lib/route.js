//-----------------------------------------------------------------------------
// Route Object
//-----------------------------------------------------------------------------
// TODO: - Convert allowed_verbs to a regex expression to check instead
var _allowed_verbs = ['all', 'connect', 'delete',
    'get', 'head', 'notify',
    'post', 'options', 'patch',
    'put', 'subscribe', 'trace',
    'unsubscribe', 'use'
];

var _validatePath = function validatePath(options) {
    if(_.isUndefined(options.path) || _.isNull(options.path)) {
        throw new ReferenceError('The property "path" passed into the "Route" object is undefined or null, please make sure you have declared it and/or are passing the correct reference to the "Route".');
    }
    if(!_.isString(options.path)) {
        throw new TypeError('The "Route" object\'s property "path" is not a type of "String". Please verify that you are passing the correct value type into the "Route" for the path property');
    }
}

var _validateTemplatePath = function validateTemplatePath(options) {
    if(_.isUndefined(options.template_path) || _.isNull(options.template_path)) {
        throw new ReferenceError('The property "template_path" passed into the "Route" object is undefined or null, please make sure you have declared it and/or are passing the correct reference to the "Route".');
    }
    if(!_.isString(options.template_path)) {
        throw new TypeError('The "Route" object\'s property "template_path" is not a type of "String". Please verify that you are passing the correct value type into the "Route" for the path property');
    }
}

var _validateVerb = function validateVerb(options) {
    if(_.isUndefined(options.verb) || _.isNull(options.verb)) {
        throw new ReferenceError('The property "verb" passed into the "Route" object is undefined or null, please make sure you have declared it and/or are passing the correct reference to the "Route".');
    } else if(!_.isString(options.verb)) {
        throw new ReferenceError('The "Route" object\'s property "verb" is not a type of "String". Please verify that you are passing the correct value type into the "Route" for the path property');
    } else if(_.indexOf(_allowed_verbs, options.verb) == -1) {
        var verbs_allowed_string = '';
        for(var i = 0; i < _allowed_verbs.length; i++) {
            if(i < _allowed_verbs.length - 1) {
                verbs_allowed_string += ('"' + _allowed_verbs[i] + '", ');
            } else {
                verbs_allowed_string += ('and "' + _allowed_verbs[i] + '".');
            }
        };
        throw new Error('The verb provided "' + options.verb + '" is not an allowed verb for the "Route" object. The only _allowed_verbs are: ' + verbs_allowed_string);
    }
}

var _validateMiddlware = function validateMiddleware(options) {
    if(_.isUndefined(options.middleware) || _.isNull(options.middleware)) {
        throw new ReferenceError('The property "middleware" passed into the "Route" object is undefined or null, please make sure you have declared it and/or are passing the correct reference to the ' + this.module_name + '.');
    } else if(!(_.isFunction(options.middleware) || _.isArray(options.middleware))) {
        throw new TypeError('The property "middleware" is not a type of "Function" or "Array". Please verify that you are passing the correct value type into the ' + this.module_name + ' for the path property');
    }
}

var validateOptions = function validateOptions(options) {
    _validatePath(options);
    _validateTemplatePath(options);
    _validateVerb(options);
    _validateMiddlware(options);
}

/** route 
 *		Routes are objects that are created to contain information required to configure the express router.
 *		These route objects are intended to be consumed by the route-loader utility in order to register them with a
 *		specified router reference.
 *
 * @param { Function OR Array of Functions } options.middleware
 *			[ The middleware property serves as the list of middleware to be called on the route. This middleware is registered
 *			on a per path basis, meaning that it is not provided as an array to be iterated through. ]
 * @param { String } - options.path
 *			[ The path specifies the url resource being requested in the browser. This path is relative to the root path that is
 *			specified by attaching the router to the app. ]
 * @param { Object } - options.template_data 
 *			[ The template_data is the json object structure that should be provided to the template engine in order to fill the 
 *			template marked blocks. ]
 * @param { String } - options.template_path 
 *			[ The template path serves as a way to locate the template resource to be retrieved for rendering. ]
 * @param { String } - options.verb 
 *			[ The verb is the http verb to register with the router for the middleware action. ]
 */
var Route = function Route(options) {
    // sets properties to default values
    this.path = options.path; // left undefined for error catching if no value is passed in
    this.template_data = options.template_data || {};
    this.template_path = options.template_path; // left undefined for error catching if no value is passed in

    this.verb = options.verb || 'get'; // defaults to get otherwise uses verb passed in

    // Perform simple type checking, and validate required properties are available
    this.validateOptions(options);

    // needs to be done last, because getDefaultMiddleware returns these properties that get set
    // if middleware is passed in as function, just convert it to an array, otherwise it's assumed to be an array because of validation, so don' touch it
    if(_.isFunction(options.middleware)) {
        this.middleware = [this.getDefaultMiddleware(), options.middleware];
    } else {
        options.middleware.unshift(this.getDefaultMiddleware());
        this.middleware = options.middleware;
    }
}

Route.prototype.constructor = Route;
Route.prototype.validateOptions = validateOptions;
Route.prototype.getDefaultMiddleware = function defaultMiddlewareWrapper() {
    var route_properties = this.getResponseRouteProperties();
    return function defaultMiddleware(request, response, next) {
        response.locals.route = route_properties;
        next();
    };
};
Route.prototype.getResponseRouteProperties = function getResponseRouteProperties() {
    return {
        path: this.path,
        template_data: this.template_data,
        template_path: this.template_path,
        verb: this.verb
    };
};

module.exports = Route;
