var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');
var moment = require('/libs/moment');

function NewUser() {

	var name = Ti.App.Properties.getString('name', null);
	var last_name = Ti.App.Properties.getString('last_name', null);
	var phone = Ti.App.Properties.getString('phone', null);
	var email = Ti.App.Properties.getString('email', null);
	var idUser = Ti.App.Properties.getString('id_user', null);
	var idPhoto = Ti.App.Properties.getString('id_photo', null);
	var idToken = Ti.App.Properties.getString('me', null);

	var filename = idUser;
	var projects = [];
	var idProjects = [];
	var codeArea = [];
	var listaImagenesInputIDs = [];
	var listaImagenesInput = [];
	var self;
	var nav;
	var foto;
	var content;
	var dataProyectos;

	var work = [];

	var myGoalsContainer;

	var leftButton;

	var clicking;

	var proyectoInput;

	var flagSeleccionarAvance = false;

	clicking = false;
	var flagOpencambiarporcentaje = false;
	var viewCambiarporcentaje;

	var flagOpenOpcionAdjuntar = false;
	var viewOpcionAdjuntar;

	var titleHead = L('NewUser_Title');

	var imagenAdjunta = false;
	var contentImagenesAdjuntas;
	var arrayImagenesAdjuntas = [];
	var boxAI;

	var flagOpenAbrirFoto = false;
	var viewAbrirFoto;
	var contentSPAbrirFoto;

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

		actionBar.add(leftButton);
		actionBar.add(centerLabel);

		content.add(actionBar);

	} else {

		self = Ti.UI.createWindow({
			title : titleHead,
			navBarHidden : false,
			exitOnClose : true,
			windowSoftInputMode : Config.softInput,
			backgroundColor : Config.backgroundColor,
			barColor : Config.actionbarBackgroundColor,
			navTintColor : Config.titleButtonColor,
			orientationModes : Config.orientation,
			titleAttributes : {
				color : Config.titleTextColor,
				fontWeight : 'bold'
			}
		});

		var bg_image = Ti.UI.createImageView({
			image : Config.wallpaperApp,
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			top : '0dp'
		});

		self.add(bg_image);

		nav = Ti.UI.iOS.createNavigationWindow({
			window : self
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
			top : '8dp',
			layout : 'vertical'
		});

		foto = Ti.UI.createImageView({
			borderRadius : Config.bigborderRadius,
			height : Ti.UI.FILL,
			width : Ti.UI.SIZE,
			touchEnabled : false
		});

		contentOpenPhoto = Ti.UI.createView({
			top : '5dp',
			left : '5dp',
			right : '5dp',
			height : Config.tamContentImagenAbierta + 'dp',
			width : Ti.UI.FILL
		});

		boxAI = Ti.UI.createView({
			height : '80dp',
			width : Ti.UI.FILL
		});

		viewOpcionAdjuntar = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			top : '0dp',
			backgroundColor : Config.transparenceBlack2,
			visible : false
		});

		viewOpcionAdjuntar.addEventListener('click', function(e) {
			cerrarPopup();
		});

		var myGoalsIndicator = Ti.UI.createActivityIndicator({
			style : Config.isAndroid ? Ti.UI.ActivityIndicatorStyle.BIG_DARK : Ti.UI.ActivityIndicatorStyle.BIG,
			height : '120dp',
			width : '120dp'
		});

		imagenesAdjuntas();

		work.push(myGoalsIndicator);
		contentOpenPhoto.add(myGoalsIndicator);

		getData();

		scroll.add(myGoalsContainer);

		content.add(scroll);

		self.add(content);

		opcionAdjuntar();
		abrirFoto();

	}

	var inputNombre;
	var inputApellido;
	var inputTelefono;
	var inputEmail;

	function addData() {

		//myGoalsContainer.removeAllChildren();
		/**** Nombre ****/
		var boxContent1 = Ti.UI.createView({
			height : Config.heightContentText,
			width : Ti.UI.FILL
		});

		var rowBoxOrange1 = Ti.UI.createView({
			backgroundColor : Config.colorPrimario2,
			height : Config.heightRowBoxOrange,
			width : '4dp',
			left : '0dp',
			touchEnabled : false
		});

		var boxNombre = Ti.UI.createView({
			borderColor : Config.colorBar,
			borderRadius : Config.bigborderRadius,
			backgroundColor : Config.colorWallpaper1,
			borderWidth : '1dp',
			height : Ti.UI.SIZE,
			left : Config.marginNewUser,
			right : Config.marginNewUser

		});

		inputNombre = Ti.UI.createTextField({
			height : '42dp',
			font : {
				fontSize : '16dp'
			},
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_NONE,
			hintTextColor : Config.color1,
			color : Config.color1,
			autocorrect : true,
			keyboardType : Ti.UI.KEYBOARD_TYPE_DEFAULT,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			touchEnabled : true,
			hintText : 'Nombre',
			backgroundColor : 'transparent',
			focusable : true,
			left : '10dp',
			right : '10dp'
		});

		var separatorTable1 = Ti.UI.createView({
			height : '2dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			bottom : '0dp'
		});

		/**** Apellido ****/

		var boxContent2 = Ti.UI.createView({
			height : Config.heightContentText,
			width : Ti.UI.FILL
		});

		var rowBoxOrange2 = Ti.UI.createView({
			backgroundColor : Config.colorPrimario2,
			height : Config.heightRowBoxOrange,
			width : '4dp',
			left : '0dp',
			rippleColor : Config.white,
			touchEnabled : false
		});

		var boxApellido = Ti.UI.createView({
			borderColor : Config.colorBar,
			borderRadius : Config.bigborderRadius,
			backgroundColor : Config.colorWallpaper1,
			borderWidth : '1dp',
			height : Ti.UI.SIZE,
			left : Config.marginNewUser,
			right : Config.marginNewUser

		});

		inputApellido = Ti.UI.createTextField({
			height : '42dp',
			font : {
				fontSize : '16dp'
			},
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_NONE,
			hintTextColor : Config.color1,
			color : Config.color1,
			autocorrect : true,
			keyboardType : Ti.UI.KEYBOARD_TYPE_DEFAULT,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			touchEnabled : true,
			hintText : 'Apellido',
			backgroundColor : 'transparent',
			focusable : true,
			left : '10dp',
			right : '10dp'
		});

		var separatorTable2 = Ti.UI.createView({
			height : '2dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			bottom : '0dp'
		});

		/*** Telefono ***/

		var boxContent3 = Ti.UI.createView({
			height : Config.heightContentText,
			width : Ti.UI.FILL
		});

		var rowBoxOrange3 = Ti.UI.createView({
			backgroundColor : Config.colorPrimario2,
			height : Config.heightRowBoxOrange,
			width : '4dp',
			left : '0dp',
			rippleColor : Config.white,
			touchEnabled : false
		});

		var boxTelefono = Ti.UI.createView({
			borderColor : Config.colorBar,
			borderRadius : Config.bigborderRadius,
			backgroundColor : Config.colorWallpaper1,
			borderWidth : '1dp',
			height : Ti.UI.SIZE,
			left : Config.marginNewUser,
			right : Config.marginNewUser

		});

		inputTelefono = Ti.UI.createTextField({
			height : '42dp',
			font : {
				fontSize : '16dp'
			},
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_NONE,
			hintTextColor : Config.color1,
			color : Config.color1,
			autocorrect : true,
			keyboardType : Ti.UI.KEYBOARD_TYPE_PHONE_PAD,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			touchEnabled : true,
			hintText : 'Telefono',
			backgroundColor : 'transparent',
			focusable : true,
			left : '10dp',
			right : '10dp'
		});

		var separatorTable3 = Ti.UI.createView({
			height : '2dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			bottom : '0dp'
		});

		/*** Email ***/

		var boxContent4 = Ti.UI.createView({
			height : Config.heightContentText,
			width : Ti.UI.FILL
		});

		var rowBoxOrange4 = Ti.UI.createView({
			backgroundColor : Config.colorPrimario2,
			height : Config.heightRowBoxOrange,
			width : '4dp',
			left : '0dp',
			rippleColor : Config.white,
			touchEnabled : false
		});

		var boxEmail = Ti.UI.createView({
			borderColor : Config.colorBar,
			borderRadius : Config.bigborderRadius,
			backgroundColor : Config.colorWallpaper1,
			borderWidth : '1dp',
			height : Ti.UI.SIZE,
			left : Config.marginNewUser,
			right : Config.marginNewUser

		});

		inputEmail = Ti.UI.createTextField({
			height : '42dp',
			font : {
				fontSize : '16dp'
			},
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_NONE,
			hintTextColor : Config.color1,
			color : Config.color1,
			autocorrect : true,
			keyboardType : Ti.UI.KEYBOARD_TYPE_EMAIL,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			touchEnabled : true,
			hintText : 'Email',
			backgroundColor : 'transparent',
			focusable : true,
			left : '10dp',
			right : '10dp'
		});

		var separatorTable4 = Ti.UI.createView({
			height : '2dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			bottom : '0dp'
		});

		/*** Proyectos ***/
		var boxContentProyectos = Ti.UI.createView({
			height : Config.heightContentText,
			width : Ti.UI.FILL
		});

		var rowBoxOrangeProy = Ti.UI.createView({
			backgroundColor : Config.colorPrimario2,
			height : Config.heightRowBoxOrange,
			width : '4dp',
			left : '0dp',
			rippleColor : Config.white,
			touchEnabled : false
		});

		var boxProyectos = Ti.UI.createView({
			borderColor : Config.colorPrimario2,
			borderRadius : Config.bigborderRadius,
			borderWidth : '1dp',
			backgroundColor : Config.colorWallpaper1,
			top : '10dp',
			height : Ti.UI.SIZE,
			left : Config.marginNewUser,
			right : Config.marginNewUser,
			rippleColor : Config.white,
			callback : popupProyecto,
			finish : finish
		});

		proyectoInput = Ti.UI.createLabel({
			width : Ti.UI.SIZE,
			height : '42dp',
			font : {
				fontSize : '16dp'
			},
			color : Config.color1,
			backgroundColor : 'transparent',
			left : '15dp',
			touchEnabled : false,
			text : 'Proyectos'
		});

		var rowSelectorProy = Ti.UI.createImageView({
			image : '/images/192_down.png',
			height : '30dp',
			width : '30dp',
			right : '15dp',
			touchEnabled : false
		});

		boxProyectos.addEventListener('click', function(e) {
			if (clicking == false) {
				clicking = true;
				ripple.effect(e);
				clicking = false;
			}
		});

		var scrolltblvAutoComplete = Ti.UI.createScrollView({
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			visible : false,
			bubbleParent : false
		});

		var separatorTableProy = Ti.UI.createView({
			height : '2dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			bottom : '0dp'
		});

		boxProyectos.add(proyectoInput);
		boxProyectos.add(rowSelectorProy);
		scrolltblvAutoComplete.add(tblvAutoComplete);
		boxProyectos.add(scrolltblvAutoComplete);

		boxContentProyectos.add(rowBoxOrangeProy);
		boxContentProyectos.add(boxProyectos);
		boxContentProyectos.add(separatorTableProy);

		/*** Adjuntar Imagen ***/

		var textMenuAI = Ti.UI.createView({
			width : Ti.UI.FILL,
			layout : 'horizontal',
			height : Ti.UI.SIZE,
			left : '0dp',
			touchEnabled : false,
			top : '30dp'
		});

		var rowBoxOrangeAI = Ti.UI.createView({
			backgroundColor : Config.colorPrimario2,
			height : Config.heightRowBoxOrange,
			width : '4dp',
			rippleColor : Config.white,
			touchEnabled : false
		});

		var label1AI = Ti.UI.createLabel({
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.colorPrimario2,
			height : 'auto',
			width : Ti.UI.SIZE,
			left : '15dp',
			touchEnabled : false,
			text : 'Adjuntar'
		});

		var label2AI = Ti.UI.createLabel({
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.white,
			height : 'auto',
			width : Ti.UI.SIZE,
			left : '4dp',
			touchEnabled : false,
			text : 'imagen'
		});

		var funcionAdjuntarImagen = Ti.UI.createView({
			borderRadius : '25dp',
			borderWidth : '2dp',
			height : '50dp',
			width : '50dp',
			right : '24dp',
			rippleColor : Config.white,
			callback : VisibleAdjuntarImagen,
			finish : finish,
			borderColor : Config.colorPrimario2,
			backgroundColor : Config.fondoBoton,
			top : '15dp'
		});

		var imageIcon = Ti.UI.createImageView({
			backgroundImage : '/images/192_attach.png',
			height : Config.heightWidthIconBoton,
			width : Config.heightWidthIconBoton,
			touchEnabled : false
		});

		funcionAdjuntarImagen.add(imageIcon);

		funcionAdjuntarImagen.addEventListener('click', function(e) {
			if (clicking == false) {
				clicking = true;
				ripple.round(e);
			}

		});

		var separatorTableAI = Ti.UI.createView({
			height : '2dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			bottom : '0dp'
		});

		/*** Boton Confirmar ***/
		var buttonLogin = Ti.UI.createView({
			backgroundColor : Config.colorPrimario2,
			borderColor : Config.colorPrimario2,
			borderRadius : Config.bigborderRadius,
			top : '35dp',
			bottom : '20dp',
			height : '42dp',
			left : '64dp',
			right : '64dp',
			width : Ti.UI.FILL,
			rippleColor : Config.white,
			callback : confirmar,
			finish : finish
		});

		var buttonLabel = Ti.UI.createLabel({
			text : 'CONFIRMAR',
			font : {
				fontSize : '16dp'
			},
			color : Config.color1,
			touchEnabled : false
		});

		buttonLogin.add(buttonLabel);

		buttonLogin.addEventListener('click', function(e) {

			if (clicking == false) {
				flag = 1;

				clicking = true;
				ripple.effect(e);

			}

		});
		if (name != "") {
			inputNombre.setValue(name);
		}
		if (last_name != "") {
			inputApellido.setValue(last_name);
		}
		if (phone != "") {
			inputTelefono.setValue(phone);
		}
		if (email != "") {
			inputEmail.setValue(email);
		}

		boxNombre.add(inputNombre);
		boxContent1.add(rowBoxOrange1);
		boxContent1.add(boxNombre);
		boxContent1.add(separatorTable1);

		boxApellido.add(inputApellido);
		boxContent2.add(rowBoxOrange2);
		boxContent2.add(boxApellido);
		boxContent2.add(separatorTable2);

		boxTelefono.add(inputTelefono);
		boxContent3.add(rowBoxOrange3);
		boxContent3.add(boxTelefono);
		boxContent3.add(separatorTable3);

		boxEmail.add(inputEmail);
		boxContent4.add(rowBoxOrange4);
		boxContent4.add(boxEmail);
		boxContent4.add(separatorTable4);

		imagenesAdjuntas();
		if (imagenAdjunta == true) {
			// 80 + 128

			boxAI.height = '208dp';
		}
		textMenuAI.add(rowBoxOrangeAI);
		textMenuAI.add(label1AI);
		textMenuAI.add(label2AI);
		boxAI.add(textMenuAI);
		boxAI.add(funcionAdjuntarImagen);
		boxAI.add(contentImagenesAdjuntas);
		boxAI.add(separatorTableAI);

		myGoalsContainer.add(boxContent1);
		myGoalsContainer.add(boxContent2);
		myGoalsContainer.add(boxContent3);
		myGoalsContainer.add(boxContent4);
		if (projects != null) {
			myGoalsContainer.add(boxContentProyectos);
		}

		myGoalsContainer.add(boxAI);
		myGoalsContainer.add(buttonLogin);

	}

	var tblvAutoComplete = Ti.UI.createTableView({
		width : '100%',
		backgroundColor : '#EFEFEF',
		height : 0,
		maxRowHeight : 35,
		minRowHeight : 35,
		allowSelection : true,
		bubbleParent : false
	});

	function cerrarPopup() {
		if (flagBuscarProyecto == true) {
			viewBuscarProyecto.hide();
			flagBuscarProyecto = false;
			proyectoTextField.value = "";
			proyectoTextField.hintText = "Buscar";
		}
	}

	var scrollContentProy;
	var proyectoTextField;

	function seleccionProy() {
		cerrarPopup();
		hideSoftKeyboard();
	}

	function PatternMatch(idSelector, pattern) {

		var tempArray = [];
		if (idSelector == 21) {
			var searchLen = pattern.length;
			searchArrayProyecto.sort();

			for (var index = 0,
			    len = searchArrayProyecto.length; index < len; index++) {
				if (searchArrayProyecto[index].substring(0, searchLen).toUpperCase() === pattern.toUpperCase()) {
					tempArray.push(searchArrayProyecto[index]);
				}
			}

		}
		return tempArray;

	}

	function setAbrirFoto(imageOpen, id) {
		for (var index in work) {
			work[index].hide();
		}

		arrayImagenes[id] = imageOpen;
		foto.image = imageOpen;
		foto.height = Ti.UI.FILL;
		foto.width = Ti.UI.SIZE;

	}

	function buscarProyecto(proyectos, ids_proyectos) {

		viewBuscarProyecto = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			top : '0dp',
			backgroundColor : Config.transparenceBlack2,
			visible : false
		});

		viewBuscarProyecto.addEventListener('click', function(e) {
			cerrarPopup();
		});

		var contentSP = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			left : Config.widhtPopup,
			right : Config.widhtPopup,
			top : '50dp',
			bottom : '50dp',
			backgroundColor : Config.white,
			borderRadius : Config.bigborderRadius,
			bubbleParent : false,
			layout : 'vertical'
		});

		var margin = '20dp';
		var boxProyecto = Ti.UI.createView({
			borderColor : Config.colorBar,
			borderRadius : Config.bigborderRadius,
			backgroundColor : Config.white,
			borderWidth : '1dp',
			top : '10dp',
			height : Ti.UI.SIZE,
			left : margin,
			right : margin,
			rippleColor : Config.white,
			callback : popupProyecto,
			finish : finish
		});

		proyectoTextField = Ti.UI.createTextField({
			width : Ti.UI.FILL,
			height : '42dp',
			left : '10dp',
			font : {
				fontSize : '16dp'
			},
			color : Config.black,
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_NONE,
			hintTextColor : Config.black,
			autocorrect : true,
			keyboardType : Ti.UI.KEYBOARD_TYPE_DEFAULT,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			touchEnabled : true,
			hintText : L('PlanningFilters_hintTextAll1'),
			backgroundColor : 'transparent'
		});

		proyectoTextField.addEventListener('change', function(e) {
			if (flagAutocomplete == 0) {
				flagKeyboardUP = true;
				//flagDepartamentoInputUC = 0;
				var pattern = e.source.value;
				var idSelector = 21;
				var tempArray = PatternMatch(idSelector, pattern);
				CreateAutoCompleteBar(idSelector, tempArray);
			} else {
				flagAutocomplete = 0;
			}

		});

		var rowSelectorProy = Ti.UI.createImageView({
			image : '/images/192_buscar.png',
			height : '30dp',
			width : '30dp',
			right : '15dp',
			touchEnabled : false
		});

		scrollContentProy = Ti.UI.createScrollView({
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,
			top : '15dp',
			bottom : '10dp',
			left : '10dp',
			right : '10dp',
			scrollType : 'vertical',
			layout : 'vertical',
			showVerticalScrollIndicator : true
		});

		var lengthProject = 0;
		if (proyectos != null) {
			lengthProject = proyectos.length;
		}

		for (var i = 0; i < lengthProject; i++) {

			var contentProy = Ti.UI.createView({
				width : Ti.UI.FILL,
				height : '50dp',
				touchEnabled : true,
				id : proyectos[i],
				id_project : ids_proyectos[i],
				rippleColor : Config.colorWallpaper1,
				callback : seleccionProy,
				finish : finish
			});

			searchArrayProyecto.push(proyectos[i]);

			var labelProy = Ti.UI.createLabel({
				font : {
					fontSize : '16dp',
					fontWeight : 'bold'
				},
				color : Config.black,
				height : '20dp',
				touchEnabled : false,
				text : proyectos[i]
			});

			var separatorProy = Ti.UI.createView({
				height : '1dp',
				width : Ti.UI.FILL,
				backgroundColor : Config.colorBar,
				bottom : '0dp',
				touchEnabled : false
			});

			contentProy.addEventListener('click', function(e) {
				if (clicking == false) {
					clicking = true;
					ripple.effect(e);
					flagAutocomplete = 1;
					proyectoInput.text = e.source.id;
					projectSeleccionadoID = e.source.id_project;
				}
			});

			contentProy.add(labelProy);
			contentProy.add(separatorProy);
			scrollContentProy.add(contentProy);

		}

		boxProyecto.add(proyectoTextField);
		boxProyecto.add(rowSelectorProy);
		contentSP.add(boxProyecto);
		contentSP.add(scrollContentProy);
		viewBuscarProyecto.add(contentSP);

		self.add(viewBuscarProyecto);

	}

	var projectSeleccionadoID;
	var searchArrayProyecto = [];

	function popupProyecto() {
		flagAutocomplete = 0;
		clicking = false;
		scrollContentProy.removeAllChildren();
		for (var i = 0; i < searchArrayProyecto.length; i++) {

			var contentProy = Ti.UI.createView({
				width : Ti.UI.FILL,
				height : '50dp',
				touchEnabled : true,
				id : searchArrayProyecto[i],
				id_project : idProjects[i],
				rippleColor : Config.colorWallpaper1,
				callback : seleccionProy,
				finish : finish
			});

			var labelProy = Ti.UI.createLabel({
				font : {
					fontSize : '16dp',
					fontWeight : 'bold'
				},
				color : Config.black,
				height : '20dp',
				touchEnabled : false,
				text : searchArrayProyecto[i]
			});

			var separatorProy = Ti.UI.createView({
				height : '1dp',
				width : Ti.UI.FILL,
				backgroundColor : Config.colorBar,
				bottom : '0dp',
				touchEnabled : false
			});

			contentProy.addEventListener('click', function(e) {
				if (clicking == false) {
					clicking = true;
					ripple.effect(e);
					flagAutocomplete = 1;
					proyectoInput.text = e.source.id;
					projectSeleccionadoID = e.source.id_project;
				}
			});

			contentProy.add(labelProy);
			contentProy.add(separatorProy);
			scrollContentProy.add(contentProy);

		}

		flagBuscarProyecto = true;
		viewBuscarProyecto.show();
	}

	function cerrarPopup() {
		if (flagOpenOpcionAdjuntar == true) {
			viewOpcionAdjuntar.hide();
			flagOpenOpcionAdjuntar = false;
			flagCambiarFoto = false;
		} else if (flagOpenAbrirFoto == true) {
			viewAbrirFoto.hide();
			flagOpenAbrirFoto = false;
		} else if (flagBuscarProyecto == true) {

			viewBuscarProyecto.hide();
			flagBuscarProyecto = false;
			proyectoTextField.value = "";
			proyectoTextField.hintText = "Buscar";
		}
	}

	var flagOpenMenu = false;
	function nwResponse(result) {

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
					title : 'Error interno',
					message : 'por favor inténtelo nuevamente en unos minutos o contáctese con el administrador del sistema.',
					ok : 'CERRAR'
				});
				dialog.show();
				break;

			default:

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

	function setDatosProyectoMain(pID) {

		var local = Config.locale;
		var result = false;
		for (var index in dataProyectos) {

			if (dataProyectos[index].id == pID) {
				var nom_proyecto = dataProyectos[index].name;
				Ti.App.Properties.setString('project_id', dataProyectos[index].id);
				Ti.App.Properties.setString('nom_proyecto_main', nom_proyecto);
				var areas = dataProyectos[index].lista_area;
				if (areas != null) {
					Ti.App.Properties.setString('codeArea', areas[0].key);
					Ti.App.Properties.setString('area_id', areas[0].id);
					Ti.App.Properties.setString('CUC', areas[0].multilang[local].value);
					Ti.App.Properties.setString('UC', areas[0].multilang[local].name);
					result = true;
				} else {
					Ti.App.Properties.setString('area_id', null);
					Ti.App.Properties.setString('codeArea', null);
					Ti.App.Properties.setString('CUC', null);
					Ti.App.Properties.setString('UC', null);
				}

			}

		}
		return result;

	}

	function confirmar() {

		var last_login = moment.utc().format();
		Ti.App.Properties.setBool('first_login', false);

		if (projectSeleccionadoID != null) {
			setDatosProyectoMain(projectSeleccionadoID);
			if (listaImagenesInputIDs.length == 0) {
				listaImagenesInputIDs[0] = "";
			}

			var params = {
				name : inputNombre.value,
				last_name : inputApellido.value,
				phone : inputTelefono.value,
				email : inputEmail.value,
				token : idToken,
				id_user : idUser,
				photo : listaImagenesInputIDs[0]
			};

			Ti.API.error('listaImagenesInputIDs[0]:' + listaImagenesInputIDs[0]);
			Ti.App.Properties.setString('id_photo', listaImagenesInputIDs[0]);

			var photo = null;
			if (listaImagenesInput.length > 0) {
				var file = Ti.Filesystem.getFile(listaImagenesInput[0]);
				photo = file.read();

			}

			if (inputNombre.value == "" || inputApellido.value == "" || inputTelefono.value == "" || inputEmail.value == "" || arrayImagenes.length <= 0 || proyectoInput.text == "") {

				var confirmar = Ti.UI.createAlertDialog({
					cancel : 1,
					buttonNames : ['Confirmar', 'Cancelar'],
					message : 'Hay datos vacíos, ¿Está seguro que desea continuar?',
					title : 'Campos vacíos'
				});
				confirmar.addEventListener('click', function(e) {
					if (e.index == 0) {
						for (var w in work) {
							work[w].show();
						}
						Ti.App.Properties.setString('name', params['name']);
						Ti.App.Properties.setString('last_name', params['last_name']);
						xhr.nuevo_usuario(nwResponse, params, photo);

					}
				});
				confirmar.show();
			} else {
				for (var w in work) {
					work[w].show();
				}

				xhr.nuevo_usuario(nwResponse, params, photo);

			}
		} else {
			var dialog = Ti.UI.createAlertDialog({
				title : 'Proyectos',
				message : 'Debe seleccionar un proyecto.',
				ok : 'Ok'
			});
			dialog.show();
		}

	}

	var scrollImagenes;
	function imagenesAdjuntas() {

		contentImagenesAdjuntas = Ti.UI.createView({
			height : Config.tamImagenAdjunta + 'dp',
			width : Ti.UI.FILL,
			top : '90dp',
			left : '19dp',
			right : '19dp',
			visible : false
		});

		scrollImagenes = Ti.UI.createScrollView({
			height : Config.tamImagenAdjunta + 'dp',
			width : Ti.UI.SIZE,
			layout : 'horizontal',
			scrollType : 'horizontal',
			scrollingEnabled : true
		});
		contentImagenesAdjuntas.add(scrollImagenes);

	}

	/*Variables autocompletar*/
	var contentAutocompleteUC = Ti.UI.createView({
		width : Ti.UI.FILL,
		backgroundColor : Config.white,
		height : '0dp',
		bottom : '0dp'
	});
	var flagAutocomplete = 0;

	function CreateAutoCompleteBar(idSelector, searchResults) {
		contentAutocompleteUC.removeAllChildren();

		var contentAutoComplete = Ti.UI.createView({
			height : Config.heightAutoComplete,
			width : Ti.UI.FILL,
			layout : 'horizontal'
		});
		var count = 0;

		if (idSelector == 21) {

			scrollContentProy.removeAllChildren();
			for (var index = 0,
			    len = searchResults.length; index < len; index++) {

				var contentProy = Ti.UI.createView({
					width : Ti.UI.FILL,
					height : '50dp',
					touchEnabled : true,
					id : searchResults[index],
					rippleColor : Config.colorWallpaper1,
					callback : seleccionProy,
					finish : finish

				});

				var labelProy = Ti.UI.createLabel({
					font : {
						fontSize : '16dp',
						fontWeight : 'bold'
					},
					color : Config.black,
					height : '20dp',
					text : searchResults[index]
				});

				var separatorProy = Ti.UI.createView({
					height : '1dp',
					width : Ti.UI.FILL,
					backgroundColor : Config.colorBar,
					bottom : '0dp',
					touchEnabled : false
				});

				contentProy.addEventListener('click', function(e) {
					if (clicking == false) {
						clicking = true;
						ripple.effect(e);
						flagAutocomplete = 1;
						responsableInput.text = e.source.id;
					}
				});

				contentProy.add(labelProy);
				contentProy.add(separatorProy);
				scrollContentProy.add(contentProy);

			}
		}

		contentAutoComplete.width = Ti.UI.SIZE;

		contentAutocompleteUC.add(contentAutoComplete);
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
				image : imagen.media,
				width : 'auto',
				height : 'auto'
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
			height : Config.tamImagenAdjuntaAbierta,
			width : Config.tamImagenAdjuntaAbierta
		});

		return finalImage;

	}

	function abrirGaleria() {
		Ti.Media.openPhotoGallery({
			mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
			success : function(event) {
				var newH;
				var newW;
				var eventHeight;
				var eventWidth;

				if (Config.isAndroid) {

					eventHeight = event.height;
					eventWidth = event.width;

				} else {

					var img = Ti.UI.createImageView({
						image : event.media,
						width : '300dp',
						height : '300dp'
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
					height : Config.tamImagenAdjunta * 2,
					width : Config.tamImagenAdjunta * 2
				});

				var resizedImageThumbnail = event.media.imageAsResized(newWTh, newHTh);
				var finalImageThumbnail = resizedImageThumbnail.imageAsCropped({
					height : Config.tamImagenAdjunta,
					width : Config.tamImagenAdjunta
				});

				//picTaken.setImage(finalImage);

				/*************/
				//resizedImage = event.media.imageAsResized(newW, newH);

				if ( typeof path !== 'undefined') {
					var file = Ti.Filesystem.getFile(path);

					if (file.exists()) {
						file.deleteFile();
					}

				}

				var nameImage = new Date().getTime() + '_' + filename;

				var nameImageThumbnail = nameImage;

				var file = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, nameImage);
				var fileThumbnail = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, nameImageThumbnail);

				file.write(resizedImage);
				fileThumbnail.write(finalImageThumbnail);

				var path = file.resolve();

				listaImagenesInputIDs[0] = nameImage;
				listaImagenesInput[0] = path;

				/**************/

				var imagenNormal = imagenResizedNormal(event);
				dibujarFotos(finalImage, imagenNormal, nameImage, true);

			},
			cancel : function() {
				viewOpcionAdjuntar.hide();
				flagOpenOpcionAdjuntar = false;
			},
			error : function(error) {
			}
		});
	}

	function abrirCamara() {
		Ti.Media.showCamera({
			saveToPhotoGallery : false,
			mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
			success : function(event) {
				var newH;
				var newW;
				var eventHeight;
				var eventWidth;

				if (Config.isAndroid) {

					eventHeight = event.height;
					eventWidth = event.width;

				} else {

					var img = Ti.UI.createImageView({
						image : event.media,
						width : '300dp',
						height : '300dp'
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
					height : Config.tamImagenAdjunta * 2,
					width : Config.tamImagenAdjunta * 2
				});

				var resizedImageThumbnail = event.media.imageAsResized(newWTh, newHTh);
				var finalImageThumbnail = resizedImageThumbnail.imageAsCropped({
					height : Config.tamImagenAdjunta,
					width : Config.tamImagenAdjunta
				});

				/*************/

				if ( typeof path !== 'undefined') {
					var file = Ti.Filesystem.getFile(path);

					if (file.exists()) {
						file.deleteFile();
					}

				}

				var nameImage = new Date().getTime() + filename;
				var nameImageThumbnail = new Date().getTime() + filename;

				var file = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, nameImage);
				var fileThumbnail = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, nameImageThumbnail);

				file.write(resizedImage);
				fileThumbnail.write(finalImageThumbnail);

				var path = file.resolve();

				listaImagenesInputIDs[0] = nameImage;
				listaImagenesInput[0] = path;

				/**************/

				var imagenNormal = imagenResizedNormal(event);
				dibujarFotos(finalImage, imagenNormal, nameImage, true);

			},
			cancel : function() {
				viewOpcionAdjuntar.hide();
				flagOpenOpcionAdjuntar = false;
			},
			error : function(error) {
			},
		});
	}

	function abrirFoto() {
		flagOpenAbrirFoto = false;

		viewAbrirFoto = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			top : '0dp',
			backgroundColor : Config.transparenceBlack2,
			visible : false
		});

		viewAbrirFoto.addEventListener('click', function(e) {
			cerrarPopup();
		});

		var content = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			top : '25dp',
			bottom : '25dp',
			left : '25dp',
			right : '25dp',
			touchEnabled : false
		});

		contentSPAbrirFoto = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Config.tamViewContent + 'dp',
			//bottom : '60dp',
			//top : '60dp',
			backgroundColor : Config.white,
			borderRadius : Config.bigborderRadius,
			layout : 'vertical',
			bubbleParent : false
		});

		content.add(contentSPAbrirFoto);
		viewAbrirFoto.add(content);

		self.add(viewAbrirFoto);

	}

	var arrayImagenesThumb = [];

	function setImagesIniThumb(imageInput, id) {
		arrayImagenesThumb[id].image = imageInput;
		arrayImagenesThumb[id].height = Config.tamImagenAdjunta + 'dp';
		arrayImagenesThumb[id].width = Config.tamImagenAdjunta + 'dp';
		arrayImagenesThumb[id].borderRadius = (Config.tamImagenAdjunta / 2) + 'dp';
	}

	function setImagesIni(imageInput, id) {
		arrayImagenes[id] = imageInput;
		arrayImagenesAdjuntas[id].cargo = true;
	}

	var idImageOpen;
	var imageToOpen;
	var numImagenAdjunta = 0;
	var arrayImagenes = [];
	var realIDOpen = '';
	function dibujarFotos(finalImage, imagenNormal, nameImage, carga) {

		if (flagCambiarFoto == true) {
			eliminarFoto();
			flagCambiarFoto = false;
		}

		if (numImagenAdjunta < Config.cantImagenesMax) {

			var picView = Ti.UI.createView({
				borderRadius : (Config.tamImagenAdjunta / 2) + 'dp',
				height : Config.tamImagenAdjunta + 'dp',
				width : Config.tamImagenAdjunta + 'dp',
				id : numImagenAdjunta,
				visible : true,
				borderColor : Config.colorPrimario2,
				backgroundColor : Config.fondoBoton,
				borderWidth : '2dp',
				rippleColor : Config.white,
				callback : runAbrirFoto,
				finish : finish,
				top : '0dp',
				bottom : '8dp',
				vNameImage : nameImage,
				cargo : carga

			});

			var picTaken = Ti.UI.createImageView({
				height : Config.heightWidthIconAdjunt,
				width : Config.heightWidthIconAdjunt,
				touchEnabled : false,
				id : numImagenAdjunta,
				image : '/images/192_attach_photo.png'

			});

			if (finalImage != null) {
				picTaken.image = finalImage;
				picTaken.height = Config.tamImagenAdjunta + 'dp';
				picTaken.width = Config.tamImagenAdjunta + 'dp';
				picTaken.borderRadius = (Config.tamImagenAdjunta / 2) + 'dp';
			}

			if (numImagenAdjunta != 0) {
				picView.left = '20dp';
			} else {
				boxAI.height = '208dp';
			}

			arrayImagenes.push(imagenNormal);
			picView.addEventListener('click', function(e) {
				if (clicking == false) {

					realIDOpen = e.source.vNameImage;
					idImageOpen = e.source.id;
					foto.image = null;

					if (e.source.cargo == true) {

						imageToOpen = arrayImagenes[e.source.id];

						setAbrirFoto(imageToOpen, e.source.id);

					} else {

						for (var index in work) {
							work[index].show();
						}

						var params = {
							token : idToken,
							id_image : nameImage,
							id : e.source.id
						};
						xhr.getImage(setAbrirFoto, params);

						e.source.cargo = true;

					}
					clicking = true;
					ripple.round(e);

				}

			});
			arrayImagenesThumb.push(picTaken);
			picView.add(picTaken);
			arrayImagenesAdjuntas.push(picView);
			scrollImagenes.add(picView);

			contentImagenesAdjuntas.show();

			arrayImagenesAdjuntas[numImagenAdjunta].show();

			flagOpenOpcionAdjuntar = false;
			viewOpcionAdjuntar.hide();
			numImagenAdjunta = numImagenAdjunta + 1;

		} else {
			viewOpcionAdjuntar.hide();
			flagOpenOpcionAdjuntar = false;

			var dialog = Ti.UI.createAlertDialog({
				title : 'Máximo de imagenes',
				message : 'el máximo de imagenes para adjuntar es de ' + Config.cantImagenesMax + '.',
				ok : 'CERRAR'
			});
			dialog.show();

		}

	}

	function opcionAdjuntar() {
		flagOpenOpcionAdjuntar = false;

		var contentSP = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : '130dp',
			left : Config.widhtPopup,
			right : Config.widhtPopup,
			backgroundColor : Config.white,
			borderRadius : Config.bigborderRadius,
			bubbleParent : false
		});

		var heightOpciones = '100dp';
		var separacionOpciones = '35dp';

		var contentOpciones = Ti.UI.createView({
			width : Ti.UI.SIZE,
			height : heightOpciones,
			layout : 'horizontal'
		});

		var opcion1 = Ti.UI.createView({
			width : '50dp',
			height : heightOpciones,
			layout : 'vertical'
		});

		var funcionAdjuntarImagen1 = Ti.UI.createView({
			borderRadius : '25dp',
			borderWidth : '2dp',
			height : '50dp',
			width : '50dp',
			rippleColor : Config.white,
			callback : abrirCamara,
			finish : finish,
			borderColor : Config.colorPrimario2,
			backgroundColor : Config.fondoBoton
		});

		funcionAdjuntarImagen1.addEventListener('click', function(e) {
			if (clicking == false) {
				clicking = true;
				ripple.round(e);
			}

		});

		var imageIcon1 = Ti.UI.createImageView({
			backgroundImage : '/images/192_camera.png',
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
			color : Config.black,
			height : Ti.UI.SIZE,
			touchEnabled : false,
			text : 'Tomar\n  foto',
			top : '10dp'
		});

		var opcion2 = Ti.UI.createView({
			width : '50dp',
			height : heightOpciones,
			layout : 'vertical',
			left : separacionOpciones
		});

		var funcionAdjuntarImagen2 = Ti.UI.createView({
			borderRadius : '25dp',
			borderWidth : '2dp',
			height : '50dp',
			width : '50dp',
			rippleColor : Config.white,
			callback : abrirGaleria,
			finish : finish,
			borderColor : Config.colorPrimario2,
			backgroundColor : Config.fondoBoton
		});

		funcionAdjuntarImagen2.addEventListener('click', function(e) {
			if (clicking == false) {
				clicking = true;
				ripple.round(e);
			}

		});

		var imageIcon2 = Ti.UI.createImageView({
			backgroundImage : '/images/192_gallery.png',
			height : Config.heightWidthIconBoton,
			width : Config.heightWidthIconBoton,
			touchEnabled : false
		});

		funcionAdjuntarImagen2.add(imageIcon2);

		var labelOpcion2 = Ti.UI.createLabel({
			font : {
				fontSize : '14dp',
				fontWeight : 'bold'
			},
			color : Config.black,
			height : Ti.UI.SIZE,
			touchEnabled : false,
			text : 'Galeria',
			top : '10dp'
		});

		opcion1.add(funcionAdjuntarImagen1);
		opcion1.add(labelOpcion1);
		opcion2.add(funcionAdjuntarImagen2);
		opcion2.add(labelOpcion2);

		contentOpciones.add(opcion1);
		contentOpciones.add(opcion2);
		contentSP.add(contentOpciones);
		viewOpcionAdjuntar.add(contentSP);
		self.add(viewOpcionAdjuntar);
	}

	var flagCambiarFoto = false;

	function cambiarFoto() {
		flagCambiarFoto = true;
		viewAbrirFoto.hide();
		flagOpenAbrirFoto = false;

		VisibleAdjuntarImagen();

	}

	function eliminarFoto() {

		scrollImagenes.remove(arrayImagenesAdjuntas[idImageOpen]);

		arrayImagenes.splice(idImageOpen, 1);
		arrayImagenesAdjuntas.splice(idImageOpen, 1);
		if ((numImagenAdjunta - 1) == 0) {

			contentImagenesAdjuntas.hide();
			boxAI.height = '80dp';
		}
		viewAbrirFoto.hide();
		flagOpenAbrirFoto = false;

		for (var i = idImageOpen; i < numImagenAdjunta - 1; i++) {
			arrayImagenesAdjuntas[i].id = arrayImagenesAdjuntas[i].id - 1;
		}

		numImagenAdjunta = numImagenAdjunta - 1;

	}

	function runAbrirFoto() {

		contentSPAbrirFoto.removeAllChildren();

		var heightOpciones = '100dp';
		var separacionOpciones = '50dp';

		/***Opciones de imagen ***/

		var contentOpciones = Ti.UI.createView({
			width : Ti.UI.SIZE,
			height : heightOpciones,
			layout : 'horizontal',
			top : '10dp'
		});

		var opcion1 = Ti.UI.createView({
			width : '56dp',
			height : heightOpciones,
			layout : 'vertical'
		});

		var funcionAdjuntarImagen1 = Ti.UI.createView({
			borderRadius : '25dp',
			borderWidth : '2dp',
			height : '50dp',
			width : '50dp',
			rippleColor : Config.white,
			callback : cambiarFoto,
			finish : finish,
			borderColor : Config.colorPrimario2,
			backgroundColor : Config.fondoBoton
		});

		funcionAdjuntarImagen1.addEventListener('click', function(e) {
			if (clicking == false) {
				clicking = true;
				ripple.round(e);
			}

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
			color : Config.black,
			height : Ti.UI.SIZE,
			touchEnabled : false,
			text : 'Cambiar',
			top : '10dp'
		});

		var opcion2 = Ti.UI.createView({
			width : '56dp',
			height : heightOpciones,
			layout : 'vertical',
			left : separacionOpciones
		});

		var funcionAdjuntarImagen2 = Ti.UI.createView({
			borderRadius : '25dp',
			borderWidth : '2dp',
			height : '50dp',
			width : '50dp',
			rippleColor : Config.white,
			callback : eliminarFoto,
			finish : finish,
			borderColor : Config.colorPrimario2,
			backgroundColor : Config.fondoBoton
		});

		funcionAdjuntarImagen2.addEventListener('click', function(e) {
			if (clicking == false) {
				clicking = true;
				listaImagenesInputIDs.splice(idImageOpen, 1);
				listaImagenesInput.splice(idImageOpen, 1);
				ripple.round(e);
			}

		});

		var imageIcon2 = Ti.UI.createImageView({
			backgroundImage : '/images/ic_delete_w.png',
			height : Config.heightWidthIconBoton,
			width : Config.heightWidthIconBoton,
			touchEnabled : false
		});

		funcionAdjuntarImagen2.add(imageIcon2);

		var labelOpcion2 = Ti.UI.createLabel({
			font : {
				fontSize : '14dp',
				fontWeight : 'bold'
			},
			color : Config.black,
			height : Ti.UI.SIZE,
			touchEnabled : false,
			text : 'Eliminar',
			top : '10dp'
		});

		opcion1.add(funcionAdjuntarImagen1);
		opcion1.add(labelOpcion1);
		opcion2.add(funcionAdjuntarImagen2);
		opcion2.add(labelOpcion2);

		contentOpciones.add(opcion1);
		contentOpciones.add(opcion2);

		contentOpenPhoto.add(foto);
		contentSPAbrirFoto.add(contentOpenPhoto);
		contentSPAbrirFoto.add(contentOpciones);

		viewAbrirFoto.show();
		flagOpenAbrirFoto = true;
	}

	function VisibleAdjuntarImagen() {

		if (flagCambiarFoto == true) {
			viewOpcionAdjuntar.show();
			flagOpenOpcionAdjuntar = true;
		} else {
			if (numImagenAdjunta < Config.cantImagenesMaxNU) {
				viewOpcionAdjuntar.show();
				flagOpenOpcionAdjuntar = true;
			} else {
				var dialog = Ti.UI.createAlertDialog({
					title : 'Máximo de imagenes',
					message : 'el máximo de imagenes para adjuntar es de ' + Config.cantImagenesMaxNU + '.',
					ok : 'CERRAR'
				});
				dialog.show();
			}
		}

	}

	function close() {
		// self.removeAllSharedElements();
		self.close();
		var activity = Titanium.Android.currentActivity;
		activity.finish();
	}

	function openGoal(goal) {
		//
	}

	//
	function finish() {
		clicking = false;
	}


	self.addEventListener('android:back', function(e) {

		if (flagOpenOpcionAdjuntar == true) {
			flagCambiarFoto = false;
			viewOpcionAdjuntar.hide();
			flagOpenOpcionAdjuntar = false;

		} else if (flagOpenAbrirFoto == true) {
			viewAbrirFoto.hide();
			flagOpenAbrirFoto = false;
		} else {
			e.cancelBubble = true;
			if (clicking == false) {
				clicking = true;
				ripple.round({
					source : leftButton
				});
			}
		}

	});

	construct();

	if (Config.isAndroid) {
		self.open();
	} else {
		nav.open();
	}

	function getData() {
		for (var index in work) {
			work[index].show();
		}
		var vartoken = idToken;
		var params = {
			token : vartoken
		};
		xhr.listadoproyectos(gotData, params);
	}

	function hideSoftKeyboard() {
		if (Config.isAndroid) {
			Ti.UI.Android.hideSoftKeyboard();
		} else {
			// myGoalsContainer.name.blur();
			// myGoalsContainer.telephone.blur();
		}
	}

	function setDataPhotos(idPhoto) {

		if (idPhoto != null && idPhoto != "") {

			dibujarFotos(null, null, idPhoto, false);

			listaImagenesInputIDs[0] = idPhoto;
			var params = {
				token : idToken,
				id_image : idPhoto,
				id : 0
			};

			xhr.getImage(setImagesIniThumb, params);
		}

	}

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

				case "200":
					dataProyectos = result.response.data;

					for (var index in dataProyectos) {
						projects.push(dataProyectos[index].name);
						idProjects.push(dataProyectos[index].id);

					}

					buscarProyecto(projects, idProjects);
					addData();
					setDataPhotos(idPhoto);
					break;
				case "401":

					for (var w in work) {
						work[w].hide();
					}

					var closeAlert = Ti.UI.createAlertDialog({
						cancel : 1,
						buttonNames : ['Cerrar'],
						title : 'Error de sesión',
						message : 'favor vuelva a ingresar o intentelo mas tarde.'
					});
					closeAlert.addEventListener('click', function(e) {

						Ti.App.Properties.setString('me', null);
						close();
					});

					closeAlert.show();
					break;
				default:

					for (var w in work) {
						work[w].hide();
					}

					var closeAlert = Ti.UI.createAlertDialog({
						cancel : 1,
						buttonNames : ['Cerrar'],
						title : 'Error inesperado',
						message : 'por favor inténtelo nuevamente en unos minutos o contáctese con el administrador del sistema.'
					});
					closeAlert.addEventListener('click', function(e) {

						Ti.App.Properties.setString('me', null);
						close();
					});

					closeAlert.show();
					break;
				}
			}

		}
		for (var index in work) {
			work[index].hide();
		}
	}

}

module.exports = NewUser;
