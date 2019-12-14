var db = require('/mods/db');
var xhr = require('/mods/xhr');

exports.callMQ = function() {

	var vartoken = Ti.App.Properties.getString('me', null);
	var idProyectoSeleccionado = Ti.App.Properties.getString('project_id', null);
	var codeAreaSeleccionada = Ti.App.Properties.getString('codeArea', null);

	var UC;
	var CUC;
	var nomProyecto;
	var IDProyecto;
	var codeArea;

	var lista_UC;
	var lista_partidas;
	var lista_CUC;
	var lista_responsable;
	var lista_trackingUC;
	var lista_dayOfWeek;

	function main() {

		if (idProyectoSeleccionado != null) {
			var trackerName = 'Profesional de terreno: Open MasterQuery';
			Config.tracker.addScreenView(trackerName);
			callWS();
		}
	}

	function gotData(result) {
		if (result == false) {
		} else {
			addData(result);
		}
	}

	function callWS() {

		var params = {
			token : vartoken
		};
		xhr.listadoproyectos(gotData, params);
	}

	function addData(result) {
		Ti.API.info('result: ' + JSON.stringify(result));
		if (result.status.code == '200') {

			var proyectos = result.response.data;

			for (var index in proyectos) {
				IDProyecto = proyectos[index].id;
				if (IDProyecto == idProyectoSeleccionado) {
					nomProyecto = proyectos[index].name;
					var areas = proyectos[index].lista_area;
					lista_UC = proyectos[index].lista_uc;
					lista_CUC = proyectos[index].lista_cuc;
					lista_partidas = proyectos[index].lista_partidas;
					var local = Config.locale;
					lista_responsable = proyectos[index].lista_responsable;
					lista_trackingUC = proyectos[index].tracking;
					lista_dayOfWeek = proyectos[index].days_of_week;

					for (var j in areas) {
						if (codeAreaSeleccionada == areas[j].key) {
							codeArea = areas[j].key;
							CUC = areas[j].multilang[local].value;
							UC = areas[j].multilang[local].name;
							loadData();

						}
					}
				}

			}
		} /*else {

			var dialog = Ti.UI.createAlertDialog({
				title : L('login_dialog5Title'),
				message : L('login_dialog5Message'),
				ok : L('login_dialog5Ok')
			});
			dialog.show();

		}*/

	}

	function loadData() {
		/*Aqui va código llamada a WS*/

		Ti.App.Properties.setString('nom_proyecto_main', nomProyecto);
		Ti.App.Properties.setString('project_id', IDProyecto);
		Ti.App.Properties.setString('CUC', CUC);
		Ti.App.Properties.setString('UC', UC);
		Ti.App.Properties.setString('codeArea', codeArea);
		var local = Config.locale;

		//Lista UC
		db.dropGENERAL();

		var varcode;
		var varname;
		var varvalues = [];
		var params = [];

		var count = 0;

		for (var index in lista_UC) {

			if (lista_UC[index].key == codeArea) {
				varcode = lista_UC[index].key;

				varname = '';

				varvalues[count] = lista_UC[index];

				params = {
					code : varcode,
					name : varname,
					values : varvalues
				};

				count = count + 1;

			}

		}

		db.insertGENERAL(params);

		//Lista partida
		params = [];
		varcode = 'PARTIDAS';
		varname = '';
		varvalues = [];
		count = 0;
		for (var index in lista_partidas) {

			varvalues[count] = lista_partidas[index].multilang[local].name;
			count = count + 1;
		}

		params = {
			code : varcode,
			name : varname,
			values : varvalues
		};
		db.insertGENERAL(params);

		//Lista cuc
		params = [];
		varcode = 'CUC';
		varname = '';
		varvalues = [];
		count = 0;
		for (var index in lista_CUC) {

			varvalues[count] = lista_CUC[index].multilang[local].value;
			count = count + 1;
		}

		params = {
			code : varcode,
			name : varname,
			values : varvalues
		};
		db.insertGENERAL(params);

		//Lista responsable

		params = [];
		varcode = 'lista_responsable';
		varname = '';
		varvalues = [];
		count = 0;
		for (var index in lista_responsable) {

			varvalues[count] = lista_responsable[index];
			count = count + 1;
		}

		params = {
			code : varcode,
			name : varname,
			values : varvalues
		};
		db.insertGENERAL(params);

		//Lista tracking uc

		params = [];
		varcode = 'tracking';
		varname = '';
		varvalues = [];
		count = 0;

		params = {
			code : varcode,
			name : varname,
			values : lista_trackingUC
		};
		db.insertGENERAL(params);
		//Ti.API.info('tamañoo:', lista_trackingUC.length);

		//Lista días de la semana

		params = [];
		varcode = 'day_of_week';
		varname = '';
		varvalues = [];
		count = 0;
		for (var index in lista_dayOfWeek) {

			varvalues[count] = lista_dayOfWeek[index];
			count = count + 1;
		}

		params = {
			code : varcode,
			name : varname,
			values : varvalues
		};
		db.insertGENERAL(params);
	}

	main();

};

