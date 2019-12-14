var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');
var db = require('/mods/db');
var moment = require('/libs/moment');
var xhr = require('/mods/xhr');
var help;

// TIMESTAMP:  moment.utc().valueOf());
// UTC DATE:   moment.utc().format().toString();
// LOCAL DATE: moment.utc().local().format().toString();

function calendario(nav, data_from_acHome) {
	var horarioReuniones = JSON.parse(Ti.App.Properties.getString('horarioReuniones', null));
	var horariosQuincho = JSON.parse(Ti.App.Properties.getString('horariosQuincho', null));
	var horarioEventos = JSON.parse(Ti.App.Properties.getString('horarioEventos', null));
	var summon = require('/mods/summon');
	var self;
	var margenBox = '64dp';
	var idToken = Ti.App.Properties.getString('me', null);
	var contentHorarioR;
	var content;
	var pathImagen = null;
	var fullW = Ti.Platform.displayCaps.getPlatformWidth();
	if (Config.isAndroid) {
		fullW = fullW / Ti.Platform.displayCaps.getLogicalDensityFactor();
	}
	var dateSelected;
	var diamesano;
	var horasyalgo;
	var info_sala;
	var info_quincho;
	fullW = (fullW - 72) * 0.48;
	var fullWdp = fullW + 'dp';
	var myGoalsContainer;
	var viewBlackPopUpCA;
	var marginTB = 150;
	var margin = 50;
	var popUpAlertas;

	var leftButton;
	var helpButton;
	var arrayDaystoSelectV = [];
	var arrayDaystoSelectL = [];
	var arrayDaystoSelectCF = [];
	var countArrayDaystoSelect = 0;
	var info_reserva;
	var clicking = false;

	var work = [];
	var nameInput;
	var label0_Name;
	var emailInput;
	var viewBlackPopUpIE;
	var label0_Email;
	var poseeFoto = false;
	var popUpSeleccionarHora;
	var arrayAreaComun = [{
		name: 'QUINCHOS',
		icon: 'quincho.png',
		source: 'quinchoCalendario'
	}, {
		name: 'SALON DE EVENTOS',
		icon: 'eventos.png',
		source: 'eventosCalendario'
	}, {
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
	var titleHead = 'Reservas';

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

	var monthContainer = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		top: '16dp',
		bottom: '8dp',
		layout: 'vertical'
	});




	var monthTitleLabel = Ti.UI.createLabel({
		text: '...Loading',
		font: Config.biggerinputFont,
		color: Config.white,
		height: 'auto',
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		touchEnabled: false,
		top: '30dp'
	});


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


		title2.text = 'SELECCIONE';
		title1.text = '';
		title3.text = 'FECHA DISPONIBLE';


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
			height: '40dp',
			width: '40dp',
			top: '0dp',
			image: '/images/calendar_1.png'
		});

		var title4 = Ti.UI.createLabel({
			text: 'En el calendario puedes ver las\nfechas disponibles para reserva.',
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


		//TODO
		actionBar.add(leftButton);
		contentTitleFull.add(actionBar);


		contentTitleFull.add(contentTitle);

		/**   Creación de BOXs   **/
		//TODO
		//boxPass2.add(passInput2);
		scroll1.add(contentTitleFull);

		// for (var i in arrayAreaComun) {
		// 	var boxContent = Ti.UI.createView({
		// 		backgroundColor: Config.backgroundColor,
		// 		top: '0dp',
		// 		height: '100dp',
		// 		width: Ti.UI.FILL
		// 	});
		// 	if (i % 2 == 0)
		// 		boxContent.backgroundColor = Config.backgroundColor;
		// 	else
		// 		boxContent.backgroundColor = Config.colorWallpaper1;

		// 	var iconArea = Ti.UI.createImageView({
		// 		image: '/images/' + arrayAreaComun[i].icon,
		// 		height: '50dp',
		// 		width: '50dp',
		// 		left: '40dp',
		// 		top: '30dp',
		// 		touchEnabled: false
		// 	});

		// 	var labelArea = Ti.UI.createLabel({
		// 		text: arrayAreaComun[i].name,
		// 		font: {
		// 			fontSize: '18dp'
		// 		},
		// 		color: Config.white,
		// 		touchEnabled: false,
		// 		left: '110dp',
		// 		top: '30dp',
		// 		width: '200dp'
		// 	});

		// 	var rightArrow = Ti.UI.createImageView({
		// 		image: '/images/right_arrow.png',
		// 		height: '15dp',
		// 		width: '15dp',
		// 		right: '40dp',
		// 		top: '40dp',
		// 		touchEnabled: false
		// 	});


		// 	boxContent.add(iconArea);
		// 	boxContent.add(labelArea);
		// 	boxContent.add(rightArrow);
		// 	scroll1.add(boxContent);
		// }

		var monthControllerContainer = Ti.UI.createView({
			height: '70dp',
			width: Ti.UI.FILL,
			top: '16dp'
		});

		var arrowLView = Ti.UI.createView({
			height: '40dp',
			width: '40dp',
			left: '20dp',
			rippleColor: Config.white,
			callback: drawMonth,
			finish: finish
		});

		var arrowL = Ti.UI.createImageView({
			image: '/images/ic_navigate_before_w.png',
			height: '32dp',
			width: '32dp',
			opacity: 0.6,
			touchEnabled: false
		});

		arrowLView.add(arrowL);

		arrowLView.addEventListener('click', function (e) {
			if (clicking == false) {

				clicking = true;
				dateSelected = moment(dateSelected).subtract(1, 'months');
				ripple.round(e);
			}

		});

		var arrowRView = Ti.UI.createView({
			height: '40dp',
			width: '40dp',
			right: '20dp',
			rippleColor: Config.white,
			callback: drawMonth,
			finish: finish
		});

		var arrowR = Ti.UI.createImageView({
			image: '/images/ic_navigate_next_w.png',
			height: '32dp',
			width: '32dp',
			opacity: 0.6,
			touchEnabled: false
		});

		arrowRView.add(arrowR);

		arrowRView.addEventListener('click', function (e) {
			if (clicking == false) {
				clicking = true;
				dateSelected = moment(dateSelected).add(1, 'months');
				ripple.round(e);
			}

		});

		var monthTitleContainer = Ti.UI.createView({
			height: '70dp',
			width: Ti.UI.SIZE
		});

		monthTitleContainer.add(monthTitleLabel);

		monthControllerContainer.add(arrowLView);
		monthControllerContainer.add(monthTitleContainer);
		monthControllerContainer.add(arrowRView);

		scroll1.add(monthControllerContainer);
		scroll1.add(monthContainer);
		content.add(scroll1);
		/*** PopUp Seleccionar Hora ***/

		popUpSeleccionarHora = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			//height : (Ti.Platform.displayCaps.platformHeight - 50) + 'dp',
			top: '60dp',
			right: '30dp',
			left: '30dp',
			bottom: '60dp',
			backgroundColor: Config.almostwhite,
			borderColor: Config.almostwhite,
			borderRadius: Config.borderRadius,
			touchEnabled: true,
			bubbleParent: false,
			layout: 'vertical'

		});

		viewClose = Ti.UI.createView({
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			top: '32dp',
			right: '30dp',
			bubbleParent: false,
			layout: 'horizontal'
		});

		var labelCerrar1 = Ti.UI.createLabel({
			text: 'X',
			font: {
				fontSize: '20dp',
				fontWeight: 'bold'
			},
			color: Config.white,
			height: 'auto',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled: false
		});

		viewClose.add(labelCerrar1);

		viewBlackPopUpSH = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			top: '0dp',
			backgroundColor: Config.transparenceBlack2,
			visible: false,
			bubbleParent: false
		});

		viewBlackPopUpSH.add(viewClose);

		viewBlackPopUpSH.addEventListener('click', function (e) {
			hideSoftKeyboard();
		});

		createSeleccionarHora();

		viewBlackPopUpSH.add(popUpSeleccionarHora);

		//content.add(myGoalsContainer);

		content.add(viewBlackPopUpSH);
		Ti.API.info('data calendar:', data_from_acHome);
		var params = {
			token: Ti.App.Properties.getString('me', null)
		};
		dateSelected = new Date();

		if (data_from_acHome == 0) {
			xhr.findDateQuincho(drawMonth, params);
		}
		else if (data_from_acHome == 1) {
			xhr.findDateSalaE(drawMonth, params);
		}
		else {
			xhr.findDateSalaR(drawMonth, params);
		}

		//content.add(contentAcciones);

		//content.add(myGoalsContainer);

		self.add(content);

	}


	function createSeleccionarHora() {
		//popUpSeleccionarHora

		var contentTitleFull2 = Ti.UI.createView({
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			top: '40dp',
			touchEnabled: false,
			bubbleParent: false

		});

		var contentTitle2 = Ti.UI.createView({
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			top: '0dp',
			touchEnabled: false,
			bubbleParent: false,
			layout: 'horizontal'

		});

		var barBlue2 = Ti.UI.createView({
			top: '45dp',
			width: '80dp',
			height: '4dp',
			backgroundColor: Config.colorLast_name
		});

		var title12 = Ti.UI.createLabel({
			text: 'Día ',
			font: {
				fontSize: '20dp'
			},
			color: Config.colorLast_name,
			height: 'auto',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled: false,
			top: '0dp'
		});

		diamesano = Ti.UI.createLabel({
			text: 'dd-mm-yyyy',
			font: {
				fontSize: '20dp'
			},
			color: Config.color2CO,
			height: 'auto',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled: false,
			top: '0dp'
		});

		contentTitle2.add(title12);
		contentTitle2.add(diamesano);
		contentTitleFull2.add(contentTitle2);
		contentTitleFull2.add(barBlue2);

		horasyalgo = Ti.UI.createLabel({
			text: 'Horas y quinchos disponibles',
			font: {
				fontSize: '18dp'
			},
			color: Config.color2CO,
			height: 'auto',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled: false,
			top: '20dp'
		});

		contentHorarioR = Ti.UI.createScrollView({
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			bottom: '0dp',
			layout: 'vertical',
			top: '20dp',
			bottom: '20dp',
			touchEnabled: true,
			bubbleParent: false,
			showVerticalScrollIndicator: true
		});

		//contentHorarioR.add(contentIzq);
		//contentHorarioR.add(contentDer);

		popUpSeleccionarHora.add(contentTitleFull2);
		popUpSeleccionarHora.add(horasyalgo);
		popUpSeleccionarHora.add(contentHorarioR);
	}

	function setNewData(infoIn, fromData)
	{
		var newData = [];
		var data = [];
		var auxDate;
		if (fromData == 0)
		{
			for (var i in infoIn) {
				if (i == 0) {
					data.push({
						id: infoIn[i].id_quincho,
						id_horario: infoIn[i].id_horario
					});
					auxDate = infoIn[i].fecha;
				} else {
					if (auxDate == infoIn[i].fecha)
						data.push({
							id: infoIn[i].id_quincho,
							id_horario: infoIn[i].id_horario
						});
					else {
						newData.push({
							fecha: auxDate,
							data: data
						});
						data = [];
						data.push({
							id: infoIn[i].id_quincho,
							id_horario: infoIn[i].id_horario
						});
						auxDate = infoIn[i].fecha;
					}
	
				}
				if (i == infoIn.length - 1) {
					newData.push({
						fecha: auxDate,
						data: data
					});
				}
			}
		}
		else if (fromData == 1)
		{
			for (var i in infoIn) {
				if (i == 0) {
					data.push({
						id : infoIn[i].id_sala,
						id_horario : infoIn[i].id_horario
					});
					auxDate = infoIn[i].fecha;
				} else {
					if (auxDate == infoIn[i].fecha)
						data.push({
							id : infoIn[i].id_sala,
							id_horario : infoIn[i].id_horario
						});
					else {
						newData.push({
							fecha : auxDate,
							data : data
						});
						data = [];
						data.push({
							id : infoIn[i].id_sala,
							id_horario : infoIn[i].id_horario
						});
						auxDate = infoIn[i].fecha;
					}

				}
				if (i == infoIn.length - 1) {
					newData.push({
						fecha : auxDate,
						data : data
					});
				}
			}
		}
		else
		{
			for (var i in infoIn) {
				if (i == 0) {
					data.push({
						id : infoIn[i].id_sala,
						id_horario : infoIn[i].id_horario
					});
					auxDate = infoIn[i].fecha;
				} else {
					if (auxDate == infoIn[i].fecha)
						data.push({
							id : infoIn[i].id_sala,
							id_horario : infoIn[i].id_horario
						});
					else {
						newData.push({
							fecha : auxDate,
							data : data
						});
						data = [];
						data.push({
							id : infoIn[i].id_sala,
							id_horario : infoIn[i].id_horario
						});
						auxDate = infoIn[i].fecha;
					}

				}
				if (i == infoIn.length - 1) {
					newData.push({
						fecha : auxDate,
						data : data
					});
				}
			}
		}
		
		Ti.API.info('newData:', JSON.stringify(newData));
		return newData;
	}	

	function drawMonth(result) {
		Ti.API.info('dataIn:', result);
		for (var w in work) {
			work[w].show();
		}

		var currentDay = new Date();
		if (result != null) {
			info_reserva = result.response.data.info_reserva;
			if (data_from_acHome == 0)
				info_quincho = result.response.data.info_quincho;
			else if (data_from_acHome == 1)
				info_sala = result.response.data.info_sala;
			else
				info_sala = result.response.data.info_sala;
			//info_quincho = result.response.data.info_quincho;
		}
		var newData = setNewData(info_reserva, data_from_acHome);
		//var cantHorario = horariosQuincho.length;
		
		currentDays = {};
		day = moment(dateSelected).format('D');
		month = moment(dateSelected).format('MM');
		year = moment(dateSelected).format('YYYY');
		daysInMonth = moment(dateSelected).daysInMonth();
		firstDayOfWeek = moment(moment(dateSelected).format('YYYY-MM-' + '01')).weekday();

		monthTitleLabel.text = moment(dateSelected).format('MMMM YYYY').toString().toUpperCase();

		var currentSlot = 0;
		var dayCount = 0;

		var numberOfWeeks = Math.ceil((firstDayOfWeek + daysInMonth) / 3);

		monthContainer.removeAllChildren();

		var titleWeek = Ti.UI.createView({
			height: Ti.UI.SIZE,
			width: Ti.UI.SIZE,
			layout: 'horizontal'
		});

		for (var i = 0; i < 7; i++) {

			var newday = Ti.UI.createView({
				height: fullW / 3 + 'dp',
				width: fullW / 3 + 'dp'
			});

			var newdayLabel = Ti.UI.createLabel({
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				font: Config.daysFont,
				color: Config.white,
				height: Ti.UI.SIZE,
				width: Ti.UI.SIZE,
				touchEnabled: false,
				zIndex: 999
			});
			if (i == 0)
				newdayLabel.text = 'L';
			if (i == 1 || i == 2)
				newdayLabel.text = 'M';
			if (i == 3)
				newdayLabel.text = 'J';
			if (i == 4)
				newdayLabel.text = 'V';
			if (i == 5)
				newdayLabel.text = 'S';
			if (i == 6)
				newdayLabel.text = 'D';
			newday.label = newdayLabel;
			newday.add(newdayLabel);
			titleWeek.add(newday);
		}

		monthContainer.add(titleWeek);

		for (var i = 0; i < numberOfWeeks; i++) {

			var newweek = Ti.UI.createView({
				height: Ti.UI.SIZE,
				width: Ti.UI.SIZE,
				layout: 'horizontal'
			});

			for (var j = 0; j < 7; j++) {
				var newday = Ti.UI.createView({
					height: fullW / 3 + 'dp',
					width: fullW / 3 + 'dp'
				});

				if (currentSlot >= firstDayOfWeek && dayCount < daysInMonth) {

					dayCount++;
					var flagEncontrado = false;
					var pos;
					for (var k in newData) {
						var newDayC;
						if (dayCount < 10)
							newDayC = '0' + dayCount;
						else
							newDayC = dayCount;
						if (moment(newData[k].fecha).format('DD MM YYYY').toString() == moment(year + '-' + month + '-' + newDayC).format('DD MM YYYY').toString()) {
							Ti.API.info('funciona!!');
							pos = k;
							flagEncontrado = true;
						}
					}
					var selectedDayView = Ti.UI.createView({
						height: '60dp',
						width: '60dp',
						rippleColor: Config.white,
						callback: fakeFunction,
						finish: finish,
						borderRadius: '50dp',
						backgroundColor: 'transparent',
						borderWidth: '2dp',
						id: countArrayDaystoSelect,
						dia: dayCount,
						mes: parseInt(month),
						ano: parseInt(year),
						data: null
					});

					if (flagEncontrado == true) {
						Ti.API.info('Se registro!');
						selectedDayView.data = newData[pos];
					}
					var contornoFake = Ti.UI.createView({
						height: '60dp',
						width: '60dp',
						borderRadius: '50dp',
						borderWidth: '3dp',
						borderColor: 'transparent',
						backgroundColor: 'transparent',
						touchEnabled: false
					});

					countArrayDaystoSelect++;
					var newdayLabel = Ti.UI.createLabel({
						text: dayCount,
						textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
						font: Config.inputFont,
						color: Config.white,
						height: Ti.UI.SIZE,
						width: Ti.UI.SIZE,
						touchEnabled: false,
						zIndex: 999,
						desabilitado: false
					});
					arrayDaystoSelectV.push(selectedDayView);
					arrayDaystoSelectL.push(newdayLabel);
					arrayDaystoSelectCF.push(contornoFake);
					/*
					 Ti.API.info('month:', parseInt(month));
					 Ti.API.info('currentDay.getMonth:', parseInt(currentDay.getMonth())+1);
					 Ti.API.info('currentDay.getDate:', currentDay.getDate());
					 Ti.API.info('dayCount:', dayCount);*/
					if (parseInt(dayCount) == parseInt(currentDay.getDate()) && parseInt(month) == parseInt(currentDay.getMonth()) + 1) {
						newdayLabel.color = Config.colorDayCurrent;
						newdayLabel.font = Config.daysFont;
					}
					selectedDayView.add(newdayLabel);
					newday.label = selectedDayView;
					newday.add(selectedDayView);
					newday.add(contornoFake);

					currentDays[dayCount + '/' + month] = newday;

					var desabilitado = false;
					if (flagEncontrado == true) {
						if (newData[pos].data.length == horariosQuincho.length || (parseInt(dayCount) < parseInt(currentDay.getDate()) && parseInt(month) <= parseInt(currentDay.getMonth()) + 1)) {
							newdayLabel.color = Config.blueLow;
							newdayLabel.desabilitado = true;
							desabilitado = true;
						}
					} else {

						if ((parseInt(dayCount) < parseInt(currentDay.getDate()) && parseInt(month) <= parseInt(currentDay.getMonth()) + 1) || parseInt(month) < parseInt(currentDay.getMonth()) + 1) {
							newdayLabel.color = Config.blueLow;
							newdayLabel.desabilitado = true;
							desabilitado = true;
						}
					}
					if (desabilitado == false) {
						selectedDayView.addEventListener('click', function (e) {
							if (clicking == false) {

								clicking = true;
								ripple.round(e);
								//labelQuincho.text = 'Quincho';
								Ti.API.info('data::', e.source.data);
								if (e.source.data == null)
									dataDiaSelect = [];
								else
									dataDiaSelect = e.source.data.data;

								for (var k in arrayDaystoSelectV) {
									if (arrayDaystoSelectL[k].desabilitado == false) {
										//arrayDaystoSelectL[k].color = Config.inputTextColor;
										arrayDaystoSelectL[k].font = Config.inputFont;
									}

									arrayDaystoSelectCF[k].borderColor = 'transparent';
									arrayDaystoSelectV[k].backgroundColor = 'transparent';
									arrayDaystoSelectV[k].borderColor = 'transparent';

									if (parseInt(arrayDaystoSelectL[k].text) == parseInt(currentDay.getDate()) && parseInt(month) == parseInt(currentDay.getMonth()) + 1) {
										arrayDaystoSelectL[k].color = Config.colorDayCurrent;
										arrayDaystoSelectL[k].font = Config.daysFont;
									}
								}
								e.source.backgroundColor = Config.colorLast_name;
								e.source.borderColor = Config.colorLast_name;

								arrayDaystoSelectL[e.source.id].color = Config.white;
								arrayDaystoSelectCF[e.source.id].borderColor = Config.colorLast_name;
								//labelQuincho.top = '20dp';
								var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
								//labelDate.text = e.source.dia + ' ' + meses[parseInt(e.source.mes) - 1] + ' ' + e.source.ano;
								Ti.API.info('día seleccionado: ', e.source.dia + '-' + e.source.mes + '-' + e.source.ano);
								diamesano.text = e.source.dia + ' ' + meses[parseInt(e.source.mes) - 1] + ' ' + e.source.ano;
								if (data_from_acHome == 0) {
									horasyalgo.text = 'Horas y quinchos disponibles';
									openSeleccionarHoraQuincho();
								}
								else if (data_from_acHome == 1) {
									horasyalgo.text = 'Horas y salas disponibles';
									openSeleccionarHoraSalaE();
								}
								else {
									horasyalgo.text = 'Horas y salas disponibles';
									openSeleccionarHoraReuniones();
								}
							}
						});

					}

				}
				newweek.add(newday);

				if (j < 6) {
					var newhsep = Ti.UI.createView({
						backgroundColor: Config.hintgray,
						height: fullW / 3 + 'dp',
						width: '1dp'
					});
					//newweek.add(newhsep);
				}

				currentSlot++;

			}

			monthContainer.add(newweek);

			if (i < numberOfWeeks - 1) {
				var newvsep = Ti.UI.createView({
					backgroundColor: Config.hintgray,
					height: '1dp',
					width: (fullW + 6) + 'dp'
				});
				//monthContainer.add(newvsep);
			}

		}
		//xhr.calendar(gotData, moment(dateSelected).format('MM/YYYY'), moment(dateSelected).format('YYYY-MM-01T00:00:00Z'), moment(dateSelected).format('YYYY-MM-' + daysInMonth + 'T23:59:59Z'));

	}

	function openSeleccionarHoraSalaE() {
		if (dataDiaSelect != null) {

			contentHorarioR.removeAllChildren();
			for (var i in horarioEventos) {
				Ti.API.info('horarioEventos[i]:', horarioEventos[i].horario_eventos);
				var contentOpcion = Ti.UI.createView({
					width: Ti.UI.FILL,
					height: Ti.UI.SIZE,
					top: '20dp',
					touchEnabled: false,
					bubbleParent: false,
					layout: 'vertical'
				});
				var contentHorario = Ti.UI.createView({
					width: Ti.UI.SIZE,
					height: '50dp',
					touchEnabled: false
				});

				var picReloj = Ti.UI.createImageView({
					image: '/images/edificio.png',
					height: '25dp',
					width: '25dp',
					left: '0dp'
				});

				var labelHorario = Ti.UI.createLabel({
					text: horarioEventos[i].horario_eventos,
					font: {
						fontSize: '18dp'
					},
					color: Config.color2CO,
					height: 'auto',
					textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
					touchEnabled: false,
					left: '35dp'
				});

				contentHorario.add(picReloj);
				contentHorario.add(labelHorario);

				Ti.API.info('dataDiaSelect:', JSON.stringify(dataDiaSelect));
				Ti.API.info('info_sala:', JSON.stringify(info_sala));
				var noDibujar = [];
				for (var j in dataDiaSelect) {
					if (dataDiaSelect[j].id_horario == horarioEventos[i].id) {

						for (var k in info_sala) {
							if (dataDiaSelect[j].id == info_sala[k].id) {
								noDibujar.push(dataDiaSelect[j].id);
							}
						}
					}
				}

				var contentQS = Ti.UI.createView({
					width: Ti.UI.SIZE,
					height: Ti.UI.SIZE,
					touchEnabled: false
				});
				var espacioLeft = 0;
				for (var j in info_sala) {
					var encontrado = false;
					for (var k in noDibujar) {
						if (info_sala[j].id == noDibujar[k]) {
							encontrado = true;
							break;
						}
					}
					if (encontrado == false) {
						if (j > 0)
							espacioLeft += 70;
						if (j == 4)
							espacioLeft = 0;
						var buttonQS = Ti.UI.createView({
							width: '60dp',
							height: '50dp',
							left: espacioLeft,
							top: '10dp',
							touchEnabled: true,
							backgroundColor: Config.colorLast_name,
							borderColor: Config.colorLast_name,
							borderRadius: Config.borderRadius,
							data_name: info_sala[j],
							data_horario: horarioEventos[i],
							d_name: info_sala[j].nombre_sala,
							horario_eventos: horarioEventos[i].horario_eventos,
							rippleColor: Config.white,
							callback: cerrarPopup,
							finish: finish
						});
						if (j > 3)
							buttonQS.top = '70dp';

						var labelNameQuincho = Ti.UI.createLabel({
							text: info_sala[j].nombre_sala,
							font: {
								fontSize: '22dp'
							},
							color: Config.white,
							height: 'auto',
							textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
							touchEnabled: false
						});

						buttonQS.add(labelNameQuincho);
						contentQS.add(buttonQS);

						contentQS.addEventListener('click', function (e) {
							if (clicking == false) {
								clicking = true;
								labelQuincho.text = 'Salón ' + e.source.d_name;
								salaInput = e.source.data_name;
								horarioInput = e.source.data_horario;
								labelSeleccionarHora.text = e.source.horario_eventos;

								flagSeleccionFin = true;
								ripple.effect(e);
							}
						});

					}
				}
				contentOpcion.add(contentHorario);
				contentOpcion.add(contentQS);
				Ti.API.info('noDibujar:', JSON.stringify(noDibujar));
				/*
				var buttonContinuar = Ti.UI.createView({
				width : Ti.UI.FILL,
				height : '70dp',
				left : '60dp',
				right : '60dp',
				top : '80dp',
				touchEnabled : true,
				backgroundColor : Config.colorLast_name,
				borderColor : Config.colorLast_name,
				borderRadius : Config.borderRadius
				});

				var labelContinuar = Ti.UI.createLabel({
				text : 'CONTINUAR',
				font : {
				fontSize : '22dp'
				},
				color : Config.white,
				height : 'auto',
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				touchEnabled : false
				});

				buttonContinuar.add(labelContinuar);*/
				/*
				contentHorario.addEventListener('click', function(e) {
				if (clicking == false) {
				clicking = true;
				labelSeleccionarHora.text = e.source.data.horario_eventos;
				ripple.round(e);
				}
				});*/

				//if (i < 3) {

				contentHorarioR.add(contentOpcion);
				/*} else {
				 contentDer.add(contentHorario);
				 }*/

			}
			viewBlackPopUpSH.show();
			viewClose.addEventListener('click', function (e) {
				cerrarPopup();
			});
		} else {
			var text = 'DEBE SELECCIONAR FECHA';
			openAlerta(text);
		}
	}


	function openSeleccionarHoraQuincho() {
		if (dataDiaSelect != null) {

			contentHorarioR.removeAllChildren();
			for (var i in horariosQuincho) {
				var contentOpcion = Ti.UI.createView({
					width: Ti.UI.FILL,
					height: Ti.UI.SIZE,
					top: '20dp',
					touchEnabled: false,
					bubbleParent: false,
					layout: 'vertical'
				});
				var contentHorario = Ti.UI.createView({
					width: Ti.UI.SIZE,
					height: '50dp',
					touchEnabled: false
				});

				var picReloj = Ti.UI.createImageView({
					image: '/images/edificio.png',
					height: '25dp',
					width: '25dp',
					left: '0dp'
				});

				var labelHorario = Ti.UI.createLabel({
					text: horariosQuincho[i].horario_quincho,
					font: {
						fontSize: '18dp'
					},
					color: Config.color2CO,
					height: 'auto',
					textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
					touchEnabled: false,
					left: '35dp'
				});

				contentHorario.add(picReloj);
				contentHorario.add(labelHorario);

				Ti.API.info('dataDiaSelect:', JSON.stringify(dataDiaSelect));
				Ti.API.info('info_quincho:', JSON.stringify(info_quincho));
				var noDibujar = [];
				for (var j in dataDiaSelect) {
					if (dataDiaSelect[j].id_horario == horariosQuincho[i].id) {

						for (var k in info_quincho) {
							if (dataDiaSelect[j].id == info_quincho[k].id) {
								noDibujar.push(dataDiaSelect[j].id);
							}
						}
					}
				}

				var contentQS = Ti.UI.createView({
					width: Ti.UI.SIZE,
					height: Ti.UI.SIZE,
					touchEnabled: false
				});
				var espacioLeft = 0;
				for (var j in info_quincho) {
					var encontrado = false;
					for (var k in noDibujar) {
						if (info_quincho[j].id == noDibujar[k]) {
							encontrado = true;
							break;
						}
					}
					if (encontrado == false) {
						if (j > 0)
							espacioLeft += 70;
						if (j == 4)
							espacioLeft = 0;
						var buttonQS = Ti.UI.createView({
							width: '60dp',
							height: '50dp',
							left: espacioLeft,
							top: '10dp',
							touchEnabled: true,
							backgroundColor: Config.colorLast_name,
							borderColor: Config.colorLast_name,
							borderRadius: Config.borderRadius,
							data_name: info_quincho[j],
							data_horario: horariosQuincho[i],
							d_name: info_quincho[j].nombre_quincho,
							horario_quincho: horariosQuincho[i].horario_quincho,
							rippleColor: Config.white,
							callback: cerrarPopup,
							finish: finish
						});
						if (j > 3)
							buttonQS.top = '70dp';
						var labelNameQuincho = Ti.UI.createLabel({
							text: info_quincho[j].nombre_quincho,
							font: {
								fontSize: '22dp'
							},
							color: Config.white,
							height: 'auto',
							textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
							touchEnabled: false
						});

						buttonQS.add(labelNameQuincho);
						contentQS.add(buttonQS);

						// contentQS.addEventListener('click', function(e) {
						// 	if (clicking == false) {
						// 		clicking = true;
						// 		labelQuincho.text = 'Quincho ' + e.source.d_name;
						// 		quinchoInput = e.source.data_name;
						// 		horarioInput = e.source.data_horario;
						// 		labelSeleccionarHora.text = e.source.horario_quincho;

						// 		flagSeleccionFin = true;
						// 		ripple.effect(e);
						// 	}
						// });

					}
				}
				contentOpcion.add(contentHorario);
				contentOpcion.add(contentQS);
				Ti.API.info('noDibujar:', JSON.stringify(noDibujar));
				/*
				var buttonContinuar = Ti.UI.createView({
				width : Ti.UI.FILL,
				height : '70dp',
				left : '60dp',
				right : '60dp',
				top : '80dp',
				touchEnabled : true,
				backgroundColor : Config.colorLast_name,
				borderColor : Config.colorLast_name,
				borderRadius : Config.borderRadius
				});

				var labelContinuar = Ti.UI.createLabel({
				text : 'CONTINUAR',
				font : {
				fontSize : '22dp'
				},
				color : Config.white,
				height : 'auto',
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				touchEnabled : false
				});

				buttonContinuar.add(labelContinuar);*/
				/*
				contentHorario.addEventListener('click', function(e) {
				if (clicking == false) {
				clicking = true;
				labelSeleccionarHora.text = e.source.data.horario_quincho;
				ripple.round(e);
				}
				});*/

				//if (i < 3) {

				contentHorarioR.add(contentOpcion);
				/*} else {
				 contentDer.add(contentHorario);
				 }*/

			}
			viewBlackPopUpSH.show();
			viewClose.addEventListener('click', function (e) {
				cerrarPopup();
			});
		} else {
			var text = 'DEBE SELECCIONAR FECHA';
			openAlerta(text);
		}
	}


	function openSeleccionarHoraReuniones() {
		if (dataDiaSelect != null) {
			contentHorarioR.removeAllChildren();
			for (var i in horarioReuniones) {
				Ti.API.info('horarioReuniones[i]:', horarioReuniones[i].horario_reuniones);
				var contentOpcion = Ti.UI.createView({
					width: Ti.UI.FILL,
					height: Ti.UI.SIZE,
					top: '20dp',
					touchEnabled: false,
					bubbleParent: false,
					layout: 'vertical'
				});
				var contentHorario = Ti.UI.createView({
					width: Ti.UI.SIZE,
					height: '50dp',
					touchEnabled: false
				});

				var picReloj = Ti.UI.createImageView({
					image: '/images/edificio.png',
					height: '25dp',
					width: '25dp',
					left: '0dp'
				});

				var labelHorario = Ti.UI.createLabel({
					text: horarioReuniones[i].horario_reuniones,
					font: {
						fontSize: '18dp'
					},
					color: Config.color2CO,
					height: 'auto',
					textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
					touchEnabled: false,
					left: '35dp'
				});

				contentHorario.add(picReloj);
				contentHorario.add(labelHorario);

				Ti.API.info('dataDiaSelect:', JSON.stringify(dataDiaSelect));
				Ti.API.info('info_sala:', JSON.stringify(info_sala));
				var noDibujar = [];
				for (var j in dataDiaSelect) {
					if (dataDiaSelect[j].id_horario == horarioReuniones[i].id) {

						for (var k in info_sala) {
							if (dataDiaSelect[j].id == info_sala[k].id) {
								noDibujar.push(dataDiaSelect[j].id);
							}
						}
					}
				}

				var contentQS = Ti.UI.createView({
					width: Ti.UI.SIZE,
					height: Ti.UI.SIZE,
					touchEnabled: false
				});
				var espacioLeft = 0;
				for (var j in info_sala) {
					var encontrado = false;
					for (var k in noDibujar) {
						if (info_sala[j].id == noDibujar[k]) {
							encontrado = true;
							break;
						}
					}
					if (encontrado == false) {
						if (j > 0)
							espacioLeft += 70;
						if (j == 4)
							espacioLeft = 0;
						var buttonQS = Ti.UI.createView({
							width: '60dp',
							height: '50dp',
							left: espacioLeft,
							top: '10dp',
							touchEnabled: true,
							backgroundColor: Config.colorLast_name,
							borderColor: Config.colorLast_name,
							borderRadius: Config.borderRadius,
							data_name: info_sala[j],
							data_horario: horarioReuniones[i],
							d_name: info_sala[j].nombre_sala,
							horario_reuniones: horarioReuniones[i].horario_reuniones,
							rippleColor: Config.white,
							callback: cerrarPopup,
							finish: finish
						});
						if (j > 3)
							buttonQS.top = '70dp';

						var labelNameQuincho = Ti.UI.createLabel({
							text: info_sala[j].nombre_sala,
							font: {
								fontSize: '22dp'
							},
							color: Config.white,
							height: 'auto',
							textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
							touchEnabled: false
						});

						buttonQS.add(labelNameQuincho);
						contentQS.add(buttonQS);

						contentQS.addEventListener('click', function (e) {
							if (clicking == false) {
								clicking = true;
								labelQuincho.text = 'Sala ' + e.source.d_name;
								salaInput = e.source.data_name;
								horarioInput = e.source.data_horario;
								labelSeleccionarHora.text = e.source.horario_reuniones;

								flagSeleccionFin = true;
								ripple.effect(e);
							}
						});

					}
				}
				contentOpcion.add(contentHorario);
				contentOpcion.add(contentQS);
				Ti.API.info('noDibujar:', JSON.stringify(noDibujar));
				/*
				var buttonContinuar = Ti.UI.createView({
				width : Ti.UI.FILL,
				height : '70dp',
				left : '60dp',
				right : '60dp',
				top : '80dp',
				touchEnabled : true,
				backgroundColor : Config.colorLast_name,
				borderColor : Config.colorLast_name,
				borderRadius : Config.borderRadius
				});

				var labelContinuar = Ti.UI.createLabel({
				text : 'CONTINUAR',
				font : {
				fontSize : '22dp'
				},
				color : Config.white,
				height : 'auto',
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				touchEnabled : false
				});

				buttonContinuar.add(labelContinuar);*/
				/*
				contentHorario.addEventListener('click', function(e) {
				if (clicking == false) {
				clicking = true;
				labelSeleccionarHora.text = e.source.data.horario_reuniones;
				ripple.round(e);
				}
				});*/

				//if (i < 3) {

				contentHorarioR.add(contentOpcion);
				/*} else {
				 contentDer.add(contentHorario);
				 }*/

			}
			viewBlackPopUpSH.show();
			viewClose.addEventListener('click', function (e) {
				cerrarPopup();
			});
		} else {
			var text = 'DEBE SELECCIONAR FECHA';
			openAlerta(text);
		}
	}

	function fakeFunction() {

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
		self.close();
	}

	function openGoal(goal) {
		//
	}

	function finish() {
		clicking = false;
	}




	self.addEventListener('android:back', function (e) {

		e.cancelBubble = true;
		if (clicking == false) {
			clicking = true;
			ripple.round({
				source: leftButton
			});
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
		viewBlackPopUpSH.hide();
		clicking = false;
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

module.exports = calendario;
