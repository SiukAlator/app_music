var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');
var xhr = require('/mods/xhr');
//var db = require('/mods/db');

function mainApp() {


	var clicking = false;

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

	var allDataResultSearch = [];
	var arrayListRefAudio = [];
	var arrayPbRefAudio = [];
	var arrayStartPauseButton = [];
	var openViewMusic = false;
	var idAlbum = '';
	var flagFromLastSong = false;

	var listMusic;
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
		indexNum: 0,
		top: '0dp',
		bottom: '10dp',
		layout: 'vertical',
		showVerticalScrollIndicator: true,
		backgroundColor: 'transparent',
		// backgroundColor: Config.red,
		separatorStyle: Titanium.UI.TABLE_VIEW_SEPARATOR_STYLE_NONE
	});

	tvListMusic.addEventListener("scroll", function (e) {


		if (Config.isAndroid) {
			var firstVisibleItemIndex = e.firstVisibleItem;
			var totalItems = e.totalItemCount;
			var visibleItemCount = e.visibleItemCount;

			if (clicking == false && parseInt(tvListMusic.indexNum) != allDataResultSearch.length && ((firstVisibleItemIndex + visibleItemCount) >= (totalItems * 0.75)))
				reloadMoreData();
		}
	});

	var openMusic = Ti.UI.createView({
		// backgroundColor: Config.red,
		top: '0dp',
		layout: 'vertical',
		height: Ti.UI.FILL,
		width: Ti.UI.FILL,

	});

	var viewLastSong = Ti.UI.createScrollView({
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
			boxBottom.scrollToView(0);

		});

		var myLoginIndicator = Ti.UI.createActivityIndicator({
			style: Config.isAndroid ? Ti.UI.ActivityIndicatorStyle.BIG_DARK : Ti.UI.ActivityIndicatorStyle.BIG,
			height: '120dp',
			width: '120dp'
		});

		var boxSearch = Ti.UI.createView({
			borderColor: Config.white,
			borderRadius: Config.bigborderRadius,
			backgroundColor: Config.colorWallpaper1,
			borderWidth: '1dp',
			top: '10dp',
			height: '50dp',
			left: '20dp',
			width: '280dp',
			bubbleParent: false
		});

		var iconList = Ti.UI.createImageView({
			image: '/images/192_list.png',
			height: '30dp',
			width: '30dp',
			right: '20dp',
			top: '20dp',
			backgroundSelectedColor: Config.whiteEffect
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
			top: '0dp',
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
			boxBottom.scrollToView(0);
		});

		iconList.addEventListener('click', function (e) {
			silenceAll();
			setLastSong();
			boxBottom.scrollToView(2);
		});

		boxSearch.add(inputSearch);
		boxSearch.add(iconSearch);
		boxTop.add(boxSearch);
		boxTop.add(iconList);






		scroll1.add(boxTop);
		boxBottom = Ti.UI.createScrollableView({
			top: '0dp',
			cacheSize: 21,
			height: Ti.UI.FILL,
			showPagingControl: false,
			scrollingEnabled: false,
			views: [tvListMusic, openMusic, viewLastSong],
		});

		scroll1.add(boxBottom);
		setLastSong();


		//TODO
		if (Config.modeURL == 0)
			content.add(boxDesa);
		content.add(scroll1);

		work.push(mask1);
		work.push(myLoginIndicator);
		content.add(mask1);
		content.add(myLoginIndicator);
		boxBottom.scrollToView(2);
		self.add(content);

	}

	function setLastSong() {
		viewLastSong.removeAllChildren();
		var dataLastSong = db.selectLASTSONG();
		Ti.API.info('dataLastSong:', dataLastSong);
		if (dataLastSong == null || dataLastSong.length == 0) {
			Ti.API.info('ECHO 0');
			var labelBienvenida1 = Ti.UI.createLabel({
				font: {
					fontSize: '32dp',
					fontWeight: 'bold'
				},
				color: Config.white,
				touchEnabled: false,
				top: '100dp',
				text: 'Bienvenido!\n'
			});
			var labelBienvenida2 = Ti.UI.createLabel({
				font: {
					fontSize: '18dp',
					fontWeight: 'bold'
				},
				color: Config.white,
				top: '20dp',
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				touchEnabled: false,
				text: 'Favor ingresa el artista o canción\nque deseas escuchar'
			});
			viewLastSong.add(labelBienvenida1);
			viewLastSong.add(labelBienvenida2);

		}
		else {
			var labelUB = Ti.UI.createLabel({
				font: {
					fontSize: '16dp'
				},
				color: Config.white,
				top: '20dp',
				left: '20dp',
				touchEnabled: false,
				text: 'Últimas busquedas...'
			});

			viewLastSong.add(labelUB);
			// return true;

			for (var i in dataLastSong) {
				Ti.API.info('result:', dataLastSong[i].values);
				var rowBoxOrange = Ti.UI.createView({
					backgroundColor: Config.colorPrimario2,
					height: Config.heightRowBoxOrange,
					width: '4dp',
					rippleColor: Config.white,
					touchEnabled: false,
					left: '0dp'
				});

				var contentDepto = Ti.UI.createView({
					width: Ti.UI.FILL,
					height: '70dp',
					touchEnabled: true,
					ind: i,
					data: dataLastSong[i].values,
					id: dataLastSong[i].values.trackId,
					backgroundSelectedColor: Config.whiteEffect
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
					text: dataLastSong[i].values.artistName + ' - ' + dataLastSong[i].values.trackName
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
						setViewMusic(e.source.data);
						flagFromLastSong = true;

						clicking = false;
					}
				});


				contentDepto.add(rowBoxOrange);
				contentDepto.add(labelDepto);
				contentDepto.add(separatorDepto);
				contentDepto.add(rowImage);
				viewLastSong.add(contentDepto);


			}
		}

	}

	function callApi(textSearch) {
		Ti.API.info('textSearch:', textSearch);
		var params = {
			text: textSearch
		};
		xhr.apiItunnes(setListMusic, params);
	}

	function reloadMoreData() {
		var rows = tvListMusic.data;
		
		for (var w in work) {
			work[w].show();
		}
		clicking = true;
		var countBreak = 1;
		for (var i = tvListMusic.indexNum; i < allDataResultSearch.length; i++) {
			Ti.API.info('result:', allDataResultSearch[i].trackId);
			if (countBreak == 20)
				break;
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
				data: allDataResultSearch[i],
				id: allDataResultSearch[i].trackId,
				backgroundSelectedColor: Config.whiteEffect,
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
				text: allDataResultSearch[i].artistName + ' - ' + allDataResultSearch[i].trackName
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
					db.insertLASTSONG(e.source.data);
					setViewMusic(e.source.data);
					clicking = false;
				}
			});

			contentDepto.add(rowBoxOrange);
			contentDepto.add(labelDepto);
			contentDepto.add(separatorDepto);
			contentDepto.add(rowImage);
			rows.push(contentDepto);
			tvListMusic.indexNum = i + 1;
			countBreak ++;
			//i++;

		}
		tvListMusic.data = rows;
		setTimeout(function(){
			for (var w in work) {
				work[w].hide();
			}
			clicking = false;
		}, 1000);
		
	}

	function setListMusic(data) {


		allDataResultSearch = [];
		var rows = [];
		tvListMusic.removeAllChildren();
		if (data == false) {
			var dialog = Ti.UI.createAlertDialog({
				title: L('login_dialog1Title'),
				message: L('login_dialog1Message'),
				ok: L('login_dialog5Ok')
			});
			dialog.show();
		}
		else if (data.resultCount == 0) {
			tvListMusic.setHeight('0dp');
			var dialog = Ti.UI.createAlertDialog({
				title: 'App Music',
				message: 'No se encontraron resultados en su busqueda, intente nuevamente.',
				ok: L('login_dialog5Ok')
			});
			dialog.show();
		}
		else {
			tvListMusic.setHeight(Ti.UI.FILL);
			allDataResultSearch = data.results;
			Ti.API.info('count result:', allDataResultSearch.length);
			var countBreak = 1;
			for (var i = tvListMusic.indexNum; i < allDataResultSearch.length; i++) {
				if (countBreak == 20)
					break;
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
					data: allDataResultSearch[i],
					id: allDataResultSearch[i].trackId,
					backgroundSelectedColor: Config.whiteEffect,
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
					text: allDataResultSearch[i].artistName + ' - ' + allDataResultSearch[i].trackName
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
						db.insertLASTSONG(e.source.data);
						setViewMusic(e.source.data);
						openViewMusic = true;
						clicking = false;
					}
				});

				contentDepto.add(rowBoxOrange);
				contentDepto.add(labelDepto);
				contentDepto.add(separatorDepto);
				contentDepto.add(rowImage);
				rows.push(contentDepto);
				tvListMusic.indexNum = i + 1;
				countBreak ++;

			}
			tvListMusic.data = rows;
		}
		for (var w in work) {
			work[w].hide();
		}

	}

	function setViewMusic(data) {
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

	}

	function loadBanda(dataIn) {
		/**Se filtran solo los tracks que correspondan a idAlbum */
		if (dataIn == false)
		{
			for (var w in work) {
				work[w].hide();
			}

			var dialog = Ti.UI.createAlertDialog({
				title: L('login_dialog1Title'),
				message: L('login_dialog1Message'),
				ok: L('login_dialog1Ok')
			});
			dialog.show();
			return true;
			// openViewMusic = false;
			// silenceAll();
			// if (flagFromLastSong == true) {
			// 	flagFromLastSong = false;
			// 	boxBottom.scrollToView(2);
			// }
			// else
			// 	boxBottom.scrollToView(0);

		}
		var data = dataIn.results;
		var totalDurationFromBackend = 30;
		var countId = 0;
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
					id: countId
				});

				var audioPlayer = Titanium.Media.createAudioPlayer({
					url: data[i].previewUrl,
					preload: true,
					id: countId
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
				if (countId == 0) {
					audioPlayer.play();
				}
				else {
					startPauseButton.image = '/images/icon_play.png';
				}
				countId++;
				listMusic.add(contentMusic);

			}
		}
		for (var w in work) {
			work[w].hide();
		}
		openViewMusic = true;

		boxBottom.scrollToView(1);
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

	construct();


	var flagsetHeightContentIni = true;
	var heighContentIni;

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
			if (clicking == false) {
				Ti.API.info('ECHO!!!!');
				self.close();

			}
		}
		else {
			openViewMusic = false;
			silenceAll();
			if (flagFromLastSong == true) {
				flagFromLastSong = false;
				boxBottom.scrollToView(2);
			}
			else
				boxBottom.scrollToView(0);
		}


	});

	function silenceAll() {
		for (var j in arrayListRefAudio) {
			arrayListRefAudio[j].stop();
		}
		arrayListRefAudio = [];
		arrayPbRefAudio = [];
		arrayStartPauseButton = [];
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

}

module.exports = mainApp;