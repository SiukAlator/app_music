var Config = require('/libs/Config');

exports.listadoproyectos = function (callback, params) {
	if (Config.mode == 0) {
		Ti.API.info('xhr.listadoproyectos->params: ' + JSON.stringify(params));
	}
	var client = Ti.Network.createHTTPClient({
		onload: function (e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.listadoproyectos: ' + this.responseText);
			}
			var json = JSON.parse(this.responseText);
			callback(json);
		},
		onerror: function (e) {
			Ti.API.info('Error!');
			Ti.API.debug(e.error);
			callback(false);
		},
		timeout: Config.timeOut
	});
	var ubqti_api_token = params['token'];
	var ubqti_api_version = Config.ubqti_api_version;

	client.open('GET', Config.SERVER_BASE_URL + 'project');
	client.setRequestHeader('ubqti_api_token', ubqti_api_token);
	client.setRequestHeader('ubqti_api_version', ubqti_api_version);
	client.send();
};

exports.app_version = function (callback) {
	var client = Ti.Network.createHTTPClient({
		onload: function (e) {
			var json = JSON.parse(this.responseText);
			Ti.App.Properties.setObject('app_version_2', json.appversion[0]);
			callback(true);
		},
		onerror: function (e) {
			Ti.API.debug(e.error);
			callback(false);
		},
		timeout: 20000
	});
	client.open('GET', Config.DOMAIN_URL + 'app/version.json');
	client.setRequestHeader('ubqti_api_version', Config.ubqti_api_version);
	client.send();
};




exports.getPlanning = function (callback, params) {
	if (Config.mode == 0) {
		Ti.API.info('xhr.getPlanning->params: ' + JSON.stringify(params));
	}
	var client = Ti.Network.createHTTPClient({
		onload: function (e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.getPlanning: ' + this.responseText);
			}
			var json = JSON.parse(this.responseText);
			callback(json);
		},
		onerror: function (e) {
			Ti.API.debug(e.error);
			callback(false);
		},
		timeout: Config.timeOut
	});

	var token = params['token'];
	var project_id = params['project_id'];
	var ubqti_api_version = Config.ubqti_api_version;

	client.open('GET', Config.SERVER_BASE_URL + 'planification');
	client.setRequestHeader('ubqti_api_version', Config.ubqti_api_version);
	client.setRequestHeader('ubqti_api_token', token);
	client.setRequestHeader('project_id', project_id);
	client.send();
};


exports.nuevo_usuario = function (callback, params, vphoto) {
	//TODO
	if (Config.mode == 0) {
		Ti.API.info('xhr.nuevo_usuario->params: ' + JSON.stringify(params));
	}
	var client = Ti.Network.createHTTPClient({
		onload: function (e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.nuevo_usuario: ' + this.responseText);
			}
			var json = JSON.parse(this.responseText);
			callback(json);
		},
		onerror: function (e) {
			Ti.API.debug(e.error);
			callback(false);
		},
		timeout: Config.timeOut
	});

	var token = params['token'];
	var id_user = params['id_user'];

	var paramsBody = {
		name: params['name'],
		last_name: params['last_name'],
		phone: params['phone'],
		email: params['email'],
		photo_name: params['photo'],
		photo: vphoto
	};
	Ti.API.info('paramsBody: ' + JSON.stringify(paramsBody));

	client.open('PUT', Config.SERVER_BASE_URL + 'user/' + id_user);
	client.setRequestHeader('ubqti_api_version', Config.ubqti_api_version);
	client.setRequestHeader('ubqti_api_token', token);
	client.send(paramsBody);
};

exports.getImageThumb = function (callback, params, default_image) {
	if (Config.mode == 0) {
		Ti.API.info('xhr.getImageThumb->params: ' + JSON.stringify(params));
	}
	var client = Ti.Network.createHTTPClient({
		onload: function (e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.getImageThumb: ' + this.responseText);
			}
			//var json = JSON.parse(this.responseText);
			if (!(this.responseText != null && (this.responseText.length < 200 && 'status' in JSON.parse(this.responseText)))) {
				image = this.responseData;
				imageNormal = null;
				callback(image, params['id_j']);
			}
		},
		onerror: function (e) {
			Ti.API.debug(e.error);
			callback(false);
		},
		timeout: Config.timeOut
	});

	var token = params['token'];
	var id_image = params['id_image'] + Config.hashThumbnail;

	client.open('GET', Config.SERVER_BASE_URL + 'aws?filename=' + id_image + '.png&type=image/png');
	client.setRequestHeader('ubqti_api_version', Config.ubqti_api_version);
	client.setRequestHeader('ubqti_api_token', token);
	client.send();
};

