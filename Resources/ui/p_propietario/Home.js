var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');
var xhr = require('/mods/xhr');
var db = require('/mods/db');
var MasterQuery = require('/mods/MasterQuery');
if (Config.isAndroid) {
	//var async = require('/mods/async');
	var SECONDS = 10;
	var intent = Titanium.Android.createServiceIntent(
		{
			url: 'someService.js'
		});
	intent.putExtra('interval', SECONDS * 1000);
	Titanium.Android.startService(intent);
} else {
	var async = require('/mods/async');
}
var moment = require('/libs/moment');
var summon = require('/mods/summon');

moment.locale('es');

var self;
var nav;
var content;
var work = [];
var help;

var myGoalsContainer;

var leftButton;
var helpButton;

var clicking2;
var dataWeekly;
var dataProject;
var flagNoData = false;
var actionBar;



function Home(drawer) {

	// var trackerName = 'Profesional de terreno: Open Home';
	// Config.tracker.addScreenView(trackerName);
	// db.checkDB();
	// db.initKEY();
	// db.updateKEYVAL({
	// 	ubqti_api_token: Ti.App.Properties.getString('me', null)
	// });

	//modTracking.startTracking();

	clicking2 = false;

	content = Ti.UI.createView({
		height: Ti.UI.FILL,
		width: Ti.UI.FILL,
		layout: 'vertical',
		backgroundColor: Config.colorWallpaper1

	});

	var titleHead = 'Home';

	if (Config.isAndroid) {

		self = Ti.UI.createView({
			backgroundColor: Config.backgroundColor,
			height: Ti.UI.FILL,
			width: Ti.UI.FILL
		});

		var barHeight = '40dp';
		var barMargin = '25%';

		var actionBar = Ti.UI.createView({
			top: 0,
			height: Config.barHeight,
			width: Ti.UI.FILL
		});

		leftButton = Ti.UI.createView({
			left: '4dp',
			borderRadius: '20dp',
			height: '40dp',
			width: '40dp',
			backgroundImage: '/images/ic_menu_w.png',
			rippleColor: Config.white,
			callback: openMenu,
			finish: finish
		});

		leftButton.addEventListener('click', function (e) {
			if (clicking2 == false) {
				clicking2 = true;
				ripple.round(e);
			}
		});

		var centerLabel = Ti.UI.createLabel({
			text: titleHead,
			font: Config.headTitle,
			color: Config.titleTextColor,
			center: actionBar
		});

		helpButton = Ti.UI.createView({
			right: '4dp',
			borderRadius: '20dp',
			height: '40dp',
			width: '40dp',
			backgroundImage: '/images/192_ayuda.png',
			rippleColor: Config.white,
			callback: showHelp,
			finish: finish
		});

		helpButton.addEventListener('click', function (e) {
			if (clicking2 == false) {
				clicking2 = true;
				ripple.round(e);
			}
		});

		actionBar.add(leftButton);
		actionBar.add(centerLabel);
		//actionBar.add(helpButton);

		content.add(actionBar);
	} else {

		leftButton = Ti.UI.createButton({
			backgroundImage: '/images/ic_menu_w.png',
			height: 'auto',
			width: 'auto'
		});
		leftButton.addEventListener('click', function () {
			if (clicking2 == false) {
				openMenu();
			}
		});

		helpButton = Ti.UI.createButton({
			backgroundImage: '/images/192_ayuda.png',
			height: 'auto',
			width: 'auto'
		});

		helpButton.addEventListener('click', function (e) {
			if (clicking2 == false) {
				showHelp();
			}
		});

		self = Ti.UI.createWindow({
			title: titleHead,
			navBarHidden: false,
			exitOnClose: true,
			leftNavButtons: [leftButton],
			rightNavButtons: [helpButton],
			windowSoftInputMode: Config.softInput,
			backgroundColor: Config.backgroundColor,
			barColor: Config.actionbarBackgroundColor,
			navTintColor: Config.titleButtonColor,
			orientationModes: Config.orientation,
			titleAttributes: {
				color: Config.titleTextColor,
				fontWeight: 'bold'
			}
		});

		var bg_image = Ti.UI.createImageView({
			image: Config.wallpaperApp,
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			top: '0dp'
		});

		self.add(bg_image);

		nav = Ti.UI.iOS.createNavigationWindow({
			window: self
		});

	}

	var barShadow = Ti.UI.createView({
		backgroundColor: Config.shadowColor,
		top: '0dp',
		height: Config.shadowHeight,
		width: Ti.UI.FILL
	});

	content.add(barShadow);
	var scroll1;
	var scroll2;
	var scrollableView;
	var barb1;
	var labelb1;
	var barb2;
	var labelb2;
	var globo2;
	var labelGlobo2;
	var countAvisos = 0;

	function construct() {

		scroll1 = Ti.UI.createScrollView({
			showVerticalScrollIndicator: true,
			width: Ti.UI.FILL,
			top: '0dp',
			bottom: '0dp',
			layout: 'vertical',
			scrollType: 'vertical',
			backgroundColor: Config.backgroundColor
		});

		scroll2 = Ti.UI.createScrollView({
			showVerticalScrollIndicator: true,
			width: Ti.UI.FILL,
			top: '0dp',
			bottom: '0dp',
			layout: 'vertical',
			scrollType: 'vertical',
			backgroundColor: Config.backgroundColor
		});

		scrollableView = Ti.UI.createScrollableView({
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			top: '0dp',
			cacheSize: 21,
			showPagingControl: false,
			scrollingEnabled: false,
			views: [scroll1, scroll2]
		});

		var myGoalsTitleContainer = Ti.UI.createView({
			backgroundColor: Config.subtitleBackgroundColor,
			borderRadius: Config.subtitleBorderRadius,
			height: Config.subtitleHeight,
			width: Ti.UI.SIZE
		});

		var myGoalsTitleLabel = Ti.UI.createLabel({
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			font: Config.subtitleFont,
			color: Config.subtitleTextColor,
			height: Ti.UI.SIZE,
			width: Ti.UI.SIZE,
			left: '16dp',
			right: '16dp'
		});

		myGoalsTitleContainer.add(myGoalsTitleLabel);

		myGoalsContainer = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: Ti.UI.SIZE,
			top: '8dp',
			layout: 'vertical'
		});

		var myGoalsIndicator = Ti.UI.createActivityIndicator({
			style: Config.isAndroid ? Ti.UI.ActivityIndicatorStyle.BIG_DARK : Ti.UI.ActivityIndicatorStyle.BIG,
			height: '120dp',
			width: '120dp'
		});

		var viewBlack = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			top: '0dp',
			backgroundColor: Config.transparenceBlack2,
			visible: false
		});
		work.push(viewBlack);
		work.push(myGoalsIndicator);
		viewBlack.add(myGoalsIndicator);

		var boxDesa = null;
		if (Config.modeURL == 0) {
			var desaLabel1 = Ti.UI.createLabel({
				text: 'Visitor dev ',
				font: Config.sizeDesa,
				color: Config.color1,
				height: 'auto',
				//width : Ti.UI.FILL,
				top: '0dp',
				left: '0dp',
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				touchEnabled: false
			});

			var desaLabel2 = Ti.UI.createLabel({
				text: 'V' + Config.AppVersion,
				font: Config.sizeDesa,
				color: Config.colorPrimario2,
				height: 'auto',
				//width : 'auto',
				left: '0dp',
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				touchEnabled: false
			});
			boxDesa = Ti.UI.createView({
				top: '0dp',
				left: '0dp',
				height: Ti.UI.SIZE,
				width: Ti.UI.FILL,
				layout: 'horizontal'
			});
			boxDesa.add(desaLabel1);
			boxDesa.add(desaLabel2);
		}

		if (Config.modeURL == 0)
			content.add(boxDesa);
		var header = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: '200dp',
			top: '0dp',
			right: '40dp',
			left: '40dp',
			backgroundColor: Config.colorWallpaper1
		});

		var iconUser = Ti.UI.createImageView({
			right: '100dp',
			height: '30dp',
			width: '30dp',
			top: '35dp',
			image: '/images/user.png'
		});

		var title2 = Ti.UI.createLabel({
			text: 'HOLA!',
			font: {
				fontSize: '30dp',
				fontWeight: 'bold'
			},
			color: Config.color1,
			height: 'auto',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled: false,
			top: '30dp',
			right: '0dp'
		});



		var title1 = Ti.UI.createLabel({
			text: 'BIENVENIDO',
			font: {
				fontSize: '16dp',
				fontWeight: 'bold'
			},
			color: Config.white,
			height: 'auto',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled: false,
			top: '70dp',
			right: '0dp'
		});

		var nameDepto = Ti.App.Properties.getString('name_perfil', null);
		var name = Ti.UI.createLabel({
			text: (Ti.App.Properties.getString('name', new Object) + ' ' + Ti.App.Properties.getString('last_name', new Object)).toUpperCase() + ' - DEPTO ' + nameDepto,
			font: {
				fontSize: '16dp',
				fontWeight: 'bold'
			},
			color: Config.white,
			height: 'auto',
			width: 'auto',
			right: '0dp',
			top: '87dp'
		});

		var boton1 = Ti.UI.createView({
			width: '140dp',
			height: '40dp',
			bottom: '0dp',
			left: '0dp',
			rippleColor: Config.white,
			callback: switchB1,
			finish: finish
		});

		barb1 = Ti.UI.createView({
			width: '100dp',
			height: '5dp',
			bottom: '0dp',
			backgroundColor: Config.color1,
			touchEnabled: false
		});

		labelb1 = Ti.UI.createLabel({
			text: 'MOVIMIENTOS',
			font: {
				fontSize: '20dp',
				fontWeight: 'bold'
			},
			color: Config.color1,
			height: 'auto',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled: false,
			top: '0dp'
		});

		boton1.add(labelb1);
		boton1.add(barb1);

		var boton2 = Ti.UI.createView({
			width: '140dp',
			height: '40dp',
			bottom: '0dp',
			right: '0dp',
			rippleColor: Config.white,
			callback: switchB2,
			finish: finish
		});


		barb2 = Ti.UI.createView({
			width: '100dp',
			height: '5dp',
			bottom: '0dp',
			backgroundColor: Config.color1,
			touchEnabled: false
		});

		globo2 = Ti.UI.createView({
			width: '18dp',
			height: '18dp',
			top: '0dp',
			right: '23dp',
			borderRadius:  '9dp',
			backgroundColor: Config.colorGlobo,
			touchEnabled: false,
			visible: false
		});

		labelGlobo2 = Ti.UI.createLabel({
			text: '1',
			font: {
				fontSize: '15dp',
				fontWeight: 'bold'
			},
			color: Config.white,
			height: 'auto',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled: false
		});

		globo2.add(labelGlobo2);

		labelb2 = Ti.UI.createLabel({
			text: 'AVISOS',
			font: {
				fontSize: '20dp',
				fontWeight: 'bold'
			},
			color: Config.color1,
			height: 'auto',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled: false,
			top: '0dp'
		});

		boton2.addEventListener('click', function (e) {
			if (clicking2 == false) {
				clicking2 = true;
				ripple.effect(e);
				globo2.visible = false;
			}
		});

		boton1.addEventListener('click', function (e) {
			if (clicking2 == false) {
				clicking2 = true;
				ripple.effect(e);
			}
		});

		switchB1();

		boton2.add(labelb2);
		boton2.add(barb2);
		boton2.add(globo2);

		header.add(iconUser);
		header.add(title2);
		header.add(title1);
		header.add(name);
		header.add(boton1);
		header.add(boton2);

		content.add(header);
		content.add(scrollableView);

		self.add(content);
		self.add(viewBlack);

		if (Config.isAndroid) {
			drawer.setCenterWindow(self);
		} else {
			drawer.nav = nav;
			drawer.setCenterWindow(nav);
		}

		var leftHelp = [{
			img: '/images/ic_menu_w.png',
			text: 'Abrir menú'
		}];

		var rightHelp = [];

		var mainHelp1 = [fakeView1()];

		var extraHelp1 = ['Acumulado Programado: Es el porcentaje acumulado total que debiera llevar el proyecto según el programa inicial a la fecha.', 'Acumulado Real: Es el porcentaje acumulado total que lleva el proyecto en base a los avances reales ingresados.', 'Término Programado: Es la fecha de término del proyecto según el programa inicial.', 'Término Estimado: Es la fecha de término estimada en función del avance actual y el ritmo de avance.', 'Atraso: Es la diferencia entre el Término Programado y el Término Real.'];

		var mainHelp2 = [fakeView2()];

		var extraHelp2 = ['Programado: Es el avance semanal programado para la semana en curso según el programa inicial.', 'Real: Es el avance semanal real según lo ingresado hasta el momento.'];

		help = summon.contexthelpDashboard(leftHelp, rightHelp, mainHelp1, extraHelp1, mainHelp2, extraHelp2);
		self.add(help);

		getData();
		

	}

	function switchB2() {
		scrollableView.scrollToView(1);
		barb1.visible = false;
		barb2.visible = true;
		labelb1.color = Config.white;
		labelb2.color = Config.color1;

	}

	function switchB1() {
		scrollableView.scrollToView(0);
		barb2.visible = false;
		barb1.visible = true;
		labelb2.color = Config.white;
		labelb1.color = Config.color1;

	}

	function fakeView1() {

		var contentFakeView = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: Ti.UI.SIZE,
			layout: 'vertical'
		});

		var textTitle = Ti.UI.createView({
			height: Ti.UI.SIZE,
			width: '100dp',
			top: '10dp'
		});

		var labelTitle1 = Ti.UI.createLabel({
			text: L('Home_labelGeneral'),
			font: {
				fontSize: '16dp',
				fontWeight: 'bold'
			},
			color: Config.white,
			height: Ti.UI.SIZE,
			width: Ti.UI.SIZE,
			left: '0dp'
		});

		var fechaActual = Ti.UI.createLabel({
			text: '12/10/2017',
			font: {
				fontSize: '16dp',
				fontWeight: 'bold'
			},
			color: Config.white,
			height: Ti.UI.SIZE,
			width: Ti.UI.SIZE,
			right: '0dp'
		});

		textTitle.add(labelTitle1);
		textTitle.add(fechaActual);

		var marginGraphic = '64dp';
		var heightGraphic = '40dp';
		var marginLeftDataPercentage = '20%';

		var contentGraphic = Ti.UI.createView({
			right: marginGraphic,
			left: marginGraphic,
			height: Ti.UI.SIZE
		});

		var bodyGraphic = Ti.UI.createView({
			height: heightGraphic,
			width: Ti.UI.FILL,
			layout: 'horizontal',
			borderRadius: '10dp',
			borderWidth: '1dp',
			borderColor: Config.colorBorderGraphic,
			backgroundColor: Config.colorGraphic1Back,
			top: '10dp'
		});

		var tableGraphic = Ti.UI.createScrollView({
			width: Ti.UI.FILL,
			top: '10dp',
			layout: 'vertical',
			height: Ti.UI.SIZE
		});

		var porcentaje1 = 45;
		var porcentaje2 = 32;
		var porcentajeN;
		var mayorPorcentaje2 = false;
		if (porcentaje1 < porcentaje2) {
			mayorPorcentaje2 = true;
			var porcentajeN = (porcentaje1 * 100) / porcentaje2;
		} else {
			var porcentajeN = (porcentaje2 * 100) / porcentaje1;
		}

		var frontGraphic1 = Ti.UI.createView({
			height: heightGraphic,
			width: porcentaje1 + '%',
			borderWidth: '0dp',
			borderColor: Config.black,
			backgroundColor: Config.colorGraphic1Front1,
			left: '0dp'
		});

		var frontGraphic2 = Ti.UI.createView({
			height: heightGraphic,
			width: porcentajeN + '%',
			borderWidth: '0dp',
			borderColor: Config.black,
			backgroundColor: Config.colorGraphic1Front2,
			left: '0dp'
		});

		if (mayorPorcentaje2 == false) {
			frontGraphic1.add(frontGraphic2);
			bodyGraphic.add(frontGraphic1);
		} else {
			frontGraphic2.width = porcentaje2 + '%';
			frontGraphic1.width = porcentajeN + '%';
			frontGraphic2.add(frontGraphic1);
			bodyGraphic.add(frontGraphic2);
		}

		contentGraphic.add(bodyGraphic);

		contentFakeView.add(textTitle);
		contentFakeView.add(contentGraphic);
		return contentFakeView;
	}

	function fakeView2() {

		var contentFakeView = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: Ti.UI.SIZE,
			layout: 'vertical'
		});

		var textTitle = Ti.UI.createView({
			height: Ti.UI.SIZE,
			width: '100dp',
			top: '10dp'
		});

		var labelTitle1 = Ti.UI.createLabel({
			text: L('Home_labelSemanal'),
			font: {
				fontSize: '16dp',
				fontWeight: 'bold'
			},
			color: Config.white,
			height: Ti.UI.SIZE,
			width: Ti.UI.SIZE
		});

		textTitle.add(labelTitle1);

		var marginGraphic = '64dp';
		var heightGraphic = '40dp';
		var marginLeftDataPercentage = '20%';

		var contentGraphic = Ti.UI.createView({
			right: marginGraphic,
			left: marginGraphic,
			height: Ti.UI.SIZE
		});

		var bodyGraphic = Ti.UI.createView({
			height: heightGraphic,
			width: Ti.UI.FILL,
			layout: 'horizontal',
			borderRadius: '10dp',
			borderWidth: '1dp',
			borderColor: Config.colorBorderGraphic,
			backgroundColor: Config.colorGraphic1Back,
			top: '10dp'
		});

		var tableGraphic = Ti.UI.createScrollView({
			width: Ti.UI.FILL,
			top: '10dp',
			layout: 'vertical',
			height: Ti.UI.SIZE
		});

		var porcentaje1 = 5.2;
		var porcentaje2 = 1.8;
		var porcentajeN;
		var mayorPorcentaje2 = false;
		var porcentajeN;
		if (porcentaje1 > porcentaje2) {
			porcentajeN = (porcentaje2 * 100) / porcentaje1;
		} else {
			mayorPorcentaje2 = true;
			porcentajeN = (porcentaje1 * 100) / porcentaje2;
		}

		var frontGraphic1 = Ti.UI.createView({
			height: heightGraphic,
			borderWidth: '0dp',
			borderColor: Config.black,
			backgroundColor: Config.colorGraphic2Back,
			left: '0dp'
		});

		var frontGraphic2 = Ti.UI.createView({
			height: heightGraphic,
			borderWidth: '0dp',
			borderColor: Config.black,
			backgroundColor: Config.colorGraphic2Front1,
			left: '0dp'
		});

		if (mayorPorcentaje2 == false) {
			frontGraphic1.width = Ti.API.FILL;
			frontGraphic2.width = porcentajeN + '%';
			frontGraphic1.add(frontGraphic2);
			bodyGraphic.add(frontGraphic1);
		} else {
			frontGraphic2.width = Ti.API.FILL;
			frontGraphic1.width = porcentajeN + '%';
			frontGraphic2.add(frontGraphic1);
			bodyGraphic.add(frontGraphic2);
		}
		contentGraphic.add(bodyGraphic);

		contentFakeView.add(textTitle);
		contentFakeView.add(contentGraphic);
		return contentFakeView;
	}

	function fechaHoy() {
		var selectedDate = new Date();
		var dia = '';
		var mes = '';
		var ano = '';

		var mes_int = selectedDate.getMonth() + 1;
		if (selectedDate.getDate() < 10) {
			dia = '0' + selectedDate.getDate();
		} else {
			dia = selectedDate.getDate();
		}

		if ((mes_int) < 10) {
			mes = '0' + mes_int;
		} else {
			mes = mes_int;
		}

		ano = selectedDate.getFullYear();

		var fechaHoy = dia + "/" + mes + "/" + ano;
		return fechaHoy;

	}

	function formatDateIntApi(dateInput) {
		if (dateInput == '00000000') {
			return '00/00/0000';
		} else {
			return moment.utc(dateInput, 'YYYYMMDD').format("DD/MM/YYYY");
		}
	}

	function formatDate(dateInput) {
		if (dateInput == '0000-00-00T00:00:00.000Z') {
			return '00/00/0000';
		} else {
			return moment.utc(dateInput).format("DD/MM/YYYY");
		}

	}

	function restarDias(fechaMayor, fechaMenor) {

		if (fechaMayor == '0000-00-00T00:00:00.000Z' || fechaMenor == '0000-00-00T00:00:00.000Z') {
			return '0';
		} else {
			var calculo = moment.utc(fechaMayor).diff(moment.utc(fechaMenor), 'days');
			return calculo;
		}

	}





	function getData() {
		for (var index in work) {
			work[index].show();
		}
		var params = {
			token: Ti.App.Properties.getString('me', null)
		};

		xhr.getDashboard(success, params);

	}

	var notificacionPopUp = [];

	function success(result) {
		Ti.API.info('success:', result);
		if (result != false) {
			switch (result.status.code) {
				case "401":
					//TODO
					for (var w in work) {
						work[w].hide();
					}
					var close = Ti.UI.createAlertDialog({
						buttonNames: ['Ok'],
						message: 'Compruebe que no haya iniciado sesión en otro telefono. La aplicación se cerrará automáticamente para que vuelva a iniciar sesión.',
						title: 'Visitor'
					});
					close.addEventListener('click', function (e) {
						if (e.index == 0) {
							Ti.App.Properties.removeAllProperties();
							if (Config.isAndroid) {
								drawer.close();
								Config.drawer.close();
								//var activity = Titanium.Android.currentActivity;
								//activity.finish();

							} else {
								Config.drawer.close();
								drawer.nav.close();
								var Window = require('/ui/Login');
								new Window();
								drawer.close();
							}
						}
					});
					close.show();
					break;
				case "200":
					go(result);
					break;

			}
		}
		else
		{
			for (var w in work) {
				work[w].hide();
			}
			var close = Ti.UI.createAlertDialog({
				buttonNames: ['Ok'],
				message: 'No se ha detectado conexión a internet. Favor verifique su conexión y vuelva a ingresar',
				title: 'Visitor'
			});
			
			close.addEventListener('click', function (e) {
				if (e.index == 0) {
					Ti.App.Properties.removeAllProperties();
					if (Config.isAndroid) {
						drawer.close();
						Config.drawer.close();
						//var activity = Titanium.Android.currentActivity;
						//activity.finish();

					} else {
						Config.drawer.close();
						drawer.nav.close();
						var Window = require('/ui/Login');
						new Window();
						drawer.close();
					}
				}
			});
			close.show();

		}

	}

	function go(result) {
		for (var index in work) {
			work[index].hide();
		}
		scroll1.removeAllChildren();
		scroll2.removeAllChildren();
		var movimientos = result.response.data.movimientos;
		var avisos = result.response.data.avisos;
		Ti.App.Properties.setList('horariosQuincho', result.response.data.configuracion.horarioQuincho);
		Ti.App.Properties.setList('horarioEventos', result.response.data.configuracion.horarioEventos);
		Ti.App.Properties.setList('horarioReuniones', result.response.data.configuracion.horarioReuniones);
		for (var i in movimientos) {
			var content1 = Ti.UI.createView({
				height: '150dp',
				backgroundColor: Config.backgroundColor,
				width: Ti.UI.FILL
			});

			if (i % 2 == 1) {
				content1.backgroundColor = Config.colorWallpaper1;
			}

			/***Primera columna */

			var title1 = Ti.UI.createLabel({
				text: '',
				font: {
					fontSize: '18dp',
					fontWeight: 'bold'
				},
				color: Config.white,
				height: 'auto',
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				touchEnabled: false,
				top: '30dp',
				left: '40dp'
			});

			var title2 = Ti.UI.createLabel({
				text: '',
				font: {
					fontSize: '16dp',
					fontWeight: 'bold'
				},
				color: Config.white,
				height: 'auto',
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				touchEnabled: false,
				top: '57dp',
				left: '40dp'
			});

			var title3 = Ti.UI.createLabel({
				text: '',
				font: {
					fontSize: '14dp',
					fontWeight: 'bold'
				},
				color: Config.white,
				height: 'auto',
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				touchEnabled: false,
				top: '80dp',
				left: '40dp'
			});

			/***Segunda columna */

			var title4 = Ti.UI.createLabel({
				text: '',
				font: {
					fontSize: '15dp'
				},
				color: Config.white,
				height: 'auto',
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				touchEnabled: false,
				top: '74dp',
				right: '40dp'
			});

			var title5 = Ti.UI.createLabel({
				text: '',
				font: {
					fontSize: '15dp'
				},
				color: Config.white,
				height: 'auto',
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				touchEnabled: false,
				top: '74dp',
				right: '40dp'
			});

			var icon = Ti.UI.createImageView({
				height: '40dp',
				width: '40dp',
				top: '35dp',
				right: '50dp',
				image: ''
			});


			if (movimientos[i].tipo == 1) {
				title1.text = 'ÚLTIMA VISITA';
				title2.text = (movimientos[i].nombre).toUpperCase();
				title2.color = Config.color1;
				title3.color = Config.inputHintColor;
				title3.text = (movimientos[i].fecha_hora).toUpperCase();
				//if (movimientos[i].estado == 1) {
				title4.text = 'RECIBIDO';
				icon.image = '/images/check.png';
				//}
				if (db.checkMOVIMIENTOS(movimientos[i].tipo, movimientos[i].id) == false) {
					//params['tipo'], params['id_in'], JSON.stringify(params['data']
					var params = {
						'tipo': movimientos[i].tipo,
						'id_in': movimientos[i].id,
						'data': movimientos[i]
					};
					db.insertMOVIMIENTOS(params);
					notificacionPopUp.push({ 'aviso': title1.text, 'texto1': 'Día ' + (title3.text).split(' ')[0] + '\n a las ' + (title3.text).split(' ')[1] + ' hrs.', 'texto2': 'Usted posee una visita de ' + (title2.text).trim() + '.' });
				}
			}
			else if (movimientos[i].tipo == 2) {
				title1.text = (movimientos[i].nombre).toUpperCase();
				title2.text = (movimientos[i].mes).toUpperCase();
				title3.text = (movimientos[i].valor).toUpperCase();
				title3.font = {
					fontSize: '26dp',
					fontWeight: 'bold'
				};
				title3.color = Config.color1;
				if (movimientos[i].estado == 0) {
					title4.text = 'SIN PAGAR';
					title4.top = '76dp';
					icon.image = '/images/aviso_rojo.png';
					icon.right = '57dp';
				} else
				{
					title4.text = 'PAGO RECIBIDO';
					title4.top = '76dp';
					icon.image = '/images/check.png';
					icon.right = '57dp';
				}
				if (db.checkMOVIMIENTOS(movimientos[i].tipo, movimientos[i].id) == false) {
					//params['tipo'], params['id_in'], JSON.stringify(params['data']
					var params = {
						'tipo': movimientos[i].tipo,
						'id_in': movimientos[i].id,
						'data': movimientos[i]
					};
					db.insertMOVIMIENTOS(params);
					notificacionPopUp.push({ 'aviso': title1.text, 'texto1': 'Mes ' + title2.text, 'texto2': 'Monto ' + title3.text });
				}

			}
			else if (movimientos[i].tipo == 3) {
				title1.text = (movimientos[i].titulo1).toUpperCase();
				title2.text = (movimientos[i].titulo2).toUpperCase();
				title2.color = Config.color1;
				title4.text = (movimientos[i].fecha).toUpperCase();
				title5.text = (movimientos[i].hora).toUpperCase();
				title4.top = '30dp';
				title4.font = {
					fontSize: '16dp'
				};
				title5.top = '50dp';
				title5.font = {
					fontSize: '16dp'
				};

				if (db.checkMOVIMIENTOS(movimientos[i].tipo, movimientos[i].id) == false) {
					//params['tipo'], params['id_in'], JSON.stringify(params['data']
					var params = {
						'tipo': movimientos[i].tipo,
						'id_in': movimientos[i].id,
						'data': movimientos[i]
					};
					db.insertMOVIMIENTOS(params);
					notificacionPopUp.push({ 'aviso': 'Reserva de ' + title2.text, 'texto1': 'Fecha ' + title4.text, 'texto2': 'En el horario de ' + title5.text });
				}
			}

			content1.add(title1);
			content1.add(title2);
			content1.add(title3);
			content1.add(title4);
			content1.add(title5);
			content1.add(icon);

			scroll1.add(content1);

		}

		for (var i in avisos) {
			var content1 = Ti.UI.createView({
				height: '150dp',
				backgroundColor: Config.backgroundColor,
				width: Ti.UI.FILL
			});

			if (i % 2 == 1) {
				content1.backgroundColor = Config.colorWallpaper1;
			}

			/***Primera columna */

			var title1 = Ti.UI.createLabel({
				text: '',
				font: {
					fontSize: '18dp',
					fontWeight: 'bold'
				},
				color: Config.white,
				height: 'auto',
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				touchEnabled: false,
				top: '30dp',
				left: '40dp'
			});

			var title2 = Ti.UI.createLabel({
				text: '',
				font: {
					fontSize: '16dp',
					fontWeight: 'bold'
				},
				color: Config.white,
				height: 'auto',
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				ellipsize: Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
				touchEnabled: false,
				top: '57dp',
				left: '40dp'
			});

			var title3 = Ti.UI.createLabel({
				text: '',
				font: {
					fontSize: '14dp',
					fontWeight: 'bold'
				},
				color: Config.white,
				height: 'auto',
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				ellipsize: Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
				touchEnabled: false,
				top: '80dp',
				left: '40dp'
			});

			/***Segunda columna */

			var title4 = Ti.UI.createLabel({
				text: '',
				font: {
					fontSize: '15dp'
				},
				color: Config.white,
				height: 'auto',
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				touchEnabled: false,
				top: '74dp',
				right: '40dp'
			});

			var title5 = Ti.UI.createLabel({
				text: '',
				font: {
					fontSize: '15dp'
				},
				color: Config.white,
				height: 'auto',
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				touchEnabled: false,
				top: '74dp',
				right: '40dp'
			});

			title1.text = (avisos[i].titulo1).toUpperCase();
			title2.text = (avisos[i].titulo2).toUpperCase();
			title2.color = Config.color1;
			title3.color = Config.inputHintColor;
			title3.text = avisos[i].titulo3 != null ? (avisos[i].titulo3).toUpperCase() : '';

			title4.text = avisos[i].fecha != null ? (avisos[i].fecha).toUpperCase() : '';
			title5.text = avisos[i].hora != null ? (avisos[i].hora).toUpperCase() : '';
			title4.top = '30dp';
			title4.font = {
				fontSize: '16dp'
			};
			title5.top = '50dp';
			title5.font = {
				fontSize: '16dp'
			};

			content1.add(title1);
			content1.add(title2);
			content1.add(title3);
			content1.add(title4);
			content1.add(title5);

			if (db.checkMOVIMIENTOS('avisos', avisos[i].id) == false) {
				//params['tipo'], params['id_in'], JSON.stringify(params['data']
				var params = {
					'tipo': 'avisos',
					'id_in': avisos[i].id,
					'data': avisos[i]
				};
				db.insertMOVIMIENTOS(params);
				//TODO
				countAvisos ++;
				notificacionPopUp.push({ 'aviso': title1.text, 'texto1': title3.text, 'texto2': (title2.text).trim() + '.' });
			}

			scroll2.add(content1);
		}

		if (countAvisos > 0)
		{
			labelGlobo2.text = ''+countAvisos;
			globo2.visible = true;
			
		}
		var j2 = 0;
		var arrayPopPend = [];
		for (var j in notificacionPopUp) {
			var viewPopNot = Ti.UI.createView({
				width: Ti.UI.FILL,
				height: Ti.UI.FILL,
				top: '0dp',
				backgroundColor: Config.transparenceBlack2,
				visible: false,
				touchEnabled: false
			});

			var viewTop = Ti.UI.createView({
				width: Ti.UI.FILL,
				height: '80dp',
				top: '0dp',
				backgroundColor: Config.color1,
				bubbleParent: false,
				touchEnabled: false
			});

			var contentSP = Ti.UI.createView({
				width: Ti.UI.FILL,
				height: Config.heightSwitchPercentage,
				left: Config.widhtPopup,
				right: Config.widhtPopup,
				backgroundColor: Config.white,
				borderRadius: Config.bigborderRadius,
				bubbleParent: false,
				layout: 'vertical',
				touchEnabled: false
			});

			var iconAviso = Ti.UI.createImageView({
				height: '60dp',
				width: '60dp',
				top: '10dp',
				image: '/images/aviso.png'
			});
			viewTop.add(iconAviso);
			contentSP.add(viewTop);

			var titleLabel = Ti.UI.createLabel({
				text: 'AVISO:',
				font: {
					fontSize: '20dp',
					fontWeight: 'bold'
				},
				color: Config.black,
				top: '10dp',
				touchEnabled: false
			});

			var avisoLabel = Ti.UI.createLabel({
				text: (notificacionPopUp[j].aviso).toUpperCase(),
				font: {
					fontSize: '20dp',
					fontWeight: 'bold'
				},
				color: Config.color1,
				top: '0dp',
				touchEnabled: false
			});

			var texto1 = Ti.UI.createLabel({
				text: (notificacionPopUp[j].texto1).toUpperCase(),
				font: {
					fontSize: '20dp',
					fontWeight: 'bold'
				},
				color: Config.black,
				top: '20dp',
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				touchEnabled: false
			});

			var texto2 = Ti.UI.createLabel({
				text: notificacionPopUp[j].texto2,
				font: {
					fontSize: '18dp'
				},
				color: Config.black,
				top: '20dp',
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				touchEnabled: false
			});

			var buttonOk = Ti.UI.createView({
				width: '100dp',
				height: '50dp',
				top: '20dp',
				borderRadius: '30dp',
				backgroundColor: Config.color1,
				bubbleParent: false,
				rippleColor: Config.white,
				callback: dummy,
				finish: finish,
				idPop: j
			});

			var textoButton = Ti.UI.createLabel({
				text: 'OK',
				font: {
					fontSize: '25dp'
				},
				color: Config.white,
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				touchEnabled: false
			});

			buttonOk.add(textoButton);

			contentSP.add(titleLabel);
			contentSP.add(avisoLabel);
			contentSP.add(texto1);
			contentSP.add(texto2);
			contentSP.add(buttonOk);

			buttonOk.addEventListener('click', function (e) {
				ripple.round(e);
				j2++;
				arrayPopPend[e.source.idPop].hide();
				if (j2 < notificacionPopUp.length)
					arrayPopPend[j2].show();
			});

			viewPopNot.add(contentSP);
			arrayPopPend.push(viewPopNot);
			self.add(viewPopNot);
			flagPendiente = true;
		}

		if (arrayPopPend.length > 0)
			arrayPopPend[0].show();
	}


	function openMenu() {
		drawer.toggleLeftWindow();
	}



	function finish() {
		clicking2 = false;
	}

	function showHelp() {
		help.animate_show();
	}

	function dummy() {
		//No hace nada pero es necesaria
	}


	construct();
	Config.getData = getData;
	return self;

}

module.exports = Home;
