var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');
var db = require('/mods/db');
var moment = require('/libs/moment');
var help;

function planningFilters(nav, refresh, addData_in) {
	var summon = require('/mods/summon');
	var self;
	var nav;
	var content;

	var work = [];
	var buttonFiltrar;

	var myGoalsContainer;

	var leftButton;
	var helpButton;

	var clicking;

	var flagSeleccionarAvance = false;

	clicking = false;

	var titleHead = L('PlanningFilters_title');
	var flaginUC = false;

	var imagenAdjunta = false;
	var contentImagenesAdjuntas;
	var arrayImagenesAdjuntas = [];
	var boxAI;

	var flagOpenAbrirFoto = false;
	var viewAbrirFoto;
	var contentSPAbrirFoto;
	var flagKeyboardUP = false;

	var departamentoInputUC;

	var responsableInput;
	var diasSemanaInput;

	var flagBuscarResponsable = false;
	var viewBuscarResponsable;
	var flagBuscarDiasSemana = false;
	var viewBuscarDiasSemana;

	var searchArrayUC = [];
	var searchArrayPartida = [];
	var diasSemana = [];
	var searchArrayResponsable = [];

	var lista_UC_code = [];
	var lista_UC = [];

	content = Ti.UI.createView({
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		bubbleParent : false
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
				hideSoftKeyboard();
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
			exitOnClose : false,
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

		myGoalsContainer = Ti.UI.createScrollView({
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			top : '44dp',
			layout : 'vertical',
			scrollType : 'vertical',
			scrollingEnabled : true,
			bubbleParent : false
		});

		for (var index in work) {
			work[index].show();
		}
		addData();

		content.add(myGoalsContainer);
		content.add(contentAutocompleteUC);

		self.add(content);

		for (var index in work) {
			work[index].hide();
		}

		first = 0;

		setDataComun();
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

		var mainHelp = [fakeView()];

		var extraHelp = ['En esta pantalla se puede filtrar por una o todas las Unidades de control, Partidas, Resposables y días de la semana para la planificiación asignada.'];

		help = summon.contexthelp(leftHelp, rightHelp, mainHelp, extraHelp);
		self.add(help);

	}

	function fakeView() {

	}

	var contentFilters;

	function addData() {

		myGoalsContainer.removeAllChildren();

		contentFilters = Ti.UI.createView({
			top : '10dp',
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			layout : 'vertical',
			left : Config.marginViewPlanificacionFiltros,
			right : Config.marginViewPlanificacionFiltros,
			bubbleParent : false
		});

		var labelTitle = Ti.UI.createLabel({
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.white,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			touchEnabled : false,
			text : L('PlanningFilters_labelDepto'),
			left : '0dp'
		});

		var boxDepartamento = Ti.UI.createView({
			borderColor : Config.colorBar,
			borderRadius : Config.bigborderRadius,
			backgroundColor : Config.colorWallpaper1,
			top : '10dp',
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			left : '0dp',
			right : '0dp',
			layout : 'vertical'

		});

		departamentoInputUC = Ti.UI.createTextField({
			height : '42dp',
			left : '10dp',
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
			hintText : L('PlanningFilters_hintTextAll1'),
			backgroundColor : 'transparent',
			width : Ti.UI.FILL
		});

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

		var labelPartida = Ti.UI.createLabel({
			text : L('PlanningFilters_labelPartida'),
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.color1,
			top : '15dp',
			left : '0dp',
			touchEnabled : false
		});

		var boxPartida = Ti.UI.createView({
			borderColor : Config.colorBar,
			borderRadius : Config.bigborderRadius,
			backgroundColor : Config.colorWallpaper1,
			top : '10dp',
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			left : '0dp',
			right : '0dp',
			layout : 'vertical'
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
			hintText : L('PlanningFilters_hintTextAll2'),
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

		var labelResponsable = Ti.UI.createLabel({
			text : L('PlanningFilters_labelResponsable'),
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.color1,
			top : '15dp',
			left : '0dp',
			touchEnabled : false
		});

		var boxResponsable = Ti.UI.createView({
			borderColor : Config.colorPrimario2,
			borderRadius : Config.bigborderRadius,
			backgroundColor : Config.colorWallpaper1,
			top : '10dp',
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			left : '0dp',
			right : '0dp',
			rippleColor : Config.white,
			callback : popupResponsable,
			finish : finish
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
			text : L('PlanningFilters_hintTextAll1')
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

		var labelDiasSemana = Ti.UI.createLabel({
			text : L('PlanningFilters_DayOfWeek'),
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.color1,
			top : '15dp',
			left : '0dp',
			touchEnabled : false
		});

		var boxDiasSemana = Ti.UI.createView({
			borderColor : Config.colorPrimario2,
			borderRadius : Config.bigborderRadius,
			backgroundColor : Config.colorWallpaper1,
			top : '10dp',
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			left : '0dp',
			right : '0dp',
			rippleColor : Config.white,
			callback : popupDiasSemana,
			finish : finish
		});

		diasSemanaInput = Ti.UI.createLabel({
			width : Ti.UI.SIZE,
			height : '42dp',
			font : {
				fontSize : '16dp'
			},
			color : Config.color1,
			backgroundColor : 'transparent',
			left : '15dp',
			touchEnabled : false,
			text : L('PlanningFilters_hintTextAll1')
		});

		var rowSelectorDiasSemana = Ti.UI.createImageView({
			image : '/images/192_down.png',
			height : '30dp',
			width : '30dp',
			right : '15dp',
			touchEnabled : false
		});

		boxDiasSemana.addEventListener('click', function(e) {
			if (clicking == false) {
				clicking = true;
				ripple.effect(e);
				clicking = false;
			}
		});

		var scrolltblvAutoCompleteDS = Ti.UI.createScrollView({
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			visible : false,
			bubbleParent : false
		});

		buttonFiltrar = Ti.UI.createView({
			backgroundColor : Config.colorPrimario2,
			borderColor : Config.colorPrimario2,
			borderRadius : Config.bigborderRadius,
			top : '55dp',
			height : '42dp',
			width : Ti.UI.FILL,
			left : '0dp',
			right : '0dp',
			rippleColor : Config.white,
			callback : filtrar,
			finish : finish
		});

		var buttonLabel = Ti.UI.createLabel({
			text : L('PlanningFilters_ButtonFiltrar'),
			font : {
				fontSize : '16dp'
			},
			color : Config.color1,
			touchEnabled : false
		});

		buttonFiltrar.add(buttonLabel);

		buttonFiltrar.addEventListener('click', function(e) {
			if (clicking == false) {
				clicking = true;
				ripple.effect(e);
				clicking = false;
			}
		});

		boxDepartamento.add(departamentoInputUC);
		contentFilters.add(labelTitle);
		contentFilters.add(boxDepartamento);

		boxPartida.add(partidaInputResp);
		contentFilters.add(labelPartida);
		contentFilters.add(boxPartida);

		contentFilters.add(labelResponsable);
		boxResponsable.add(responsableInput);
		boxResponsable.add(rowSelectorResp);
		scrolltblvAutoComplete.add(tblvAutoComplete);
		boxResponsable.add(scrolltblvAutoComplete);
		contentFilters.add(boxResponsable);

		contentFilters.add(labelDiasSemana);
		boxDiasSemana.add(diasSemanaInput);
		boxDiasSemana.add(rowSelectorDiasSemana);
		scrolltblvAutoCompleteDS.add(tblvAutoCompleteDS);
		boxDiasSemana.add(scrolltblvAutoCompleteDS);
		contentFilters.add(boxDiasSemana);

		contentFilters.add(buttonFiltrar);

		myGoalsContainer.add(contentFilters);

	}

	function filtrar() {

		if (departamentoInputUC.value != "") {

			var depto = departamentoInputUC.value;
			var existeDepto = false;
			for (var index in searchArrayUC) {
				if (searchArrayUC[index] == depto) {
					existeDepto = true;
				}
			}
			if (existeDepto == true) {
				var partida;
				var existePartida = false;

				if (partidaInputResp.value != "") {
					partida = partidaInputResp.value;
				} else {
					partida = L('PlanningFilters_hintTextAll2');
					existePartida = true;
				}

				for (var index in searchArrayPartida) {
					if (searchArrayPartida[index] == partida) {
						existePartida = true;
					}
				}
				if (existePartida == true) {
					var responsable = responsableInput.text;
					var diaSemana = diasSemanaInput.text;

					var Window = require('/ui/p_propietario/PlanningFilterDepto');
					for (var w in work) {
						work[w].show();
					}
					buttonFiltrar.touchEnabled = false;
					new Window(nav, depto, partida, responsable, diaSemana);
					buttonFiltrar.touchEnabled = true;
					for (var w in work) {
						work[w].hide();
					}
				} else {
					var dialog = Ti.UI.createAlertDialog({
						title : L('PlanningFilters_dialog4Title'),
						message : L('PlanningFilters_dialog4Message'),
						ok : L('PlanningFilters_dialog4Ok')
					});
					dialog.show();
				}

			} else {
				var dialog = Ti.UI.createAlertDialog({
					title : L('Planning_dialog3Title'),
					message : L('Planning_dialog3Message'),
					ok : L('Planning_dialog3Ok')
				});
				dialog.show();

			}

		} else {

			var depto = L('PlanningFilters_hintTextAll1');

			var partida;
			var existePartida = false;
			if (partidaInputResp.value != "") {
				partida = partidaInputResp.value;
			} else {
				partida = L('PlanningFilters_hintTextAll2');
				existePartida = true;
			}

			for (var index in searchArrayPartida) {
				if (searchArrayPartida[index] == partida) {
					existePartida = true;
				}
			}
			if (existePartida == true) {

				var responsable = responsableInput.text;
				var diaSemana = diasSemanaInput.text;

				var Window = require('/ui/p_propietario/PlanningFilterDepto');
				for (var w in work) {
					work[w].show();
				}
				buttonFiltrar.touchEnabled = false;
				var resultado = refresh(depto, partida, responsable, diaSemana);
				var res2 = addData_in(resultado, 0);
				/*
				 if (resultado == false) {
				 var dialog = Ti.UI.createAlertDialog({
				 title : L('Planning_dialog4Title'),
				 message : L('Planning_dialog4Message'),
				 ok : L('Planning_dialog4Ok')
				 });
				 dialog.show();
				 buttonFiltrar.touchEnabled = true;
				 for (var w in work) {
				 work[w].hide();
				 }
				 } else {*/
				if (res2 == true) {
					buttonFiltrar.touchEnabled = true;
					for (var w in work) {
						work[w].hide();
					}
					if (clicking == false) {
						clicking = true;
						if (Config.isAndroid) {
							ripple.round({
								source : leftButton
							});
						} else {
							close();
						}

					}
				}

				//}

			} else {

				var dialog = Ti.UI.createAlertDialog({
					title : L('PlanningFilters_dialog4Title'),
					message : L('PlanningFilters_dialog4Message'),
					ok : L('PlanningFilters_dialog4Ok')
				});
				dialog.show();
			}
		}

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

	var tblvAutoCompleteDS = Ti.UI.createTableView({
		width : '100%',
		backgroundColor : '#EFEFEF',
		height : 0,
		maxRowHeight : 35,
		minRowHeight : 35,
		allowSelection : true,
		bubbleParent : false
	});

	var scrollContentResp;
	var responsableTextField;
	var scrollContentDiasSemana;
	var diasSemanaTextField;

	function popupDiasSemana() {

		flagAutocomplete = 0;
		clicking = false;
		scrollContentDiasSemana.removeAllChildren();
		for (var i = 0; i < searchArrayDiasSemana.length; i++) {

			var contentDiasSemana = Ti.UI.createView({
				width : Ti.UI.FILL,
				height : '50dp',
				touchEnabled : true,
				id : searchArrayDiasSemana[i],
				rippleColor : Config.colorWallpaper1,
				callback : seleccionDiasSemana,
				finish : finish
			});

			var labelDiasSemana = Ti.UI.createLabel({
				font : {
					fontSize : '16dp',
					fontWeight : 'bold'
				},
				color : Config.black,
				height : '20dp',
				touchEnabled : false,
				text : searchArrayDiasSemana[i]
			});

			var separatorDiasSemana = Ti.UI.createView({
				height : '1dp',
				width : Ti.UI.FILL,
				backgroundColor : Config.colorBar,
				bottom : '0dp',
				touchEnabled : false
			});

			contentDiasSemana.addEventListener('click', function(e) {
				if (clicking == false) {
					clicking = true;
					ripple.effect(e);
					flagAutocomplete = 1;
					diasSemanaInput.text = e.source.id;
				}
			});

			contentDiasSemana.add(labelDiasSemana);
			if (i != (searchArrayDiasSemana.length - 1)) {
				contentDiasSemana.add(separatorDiasSemana);
			}
			scrollContentDiasSemana.add(contentDiasSemana);

		}

		flagBuscarDiasSemana = true;
		viewBuscarDiasSemana.show();
	}

	function popupResponsable() {
		flagAutocomplete = 0;
		clicking = false;
		scrollContentResp.removeAllChildren();
		for (var i = 0; i < searchArrayResponsable.length; i++) {

			var contentResp = Ti.UI.createView({
				width : Ti.UI.FILL,
				height : '50dp',
				touchEnabled : true,
				id : searchArrayResponsable[i],
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
					responsableInput.text = e.source.id;
				}
			});

			contentResp.add(labelResp);
			contentResp.add(separatorResp);
			scrollContentResp.add(contentResp);

		}

		flagBuscarResponsable = true;
		viewBuscarResponsable.show();
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
			right : margin,
			rippleColor : Config.white,
			callback : popupResponsable,
			finish : finish
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
				id : responsables[i],
				rippleColor : Config.colorWallpaper1,
				callback : seleccionResp,
				finish : finish
			});

			searchArrayResponsable.push(responsables[i]);

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
					responsableInput.text = e.source.id;
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

	var viewDiasSemana;
	var searchArrayDiasSemana = [];
	function setDiasSemana() {

		viewBuscarDiasSemana = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			top : '0dp',
			backgroundColor : Config.transparenceBlack2,
			visible : false
		});

		viewBuscarDiasSemana.addEventListener('click', function(e) {
			cerrarPopup();
		});

		var contentSP = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			left : Config.widhtPopup,
			right : Config.widhtPopup,
			top : '50dp',
			bottom : '50dp',
			backgroundColor : Config.white,
			borderRadius : Config.bigborderRadius,
			bubbleParent : false,
			layout : 'vertical'
		});

		var boxDiasSemana = Ti.UI.createView({
			top : '10dp',
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			left : '0dp',
			right : '0dp'
		});

		var labelDiasdelaSemana = Ti.UI.createLabel({
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.black,
			height : '20dp',
			touchEnabled : false,
			text : 'Días'
		});

		boxDiasSemana.add(labelDiasdelaSemana);

		scrollContentDiasSemana = Ti.UI.createScrollView({
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

		for (var i = 0; i < diasSemana.length; i++) {

			var contentDiasSemana = Ti.UI.createView({
				width : Ti.UI.FILL,
				height : '50dp',
				touchEnabled : true,
				id : diasSemana[i],
				rippleColor : Config.colorWallpaper1,
				callback : seleccionDiasSemana,
				finish : finish
			});

			searchArrayDiasSemana.push(diasSemana[i]);

			var labelDiasSemana = Ti.UI.createLabel({
				font : {
					fontSize : '16dp',
					fontWeight : 'bold'
				},
				color : Config.black,
				height : '20dp',
				touchEnabled : false,
				text : diasSemana[i]
			});

			var separatorDiasSemana = Ti.UI.createView({
				height : '1dp',
				width : Ti.UI.FILL,
				backgroundColor : Config.colorBar,
				bottom : '0dp',
				touchEnabled : false
			});

			contentDiasSemana.addEventListener('click', function(e) {
				if (clicking == false) {
					clicking = true;
					ripple.effect(e);
					flagAutocomplete = 1;
					diasSemanaInput.text = e.source.id;
				}
			});

			contentDiasSemana.add(labelDiasSemana);
			if (i != (diasSemana.length - 1)) {
				contentDiasSemana.add(separatorDiasSemana);
			}
			scrollContentDiasSemana.add(contentDiasSemana);

		}

		boxDiasSemana.add(labelDiasdelaSemana);
		contentSP.add(boxDiasSemana);
		contentSP.add(scrollContentDiasSemana);
		viewBuscarDiasSemana.add(contentSP);

		self.add(viewBuscarDiasSemana);

	}

	function cerrarPopup() {
		if (flagBuscarResponsable == true) {
			viewBuscarResponsable.hide();
			flagBuscarResponsable = false;
			responsableTextField.value = "";
			responsableTextField.hintText = "Buscar";
		}
		if (flagBuscarDiasSemana == true) {
			viewBuscarDiasSemana.hide();
			flagBuscarDiasSemana = false;
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

		} else if (idSelector == 21) {
			var searchLen = pattern.length;
			searchArrayResponsable.sort();
			for (var index in searchArrayResponsable) {
				if (searchArrayResponsable[index].toString().toUpperCase().indexOf(pattern.toString().toUpperCase()) !== -1) {
					tempArray.push(searchArrayResponsable[index]);
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

	function seleccionResp() {
		cerrarPopup();
		hideSoftKeyboard();
	}

	function seleccionDiasSemana() {
		cerrarPopup();
		hideSoftKeyboard();
	}

	/*Variables autocompletar*/
	var contentAutocompleteUC = Ti.UI.createView({
		width : Ti.UI.FILL,
		backgroundColor : Config.white,
		height : '0dp',
		bottom : '0dp'
	});
	var flagAutocomplete = 0;

	var flagDepartamentoInputUC = 0;
	var partidaInput;
	var flagPartidaInput = 0;

	function CreateAutoCompleteBar(idSelector, searchResults) {
		contentAutocompleteUC.removeAllChildren();

		var contentAutoComplete = Ti.UI.createView({
			height : Config.heightAutoComplete,
			width : Ti.UI.FILL,
			layout : 'horizontal'
		});
		var count = 0;
		Ti.API.info('searchResults.length:' + searchResults.length);
		if (searchResults.length == 0) {
			contentAutocompleteUC.setHeight('0dp');
		}
		if (idSelector == 0 && searchResults.length > 0) {
			contentAutocompleteUC.setHeight(Config.heightAutoComplete);
			contentFilters.setBottom(Config.heightAutoComplete);
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
					text : searchResults[index]
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
		} else if (idSelector == 21) {
			scrollContentResp.removeAllChildren();
			for (var index = 0,
			    len = searchResults.length; index < len; index++) {

				var contentResp = Ti.UI.createView({
					width : Ti.UI.FILL,
					height : '50dp',
					touchEnabled : true,
					id : searchResults[index],
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
						responsableInput.text = e.source.id;
					}
				});

				contentResp.add(labelResp);
				contentResp.add(separatorResp);
				scrollContentResp.add(contentResp);

			}
		} else if (idSelector == 23 && searchResults.length > 0) {
			contentAutocompleteUC.setHeight(Config.heightAutoComplete);
			contentFilters.setBottom(Config.heightAutoComplete);
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

	function exit(rowSwitch) {
		var close = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : [L('PlanningFilters_dialog3Ok'), L('PlanningFilters_dialog3Cancelar')],
			message : L('PlanningFilters_dialog3Message'),
			title : L('PlanningFilters_dialog3Title')
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
		var aux = false;
		if (flagBuscarDiasSemana == true || flagBuscarResponsable == true) {
			cerrarPopup();
			aux = true;
		}
		if (aux == false) {
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
			partidaInputResp.blur();
		}
	}

	var flagsetHeightContentIni = true;
	var heighContentIni;
	var widthContentIni;
	Ti.App.addEventListener('keyboardframechanged', function(e) {

		if (flagsetHeightContentIni == true) {
			heighContentIni = self.getRect().height;
			widthContentIni = content.getRect().width;
			flagsetHeightContentIni = false;
			departamentoInputUC.softKeyboardOnFocus = Config.focusTracing;
		}

		contentAutocompleteUC.setBottom(e.keyboardFrame.height);
		var heightContentActual = content.getRect().height;
		if (heightContentActual == heighContentIni) {
			Ti.API.info("ECHO 1");
			if (flagKeyboardUP == true) {
				Ti.API.info("ECHO 2");
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

	function gotData(result) {
		if (result == false) {
		} else {

			if (result == false) {

				for (var w in work) {
					work[w].hide();
				}

				var dialog = Ti.UI.createAlertDialog({
					title : L('PlanningFilters_dialog2Title'),
					message : L('PlanningFilters_dialog2Message'),
					ok : L('PlanningFilters_dialog2Ok')
				});
				dialog.show();

			} else {

				switch(result.status.code) {

				case 200:

					addData();
					setDataComun();
					diasSemana();
					break;
				default:
					for (var w in work) {
						work[w].hide();
					}

					var dialog = Ti.UI.createAlertDialog({
						title : L('PlanningFilters_dialog1Title'),
						message : L('PlanningFilters_dialog1Message'),
						ok : L('PlanningFilters_dialog1Ok')
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

	function showHelp() {
		help.animate_show();
	}

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

		code = 'lista_responsable';
		var listaResponsableC = db.selectGENERAL(code);
		var listaResponsable = listaResponsableC.values;

		var responsables = [];

		for (var index in listaResponsable) {
			Ti.API.info("Responsables: " + listaResponsable[index].NAME + ' ' + listaResponsable[index].LAST_NAME);
			responsables[listaResponsable[index].ID_RESP] = listaResponsable[index].NAME + ' ' + listaResponsable[index].LAST_NAME;

		}
		responsables[responsables.length] = L('PlanningFilters_hintTextAll1');

		code = 'day_of_week';
		var listaDayOfWeekC = db.selectGENERAL(code);
		var listaDayOfWeek = listaDayOfWeekC.values;

		var local = Config.locale;

		for (var index in listaDayOfWeek) {
			diasSemana[index] = listaDayOfWeek[index][local].name;
		}
		diasSemana.push(L('PlanningFilters_hintTextAll1'));
		buscarResponsable(responsables);
		setDiasSemana();

	}

}

module.exports = planningFilters;
