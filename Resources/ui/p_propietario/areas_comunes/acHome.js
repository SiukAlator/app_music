var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');
var db = require('/mods/db');
var moment = require('/libs/moment');
var help;

// TIMESTAMP:  moment.utc().valueOf());
// UTC DATE:   moment.utc().format().toString();
// LOCAL DATE: moment.utc().local().format().toString();

function acHome(nav, donde, reload_in, postLogin) {
	var summon = require('/mods/summon');
	var self;
	var margenBox = '64dp';
	var idToken = Ti.App.Properties.getString('me', null);

	var content;
	var pathImagen = null;
	var myGoalsContainer;
	var viewBlackPopUpCA;
	var marginTB = 150;
	var margin = 50;
	var popUpAlertas;

	var leftButton;
	var helpButton;

	var clicking = false;

	var work = [];
	var nameInput;
	var label0_Name;
	var emailInput;
	var viewBlackPopUpIE;
	var label0_Email;
	var poseeFoto = false;
	var arrayAreaComun = [{
		name: 'QUINCHOS',
		icon: 'quincho.png',
		source: 'quinchoCalendario'
	}, {
		name: 'SALON DE EVENTOS',
		icon: 'eventos.png',
		source: 'eventosCalendario'
	},{
		name: 'SALA DE REUNIONES',
		icon: 'sala.png',
		source: 'salaCalendario'
	}];

	var passInput;
	var label0_Pass;

	var bottomTable;
	var tamBottomTable = '100dp';
	var buttonIngresarFoto;
	var barHeight = '40dp';
	var titleHead = 'Áreas Comunes';

	content = Ti.UI.createView({
		height: Ti.UI.FILL,
		width: Ti.UI.FILL,
		left: '0dp',
		right: '0dp',
	});

	if (Config.isAndroid) {

		self = Ti.UI.createWindow({
			title: titleHead,
			navBarHidden: false,
			exitOnClose: false,
			windowSoftInputMode: Config.softInput,
			backgroundColor: Config.backgroundColor,
			barColor: Config.actionbarBackgroundColor,
			navTintColor: Config.titleButtonColor,
			orientationModes: Config.orientation,
			titleAttributes: {
				color: Config.titleTextColor
			}
		});

		var bg_image = Ti.UI.createImageView({
			image: Config.wallpaperApp,
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			top: '0dp'
		});

		//self.add(bg_image);

		var barMargin = '25%';

		var actionBar = Ti.UI.createView({
			top: 0,
			height: Config.barHeight,
			backgroundColor: Config.mitad2,
			width: Ti.UI.FILL
		});

		var pic = Ti.UI.createImageView({
			image: '/images/ic_navigate_before_w.png',
			height: '60dp',
			width: 'auto',
			touchEnabled: false
		});

		leftButton = Ti.UI.createView({
			left: '0dp',
			top: '0dp',
			height: '50dp',
			width: '50dp',
			backgroundColor: Config.celeste,
			rippleColor: Config.white,
			callback: close,
			finish: finish
		});

		leftButton.addEventListener('click', function (e) {
			if (clicking == false) {
				clicking = true;
				ripple.round(e);
			}
		});

		var centerLabel = Ti.UI.createLabel({
			text: titleHead,
			font: Config.headTitle,
			color: Config.titleTextColor,
			center: actionBar
		});

		leftButton.add(pic);

		// var Label1 = Ti.UI.createLabel({
		// 	text : 'PERFIL',
		// 	font : Config.headTitle,
		// 	color : Config.white
		// });
		// var Label2 = Ti.UI.createLabel({
		// 	text : ' USUARIO',
		// 	font : Config.headTitle,
		// 	color : Config.colorPrimario2,
		// 	left : '5dp'
		// });

		// var labelView = Ti.UI.createView({
		// 	left : '130dp',
		// 	top : '15dp',
		// 	height : Ti.UI.FILL,
		// 	width : Ti.UI.SIZE,
		// 	layout : 'horizontal'
		// });
		// labelView.add(Label1);
		// labelView.add(Label2);
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
			if (clicking == false) {
				clicking = true;
				ripple.round(e);
			}
		});

		actionBar.add(centerLabel);
		//actionBar.add(helpButton);

		//content.add(actionBar);
	} else {

		leftButton = Ti.UI.createButton({
			backgroundImage: '/images/ic_menu_w.png',
			height: 'auto',
			width: 'auto'
		});
		leftButton.addEventListener('click', function () {
			if (clicking == false) {
				openMenu();
			}
		});

		helpButton = Ti.UI.createButton({
			backgroundImage: '/images/192_ayuda.png',
			height: 'auto',
			width: 'auto'
		});

		helpButton.addEventListener('click', function (e) {
			if (clicking == false) {
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
	var contentAcciones;
	var barBusqueda;
	var popUpEstacionamiento;
	var popUpIngresoClasico;
	var dataEstacionamientos = [];
	var popUpIngresoPie;
	var dataCalendar;

	function callCalendar(){

		var Window = require('/ui/p_propietario/areas_comunes/calendario');
		new Window(nav, dataCalendar);
	}

	function construct() {

		clicking = false;
		scroll1 = Ti.UI.createView({
			showVerticalScrollIndicator: true,
			width: '100%',
			height: Ti.UI.FILL,
			top: '0dp',
			left: '0dp',
			bottom: '0dp',
			layout: 'vertical',
			scrollType: 'vertical',
			backgroundColor: Config.mitad2
		});


		scroll1.addEventListener('click', function () {
			hideSoftKeyboard();
		});

		/** Mitad 1 **/

		var contentTitleFull = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: '200dp',
			top: '0dp',
			touchEnabled: false,
			bubbleParent: false,
			backgroundColor: Config.colorWallpaper1

		});
		var contentTitle = Ti.UI.createView({
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			right: '40dp',
			touchEnabled: false,
			bubbleParent: false,
			top: '40dp'

		});

		var picAPie = Ti.UI.createImageView({
			image: '/images/editar.png',
			height: '80dp',
			width: '80dp',
			left: '0dp',
			top: '0dp'
		});

		var title2 = Ti.UI.createLabel({
			text: '¡BIENVENIDO!',
			font: Config.biggerinputFont,
			color: Config.white,
			height: 'auto',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled: false,
			top: '10dp',
			right: '0dp'
		});



		var title1 = Ti.UI.createLabel({
			text: 'CONFIRMA TUS ',
			font: Config.biggerinputFont,
			color: Config.white,
			height: 'auto',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled: false,
			top: '35dp',
			right: '70dp'
		});

		var title3 = Ti.UI.createLabel({
			text: 'DATOS',
			font: Config.biggerinputFont,
			color: Config.color1,
			height: 'auto',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled: false,
			top: '16dp',
			right: '0dp'
		});

		if (donde == 1) {
			title2.text = 'PRE - RESERVAR';
			title1.text = '';
			title3.text = 'AREAS COMUNES';
		}

		var contentGroup = Ti.UI.createView({
			width: Ti.UI.SIZE,
			height: '40dp',
			right: '0dp',
			touchEnabled: false,
			bubbleParent: false,
			top: '20dp',
			layout: 'horizontal'
		});

		var iconGroup = Ti.UI.createImageView({
			right: '10dp',
			height: '50dp',
			width: '50dp',
			top: '0dp',
			image: '/images/sala.png'
		});

		var title4 = Ti.UI.createLabel({
			text: 'Puedes ver disponibilidad horario\ndel área común que deseas reservar.',
			font: {
				fontSize: '16dp'
			},
			color: Config.white,
			height: 'auto',
			textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
			touchEnabled: false,
			top: '80dp',
			right: '0dp'
		});

		contentGroup.add(iconGroup);
		contentGroup.add(title3);

		contentTitleFull.add(picAPie);
		contentTitle.add(title2);
		contentTitle.add(contentGroup);
		contentTitle.add(title4);

		if (donde == 1) {
			//TODO
			actionBar.add(leftButton);
			contentTitleFull.add(actionBar);
		}

		contentTitleFull.add(contentTitle);

		/**   Creación de BOXs   **/
		//TODO
		//boxPass2.add(passInput2);
		scroll1.add(contentTitleFull);

		for (var i in arrayAreaComun) {
			var boxContent = Ti.UI.createView({
				backgroundColor: Config.backgroundColor,
				top: '0dp',
				height: '100dp',
				width: Ti.UI.FILL,
				rippleColor: Config.white,
				callback: callCalendar,
				finish: finish,
				data: i
			});
			if (i % 2 == 0)
				boxContent.backgroundColor = Config.backgroundColor;
			else
				boxContent.backgroundColor = Config.colorWallpaper1;

			var iconArea = Ti.UI.createImageView({
				image: '/images/' + arrayAreaComun[i].icon,
				height: '50dp',
				width: '50dp',
				left: '40dp',
				top: '30dp',
				touchEnabled: false
			});

			var labelArea = Ti.UI.createLabel({
				text: arrayAreaComun[i].name,
				font: {
					fontSize: '18dp'
				},
				color: Config.white,
				touchEnabled: false,
				left: '110dp',
				top: '30dp',
				width: '200dp'
			});

			var rightArrow = Ti.UI.createImageView({
				image: '/images/right_arrow.png',
				height: '15dp',
				width: '15dp',
				right: '40dp',
				top: '40dp',
				touchEnabled: false
			});


			boxContent.add(iconArea);
			boxContent.add(labelArea);
			boxContent.add(rightArrow);

			boxContent.addEventListener('click', function(e){
				dataCalendar = e.source.data;
				ripple.effect(e);
				
			});

			scroll1.add(boxContent);
		}


		// nameInput = Ti.UI.createTextField({
		// 	width: Ti.UI.FILL,
		// 	height: '42dp',
		// 	font: {
		// 		fontSize: '16dp'
		// 	},
		// 	left: '10dp',
		// 	hintText: 'NOMBRE Y APELLIDO',
		// 	color: Config.white,
		// 	hintTextColor: Config.inputHintColor,
		// 	backgroundColor: 'transparent',
		// 	autocorrect: false,
		// 	keyboardType: Ti.UI.KEYBOARD_TYPE_DEFAULT,
		// 	textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		// 	touchEnabled: true,
		// 	bubbleParent: false
		// });

		// nameInput.value = '';

		// boxName.add(nameInput);


		// boxEmail = Ti.UI.createView({
		// 	borderColor: Config.colorPrimario1,
		// 	borderRadius: Config.colorPrimario1,
		// 	backgroundColor: Config.colorPrimario1,
		// 	top: '30dp',
		// 	height: Ti.UI.SIZE,
		// 	width: Ti.UI.FILL,
		// 	layout: 'vertical',
		// 	left: margenBox,
		// 	right: margenBox
		// });

		// emailInput = Ti.UI.createTextField({
		// 	width: Ti.UI.FILL,
		// 	height: '42dp',
		// 	font: {
		// 		fontSize: '16dp'
		// 	},
		// 	left: '10dp',
		// 	hintText: 'EMAIL',
		// 	color: Config.white,
		// 	hintTextColor: Config.inputHintColor,
		// 	backgroundColor: 'transparent',
		// 	autocorrect: false,
		// 	keyboardType: Ti.UI.KEYBOARD_TYPE_EMAIL,
		// 	textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		// 	touchEnabled: true,
		// 	bubbleParent: false
		// });


		// emailInput.value = '';

		// boxEmail.add(emailInput);

		// boxPhone = Ti.UI.createView({
		// 	borderColor: Config.colorPrimario1,
		// 	borderRadius: Config.colorPrimario1,
		// 	backgroundColor: Config.colorPrimario1,
		// 	top: '30dp',
		// 	height: Ti.UI.SIZE,
		// 	width: Ti.UI.FILL,
		// 	layout: 'vertical',
		// 	left: margenBox,
		// 	right: margenBox
		// });

		// phoneInput = Ti.UI.createTextField({
		// 	width: Ti.UI.FILL,
		// 	height: '42dp',
		// 	font: {
		// 		fontSize: '16dp'
		// 	},
		// 	left: '10dp',
		// 	hintText: 'NÚMERO CELULAR',
		// 	color: Config.white,
		// 	hintTextColor: Config.inputHintColor,
		// 	backgroundColor: 'transparent',
		// 	autocorrect: false,
		// 	keyboardType: Ti.UI.KEYBOARD_TYPE_NAMEPHONE_PAD,
		// 	textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		// 	touchEnabled: true,
		// 	bubbleParent: false
		// });

		// phoneInput.value = '';

		// boxPhone.add(phoneInput);

		// boxPass = Ti.UI.createView({
		// 	borderColor: Config.colorPrimario1,
		// 	borderRadius: Config.colorPrimario1,
		// 	backgroundColor: Config.colorPrimario1,
		// 	top: '30dp',
		// 	height: Ti.UI.SIZE,
		// 	width: Ti.UI.FILL,
		// 	layout: 'vertical',
		// 	left: margenBox,
		// 	right: margenBox
		// });

		// passInput = Ti.UI.createTextField({
		// 	width: Ti.UI.FILL,
		// 	height: '42dp',
		// 	font: {
		// 		fontSize: '16dp'
		// 	},
		// 	left: '10dp',
		// 	hintText: 'CONTRASEÑA',
		// 	color: Config.white,
		// 	hintTextColor: Config.inputHintColor,
		// 	backgroundColor: 'transparent',
		// 	autocorrect: false,
		// 	keyboardType: Ti.UI.KEYBOARD_TYPE_NAMEPHONE_PAD,
		// 	textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		// 	touchEnabled: true,
		// 	bubbleParent: false,
		// 	passwordMask: true
		// });

		// boxPass.add(passInput);

		// var boxPass2 = Ti.UI.createView({
		// 	borderColor: Config.colorPrimario1,
		// 	borderRadius: Config.colorPrimario1,
		// 	backgroundColor: Config.colorPrimario1,
		// 	top: '30dp',
		// 	height: Ti.UI.SIZE,
		// 	width: Ti.UI.FILL,
		// 	layout: 'vertical',
		// 	left: margenBox,
		// 	right: margenBox
		// });

		// passInput2 = Ti.UI.createTextField({
		// 	width: Ti.UI.FILL,
		// 	height: '42dp',
		// 	font: {
		// 		fontSize: '16dp'
		// 	},
		// 	left: '10dp',
		// 	hintText: 'CONFIRMAR CONTRASEÑA',
		// 	color: Config.white,
		// 	hintTextColor: Config.inputHintColor,
		// 	backgroundColor: 'transparent',
		// 	autocorrect: false,
		// 	keyboardType: Ti.UI.KEYBOARD_TYPE_NAMEPHONE_PAD,
		// 	textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		// 	touchEnabled: true,
		// 	bubbleParent: false,
		// 	passwordMask: true
		// });


		// scroll1.add(boxEmail);
		// scroll1.add(boxPhone);
		// scroll1.add(boxPass);
		//scroll1.add(boxPass2);
		/***/

		/** Mitad 2 **/

		/**
		 * buttonIngresarFoto = Ti.UI.createView({
			backgroundColor : Config.red,
			borderColor : Config.colorButonFirmar,
			borderRadius : '100dp',
			height : '150dp',
			width : Ti.UI.FILL,
			rippleColor : Config.white,
			callback : abrirCamara,
			finish : finish,
			top : '30dp',
			touchEnabled : true
		});
		 */

		buttonIngresarFoto = Ti.UI.createView({
			height: '100dp',
			width: Ti.UI.FILL,
			rippleColor: Config.white,
			callback: abrirCamara,
			finish: finish,
			top: '30dp',
			bottom: '30dp',
			touchEnabled: true
		});

		var IDImagen = Ti.App.Properties.getString('id_photo', null);
		if (IDImagen != null && IDImagen != "") {
			buttonIngresarFoto.removeAllChildren();
			buttonIngresarFoto.top = '30dp';
			buttonIngresarFoto.backgroundColor = Config.colorBorder1dp;
			buttonIngresarFoto.borderWidth = '2dp';
			buttonIngresarFoto.borderColor = Config.colorBorder1dp;
			buttonIngresarFoto.touchEnabled = true;
			buttonIngresarFoto.width = '140dp';
			buttonIngresarFoto.height = '140dp';
			buttonIngresarFoto.borderRadius = '70dp';

			var contornoFake = Ti.UI.createView({
				height: '140dp',
				width: '140dp',
				borderWidth: '2dp',
				borderRadius: '140dp',
				borderColor: Config.colorBorder1dp,
				touchEnabled: false,
				backgroundColor: 'transparent'

			});

			fotoView = Ti.UI.createImageView({
				height: '140dp',
				width: '140dp',
				borderRadius: '70dp',
				touchEnabled: false,
				image: Config.path_images_users + IDImagen + "?t=" + new Date()
			});

			fotoView.addEventListener("load", function (e) {
				e.source.borderRadius = '70dp';
				e.source.borderColor = Config.colorBorder1dp;

			});

			//contentFotoView.add(fotoView);
			buttonIngresarFoto.add(fotoView);
			buttonIngresarFoto.add(contornoFake);

			var iconFoto = Ti.UI.createImageView({
				image: '/images/camera.png',
				height: '50dp',
				width: '50dp',
				opacity: 0.5,
				touchEnabled: false
			});

			buttonIngresarFoto.add(iconFoto);

		} else {

			var contentITF = Ti.UI.createView({
				width: '210dp',
				touchEnabled: false
			});
			var iconFoto = Ti.UI.createImageView({
				image: '/images/camera.png',
				height: '50dp',
				width: '50dp',
				top: '20dp',
				left: '0dp',
				touchEnabled: false
			});

			var buttonLabelFoto = Ti.UI.createLabel({
				text: 'INGRESA TU FOTO',
				font: {
					fontSize: '18dp'
				},
				color: Config.white,
				touchEnabled: false,
				top: '20dp',
				left: '60dp'
			});

			var buttonLabelOpcional = Ti.UI.createLabel({
				text: '(OPCIONAL)',
				font: {
					fontSize: '18dp'
				},
				color: Config.inputHintColor,
				touchEnabled: false,
				top: '40dp',
				right: '0dp'
			});

			contentITF.add(iconFoto);
			contentITF.add(buttonLabelFoto);
			contentITF.add(buttonLabelOpcional);

			buttonIngresarFoto.add(contentITF);
		}

		buttonIngresarFoto.addEventListener('click', function (e) {
			if (clicking == false) {
				//hideSoftKeyboard();
				//clicking = true;
				ripple.effect(e);

			}
		});

		var contentDoubleC = Ti.UI.createView({
			top: '0dp',
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			touchEnabled: false,
			layout: 'vertical'
		});

		var buttonConfirmar = Ti.UI.createView({
			backgroundColor: Config.color1,
			borderColor: Config.color1,
			borderRadius: '21dp',
			top: '0dp',
			height: '42dp',
			width: Ti.UI.FILL,
			rippleColor: Config.white,
			callback: guardarPerfil,
			finish: finish,
			touchEnabled: true,
			left: margenBox,
			right: margenBox
		});

		var labelConfirmar = Ti.UI.createLabel({
			text: 'CONFIRMAR',
			font: {
				fontSize: '16dp'
			},
			color: Config.white,
			touchEnabled: false
		});

		buttonConfirmar.addEventListener('click', function (e) {
			if (clicking == false) {
				clicking = true;
				ripple.effect(e);
				clicking = false;

			}
		});
		// buttonConfirmar.add(labelConfirmar);
		// contentDoubleC.add(boxPass2);
		// contentDoubleC.add(buttonIngresarFoto);
		// scroll1.add(contentDoubleC);
		// scroll1.add(buttonConfirmar);

		/**********/

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

		//content.add(barBusqueda);
		content.add(scroll1);
		//content.add(contentAcciones);

		//content.add(myGoalsContainer);

		self.add(content);
		self.add(viewBlack);

		crearIngresadaExitosamente();
		//getData();
		/*
		if (Config.isAndroid) {
		drawer.setCenterWindow(self);
		} else {
		drawer.nav = nav;
		drawer.setCenterWindow(nav);
		}
		*/
		/*** PopUp Alertas***/

		popUpAlertas = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: '380dp',
			//height : (Ti.Platform.displayCaps.platformHeight - 50) + 'dp',
			top: marginTB + 20,
			right: margin + 250 + 'dp',
			left: margin + 250 + 'dp',
			backgroundColor: Config.almostwhite,
			borderColor: Config.almostwhite,
			borderRadius: Config.borderRadius,
			touchEnabled: true,
			bubbleParent: false

		});

		viewBlackPopUpCA = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			top: '0dp',
			backgroundColor: Config.transparenceBlack2,
			visible: false,
			bubbleParent: false
		});

		crearAlertaCampos();

		viewBlackPopUpCA.add(popUpAlertas);
		self.add(viewBlackPopUpCA);

	}

	function crearAlertaCampos() {

		var viewTitlePopUpFirma = Ti.UI.createView({
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			top: '135dp'
		});

		labelAlerta = Ti.UI.createLabel({
			text: 'MENSAJE DE EJEMPLO',
			font: {
				fontSize: '24dp'
			},
			color: Config.colorTitulo1,
			height: 'auto',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled: false,
			top: '0dp'
		});

		var labelTitlePopUpFirma2 = Ti.UI.createLabel({
			text: 'PARA PODER CONFIRMAR INGRESO',
			font: {
				fontSize: '24dp'
			},
			color: Config.colorTitulo2,
			height: 'auto',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled: false,
			top: '27dp'
		});

		var contentTitlePopUpEs = Ti.UI.createView({
			top: '0dp',
			width: Ti.UI.FILL,
			height: '60dp'
		});

		var barBlue = Ti.UI.createView({
			top: '63dp',
			width: '60dp',
			height: '4dp',
			backgroundColor: Config.colorTitulo1
		});

		contentTitlePopUpEs.add(labelAlerta);
		contentTitlePopUpEs.add(labelTitlePopUpFirma2);
		viewTitlePopUpFirma.add(contentTitlePopUpEs);
		viewTitlePopUpFirma.add(barBlue);

		var picTicket = Ti.UI.createImageView({
			image: '/images/alerta.png',
			height: '100dp',
			width: '100dp',
			top: '20dp'
		});

		var viewBottom = Ti.UI.createView({
			left: '0dp',
			right: '0dp',
			bottom: '0dp',
			width: Ti.UI.FILL,
			height: '150dp',
			backgroundColor: Config.backgroundBusqueda
		});

		var buttonVH = Ti.UI.createView({
			backgroundColor: Config.colorConfirmar,
			borderColor: Config.colorConfirmar,
			borderRadius: Config.borderRadius,
			height: '70dp',
			width: '280dp',
			rippleColor: Config.white,
			callback: cerrarPopup,
			finish: finish,
			touchEnabled: true
		});

		var labelVH = Ti.UI.createLabel({
			text: 'ENTENDIDO',
			font: {
				fontSize: '24dp'
			},
			color: Config.white,
			touchEnabled: false
		});

		buttonVH.addEventListener('click', function (e) {
			if (clicking == false) {
				clicking = true;
				ripple.effect(e);
				clicking = false;

			}
		});
		buttonVH.add(labelVH);
		viewBottom.add(buttonVH);

		popUpAlertas.add(picTicket);
		popUpAlertas.add(viewTitlePopUpFirma);
		popUpAlertas.add(viewBottom);
	}

	function openAlerta(text_in) {
		labelAlerta.text = text_in;
		hideSoftKeyboard();
		viewBlackPopUpCA.show();
	}

	function crearIngresadaExitosamente() {
		viewBlackPopUpIE = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			top: '0dp',
			backgroundColor: Config.transparenceBlack2,
			visible: false,
			bubbleParent: false
		});

		var margin = 150;
		var popUpIE = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			top: margin + 20 + 'dp',
			right: margin + 100 + 'dp',
			left: margin + 100 + 'dp',
			bottom: margin + 20 + 'dp',
			backgroundColor: Config.almostwhite,
			borderColor: Config.almostwhite,
			borderRadius: Config.borderRadius,
			touchEnabled: true,
			bubbleParent: false

		});

		var viewTitlePopUpFirma = Ti.UI.createView({
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			top: '150dp'
		});

		var labelTitlePopUpFirma1 = Ti.UI.createLabel({
			text: 'DATOS',
			font: {
				fontSize: '24dp'
			},
			color: Config.colorTitulo1,
			height: 'auto',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled: false
		});

		var labelTitlePopUpFirma2 = Ti.UI.createLabel({
			text: ' GUARDADOS EXITOSAMENTE',
			font: {
				fontSize: '24dp'
			},
			color: Config.colorTitulo2,
			height: 'auto',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled: false
		});

		var contentTitlePopUpEs = Ti.UI.createView({
			top: '0dp',
			layout: 'horizontal',
			width: Ti.UI.SIZE
		});

		var barBlue = Ti.UI.createView({
			top: '34dp',
			width: '60dp',
			height: '4dp',
			backgroundColor: Config.colorTitulo1
		});

		contentTitlePopUpEs.add(labelTitlePopUpFirma1);
		contentTitlePopUpEs.add(labelTitlePopUpFirma2);
		viewTitlePopUpFirma.add(contentTitlePopUpEs);
		viewTitlePopUpFirma.add(barBlue);

		var picTicket = Ti.UI.createImageView({
			image: '/images/ticket.png',
			height: '120dp',
			width: '120dp',
			top: '20dp'
		});

		var viewBottom = Ti.UI.createView({
			left: '0dp',
			right: '0dp',
			bottom: '0dp',
			width: Ti.UI.FILL,
			height: '150dp',
			backgroundColor: Config.backgroundBusqueda
		});

		var buttonVH = Ti.UI.createView({
			backgroundColor: Config.colorConfirmar,
			borderColor: Config.colorConfirmar,
			borderRadius: Config.borderRadius,
			height: '70dp',
			width: '280dp',
			rippleColor: Config.white,
			callback: close,
			finish: finish,
			touchEnabled: true
		});

		var labelVH = Ti.UI.createLabel({
			text: 'VOLVER A HOME',
			font: {
				fontSize: '24dp'
			},
			color: Config.white,
			touchEnabled: false
		});

		if (reload_in == null) {
			labelVH.text = 'IR A HOME';
		}

		buttonVH.addEventListener('click', function (e) {
			if (clicking == false) {
				clicking = true;
				ripple.effect(e);
				clicking = false;

			}
		});
		buttonVH.add(labelVH);
		viewBottom.add(buttonVH);

		popUpIE.add(picTicket);
		popUpIE.add(viewTitlePopUpFirma);
		popUpIE.add(viewBottom);
		viewBlackPopUpIE.add(popUpIE);

		self.add(viewBlackPopUpIE);
	}

	function guardarPerfil() {

		for (var w in work) {
			work[w].show();
		}
		var bandera = true;
		var text = '';
		if (nameInput.value == '') {
			text = 'DEBE INGRESAR NOMBRE Y APELLIDO';
			bandera = false;
		} else if (phoneInput.value == '') {
			text = 'DEBE INGRESAR UN NÚMERO CELULAR';
			bandera = false;
		}

		if (bandera == true) {
			//TODO
			var name_complete = (nameInput.value).split(' ');
			if (name_complete.length == 2) {
				var password = null;
				if (passInput.value != '')
					password = passInput.value;
				var params = {
					name: name_complete[0],
					last_name: name_complete[1],
					phone: phoneInput.value,
					email: emailInput.value,
					token: idToken,
					pass: password
				};
				var photo = null;
				if (poseeFoto == true) {
					var file = Ti.Filesystem.getFile(pathImagen);
					photo = file.read();
				}

				xhr.firstlogin(nwResponse, params, photo);
			} else {
				text = 'DEBE INGRESAR NOMBRE Y APELLIDO';
				openAlerta(text);

				for (var w in work) {
					work[w].hide();
				}
			}
		} else {
			openAlerta(text);
		}
		for (var w in work) {
			work[w].hide();
		}

	}

	function nwResponse(result) {

		if (result == false) {

			for (var w in work) {
				work[w].hide();
			}

			var dialog = Ti.UI.createAlertDialog({
				title: 'Revise su conexión a Internet',
				message: 'no hemos podido comunicarnos con el servidor, por favor compruebe que está conectado a internet.',
				ok: 'OK'
			});
			dialog.show();

		} else {

			switch (result.status.code) {

				case '200':
					for (var w in work) {
						work[w].hide();
					}

					if (Ti.App.Properties.getString('perfil', null) == Config.typePerfilTerreno && flagOpenMenu == false) {

						var Window = require('/ui/p_propietario/Menu');
						new Window();
						flagOpenMenu = true;
						if (Config.isAndroid) {
							close();
						} else {
							nav.close();
						}

					}

					break;
				case '500':

					for (var w in work) {
						work[w].hide();
					}

					var dialog = Ti.UI.createAlertDialog({
						title: 'Error interno',
						message: 'por favor inténtelo nuevamente en unos minutos o contáctese con el administrador del sistema.',
						ok: 'CERRAR'
					});
					dialog.show();
					break;

				default:

					for (var w in work) {
						work[w].hide();
					}

					var dialog = Ti.UI.createAlertDialog({
						title: 'Error inesperado',
						message: 'por favor inténtelo nuevamente en unos minutos o contáctese con el administrador del sistema.',
						ok: 'CERRAR'
					});
					dialog.show();
					break;

			}

		}

	}

	function successful() {
		viewBlackPopUpIE.show();
	}

	function close() {
		if (reload_in == null) {
			var Window = require('/ui/conserje/Menu');
			new Window();
		}
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
			cancel: 1,
			buttonNames: ['Cerrar', 'Cancelar'],
			message: '¿Seguro que quiere cerrar su sesión y salir?',
			title: 'Cerrar Sesión'
		});
		close.addEventListener('click', function (e) {
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

	self.addEventListener('android:back', function (e) {

		var flag = false;

		if (flag == false) {
			e.cancelBubble = true;
			if (clicking == false) {
				clicking = true;
				ripple.round({
					source: leftButton
				});
			}
		}

	});

	function abrirCamara() {

		if (clicking == false) {
			clicking = true;

			Ti.Media.CAMERA_FRONT
			Ti.Media.showCamera({
				saveToPhotoGallery: false,
				mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
				success: function (event) {

					var newH;
					var newW;
					var eventHeight;
					var eventWidth;

					if (Config.isAndroid) {

						eventHeight = event.height;
						eventWidth = event.width;

					} else {

						var img = Ti.UI.createImageView({
							image: event.media,
							width: 'auto',
							height: 'auto'
						});

						eventHeight = img.toImage().height;
						eventWidth = img.toImage().width;

					}

					if (eventHeight > eventWidth) {
						newW = Config.tamImagenAdjunta * 2;
						newH = (eventHeight / eventWidth) * newW;

						newWTh = Config.tamImagenAdjunta;
						newHTh = (eventHeight / eventWidth) * newWTh;
					} else {
						newH = Config.tamImagenAdjunta * 2;
						newW = (eventWidth / eventHeight) * newH;

						newHTh = Config.tamImagenAdjunta;
						newWTh = (eventWidth / eventHeight) * newHTh;
					}

					var resizedImage = event.media.imageAsResized(newW, newH);
					var finalImage = resizedImage.imageAsCropped({
						height: Config.tamImagenAdjunta * 2,
						width: Config.tamImagenAdjunta * 2
					});

					var resizedImageThumbnail = event.media.imageAsResized(newWTh, newHTh);
					var finalImageThumbnail = resizedImageThumbnail.imageAsCropped({
						height: Config.tamImagenAdjunta,
						width: Config.tamImagenAdjunta
					});

					/*************/

					if (typeof path !== 'undefined') {
						var file = Ti.Filesystem.getFile(path);

						if (file.exists()) {
							file.deleteFile();
						}

					}

					var nameImage = new Date().getTime() + Config.filename;
					var nameImageThumbnail = new Date().getTime() + Config.filename + Config.hashThumbnail;

					var file = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, nameImage);
					var fileThumbnail = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, nameImageThumbnail);

					file.write(finalImage);
					fileThumbnail.write(finalImageThumbnail);

					var path = file.resolve();

					/**************/

					var imagenNormal = imagenResizedNormal(event);
					dibujarFotos(finalImage, imagenNormal, path, true);
					clicking = false;

				},
				cancel: function () {
					clicking = false;
				},
				error: function (error) {
					clicking = false;
				}
			});

		}
	}

	function dibujarFotos(finalImage, imagenNormal, nameImage, carga) {

		creacionContentFoto();
		pathImagen = nameImage;
		//var filename = nameImage;
		//var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename);

		//file.write(paintView.toImage());
		//Ti.API.info('path of image' + path);
		fotoView.image = imagenNormal;
		//cerrarPopup();
		poseeFoto = true;
	}

	function cerrarPopup() {
		hideSoftKeyboard();
		viewBlackPopUpCA.hide();
		clicking = false;
	}

	function fakeFunction() {

	}

	function creacionContentFoto() {
		//boxFirma.removeAllChildren();
		//TODO
		buttonIngresarFoto.removeAllChildren();
		buttonIngresarFoto.top = '30dp';
		buttonIngresarFoto.bottom = '20dp';
		buttonIngresarFoto.backgroundColor = Config.white;
		buttonIngresarFoto.borderWidth = '2dp';
		buttonIngresarFoto.borderColor = Config.colorBorder1dp;
		buttonIngresarFoto.touchEnabled = true;
		buttonIngresarFoto.width = '140dp';
		buttonIngresarFoto.height = '140dp';
		buttonIngresarFoto.borderRadius = '70dp';

		var contornoFake = Ti.UI.createView({
			height: '140dp',
			width: '140dp',
			borderWidth: '2dp',
			borderRadius: '70dp',
			borderColor: Config.colorBorder1dp,
			touchEnabled: false,
			backgroundColor: 'transparent'
		});

		fotoView = Ti.UI.createImageView({
			height: '140dp',
			width: '140dp',
			borderRadius: '70dp',
			touchEnabled: false
		});

		//contentFotoView.add(fotoView);
		buttonIngresarFoto.add(fotoView);

		var iconFoto = Ti.UI.createImageView({
			image: '/images/camera.png',
			height: '50dp',
			width: '50dp',
			opacity: 0.5,
			touchEnabled: false
		});

		buttonIngresarFoto.add(iconFoto);
		buttonIngresarFoto.add(contornoFake);

		//buttonIngresarFirma.rippleColor = Config.almostwhite;

		buttonIngresarFoto.addEventListener('click', function (e) {

			if (clicking == false) {
				abrirCamara();
			}
		});
		//contentEdit.add(iconEdit);
		//contentEdit.add(labelEditar);

		//boxFirma.add(firmaView);
		//boxFirma.add(contentEdit);

		//contentTitleFirma.visible = true;

	}

	function imagenResizedNormal(imagen) {

		var newH;
		var newW;
		var eventHeight;
		var eventWidth;

		if (Config.isAndroid) {

			eventHeight = imagen.height;
			eventWidth = imagen.width;

		} else {

			var img = Ti.UI.createImageView({
				image: imagen.media,
				width: 'auto',
				height: 'auto'
			});

			eventHeight = img.toImage().height;
			eventWidth = img.toImage().width;

		}

		if (eventHeight > eventWidth) {
			newW = Config.tamImagenAdjuntaAbierta;
			newH = (eventHeight / eventWidth) * newW;
		} else {
			newH = Config.tamImagenAdjuntaAbierta;
			newW = (eventWidth / eventHeight) * newH;
		}

		var resizedImage = imagen.media.imageAsResized(newW, newH);
		var finalImage = resizedImage.imageAsCropped({
			height: Config.tamImagenAdjuntaAbierta,
			width: Config.tamImagenAdjuntaAbierta
		});

		return finalImage;

	}

	construct();

	if (Config.isAndroid) {
		self.open();
		if (postLogin != null)
			postLogin();
	} else {
		nav.openWindow(self);
	}

	function hideSoftKeyboard() {
		if (Config.isAndroid) {
			Ti.UI.Android.hideSoftKeyboard();
		} else {
			//comentarioText.blur();
			// myGoalsContainer.name.blur();
			// myGoalsContainer.telephone.blur();
		}
	}

	/*
	 var flagsetHeightContentIni = true;
	 var heighContentIni;
	 content.addEventListener('postlayout', function(e) {

	 if (flagsetHeightContentIni == true) {
	 heighContentIni = self.getRect().height;
	 flagsetHeightContentIni = false;
	 }
	 Ti.API.info('ECHOOOO lala');

	 var heightContentActual = content.getRect().height;

	 if (heightContentActual < heighContentIni) {

	 bottomTable.height = '0dp';

	 } else {
	 bottomTable.height = tamBottomTable;
	 }

	 });*/

	function showHelp() {
		help.animate_show();
	}

}

module.exports = acHome;
