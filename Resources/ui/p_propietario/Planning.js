var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');
var db = require('/mods/db');
var summon = require('/mods/summon');
var helpButton;
var help;

function planning(nav) {

	var trackerName = 'Profesional de terreno: Open planning';
	Config.tracker.addScreenView(trackerName);

	var self;
	var nav;
	var content;

	var work = [];
	var arrayTrackingFilters = [];
	var myGoalsContainer;

	var leftButton;
	var rightButton;

	var clicking;

	var flagSeleccionarAvance = false;
	var arrayPartidas = [];

	clicking = false;
	var flagOpencambiarporcentaje = false;
	var viewCambiarporcentaje;

	var flagOpenOpcionAdjuntar = false;
	var viewOpcionAdjuntar;

	var titleHead = L('Planning_titleHead');

	var imagenAdjunta = false;
	var contentImagenesAdjuntas;
	var arrayImagenesAdjuntas = [];
	var boxAI;

	var flagIngreso = false;

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

		rightButton = Ti.UI.createView({
			right : '12dp',
			height : '25dp',
			width : '25dp',
			backgroundImage : '/images/Filter Filled-100.png',
			rippleColor : Config.white,
			callback : openFiltros,
			finish : finish,
			visible : false
		});

		rightButton.addEventListener('click', function(e) {
			if (clicking == false) {
				clicking = true;
				ripple.effect(e);
			}
		});

		helpButton = Ti.UI.createView({
			right : '42dp',
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
		actionBar.add(rightButton);
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

		rightButton = Ti.UI.createButton({
			backgroundImage : '/images/Filter Filled-100.png',
			height : '25dp',
			width : '25dp'
		});

		rightButton.addEventListener('click', function() {
			if (clicking == false) {
				openFiltros();
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
			rightNavButtons : [rightButton, helpButton],
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

	function openFiltros() {
		Config.tracker.addEvent({
			category : trackerName,
			action : 'Abre filtros',
			label : 'new window',
			value : 1
		});

		var Window = require('/ui/p_propietario/PlanningFilters');
		new Window(nav, refresh, addData);

	}

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
			width : Ti.UI.SIZE,
			top : '8dp',
			layout : 'vertical'
		});

		myGoalsContainer.removeAllChildren();

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
		viewBlack.add(myGoalsIndicator);
		work.push(viewBlack);
		work.push(myGoalsIndicator);
		viewBlack.add(myGoalsIndicator);

		self.add(viewBlack);

		getData();

		scroll.add(myGoalsContainer);

		content.add(scroll);

		self.add(content);

		var leftHelp = [{
			img : '/images/ic_navigate_before_w.png',
			text : 'Volver atrás'
		}];

		var rightHelp = [{
			img : '/images/Filter Filled-100.png',
			text : 'Filtros de búsqueda'
		}];

		var mainHelp = [fakeView()];

		var extraHelp = ['En esta pantalla se muestra la planificación semanal por unidades de control en una determinada Partida y Responsable.'];

		help = summon.contexthelp(leftHelp, rightHelp, mainHelp, extraHelp);
		self.add(help);

	}

	function fakeView() {

	}

	function fechaHoy() {
		var selectedDate = new Date();
		var dia = '';
		var mes = '';
		var ano = '';

		var mesSM = selectedDate.getMonth() + 1;

		if (selectedDate.getDay() < 10) {
			dia = '0' + selectedDate.getDay();
		} else {
			dia = selectedDate.getDay();
		}
		if (mesSM < 10) {
			mes = '0' + mesSM;
		} else {
			mes = mesSM;
		}

		ano = selectedDate.getFullYear();

		var fechaHoy = dia + "/" + mes + "/" + ano;
		return fechaHoy;

	}

	function formatDate(dateIn) {

		var dia = dateIn.substring(8, 10);
		var mes = dateIn.substring(5, 7);
		var ano = dateIn.substring(2, 4);

		var fechaHoy = dia + "/" + mes + "/" + ano;
		return fechaHoy;
	}

	function addData(partidas, typeCall) {

		for (var index in work) {
			work[index].show();
		}
		//Ti.API.error('partidas:::', JSON.stringify(partidas));
		myGoalsContainer.removeAllChildren();
		var title = Ti.UI.createView({
			top : '0dp',
			left : '0dp',
			right : '0dp',
			width : Ti.UI.FILL,
			height : '40dp'

		});

		var contentTitle = Ti.UI.createView({
			width : Ti.UI.SIZE,
			height : '40dp',
			layout : 'horizontal'

		});

		var separatorTitle = Ti.UI.createView({
			height : Config.heightSeparatorPlanning,
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			bottom : '0dp',
			touchEnabled : false
		});

		title.add(contentTitle);
		//title.add(labelTitleFin);
		title.add(separatorTitle);
		myGoalsContainer.add(title);
		var local = Config.locale;
		var code_partida;
		var resp_name_lastName;
		var firstflag = 0;
		var dayWeek;

		for (var index in partidas) {
			if (index == 0) {
				for (var k = 0; k < 4; k++) {
					var labelTitleIni = Ti.UI.createLabel({
						font : {
							fontSize : '16dp',
							fontWeight : 'bold'
						},
						color : Config.white,
						height : Ti.UI.SIZE,
						width : Ti.UI.SIZE,
						touchEnabled : false,
						text : '',
						center : title
					});

					if (k == 0) {
						labelTitleIni.color = Config.colorPrimario2;
						labelTitleIni.text = L('Planning_labelTitleIni') + ': ';
						contentTitle.add(labelTitleIni);
					} else if (k == 1) {
						labelTitleIni.color = Config.white;
						labelTitleIni.text = formatDate(partidas[index].fechaini);
						contentTitle.add(labelTitleIni);
					} else if (k == 2) {
						labelTitleIni.color = Config.colorPrimario2;
						labelTitleIni.text = ' a ';
						contentTitle.add(labelTitleIni);
					} else if (k == 3) {
						labelTitleIni.color = Config.white;
						labelTitleIni.text = formatDate(partidas[index].fechafin);
						contentTitle.add(labelTitleIni);
					}
				}

			}

			arrayPartidas.push(partidas[index]);
			var titlePartida = Ti.UI.createView({
				top : '0dp',
				left : '0dp',
				right : '0dp',
				width : Ti.UI.FILL,
				height : Ti.UI.SIZE,
				layout : 'vertical'

			});

			if (index != 0) {
				titlePartida.setTop('20dp');
			}

			var nombrePartida = partidas[index].multilang_partida[local].name;
			var arrayNomPartidas = nombrePartida.split(' ');

			if (arrayNomPartidas.length > 4) {
				nombrePartida = '';
				for (var kj in arrayNomPartidas) {
					nombrePartida = nombrePartida + arrayNomPartidas[kj] + ' ';
					if (kj == 4)
						nombrePartida = nombrePartida + '\n';

				}
			}

			var labelPartida = Ti.UI.createLabel({
				font : {
					fontSize : '16dp',
					fontWeight : 'bold'
				},
				color : Config.white,
				height : Ti.UI.SIZE,
				width : Ti.UI.SIZE,
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				touchEnabled : false,
				text : nombrePartida,
				top : '5dp'
			});

			var partidaActual = nombrePartida;
			/*
			 var labelSemanal = Ti.UI.createLabel({
			 font : {
			 fontSize : '16dp',
			 fontWeight : 'bold'
			 },
			 color : Config.colorPrimario2,
			 height : Ti.UI.SIZE,
			 width : Ti.UI.SIZE,
			 touchEnabled : false,
			 text : L('Planning_labelSemanal')
			 });*/

			var separatorTitleP = Ti.UI.createView({
				height : Config.heightSeparatorPlanning,
				width : Ti.UI.FILL,
				backgroundColor : Config.colorBar,
				top : '5dp',
				touchEnabled : false
			});

			/*** Reponsable y empresa ***/
			var titleRespEmp = Ti.UI.createView({
				top : '0dp',
				left : '0dp',
				right : '0dp',
				width : Ti.UI.FILL,
				height : '55dp',
				layout : 'vertical'

			});

			var titleResp = Ti.UI.createView({
				top : '5dp',
				left : '19dp',
				width : Ti.UI.SIZE,
				height : Ti.UI.SIZE,
				layout : 'horizontal'

			});

			var labelResp1 = Ti.UI.createLabel({
				font : {
					fontSize : '16dp',
					fontWeight : 'bold'
				},
				color : Config.colorPrimario2,
				height : Ti.UI.SIZE,
				width : Config.widthRespEmp,
				touchEnabled : false,
				text : L('Planning_labelResp1') + ':'
			});

			var labelResp2 = Ti.UI.createLabel({
				font : {
					fontSize : '16dp',
					fontWeight : 'bold'
				},
				color : Config.white,
				height : Ti.UI.SIZE,
				width : Ti.UI.SIZE,
				touchEnabled : false,
				text : partidas[index].name_responsable + ' ' + partidas[index].last_name_responsable
			});

			titleResp.add(labelResp1);
			titleResp.add(labelResp2);
			/*
			 var titleEmp = Ti.UI.createView({
			 left : '19dp',
			 width : Ti.UI.SIZE,
			 height : Ti.UI.SIZE,
			 layout : 'horizontal'

			 });

			 var labelEmp1 = Ti.UI.createLabel({
			 font : {
			 fontSize : '16dp',
			 fontWeight : 'bold'
			 },
			 color : Config.colorPrimario2,
			 height : Ti.UI.SIZE,
			 width : Config.widthRespEmp,
			 touchEnabled : false,
			 text : L('Planning_labelEmp1') + ':'
			 });
			 var labelEmp2 = Ti.UI.createLabel({
			 font : {
			 fontSize : '16dp',
			 fontWeight : 'bold'
			 },
			 color : Config.white,
			 height : Ti.UI.SIZE,
			 width : Ti.UI.SIZE,
			 touchEnabled : false,
			 text : partidas[index].company_name
			 });

			 titleEmp.add(labelEmp1);
			 titleEmp.add(labelEmp2);
			 */

			var separatorRespEmp = Ti.UI.createView({
				height : Config.heightSeparatorPlanning,
				width : Ti.UI.FILL,
				backgroundColor : Config.colorBar,
				top : '5dp',
				touchEnabled : false
			});

			/*** Titulos Día y departamento ***/
			var titleDiaDepto = Ti.UI.createView({
				top : '0dp',
				left : '0dp',
				right : '0dp',
				width : Ti.UI.FILL,
				height : '55dp'
			});

			var labelDia = Ti.UI.createLabel({
				font : {
					fontSize : '16dp',
					fontWeight : 'bold'
				},
				color : Config.white,
				height : Ti.UI.SIZE,
				width : Ti.UI.SIZE,
				touchEnabled : false,
				text : L('Planning_labelDia'),
				left : '19dp'
			});

			var contentLabelDepto = Ti.UI.createView({
				right : '30dp',
				width : '150dp',
				height : Ti.UI.SIZE
			});

			var labelDepto = Ti.UI.createLabel({
				font : {
					fontSize : '16dp',
					fontWeight : 'bold'
				},
				color : Config.white,
				height : Ti.UI.SIZE,
				width : Ti.UI.SIZE,
				touchEnabled : false,
				text : Ti.App.Properties.getString('UC', null)
			});

			var separatorDiaDepto = Ti.UI.createView({
				height : Config.heightSeparatorPlanning,
				width : Ti.UI.FILL,
				backgroundColor : Config.colorBar,
				bottom : '0dp',
				touchEnabled : false
			});

			if (firstflag == 0) {
				titlePartida.add(labelPartida);
				//titlePartida.add(labelSemanal);
				titlePartida.add(separatorTitleP);
				myGoalsContainer.add(titlePartida);

				titleRespEmp.add(titleResp);
				//titleRespEmp.add(titleEmp);
				titleRespEmp.add(separatorRespEmp);
				myGoalsContainer.add(titleRespEmp);

				titleDiaDepto.add(labelDia);
				contentLabelDepto.add(labelDepto);
				titleDiaDepto.add(contentLabelDepto);
				titleDiaDepto.add(separatorDiaDepto);
				myGoalsContainer.add(titleDiaDepto);
				firstflag = 1;
				code_partida = partidas[index].code_partida;
				resp_name_lastName = labelResp2.text;

			}

			if (code_partida != partidas[index].code_partida || resp_name_lastName != labelResp2.text) {
				titlePartida.add(labelPartida);
				//titlePartida.add(labelSemanal);
				titlePartida.add(separatorTitleP);
				myGoalsContainer.add(titlePartida);

				titleRespEmp.add(titleResp);
				//titleRespEmp.add(titleEmp);
				titleRespEmp.add(separatorRespEmp);
				myGoalsContainer.add(titleRespEmp);

				titleDiaDepto.add(labelDia);
				contentLabelDepto.add(labelDepto);
				titleDiaDepto.add(contentLabelDepto);
				titleDiaDepto.add(separatorDiaDepto);
				myGoalsContainer.add(titleDiaDepto);
				code_partida = partidas[index].code_partida;
				resp_name_lastName = labelResp2.text;

			}

			var cant_uc = partidas[index].cant_uc;
			var detalle = partidas[index].uc;
			var flagPos = 0;

			var countRow = 0;
			var topContentLabel = 0;
			var dibujaSeparator = false;
			var dayflag = 0;

			var contentDetalle = Ti.UI.createView({
				top : '0dp',
				right : '0dp',
				left : '0dp',
				width : Ti.UI.FILL,
				height : Ti.UI.SIZE
			});
			for (var jindex in detalle) {

				var labelDetalle = Ti.UI.createLabel({
					font : {
						fontSize : '16dp',
						fontWeight : 'bold'
					},
					color : Config.white,
					height : Ti.UI.SIZE,
					width : Ti.UI.SIZE,
					touchEnabled : false,
					left : '15dp'
				});

				var rowBoxOrange = Ti.UI.createView({
					backgroundColor : Config.colorPrimario2,
					height : Config.heightRowBoxOrange,
					width : '4dp'
				});

				if (dayflag == 0) {

					var detalle2 = Ti.UI.createView({
						top : '5dp',
						right : '30dp',
						width : '150dp',
						height : Ti.UI.SIZE
					});

					var detalle1 = Ti.UI.createView({
						top : '5dp',
						left : '0dp',
						width : Ti.UI.SIZE,
						height : Ti.UI.SIZE,
						layout : 'horizontal'
					});

					var detalle3 = Ti.UI.createView({
						top : '0dp',
						left : '0dp',
						right : '0dp',
						width : Ti.UI.FILL,
						height : Ti.UI.SIZE
					});

					dayWeek = detalle[jindex].day_of_week[local].name;
					detalle1.add(rowBoxOrange);
					labelDetalle.setText(dayWeek);
					dibujaSeparator = true;
					countRow = 0;
					topContentLabel = 0;
					detalle1.add(labelDetalle);

					dayflag = 1;

				} else if (dayWeek == "") {

					continue;
					contentDetalle.removeAllChildren();

				}

				var contentLabel1 = Ti.UI.createView({
					left : '0dp',
					top : '0dp',
					bottom : '0dp',
					width : Ti.UI.SIZE,
					height : '24dp',
					rippleColor : Config.white,
					callback : openDepto,
					finish : finish
				});

				var contentLabel2 = Ti.UI.createView({
					top : '0dp',
					bottom : '0dp',
					right : '0dp',
					width : Ti.UI.SIZE,
					height : '24dp',
					rippleColor : Config.white,
					callback : openDepto,
					finish : finish
				});

				var pixelPerChar = Config.fontSizePlanningDeptos / 2;

				var lineLabel1 = Ti.UI.createView({
					bottom : '0dp',
					height : '2dp',
					backgroundColor : Config.white,
					touchEnabled : false
				});

				var lineLabel2 = Ti.UI.createView({
					bottom : '0dp',
					height : '2dp',
					backgroundColor : Config.white,
					touchEnabled : false
				});

				var labelDetalle1 = Ti.UI.createLabel({
					font : {
						fontSize : Config.fontSizePlanningDeptos + 'dp',
						fontWeight : 'bold'
					},
					color : Config.white,
					height : Ti.UI.SIZE,
					width : Ti.UI.SIZE,
					touchEnabled : false,
					bottom : '2dp'
				});

				var labelDetalle2 = Ti.UI.createLabel({
					font : {
						fontSize : Config.fontSizePlanningDeptos + 'dp',
						fontWeight : 'bold'
					},
					color : Config.white,
					height : Ti.UI.SIZE,
					width : Ti.UI.SIZE,
					touchEnabled : false,
					bottom : '2dp'
				});

				var flagData = true;

				if (flagPos == 0) {

					labelDetalle1.text = detalle[jindex].name;

					contentLabel1.add(labelDetalle1);
					contentLabel1.idDepto = detalle[jindex].name;
					contentLabel1.porcentajeAvance = detalle[jindex].info.progress;
					contentLabel1.idTracking = detalle[jindex].id;
					contentLabel1.idPartida = partidaActual;
					lineLabel1.setWidth((labelDetalle1.text.length * pixelPerChar) + 'dp');
					contentLabel1.add(lineLabel1);
					contentLabel1.addEventListener('click', function(e) {
						if (clicking == false) {
							contentLabel1.touchEnabled = false;
							clicking = true;
							deptoSeleccionado = e.source.idDepto;
							partidaSeleccionada = e.source.idPartida;
							porcentajeSeleccionado = e.source.porcentajeAvance;
							idTrackingSeleccionado = e.source.idTracking;

							ripple.round(e);
							clicking = false;
							contentLabel1.touchEnabled = true;
						}

					});
				} else {
					labelDetalle2.text = detalle[jindex].name;
					contentLabel2.add(labelDetalle2);
					contentLabel2.idDepto = detalle[jindex].name;
					contentLabel2.porcentajeAvance = detalle[jindex].info.progress;
					contentLabel2.idTracking = detalle[jindex].id;
					contentLabel2.idPartida = partidaActual;
					lineLabel2.setWidth((labelDetalle2.text.length * pixelPerChar) + 'dp');
					contentLabel2.add(lineLabel2);
					contentLabel2.addEventListener('click', function(e) {
						if (clicking == false) {
							contentLabel2.touchEnabled = false;
							clicking = true;
							deptoSeleccionado = e.source.idDepto;
							partidaSeleccionada = e.source.idPartida;
							porcentajeSeleccionado = e.source.porcentajeAvance;
							idTrackingSeleccionado = e.source.idTracking;
							ripple.round(e);
							clicking = false;
							contentLabel2.touchEnabled = true;
						}
					});
				}

				if (countRow % 2 == 0 && countRow != 0) {
					topContentLabel = topContentLabel + 40;
				}

				if (flagPos == 0) {
					contentLabel1.top = topContentLabel + 'dp';
					if (countRow == (cant_uc - 1) && cant_uc != 1 && cant_uc % 2 == 1) {

						//Ti.API.info("Es el ultimo valor!");
						detalle3.add(contentLabel1);
						contentDetalle.setTop('0dp');
						contentDetalle.setHeight(Ti.UI.SIZE);
						myGoalsContainer.add(contentDetalle);
						flagPos = 1;
						countRow = countRow + 1;

					} else {

						detalle3.add(contentLabel1);

						flagPos = 1;
						countRow = countRow + 1;
					}

				} else {

					contentLabel2.top = topContentLabel + 'dp';
					detalle3.add(contentLabel2);

					detalle2.add(detalle3);

					detalle1.setTop('7dp');
					detalle2.setTop('7dp');
					detalle1.setBottom('10dp');
					detalle2.setBottom('10dp');

					var separatorDetalle = Ti.UI.createView({
						height : Config.heightSeparatorPlanning,
						width : Ti.UI.FILL,
						backgroundColor : Config.colorBar,
						bottom : '0dp',
						touchEnabled : false
					});

					contentDetalle.add(detalle1);
					contentDetalle.add(detalle2);
					if (dibujaSeparator == true) {
						contentDetalle.add(separatorDetalle);
						dibujaSeparator = false;
					}
					countRow = countRow + 1;

					contentDetalle.setTop('0dp');
					contentDetalle.setHeight(Ti.UI.SIZE);
					if (cant_uc == countRow) {
						myGoalsContainer.add(contentDetalle);
					}

					flagPos = 0;
				}

				if (cant_uc == 1) {
					contentLabel2.top = topContentLabel + 'dp';
					detalle3.add(contentLabel2);
					detalle2.add(detalle3);

					detalle1.setTop('7dp');
					detalle2.setTop('7dp');
					detalle1.setBottom('10dp');
					detalle2.setBottom('10dp');

					var separatorDetalle = Ti.UI.createView({
						height : Config.heightSeparatorPlanning,
						width : Ti.UI.FILL,
						backgroundColor : Config.colorBar,
						bottom : '0dp',
						touchEnabled : false
					});

					contentDetalle.add(detalle1);
					contentDetalle.add(detalle2);
					if (dibujaSeparator == true) {
						contentDetalle.add(separatorDetalle);
						dibujaSeparator = false;
					}
					countRow = countRow + 1;
					myGoalsContainer.add(contentDetalle);

					flagPos = 0;
				}

			}

		}

		if (typeCall == 1) {
			setDataLocal(partidas);
		} else {
			for (var index in work) {
				work[index].hide();
			}

		}
		return true;

	}

	function openDepto() {
		//Ti.API.info("Se abre detalle:" + partidaSeleccionada);
		var subTitle = Ti.App.Properties.getString('UC', null) + ' ' + deptoSeleccionado;
		var Window = require('/ui/p_propietario/detallePartida');
		//ID utilizado para identificar la pantalla de la cual se llama
		var idView = 2;

		var code = 'tracking';
		var listaTrackingUC_Complete = db.selectGENERAL(code);
		var listaTrackingUC = listaTrackingUC_Complete.values;
		var j = 0;

		var porcentaje;
		for (var index in listaTrackingUC) {
			if (listaTrackingUC[index].ID == idTrackingSeleccionado) {
				porcentaje = listaTrackingUC[index].info.progress;
			}
		}

		Config.tracker.addEvent({
			category : trackerName,
			action : 'Abre UC',
			label : 'new window',
			value : 1
		});

		new Window(nav, partidaSeleccionada, subTitle, porcentaje, idTrackingSeleccionado, idView, self, null);
	}

	var deptoSeleccionado;
	var partidaSeleccionada;
	var porcentajeSeleccionado;
	var idTrackingSeleccionado;

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

	construct();

	if (Config.isAndroid) {
		self.open();
	} else {
		nav.openWindow(self);
	}

	function gotData(result) {

		if (result == false) {

			for (var w in work) {
				work[w].hide();
			}

			var code = 'PLANIFICACION';
			var listaPlanning_Complete = db.selectGENERAL(code);

			if (listaPlanning_Complete != null) {
				refresh(null, 'Todas', 'Todos', 'Todos');
			} else {
				var dialog = Ti.UI.createAlertDialog({
					ok : L('SwitchProject_buttonNames1'),
					message : L('login_dialog1Message'),
					title : L('login_dialog1Title')
				});

				dialog.addEventListener('click', function(e) {
					if (e.index == 0) {
						if (clicking == false) {
							if (Config.isAndroid) {
								e.cancelBubble = true;
								clicking = true;
								ripple.round({
									source : leftButton
								});
							} else {
								close();
							}
						}
					}
				});
				dialog.show();
			}

		} else {

			switch(result.status.code) {

			case '200':

				if (result.response.data == "" || result.response.data == null) {
					var dialog = Ti.UI.createAlertDialog({
						title : L('Planning_dialog1Title'),
						message : L('Planning_dialog1Message'),
						ok : L('Planning_dialog1Ok')
					});
					dialog.show();
				} else {
					addData(result.response.data, 1);
					rightButton.visible = true;
				}

				break;
			default:
				//Ti.API.info('result.status.code: ' + result.status.code);
				for (var w in work) {
					work[w].hide();
				}

				var dialog = Ti.UI.createAlertDialog({
					title : L('login_dialog2Title'),
					message : L('login_dialog2Message'),
					ok : L('login_dialog2Ok')
				});
				dialog.show();
				break;
			}

		}

	}

	function getData() {

		for (var index in work) {

			work[index].show();
		}

		var vartoken = Ti.App.Properties.getString('me', null);

		var varProject_id = Ti.App.Properties.getString('project_id', null);

		var params = {
			token : vartoken,
			project_id : varProject_id

		};
		xhr.getPlanning(gotData, params);

	}

	function setDataLocal(data) {

		//Lista partida
		var params = [];
		var varcode = 'PLANIFICACION';
		var varname = '';
		var varvalues = [];
		varvalues = data;

		params = {
			code : varcode,
			name : varname,
			values : varvalues
		};
		var resultado = db.insertGENERAL(params);
		if (resultado) {
			for (var index in work) {
				work[index].hide();
			}
		}

	}

	function refresh(depto, partida, responsable, diaSemana) {

		for (var index in work) {
			work[index].show();
		}

		arrayTrackingFilters = [];
		//partida = Todas, responsable = Todos, diaSemana = Todos

		var local = Config.locale;
		var code = 'PLANIFICACION';
		var diaSemanaCiclo = '';
		flagIngreso = false;
		var listaPlanning_Complete = db.selectGENERAL(code);
		var listaPlanning = listaPlanning_Complete.values;
		//Ti.API.info('ECHO 00');

		for (var index in listaPlanning) {

			if (flagIngreso == true) {

				if (listaPlanning[index].uc[0].day_of_week[local].name != diaSemanaCiclo || listaPlanning[index].multilang_partida[local].name != listaPlanning[index-1].multilang_partida[local].name) {
					flagIngreso = false;
				}
			}

			if (partida != L('PlanningFilters_hintTextAll2')) {
				if (listaPlanning[index].multilang_partida[local].name == partida) {

					if (responsable != L('PlanningFilters_hintTextAll1')) {
						var name_responsable = listaPlanning[index].name_responsable + ' ' + listaPlanning[index].last_name_responsable;
						if (name_responsable == responsable) {
							if (diaSemana != L('PlanningFilters_hintTextAll1')) {
								var list_uc = listaPlanning[index].uc;
								for (jindex in list_uc) {
									diaSemanaCiclo = list_uc[jindex].day_of_week[local].name;
									if (list_uc[jindex].day_of_week[local].name == diaSemana && flagIngreso == false) {
										arrayTrackingFilters.push(listaPlanning[index]);
										flagIngreso = true;
									}
								}

							} else {
								var list_uc = listaPlanning[index].uc;
								for (jindex in list_uc) {
									diaSemanaCiclo = list_uc[jindex].day_of_week[local].name;
									if (flagIngreso == false) {
										arrayTrackingFilters.push(listaPlanning[index]);
										flagIngreso = true;
									}

								}

							}

						}

					} else {
						if (diaSemana != L('PlanningFilters_hintTextAll1')) {
							var list_uc = listaPlanning[index].uc;
							for (jindex in list_uc) {
								diaSemanaCiclo = list_uc[jindex].day_of_week[local].name;
								if (list_uc[jindex].day_of_week[local].name == diaSemana && flagIngreso == false) {
									arrayTrackingFilters.push(listaPlanning[index]);
									flagIngreso = true;
								}
							}

						} else {
							var list_uc = listaPlanning[index].uc;
							for (jindex in list_uc) {
								diaSemanaCiclo = list_uc[jindex].day_of_week[local].name;
								if (flagIngreso == false) {
									arrayTrackingFilters.push(listaPlanning[index]);
									flagIngreso = true;
								}
							}

						}

					}
				}
			} else {
				if (responsable != L('PlanningFilters_hintTextAll1')) {
					var name_responsable = listaPlanning[index].name_responsable + ' ' + listaPlanning[index].last_name_responsable;
					if (name_responsable == responsable) {
						if (diaSemana != L('PlanningFilters_hintTextAll1')) {

							var list_uc = listaPlanning[index].uc;
							for (jindex in list_uc) {
								diaSemanaCiclo = list_uc[jindex].day_of_week[local].name;
								if (list_uc[jindex].day_of_week[local].name == diaSemana && flagIngreso == false) {
									arrayTrackingFilters.push(listaPlanning[index]);
									flagIngreso = true;
								}
							}

						} else {

							var list_uc = listaPlanning[index].uc;
							for (jindex in list_uc) {

								diaSemanaCiclo = list_uc[jindex].day_of_week[local].name;

								if (flagIngreso == false) {

									arrayTrackingFilters.push(listaPlanning[index]);
									flagIngreso = true;
								}
							}

						}

					}

				} else {
					if (diaSemana != L('PlanningFilters_hintTextAll1')) {

						var list_uc = listaPlanning[index].uc;
						for (jindex in list_uc) {
							diaSemanaCiclo = list_uc[jindex].day_of_week[local].name;
							if (list_uc[jindex].day_of_week[local].name == diaSemana && flagIngreso == false) {
								arrayTrackingFilters.push(listaPlanning[index]);
								flagIngreso = true;
							}
						}

					} else {

						var list_uc = listaPlanning[index].uc;
						for (jindex in list_uc) {
							diaSemanaCiclo = list_uc[jindex].day_of_week[local].name;
							if (flagIngreso == false) {

								arrayTrackingFilters.push(listaPlanning[index]);
								flagIngreso = true;
							}
						}
					}
				}
			}
		}

		return arrayTrackingFilters;
		/*
		 for (var index in work) {
		 work[index].hide();
		 }*/
		/*
		 if (JSON.stringify(arrayTrackingFilters) == '[]' || JSON.stringify(arrayTrackingFilters) == null) {
		 return false;
		 } else
		 return true;*/

	}

	function showHelp() {
		help.animate_show();
	}


	self.refresh = refresh;

}

module.exports = planning;
