var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');
var db = require('/mods/db');
var summon = require('/mods/summon');
var help;

function Tracing(nav) {

	var self;
	var nav;
	var content;

	var work = [];

	var myGoalsContainer;

	var leftButton;
	var helpButton;

	var clicking;
	var indexID;
	var actionBar;

	clicking = false;
	var titleHead = L('Tracing_titleHead');

	content = Ti.UI.createView({
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		bubbleParent : false
	});

	var trackerName = 'Profesional de terreno: Open Tracing';
	Config.tracker.addScreenView(trackerName);

	var flagKeyboardUP = false;
	var heighContentIni;
	var widthContentIni;

	var flagBuscarResponsable = false;
	var viewBuscarResponsable;

	var departamentoInputUC;
	var flaginUC = false;
	var existePartidaResp = false;
	var existePisoResp = false;
	var existePartidaPart = false;
	var existePisoPart = false;

	if (Config.isAndroid) {

		self = Ti.UI.createWindow({
			title : titleHead,
			navBarHidden : false,
			exitOnClose : false,
			windowSoftInputMode : Config.softInputTracing,
			backgroundColor : Config.backgroundColor,
			barColor : Config.actionbarBackgroundColor,
			navTintColor : Config.titleButtonColor,
			orientationModes : Config.orientation,
			titleAttributes : {
				color : Config.titleTextColor
			}
		});

		actionBar = Ti.UI.createView({
			top : '0dp',
			height : Config.barHeight,
			width : Ti.UI.FILL
		});

		leftButton = Ti.UI.createView({
			left : '6dp',
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
			right : '6dp',
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
				hideSoftKeyboard();
				ripple.round(e);
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
				hideSoftKeyboard();
				showHelp();
			}
		});

		self = Ti.UI.createWindow({
			title : titleHead,
			navBarHidden : false,
			exitOnClose : true,
			leftNavButtons : [leftButton],
			rightNavButtons : [helpButton],
			windowSoftInputMode : Config.softInputTracing,
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
	var scrollableView;

	var boxBody_responsable;
	var boxBody_partidas;
	var boxBody_UC;

	var first = 1;

	function construct() {

		departamentoInputUC = Ti.UI.createTextField({
			height : '42dp',
			left : '10dp',
			font : {
				fontSize : '16dp'
			},
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_NONE,
			hintTextColor : Config.color1,
			color : Config.color1,
			autocorrect : true,
			keyboardType : Ti.UI.KEYBOARD_TYPE_NUMBER_PAD,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			touchEnabled : true,
			hintText : '',
			backgroundColor : 'transparent',
			focusable : true,
			width : Ti.UI.FILL

		});

		myGoalsContainer = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			top : '44dp',
			layout : 'vertical'
		});
		var myGoalsIndicator = Ti.UI.createActivityIndicator({
			style : Config.isAndroid ? Ti.UI.ActivityIndicatorStyle.BIG_DARK : Ti.UI.ActivityIndicatorStyle.BIG,
			height : '120dp',
			width : '120dp'
		});

		work.push(myGoalsIndicator);
		myGoalsContainer.add(myGoalsIndicator);

		for (var index in work) {
			work[index].show();
		}

		//getData();
		addData();

		content.add(myGoalsContainer);
		content.add(contentAutocompleteUC);

		self.add(content);

		for (var index in work) {
			work[index].hide();
		}

		first = 0;
		setDataComun();
		//buscarResponsable();

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

		var leftHelp = [{
			img : '/images/ic_navigate_before_w.png',
			text : 'Volver atrás'
		}];

		var rightHelp = [];

		var extraHelp0 = ['En esta pantalla se hace seguimiento a las diferentes partidas de cada Unidad de control.', 'Puedes elegir el filtro de seguimiento presionando en "Unidad de control", "Partida" o "Responsable"'];

		var mainHelp1 = [fakeView(1)];

		var extraHelp1 = ['Filtro por Unidad de control: Esta pantalla es para buscar una determinada unidad de control.'];

		var mainHelp2 = [fakeView(2)];

		var extraHelp2 = ['Filtro por Partida: Esta pantalla es para buscar una determinada partida en un piso determinado. El check box "Calidad OK" es para incluir los que están en estas condiciones, al igual que los "Calidad No Ok".'];

		var mainHelp3 = [fakeView(3)];

		var extraHelp3 = ['Filtro por Responsable: Esta pantalla es para buscar cuales son las partidas que tiene un determinado responsable en un piso determinado.'];

		help = summon.contexthelpTracing(leftHelp, rightHelp, extraHelp0, mainHelp1, extraHelp1, mainHelp2, extraHelp2, mainHelp3, extraHelp3);
		self.add(help);

	}

	function fakeView(indicador) {
		var menuView = Ti.UI.createView({
			top : '0dp',
			height : '66dp',
			width : Ti.UI.FILL
		});

		var separatorMenuUp = Ti.UI.createView({
			height : '1dp',
			width : Ti.UI.FILL,
			top : '0dp',
			backgroundColor : Config.colorBar
		});

		var menuViewContainer = Ti.UI.createView({
			top : '0dp',
			height : '56dp',
			width : Ti.UI.FILL
		});

		var separatorMenuDown = Ti.UI.createView({
			height : '1dp',
			width : Ti.UI.FILL,
			top : '64dp',
			backgroundColor : Config.colorBar
		});

		for ( i = 0; i < 3; i++) {

			var selectorMenu = Ti.UI.createView({
				height : '8dp',
				width : '50dp',
				backgroundColor : Config.colorPrimario2,
				visible : false,
				top : '52dp',
				id : i,
				touchEnabled : false
			});

			var textView = Ti.UI.createView({
				top : '0dp',
				height : '56dp',
				width : '105dp',
				id : i,
				rippleColor : Config.white,
				callback : functionDummy,
				finish : finish
			});

			var textLabel = Ti.UI.createLabel({
				font : {
					fontSize : '16dp',
					fontWeight : 'bold'
				},
				color : Config.color1,
				center : textView,
				touchEnabled : false
			});

			var separatorMenuL = Ti.UI.createView({
				height : '35dp',
				width : '1dp',
				left : '0dp',
				backgroundColor : Config.colorBar,
				touchEnabled : false

			});

			var separatorMenuR = Ti.UI.createView({
				height : '35dp',
				width : '1dp',
				right : '0dp',
				backgroundColor : Config.colorBar,
				touchEnabled : false
			});

			if (i == 0) {
				textLabel.setText(L('Tracing_UnidadDeControl'));
				textView.add(textLabel);
				if (indicador == 1)
					selectorMenu.setVisible(true);
				textView.add(selectorMenu);
				textView.setLeft('0dp');
				menuViewContainer.add(textView);

			} else if (i == 1) {
				textLabel.setText(L('Tracing_Partida'));
				textView.add(textLabel);
				if (indicador == 2)
					selectorMenu.setVisible(true);
				textView.add(selectorMenu);
				//textView.add(separatorMenuL);
				separatorMenuL.setLeft('33%');
				menuViewContainer.add(separatorMenuL);
				//textView.add(separatorMenuR);
				separatorMenuR.setRight('33%');
				menuViewContainer.add(separatorMenuR);
				menuViewContainer.add(textView);

			} else {
				textLabel.setText(L('Tracing_Responsable'));
				textView.add(textLabel);
				if (indicador == 3)
					selectorMenu.setVisible(true);
				textView.add(selectorMenu);
				textView.setRight('0dp');
				menuViewContainer.add(textView);
			}
		}
		return menuViewContainer;

	}

	var flagsetHeightContentIni = true;
	function setHeightContentIni() {
		if (flagsetHeightContentIni == true) {
			heighContentIni = content.getRect().height;
			widthContentIni = content.getRect().width;

			flagsetHeightContentIni = false;
		}
	};

	var bodyView = Ti.UI.createScrollView({
		showVerticalScrollIndicator : true,
		width : Ti.UI.FILL,
		top : '0dp',
		bottom : '0dp',
		layout : 'vertical',
		scrollType : 'vertical'
	});

	function filtrarResponsable() {

		for (var w in work) {
			work[w].show();
		}

		if (responsableInput.text == "") {
			var dialog = Ti.UI.createAlertDialog({
				title : L('Tracing_dialog3Title'),
				message : L('Tracing_dialog3Message'),
				ok : L('Tracing_dialog3Ok')
			});
			dialog.show();

			for (var w in work) {
				work[w].hide();
			}
		} else {

			if (CUCInputResp.value == "") {
				CUCInputResp.value = L('PlanningFilters_hintTextAll1');
				existePisoResp = true;
			}
			if (partidaInputResp.value == "") {
				partidaInputResp.value = L('PlanningFilters_hintTextAll1');
				existePartidaResp = true;
			}

			if (partidaInputResp.value != L('PlanningFilters_hintTextAll1')) {
				existePartidaResp = false;
				for (var index in lista_partida) {
					if (lista_partida[index] == partidaInputResp.value) {
						existePartidaResp = true;
					}
				}
			}
			if (CUCInputResp.value != L('PlanningFilters_hintTextAll1')) {
				existePisoResp = false;
				for (var index in lista_CUC) {
					if (lista_CUC[index] == CUCInputResp.value) {
						existePisoResp = true;
					}
				}
			}
			if (existePartidaResp == true && existePisoResp == true) {

				Config.tracker.addEvent({
					category : trackerName,
					action : 'Filtro por responsable',
					label : 'new window',
					value : 1
				});
				var Window = require('/ui/p_propietario/tracingResponsable');
				new Window(openReady, nav, responsableInput.text, searchArrayResponsableID[responsableInput.id], CUCInputResp.value, partidaInputResp.value);
				for (var w in work) {
					work[w].hide();
				}
				CUCInputResp.value = "";
				partidaInputResp.value = "";
				responsableInput.text = "";
			} else if (existePartidaResp == false) {
				var dialog = Ti.UI.createAlertDialog({
					title : L('Tracing_dialog4Title'),
					message : L('Tracing_dialog4Message'),
					ok : L('Tracing_dialog4Ok')
				});
				dialog.show();
				for (var w in work) {
					work[w].hide();
				}
				if (CUCInputResp.value == L('PlanningFilters_hintTextAll1'))
					CUCInputResp.value = "";
			} else if (existePisoResp == false) {
				var dialog = Ti.UI.createAlertDialog({
					title : L('Tracing_dialog5Title'),
					message : L('Tracing_dialog51Message') + Ti.App.Properties.getString('CUC', null) + L('Tracing_dialog52Message'),
					ok : L('Tracing_dialog5Ok')
				});
				dialog.show();
				for (var w in work) {
					work[w].hide();
				}
				if (partidaInputResp.value == L('PlanningFilters_hintTextAll1'))
					partidaInputResp.value = "";

			}

		}

	}

	function openReady() {
		responsableInput.text = '';
		CUCInputResp.value = '';
		partidaInputResp.value = '';
		partidaInput.value = '';
		CUCInput.value = '';
		departamentoInputUC.value = '';
		for (var w in work) {
			work[w].hide();
		}
	}

	function popupResponsable() {
		flagAutocomplete = 0;
		clicking = false;
		scrollContentResp.removeAllChildren();
		for (var i in searchArrayResponsable) {

			var contentResp = Ti.UI.createView({
				width : Ti.UI.FILL,
				height : '50dp',
				touchEnabled : true,
				name : searchArrayResponsable[i],
				id : i,
				rippleColor : Config.colorWallpaper1,
				callback : seleccionResp,
				finish : finish
			});

			var labelResp = Ti.UI.createLabel({
				font : {
					fontSize : '16dp',
					fontWeight : 'bold'
				},
				color : Config.black,
				height : '20dp',
				touchEnabled : false,
				text : searchArrayResponsable[i]
			});

			var separatorResp = Ti.UI.createView({
				height : '1dp',
				width : Ti.UI.FILL,
				backgroundColor : Config.colorBar,
				bottom : '0dp',
				touchEnabled : false
			});

			contentResp.addEventListener('click', function(e) {
				if (clicking == false) {
					clicking = true;
					ripple.effect(e);
					flagAutocomplete = 1;
					responsableInput.text = e.source.name;
					responsableInput.id = e.source.id;
					clicking = false;
				}
			});

			contentResp.add(labelResp);
			contentResp.add(separatorResp);
			scrollContentResp.add(contentResp);

		}

		flagBuscarResponsable = true;
		viewBuscarResponsable.show();
	}

	function cerrarPopup() {
		if (flagBuscarResponsable == true) {
			viewBuscarResponsable.hide();
			flagBuscarResponsable = false;
			responsableTextField.value = "";
			responsableTextField.hintText = L('Tracing_Buscar');
		}
	}

	var scrollContentResp;
	var responsableTextField;
	function buscarResponsable(responsables) {

		viewBuscarResponsable = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			top : '0dp',
			backgroundColor : Config.transparenceBlack2,
			visible : false
		});

		viewBuscarResponsable.addEventListener('click', function(e) {
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
		var boxResponsable = Ti.UI.createView({
			borderColor : Config.colorBar,
			borderRadius : Config.bigborderRadius,
			backgroundColor : Config.white,
			top : '10dp',
			height : Ti.UI.SIZE,
			left : margin,
			right : margin
		});

		responsableTextField = Ti.UI.createTextField({
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
			hintText : L('Tracing_filterAll_1'),
			backgroundColor : 'transparent'
		});

		responsableTextField.addEventListener('change', function(e) {
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

		var rowSelectorResp = Ti.UI.createImageView({
			image : '/images/192_buscar.png',
			height : '30dp',
			width : '30dp',
			right : '15dp',
			touchEnabled : false
		});

		scrollContentResp = Ti.UI.createScrollView({
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

		for (var i in responsables) {

			var contentResp = Ti.UI.createView({
				width : Ti.UI.FILL,
				height : '50dp',
				touchEnabled : true,
				name : responsables[i],
				id : i,
				rippleColor : Config.colorWallpaper1,
				callback : seleccionResp,
				finish : finish
			});

			searchArrayResponsable.push(responsables[i]);
			searchArrayResponsableID.push(i);

			var labelResp = Ti.UI.createLabel({
				font : {
					fontSize : '16dp',
					fontWeight : 'bold'
				},
				color : Config.black,
				height : '20dp',
				touchEnabled : false,
				text : responsables[i]
			});

			var separatorResp = Ti.UI.createView({
				height : '1dp',
				width : Ti.UI.FILL,
				backgroundColor : Config.colorBar,
				bottom : '0dp',
				touchEnabled : false
			});

			contentResp.addEventListener('click', function(e) {
				if (clicking == false) {
					clicking = true;
					ripple.effect(e);
					flagAutocomplete = 1;
					responsableInput.text = e.source.name;
					responsableInput.id = e.source.id;
					clicking = false;
				}
			});

			contentResp.add(labelResp);
			contentResp.add(separatorResp);
			scrollContentResp.add(contentResp);

		}

		boxResponsable.add(responsableTextField);
		boxResponsable.add(rowSelectorResp);
		contentSP.add(boxResponsable);
		contentSP.add(scrollContentResp);
		viewBuscarResponsable.add(contentSP);

		self.add(viewBuscarResponsable);

	}

	function bodyResponsable() {
		var margin = Config.marginViewSeguimiento;

		boxBody_responsable = Ti.UI.createView({
			top : '0dp',
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			layout : 'vertical'
		});

		var textLabel = Ti.UI.createLabel({
			text : L('Tracing_Responsable'),
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.color1,
			top : '15dp',
			left : margin,
			right : margin,
			touchEnabled : false
		});

		var boxResponsable = Ti.UI.createView({
			borderColor : Config.colorPrimario2,
			borderRadius : Config.bigborderRadius,
			backgroundColor : Config.colorWallpaper1,
			borderWidth : '1dp',
			top : '10dp',
			height : Ti.UI.SIZE,
			left : margin,
			right : margin
		});

		responsableInput = Ti.UI.createLabel({
			width : Ti.UI.SIZE,
			height : '42dp',
			font : {
				fontSize : '16dp'
			},
			color : Config.color1,
			backgroundColor : 'transparent',
			left : '15dp',
			touchEnabled : false,
			hintText : '',
			text : ''
		});

		var rowSelectorResp = Ti.UI.createImageView({
			image : '/images/192_down.png',
			height : '30dp',
			width : '30dp',
			right : '15dp',
			touchEnabled : false
		});

		boxResponsable.addEventListener('click', function(e) {
			if (clicking == false) {
				clicking = true;
				popupResponsable();
				clicking = false;
			}
		});

		var textLabel2 = Ti.UI.createLabel({
			text : Ti.App.Properties.getString('CUC', null),
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.color1,
			top : '15dp',
			left : margin,
			right : margin,
			touchEnabled : false
		});

		var boxCUC = Ti.UI.createView({
			borderColor : Config.colorBar,
			borderRadius : Config.bigborderRadius,
			backgroundColor : Config.colorWallpaper1,
			borderWidth : '1dp',
			top : '10dp',
			height : Ti.UI.SIZE,
			left : margin,
			right : margin,
			layout : 'vertical'
		});

		CUCInputResp = Ti.UI.createTextField({
			width : Ti.UI.FILL,
			left : '10dp',
			height : '42dp',
			font : {
				fontSize : '16dp'
			},
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_NONE,
			hintTextColor : Config.color1,
			autocorrect : true,
			color : Config.color1,
			keyboardType : Ti.UI.KEYBOARD_TYPE_NUMBER_PAD,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			touchEnabled : true,
			hintText : L('Tracing_filterAll_1'),
			backgroundColor : 'transparent'
		});

		CUCInputResp.addEventListener('change', function(e) {
			if (flagAutocomplete == 0) {
				flagKeyboardUP = true;
				flagCUCInputResp = 0;
				var pattern = e.source.value;
				/*idSelector = 2 para body Responsable: 2.CUCInputResp*/
				var idSelector = 22;
				var tempArray = PatternMatch(idSelector, pattern);
				CreateAutoCompleteBar(idSelector, tempArray);
			} else {
				flagAutocomplete = 0;
			}

		});

		var textLabel3 = Ti.UI.createLabel({
			text : L('Tracing_Partida'),
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.color1,
			top : '15dp',
			left : margin,
			right : margin,
			touchEnabled : false
		});

		var boxPartida = Ti.UI.createView({
			borderColor : Config.colorBar,
			borderRadius : Config.bigborderRadius,
			backgroundColor : Config.colorWallpaper1,
			borderWidth : '1dp',
			top : '10dp',
			height : Ti.UI.SIZE,
			left : margin,
			right : margin,
			layout : 'vertical',
			bubbleParent : false
		});

		partidaInputResp = Ti.UI.createTextField({
			width : Ti.UI.FILL,
			height : '42dp',
			left : '10dp',
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
			hintText : L('Tracing_filterAll_2'),
			backgroundColor : 'transparent'
		});

		partidaInputResp.addEventListener('change', function(e) {
			if (flagAutocomplete == 0) {
				flagKeyboardUP = true;
				flagPartidaInputResp = 0;
				var pattern = e.source.value;
				/*idSelector = 2 para body Responsable: 3.partidaInputResp*/
				var idSelector = 23;
				var tempArray = PatternMatch(idSelector, pattern);
				CreateAutoCompleteBar(idSelector, tempArray);
			} else {
				flagAutocomplete = 0;
			}

		});

		var buttonFiltrarResp = Ti.UI.createView({
			backgroundColor : Config.colorPrimario2,
			borderColor : Config.colorPrimario2,
			borderRadius : Config.bigborderRadius,
			top : '55dp',
			height : '42dp',
			left : margin,
			right : margin,
			rippleColor : Config.white,
			callback : filtrarResponsable,
			finish : finish
		});

		var buttonLabel = Ti.UI.createLabel({
			text : L('Tracing_Filtrar'),
			font : {
				fontSize : '16dp'
			},
			color : Config.color1,
			touchEnabled : false
		});

		buttonFiltrarResp.add(buttonLabel);

		buttonFiltrarResp.addEventListener('click', function(e) {
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

		boxBody_responsable.add(textLabel);
		boxResponsable.add(responsableInput);
		boxResponsable.add(rowSelectorResp);
		scrolltblvAutoComplete.add(tblvAutoComplete);
		boxResponsable.add(scrolltblvAutoComplete);
		boxBody_responsable.add(boxResponsable);

		boxBody_responsable.add(textLabel2);
		boxCUC.add(CUCInputResp);
		boxBody_responsable.add(boxCUC);

		boxBody_responsable.add(textLabel3);
		boxPartida.add(partidaInputResp);
		boxBody_responsable.add(boxPartida);

		boxBody_responsable.add(buttonFiltrarResp);

		boxBody_responsable.addEventListener('click', function(){
			hideSoftKeyboard();
		});

	}

	function filtrarPartida() {

		clicking = false;
		for (var w in work) {
			work[w].show();
		}
		/*Lógica de filtroPartida*/

		if (CUCInput.value == "") {
			CUCInput.value = L('PlanningFilters_hintTextAll1');
			existePisoPart = true;
		}

		if (partidaInput.value == "") {
			var dialog = Ti.UI.createAlertDialog({
				title : L('Tracing_dialog1Title'),
				message : L('Tracing_dialog1Message'),
				ok : L('Tracing_dialog1Ok')
			});
			dialog.show();
			for (var w in work) {
				work[w].hide();
			}
			if (CUCInput.value == L('PlanningFilters_hintTextAll1'))
				CUCInput.value = "";
		} else {
			if (clickCheckOK == false && clickCheckNOOK == false) {
				var dialog = Ti.UI.createAlertDialog({
					title : L('Tracing_dialog2Title'),
					message : L('Tracing_dialog2Message'),
					ok : L('Tracing_dialog2Ok')
				});
				dialog.show();
				for (var w in work) {
					work[w].hide();
				}
				if (CUCInput.value == L('PlanningFilters_hintTextAll1'))
					CUCInput.value = "";
			} else {
				existePartidaPart = false;
				for (var index in lista_partida) {

					if (lista_partida[index] == partidaInput.value) {
						existePartidaPart = true;
					}
				}
				if (CUCInput.value != L('PlanningFilters_hintTextAll1')) {
					existePisoPart = false;
					for (var index in lista_CUC) {
						if (lista_CUC[index] == CUCInput.value) {
							existePisoPart = true;
						}
					}
				}

				if (existePartidaPart == true && existePisoPart == true) {

					Config.tracker.addEvent({
						category : trackerName,
						action : 'Filtro por partida',
						label : 'new window',
						value : 1
					});
					var Window = require('/ui/p_propietario/tracingPartida');
					new Window(openReady, nav, partidaInput.value, CUCInput.value, clickCheckOK, clickCheckNOOK);
				} else if (existePartidaPart == false) {
					var dialog = Ti.UI.createAlertDialog({
						title : L('Tracing_dialog4Title'),
						message : L('Tracing_dialog4Message'),
						ok : L('Tracing_dialog4Ok')
					});
					dialog.show();
					for (var w in work) {
						work[w].hide();
					}
					if (CUCInput.value == L('PlanningFilters_hintTextAll1'))
						CUCInput.value = "";
				} else if (existePisoPart == false) {
					var dialog = Ti.UI.createAlertDialog({
						title : L('Tracing_dialog5Title'),
						message : L('Tracing_dialog51Message') + Ti.App.Properties.getString('CUC', null) + L('Tracing_dialog52Message'),
						ok : L('Tracing_dialog5Ok')
					});
					dialog.show();
					for (var w in work) {
						work[w].hide();
					}
					if (CUCInput.value == L('PlanningFilters_hintTextAll1'))
						CUCInput.value = "";
				}

			}
		}

	}

	var clickCheckOK = true;
	var clickCheckNOOK = true;
	function bodyPartidas() {
		var margin = Config.marginViewSeguimiento;

		boxBody_partidas = Ti.UI.createView({
			top : '0dp',
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,
			layout : 'vertical'
		});

		var textLabel = Ti.UI.createLabel({
			text : L('Tracing_Partida'),
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.color1,
			top : '15dp',
			left : margin,
			right : margin,
			touchEnabled : false
		});

		var boxPartida = Ti.UI.createView({
			borderColor : Config.colorBar,
			borderRadius : Config.bigborderRadius,
			backgroundColor : Config.colorWallpaper1,
			borderWidth : '1dp',
			top : '10dp',
			height : Ti.UI.SIZE,
			left : margin,
			right : margin,
			layout : 'vertical'
		});

		partidaInput = Ti.UI.createTextField({
			height : '42dp',
			left : '10dp',
			font : {
				fontSize : '16dp'
			},
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_NONE,
			hintTextColor : Config.color1,
			color : Config.color1,
			autocorrect : false,
			keyboardType : Ti.UI.KEYBOARD_TYPE_DEFAULT,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			touchEnabled : true,
			hintText : '',
			backgroundColor : 'transparent',
			width : Ti.UI.FILL
		});

		partidaInput.addEventListener('change', function(e) {
			if (flagAutocomplete == 0) {
				flagKeyboardUP = true;
				flagPartidaInput = 0;
				var pattern = e.source.value;
				/*idSelector = 1 para body Partida: 1.partidaInput*/
				var idSelector = 11;
				var tempArray = PatternMatch(idSelector, pattern);
				CreateAutoCompleteBar(idSelector, tempArray);
			} else {
				flagAutocomplete = 0;
			}

		});

		var textLabel2 = Ti.UI.createLabel({
			text : Ti.App.Properties.getString('CUC', null),
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.color1,
			top : '15dp',
			left : margin,
			right : margin,
			touchEnabled : false
		});

		var boxCUC = Ti.UI.createView({
			borderColor : Config.colorBar,
			borderRadius : Config.bigborderRadius,
			backgroundColor : Config.colorWallpaper1,
			borderWidth : '1dp',
			top : '10dp',
			height : Ti.UI.SIZE,
			left : margin,
			right : margin,
			layout : 'vertical'
		});

		CUCInput = Ti.UI.createTextField({
			height : '42dp',
			left : '10dp',
			font : {
				fontSize : '16dp'
			},
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_NONE,
			hintTextColor : Config.color1,
			autocorrect : true,
			keyboardType : Ti.UI.KEYBOARD_TYPE_NUMBER_PAD,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			touchEnabled : true,
			hintText : L('Tracing_filterAll_1'),
			backgroundColor : 'transparent',
			width : Ti.UI.FILL,
			color : Config.color1
		});

		CUCInput.addEventListener('change', function(e) {
			if (flagAutocomplete == 0) {
				flagKeyboardUP = true;
				flagCUCInput = 0;
				var pattern = e.source.value;
				/*idSelector = 1 para body Partida: 2.CUCInput*/
				var idSelector = 12;
				var tempArray = PatternMatch(idSelector, pattern);
				CreateAutoCompleteBar(idSelector, tempArray);
			} else {
				flagAutocomplete = 0;
			}

		});

		var textCalidad = Ti.UI.createLabel({
			text : L('Tracing_Calidad'),
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.color1,
			top : '15dp',
			left : margin,
			right : margin,
			touchEnabled : false
		});

		var boxCalidad = Ti.UI.createView({
			top : '10dp',
			width : Ti.UI.FILL,
			height : '42dp',
			left : margin,
			right : margin
		});
		/*** Calidad ***/

		var boxOK = Ti.UI.createView({
			borderRadius : Config.bigborderRadius,
			backgroundColor : Config.colorWallpaper1,
			borderWidth : '1dp',
			left : '0dp',
			height : Ti.UI.FILL,
			width : '100dp',
			touchEnabled : true
		});

		var textOK = Ti.UI.createLabel({
			text : L('Tracing_OK'),
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.color1,
			left : '10dp',
			touchEnabled : false
		});

		var checkOKOff = Ti.UI.createView({
			borderColor : Config.colorPrimario2,
			borderRadius : Config.borderRadius,
			backgroundColor : Config.colorWallpaper1,
			borderWidth : '1dp',
			right : '10dp',
			height : Config.tamCheckCalidad,
			width : Config.tamCheckCalidad,
			touchEnabled : false
		});

		var checkOKOn = Ti.UI.createImageView({
			image : '/images/192_ticket.png',
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,
			touchEnabled : false,
			top : '2dp',
			bottom : '2dp',
			left : '2dp',
			right : '2dp'
		});

		var boxNOOK = Ti.UI.createView({
			borderRadius : Config.bigborderRadius,
			backgroundColor : Config.colorWallpaper1,
			borderWidth : '1dp',
			right : '0dp',
			height : Ti.UI.FILL,
			width : '100dp',
			touchEnabled : true

		});

		var textNOOK = Ti.UI.createLabel({
			text : L('Tracing_NOOK'),
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.color1,
			left : '10dp',
			touchEnabled : false
		});

		var checkNOOKOff = Ti.UI.createView({
			borderColor : Config.colorPrimario2,
			borderRadius : Config.borderRadius,
			backgroundColor : Config.colorWallpaper1,
			borderWidth : '1dp',
			right : '10dp',
			height : Config.tamCheckCalidad,
			width : Config.tamCheckCalidad,
			touchEnabled : false
		});

		var checkNOOKOn = Ti.UI.createImageView({
			image : '/images/192_ticket.png',
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,
			touchEnabled : false,
			top : '2dp',
			bottom : '2dp',
			left : '2dp',
			right : '2dp'
		});

		if (clickCheckOK == true) {
			checkOKOff.add(checkOKOn);

		}
		if (clickCheckNOOK == true) {
			checkNOOKOff.add(checkNOOKOn);
		}

		boxOK.addEventListener('click', function(e) {
			if (clickCheckOK == true) {
				checkOKOff.removeAllChildren();
				clickCheckOK = false;
			} else {
				checkOKOff.add(checkOKOn);
				clickCheckOK = true;
			}
		});

		boxNOOK.addEventListener('click', function(e) {
			if (clickCheckNOOK == true) {
				checkNOOKOff.removeAllChildren();
				clickCheckNOOK = false;
			} else {
				checkNOOKOff.add(checkNOOKOn);
				clickCheckNOOK = true;
			}
		});

		boxOK.add(textOK);
		boxOK.add(checkOKOff);
		boxNOOK.add(textNOOK);
		boxNOOK.add(checkNOOKOff);
		boxCalidad.add(boxOK);
		boxCalidad.add(boxNOOK);

		var buttonFiltrarPartida = Ti.UI.createView({
			backgroundColor : Config.colorPrimario2,
			borderColor : Config.colorPrimario2,
			borderRadius : Config.bigborderRadius,
			top : '60dp',
			height : '42dp',
			left : margin,
			right : margin,
			rippleColor : Config.white,
			callback : filtrarPartida,
			finish : finish
		});

		var buttonLabel = Ti.UI.createLabel({
			text : L('Tracing_Filtrar'),
			font : {
				fontSize : '16dp'
			},
			color : Config.color1,
			touchEnabled : false
		});

		buttonFiltrarPartida.add(buttonLabel);

		buttonFiltrarPartida.addEventListener('click', function(e) {
			if (clicking == false) {
				clicking = true;
				ripple.effect(e);
				clicking = false;
			}
		});

		boxBody_partidas.add(textLabel);
		boxPartida.add(partidaInput);
		boxBody_partidas.add(boxPartida);

		boxBody_partidas.add(textLabel2);
		boxCUC.add(CUCInput);
		boxBody_partidas.add(boxCUC);

		boxBody_partidas.add(textCalidad);
		boxBody_partidas.add(boxCalidad);

		boxBody_partidas.add(buttonFiltrarPartida);
		boxBody_partidas.addEventListener('click', function(){
			hideSoftKeyboard();
		});

	}

	/*Variables autocompletar*/
	var contentAutocompleteUC = Ti.UI.createView({
		width : Ti.UI.FILL,
		backgroundColor : Config.white,
		height : '0dp',
		bottom : '0dp'
	});
	var flagAutocomplete = 0;
	/*Variables autocompletar Body Unidad de control*/

	var flagDepartamentoInputUC = 0;
	var buttonFiltrarUC;

	var searchArrayUC = [];
	var searchArrayPartida = [];
	var searchArrayCUC = [];
	var searchArrayResponsable = [];
	var searchArrayResponsableID = [];

	var lista_UC_code = [];
	var lista_UC = [];

	var lista_partida = [];
	var lista_CUC = [];
	var lista_responsable = [];

	function setDataComun() {

		var code = Ti.App.Properties.getString('codeArea', null);
		var listaUC_Complete = db.selectGENERAL(code);
		var listaUC = listaUC_Complete.values;

		for (var index in listaUC) {

			lista_UC[index] = listaUC[index].UC;
			lista_UC_code[index] = listaUC[index].ID;
		}

		searchArrayUC = lista_UC;

		code = 'PARTIDAS';
		var listaPartidas = db.selectGENERAL(code);
		searchArrayPartida = listaPartidas.values;

		for (var index in searchArrayPartida) {
			lista_partida[index] = searchArrayPartida[index];
		}

		code = 'CUC';
		var listaCUC = db.selectGENERAL(code);
		searchArrayCUC = listaCUC.values;
		for (var index in searchArrayCUC) {
			lista_CUC[index] = searchArrayCUC[index];
		}

		code = 'lista_responsable';
		var listaResponsableC = db.selectGENERAL(code);
		var listaResponsable = listaResponsableC.values;
		for (var index in listaResponsable) {
			lista_responsable[index] = listaResponsable[index].NAME;
		}

		var responsables = [];

		for (var index in listaResponsable) {
			responsables[listaResponsable[index].ID_RESP] = listaResponsable[index].NAME + ' ' + listaResponsable[index].LAST_NAME;

		}

		buscarResponsable(responsables);

	}

	//var searchArrayUC = ["100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210"];

	/*Variables autocompletar Body partida*/

	//var searchArrayPartida = ["Entrega de Obra Gruesa", "Descarachado y Pulido", "Trazado", "Despeje cajas y enlauchado", "Rasgos Interiores", "Rasgos barandas", "Instalacion Verticales de alcantarillado", "Prueba Hermeticidad", "Lana Mineral y Membrana", "Extracción Baños", "Extracción Cocinas"];
	//var searchArrayCUC = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];

	var partidaInput;
	var flagPartidaInput = 0;
	var CUCInput;
	var flagCUCInput = 0;
	var buttonFiltrarPartida;

	/*Variables autocompletar Body responsable*/

	//= ["Juan Perez", "Bob Constructor", "Steve Jobs", "Johnny Depp", "Naruto Uzumaki", "Homero Simpson", "Iván Ramirez", "Hugo Gonzalez", "Guillermo Muñoz", "Roberto Rojas"];
	var responsableInput;
	var flagResponsableInput = 0;
	var CUCInputResp;
	var flagCUCInputResp = 0;
	var partidaInputResp;
	var flagPartidaInputResp = 0;
	//var buttonFiltrarResp;

	function PatternMatch(idSelector, pattern) {

		var tempArray = [];
		if (idSelector == 0 && pattern.length > 0) {
			var searchLen = pattern.length;
			searchArrayUC.sort();
			for (var index in searchArrayUC) {

				if (searchArrayUC[index].toString().toUpperCase().indexOf(pattern.toString().toUpperCase()) !== -1) {
					tempArray.push(searchArrayUC[index]);
				}
			}
		} else if (idSelector == 11 && pattern.length > 0) {

			var searchLen = pattern.length;
			var flagFirstLetter = false;
			searchArrayPartida.sort();
			for (var index in searchArrayPartida) {
				if (searchArrayPartida[index].substring(0, searchLen).toUpperCase() === pattern.toUpperCase()) {
					tempArray.push(searchArrayPartida[index]);
					flagFirstLetter = true;
				}
			}
			if (flagFirstLetter == false) {
				for (var index in searchArrayPartida) {
					if (searchArrayPartida[index].toString().toUpperCase().indexOf(pattern.toString().toUpperCase()) !== -1) {
						tempArray.push(searchArrayPartida[index]);
					}
				}
			}

		} else if (idSelector == 12 && pattern.length > 0) {
			var searchLen = pattern.length;
			searchArrayCUC.sort();

			for (var index in searchArrayCUC) {
				if (searchArrayCUC[index].toString().toUpperCase().indexOf(pattern.toString().toUpperCase()) !== -1) {
					tempArray.push(searchArrayCUC[index]);
				}
			}

		} else if (idSelector == 21) {
			var searchLen = pattern.length;
			searchArrayResponsable.sort();
			for (var index in searchArrayResponsable) {
				if (searchArrayResponsable[index].toString().toUpperCase().indexOf(pattern.toString().toUpperCase()) !== -1) {
					tempArray.push(searchArrayResponsable[index]);
				}
			}

		} else if (idSelector == 22 && pattern.length > 0) {
			var searchLen = pattern.length;
			searchArrayCUC.sort();
			for (var index in searchArrayCUC) {
				if (searchArrayCUC[index].toString().toUpperCase().indexOf(pattern.toString().toUpperCase()) !== -1) {
					tempArray.push(searchArrayCUC[index]);
				}
			}

		} else if (idSelector == 23 && pattern.length > 0) {
			var searchLen = pattern.length;
			var flagFirstLetter = false;
			searchArrayPartida.sort();
			for (var index in searchArrayPartida) {
				if (searchArrayPartida[index].substring(0, searchLen).toUpperCase() === pattern.toUpperCase()) {
					tempArray.push(searchArrayPartida[index]);
					flagFirstLetter = true;
				}
			}
			if (flagFirstLetter == false) {
				for (var index in searchArrayPartida) {
					if (searchArrayPartida[index].toString().toUpperCase().indexOf(pattern.toString().toUpperCase()) !== -1) {
						tempArray.push(searchArrayPartida[index]);
					}
				}
			}

		}
		return tempArray;

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

	function CreateAutoCompleteList(idSelector, searchResults) {
		var tableData = [];
		for (var index = 0,
		    len = searchResults.length; index < len; index++) {

			var lblSearchResult = Ti.UI.createLabel({
				top : 2,
				width : '40%',
				height : 34,
				left : '5%',
				font : {
					fontSize : 14
				},
				color : '#000000',
				text : searchResults[index]
			});

			//Creating the table view row
			var row = Ti.UI.createTableViewRow({
				backgroundColor : 'transparent',
				height : 50,
				result : searchResults[index]
			});

			row.add(lblSearchResult);
			tableData.push(row);
		}
		tblvAutoComplete.setData(tableData);
		tblvAutoComplete.height = tableData.length * 35;
	}

	function CreateAutoCompleteBar(idSelector, searchResults) {
		contentAutocompleteUC.removeAllChildren();

		var contentAutoComplete = Ti.UI.createView({
			height : Config.heightAutoComplete,
			width : Ti.UI.FILL,
			layout : 'horizontal'
		});
		var count = 0;

		if (searchResults.length == 0) {
			contentAutocompleteUC.setHeight('0dp');
		}
		if (idSelector == 0 && searchResults.length > 0) {
			contentAutocompleteUC.setHeight(Config.heightAutoComplete);
			boxBody_UC.setBottom(Config.heightAutoComplete);
			for (var index = 0,
			    len = searchResults.length; index < len; index++) {

				if (((count + 1) * Config.spaceAutoComplete) > widthContentIni) {
					index = len;
					continue;
				}

				var lblSearchResult = Ti.UI.createLabel({
					width : Ti.UI.SIZE,
					height : Ti.UI.FILL,
					left : Config.spaceAutoComplete,
					font : {
						fontSize : 16
					},
					color : Config.rellenoCampoTexto,
					text : searchResults[index],
					ind : index
				});

				if (count == 0) {
					lblSearchResult.left = '0dp';
				}

				lblSearchResult.addEventListener('click', function(e) {
					departamentoInputUC.value = e.source.text;
					/*** ir a fin de linea ***/
					var lengthText = e.source.text.length;
					departamentoInputUC.setSelection(lengthText, lengthText);
					/***                   ***/
					indexID = e.source.ind;
					flagDepartamentoInputUC = 1;
					contentAutocompleteUC.setHeight('0dp');
					contentAutocompleteUC.removeAllChildren();
					hideSoftKeyboard();
					flagAutocomplete = 1;
				});

				contentAutoComplete.add(lblSearchResult);

				count = count + 1;

			}

			contentAutoComplete.width = Ti.UI.SIZE;
			contentAutocompleteUC.add(contentAutoComplete);

		} else if (idSelector == 11 && searchResults.length > 0) {
			contentAutocompleteUC.setHeight(Config.heightAutoComplete);
			boxBody_partidas.setBottom(Config.heightAutoComplete);
			for (var index = 0,
			    len = searchResults.length; index < len; index++) {

				/*Se configura para que se viualice solo una frase*/
				if (index == 1) {
					index = len;
					continue;
				}

				var lblSearchResult = Ti.UI.createLabel({
					width : Ti.UI.SIZE,
					height : Ti.UI.FILL,
					left : Config.spaceAutoComplete,
					font : {
						fontSize : 16
					},
					color : Config.rellenoCampoTexto,
					text : searchResults[index]
				});

				if (count == 0) {
					lblSearchResult.left = '0dp';
				}

				lblSearchResult.addEventListener('click', function(e) {
					partidaInput.value = e.source.text;
					/*** ir a fin de linea ***/
					var lengthText = e.source.text.length;
					partidaInput.setSelection(lengthText, lengthText);
					/***                   ***/
					flagPartidaInput = 1;
					contentAutocompleteUC.setHeight('0dp');
					contentAutocompleteUC.removeAllChildren();
					hideSoftKeyboard();
					flagAutocomplete = 1;
				});

				contentAutoComplete.add(lblSearchResult);

				count = count + 1;

			}

			contentAutoComplete.width = Ti.UI.SIZE;

			contentAutocompleteUC.add(contentAutoComplete);
		} else if (idSelector == 12 && searchResults.length > 0) {
			contentAutocompleteUC.setHeight(Config.heightAutoComplete);
			boxBody_partidas.setBottom(Config.heightAutoComplete);
			for (var index = 0,
			    len = searchResults.length; index < len; index++) {

				/*Se configura para que se viualice solo una frase*/
				if (index == 1) {
					index = len;
					continue;
				}

				var lblSearchResult = Ti.UI.createLabel({
					width : Ti.UI.SIZE,
					height : Ti.UI.FILL,
					left : Config.spaceAutoComplete,
					font : {
						fontSize : 16
					},
					color : Config.rellenoCampoTexto,
					text : searchResults[index]
				});

				if (count == 0) {
					lblSearchResult.left = '0dp';
				}

				lblSearchResult.addEventListener('click', function(e) {
					CUCInput.value = e.source.text;
					/*** ir a fin de linea ***/
					var lengthText = e.source.text.length;
					CUCInput.setSelection(lengthText, lengthText);
					/***                   ***/
					flagCUCInput = 1;
					contentAutocompleteUC.setHeight('0dp');
					contentAutocompleteUC.removeAllChildren();
					hideSoftKeyboard();
					flagAutocomplete = 1;
				});

				contentAutoComplete.add(lblSearchResult);

				count = count + 1;

			}

			contentAutoComplete.width = Ti.UI.SIZE;

			contentAutocompleteUC.add(contentAutoComplete);
		} else if (idSelector == 21) {
			//contentAutocompleteUC.setHeight(Config.heightAutoComplete);
			//boxBody_responsable.setBottom(Config.heightAutoComplete);
			scrollContentResp.removeAllChildren();
			for (var index in searchResults) {

				var contentResp = Ti.UI.createView({
					width : Ti.UI.FILL,
					height : '50dp',
					touchEnabled : true,
					name : searchResults[index],
					id : index,
					rippleColor : Config.colorWallpaper1,
					callback : seleccionResp,
					finish : finish

				});

				var labelResp = Ti.UI.createLabel({
					font : {
						fontSize : '16dp',
						fontWeight : 'bold'
					},
					color : Config.black,
					height : '20dp',
					text : searchResults[index],
					touchEnabled : false
				});

				var separatorResp = Ti.UI.createView({
					height : '1dp',
					width : Ti.UI.FILL,
					backgroundColor : Config.colorBar,
					bottom : '0dp',
					touchEnabled : false
				});

				contentResp.addEventListener('click', function(e) {
					if (clicking == false) {
						clicking = true;
						ripple.effect(e);
						flagAutocomplete = 1;
						responsableInput.text = e.source.name;
						responsableInput.id = e.source.id;
						clicking = false;
					}
				});

				contentResp.add(labelResp);
				contentResp.add(separatorResp);
				scrollContentResp.add(contentResp);

			}
		} else if (idSelector == 22 && searchResults.length > 0) {
			contentAutocompleteUC.setHeight(Config.heightAutoComplete);
			boxBody_responsable.setBottom(Config.heightAutoComplete);
			for (var index = 0,
			    len = searchResults.length; index < len; index++) {

				/*Se configura para que se viualice solo una frase*/
				if (index == 1) {
					index = len;
					continue;
				}

				var lblSearchResult = Ti.UI.createLabel({
					width : Ti.UI.SIZE,
					height : Ti.UI.FILL,
					left : Config.spaceAutoComplete,
					font : {
						fontSize : 16
					},
					color : Config.rellenoCampoTexto,
					text : searchResults[index]
				});

				if (count == 0) {
					lblSearchResult.left = '0dp';
				}

				lblSearchResult.addEventListener('click', function(e) {
					CUCInputResp.value = e.source.text;
					/*** ir a fin de linea ***/
					var lengthText = e.source.text.length;
					CUCInputResp.setSelection(lengthText, lengthText);
					/***                   ***/
					flagCUCInputResp = 1;
					contentAutocompleteUC.setHeight('0dp');
					contentAutocompleteUC.removeAllChildren();
					hideSoftKeyboard();
					flagAutocomplete = 1;
				});

				contentAutoComplete.add(lblSearchResult);

				count = count + 1;

			}

			contentAutoComplete.width = Ti.UI.SIZE;

			contentAutocompleteUC.add(contentAutoComplete);
		} else if (idSelector == 23 && searchResults.length > 0) {
			contentAutocompleteUC.setHeight(Config.heightAutoComplete);
			boxBody_responsable.setBottom(Config.heightAutoComplete);
			for (var index = 0,
			    len = searchResults.length; index < len; index++) {

				/*Se configura para que se viualice solo una frase*/
				if (index == 1) {
					index = len;
					continue;
				}

				var lblSearchResult = Ti.UI.createLabel({
					width : Ti.UI.SIZE,
					height : Ti.UI.FILL,
					left : Config.spaceAutoComplete,
					font : {
						fontSize : 16
					},
					color : Config.rellenoCampoTexto,
					text : searchResults[index]
				});

				if (count == 0) {
					lblSearchResult.left = '0dp';
				}

				lblSearchResult.addEventListener('click', function(e) {
					partidaInputResp.value = e.source.text;
					/*** ir a fin de linea ***/
					var lengthText = e.source.text.length;
					partidaInputResp.setSelection(lengthText, lengthText);
					/***                   ***/
					flagPartidaInputResp = 1;
					contentAutocompleteUC.setHeight('0dp');
					contentAutocompleteUC.removeAllChildren();
					hideSoftKeyboard();
					flagAutocomplete = 1;
				});

				contentAutoComplete.add(lblSearchResult);

				count = count + 1;

			}

			contentAutoComplete.width = Ti.UI.SIZE;

			contentAutocompleteUC.add(contentAutoComplete);
		}
	}

	function filtrarUC() {
		/*Lógica de filtro por UC*/

		clicking = false;
		var id = '';

		if (departamentoInputUC.value == "") {
			var dialog = Ti.UI.createAlertDialog({
				title : L('Tracing_dialog3Title'),
				message : L('Tracing_dialog5Message'),
				ok : L('Tracing_dialog3Ok')
			});
			dialog.show();
			for (var w in work) {
				work[w].hide();
			}
		} else {

			var existeDepto = false;
			for (var index in lista_UC) {
				if (lista_UC[index] == departamentoInputUC.value) {
					existeDepto = true;
				}
			}
			if (existeDepto == true) {
				var index = lista_UC.indexOf(departamentoInputUC.value);
				id = lista_UC_code[index];

				Config.tracker.addEvent({
					category : trackerName,
					action : 'Filtrar por UC',
					label : 'new window',
					value : 1
				});
				
				var Window = require('/ui/p_propietario/tracingUC');
				new Window(openReady, nav, departamentoInputUC.value, id);


			} else {
				var dialog = Ti.UI.createAlertDialog({
					title : L('Tracing_dialog3Title'),
					message : L('Planning_dialog3Message'),
					ok : L('Tracing_dialog3Ok')
				});
				dialog.show();
				for (var w in work) {
					work[w].hide();
				}

			}

		}
	}

	function bodyUC() {

		var margin = Config.marginViewSeguimiento;

		boxBody_UC = Ti.UI.createView({
			top : '0dp',
			height : Ti.UI.SIZE,
			layout : 'vertical',
			width : Ti.UI.FILL
		});

		var textLabel = Ti.UI.createLabel({
			text : Ti.App.Properties.getString('UC', null),
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.color1,
			top : '15dp',
			left : margin,
			right : margin,
			touchEnabled : false
		});

		var boxDepartamento = Ti.UI.createView({
			borderColor : Config.colorBar,
			borderRadius : Config.bigborderRadius,
			backgroundColor : Config.colorWallpaper1,
			borderWidth : '1dp',
			top : '10dp',
			height : Ti.UI.SIZE,
			left : margin,
			right : margin,
			layout : 'vertical',
			bubbleParent : false
		});

		flaginUC = true;

		departamentoInputUC.addEventListener('change', function(e) {
			if (flagAutocomplete == 0) {
				flagKeyboardUP = true;
				flagDepartamentoInputUC = 0;
				var pattern = e.source.value;
				/*idSelector = 0 para body UC*/
				var idSelector = 0;
				var tempArray = PatternMatch(idSelector, pattern);
				CreateAutoCompleteBar(idSelector, tempArray);
			} else {
				flagAutocomplete = 0;
			}
		});

		buttonFiltrarUC = Ti.UI.createView({
			backgroundColor : Config.colorPrimario2,
			borderColor : Config.colorPrimario2,
			borderRadius : Config.bigborderRadius,
			top : '238dp',
			height : '42dp',
			left : margin,
			right : margin,
			rippleColor : Config.white,
			callback : filtrarUC,
			finish : finish
		});

		var buttonLabel = Ti.UI.createLabel({
			text : L('Tracing_Filtrar'),
			font : {
				fontSize : '16dp'
			},
			color : Config.color1,
			touchEnabled : false
		});

		buttonFiltrarUC.add(buttonLabel);

		buttonFiltrarUC.addEventListener('click', function(e) {
			if (clicking == false) {
				clicking = true;
				for (var w in work) {
					work[w].show();
				}

				ripple.effect(e);
				clicking = false;
			}
		});

		boxBody_UC.add(textLabel);
		boxDepartamento.add(departamentoInputUC);
		boxBody_UC.add(boxDepartamento);
		boxBody_UC.add(buttonFiltrarUC);

		boxBody_UC.addEventListener('click', function(e){
			hideSoftKeyboard();
		});

	}

	var arrayWhiteButton = [];
	var selectOutput;

	function functionDummy() {
		/*No hace nada, es necesaria para efectos*/
	}

	function seleccionResp() {
		cerrarPopup();
		hideSoftKeyboard();
	}

	function crearVistas() {

		bodyUC();
		bodyPartidas();
		bodyResponsable();

	}

	function addData() {

		myGoalsContainer.removeAllChildren();

		var menuView = Ti.UI.createView({
			top : '0dp',
			height : '66dp',
			width : Ti.UI.FILL
		});

		var separatorMenuUp = Ti.UI.createView({
			height : '1dp',
			width : Ti.UI.FILL,
			top : '0dp',
			backgroundColor : Config.colorBar
		});

		var menuViewContainer = Ti.UI.createView({
			top : '0dp',
			height : '56dp',
			width : Ti.UI.FILL
		});

		var separatorMenuDown = Ti.UI.createView({
			height : '1dp',
			width : Ti.UI.FILL,
			top : '64dp',
			backgroundColor : Config.colorBar
		});

		crearVistas();

		for ( i = 0; i < 3; i++) {

			var selectorMenu = Ti.UI.createView({
				height : '8dp',
				width : '50dp',
				backgroundColor : Config.colorPrimario2,
				visible : false,
				top : '52dp',
				id : i,
				touchEnabled : false
			});

			var textView = Ti.UI.createView({
				top : '0dp',
				height : '56dp',
				width : '105dp',
				id : i,
				rippleColor : Config.white,
				callback : functionDummy,
				finish : finish
			});

			var textLabel = Ti.UI.createLabel({
				font : {
					fontSize : '16dp',
					fontWeight : 'bold'
				},
				color : Config.color1,
				center : textView,
				touchEnabled : false
			});

			var separatorMenuL = Ti.UI.createView({
				height : '35dp',
				width : '1dp',
				left : '0dp',
				backgroundColor : Config.colorBar,
				touchEnabled : false

			});

			var separatorMenuR = Ti.UI.createView({
				height : '35dp',
				width : '1dp',
				right : '0dp',
				backgroundColor : Config.colorBar,
				touchEnabled : false
			});

			arrayWhiteButton.push(selectorMenu);

			if (i == 0) {
				textLabel.setText(L('Tracing_UnidadDeControl'));
				textView.add(textLabel);
				selectorMenu.setVisible(true);
				textView.add(selectorMenu);
				textView.setLeft('0dp');
				menuViewContainer.add(textView);

			} else if (i == 1) {
				textLabel.setText(L('Tracing_Partida'));
				textView.add(textLabel);
				textView.add(selectorMenu);
				//textView.add(separatorMenuL);
				separatorMenuL.setLeft('33%');
				menuViewContainer.add(separatorMenuL);
				//textView.add(separatorMenuR);
				separatorMenuR.setRight('33%');
				menuViewContainer.add(separatorMenuR);
				menuViewContainer.add(textView);

			} else {
				textLabel.setText(L('Tracing_Responsable'));
				textView.add(textLabel);
				textView.add(selectorMenu);
				textView.setRight('0dp');
				menuViewContainer.add(textView);
			}

			textView.addEventListener('click', function(e) {
				if (clicking == false) {
					clicking = true;
					ripple.effect(e);
					clicking = false;
				}

				for (var index in arrayWhiteButton) {
					arrayWhiteButton[index].visible = false;
					if (arrayWhiteButton[index].id == e.source.id) {
						arrayWhiteButton[index].visible = true;
						selectOutput = arrayWhiteButton[index].id;
						var currentPage = scrollableView.getCurrentPage();
						if (selectOutput == 0) {
							scrollableView.scrollToView(0);
						} else if (selectOutput == 1) {
							hideSoftKeyboard();
							scrollableView.scrollToView(1);
						} else if (selectOutput == 2) {
							hideSoftKeyboard();
							scrollableView.scrollToView(2);
						}
					}
				}

			});

		}

		menuView.add(separatorMenuUp);

		menuView.add(menuViewContainer);

		menuView.add(separatorMenuDown);

		myGoalsContainer.add(menuView);

		var scrollBoxBody_UC = Ti.UI.createScrollView({
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			top : '0dp'
		});

		var scrollBoxBody_partidas = Ti.UI.createScrollView({
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			top : '0dp'
		});

		var scrollBoxBody_responsable = Ti.UI.createScrollView({
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			top : '0dp'
		});

		scrollBoxBody_UC.add(boxBody_UC);
		scrollBoxBody_partidas.add(boxBody_partidas);
		scrollBoxBody_responsable.add(boxBody_responsable);

		scrollableView = Ti.UI.createScrollableView({
			top : '0dp',
			cacheSize : 21,
			height : Ti.UI.FILL,
			showPagingControl : false,
			scrollingEnabled : false,
			views : [scrollBoxBody_UC, scrollBoxBody_partidas, scrollBoxBody_responsable],
		});

		scrollableView.addEventListener('scoll', function(e) {

			if (e.source.views == 0) {
				flaginUC = true;
			}
		});

		myGoalsContainer.add(scrollableView);

		/*Set body inicial*/
		selectOutput = 0;

	}

	function close() {

		self.close();
		/*
		 self = null;
		 nav = null;
		 content = null;

		 work = [];

		 myGoalsContainer = null;

		 leftButton = null;
		 helpButton = null;

		 clicking = null;
		 indexID = null;
		 actionBar = null;

		 content = null;
		 heighContentIni = null;
		 widthContentIni = null;

		 viewBuscarResponsable = null;

		 departamentoInputUC = null;
		 */

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
		var flag = false;
		if (flagBuscarResponsable == true) {
			viewBuscarResponsable.hide();
			flagBuscarResponsable = false;
			flag = true;
		}
		if (flagKeyboardUP == true) {

			contentAutocompleteUC.setHeight('0dp');
			flagKeyboardUP = false;
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
			departamentoInputUC.blur();
			partidaInput.blur();
			partidaInputResp.blur();
			CUCInput.blur();
			CUCInputResp.blur();

			// myGoalsContainer.name.blur();
			// myGoalsContainer.telephone.blur();
		}
	}

	function showHelp() {
		help.animate_show();
	}


	Ti.App.addEventListener('keyboardframechanged', function(e) {

		if (flagsetHeightContentIni == true) {

			//heighContentIni = Config.isAndroid ? self.getRect().height : e.keyboardFrame.height;
			heighContentIni = self.getRect().height;
			widthContentIni = content.getRect().width;
			flagsetHeightContentIni = false;
			departamentoInputUC.softKeyboardOnFocus = Config.focusTracing;
		}
		contentAutocompleteUC.setBottom(e.keyboardFrame.height);

		var heightContentActual = content.getRect().height;

		if (heightContentActual == heighContentIni) {

			if (flagKeyboardUP == true) {

				contentAutocompleteUC.setHeight('0dp');
				flagKeyboardUP = false;
			}

		}

		if (flaginUC == true) {
			departamentoInputUC.focus();
			flaginUC = false;
		}

	});



	content.addEventListener('postlayout', function(e) {

		if (flagsetHeightContentIni == true) {
			heighContentIni = self.getRect().height;
			widthContentIni = content.getRect().width;
			flagsetHeightContentIni = false;
			departamentoInputUC.softKeyboardOnFocus = Config.focusTracing;
		}

		var heightContentActual = content.getRect().height;

		if (heightContentActual == heighContentIni) {

			if (flagKeyboardUP == true) {

				contentAutocompleteUC.setHeight('0dp');
				flagKeyboardUP = false;
			}

		}
		if (flaginUC == true) {
			departamentoInputUC.focus();
			flaginUC = false;
		}

	});

}

module.exports = Tracing;
