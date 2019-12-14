var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');
var Permissions = require('/libs/Permissions');
var db = require('/mods/db');
var moment = require('/libs/moment');
var help;

// TIMESTAMP:  moment.utc().valueOf());
// UTC DATE:   moment.utc().format().toString();
// LOCAL DATE: moment.utc().local().format().toString();

function detallePartida(nav, partida, UC, porcentajeEntrada, id_tracking, idView, prevWindow, functionRefresh) {
	var summon = require('/mods/summon');
	var self;

	var trackerName = 'Profesional de terreno: Open detallePartida';
	Config.tracker.addScreenView(trackerName);

	var content;
	var porcentajeInput = porcentajeEntrada;
	var filename = id_tracking;
	var checkOKOff;
	var checkOKOn;

	var listaImagenesInput = [];
	var listaImagenesInputIDs = [];

	var arrayImagenesInput = [];
	var comentarioInput = '';
	var checkCalidadInput = false;
	var comentarioText;
	var work = [];
	var work2 = [];
	var calidadCheck = checkCalidadInput;

	var myGoalsContainer;
	var contentOpenPhoto;
	var leftButton;
	var helpButton;

	var clicking;

	var flagSeleccionarAvance = false;

	clicking = false;
	var flagOpencambiarporcentaje = false;
	var viewCambiarporcentaje;

	var flagOpenOpcionAdjuntar = false;
	var viewOpcionAdjuntar;

	var titleHead = partida;

	var imagenAdjunta = false;
	var contentImagenesAdjuntas;
	var arrayImagenesAdjuntas = [];
	var boxAI;

	var flagOpenAbrirFoto = false;
	var viewAbrirFoto;
	var contentSPAbrirFoto;

	var idTrackingPresionado = id_tracking;

	var arraylistColorPorcentaje = [];
	var arraylistTextPorcentaje = [];
	var arraylistPorcentajeBox = [];

	var scroll;
	var tableData = [];
	var table;

	content = Ti.UI.createView({
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		left : '0dp',
		right : '0dp',
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

	function construct() {

		scroll = Ti.UI.createScrollView({
			showVerticalScrollIndicator : true,
			width : Ti.UI.FILL,
			top : '0dp',
			bottom : '0dp',
			left : '0dp',
			right : '0dp',
			layout : 'vertical',
			scrollType : 'vertical'
		});

		myGoalsContainer = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			left : '0dp',
			right : '0dp',
			top : '8dp',
			layout : 'vertical'
		});

		foto = Ti.UI.createImageView({
			borderRadius : Config.bigborderRadius,
			height : Ti.UI.FILL,
			width : Ti.UI.SIZE,
			touchEnabled : false,
			image : imageToOpen
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

		addData();

		scroll.add(myGoalsContainer);

		content.add(scroll);

		self.add(content);
		cambiarporcentaje();
		opcionAdjuntar();
		abrirFoto();
		setData();

		var indicator = Ti.UI.createActivityIndicator({
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
		work2.push(viewBlack);
		work2.push(indicator);
		viewBlack.add(indicator);

		self.add(viewBlack);

		var leftHelp = [{
			img : '/images/ic_navigate_before_w.png',
			text : 'Volver atrás'
		}];

		var rightHelp = [];

		var mainHelp = [fakeView()];

		var extraHelp = ['En esta pantalla se puede modificar avance, adjuntar imagen, escribir comentarios y aprobación de calidad para el encargado.'];

		help = summon.contexthelp(leftHelp, rightHelp, mainHelp, extraHelp);
		self.add(help);

	}

	function fakeView() {

	}

	function setData() {

		var code = 'tracking';
		var listaTrackingUC_Complete = db.selectGENERAL(code);
		var listaTrackingUC = listaTrackingUC_Complete.values;
		var j = 0;

		for (var index in listaTrackingUC) {
			if (listaTrackingUC[index].ID == id_tracking) {

				checkCalidadInput = listaTrackingUC[index].info.quality;
				calidadCheck = checkCalidadInput;
				comentarioInput = listaTrackingUC[index].info.comments;
				var photos = listaTrackingUC[index].info.photos;
				for (var jindex in photos) {
					arrayImagenesInput[j] = photos[jindex];
					dibujarFotos(null, null, photos[jindex], false);
					j = j + 1;
				}
			}
		}

		//dibujarCirculosIni(j+1);

		var listaTracking_Complete = db.selectTRACING(id_tracking);
		var pathImages = null;
		var nameImages = null;
		for (var index in listaTracking_Complete) {
			pathImages = listaTracking_Complete.images;
			nameImages = listaTracking_Complete.name_images;
		}

		for (var index in arrayImagenesInput) {

			var flag = false;

			if (pathImages != null && pathImages != '') {
				for (var jindex in nameImages) {
					if (nameImages[jindex] == arrayImagenesInput[index]) {
						var file = Ti.Filesystem.getFile(pathImages[jindex]);
						var nameThumb = pathImages[jindex] + Config.hashThumbnail;
						var fileThumb = Ti.Filesystem.getFile(nameThumb);
						picture = file.read();
						pictureThumb = fileThumb.read();

						setImagesIniThumb(pictureThumb, index);
						setImagesIni(picture, index);
						flag = true;

					}
				}
			}

			if (flag == false) {
				var params = {
					token : Ti.App.Properties.getString('me', null),
					id_image : arrayImagenesInput[index],
					id_j : index
				};

				xhr.getImageThumb(setImagesIniThumb, params);
			}
		}

		if (checkCalidadInput == true) {
			checkOKOff.add(checkOKOn);
		}
		comentarioText.value = comentarioInput;

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
		content.add(viewBlack);

	}

	var scrollImagenes;
	function imagenesAdjuntas() {

		contentImagenesAdjuntas = Ti.UI.createView({
			height : (Config.tamImagenAdjunta + 8) + 'dp',
			//width : Ti.UI.FILL,
			top : '90dp',
			left : '19dp',
			right : '19dp',
			visible : false
		});

		scrollImagenes = Ti.UI.createScrollView({
			height : (Config.tamImagenAdjunta + 8) + 'dp',
			//width : Ti.UI.SIZE,
			layout : 'horizontal',
			scrollType : 'horizontal',
			scrollingEnabled : true,
			showHorizontalScrollIndicator : true
		});
		contentImagenesAdjuntas.add(scrollImagenes);

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
				width : '300dp',
				height : '300dp'
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

				try {

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

					var nameImage = new Date().getTime() + '_' + filename;

					var nameImageThumbnail = nameImage + Config.hashThumbnail;

					var file = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, nameImage);
					var fileThumbnail = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, nameImageThumbnail);

					file.write(resizedImage);
					fileThumbnail.write(finalImageThumbnail);

					var path = file.resolve();

					listaImagenesInputIDs.push(nameImage);
					listaImagenesInput.push(path);

					/**************/

					var imagenNormal = imagenResizedNormal(event);
					
					dibujarFotos(finalImage, imagenNormal, nameImage, true);
					
					
				} catch(e) {

					viewOpcionAdjuntar.hide();
					flagOpenOpcionAdjuntar = false;
					var dialog = Ti.UI.createAlertDialog({
						title : L('detallePartida_dialog1Title'),
						message : L('detallePartida_dialog1Message'),
						ok : L('detallePartida_dialog1Ok')
					});
					dialog.show();

				}

			},
			cancel : function() {
				viewOpcionAdjuntar.hide();
				flagOpenOpcionAdjuntar = false;
			},
			error : function(error) {
			}
		});
	}

	function antesCamara() {
		if (Ti.Media.hasCameraPermissions() == true || Config.isAndroid) {
			abrirCamara();
		} else if (!Config.isAndroid) {
			Permissions.getAllClases(abrirCamara);
		}

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
				Ti.API.info('PASO 1.1!');
				if ( typeof path !== 'undefined') {
					var file = Ti.Filesystem.getFile(path);

					if (file.exists()) {
						file.deleteFile();
					}

				}
				Ti.API.info('PASO 1.2!');
				var nameImage = new Date().getTime() + filename;
				var nameImageThumbnail = new Date().getTime() + filename + Config.hashThumbnail;
				Ti.API.info('PASO 1.3!');
				var file = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, nameImage);
				var fileThumbnail = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, nameImageThumbnail);

				file.write(resizedImage);
				fileThumbnail.write(finalImageThumbnail);
				Ti.API.info('PASO 2!');
				var path = file.resolve();
				Ti.API.info('PASO 3!');
				listaImagenesInputIDs.push(nameImage);
				listaImagenesInput.push(path);
				Ti.API.info('PASO 4!');
				/**************/

				var imagenNormal = imagenResizedNormal(event);
				Ti.API.info('PASO 5!');
				dibujarFotos(finalImage, imagenNormal, nameImage, true);

			},
			cancel : function() {
				viewOpcionAdjuntar.hide();
				flagOpenOpcionAdjuntar = false;
			},
			error : function(error) {
				Ti.API.info('ERROR: ', error);
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
			visible : false,
			bubbleParent : false
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
			bubbleParent : false
		});

		contentSPAbrirFoto = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Config.tamViewContent + 'dp',
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
		if ( typeof id !== 'undefined' && typeof imageInput !== 'undefined') {
			Ti.API.info("ECHO: setImagesIniThumb:" + id);
			arrayImagenesThumb[id].image = imageInput;
			arrayImagenesThumb[id].height = Config.tamImagenAdjunta + 'dp';
			arrayImagenesThumb[id].width = Config.tamImagenAdjunta + 'dp';
			arrayImagenesThumb[id].borderRadius = (Config.tamImagenAdjunta / 2) + 'dp';
		}
	}

	function setImagesIni(imageInput, id) {
		if ( typeof id !== 'undefined' && typeof imageInput !== 'undefined') {
			Ti.API.info("ECHO: setImagesIni:" + id);
			arrayImagenes[id] = imageInput;
			arrayImagenesAdjuntas[id].cargo = true;
		}
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
			Ti.API.info('PASO 6!');
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
			Ti.API.info('PASO 7!');
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
							token : Ti.App.Properties.getString('me', null),
							id_image : nameImage,
							id : e.source.id
						};
						xhr.getImage(setAbrirFoto, params);

						//e.source.vNameImage = null;
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
			Ti.API.info("ECHO!");
		} else {
			viewOpcionAdjuntar.hide();
			flagOpenOpcionAdjuntar = false;
			Ti.API.info('PASO 8!');
			var dialog = Ti.UI.createAlertDialog({
				title : L('detallePartida_dialog2Title'),
				message : L('detallePartida_dialog2Message') + Config.cantImagenesMax + '.',
				ok : L('detallePartida_dialog2Ok')
			});
			dialog.show();

		}

	}

	function dibujarCirculosIni(cant) {

		if (flagCambiarFoto == true) {
			eliminarFoto();
			flagCambiarFoto = false;
		}

		for (var count = 0; count < cant; count++) {

			var picView = Ti.UI.createView({
				borderRadius : (Config.tamImagenAdjunta / 2) + 'dp',
				height : Config.tamImagenAdjunta + 'dp',
				width : Config.tamImagenAdjunta + 'dp',
				id : count,
				borderColor : Config.colorPrimario2,
				//backgroundColor : Config.red,
				borderWidth : '2dp',
				top : '0dp',
				bottom : '8dp'
			});

			var picTaken = Ti.UI.createImageView({
				borderRadius : (Config.tamImagenAdjunta / 2) + 'dp',
				height : Config.tamImagenAdjunta + 'dp',
				width : Config.tamImagenAdjunta + 'dp',
				touchEnabled : false,
				id : count,
				backgroundImage : '/images/192_camera.png'
			});

			if (count != 0) {
				picView.left = '20dp';
			} else {
				boxAI.height = '208dp';
			}

			arrayImagenes.push(null);
			picView.add(picTaken);
			arrayImagenesAdjuntas.push(picView);
			scrollImagenes.add(picView);

			contentImagenesAdjuntas.show();

			arrayImagenesAdjuntas[count].show();

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
			//backgroundColor : Config.red,
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
			callback : antesCamara,
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
			text : L('detallePartida_TomarFoto'),
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

	function CambiarACero() {
		WSSwitchPercentage(0);

		viewCambiarporcentaje.hide();
		flagSeleccionarAvance = false;
		flagOpencambiarporcentaje = false;

	}

	function WSSwitchPercentage(aux) {

		if (aux == 0) {
			porcentajeInput = 0;
			arraylistColorPorcentaje[idTrackingPresionado].setBackgroundColor(Config.colorPercentage0);
			arraylistTextPorcentaje[idTrackingPresionado].text = '0%';
			arraylistColorPorcentaje[idTrackingPresionado].porcentaje = 0;
		} else if (aux == 1) {
			porcentajeInput = 25;
			arraylistColorPorcentaje[idTrackingPresionado].setBackgroundColor(Config.colorPercentage25);
			arraylistTextPorcentaje[idTrackingPresionado].text = '25%';
			arraylistColorPorcentaje[idTrackingPresionado].porcentaje = 25;
		} else if (aux == 2) {
			porcentajeInput = 50;
			arraylistColorPorcentaje[idTrackingPresionado].setBackgroundColor(Config.colorPercentage50);
			arraylistTextPorcentaje[idTrackingPresionado].text = '50%';
			arraylistColorPorcentaje[idTrackingPresionado].porcentaje = 50;
		} else if (aux == 3) {
			porcentajeInput = 75;
			arraylistColorPorcentaje[idTrackingPresionado].setBackgroundColor(Config.colorPercentage75);
			arraylistTextPorcentaje[idTrackingPresionado].text = '75%';
			arraylistColorPorcentaje[idTrackingPresionado].porcentaje = 75;
		} else if (aux == 4) {
			porcentajeInput = 100;
			arraylistColorPorcentaje[idTrackingPresionado].setBackgroundColor(Config.colorPercentage100);
			arraylistTextPorcentaje[idTrackingPresionado].text = '100%';
			arraylistColorPorcentaje[idTrackingPresionado].porcentaje = 100;
		}

	}

	function cerrarPopup() {

		if (flagOpencambiarporcentaje == true) {
			viewCambiarporcentaje.hide();
			flagOpencambiarporcentaje = false;
		}
		if (flagOpenOpcionAdjuntar == true) {
			viewOpcionAdjuntar.hide();
			flagOpenOpcionAdjuntar = false;
			flagCambiarFoto = false;
		}
		if (flagOpenAbrirFoto == true) {
			viewAbrirFoto.hide();
			flagOpenAbrirFoto = false;
		}
	}

	function dummy() {
		//Funcion que solo sirve para efectos
		viewCambiarporcentaje.hide();
		flagSeleccionarAvance = false;
		flagOpencambiarporcentaje = false;
	}

	var arrayBoxPaint = [];
	var arrayBoxPercentage = [];
	function cambiarporcentaje() {

		flagOpencambiarporcentaje = false;

		viewCambiarporcentaje = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			top : '0dp',
			backgroundColor : Config.transparenceBlack2,
			visible : false
		});

		viewCambiarporcentaje.addEventListener('click', function(e) {
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
			text : L('detallePartida_SeleccionarAvance'),
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
					//TODO
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
					 viewCambiarporcentaje.hide();
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
					 arrayBoxPaint[e.source.id].animate(anime2);
					 });

					 anime2.addEventListener('complete', function() {
					 arrayBoxPaint[e.source.id].animate(anime3);
					 });

					 anime3.addEventListener('complete', function() {
					 WSSwitchPercentage(e.source.id);
					 viewCambiarporcentaje.hide();
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
		viewCambiarporcentaje.add(contentSP);

		self.add(viewCambiarporcentaje);

	}

	var porcentajePresionado;

	function Visiblecambiarporcentaje() {
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

		viewCambiarporcentaje.show();
		flagOpencambiarporcentaje = true;
	}

	var flagCambiarFoto = false;

	function cambiarFoto() {
		flagCambiarFoto = true;
		viewAbrirFoto.hide();
		flagOpenAbrirFoto = false;

		VisibleAdjuntarImagen();
		//eliminarFoto();

	}

	var arrayPhotosDelete = [];

	function eliminarFoto() {

		Ti.API.info("idImageOpen: " + idImageOpen);
		Ti.API.info("numImagenAdjunta: " + numImagenAdjunta);

		scrollImagenes.remove(arrayImagenesAdjuntas[idImageOpen]);

		var codeInput = 'tracking';
		var listaTrackingUC_Complete = db.selectGENERAL(codeInput);
		var listaTrackingUC = listaTrackingUC_Complete.values;
		
		for (var index in listaTrackingUC) {
			if (listaTrackingUC[index].ID == id_tracking && listaTrackingUC[index].info.photos != null) {
				arrayPhotosDelete.push(listaTrackingUC[index].info.photos[idImageOpen]);

			}
		}

		/*Se verifica si la imagen a eliminar es nueva. Si es asi, se elimina*/
		for (var index in listaImagenesInputIDs) {
			Ti.API.info('realIDOpen:' + realIDOpen);
			if (listaImagenesInputIDs[index] == realIDOpen) {
				listaImagenesInputIDs.splice(index, 1);
				listaImagenesInput.splice(index, 1);
			}
		}

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

	var foto;
	function setAbrirFoto(imageOpen, id) {
		for (var index in work) {
			work[index].hide();
		}

		if (imageOpen != false) {
			arrayImagenes[id] = imageOpen;
			foto.image = imageOpen;

		} else {
			arrayImagenes[id] = '/images/192_attach.png';
			foto.image = '/images/192_attach.png';
		}

		foto.height = Ti.UI.FILL;
		foto.width = Ti.UI.SIZE;

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
			top : '10dp',
			bubbleParent : false
		});

		var opcion1 = Ti.UI.createView({
			width : '58dp',
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
			width : Ti.UI.SIZE,
			text : L('detallePartida_cambiar'),
			top : '10dp',
			touchEnabled : false
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
			text : L('detallePartida_eliminar'),
			top : '10dp',
			touchEnabled : false
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
			if (numImagenAdjunta < Config.cantImagenesMax) {
				viewOpcionAdjuntar.show();
				flagOpenOpcionAdjuntar = true;
			} else {
				var dialog = Ti.UI.createAlertDialog({
					title : L('detallePartida_dialog2Title'),
					message : L('detallePartida_dialog2Message') + Config.cantImagenesMax + '.',
					ok : L('detallePartida_dialog2Ok')
				});
				dialog.show();
			}

		}

	}

	function addData() {

		//myGoalsContainer.removeAllChildren();

		var title = Ti.UI.createView({
			top : '0dp',
			width : Ti.UI.FILL,
			height : '40dp'

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
			text : UC,
			center : title
		});

		var separatorBox = Ti.UI.createView({
			height : '2dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			bottom : '0dp',
			touchEnabled : false
		});

		var box = Ti.UI.createView({
			height : '60dp',
			width : Ti.UI.FILL
		});

		var textMenu = Ti.UI.createView({
			width : Ti.UI.FILL,
			layout : 'horizontal',
			height : Ti.UI.SIZE,
			left : '0dp',
			touchEnabled : false
		});

		var rowBoxOrange = Ti.UI.createView({
			backgroundColor : Config.colorPrimario2,
			height : Config.heightRowBoxOrange,
			width : '4dp',
			rippleColor : Config.white,
			touchEnabled : false
		});

		var label1 = Ti.UI.createLabel({
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.colorPrimario2,
			height : 'auto',
			width : Ti.UI.SIZE,
			left : '15dp',
			touchEnabled : false,
			text : L('detallePartida_avance')
		});

		var label2 = Ti.UI.createLabel({
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.white,
			height : 'auto',
			width : Ti.UI.SIZE,
			left : '4dp',
			touchEnabled : false,
			text : L('detallePartida_semanal')
		});

		var boxPercentage = Ti.UI.createView({
			borderRadius : '10dp',
			borderWidth : '0dp',
			height : '40dp',
			width : '60dp',
			right : '19dp',
			rippleColor : Config.white,
			callback : Visiblecambiarporcentaje,
			finish : finish,
			porcentaje : porcentajeEntrada
		});

		boxPercentage.addEventListener('click', function(e) {
			if (clicking == false) {
				porcentajePresionado = e.source.porcentaje;
				clicking = true;
				ripple.effect(e);
			}

		});

		var percentageLabel = Ti.UI.createLabel({
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.white,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			touchEnabled : false,
			text : porcentajeEntrada + '%'
		});

		if (porcentajeEntrada == '0') {
			boxPercentage.setBackgroundColor(Config.colorPercentage0);
		} else if (porcentajeEntrada == '25') {
			boxPercentage.setBackgroundColor(Config.colorPercentage25);
		} else if (porcentajeEntrada == '50') {
			boxPercentage.setBackgroundColor(Config.colorPercentage50);
		} else if (porcentajeEntrada == '75') {
			boxPercentage.setBackgroundColor(Config.colorPercentage75);
		} else if (porcentajeEntrada == '100') {
			boxPercentage.setBackgroundColor(Config.colorPercentage100);
		}

		var separatorTable = Ti.UI.createView({
			height : '2dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			bottom : '0dp'
		});

		/*** box adjuntar imagen ***/

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
			text : L('detallePartida_adjuntar')
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
			text : L('detallePartida_imagen')
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

		/*** Fin ***/

		/*** Comentario ***/

		var boxCO = Ti.UI.createView({
			height : '190dp',
			width : Ti.UI.FILL,
			//touchEnabled : false
		});

		var viewCO = Ti.UI.createView({
			width : Ti.UI.FILL,
			layout : 'horizontal',
			height : Ti.UI.FILL,
			top : '10dp',
			bottom : '10dp',
			right : '15dp',
			//touchEnabled : false
		});

		var rowBoxOrangeCO = Ti.UI.createView({
			backgroundColor : Config.colorPrimario2,
			height : Config.heightRowBoxOrange,
			top : '0dp',
			width : '4dp',
			rippleColor : Config.white,
			//touchEnabled : false
		});

		var contentCO = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : '160dp',
			left : '15dp',
			borderRadius : Config.bigborderRadius,
			borderColor : Config.colorBar,
			backgroundColor : Config.colorWallpaper1,
			borderWidth : '1dp'
		});

		comentarioText = Ti.UI.createTextArea({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			top : '0dp',
			left : '8dp',
			right : '8dp',
			hintTextColor : Config.color1,
			backgroundColor : 'transparent',
			color : Config.color1,
			autocorrect : true,
			hintText : L('detallePartida_comentario'),
			font : {
				fontSize : '16dp'
			},
			value : comentarioInput,
			keyboardType : Ti.UI.KEYBOARD_TYPE_DEFAULT,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			touchEnabled : true
		});

		var separatorCO = Ti.UI.createView({
			height : '2dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			bottom : '0dp'
		});

		/*** Fin comentario ***/
		/*** check calidad ***/

		var boxCalidad = Ti.UI.createView({
			height : '60dp',
			width : Ti.UI.FILL
		});

		var textCalidad = Ti.UI.createView({
			width : Ti.UI.FILL,
			layout : 'horizontal',
			height : Ti.UI.SIZE,
			left : '0dp',
			touchEnabled : false
		});

		var rowBoxOrangeCalidad = Ti.UI.createView({
			backgroundColor : Config.colorPrimario2,
			height : Config.heightRowBoxOrange,
			width : '4dp',
			rippleColor : Config.white,
			touchEnabled : false
		});

		var labelCalidad = Ti.UI.createLabel({
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.white,
			height : 'auto',
			width : Ti.UI.SIZE,
			left : '15dp',
			touchEnabled : false,
			text : L('detallePartida_calidadOK')
		});

		checkOKOff = Ti.UI.createView({
			borderColor : Config.colorPrimario2,
			borderRadius : Config.borderRadius,
			backgroundColor : Config.colorWallpaper1,
			borderWidth : '1dp',
			right : '19dp',
			height : Config.tamCheckCalidad,
			width : Config.tamCheckCalidad
		});

		checkOKOff.addEventListener('click', function(e) {
			if (calidadCheck == false) {
				checkOKOff.add(checkOKOn);
				calidadCheck = true;
			} else {
				checkOKOff.removeAllChildren();
				calidadCheck = false;
			}
		});

		checkOKOn = Ti.UI.createImageView({
			image : '/images/192_ticket.png',
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,
			touchEnabled : false,
			top : '2dp',
			bottom : '2dp',
			left : '2dp',
			right : '2dp'
		});

		var separatorCalidad = Ti.UI.createView({
			height : '2dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.colorBar,
			bottom : '0dp'
		});
		/*** Fin check calidad ***/

		/*** Botón filtro ***/
		var buttonGuardar = Ti.UI.createView({
			backgroundColor : Config.colorPrimario2,
			borderColor : Config.colorPrimario2,
			borderRadius : Config.bigborderRadius,
			top : '20dp',
			bottom : '20dp',
			height : '42dp',
			left : Config.marginViewSeguimiento,
			right : Config.marginViewSeguimiento,
			rippleColor : Config.white,
			callback : guardarDetalle,
			finish : finish
		});

		var buttonLabel = Ti.UI.createLabel({
			text : L('detallePartida_guardar'),
			font : {
				fontSize : '16dp'
			},
			color : Config.color1,
			touchEnabled : false
		});

		buttonGuardar.add(buttonLabel);

		buttonGuardar.addEventListener('click', function(e) {
			if (clicking == false) {
				clicking = true;
				ripple.effect(e);
			}
		});
		/*** Fin botón ***/

		title.add(labelTitle);
		title.add(separatorBox);
		myGoalsContainer.add(title);

		textMenu.add(rowBoxOrange);
		textMenu.add(label1);
		textMenu.add(label2);
		boxPercentage.add(percentageLabel);
		box.add(textMenu);
		box.add(boxPercentage);
		box.add(separatorTable);

		arraylistColorPorcentaje[idTrackingPresionado] = boxPercentage;
		arraylistTextPorcentaje[idTrackingPresionado] = percentageLabel;
		myGoalsContainer.add(box);

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
		myGoalsContainer.add(boxAI);

		viewCO.add(rowBoxOrangeCO);
		contentCO.add(comentarioText);
		viewCO.add(contentCO);

		boxCO.add(viewCO);
		boxCO.add(separatorCO);
		myGoalsContainer.add(boxCO);

		textCalidad.add(rowBoxOrangeCalidad);
		textCalidad.add(labelCalidad);
		boxCalidad.add(textCalidad);
		if (calidadCheck == true) {
			checkOKOff.add(checkOKOn);
		}
		boxCalidad.add(checkOKOff);
		boxCalidad.add(separatorCalidad);

		myGoalsContainer.add(boxCalidad);
		myGoalsContainer.add(buttonGuardar);

	}

	function guardarDetalle() {
		for (var w in work2) {
			work2[w].show();
		}

		Config.tracker.addEvent({
			category : trackerName,
			action : 'Guarda detalle',
			label : 'new window',
			value : 1
		});

		//Pantalla TracingUC
		var UCModificado = '';
		var codeInput = 'tracking';
		var listaTrackingUC_Complete = db.selectGENERAL(codeInput);
		var listaTrackingUC = listaTrackingUC_Complete.values;

		var paramsPlanning = {
			porcentaje : porcentajeInput,
			comentario : comentarioText.value,
			calidad : calidadCheck
		};

		for (var index in listaTrackingUC) {
			/**** Actualización local ****/
			if (listaTrackingUC[index].ID == id_tracking) {
				listaTrackingUC[index].info.progress = porcentajeInput;
				listaTrackingUC[index].info.comments = comentarioText.value;
				listaTrackingUC[index].info.quality = calidadCheck;

				Ti.API.info("Detalle Partida: comentario->" + comentarioText.value);

				/*Se eliminan las fotos pendientes*/
				var listaFotos = listaTrackingUC[index].info.photos;
				for (var jindex in arrayPhotosDelete) {
					for (var zindex in listaFotos) {
						if (listaFotos[zindex] == arrayPhotosDelete[jindex]) {
							listaTrackingUC[index].info.photos.splice(zindex, 1);
							Ti.API.info("Actualizado! 1");
						}
					}

				}
				/**** Actualización envío de datos ****/
				/*Se verifica si existe una foto anteriormente*/
				var i = 0;
				for (var jindex in listaTrackingUC[index].info.photos) {
					i = i + 1;
				}
				if (i > 0) {
					for (var zindex in listaImagenesInputIDs) {
						listaTrackingUC[index].info.photos[i] = listaImagenesInputIDs[zindex];
						i = i + 1;
					}

				} else {
					listaTrackingUC[index].info.photos = listaImagenesInputIDs;
				}
				/*Fin verificación*/

				UCModificado = listaTrackingUC[index].name;
				var params = {
					code : codeInput,
					name : '',
					values : listaTrackingUC
				};

				db.updateGENERAL(params);
				/*Se verifica que no exista el dato en TRACING*/

				var listaTrackingComplete = db.selectTRACING(porcentajeInput);

				var flagExiste = false;

				for (var zindex in listaTrackingComplete) {
					flagExiste = true;
				}

				if (flagExiste == true) {
					Ti.API.info("detallePartida: Existe!");
					var listaTracking = listaTrackingComplete.values;
					var imagenesPorSubir = listaTrackingComplete.images;
					var imagenesPorSubirIDs = listaTrackingComplete.name_images;

					listaTracking.progress = porcentajeInput;
					listaTracking.comments = comentarioText.value;
					listaTracking.quality = calidadCheck;
					listaTracking.photos = listaTrackingUC[index].info.photos;

					for (var zindex in listaImagenesInputIDs) {
						imagenesPorSubir.push(listaImagenesInput[zindex]);
						imagenesPorSubirIDs.push(listaImagenesInputIDs[zindex]);
					}
					/*
					 Ti.Geolocation.getCurrentPosition(function(loc) {
					 if (loc.success == true) {
					 listaTracking.geolocation.end = {
					 timestamp : moment.utc().valueOf(),
					 lon : loc.coords.longitude,
					 lat : loc.coords.latitude
					 };
					 } else {
					 listaTracking.geolocation.end = {
					 error : true
					 };
					 }
					 });*/
					 
					var params = {
						code : porcentajeInput,
						name : '',
						values : listaTracking,
						images : imagenesPorSubir,
						name_images : imagenesPorSubirIDs
					};

					db.updateTRACING(params);

				} else {

					var arrayPhotos = [];
					var arrayImages = [];
					for (var zindex in listaImagenesInputIDs) {
						arrayPhotos.push(listaImagenesInputIDs[zindex]);
						arrayImages.push(listaImagenesInput[zindex]);
					}

					var structGeolocaton = {
						end : '',
						send : ''
					};
					var pValues = {
						progress : porcentajeInput,
						comments : comentarioText.value,
						quality : calidadCheck,
						photos : listaTrackingUC[index].info.photos,
						geolocation : structGeolocaton
					};

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
					});

					var params = {
						code : id_tracking,
						name : '',
						values : pValues,
						images : arrayImages,
						name_images : arrayPhotos
					};
					db.insertTRACING(params);
				}
			}
		}
		/** Update View **/

		if (idView == 1) {
			if (Config.isAndroid) {
				prevWindow.refresh(id_tracking, porcentajeInput);
			} else {
				functionRefresh(id_tracking, porcentajeInput);
			}

		} else if (idView == 2) {
			/*En caso de ser llamado desde planificación*/
		}
		for (var w in work2) {
			work2[w].hide();
		}

		close();

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
		Ti.API.info("flagOpencambiarporcentaje:" + flagOpencambiarporcentaje);
		Ti.API.info("flagOpenAbrirFoto:" + flagOpenAbrirFoto);
		Ti.API.info("flagOpenOpcionAdjuntar:" + flagOpenOpcionAdjuntar);
		if (flagOpencambiarporcentaje == true) {
			viewCambiarporcentaje.hide();
			flagOpencambiarporcentaje = false;
			flag = true;
		}
		if (flagOpenOpcionAdjuntar == true) {
			flagCambiarFoto = false;
			viewOpcionAdjuntar.hide();
			flagOpenOpcionAdjuntar = false;
			flag = true;
		}
		if (flagOpenAbrirFoto == true) {
			viewAbrirFoto.hide();
			flagOpenAbrirFoto = false;
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
			comentarioText.blur();
			// myGoalsContainer.name.blur();
			// myGoalsContainer.telephone.blur();
		}
	}

	function showHelp() {
		help.animate_show();
	}

}

module.exports = detallePartida;
