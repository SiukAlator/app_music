var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');
var topLabels = ['ÁREAS COMUNES', 'PUBLICAR AVISO', 'CONFIGURACIÓN'];
var respMenus = [];
var idMenu = [9,2,10];
var imagesMenu = ['sala.png','publicar.png', 'config.png'];
var top = ['Volver pantalla'];
var nameProyectoLabel;
var help;

function SideMenu() {
	var summon = require('/mods/summon');
	var self;
	var topTable;
	var pic;
	var contentPic;
	var helpButton;
	var clicking = false;
	var name;
	
	

	function construct() {

		var me = Ti.App.Properties.getString('me', null);
		//var nom_proyecto = Ti.App.Properties.getString('nom_proyecto_main', null);
		var IDImagen = Ti.App.Properties.getString('id_photo', null);
		var depto = Ti.App.Properties.getString('name_perfil', null);
		var flagAC = Ti.App.Properties.getBool('flagAC', null);
		var user_job;
		var tamBottom = '80dp';

		var tamPerfil = '230dp';
		var tamOpciones = '130dp';

		var topRows = new Array();

		if (Config.isAndroid) {
			self = Ti.UI.createView({
				height: Ti.UI.FILL,
				width: Ti.UI.FILL,
				backgroundColor: Config.sidemenuBackgroundColor
			});
		} else {
			self = Ti.UI.createWindow({
				height: Ti.UI.FILL,
				width: Ti.UI.FILL,
				backgroundColor: Config.sidemenuBackgroundColor,
				orientationModes: Config.orientation
			});
		}

		var actionBar = Ti.UI.createView({
			top : 0,
			height : Config.barHeight,
			width : Ti.UI.FILL,
			backgroundColor : Config.mitad2,
			touchEnabled : false
		});

		var rightButton = Ti.UI.createView({
			right : '4dp',
			top : '0dp',
			borderRadius : '20dp',
			height : '40dp',
			width : '40dp',
			backgroundImage : '/images/ic_menu_w.png',
			id : 11,
			index : 11,
			rippleColor : Config.white,
			touchEnabled : true

		});

		helpButton = Ti.UI.createView({
			left : '4dp',
			top : '2dp',
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

		if (!Config.isAndroid) {
			rightButton.top = '20dp';
			helpButton.top = '20dp';
		}

		//actionBar.add(helpButton);
		//actionBar.add(rightButton);

		var headerContainer = Ti.UI.createView({
			width : Ti.UI.FILL,
			top : Config.barHeight,
			bottom : '0dp',
			left : Config.marginMenuPrincipal,
			layout : 'vertical',
			backgroundColor : Config.mitad2,
			height : '159dp'
		});

		var nameComplete = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			layout : 'vertical',
			top : '5dp',
			left: '0dp'
		});

		name = Ti.UI.createLabel({
			text : (Ti.App.Properties.getString('name', new Object) + ' ' + Ti.App.Properties.getString('last_name', new Object)).toUpperCase() + ' - DEPTO ' + depto,
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.white,
			height : 'auto',
			width : 'auto',
			left : '0dp'
		});

		// var labelPerfil = Ti.UI.createLabel({
		// 	text : name_perfil,
		// 	font : {
		// 		fontSize : '20dp',
		// 		fontWeight : 'bold'
		// 	},
		// 	color : Config.celesteClaro,
		// 	height : 'auto',
		// 	width : 'auto',
		// 	left : '10dp'
		// });

		contentPic = Ti.UI.createView({
			height : '80dp',
			width : '80dp',
			top : '0dp',
			left : '0dp'
		});
		pic = null;

		pic = Ti.UI.createImageView({
			image : '/images/perfil.png',
			height : '80dp',
			width : '80dp',
			borderRadius : '40dp',
			borderWidth : '2dp',
			borderColor: 'transparent'
		});
		
		var contornoFake = Ti.UI.createView({
			height : '80dp',
			width : '80dp',
			borderRadius : '40dp',
			borderWidth : '3dp',
			borderColor: 'transparent',
			backgroundColor: 'transparent'
			
		});

		if (IDImagen != null && IDImagen != "") {
			/*
			 var params = {
			 token : Ti.App.Properties.getString('me', null),
			 id_image : IDImagen
			 };
			 xhr.getImagePerfil(setFotoPerfil, params);
			 */
			
			var imageIn = Config.path_images_users + IDImagen + "?t=" + new Date();
			pic.image = imageIn;
			//Ti.API.info('Imagen de perfil:' + Config.path_images_users + IDImagen);

		}

		var labelBienvenido = Ti.UI.createLabel({
			text: 'BIENVENIDO',
			font: Config.biggerinputFont,
			color: Config.color1,
			height: 'auto',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled: false,
			top: '0dp',
			left: '0dp'
		});

		contentPic.add(pic);
		contentPic.add(contornoFake);

		headerContainer.add(contentPic);
		
		nameComplete.add(labelBienvenido);
		nameComplete.add(name);
		//nameComplete.add(labelPerfil);
		headerContainer.add(nameComplete);
		/*
		 var headerProyecto = Ti.UI.createView({
		 width : Ti.UI.FILL,
		 height : Ti.UI.SIZE,
		 top : '0dp',
		 bottom : '0dp',
		 layout : 'vertical',
		 backgroundColor : Config.colorWallpaper1
		 });

		 var separatorUp = Ti.UI.createView({
		 height : '2dp',
		 width : Ti.UI.FILL,
		 backgroundColor : Config.colorBar,
		 top : '0dp'
		 });
		 var separatorDown = Ti.UI.createView({
		 height : '2dp',
		 width : Ti.UI.FILL,
		 backgroundColor : Config.colorBar,
		 top : '10dp'
		 });

		 var textProyecto = Ti.UI.createView({
		 width : Ti.UI.SIZE,
		 layout : 'horizontal',
		 height : Ti.UI.SIZE,
		 backgroundColor : Config.colorWallpaper1,
		 top : '10dp'

		 });
		 var proyectoLabel = Ti.UI.createLabel({
		 text : L('SideMenu_proyectoLabel'),
		 font : {
		 fontSize : '16dp',
		 fontWeight : 'bold'
		 },
		 color : Config.colorPrimario2,
		 height : 'auto',
		 width : Ti.UI.SIZE
		 });
		 nameProyectoLabel = Ti.UI.createLabel({
		 text : nom_proyecto,
		 font : {
		 fontSize : '16dp',
		 fontWeight : 'bold'
		 },
		 color : Config.white,
		 height : 'auto',
		 width : Ti.UI.SIZE,
		 left : '10dp'
		 });

		 */
		/*
		 textProyecto.add(proyectoLabel);
		 textProyecto.add(nameProyectoLabel);
		 headerProyecto.add(separatorUp);
		 headerProyecto.add(textProyecto);
		 headerProyecto.add(separatorDown);

		 headerContainer.add(headerProyecto);
		 */

		topTable = Ti.UI.createView({
			width : Ti.UI.FILL,
			backgroundColor : Config.mitad2Oscuro,
			top : '220dp',
			bottom : tamBottom,
			layout : 'vertical',
			height : Ti.UI.FILL
		});

		if (!Config.isAndroid) {
			topTable.top = '208dp';
		}

		for (var i = 0; i < topLabels.length; i++) {

			var rowBox = Ti.UI.createView({
				height : '60dp',
				width : Ti.UI.FILL,
				left : Config.marginMenuPrincipal,
				id : topLabels[i],
				index : idMenu[i],
				rippleColor : Config.white
			});

			var textMenu = Ti.UI.createView({
				width : Ti.UI.FILL,
				layout : 'horizontal',
				left : '0dp',
				height : Ti.UI.SIZE,
				touchEnabled : false
			});

			var label = Ti.UI.createLabel({
				text : topLabels[i],
				font : {
					fontSize : '16dp',
					fontWeight : 'bold'
				},
				color : Config.inputHintColor,
				height : 'auto',
				width : '180dp',
				left : '70dp',
				touchEnabled : false
			});

			var contenRowImage = Ti.UI.createView({
				height : '35dp',
				width : '35dp',
				left : '0dp',
				backgroundColor : Config.mitad2,
				touchEnabled : false
			});

			var rowImage = Ti.UI.createImageView({
				image : '/images/' + imagesMenu[i],
				height : '35dp',
				width : '35dp',
				touchEnabled : false
			});

			textMenu.add(label);
			contenRowImage.add(rowImage);
			rowBox.add(contenRowImage);
			rowBox.add(textMenu);
			respMenus.push(rowBox);
			topTable.add(rowBox);

		}
		/***Bottom***/
		var contentSP = Ti.UI.createView({
			width : Ti.UI.FILL,
			backgroundColor : Config.mitad2Oscuro,
			height : tamOpciones,
			left : '30dp',
			right : '30dp',
			top : '0dp'
		});

		var heightOpciones = '100dp';
		var separacionOpciones = '35dp';

		var contentOpciones = Ti.UI.createView({
			width : Ti.UI.SIZE,
			height : heightOpciones,
			layout : 'horizontal',
			top : '0dp'
		});

		var opcion1 = Ti.UI.createView({
			width : '100dp',
			height : heightOpciones,
			layout : 'vertical'
		});

		var funcionAdjuntarImagen1 = Ti.UI.createView({
			borderRadius : '25dp',
			borderWidth : '2dp',
			height : '50dp',
			width : '50dp',
			id : L('SideMenu_cambiarArea'),
			index : 9,
			rippleColor : Config.white,
			borderColor : Config.colorPrimario2,
			backgroundColor : Config.fondoBoton
		});

		var imageIcon1 = Ti.UI.createImageView({
			backgroundImage : '/images/192_cambiar.png',
			height : Config.heightWidthIconBoton,
			width : Config.heightWidthIconBoton,
			touchEnabled : false
		});

		funcionAdjuntarImagen1.add(imageIcon1);

		var labelOpcion1 = Ti.UI.createLabel({
			font : {
				fontSize : '14dp',
				fontWeight : 'bold'
			},
			color : Config.white,
			height : Ti.UI.SIZE,
			touchEnabled : false,
			text : L('SideMenu_cambiarArea'),
			top : '10dp'
		});

		var opcion2 = Ti.UI.createView({
			width : '100dp',
			height : heightOpciones,
			layout : 'vertical',
			left : separacionOpciones
		});

		

		// opcion1.add(funcionAdjuntarImagen1);
		// opcion1.add(labelOpcion1);
		// opcion2.add(funcionAdjuntarImagen2);
		// opcion2.add(labelOpcion2);

		//contentOpciones.add(opcion1);
		//contentOpciones.add(opcion2);
		contentSP.add(contentOpciones);

		/*************************************/
		var bottomTable = Ti.UI.createView({
			bottom : '0dp',
			height : tamBottom,
			backgroundColor : Config.black,
			width : Ti.UI.FILL,
			index : 11,
			id: 'Cerrar sesión',
			rippleColor : Config.white,
		});



		var labelCerrarSession= Ti.UI.createLabel({
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.white,
			height : Ti.UI.SIZE,
			touchEnabled : false,
			text : 'X    CERRAR SESIÓN',
			top : '20dp',
			left : '20dp'
		});

		//bottomTable.add(iconCerrar);
		bottomTable.add(labelCerrarSession);
		/***End bottom***/
		self.add(actionBar);
		self.add(headerContainer);
		self.add(topTable);
		self.add(bottomTable);
		/*
		var leftHelp = [];

		var rightHelp = [{
			img : '/images/ic_menu_w.png',
			text : 'Cerrar menú'
		}];

		var mainHelp = [fakeView()];

		var extraHelp = ['"Proyecto" indica el proyecto en el cual se está trabajando actualmente.', 'El botón "Seguimiento" es para poder ingresar los datos de seguimiento en cada una de las unidades de control.', 'El botón "Planificación" es para ir a las distintas visualizaciones de la planificación semanal.'];

		help = summon.contexthelpMenu(leftHelp, rightHelp, mainHelp, extraHelp);

		self.add(help);*/
		
		if (flagAC == false)
		{
			Ti.API.info('No incluye AC');
			closeAreasComunes();
		}

	}

	function reloadHead() {
		var IDImagen = Ti.App.Properties.getString('id_photo', null);
		if (IDImagen != null && IDImagen != "") {
			var imageIn = Config.path_images_users + IDImagen + "?t=" + new Date();
			/*
			 image : '/images/perfil.png',
			 height : '100dp',
			 width : '100dp'*/

			pic.image = imageIn;
			name.text = Ti.App.Properties.getString('name', new Object) + ' ' + Ti.App.Properties.getString('last_name', new Object);
			Ti.API.info('Imagen de perfil Reload:' + IDImagen);
		}
	}

	function fakeView() {

	}

	function showHelp() {
		help.animate_show();
	}

	function finish() {
		clicking = false;
	}
	
	function closeAreasComunes()
	{
		respMenus[0].height = '0dp';
	}

	construct();
	Config.reloadHead = reloadHead;

	return self;
}

module.exports = SideMenu;