exports.getImage = function (callback, params) {
	if (Config.mode == 0) {
		Ti.API.info('xhr.getImage->params: ' + JSON.stringify(params));
	}
	var client = Ti.Network.createHTTPClient({
		onload: function (e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.getImage: ' + this.responseText);
			}
			//var json = JSON.parse(this.responseText);
			var message = this.responseText;

			var id = params['id'];

			var image = this.responseData;

			callback(image, id);
		},
		onerror: function (e) {
			Ti.API.debug(e.error);
			callback(false);
		},
		timeout: Config.timeOut
	});

	var token = params['token'];
	var id_image = params['id_image'];

	client.open('GET', Config.SERVER_BASE_URL + 'aws?filename=' + id_image + '.png&type=image/png');
	client.setRequestHeader('ubqti_api_version', Config.ubqti_api_version);
	client.setRequestHeader('ubqti_api_token', token);
	client.send();
};

exports.getLogoEmpresa = function (callback, params) {
	//if (Config.mode == 0) {
	Ti.API.info('xhr.getLogoEmpresa->params: ' + JSON.stringify(params));
	//}
	var client = Ti.Network.createHTTPClient({
		onload: function (e) {
			//if (Config.mode == 0) {
			Ti.API.info('xhr.getLogoEmpresa: ' + this.responseText);
			//}
			//var json = JSON.parse(this.responseText);
			var message = this.responseText;

			var id = params['company_id'];

			var image = this.responseData;

			callback(image, id);
		},
		onerror: function (e) {
			Ti.API.debug(e.error);
			callback(false);
		},
		timeout: Config.timeOut
	});

	var token = params['token'];
	var id = params['company_id'];



	client.open('GET', Config.SERVER_BASE_URL + 'imagesGet');
	client.setRequestHeader('ubqti_api_version', Config.ubqti_api_version);
	client.setRequestHeader('ubqti_api_token', token);
	client.setRequestHeader('id', id);
	client.send();
};


exports.getImageLogoProject = function (callback, params) {
	if (Config.mode == 0) {
		Ti.API.info('xhr.getImageLogoProject->params: ' + JSON.stringify(params));
	}
	var client = Ti.Network.createHTTPClient({
		onload: function (e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.getImageLogoProject: ' + this.responseText);
			}
			//var json = JSON.parse(this.responseText);
			image = this.responseData;
			callback(image, params['id_image']);
		},
		onerror: function (e) {
			Ti.API.debug(e.error);
			response = false;
		},
		timeout: Config.timeOut
	});

	var token = params['token'];
	var id_image = params['id_image'];

	client.open('GET', Config.SERVER_BASE_URL + 'aws?filename=' + id_image + '.png&type=image/png');
	client.setRequestHeader('ubqti_api_version', Config.ubqti_api_version);
	client.setRequestHeader('ubqti_api_token', token);
	client.send();
};


exports.getImagePerfil = function (callback, params) {
	if (Config.mode == 0) {
		Ti.API.info('xhr.getImagePerfil->params: ' + JSON.stringify(params));
	}
	var client = Ti.Network.createHTTPClient({
		onload: function (e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.getImagePerfil: ' + this.responseText);
			}
			//var json = JSON.parse(this.responseText);
			image = this.responseData;
			callback(image);
		},
		onerror: function (e) {
			Ti.API.debug(e.error);
			response = false;
		},
		timeout: Config.timeOut
	});

	var token = params['token'];
	var id_image = params['id_image'];

	client.open('GET', Config.SERVER_BASE_URL + 'aws?filename=' + id_image + '.png&type=image/png');
	client.setRequestHeader('ubqti_api_version', Config.ubqti_api_version);
	client.setRequestHeader('ubqti_api_token', token);
	client.send();
};

