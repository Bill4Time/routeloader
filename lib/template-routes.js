var template_routes = {};

function simpleRender(path, template_path, template_data) {
	return {
		middleware: function defaultRender(request, response, next) {
			// console.log(response.locals.route.template_path);
			// console.log(response.locals.route.template_data);
			response.render(response.locals.route.template_path, 
							response.locals.route.template_data, 
							function(error, html) { 
								if(error) {
									console.log('A RENDER ERROR HAS OCCURED.');
									console.log(error); 
									response.send(error.name + ': ' + error.message);
								}
								else {
									// Needs to be sent manually when performed in the callback
									response.send(html);
								}
							});
		},
		path: path,
		template_data: template_data,
		template_path: template_path,
		verb: 'get' 
	}
};

template_routes.simpleRender = simpleRender;

module.exports = template_routes;