var Config = require('/libs/Config');
var Permissions = require('/libs/Permissions');
var db = require('/mods/db');
var xhr = require('/mods/xhr');

db.checkDB();

if (Config.isAndroid)
	Config.intentData = Ti.Android.currentActivity.intent.data;
else
	Config.intentData = Ti.App.getArguments().url;


(function () {
	var nav;
	var win = Ti.UI.createWindow({
		navBarHidden: true,
		exitOnClose: false,
		windowSoftInputMode: Config.softInput,
		backgroundColor: Config.sidemenuBackgroundColor,
		orientationModes: Config.orientation
	});

	var work = Ti.UI.createView({
		overrideCurrentAnimation: true,
		backgroundColor: Config.overMask,
		borderRadius: '10dp',
		height: '160dp',
		width: '160dp'
	});

	var indicator = Ti.UI.createActivityIndicator({
		style: Config.isAndroid ? Ti.UI.ActivityIndicatorStyle.BIG_DARK : Ti.UI.ActivityIndicatorStyle.DARK,
		height: '120dp',
		width: '120dp'
	});
	indicator.show();

	work.add(indicator);
	work.hide();

	win.add(work);

	if (Config.isAndroid)
		win.exitOnClose = true;

	function blur() {
		if (Config.mode == 0) {
			Ti.API.error('win.blur');
		}
		win.focus = false;
	}

	function focus() {
		if (Config.mode == 0) {
			Ti.API.error('win.focus');
		}
		win.focus = true;
	}

	function gotPermissions() {
		if (Config.mode == 0) {
			Ti.API.error('gotPermissions');
		}
		win.removeEventListener('blur', blur);
		win.removeEventListener('focus', focus);

		if (Config.isAndroid) {
			Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;

		}
		else {
			Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
			nav = Ti.UI.iOS.createNavigationWindow({
				window: win
			});

		}

		if (Config.isAndroid) {
			// if (Ti.App.Properties.getObject('app_version_2', null) != null) {
			// 	validate(true);
			// } else {
			work.show();
			startApp();
			// xhr.app_version(validate);
			//}
		}
		//else

	}

	function validate(status) {

		work.hide();

		if (status) {

			var mobileSetting = Ti.App.Properties.getObject('app_version_2', null).mobile;

			if (mobileSetting['validate']) {

				if (mobileSetting['mandatory']) {

					if (Config.androidCode < mobileSetting['version']) {

						var msg = 'Para continuar debe actualizar la aplicación.';
						versionDialog(msg, true, mobileSetting['store_url']);

					}
					// else {

					// 	startApp();

					// }

				} else {

					if (Config.androidCode < mobileSetting['version']) {

						var msg = 'Hay una nueva version disponible de la aplicación';
						versionDialog(msg, false, mobileSetting['store_url']);

					}
					// else {

					// 	startApp();

					// }

				}

			}
			// else {

			// 	startApp();

			// }

		}
		// else {
		// 	startApp();
		// var exit = Ti.UI.createAlertDialog({
		// 	buttonNames: ['Salir'],
		// 	message: 'Por favor revise su conexión a internet y vuelva a intentarlo.',
		// 	title: 'Error en la descarga de datos'
		// });

		// exit.addEventListener('click', function (e) {
		// 	win.close();
		// });

		// exit.show();

		// }

	}

	function versionDialog(txtDialog, isMandatory, storeUrl) {

		switch (isMandatory) {
			case true:
				var buttons = ['Actualizar App'];
				closeApp = true;
				break;
			case false:
				var buttons = ['Actualizar App', 'Cancelar'];
				closeApp = false;
				break;
		}

		var dialog = Ti.UI.createAlertDialog({
			cancel: 1,
			buttonNames: buttons,
			message: txtDialog,
			title: 'Atención'
		});

		dialog.addEventListener('click', function (e) {
			if (e.cancel) {

				if (isMandatory == false) {
					startApp();
				}

				if (isMandatory && closeApp) {
					win.close();
				}

				if (isMandatory && closeApp == false) {
					startApp();
				}

				return;

			} else {

				Ti.Platform.openURL(storeUrl);
				win.close();

			}
		});

		dialog.show();
	}

	function startApp() {


		var Window = require('/ui/mainApp');
		//var Window = require('/ui/firstLogin');
		new Window();
		if (Config.isAndroid) {
			//Config.tracker.endSession();
			////Config.ga.dispatch();
			win.close();
		} else {
			//Config.tracker.endSession();
			////Config.ga.dispatch();
			win.close();
			nav.close();
		}


	}


	win.addEventListener('blur', blur);

	win.addEventListener('focus', focus);

	win.addEventListener('open', function (e) {
		//gotPermissions();
		if (Ti.Media.hasCameraPermissions() == true || !Config.isAndroid) {
			gotPermissions();
		} else {
			Permissions.getAll(win, gotPermissions);
		}

	});

	win.open();

})();