exports.subirTracing = function (callback, id, pathImages, params, arrayImages, arrayImagesThumb, arrayNameImages, date_update) {
	//TODO
	if (Config.mode == 0) {
		Ti.API.info('xhr.subirTracing->params: ' + JSON.stringify(params));
	}
	var client = Ti.Network.createHTTPClient({
		onload: function (e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.subirTracing: ' + this.responseText);
			}
			var json = JSON.parse(this.responseText);
			callback(id, pathImages, json, date_update);
		},
		onerror: function (e) {
			Ti.API.debug(e.error);
			callback(false);
		},
		timeout: Config.timeOut
	});

	var token = params['token'];
	var id_tracing = params['id_tracing'];

	var paramsBody = {
		info: JSON.stringify(params['info']),
		nameImages: null
	};


	if (arrayImages != null) {
		paramsBody.nameImages = JSON.stringify(arrayNameImages);
		for (var index in arrayImages) {

			if (index == 0) {
				paramsBody.picture1 = arrayImages[index];
				paramsBody.picture1Thumb = arrayImagesThumb[index];
			}
			if (index == 1) {
				paramsBody.picture2 = arrayImages[index];
				paramsBody.picture2Thumb = arrayImagesThumb[index];
			}
			if (index == 2) {
				paramsBody.picture3 = arrayImages[index];
				paramsBody.picture3Thumb = arrayImagesThumb[index];
			}
			if (index == 3) {
				paramsBody.picture4 = arrayImages[index];
				paramsBody.picture4Thumb = arrayImagesThumb[index];
			}
		}
	}



	//Ti.API.info('paramsBody: ' + JSON.stringify(paramsBody));
	client.open('PUT', Config.SERVER_BASE_URL + 'tracking/' + id_tracing);
	client.setRequestHeader('ubqti_api_version', Config.ubqti_api_version);
	client.setRequestHeader('ubqti_api_token', token);
	client.send(paramsBody);
};

exports.authurl = function (callback) {
	var client = Ti.Network.createHTTPClient({
		onload: function (e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.authurl: ' + this.responseText);
			}
			var json = JSON.parse(this.responseText);
			callback(json);
		},
		onerror: function (e) {
			Ti.API.debug(e.error);
			callback(false);
		},
		timeout: 20000
	});
	client.open('GET', Config.SERVER_BASE_URL + 'auth_url');
	client.setRequestHeader('ubqti_api_version', Config.ubqti_api_version);
	client.send();
};

exports.firstlogin = function (callback, params, vphoto) {

	if (Config.mode == 0) {
		Ti.API.info('xhr.firstlogin->params: ' + JSON.stringify(params));
	}
	var client = Ti.Network.createHTTPClient({
		onload: function (e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.firstlogin: ' + this.responseText);
			}
			var json = JSON.parse(this.responseText);
			callback(json);
		},
		onerror: function (e) {
			Ti.API.debug(e.error);
			callback(false);
		},
		timeout: Config.timeOut
	});

	var token = params['token'];

	var paramsBody = {
		name: params['name'],
		last_name: params['last_name'],
		fono: params['phone'],
		email: params['email'],
		password: ""
	};
	if (params['pass'] != null)
		paramsBody['password'] = params['pass'];
	if (vphoto != null)
		paramsBody['imagen_file'] = vphoto;
	Ti.API.info('paramsBody: ' + JSON.stringify(paramsBody));

	client.open('POST', Config.SERVER_BASE_URL + 'firstlogin');
	client.setRequestHeader('Api_version', Config.api_version);
	client.setRequestHeader('Token', token);
	client.send(paramsBody);
};

exports.login = function (callback, params) {

	if (Config.mode == 0) {
		Ti.API.info('xhr.login->params: ' + JSON.stringify(params));
	}
	var client = Ti.Network.createHTTPClient({
		onload: function (e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.login: ' + this.responseText);
			}
			var json = JSON.parse(this.responseText);
			callback(json);
		},
		onerror: function (e) {
			Ti.API.info(this.responseText);
            Ti.API.info(this.status);
			Ti.API.info('ERROR:', e.error);
			callback(false);
		},
		cache : false,
		timeout: Config.timeOut
	});

	var user = params['email'];

	var pass = params['password'];
	Ti.API.info( Config.SERVER_BASE_URL + 'loginsuser/' + user);
	client.open('GET', Config.SERVER_BASE_URL + 'loginsuser/' + user);
	client.setRequestHeader('Cache-Control','no-cache');
	client.setRequestHeader('Cache-Control','no-store');
	client.setRequestHeader('Api_version', Config.api_version);
	client.setRequestHeader('Pass', pass);
	client.send();
};




