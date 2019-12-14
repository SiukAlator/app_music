var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');
var db = require('/mods/db');
var moment = require('/libs/moment');
var summon = require('/mods/summon');
var helpButton;
var help;

function TracingResponsable(openReady, nav, NameResponsable, IDResponsable, piso, partida) {
	var self;
	var nav;
	var content;

	var work = [];
	var contentArrayBoxColor = [];
	var contentArrayBoxText = [];

	var myGoalsContainer;

	var leftButton;
	var rightButton;

	var clicking;
	var trackerName = 'Profesional de terreno: Open TracingResponsable';
	Config.tracker.addScreenView(trackerName);

	var arraylistColorPorcentaje = [];
	var arraylistTextPorcentaje = [];
	var arraylistPorcentajeBox = [];
	var idTrackingPresionado;

	var flagSeleccionarAvance = false;
	var clickCheckOK = false;
	var paramBoxHeight = '60dp';

	clicking = false;
	var flagOpenCambiarPorcentaje = false;
	var viewCambiarPorcentaje;

	var titleHead = NameResponsable;

	var flagOpenList = false;

	var viewList;

	content = Ti.UI.createView({
		height : Ti.UI.FILL,
		width : Ti.UI.FILL
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
			}
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

		var centerLabel = Ti.UI.createLabel({
			text : titleHead,
			font : Config.headTitle,
			color : Config.titleTextColor,
			center : actionBar
		});

		helpButton = Ti.UI.createView({
			right : '8dp',
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
				clicking = false;
			}
		});

		actionBar.add(leftButton);
		actionBar.add(centerLabel);
		actionBar.add(helpButton);
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
			}
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
			bottom : '60dp',
			layout : 'vertical',
			scrollType : 'vertical'
		});

		if (Config.isAndroid) {
			scroll.top = '40dp';
		} else {
			scroll.top = '0dp';
		}

		/*** Bottom ***/
		var contentLabel = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			layout : 'horizontal',
			left : '19dp'
		});

		var labelBottom1 = Ti.UI.createLabel({
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.colorPrimario2,
			touchEnabled : false,
			text : 'Ocultar'
		});

		var labelBottom2 = Ti.UI.createLabel({
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.white,
			touchEnabled : false,
			text : 'partidas 100%',
			left : '5dp'
		});

		contentLabel.add(labelBottom1);
		contentLabel.add(labelBottom2);

		var boxBottom = Ti.UI.createView({
			height : '60dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorWallpaper1,
			bottom : '0dp'
		});

		boxBottom.add(contentLabel);

		var checkOff = Ti.UI.createView({
			borderColor : Config.colorPrimario2,
			borderRadius : Config.borderRadius,
			backgroundColor : Config.colorWallpaper1,
			right : '19dp',
			height : Config.tamCheckPartidas100,
			width : Config.tamCheckPartidas100,
			touchEnabled : true
		});

		var checkOn = Ti.UI.createImageView({
			image : '/images/192_ticket.png',
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,
			touchEnabled : false,
			top : '2dp',
			bottom : '2dp',
			left : '2dp',
			right : '2dp'
		});

		checkOff.addEventListener('click', function(e) {
			if (clickCheckOK == true) {
				checkOff.removeAllChildren();
				clickCheckOK = false;
				visualizarPartidas100();
			} else {
				checkOff.add(checkOn);
				clickCheckOK = true;
				ocultarPartidas100();
			}
		});

		boxBottom.add(checkOff);

		/*** fin bottom ***/

		myGoalsContainer = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			top : '8dp',
			layout : 'vertical'
		});

		//myGoalsContainer.removeAllChildren();

		var subtitle = Ti.UI.createView({
			height : '40dp',
			width : Ti.UI.FILL,
			top : '0dp'
		});

		var txtSubtitle = Ti.UI.createLabel({
			text : 'Departamentos y partidas',
			font : Config.headTitle,
			color : Config.titleTextColor
		});

		var separator = Ti.UI.createView({
			height : '1dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			bottom : '0dp',
			touchEnabled : false
		});
		subtitle.add(txtSubtitle);
		subtitle.add(separator);

		scroll.add(subtitle);
		scroll.add(myGoalsContainer);

		content.add(scroll);
		content.add(boxBottom);

		self.add(content);

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

		CambiarPorcentaje();
		getDataLocal();

		var leftHelp = [{
			img : '/images/ic_navigate_before_w.png',
			text : 'Volver atrás'
		}];

		var rightHelp = [];

		var mainHelp = [fakeView()];

		var extraHelp = ['Esta pantalla es para cambiar el avance de las partidas en las unidades de control que tiene un determinado responsable.'];

		help = summon.contexthelp(leftHelp, rightHelp, mainHelp, extraHelp);
		self.add(help);

	}

	function fakeView() {

		var contentSP = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Config.heightSwitchPercentage,
			left : Config.widhtPopup,
			right : Config.widhtPopup,
			backgroundColor : Config.white,
			borderRadius : Config.bigborderRadius
		});

		var textMenu = Ti.UI.createView({
			width : Ti.UI.FILL,
			layout : 'vertical',
			height : '50dp',
			top : '0dp',
			touchEnabled : false

		});

		var label = Ti.UI.createLabel({
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.black,
			height : '20dp',
			touchEnabled : false,
			text : L('TracingUC_SeleccionarAvance'),
			top : '15dp'
		});

		var separator = Ti.UI.createView({
			height : '2dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			touchEnabled : false,
			top : '13dp'
		});

		var contentPercentage = Ti.UI.createView({
			width : Ti.UI.SIZE,
			height : '300dp',
			borderRadius : Config.bigborderRadius,
			top : '70dp'

		});

		for (var i = 0; i < 5; i++) {

			var newTop = 60 * i;
			var newHeight = 60 * (i + 1);

			var box = Ti.UI.createView({
				height : '60dp',
				width : '120dp',
				top : newTop,
				touchEnabled : false,
				id : i
			});

			var boxPaint = Ti.UI.createView({
				width : '120dp',
				id : i,
				height : '1dp'
			});

			var percentage = Ti.UI.createLabel({
				font : {
					fontSize : '18dp',
					fontWeight : 'bold'
				},
				color : Config.white,
				height : Ti.UI.SIZE,
				width : Ti.UI.SIZE,
				touchEnabled : false
			});

			if (i == 0) {
				box.setBackgroundColor(Config.colorPercentage0);
				boxPaint.backgroundColor = Config.colorPercentage25;
				percentage.setText('0%');
				boxPaint.bottom = (4 * 60) + 'dp';
			} else if (i == 1) {
				box.setBackgroundColor(Config.colorPercentage25);
				boxPaint.backgroundColor = Config.colorPercentage50;
				percentage.setText('25%');
				boxPaint.bottom = (3 * 60) + 'dp';
			} else if (i == 2) {
				box.setBackgroundColor(Config.colorPercentage50);
				boxPaint.backgroundColor = Config.colorPercentage75;
				percentage.setText('50%');
				boxPaint.bottom = (2 * 60) + 'dp';
			} else if (i == 3) {
				box.setBackgroundColor(Config.colorPercentage75);
				boxPaint.backgroundColor = Config.colorPercentage100;
				percentage.setText('75%');
				boxPaint.bottom = (1 * 60) + 'dp';
			} else if (i == 4) {
				box.setBackgroundColor(Config.colorPercentage100);
				percentage.setText('100%');
				boxPaint.bottom = (0 * 60) + 'dp';
			}

			var separatorBox = Ti.UI.createView({
				height : '5dp',
				width : Ti.UI.FILL,
				backgroundColor : Config.colorBar,
				bottom : '0dp',
				touchEnabled : false
			});

			box.add(percentage);

			if (i != 4) {
				box.add(separatorBox);
			}
			contentPercentage.add(box);
			contentPercentage.add(boxPaint);

		}

		textMenu.add(label);
		textMenu.add(separator);
		contentSP.add(textMenu);
		contentSP.add(contentPercentage);

		return contentSP;

	}

	function CambiarACero() {
		WSSwitchPercentage(0);

		viewCambiarPorcentaje.hide();
		flagSeleccionarAvance = false;
		flagOpenCambiarPorcentaje = false;
	}

	function WSSwitchPercentage(aux) {

		Config.tracker.addEvent({
			category : trackerName,
			action : 'Cambia porcentaje',
			label : 'new window',
			value : 1
		});

		var porcentajeInput;
		if (aux == 0) {
			porcentajeInput = 0;
			arraylistColorPorcentaje[idTrackingPresionado].setBackgroundColor(Config.colorPercentage0);
			arraylistTextPorcentaje[idTrackingPresionado].text = '0%';
			arraylistColorPorcentaje[idTrackingPresionado].porcentaje = 0;
			arraylistPorcentajeBox[idTrackingPresionado].porcentaje = 0;
		} else if (aux == 1) {
			porcentajeInput = 25;
			arraylistColorPorcentaje[idTrackingPresionado].setBackgroundColor(Config.colorPercentage25);
			arraylistTextPorcentaje[idTrackingPresionado].text = '25%';
			arraylistColorPorcentaje[idTrackingPresionado].porcentaje = 25;
			arraylistPorcentajeBox[idTrackingPresionado].porcentaje = 25;
		} else if (aux == 2) {
			porcentajeInput = 50;
			arraylistColorPorcentaje[idTrackingPresionado].setBackgroundColor(Config.colorPercentage50);
			arraylistTextPorcentaje[idTrackingPresionado].text = '50%';
			arraylistColorPorcentaje[idTrackingPresionado].porcentaje = 50;
			arraylistPorcentajeBox[idTrackingPresionado].porcentaje = 50;
		} else if (aux == 3) {
			porcentajeInput = 75;
			arraylistColorPorcentaje[idTrackingPresionado].setBackgroundColor(Config.colorPercentage75);
			arraylistTextPorcentaje[idTrackingPresionado].text = '75%';
			arraylistColorPorcentaje[idTrackingPresionado].porcentaje = 75;
			arraylistPorcentajeBox[idTrackingPresionado].porcentaje = 75;
		} else if (aux == 4) {
			porcentajeInput = 100;
			arraylistColorPorcentaje[idTrackingPresionado].setBackgroundColor(Config.colorPercentage100);
			arraylistTextPorcentaje[idTrackingPresionado].text = '100%';
			arraylistColorPorcentaje[idTrackingPresionado].porcentaje = 100;
			arraylistPorcentajeBox[idTrackingPresionado].porcentaje = 100;
		}

		var codeInput = 'tracking';
		var listaTrackingUC_Complete = db.selectGENERAL(codeInput);
		var listaTrackingUC = listaTrackingUC_Complete.values;

		for (var index in listaTrackingUC) {
			if (listaTrackingUC[index].ID == idTrackingPresionado) {
				listaTrackingUC[index].info.progress = porcentajeInput;
				var params = {
					code : codeInput,
					name : '',
					values : listaTrackingUC
				};
				db.updateGENERAL(params);
				/*Actualización en tracing*/
				codeInput = 'tracking';
				var listaTrackingComplete = db.selectTRACING(idTrackingPresionado);

				var flagExiste = false;

				for (var zindex in listaTrackingComplete) {
					flagExiste = true;
				}

				if (flagExiste == true) {
					Ti.API.info("TracingPartida: Existe!");
					if (listaTrackingComplete.code == idTrackingPresionado) {
						var listaTracking = listaTrackingComplete.values;
						listaTracking.progress = porcentajeInput;
						var params = {
							code : idTrackingPresionado,
							name : '',
							values : listaTracking
						};

						db.updateTRACINGPercentage(params);

					}

				} else {

					var structGeolocaton = {
						end : '',
						send : ''
					};

					var pValues = {
						progress : porcentajeInput,
						comments : listaTrackingUC[index].info.comments,
						quality : listaTrackingUC[index].info.quality,
						photos : listaTrackingUC[index].info.photos,
						geolocation : structGeolocaton
					};
					/*
					 Ti.Geolocation.getCurrentPosition(function(loc) {

					 if (loc.success == true) {

					 pValues.geolocation.end = {
					 timestamp : moment.utc().valueOf(),
					 lon : loc.coords.longitude,
					 lat : loc.coords.latitude
					 };
					 } else {
					 pValues.geolocation.end = {
					 error : true
					 };
					 }
					 });*/

					var params = {
						code : idTrackingPresionado,
						name : '',
						values : pValues
					};
					db.insertTRACINGPercentage(params);
				}
			}
		}
	}

	function dummy() {
		//Funcion que solo sirve para efectos
		viewCambiarPorcentaje.hide();
		flagSeleccionarAvance = false;
		flagOpencambiarporcentaje = false;
	}

	var arrayBoxPaint = [];
	function CambiarPorcentaje() {
		flagOpencambiarporcentaje = false;

		viewCambiarPorcentaje = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			top : '0dp',
			backgroundColor : Config.transparenceBlack2,
			visible : false
		});

		viewCambiarPorcentaje.addEventListener('click', function(e) {
			cerrarPopup();
		});

		var contentSP = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Config.heightSwitchPercentage,
			left : Config.widhtPopup,
			right : Config.widhtPopup,
			backgroundColor : Config.white,
			borderRadius : Config.bigborderRadius,
			bubbleParent : false
		});

		var textMenu = Ti.UI.createView({
			width : Ti.UI.FILL,
			layout : 'vertical',
			height : '50dp',
			top : '0dp',
			touchEnabled : false

		});

		var label = Ti.UI.createLabel({
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.black,
			height : '20dp',
			touchEnabled : false,
			text : 'Seleccionar avance',
			top : '15dp'
		});

		var separator = Ti.UI.createView({
			height : '2dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			touchEnabled : false,
			top : '13dp'
		});

		var contentPercentage = Ti.UI.createView({
			width : Ti.UI.SIZE,
			height : '300dp',
			borderRadius : Config.bigborderRadius,
			top : '70dp'

		});

		for (var i = 0; i < 5; i++) {

			var newTop = 60 * i;
			var newHeight = 60 * (i + 1);

			var box = Ti.UI.createView({
				height : '60dp',
				width : '120dp',
				top : newTop,
				touchEnabled : true,
				id : i,
				rippleColor : Config.white,
				callback : WSSwitchPercentage,
				finish : dummy
			});

			var boxPaint = Ti.UI.createView({
				width : '120dp',
				id : i,
				height : '1dp'
			});

			var percentage = Ti.UI.createLabel({
				font : {
					fontSize : '18dp',
					fontWeight : 'bold'
				},
				color : Config.white,
				height : Ti.UI.SIZE,
				width : Ti.UI.SIZE,
				touchEnabled : false
			});

			if (i == 0) {
				box.setBackgroundColor(Config.colorPercentage0);
				boxPaint.backgroundColor = Config.colorPercentage25;
				percentage.setText('0%');
				boxPaint.bottom = (4 * 60) + 'dp';
			} else if (i == 1) {
				box.setBackgroundColor(Config.colorPercentage25);
				boxPaint.backgroundColor = Config.colorPercentage50;
				percentage.setText('25%');
				boxPaint.bottom = (3 * 60) + 'dp';
			} else if (i == 2) {
				box.setBackgroundColor(Config.colorPercentage50);
				boxPaint.backgroundColor = Config.colorPercentage75;
				percentage.setText('50%');
				boxPaint.bottom = (2 * 60) + 'dp';
			} else if (i == 3) {
				box.setBackgroundColor(Config.colorPercentage75);
				boxPaint.backgroundColor = Config.colorPercentage100;
				percentage.setText('75%');
				boxPaint.bottom = (1 * 60) + 'dp';
			} else if (i == 4) {
				box.setBackgroundColor(Config.colorPercentage100);
				percentage.setText('100%');
				boxPaint.bottom = (0 * 60) + 'dp';
			}
			//box.add(boxPaint);
			arrayBoxPercentage.push(box);

			var separatorBox = Ti.UI.createView({
				height : '5dp',
				width : Ti.UI.FILL,
				backgroundColor : Config.colorBar,
				bottom : '0dp',
				touchEnabled : false
			});

			arrayBoxPaint.push(boxPaint);
			box.addEventListener('click', function(e) {
				if (flagSeleccionarAvance == false) {

					flagSeleccionarAvance = true;
					flagOpenCambiarPorcentaje = false;
					var numAnterior;
					if (porcentajePresionado == '0') {
						numAnterior = 0;
					} else if (porcentajePresionado == '25') {
						numAnterior = 1;
					} else if (porcentajePresionado == '50') {
						numAnterior = 2;
					} else if (porcentajePresionado == '75') {
						numAnterior = 3;
					} else if (porcentajePresionado == '100') {
						numAnterior = 4;
					}
					e.source.params = e.source.id;
					ripple.effect(e);
					/*
					 if (e.source.id == 0) {
					 if (numAnterior == e.source.id) {
					 ripple.effect(e);
					 } else {

					 arrayBoxPaint[e.source.id].backgroundColor = '#80' + Config.colorPercentage0.split('#')[1];
					 arrayBoxPaint[e.source.id].bottom = ((4 - parseInt(e.source.id)) * 60) + 'dp';

					 arrayBoxPaint[e.source.id].height = '1dp';

					 var auxColor;
					 var anime = Ti.UI.createAnimation({
					 height : (((parseInt(e.source.id) + 1) * 60)) + 'dp',
					 duration : 820
					 });

					 var anime2 = Ti.UI.createAnimation({
					 duration : 250,
					 backgroundColor : '#80' + Config.white.split('#')[1]
					 });

					 var anime3 = Ti.UI.createAnimation({
					 duration : 100,
					 backgroundColor : '#FF' + e.source.backgroundColor.split('#')[1]
					 });

					 arrayBoxPaint[e.source.id].animate(anime);

					 anime.addEventListener('complete', function() {
					 arrayBoxPaint[e.source.id].bottom = ((4 - parseInt(e.source.id)) * 60) + 'dp';
					 arrayBoxPaint[e.source.id].height = ((parseInt(e.source.id) + 1) * 60) + 'dp';
					 arrayBoxPercentage[e.source.id].backgroundColor = Config.colorPercentage0;
					 auxColor = arrayBoxPaint[e.source.id].getBackgroundColor();
					 //anime3.backgroundColor = '#FF' + e.source.backgroundColor.split('#')[1];
					 arrayBoxPaint[e.source.id].animate(anime2);
					 });

					 anime2.addEventListener('complete', function() {
					 arrayBoxPaint[e.source.id].animate(anime3);
					 });

					 anime3.addEventListener('complete', function() {
					 WSSwitchPercentage(e.source.id);
					 viewCambiarPorcentaje.hide();
					 flagSeleccionarAvance = false;
					 clicking = false;
					 flagOpencambiarporcentaje = false;
					 arrayBoxPaint[e.source.id].bottom = '0dp';
					 arrayBoxPaint[e.source.id].height = '1dp';
					 arrayBoxPaint[e.source.id].backgroundColor = auxColor;
					 });

					 }

					 } else {

					 var colorAnterior = arrayBoxPaint[e.source.id].backgroundColor;
					 var colorNuevo = arrayBoxPaint[e.source.id - 1].backgroundColor;
					 arrayBoxPaint[e.source.id].backgroundColor = '#80' + colorNuevo.split('#')[1];
					 arrayBoxPaint[e.source.id].bottom = ((4 - parseInt(e.source.id)) * 60) + 'dp';

					 arrayBoxPaint[e.source.id].height = '1dp';

					 var anime = Ti.UI.createAnimation({
					 height : (((parseInt(e.source.id) + 1) * 60)) + 'dp',
					 duration : 820
					 });

					 var anime2 = Ti.UI.createAnimation({
					 duration : 250,
					 backgroundColor : '#80' + Config.white.split('#')[1]
					 });

					 var anime3 = Ti.UI.createAnimation({
					 duration : 100,
					 backgroundColor : '#FF' + e.source.backgroundColor.split('#')[1]
					 });

					 arrayBoxPaint[e.source.id].animate(anime);

					 anime.addEventListener('complete', function() {
					 //anime3.backgroundColor = '#FF' + e.source.backgroundColor.split('#')[1];
					 arrayBoxPaint[e.source.id].animate(anime2);
					 });

					 anime2.addEventListener('complete', function() {
					 arrayBoxPaint[e.source.id].animate(anime3);
					 });

					 anime3.addEventListener('complete', function() {
					 WSSwitchPercentage(e.source.id);
					 viewCambiarPorcentaje.hide();
					 flagSeleccionarAvance = false;
					 flagOpencambiarporcentaje = false;
					 clicking = false;
					 arrayBoxPaint[e.source.id].bottom = '0dp';
					 arrayBoxPaint[e.source.id].height = '1dp';
					 arrayBoxPaint[e.source.id].backgroundColor = colorAnterior;
					 });

					 }*/

				}

			});

			box.add(percentage);

			if (i != 4) {
				box.add(separatorBox);
			}
			contentPercentage.add(box);
			contentPercentage.add(boxPaint);

		}

		textMenu.add(label);
		textMenu.add(separator);
		contentSP.add(textMenu);
		contentSP.add(contentPercentage);
		viewCambiarPorcentaje.add(contentSP);

		self.add(viewCambiarPorcentaje);

	}

	var porcentajePresionado;

	function VisibleCambiarPorcentaje() {
		/*
		 if (porcentajePresionado == '0') {
		 arrayBoxPercentage[0].setBackgroundColor(Config.colorPercentage0);
		 arrayBoxPercentage[1].setBackgroundColor(Config.colorPercentage25);
		 arrayBoxPercentage[2].setBackgroundColor(Config.colorPercentage50);
		 arrayBoxPercentage[3].setBackgroundColor(Config.colorPercentage75);
		 arrayBoxPercentage[4].setBackgroundColor(Config.colorPercentage100);
		 } else if (porcentajePresionado == '25') {
		 arrayBoxPercentage[0].setBackgroundColor(Config.colorPercentage25);
		 arrayBoxPercentage[1].setBackgroundColor(Config.colorPercentage25);
		 arrayBoxPercentage[2].setBackgroundColor(Config.colorPercentage50);
		 arrayBoxPercentage[3].setBackgroundColor(Config.colorPercentage75);
		 arrayBoxPercentage[4].setBackgroundColor(Config.colorPercentage100);
		 } else if (porcentajePresionado == '50') {
		 arrayBoxPercentage[0].setBackgroundColor(Config.colorPercentage50);
		 arrayBoxPercentage[1].setBackgroundColor(Config.colorPercentage50);
		 arrayBoxPercentage[2].setBackgroundColor(Config.colorPercentage50);
		 arrayBoxPercentage[3].setBackgroundColor(Config.colorPercentage75);
		 arrayBoxPercentage[4].setBackgroundColor(Config.colorPercentage100);
		 } else if (porcentajePresionado == '75') {
		 arrayBoxPercentage[0].setBackgroundColor(Config.colorPercentage75);
		 arrayBoxPercentage[1].setBackgroundColor(Config.colorPercentage75);
		 arrayBoxPercentage[2].setBackgroundColor(Config.colorPercentage75);
		 arrayBoxPercentage[3].setBackgroundColor(Config.colorPercentage75);
		 arrayBoxPercentage[4].setBackgroundColor(Config.colorPercentage100);
		 } else if (porcentajePresionado == '100') {
		 arrayBoxPercentage[0].setBackgroundColor(Config.colorPercentage100);
		 arrayBoxPercentage[1].setBackgroundColor(Config.colorPercentage100);
		 arrayBoxPercentage[2].setBackgroundColor(Config.colorPercentage100);
		 arrayBoxPercentage[3].setBackgroundColor(Config.colorPercentage100);
		 arrayBoxPercentage[4].setBackgroundColor(Config.colorPercentage100);
		 }*/

		viewCambiarPorcentaje.show();
		flagOpenCambiarPorcentaje = true;
	}

	var partidaSeleccionada;
	var porcentajeSeleccionado;
	var deptoSeleccionado;
	function openDetail() {

		Ti.API.info("Se abre detalle:" + partidaSeleccionada);
		var subTitle = 'Departamento ' + deptoSeleccionado;
		var Window = require('/ui/p_propietario/detallePartida');
		var idView = 1;
		if (Config.isAndroid) {
			new Window(nav, partidaSeleccionada, subTitle, porcentajeSeleccionado, idTrackingPresionado, idView, self, null);
		} else {
			new Window(nav, partidaSeleccionada, subTitle, porcentajeSeleccionado, idTrackingPresionado, idView, self, refresh);
		}

	}

	var arrayBoxPercentage = [];
	function addData(partidas, index) {
		var local = Config.locale;

		var box = Ti.UI.createView({
			height : paramBoxHeight,
			width : Ti.UI.FILL,
			rippleColor : Config.white,
			callback : openDetail,
			finish : finish,
			partida : partidas.multilang[local].name,
			depto : partidas.name,
			porcentaje : partidas.info.progress,
			idTracking : partidas.ID
		});

		var textMenu = Ti.UI.createView({
			width : Ti.UI.FILL,
			layout : 'horizontal',
			height : Ti.UI.SIZE,
			left : '0dp',
			id : index,
			touchEnabled : false
		});

		box.addEventListener('click', function(e) {

			if (clicking == false) {
				clicking = true;
				porcentajeSeleccionado = e.source.porcentaje;
				deptoSeleccionado = e.source.depto;
				partidaSeleccionada = e.source.partida;
				idTrackingPresionado = e.source.idTracking;
				ripple.effect(e);
			}
		});

		var rowBoxOrange = Ti.UI.createView({
			backgroundColor : Config.colorPrimario2,
			height : Config.heightRowBoxOrange,
			width : '4dp',
			rippleColor : Config.white,
			touchEnabled : false
		});

		var label = Ti.UI.createLabel({
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.sidemenuTextColor,
			height : 'auto',
			width : '210dp',
			left : '15dp',
			touchEnabled : false,
			text : partidas.name + '\n' + partidas.multilang[local].name
		});

		var boxPercentage = Ti.UI.createView({
			borderRadius : '10dp',
			borderWidth : '0dp',
			height : '40dp',
			width : '60dp',
			right : '19dp',
			rippleColor : Config.white,
			callback : VisibleCambiarPorcentaje,
			finish : finish,
			porcentaje : partidas.info.progress,
			idTracking : partidas.ID
		});

		boxPercentage.addEventListener('click', function(e) {
			if (clicking == false) {
				porcentajePresionado = e.source.porcentaje;
				idTrackingPresionado = e.source.idTracking;
				clicking = true;
				ripple.effect(e);
			}

		});

		var percentage = Ti.UI.createLabel({
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.white,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			touchEnabled : false,
			text : partidas.info.progress + '%'
		});

		contentArrayBoxColor.push(boxPercentage);
		contentArrayBoxText.push(percentage);

		if (partidas.info.progress == '0') {
			boxPercentage.setBackgroundColor(Config.colorPercentage0);
		} else if (partidas.info.progress == '25') {
			boxPercentage.setBackgroundColor(Config.colorPercentage25);
		} else if (partidas.info.progress == '50') {
			boxPercentage.setBackgroundColor(Config.colorPercentage50);
		} else if (partidas.info.progress == '75') {
			boxPercentage.setBackgroundColor(Config.colorPercentage75);
		} else if (partidas.info.progress == '100') {
			boxPercentage.setBackgroundColor(Config.colorPercentage100);
		}

		var separatorTable = Ti.UI.createView({
			height : '2dp',
			width : Ti.UI.FILL,
			touchEnabled : false,
			backgroundColor : Config.colorBar,
			bottom : '0dp'
		});

		textMenu.add(rowBoxOrange);
		textMenu.add(label);
		boxPercentage.add(percentage);
		//textMenu.add(boxPercentage);

		arraylistColorPorcentaje[partidas.ID] = boxPercentage;
		arraylistTextPorcentaje[partidas.ID] = percentage;
		arraylistPorcentajeBox[partidas.ID] = box;

		box.add(textMenu);
		box.add(boxPercentage);
		box.add(separatorTable);
		arrayboxPartida.push(box);
		myGoalsContainer.add(box);

	}

	var arrayboxPartida = [];
	function ocultarPartidas100() {

		for (var index in arrayboxPartida) {

			if (arrayboxPartida[index].porcentaje == '100') {

				var respIndex = index;

				if (Config.isAndroid) {

					arrayboxPartida[index].animate(Ti.UI.createAnimation({
						duration : 160,
						height : '0dp'
					}), function(e) {
						Ti.API.log(respIndex);
						arrayboxPartida[respIndex].height = '0dp';
						arrayboxPartida[respIndex].hide();
					});

				} else {
					arrayboxPartida[respIndex].height = '0dp';
					arrayboxPartida[respIndex].hide();
				}

			}

		}

	}

	function visualizarPartidas100() {

		for (var index in arrayboxPartida) {

			if (arrayboxPartida[index].porcentaje == '100') {
				arrayboxPartida[index].show();
				arrayboxPartida[index].height = '1dp';
				if (Config.isAndroid) {

					arrayboxPartida[index].animate(Ti.UI.createAnimation({
						duration : 160,
						height : paramBoxHeight
					}));

				} else {
					arrayboxPartida[index].height = paramBoxHeight;
				}
			}
		}

	}

	function cerrarPopup() {

		if (flagOpenCambiarPorcentaje == true) {
			viewCambiarPorcentaje.hide();
			flagOpenCambiarPorcentaje = false;
		}
		if (flagOpenList == true) {
			viewList.hide();
			flagOpenList = false;
		}
	}

	function close() {
		self.close();
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
			buttonNames : ['Cerrar', 'Cancelar'],
			message : '¿Seguro que quiere cerrar su sesión y salir?',
			title : 'Cerrar Sesión'
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
		var flag = false;
		if (flagOpenCambiarPorcentaje == true) {
			viewCambiarPorcentaje.hide();
			flagOpenCambiarPorcentaje = false;
			flag = true;

		}
		if (flagOpenList == true) {
			viewList.hide();
			flagOpenList = false;
			flag = true;
		}
		if (flag == false) {
			e.cancelBubble = true;
			if (clicking == false) {
				clicking = true;
				ripple.round({
					source : leftButton
				});
			}
		}

	});

	function gotData(result) {
		if (result == false) {
		} else {

			if (result == false) {

				for (var w in work) {
					work[w].hide();
				}

				var dialog = Ti.UI.createAlertDialog({
					title : 'Revise su conexión a Internet',
					message : 'no hemos podido comunicarnos con el servidor, por favor compruebe que está conectado a internet.',
					ok : 'OK'
				});
				dialog.show();

			} else {

				switch(result.status.code) {

				case 200:
					addData(result.response.data);
					break;
				default:
					Ti.API.info('result.status.code: ' + result.status.code);
					for (var w in work) {
						work[w].hide();
					}

					var dialog = Ti.UI.createAlertDialog({
						title : 'Error inesperado',
						message : 'por favor inténtelo nuevamente en unos minutos o contáctese con el administrador del sistema.',
						ok : 'CERRAR'
					});
					dialog.show();
					break;
				}
			}

		}
		for (var index in work) {
			work[index].hide();
		}
	}

	function getData() {
		for (var index in work) {
			Ti.API.info("ECHO: getData()");
			work[index].show();
		}

		var vartoken = Ti.App.Properties.getString('me', null);
		var params = {
			token : vartoken,
			responsable : responsable,
			piso : piso,
			partida : partida
		};
		xhr.getSeguimientoFiltroResponsable(gotData, params);
	}

	function refresh(idTrackingInput, percentageInput) {

		for (var index in contentArrayBoxColor) {
			if (contentArrayBoxColor[index].idTracking == idTrackingInput) {

				if (percentageInput == 0) {
					contentArrayBoxColor[index].setBackgroundColor(Config.colorPercentage0);
				} else if (percentageInput == 25) {
					contentArrayBoxColor[index].setBackgroundColor(Config.colorPercentage25);
				} else if (percentageInput == 50) {
					contentArrayBoxColor[index].setBackgroundColor(Config.colorPercentage50);
				} else if (percentageInput == 75) {
					contentArrayBoxColor[index].setBackgroundColor(Config.colorPercentage75);
				} else if (percentageInput == 100) {
					contentArrayBoxColor[index].setBackgroundColor(Config.colorPercentage100);
				}

				contentArrayBoxText[index].text = percentageInput + '%';

			}

		}

		for (var index in arrayboxPartida) {
			if (arrayboxPartida[index].idTracking == idTrackingInput) {

				if (percentageInput == 0) {
					arrayboxPartida[index].porcentaje = '0';
				} else if (percentageInput == 25) {
					arrayboxPartida[index].porcentaje = '25';
				} else if (percentageInput == 50) {
					arrayboxPartida[index].porcentaje = '50';
				} else if (percentageInput == 75) {
					arrayboxPartida[index].porcentaje = '75';
				} else if (percentageInput == 100) {
					arrayboxPartida[index].porcentaje = '100';
				}

			}
		}

	}

	function showHelp() {
		help.animate_show();
	}

	function getDataLocal() {
		var local = Config.locale;
		var vartoken = Ti.App.Properties.getString('me', null);

		var code = 'tracking';
		var listaTrackingUC_Complete = db.selectGENERAL(code);
		var listaTrackingUC = listaTrackingUC_Complete.values;
		var j = 0;
		for (var index in listaTrackingUC) {
			if (listaTrackingUC[index].id_resp == IDResponsable) {
				if (piso == L('PlanningFilters_hintTextAll1')) {
					if (partida == L('PlanningFilters_hintTextAll1')) {
						addData(listaTrackingUC[index], j);
					} else if (listaTrackingUC[index].multilang[local].name.toUpperCase() == partida.toUpperCase()) {
						addData(listaTrackingUC[index], j);
					}
				} else if (listaTrackingUC[index].cuc[local].value.toUpperCase() == piso.toUpperCase()) {
					if (partida == L('PlanningFilters_hintTextAll1')) {
						addData(listaTrackingUC[index], j);
					} else if (listaTrackingUC[index].multilang[local].name.toUpperCase() == partida.toUpperCase()) {
						addData(listaTrackingUC[index], j);
					}
				}
				j = j + 1;
			}
		}

		if (Config.isAndroid) {
			self.open();
		} else {
			nav.openWindow(self);
		}

	}

	construct();
	self.addEventListener('open', function(e) {
		openReady();
	});

	self.refresh = refresh;

}

module.exports = TracingResponsable;
