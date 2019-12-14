var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');
var db = require('/mods/db');
var moment = require('/libs/moment');
var help;

function SwitchProject(nav, reload) {

	var summon = require('/mods/summon');
	var self;

	var content;

	var work = [];

	var myGoalsContainer;

	var leftButton;
	var helpButton;

	var clicking;

	clicking = false;
	var titleHead = L('SwitchProject_titleHead');

	content = Ti.UI.createView({
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		layout : 'vertical'
	});

	if (Config.isAndroid) {

		self = Ti.UI.createWindow({
			title : titleHead,
			navBarHidden : false,
			exitOnClose : false,
			windowSoftInputMode : Config.softInput,
			backgroundColor : Config.backgroundColor,
			barColor : Config.actionbarBackgroundColor,
			navTintColor : Config.titleButtonColor,
			orientationModes : Config.orientation,
			titleAttributes : {
				color : Config.titleTextColor
			},

		});

		var actionBar = Ti.UI.createView({
			top : '0dp',
			height : Config.barHeight,
			width : Ti.UI.FILL
		});

		leftButton = Ti.UI.createView({
			left : '4dp',
			borderRadius : '20dp',
			height : '40dp',
			width : '40dp',
			backgroundImage : '/images/ic_navigate_before_w.png',
			rippleColor : Config.white,
			callback : close,
			finish : finish
		});

		leftButton.addEventListener('click', function(e) {
			if (clicking == false) {
				clicking = true;
				ripple.round(e);
			}
		});

		helpButton = Ti.UI.createView({
			right : '4dp',
			borderRadius : '20dp',
			height : '40dp',
			width : '40dp',
			backgroundImage : '/images/192_ayuda.png',
			rippleColor : Config.white,
			callback : showHelp,
			finish : finish
		});

		helpButton.addEventListener('click', function(e) {
			if (clicking == false) {
				clicking = true;
				ripple.round(e);
			}
		});

		var centerLabel = Ti.UI.createLabel({
			text : titleHead,
			font : Config.headTitle,
			color : Config.titleTextColor,
			center : actionBar
		});

		actionBar.add(leftButton);
		actionBar.add(helpButton);
		actionBar.add(centerLabel);

		content.add(actionBar);

	} else {

		leftButton = Ti.UI.createButton({
			backgroundImage : '/images/ic_navigate_before_w.png',
			height : 'auto',
			width : 'auto'
		});
		leftButton.addEventListener('click', function() {
			if (clicking == false) {
				close();
			}
		});

		helpButton = Ti.UI.createButton({
			backgroundImage : '/images/192_ayuda.png',
			height : 'auto',
			width : 'auto'
		});

		helpButton.addEventListener('click', function(e) {
			if (clicking == false) {
				showHelp();
			}
		});

		self = Ti.UI.createWindow({
			title : titleHead,
			navBarHidden : false,
			exitOnClose : true,
			leftNavButtons : [leftButton],
			rightNavButtons : [helpButton],
			windowSoftInputMode : Config.softInput,
			backgroundColor : Config.backgroundColor,
			barColor : Config.actionbarBackgroundColor,
			navTintColor : Config.titleButtonColor,
			orientationModes : Config.orientation,
			titleAttributes : {
				color : Config.titleTextColor
			},
		});

	}

	var bg_image = Ti.UI.createImageView({
		image : Config.wallpaperApp,
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		top : '0dp'
	});

	self.add(bg_image);

	var barShadow = Ti.UI.createView({
		backgroundColor : Config.shadowColor,
		top : '0dp',
		height : Config.shadowHeight,
		width : Ti.UI.FILL
	});

	content.add(barShadow);
	var scroll;
	var tableData = [];
	var table;

	function construct() {

		scroll = Ti.UI.createScrollView({
			showVerticalScrollIndicator : true,
			width : Ti.UI.FILL,
			top : '0dp',
			bottom : '0dp',
			layout : 'vertical',
			scrollType : 'vertical'
		});

		myGoalsContainer = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			top : '0dp',
			layout : 'vertical'
		});

		var myGoalsIndicator = Ti.UI.createActivityIndicator({
			style : Config.isAndroid ? Ti.UI.ActivityIndicatorStyle.BIG_DARK : Ti.UI.ActivityIndicatorStyle.BIG,
			height : '120dp',
			width : '120dp'
		});

		var viewBlack = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			top : '0dp',
			backgroundColor : Config.transparenceBlack2,
			visible : false
		});
		work.push(viewBlack);
		work.push(myGoalsIndicator);
		viewBlack.add(myGoalsIndicator);

		self.add(viewBlack);

		getData();

		scroll.add(myGoalsContainer);

		content.add(scroll);

		self.add(content);

		self.add(viewBlack);

		var leftHelp = [{
			img : '/images/ic_navigate_before_w.png',
			text : 'Volver atrás'
		}];

		var rightHelp = [];

		var mainHelp = [fakeView()];

		var extraHelp = ['Esta pantalla es para seleccionar el área de trabajo dentro de un determinado Proyecto en el que se desea trabajar.'];

		help = summon.contexthelp(leftHelp, rightHelp, mainHelp, extraHelp);
		self.add(help);

	}

	function fakeView() {
		var nom_proyecto = 'Condominio dummy';
		var cambio = 0;

		var contentFakeView = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			layout : 'vertical'
		});

		var separatorVNPUp = Ti.UI.createView({
			height : '2dp',
			top : '0dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			touchEnabled : false
		});

		var separatorVNPDown = Ti.UI.createView({
			height : '2dp',
			top : '15dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			touchEnabled : false
		});

		var space = '0dp';
		if (cambio == 1) {
			space = '40dp';
		}

		var vistaNombreProyecto = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			layout : 'vertical',
			backgroundColor : Config.transparenceBlack,
			top : space
		});

		var vistaContentNP = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			layout : 'horizontal',
			top : '15dp'
		});
		var vistaNP = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			layout : 'vertical',
			left : '20dp'
		});

		var proyectoLabel = Ti.UI.createLabel({
			text : L('SwitchProject_proyectoLabel'),
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			left : '0dp',
			color : Config.colorPrimario2,
			height : 'auto',
			width : Ti.UI.SIZE
		});
		var nameProyectoLabel = Ti.UI.createLabel({
			text : nom_proyecto,
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			left : '0dp',
			color : Config.white,
			height : 'auto',
			width : Ti.UI.SIZE
		});

		vistaNP.add(proyectoLabel);
		vistaNP.add(nameProyectoLabel);

		var contentLogo = Ti.UI.createView({
			borderRadius : Config.bigborderRadius,
			height : '70dp',
			width : '120dp',
			left : '16dp',
			touchEnabled : false
		});

		var logo = Ti.UI.createImageView({
			image : '/images/192_attach_photo.png',
			height : '50dp',
			width : '50dp',
			touchEnabled : false
		});

		contentLogo.add(logo);
		vistaContentNP.add(contentLogo);
		vistaContentNP.add(vistaNP);

		vistaNombreProyecto.add(separatorVNPUp);
		vistaNombreProyecto.add(vistaContentNP);
		vistaNombreProyecto.add(separatorVNPDown);
		contentFakeView.add(vistaNombreProyecto);

		var vistaSeleccionarPlanificacion = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			layout : 'vertical',
			backgroundColor : Config.transparenceBlack,
			top : '0dp'
		});

		var textProyecto = Ti.UI.createView({
			width : Ti.UI.SIZE,
			layout : 'horizontal',
			height : Ti.UI.SIZE,
			top : '15dp',
			touchEnabled : false
		});

		var seleccionarLabel = Ti.UI.createLabel({
			text : L('SwitchProject_seleccionarLabel'),
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			left : '0dp',
			color : Config.colorPrimario2,
			height : 'auto',
			width : Ti.UI.SIZE,
			touchEnabled : false
		});
		var s_planificacionLabel = Ti.UI.createLabel({
			text : L('SwitchProject_s_planificacionLabel'),
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			left : '10dp',
			color : Config.white,
			height : 'auto',
			width : Ti.UI.SIZE,
			touchEnabled : false
		});

		textProyecto.add(seleccionarLabel);
		textProyecto.add(s_planificacionLabel);

		var separatorVNPDown2 = Ti.UI.createView({
			height : '2dp',
			top : '15dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			touchEnabled : false
		});

		vistaSeleccionarPlanificacion.add(textProyecto);
		vistaSeleccionarPlanificacion.add(separatorVNPDown2);

		contentFakeView.add(vistaSeleccionarPlanificacion);

		return contentFakeView;

	}

	var arrayImagenLogos = [];

	function headProyecto(IDimagen, nom_proyecto, cambio) {

		var separatorVNPUp = Ti.UI.createView({
			height : '2dp',
			top : '0dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			touchEnabled : false
		});

		var separatorVNPDown = Ti.UI.createView({
			height : '2dp',
			top : '15dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			touchEnabled : false
		});

		var space = '0dp';
		if (cambio == 1) {
			space = '40dp';
		}

		var vistaNombreProyecto = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			layout : 'vertical',
			backgroundColor : Config.transparenceBlack,
			top : space
		});

		var vistaContentNP = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			layout : 'horizontal',
			top : '15dp'
		});
		var vistaNP = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			layout : 'vertical',
			left : '20dp'
		});

		var proyectoLabel = Ti.UI.createLabel({
			text : L('SwitchProject_proyectoLabel'),
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			left : '0dp',
			color : Config.colorPrimario2,
			height : 'auto',
			width : Ti.UI.SIZE
		});
		var nameProyectoLabel = Ti.UI.createLabel({
			text : nom_proyecto,
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			left : '0dp',
			color : Config.white,
			height : 'auto',
			width : Ti.UI.SIZE
		});

		vistaNP.add(proyectoLabel);
		vistaNP.add(nameProyectoLabel);

		var contentLogo = Ti.UI.createView({
			borderRadius : Config.bigborderRadius,
			height : '70dp',
			width : '120dp',
			left : '16dp',
			touchEnabled : false
		});

		var logo = Ti.UI.createImageView({
			image : '/images/192_attach_photo.png',
			height : '50dp',
			width : '50dp',
			touchEnabled : false
		});

		arrayImagenLogos[IDimagen] = logo;

		contentLogo.add(logo);
		vistaContentNP.add(contentLogo);
		vistaContentNP.add(vistaNP);

		if (IDimagen != null) {
			var vartoken = Ti.App.Properties.getString('me', null);
			var params = {
				token : vartoken,
				id_image : IDimagen
			};
			xhr.getImageLogoProject(setImageHeadProject, params);
		}

		vistaNombreProyecto.add(separatorVNPUp);
		vistaNombreProyecto.add(vistaContentNP);
		vistaNombreProyecto.add(separatorVNPDown);
		myGoalsContainer.add(vistaNombreProyecto);

		var vistaSeleccionarPlanificacion = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			layout : 'vertical',
			backgroundColor : Config.transparenceBlack,
			top : '0dp'
		});

		var textProyecto = Ti.UI.createView({
			width : Ti.UI.SIZE,
			layout : 'horizontal',
			height : Ti.UI.SIZE,
			top : '15dp',
			touchEnabled : false
		});

		var seleccionarLabel = Ti.UI.createLabel({
			text : L('SwitchProject_seleccionarLabel'),
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			left : '0dp',
			color : Config.colorPrimario2,
			height : 'auto',
			width : Ti.UI.SIZE,
			touchEnabled : false
		});
		var s_planificacionLabel = Ti.UI.createLabel({
			text : L('SwitchProject_s_planificacionLabel'),
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			left : '10dp',
			color : Config.white,
			height : 'auto',
			width : Ti.UI.SIZE,
			touchEnabled : false
		});

		textProyecto.add(seleccionarLabel);
		textProyecto.add(s_planificacionLabel);

		var separatorVNPDown2 = Ti.UI.createView({
			height : '2dp',
			top : '15dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			touchEnabled : false
		});

		vistaSeleccionarPlanificacion.add(textProyecto);
		vistaSeleccionarPlanificacion.add(separatorVNPDown2);

		myGoalsContainer.add(vistaSeleccionarPlanificacion);

	}

	function setImageHeadProject(imagen, IDimagen) {

		arrayImagenLogos[IDimagen].image = imagen;
		arrayImagenLogos[IDimagen].height = '70dp';
		arrayImagenLogos[IDimagen].width = '120dp';
		arrayImagenLogos[IDimagen].backgroundColor = Config.white;
	}

	var arrayWhiteButton = [];
	var selectOutput;

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
	var IDArea;

	function opcionesHeadProyecto(nombre, cuc_input, id_generado, nom_proyecto, project_id, vcodeArea, vlistaUC, vlistaPartida, vlistaCUC, vlistaResponsable, vtrackingUC, vlistaDayOfWeek, vidArea) {
		var separatorVNPDown = Ti.UI.createView({
			height : '2dp',
			top : '58dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			touchEnabled : false
		});

		var vistaOpcionProyecto = Ti.UI.createView({
			height : '60dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.transparenceBlack,
			top : '0dp',
			id : id_generado,
			rippleColor : Config.white,
			callback : cambiarProyecto,
			finish : finish,
			uc : nombre,
			cuc : cuc_input,
			proyecto : nom_proyecto,
			id_project : project_id,
			pcodeArea : vcodeArea,
			plistaUC : vlistaUC,
			plistaPartida : vlistaPartida,
			plistaCUC : vlistaCUC,
			plistaResponsable : vlistaResponsable,
			ptrackingUC : vtrackingUC,
			plistaDayOfWeek : vlistaDayOfWeek,
			pidArea : vidArea
		});

		var opcionView = Ti.UI.createView({
			height : Ti.UI.SIZE,
			top : '15dp',
			width : Ti.UI.FILL,
			layout : 'horizontal',
			touchEnabled : false
		});

		var rowBoxOrange = Ti.UI.createView({
			backgroundColor : Config.colorPrimario2,
			height : Config.heightRowBoxOrange,
			width : '4dp',
			rippleColor : Config.white,
			touchEnabled : false
		});

		var opcionText = Ti.UI.createLabel({
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.white,
			height : Ti.UI.SIZE,
			width : '180dp',
			left : '15dp',
			touchEnabled : false,

		});

		var whiteButton = Ti.UI.createView({
			backgroundColor : Config.white,
			borderRadius : '14dp',
			height : '28dp',
			width : '28dp',
			right : '19dp',
			touchEnabled : false
		});

		var blackButton = Ti.UI.createView({
			backgroundColor : Config.colorWallpaper2,
			borderRadius : '5dp',
			height : '10dp',
			width : '10dp',
			visible : false,
			touchEnabled : false,
			id : id_generado
		});

		arrayWhiteButton.push(blackButton);

		opcionText.text = nombre;

		vistaOpcionProyecto.addEventListener('click', function(e) {
			for (var index in arrayWhiteButton) {
				arrayWhiteButton[index].visible = false;
				if (arrayWhiteButton[index].id == e.source.id) {
					arrayWhiteButton[index].visible = true;
					selectOutput = arrayWhiteButton[index].id;
					UC = e.source.uc;
					CUC = e.source.cuc;
					nomProyecto = e.source.proyecto;
					IDProyecto = e.source.id_project;
					codeArea = e.source.pcodeArea;
					IDArea = e.source.pidArea;
					lista_UC = e.source.plistaUC;
					lista_partidas = e.source.plistaPartida;
					lista_CUC = e.source.plistaCUC;
					lista_responsable = e.source.plistaResponsable;
					lista_trackingUC = e.source.ptrackingUC;
					lista_dayOfWeek = e.source.plistaDayOfWeek;
				}
			}
			if (clicking == false) {
				clicking = true;
				ripple.effect(e);
			}
		});

		opcionView.add(rowBoxOrange);
		opcionView.add(opcionText);
		whiteButton.add(blackButton);

		vistaOpcionProyecto.add(opcionView);
		vistaOpcionProyecto.add(whiteButton);
		vistaOpcionProyecto.add(separatorVNPDown);

		myGoalsContainer.add(vistaOpcionProyecto);

	}

	function addData(result) {

		if (result == false) {

			for (var w in work) {
				work[w].hide();
			}

			var dialog = Ti.UI.createAlertDialog({
				title : L('SwitchProject_dialog1Title'),
				message : L('SwitchProject_dialog1Message'),
				ok : L('SwitchProject_dialog1Ok')
			});
			dialog.show();

		} else {

			switch(result.status.code) {

			case '200':

				var id_generado = 0;
				var proyectos = result.response.data;
				var firstProject = 0;
				for (var index in proyectos) {

					var nom_proyecto = proyectos[index].name;
					var project_id = proyectos[index].id;
					var urlLogo = proyectos[index].info.logo;
					headProyecto(urlLogo, nom_proyecto, firstProject);
					var areas = proyectos[index].lista_area;
					var listauc = proyectos[index].lista_uc;
					var listacuc = proyectos[index].lista_cuc;
					var listapartida = proyectos[index].lista_partidas;
					var local = Config.locale;
					var listaResponsable = proyectos[index].lista_responsable;
					var listaTrackingUC = proyectos[index].tracking;
					var listaDaysOfWeek = proyectos[index].days_of_week;

					for (var j in areas) {

						var id_areaPush = areas[j].key + "_" + id_generado;

						opcionesHeadProyecto(areas[j].multilang[local].name, areas[j].multilang[local].value, id_areaPush, nom_proyecto, project_id, areas[j].key, listauc, listapartida, listacuc, listaResponsable, listaTrackingUC, listaDaysOfWeek, areas[j].id);
						id_generado = id_generado + 1;
					}

					firstProject = 1;
				}
				break;
			case '401':

				for (var w in work) {
					work[w].hide();
				}

				var dialog = Ti.UI.createAlertDialog({
					title : L('SwitchProject_dialog3Title'),
					message : L('SwitchProject_dialog3Message'),
					ok : L('SwitchProject_dialog3Ok')
				});
				dialog.show();
				break;
			default:

				for (var w in work) {
					work[w].hide();
				}

				var dialog = Ti.UI.createAlertDialog({
					title : L('SwitchProject_dialog2Title'),
					message : L('SwitchProject_dialog2Message'),
					ok : L('SwitchProject_dialog2Ok')
				});
				dialog.show();
				break;
			}
		}

	}

	function close() {
		//
		var idProyectoSeleccionado = Ti.App.Properties.getString('project_id', null);
		if (idProyectoSeleccionado == null) {

			var dialog = Ti.UI.createAlertDialog({
				title : L('SwitchProject_dialog4Title'),
				message : L('SwitchProject_dialog4Message'),
				ok : L('SwitchProject_dialog4Ok')
			});
			dialog.show();
		} else {
			if (Config.isAndroid) {
				self.removeAllSharedElements();
			}
			self.close();

		}

	}

	function openGoal(goal) {
		//
	}

	function finish() {
		clicking = false;
	}

	function exit(rowSwitch) {
		var close = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : [L('SwitchProject_buttonNames1'), L('SwitchProject_buttonNames2')],
			message : L('SwitchProject_Message'),
			title : L('SwitchProject_Title')
		});
		close.addEventListener('click', function(e) {
			if (e.index == 0) {
				Ti.App.Properties.setString('me', null);
				if (Config.isAndroid) {
					Config.drawer.close();
				} else {
					Config.drawer.close();
				}
			}
		});
		close.show();
	}

	self['exit'] = exit;

	self.addEventListener('android:back', function(e) {
		e.cancelBubble = true;
		if (clicking == false) {
			clicking = true;
			ripple.round({
				source : leftButton
			});
		}
	});

	function gotData(result) {
		if (result == false) {
		} else {
			addData(result);
		}
		for (var index in work) {
			work[index].hide();
		}
	}

	function getData() {
		for (var index in work) {
			work[index].show();
		}
		var vartoken = Ti.App.Properties.getString('me', null);
		var params = {
			token : vartoken
		};
		xhr.listadoproyectos(gotData, params);
	}

	function cambiarProyecto() {
		/*Aqui va código llamada a WS*/

		Ti.App.Properties.setString('nom_proyecto_main', nomProyecto);
		Ti.App.Properties.setString('project_id', IDProyecto);
		Ti.App.Properties.setString('CUC', CUC);
		Ti.App.Properties.setString('UC', UC);
		Ti.App.Properties.setString('codeArea', codeArea);
		Ti.App.Properties.setString('area_id', IDArea);
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

		params = [];
		varcode = 'day_of_week';
		varname = '';
		var varvalues2 = [];
		count = 0;
		for (var index in lista_dayOfWeek) {

			varvalues2[count] = lista_dayOfWeek[index];
			count = count + 1;
		}

		params = {
			code : varcode,
			name : varname,
			values : varvalues2
		};
		db.insertGENERAL(params);

		reload();

		close();
	}

	construct();

	if (Config.isAndroid) {
		self.open();
	} else {
		nav.openWindow(self);
	}

	function showHelp() {
		help.animate_show();
	}

}

module.exports = SwitchProject;