exports.getSeguimientoFiltroUC = function (callback, params) {
	if (Config.mode == 0) {
		Ti.API.info('xhr.getSeguimientoFiltroUC->params: ' + JSON.stringify(params));
	}
	var client = Ti.Network.createHTTPClient({
		onload: function (e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.getSeguimientoFiltroUC: ' + this.responseText);
			}
			var json = JSON.parse(this.responseText);
			callback(json);
		},
		onerror: function (e) {
			Ti.API.info('ERROR:', e.error);
			callback(false);
		},
		timeout: Config.timeOut
	});
	var token = params['token'];
	var idUC = params['idUC'];
	//TODO
	client.open('GET', Config.SERVER_BASE_URL + 'tracking_uc');
	client.setRequestHeader('ubqti_api_version', Config.ubqti_api_version);
	client.setRequestHeader('ubqti_api_token', token);
	client.setRequestHeader('id_UC', idUC);
	client.send();
};

exports.getWeeklySnapshot = function (callback, params) {
	if (Config.mode == 0) {
		Ti.API.info('xhr.getWeeklySnapshot->params: ' + JSON.stringify(params));
	}
	var client = Ti.Network.createHTTPClient({
		onload: function (e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.getWeeklySnapshot: ' + this.responseText);
			}
			var json = JSON.parse(this.responseText);
			callback(json);
		},
		onerror: function (e) {

			Ti.API.debug(e.error);
			callback(false);
		},
		timeout: Config.timeOut
	});
	var token = params['token'];
	var id_project = params['id_project'];
	var id_area = params['area'];

	client.open('GET', Config.SERVER_BASE_URL + 'weekly_snapshot');
	client.setRequestHeader('ubqti_api_version', Config.ubqti_api_version);
	client.setRequestHeader('ubqti_api_token', token);
	client.setRequestHeader('id_project', id_project);
	client.setRequestHeader('id_area', id_area);
	client.send();
};

exports.getProjectSnapshot = function (callback, params) {
	if (Config.mode == 0) {
		Ti.API.info('xhr.getProjectSnapshot->params: ' + JSON.stringify(params));
	}
	var client = Ti.Network.createHTTPClient({
		onload: function (e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.getProjectSnapshot: ' + this.responseText);
			}
			var json = JSON.parse(this.responseText);
			callback(json);
		},
		onerror: function (e) {

			Ti.API.debug(e.error);
			callback(false);
		},
		timeout: Config.timeOut
	});
	var token = params['token'];
	var id_project = params['id_project'];
	var id_area = params['area'];

	client.open('GET', Config.SERVER_BASE_URL + 'project_snapshot');
	client.setRequestHeader('ubqti_api_version', Config.ubqti_api_version);
	client.setRequestHeader('ubqti_api_token', token);
	client.setRequestHeader('id_project', id_project);
	client.setRequestHeader('id_area', id_area);
	client.send();
};

exports.getContacts = function (callback) {
	var json = {
		response: {
			data: [{
				id: '668c5135-71a5-429f-9990-9eaab55f46f1',
				company_name: 'COCA COLA',
				name: 'Raúl Carreño',
				position: 'Gerente Marketing',
				pic: 'https://randomuser.me/api/portraits/men/44.jpg'
			}, {
				id: '668c5135-71a5-429f-9990-9eaab55f46f1',
				company_name: 'RIPLEY',
				name: 'Marcela Sepúlveda',
				position: 'Gerente Ventas',
				pic: 'https://randomuser.me/api/portraits/women/44.jpg'
			}, {
				id: '668c5135-71a5-429f-9990-9eaab55f46f1',
				company_name: 'ENTEL',
				name: 'Camila Valdebenito',
				position: 'Gerente RR.HH.',
				pic: 'https://randomuser.me/api/portraits/women/40.jpg'
			}]
		}
	};
	setTimeout(function (e) {
		callback(json);
	}, 2000);
};

