var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');
var xhr = require('/mods/xhr');
//var db = require('/mods/db');

function mainApp() {


	var clicking = false;
	var imageWallpaper = Config.wallpaperApp;

	var local = Config.locale;
	var self = Ti.UI.createWindow({
		title: L('login_title'),
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
	var arrayListRefAudio = [];
	var arrayPbRefAudio = [];
	var arrayStartPauseButton = [];
	var openViewMusic = false;
	var idAlbum = '';

	var listMusic;
	var webviewMain;

	// var boxBottom = Ti.UI.createView({
	// 	top: '0dp',
	// 	left: '0dp',
	// 	right: '0dp',
	// 	height: Ti.UI.SIZE,
	// 	width: Ti.UI.FILL,
	// 	layout: 'vertical'

	// });

	var boxBottom;


	if (Config.isAndroid) {
		self.exitOnClose = true;
	}

	var work = [];
	var inputSearch;

	var nav;

	var content = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		bottom: '0dp',
		top: '0dp'
	});

	var work1 = Ti.UI.createView({
		height: Ti.UI.FILL,
		width: Ti.UI.FILL,
		zindex: 999
	});



	if (!Config.isAndroid) {

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
	var passInput = Ti.UI.createTextField();
	var userInput = Ti.UI.createTextField();

	var scroll1;

	var tvListMusic = Ti.UI.createTableView({
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		top: '0dp',
		bottom: '10dp',
		layout: 'vertical',
		showVerticalScrollIndicator: true,
		backgroundColor: 'transparent',
		// backgroundColor: Config.red,
		separatorStyle: Titanium.UI.TABLE_VIEW_SEPARATOR_STYLE_NONE
	});

	var openMusic = Ti.UI.createView({
		// backgroundColor: Config.red,
		top: '0dp',
		layout: 'vertical',
		height: Ti.UI.FILL,
		width: Ti.UI.FILL,

	});

	function construct() {

		inputSearch = Ti.UI.createTextField({
			width: Ti.UI.FILL,
			left: '10dp',
			height: '42dp',
			font: {
				fontSize: '16dp'
			},
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
			hintTextColor: '#AFADAA',
			autocorrect: true,
			color: Config.color1,
			keyboardType: Ti.UI.KEYBOARD_TYPE_DEFAULT,
			textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
			touchEnabled: true,
			hintText: 'Buscar...',
			backgroundColor: 'transparent',
			bubbleParent: false

		});
		var waitForPause, pauseDelay = 1000;

		inputSearch.addEventListener('return', function (e) {
			/* Llamada a API iTunnes */
			for (var w in work) {
				work[w].show();
			}
			var pattern = e.source.value;
			flagKeyboardUP = true;
			flagDepartamentoInputUC = 0;
			callApi(pattern);
			hideSoftKeyboard();


		});

		var myLoginIndicator = Ti.UI.createActivityIndicator({
			style: Config.isAndroid ? Ti.UI.ActivityIndicatorStyle.BIG_DARK : Ti.UI.ActivityIndicatorStyle.BIG,
			height: '120dp',
			width: '120dp'
		});

		var boxSearch = Ti.UI.createView({
			borderColor: Config.colorBar,
			borderRadius: Config.bigborderRadius,
			backgroundColor: Config.colorWallpaper1,
			borderWidth: '1dp',
			top: '10dp',
			height: '50dp',
			left: Config.marginViewSeguimiento,
			right: Config.marginViewSeguimiento,
			bubbleParent: false
		});


		var iconSearch = Ti.UI.createImageView({
			image: '/images/buscar.png',
			height: '30dp',
			width: '30dp',
			right: '10dp'
		});

		var mask1 = Ti.UI.createView({
			backgroundColor: Config.black,
			opacity: 0.6,
			height: Ti.UI.FILL,
			width: Ti.UI.FILL,
			visible: false
		});

		scroll1 = Ti.UI.createView({
			showVerticalScrollIndicator: true,
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			layout: 'vertical',
			// scrollType: 'vertical',
			top: '0dp',
			//bottom : '60dp',
			left: '1dp',
			right: '1dp'
		});



		var boxTop = Ti.UI.createView({
			top: '0dp',
			height: '80dp',
			width: Ti.UI.FILL,
			//layout: 'vertical',
			backgroundColor: Config.colorPrimario1
		});

		boxTop.addEventListener('click', function (e) {
			hideSoftKeyboard();
		});

		var boxDesa = null;



		var boxTitle = Ti.UI.createView({
			top: '30dp',
			height: Ti.UI.SIZE,
			width: '190dp'
		});

		var pic = Ti.UI.createImageView({
			image: '/images/icon_play_2.png',
			height: '60dp',
			width: '60dp',
			top: '-5dp',
			right: '140dp',
			touchEnabled: false
		});

		var head1Label = Ti.UI.createLabel({
			text: 'App ',
			font: Config.head2,
			color: Config.color1,
			height: 'auto',
			//width : Ti.UI.FILL,
			top: '0dp',
			right: '83dp',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled: false
		});

		var head2Label = Ti.UI.createLabel({
			text: 'Music',
			font: Config.head2,
			color: Config.white,
			height: 'auto',
			//width : 'auto',
			top: '0dp',
			right: '0dp',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled: false
		});


		// boxTitle.add(pic);
		// boxTitle.add(head1Label);
		// boxTitle.add(head2Label);

		iconSearch.addEventListener('click', function (e) {
			/* Llamada a API iTunnes */
			for (var w in work) {
				work[w].show();
			}
			flagKeyboardUP = true;
			flagDepartamentoInputUC = 0;
			var pattern = inputSearch.value;
			/*idSelector = 0 para body UC*/
			callApi(pattern);
			hideSoftKeyboard();
		});

		boxSearch.add(inputSearch);
		boxSearch.add(iconSearch);
		boxTop.add(boxSearch);






		scroll1.add(boxTop);
		boxBottom = Ti.UI.createScrollableView({
			top: '0dp',
			cacheSize: 21,
			height: Ti.UI.FILL,
			showPagingControl: false,
			scrollingEnabled: false,
			views: [tvListMusic, openMusic],
		});

		scroll1.add(boxBottom);



		//TODO
		if (Config.modeURL == 0)
			content.add(boxDesa);
		content.add(scroll1);
		//content.add(boxBottom);

		work.push(mask1);
		work.push(myLoginIndicator);
		content.add(mask1);
		content.add(myLoginIndicator);

		self.add(content);

	}

	function getUrl() {
		for (var w in work) {
			work[w].show();
		}
		xhr.authurl(gotUrl);
	}

	function callApi(textSearch) {
		Ti.API.info('textSearch:', textSearch);
		var params = {
			text: textSearch
		};
		xhr.apiItunnes(setListMusic, params);
	}
	function setListMusic(data) {



		var rows = [];
		tvListMusic.removeAllChildren();
		if (data.resultCount == 0) {
			tvListMusic.setHeight('0dp');
		}
		else {
			tvListMusic.setHeight(Ti.UI.FILL);

			for (var i = 0; i < data.results.length && i <= 20; i++) {
				// Ti.API.info('result:', data.results[i]);
				var rowBoxOrange = Ti.UI.createView({
					backgroundColor: Config.colorPrimario2,
					height: Config.heightRowBoxOrange,
					width: '4dp',
					rippleColor: Config.white,
					touchEnabled: false,
					left: '0dp'
				});

				var contentDepto = Ti.UI.createTableViewRow({
					width: Ti.UI.FILL,
					height: '70dp',
					touchEnabled: true,
					ind: i,
					data: data.results[i],
					id: data.results[i].trackId,
					backgroundSelectedColor: Config.white,
					opacity: 0.07
				});

				var labelDepto = Ti.UI.createLabel({
					font: {
						fontSize: '16dp',
						fontWeight: 'bold'
					},
					width: '280dp',
					ellipsize: Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
					color: Config.white,
					height: '20dp',
					left: '19dp',
					touchEnabled: false,
					text: data.results[i].artistName + ' - ' + data.results[i].trackName
				});

				var separatorDepto = Ti.UI.createView({
					height: '1dp',
					width: Ti.UI.FILL,
					backgroundColor: Config.colorBar,
					bottom: '0dp',
					touchEnabled: false
				});

				var rowImage = Ti.UI.createImageView({
					image: '/images/ic_navigate_next_w.png',
					height: '36dp',
					width: '36dp',
					right: '19dp',
					touchEnabled: false
				});

				contentDepto.addEventListener('click', function (e) {
					if (clicking == false) {
						clicking = true;
						for (var w in work) {
							work[w].show();
						}
						Ti.API.info('data:', e.source.data);
						setViewMusic(e.source.data);
						for (var w in work) {
							work[w].hide();
						}
						openViewMusic = true;

						boxBottom.scrollToView(1);

						clicking = false;
					}
				});

				contentDepto.add(rowBoxOrange);
				contentDepto.add(labelDepto);
				contentDepto.add(separatorDepto);
				contentDepto.add(rowImage);
				rows.push(contentDepto);
				//i++;

			}
			tvListMusic.data = rows;
			// boxBottom.add(tvListMusic);
		}
		for (var w in work) {
			work[w].hide();
		}

	}

	function setViewMusic(data) {
		//TODO:
		openMusic.removeAllChildren();
		var titleMusic = Ti.UI.createLabel({
			font: {
				fontSize: '20dp',
				fontWeight: 'bold'
			},
			ellipsize: Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
			color: Config.white,
			height: Ti.UI.SIZE,
			top: '26dp',
			touchEnabled: false,
			text: data.artistName
		});

		var contentAlbum = Ti.UI.createView({
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			top: '20dp',
			left: '20dp',
			touchEnabled: false,
			layout: 'horizontal'
		});

		var separatorDepto = Ti.UI.createView({
			height: '1dp',
			width: Ti.UI.FILL,
			backgroundColor: Config.colorBar,
			top: '10dp',
			touchEnabled: false
		});


		var textAlbum = Ti.UI.createLabel({
			font: {
				fontSize: '16dp',
				fontWeight: 'bold'
			},
			width: Ti.UI.SIZE,
			color: Config.color1,
			height: '20dp',
			touchEnabled: false,
			text: 'Álbum: '
		});

		var titleAlbum = Ti.UI.createLabel({
			font: {
				fontSize: '16dp',
				fontWeight: 'bold'
			},
			width: '280dp',
			ellipsize: Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
			color: Config.white,
			height: '20dp',
			touchEnabled: false,
			text: data.collectionName
		});


		contentAlbum.add(textAlbum);
		contentAlbum.add(titleAlbum);

		var ImageAlbum = Ti.UI.createImageView({
			image: data.artworkUrl100,
			height: '100dp',
			width: 'auto',
			top: '20dp'
		});

		idAlbum = data.collectionId;


		listMusic = Ti.UI.createScrollView({
			// backgroundColor: Config.red,
			top: '0dp',
			layout: 'vertical',
			height: Ti.UI.FILL,
			width: Ti.UI.FILL,

		});
		openMusic.add(titleMusic);
		openMusic.add(contentAlbum);
		openMusic.add(ImageAlbum);
		openMusic.add(separatorDepto);
		openMusic.add(listMusic);


		var params = {
			text: data.collectionName
		};
		xhr.apiItunnes(loadBanda, params);

		Ti.API.info('ECHO 0');



	}

	function loadBanda(dataIn) {
		/**Se filtran solo los tracks que correspondan a idAlbum */
		var data = dataIn.results;
		var totalDurationFromBackend = 30;
		for (var i in data) {
			if (data[i].collectionId == idAlbum) {

				var separatorDepto = Ti.UI.createView({
					height: '1dp',
					width: Ti.UI.FILL,
					backgroundColor: Config.colorBar,
					bottom: '0dp',
					touchEnabled: false
				});

				var contentMusic = Ti.UI.createView({
					height: '60dp',
					width: Ti.UI.FILL,
					top: '20dp',
					left: '20dp',
					touchEnabled: false
				});


				var titleMusic = Ti.UI.createLabel({
					font: {
						fontSize: '16dp'
						// fontWeight: 'bold'
					},
					width: '280dp',
					ellipsize: Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
					color: Config.white,
					height: '20dp',
					top: '0dp',
					touchEnabled: false,
					text: data[i].trackName
				});


				var startPauseButton = Ti.UI.createImageView({
					width: '30dp',
					height: '30dp',
					left: '0dp',
					image: '/images/pause.png',
					id: i
				});

				var audioPlayer = Titanium.Media.createAudioPlayer({
					url: data[i].previewUrl,
					preload: true,
					id: i
				});

				arrayListRefAudio.push(audioPlayer);


				var pb = Titanium.UI.createProgressBar({
					width: '250dp',
					left: '40dp',
					height: 'auto',
					min: 0,
					max: totalDurationFromBackend,
					value: 0,
					color: '#fff',
					style: Titanium.UI.iPhone.ProgressBarStyle.PLAIN
				});
				arrayPbRefAudio.push(pb);

				audioPlayer.addEventListener('progress', function (e) {
					Ti.API.info('Time Played: ' + Math.round(e.progress) + ' milliseconds');
					arrayPbRefAudio[e.source.id].value = Math.round(e.progress / 1000);
				});

				arrayStartPauseButton.push(startPauseButton);

				startPauseButton.addEventListener('click', function (e) {
					Ti.API.info('click!');
					for (var j in arrayListRefAudio) {
						if (j != e.source.id) {
							arrayListRefAudio[j].pause();
							arrayStartPauseButton[j].image = '/images/icon_play.png';
						}
					}
					if (arrayListRefAudio[e.source.id].playing) {
						arrayListRefAudio[e.source.id].pause();
						e.source.image = '/images/icon_play.png';
					}
					else {
						arrayListRefAudio[e.source.id].play();
						e.source.image = '/images/pause.png';
					}
				});
				contentMusic.add(titleMusic);
				contentMusic.add(audioPlayer);
				contentMusic.add(pb);
				contentMusic.add(startPauseButton);
				contentMusic.add(separatorDepto);
				pb.show();
				if (i == 0) {
					audioPlayer.play();
				}
				else {
					startPauseButton.image = '/images/icon_play.png';
				}

				listMusic.add(contentMusic);

			}
		}
	}

	function resultados(result) {
		Ti.API.info('result:', result);
	}



	function gotUrl(result) {

		if (result == false) {

			for (var w in work) {
				work[w].hide();
			}

			var dialog = Ti.UI.createAlertDialog({
				title: L('login_dialog1Title'),
				message: L('login_dialog1Message'),
				ok: L('login_dialog1Ok')
			});
			dialog.show();

		} else {

			switch (result.status.code) {

				case '200':

					// var Window = require('/ui/Authorize');
					// new Window(nav, login, result.response.data.url);
					for (var w in work) {
						work[w].hide();
					}
					Ti.Platform.openURL(result.response.data.url);
					break;

				case '500':

					for (var w in work) {
						work[w].hide();
					}

					var dialog = Ti.UI.createAlertDialog({
						title: L('login_dialog2Title'),
						message: L('login_dialog2Message'),
						ok: L('login_dialog2Ok')
					});
					dialog.show();
					break;

				default:

					for (var w in work) {
						work[w].hide();
					}

					var dialog = Ti.UI.createAlertDialog({
						title: L('login_dialog5Title'),
						message: L('login_dialog5Message'),
						ok: L('login_dialog5Ok')
					});
					dialog.show();
					break;

			}
		}
	}

	function validaRut(rutCompleto) {

		Ti.API.info('rutCompleto: ', rutCompleto);

		if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto))
			return false;
		var tmp = rutCompleto.split('-');
		var digv = tmp[1];
		var rut = tmp[0];

		if (digv == '1') {
			digv = 'k';
			return (validaDv(rut) == digv) || (validaDv(rut) == '1');
		} else
			return (validaDv(rut) == digv);
	}

	function validaDv(T) {
		var M = 0,
			S = 1;
		for (; T; T = Math.floor(T / 10))
			S = (S + T % 10 * (9 - M++ % 6)) % 11;

		return S ? S - 1 : 'k';
	}

	function fechaHoy() {
		var selectedDate = new Date();
		var dia = '';
		var mes = '';
		var ano = '';

		var mes_int = selectedDate.getMonth() + 1;
		if (selectedDate.getDay() < 10) {
			dia = '0' + selectedDate.getDay();
		} else {
			dia = selectedDate.getDay();
		}
		if (mes_int < 10) {
			mes = '0' + mes_int;
		} else {
			mes = mes_int;
		}

		ano = selectedDate.getFullYear();

		var hora = selectedDate.getHours();
		var minu = selectedDate.getMinutes();
		var sec = selectedDate.getSeconds();

		var fechaHoy = ano + "-" + mes + "-" + dia + " " + hora + ":" + minu + ":" + sec;
		Ti.API.info('Fecha HOY:', fechaHoy);
		return fechaHoy;

	}

	function postLogin() {
		userInput.value = "";
		passInput.value = "";
		for (var w in work) {
			work[w].hide();
		}
	}

	function loginResponse(result) {

		/*
		Config.tracker.addEvent({
			category: trackerName,
			action: 'Login google',
			label: 'Evaluando',
			value: 1
		});
		*/
		if (result == false) {

			for (var w in work) {
				work[w].hide();
			}

			var dialog = Ti.UI.createAlertDialog({
				title: L('login_dialog1Title'),
				message: L('login_dialog1Message'),
				ok: L('login_dialog1Ok')
			});
			dialog.show();

		} else {



			switch (result.status.code) {

				case '200':
					Ti.App.Properties.setString('fhora_entrada', fechaHoy());
					Ti.App.Properties.setString('me', result.response.data.session_token);
					Ti.App.Properties.setString('perfil', result.response.data.profile_type);
					Ti.App.Properties.setString('name', result.response.data.name);
					Ti.App.Properties.setString('last_name', result.response.data.last_name);
					Ti.App.Properties.setString('phone', result.response.data.phone);
					Ti.App.Properties.setString('email', result.response.data.email);
					Ti.App.Properties.setString('name_perfil', result.response.data.name_perfil);
					Ti.App.Properties.setInt('first_login', result.response.data.first_login);
					Ti.App.Properties.setString('id_user', result.response.data.id_user);
					Ti.App.Properties.setString('id_photo', result.response.data.id_photo);
					Ti.App.Properties.setBool('flagAC', result.response.data.flagAC);

					if (result.response.data.first_login == 1) {

						var Window = require('/ui/firstLogin');
						new Window(null, 0, null, postLogin);
						if (Config.isAndroid) {
							////Config.tracker.endSession();
							//Config.ga.dispatch();
							//TODO: Se comenta para cambio de sesión
							//self.close();

						} else {
							////Config.tracker.endSession();
							//Config.ga.dispatch();
							nav.close();
						}
					} else {
						//if (result.response.data.id_photo != null && result.response.data.id_photo != '')
						Ti.App.Properties.setString('id_photo', result.response.data.id_photo);
						//else
						//	Ti.App.Properties.setString('id_photo', null);

						var Window = require('/ui/p_propietario/Menu');
						new Window(postLogin);
						if (Config.isAndroid) {
							////Config.tracker.endSession();
							//Config.ga.dispatch();
							//TODO: Se comenta para cambio de sesión
							//self.close();

						} else {
							////Config.tracker.endSession();
							//Config.ga.dispatch();
							nav.close();
						}

					}

					break;

				case '401':

					for (var w in work) {
						work[w].hide();
					}

					var dialog = Ti.UI.createAlertDialog({
						title: L('login_dialog3Title'),
						message: L('login_dialog3Message'),
						ok: L('login_dialog3Ok')
					});
					dialog.show();
					break;
				case '406':

					for (var w in work) {
						work[w].hide();
					}

					var dialog = Ti.UI.createAlertDialog({
						title: 'Login',
						message: 'Usuario no existe en nuestro sistema. Favor contacte con el administrador.',
						ok: L('login_dialog3Ok')
					});
					dialog.show();
					break;
				case '402':

					for (var w in work) {
						work[w].hide();
					}

					var dialog = Ti.UI.createAlertDialog({
						title: 'Login',
						message: 'Contraseña incorrecta, favor intente nuevamente.',
						ok: L('login_dialog3Ok')
					});
					dialog.show();
					break;
				default:

					for (var w in work) {
						work[w].hide();
					}

					var dialog = Ti.UI.createAlertDialog({
						title: L('login_dialog2Title'),
						message: L('login_dialog2Message'),
						ok: L('login_dialog2Ok')
					});
					dialog.show();
					break;

			}

		}

	}

	var flagLoginGoogle = false;

	function authorize() {

		if ((userInput.value == "" || passInput.value == "") && flagLoginGoogle == false) {

			for (var w in work) {
				work[w].hide();
			}

			var dialog = Ti.UI.createAlertDialog({
				title: L('login_dialog4Title'),
				message: L('login_dialog4Message'),
				ok: L('login_dialog4Ok')
			});
			dialog.show();
		} else if (flagLoginGoogle == true) {
			//google.authorize(google.login);
		} else {

			var params = {
				email: userInput.value,
				password: passInput.value,
				origen: 0
			};
			xhr.login(loginResponse, params);

		}

	}

	function finish() {
		clicking = false;
	}

	function resume(e) {

		if (Config.mode == 0) {
			Ti.API.info('resume e: ' + JSON.stringify(e));
		}

		if (Config.isAndroid && typeof Ti.Android.currentActivity.intent.data != 'undefined')
			Config.intentData = Ti.Android.currentActivity.intent.data;

		if (!Config.isAndroid && typeof Ti.App.getArguments().url != 'undefined')
			Config.intentData = Ti.App.getArguments().url;

		if (Config.intentData != null) {

			if (Config.mode == 0) {
				Ti.API.info(JSON.stringify(Config.intentData));
				Ti.API.info(Config.intentData.split('login?')[1].split('=')[0]);
			}

			setTimeout(function (e) {

				if (Config.intentData.split('login?')[1].split('=')[0] == 'error') {
					var dialog = Ti.UI.createAlertDialog({
						title: L('login_dialog5Title'),
						message: L('login_dialog5Message'),
						ok: L('login_dialog5Ok')
					});
					dialog.show();
				}

				if (Config.intentData.split('login?')[1].split('=')[0] == 'invalid_mail') {
					var dialog = Ti.UI.createAlertDialog({
						title: L('login_dialog6Title'),
						message: L('login_dialog6Message'),
						ok: L('login_dialog6Ok')
					});
					dialog.show();
				}

				if (Config.intentData.split('login?')[1].split('=')[0] == 'invalid_mail_domain') {
					var dialog = Ti.UI.createAlertDialog({
						title: L('login_dialog7Title'),
						message: L('login_dialog7Message'),
						ok: L('login_dialog7Ok')
					});
					dialog.show();
				}

				if (Config.intentData.split('login?')[1].split('=')[0] == 'old_token') {
					var dialog = Ti.UI.createAlertDialog({
						title: L('login_dialog8Title'),
						message: L('login_dialog8Message'),
						ok: L('login_dialog8Ok')
					});
					dialog.show();
				}

				if (Config.intentData.split('login?')[1].split('=')[0] == 'email') {


					var params = {
						email: Config.intentData.split('email=')[1].split('&')[0],
						code: Config.intentData.split('code=')[1].split('&')[0],
						origen: 1
					};
					xhr.login(loginResponse, params);

				}

			}, 500);

		}

	}

	construct();
	resume();

	Ti.App.addEventListener('resumed', resume);
	Ti.App.addEventListener('handleurl', resume);

	var flagsetHeightContentIni = true;
	var heighContentIni;
	var widthContentIni;

	var flagClose = false;

	self.addEventListener('postlayout', function (e) {

		if (flagsetHeightContentIni == true) {
			heighContentIni = content.getRect().height;
			widthContentIni = content.getRect().width;
			flagsetHeightContentIni = false;
		}
		var heightContentActual = content.getRect().height;

		if (heightContentActual == heighContentIni) {

		} else {
			scroll1.setBottom('0dp');
		}

	});

	if (Config.isAndroid) {
		self.open();
	} else {
		nav.open();
	}

	self.addEventListener('android:back', function (e) {

		if (openViewMusic == false) {
			e.cancelBubble = true;
			if (clicking == false) {
				clicking = true;
				ripple.round({
					source: leftButton
				});
			}
		}
		else {
			openViewMusic = true;
			for (var j in arrayListRefAudio) {
				arrayListRefAudio[j].stop();
			}
			arrayListRefAudio = [];
			arrayPbRefAudio = [];
			arrayStartPauseButton = [];
			boxBottom.scrollToView(0);
		}


	});


	function hideSoftKeyboard() {
		if (Config.isAndroid) {
			Ti.UI.Android.hideSoftKeyboard();
		} else {
			//comentarioText.blur();
			// myGoalsContainer.name.blur();
			// myGoalsContainer.telephone.blur();
		}
	}

}

module.exports = mainApp;