exports.getProjects = function (callback) {
	var json = {
		response: {
			data: [{
				id: '2f6aa42f-626a-488d-bfd8-214b16010c85',
				name: 'Trazado',
				percentage: '50%',
				medium: 'TV'
			}, {
				id: 'fdde19f9-95f0-44b3-89fc-950e38ad97b0',
				name: 'Yeso',
				percentage: '75%',
				medium: 'WEB'
			}, {
				id: '1d4d6710-1dd4-4fbb-948b-2745f8ad2133',
				name: 'Esquinero',
				percentage: '25%',
				medium: 'TV'
			}]
		}
	};
	setTimeout(function (e) {
		callback(json);
	}, 2000);
};

exports.getOppo = function (callback) {
	var json = {
		response: {
			data: [{
				id: '5f270c91-93f2-4b3e-b474-9b507be8b359',
				date: 1481212800000,
				company_name: 'Coca Cola',
				text: 'Se ha generado una oportunidad en Coca Cola'
			}, {
				id: 'a070ebc3-4e4c-41e6-80c7-62a5cee7c983',
				date: 1481810400000,
				company_name: 'ENTEL',
				text: 'Se ha generado una oportunidad en ENTEL'
			}, {
				id: '9be476f7-eba9-4fb2-82c4-011c13ef9390',
				date: 1482433200000,
				company_name: 'CLARO',
				text: 'Se ha generado una oportunidad en CLARO'
			}]
		}
	};
	setTimeout(function (e) {
		callback(json);
	}, 2000);
};

exports.getCalendarEvents = function (callback, month_id) {
	if (month_id == '12/2016') {
		var json = {
			response: {
				data: [{
					id: '222c7343-f446-40ff-873a-8cb29645525e',
					from: 1481043600000,
					to: 1481050800000,
					title: 'Reunión Señores Papis',
					color: '#8e2090'
				}, {
					id: '86f0d5c5-a266-47b8-8b12-fb2480406392',
					from: 1481893200000,
					to: 1481900400000,
					title: 'Estreno Mucho Lucho',
					color: '#5e5e5e'
				}, {
					id: 'ef4c8dc4-33d8-46fa-abf0-f371dd4b2f87',
					from: 1482328800000,
					to: 1482336000000,
					title: 'Reunión Ámbar',
					color: '#c98e1a'
				}]
			}
		};
	} else {
		var json = {
			response: {
				data: []
			}
		};
	}
	setTimeout(function (e) {
		callback(json, month_id);
	}, 2000);
};

exports.findDateQuincho = function(callback, params) {

	if (Config.mode == 0) {
		Ti.API.info('xhr.findDateQuincho->params: ' + JSON.stringify(params));
	}
	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.findDateQuincho: ' + this.responseText);
			}
			var json = JSON.parse(this.responseText);
			callback(json);
		},
		onerror : function(e) {
			Ti.API.debug(e.error);
			callback(false);
		},
		timeout : Config.timeOut
	});
	var token = params['token'];

	client.open('GET', Config.SERVER_BASE_URL + 'findDateQuincho');
	client.setRequestHeader('Api_version', Config.api_version);
	client.setRequestHeader('Token', token);
	client.send();
};

exports.findDateSalaE = function(callback, params) {

	if (Config.mode == 0) {
		Ti.API.info('xhr.findDateSalaE->params: ' + JSON.stringify(params));
	}
	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.findDateSalaE: ' + this.responseText);
			}
			var json = JSON.parse(this.responseText);
			callback(json);
		},
		onerror : function(e) {
			Ti.API.debug(e.error);
			callback(false);
		},
		timeout : Config.timeOut
	});
	var token = params['token'];

	client.open('GET', Config.SERVER_BASE_URL + 'findDateSalaE');
	client.setRequestHeader('Api_version', Config.api_version);
	client.setRequestHeader('Token', token);
	client.send();
};

exports.findDateSalaR = function(callback, params) {

	if (Config.mode == 0) {
		Ti.API.info('xhr.findDateSalaR->params: ' + JSON.stringify(params));
	}
	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.findDateSalaR: ' + this.responseText);
			}
			var json = JSON.parse(this.responseText);
			callback(json);
		},
		onerror : function(e) {
			Ti.API.debug(e.error);
			callback(false);
		},
		timeout : Config.timeOut
	});
	var token = params['token'];

	client.open('GET', Config.SERVER_BASE_URL + 'findDateSalaR');
	client.setRequestHeader('Api_version', Config.api_version);
	client.setRequestHeader('Token', token);
	client.send();
};

exports.getDashboard = function (callback, params) {

	if (Config.mode == 0) {
		Ti.API.info('xhr.getDashboard->params: ' + JSON.stringify(params));
	}
	var client = Ti.Network.createHTTPClient({
		onload: function (e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.getDashboard: ' + this.responseText);
			}
			var json = JSON.parse(this.responseText);
			callback(json);
		},
		onerror: function (e) {
			Ti.API.debug(e.error);
			callback(false);
		},
		cache: false,
		timeout: Config.timeOut
	});

	var token = params['token'];
	client.open('GET', Config.SERVER_BASE_URL + 'dashboard');
	client.setRequestHeader('Api_version', Config.api_version);
	client.setRequestHeader('Token', token);
	client.setRequestHeader('Cache-Control','no-cache');
	client.setRequestHeader('Cache-Control','no-store');
	client.send();
	/*
	var json = {

		"status": {
			"code": "200",
			"message": "Data Dashboard"
		},
		"response": {
			"count": 2,
			"data": {
				"movimientos": [
					{
						"tipo": 1,
						"nombre": "Javier Moreno",
						"fecha_hora": "20/01/2019 - 14:05hrs.",
						"estado": 1
					},
					{
						"tipo": 2,
						"nombre": "Gasto común",
						"mes": "Agosto",
						"valor": "$73.045",
						"estado": 0
					},
					{
						"tipo": 3,
						"titulo1": "Reservas",
						"titulo2": "Quincho A1",
						"fecha": "22/03/2019",
						"hora": "18:00 - 23:00 hrs."
					}
				],
				"avisos":[
					{
						"titulo1": "REUNIÓN COMITE",
						"titulo2": "GASTOS COMUNES",
						"titulo3": "Hall Piso 1",
						"fecha": "05/04/2019",
						"hora": "20:00 - 21:30 hrs."
					},
					{
						"titulo1": "CORTE DE AGUA",
						"titulo2": "MANTENCIÓN",
						"titulo3": "",
						"fecha": "06/04/2019",
						"hora": "10:00 - 17:00 hrs."
					}
				]
			}
		}

	}; 

	setTimeout(function (e) {
		callback(json);
	}, 2000);*/
};



exports.apiItunnes = function(callback, params) {

	if (Config.mode == 0) {
		Ti.API.info('xhr.findDateSalaR->params: ' + JSON.stringify(params));
	}
	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.findDateSalaR: ' + this.responseText);
			}
			var json = JSON.parse(this.responseText);
			callback(json);
		},
		onerror : function(e) {
			Ti.API.debug(e.error);
			callback(false);
		},
		timeout : Config.timeOut
	});
	var textFind = params['text'];
	
	// Ti.API.info('URL:',  Config.SERVER_BASE_URL + 'search?term='+textFind+'&mediaType=music&limit=20');
	client.open('GET', Config.SERVER_BASE_URL + 'search?term='+textFind+'&mediaType=music&limit=200');
	// client.setRequestHeader('Api_version', Config.api_version);
	// client.setRequestHeader('Token', token);
	client.send();
};

exports.getMusicAlbum = function(callback, params) {

	if (Config.mode == 0) {
		Ti.API.info('xhr.findDateSalaR->params: ' + JSON.stringify(params));
	}
	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.findDateSalaR: ' + this.responseText);
			}
			// var json = JSON.parse(this.responseText);
			callback(this.responseText);
		},
		onerror : function(e) {
			Ti.API.debug(e.error);
			callback(false);
		},
		timeout : Config.timeOut
	});
	var collectionId = params['collectionId'];
	var trackId = params['trackId'];
	
	Ti.API.info('URL:',  'https://geo.itunes.apple.com/us/album/the-journey/id'+collectionId+'?i='+trackId+'&mt=1&app=music');
	client.open('GET', 'http://a1299.phobos.apple.com/us/r30/Music7/v4/3a/a3/01/3aa30184-78e2-7030-c6e0-d33f3d3e21b7/mzaf_3396140578378232458.plus.aac.p.m4a');
	// client.setRequestHeader('Api_version', Config.api_version);
	// client.setRequestHeader('Token', token);
	client.send();
};

