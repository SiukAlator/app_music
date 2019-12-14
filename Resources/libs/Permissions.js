var Config = require('/libs/Config');

function Permissions() {
}

Permissions.mediaOpen = false;
Permissions.contactOpen = false;

Permissions.getAll = function(win, callback) {
	//Ti.API.info('inWhere:', inWhere);
	var permisoCamara = Ti.Media.hasCameraPermissions();
	if (permisoCamara == true) {

		callback();

	} else {

		var timer = setInterval(function() {

			if ((Config.isAndroid && win.focus) || !Config.isAndroid) {

				if (Permissions.mediaOpen == false) {

					if (Ti.Media.hasCameraPermissions() == false) {
						if (Config.mode == 0) {
							Ti.API.info('Permissions.requestMedia');
						}
						Permissions.mediaOpen = true;
						Permissions.media(win);
					}

				}

			} else {
				if (Config.mode == 0) {
					Ti.API.info('win.nofocus');
				}
			}
			if (Ti.Media.hasCameraPermissions() == true) {
				callback();
				clearInterval(timer);
			}
		}, 1000);

	}

};

Permissions.getAllClases = function(callback) {

	var permisoCamara = Ti.Media.hasCameraPermissions();
	if (permisoCamara == true) {

		callback();

	} else {

		//var timer = setInterval(function() {

			if (!Config.isAndroid) {

				if (Permissions.mediaOpen == false) {
					if (Ti.Media.hasCameraPermissions() == false) {
						if (Config.mode == 0) {
							Ti.API.info('Permissions.requestMedia');
						}
						Permissions.mediaOpen = true;
						Permissions.mediaClases();
					}
				}

			}
			if (Ti.Media.hasCameraPermissions() == true) {
				callback();
				//clearInterval(timer);
			}
		//}, 1000);

	}

};

Permissions.editPermissions = function(win) {

	Permissions.mediaOpen = false;
//	Permissions.contactOpen = false;

	if (!Config.isAndroid) {
		Ti.Platform.openURL(Ti.App.iOS.applicationOpenSettingsURL);
	}

	if (Config.isAndroid) {

		var intent = Ti.Android.createIntent({
			action : 'android.settings.APPLICATION_SETTINGS',
		});

		intent.addFlags(Ti.Android.FLAG_ACTIVITY_NEW_TASK);

		Ti.Android.currentActivity.startActivity(intent);

	}

};

Permissions.editPermissionsClases = function() {

	Permissions.mediaOpen = false;
//	Permissions.contactOpen = false;

	if (!Config.isAndroid) {
		Ti.Platform.openURL(Ti.App.iOS.applicationOpenSettingsURL);
	}

	if (Config.isAndroid) {

		var intent = Ti.Android.createIntent({
			action : 'android.settings.APPLICATION_SETTINGS',
		});

		intent.addFlags(Ti.Android.FLAG_ACTIVITY_NEW_TASK);

		Ti.Android.currentActivity.startActivity(intent);

	}

};

Permissions.mediaClases = function() {

	var hasCameraPermissions = Ti.Media.hasCameraPermissions();
	if (Config.mode == 0) {
		Ti.API.info('Ti.Media.hasCameraPermissions: ' + hasCameraPermissions);
	}

	if (hasCameraPermissions) {
		Permissions.mediaOpen = false;
		return true;
	}

	if (!Config.isAndroid) {

		var map = {};
		map[Ti.Media.CAMERA_AUTHORIZATION_AUTHORIZED] = 'CAMERA_AUTHORIZATION_AUTHORIZED';
		map[Ti.Media.CAMERA_AUTHORIZATION_DENIED] = 'CAMERA_AUTHORIZATION_DENIED';
		map[Ti.Media.CAMERA_AUTHORIZATION_RESTRICTED] = 'CAMERA_AUTHORIZATION_RESTRICTED';
		map[Ti.Media.CAMERA_AUTHORIZATION_NOT_DETERMINED] = 'CAMERA_AUTHORIZATION_NOT_DETERMINED';

		var cameraAuthorizationStatus = Ti.Media.cameraAuthorizationStatus;
		if (Config.mode == 0) {
			Ti.API.info('Ti.Media.cameraAuthorizationStatus: ' + 'Ti.Media.' + map[cameraAuthorizationStatus]);
		}

		if (cameraAuthorizationStatus === Ti.Media.CAMERA_AUTHORIZATION_RESTRICTED) {
			return alert('Because permission are restricted by some policy which you as user cannot change, we don\'t request as that might also cause issues.');

		} else if (cameraAuthorizationStatus === Ti.Media.CAMERA_AUTHORIZATION_DENIED) {

			var dialog = Ti.UI.createAlertDialog({
				title : 'Permisos no otorgados',
				message : 'No autorizaste los permisos para usar la cámara, si los desactivaste de forma permanente los puedes activar a continuación',
				buttonNames : ['Cambiar', 'Cancelar'],
				cancel : 1
			});

			dialog.addEventListener('click', function(e) {
				if (e.index === e.source.cancel) {
					Permissions.mediaOpen = false;
				} else {
					Permissions.editPermissionsClases();
				}
			});

			dialog.show();

		}

	}

	Ti.Media.requestCameraPermissions(function(e) {
		if (Config.mode == 0) {
			Ti.API.info('Ti.Media.requestCameraPermissions: ' + JSON.stringify(e));
		}

		if (e.success) {

			Permissions.mediaOpen = false;
			return true;

		} else if (Config.isAndroid) {

			var dialog = Ti.UI.createAlertDialog({
				title : 'Permisos no otorgados',
				message : 'No autorizaste los permisos para usar la cámara, si los desactivaste de forma permanente los puedes activar en: Settings -> Apps -> HRapp -> Permissions',
				buttonNames : ['Cambiar', 'Cancelar'],
				cancel : 1
			});

			dialog.addEventListener('click', function(e) {
				if (e.index === e.source.cancel) {
					Permissions.mediaOpen = false;
				} else {
					Permissions.editPermissionsClases();
				}
			});

			dialog.show();

		} else {

			var dialog = Ti.UI.createAlertDialog({
				title : 'Permisos no otorgados.',
				message : e.error,
				ok : 'OK'
			});

			dialog.addEventListener('click', function(e) {
				Permissions.mediaOpen = false;
				return false;
			});

			dialog.show();

		}
	});
};

Permissions.media = function(win) {

	var hasCameraPermissions = Ti.Media.hasCameraPermissions();
	if (Config.mode == 0) {
		Ti.API.info('Ti.Media.hasCameraPermissions: ' + hasCameraPermissions);
	}

	if (hasCameraPermissions) {
		Permissions.mediaOpen = false;
		return true;
	}

	if (!Config.isAndroid) {

		var map = {};
		map[Ti.Media.CAMERA_AUTHORIZATION_AUTHORIZED] = 'CAMERA_AUTHORIZATION_AUTHORIZED';
		map[Ti.Media.CAMERA_AUTHORIZATION_DENIED] = 'CAMERA_AUTHORIZATION_DENIED';
		map[Ti.Media.CAMERA_AUTHORIZATION_RESTRICTED] = 'CAMERA_AUTHORIZATION_RESTRICTED';
		map[Ti.Media.CAMERA_AUTHORIZATION_NOT_DETERMINED] = 'CAMERA_AUTHORIZATION_NOT_DETERMINED';

		var cameraAuthorizationStatus = Ti.Media.cameraAuthorizationStatus;
		if (Config.mode == 0) {
			Ti.API.info('Ti.Media.cameraAuthorizationStatus: ' + 'Ti.Media.' + map[cameraAuthorizationStatus]);
		}

		if (cameraAuthorizationStatus === Ti.Media.CAMERA_AUTHORIZATION_RESTRICTED) {
			return alert('Because permission are restricted by some policy which you as user cannot change, we don\'t request as that might also cause issues.');

		} else if (cameraAuthorizationStatus === Ti.Media.CAMERA_AUTHORIZATION_DENIED) {

			var dialog = Ti.UI.createAlertDialog({
				title : 'Permisos no otorgados',
				message : 'No autorizaste los permisos para usar la cámara, si los desactivaste de forma permanente los puedes activar a continuación',
				buttonNames : ['Cambiar', 'Cancelar'],
				cancel : 1
			});

			dialog.addEventListener('click', function(e) {
				if (e.index === e.source.cancel) {
					Permissions.mediaOpen = false;
				} else {
					Permissions.editPermissions(win);
				}
			});

			dialog.show();

		}

	}

	Ti.Media.requestCameraPermissions(function(e) {
		if (Config.mode == 0) {
			Ti.API.info('Ti.Media.requestCameraPermissions: ' + JSON.stringify(e));
		}

		if (e.success) {

			Permissions.mediaOpen = false;
			return true;

		} else if (Config.isAndroid) {

			var dialog = Ti.UI.createAlertDialog({
				title : 'Permisos no otorgados',
				message : 'No autorizaste los permisos para usar la cámara, si los desactivaste de forma permanente los puedes activar en: Settings -> Apps -> HRapp -> Permissions',
				buttonNames : ['Cambiar', 'Cancelar'],
				cancel : 1
			});

			dialog.addEventListener('click', function(e) {
				if (e.index === e.source.cancel) {
					Permissions.mediaOpen = false;
				} else {
					Permissions.editPermissions(win);
				}
			});

			dialog.show();

		} else {

			var dialog = Ti.UI.createAlertDialog({
				title : 'Permisos no otorgados.',
				message : e.error,
				ok : 'OK'
			});

			dialog.addEventListener('click', function(e) {
				Permissions.mediaOpen = false;
				return false;
			});

			dialog.show();

		}
	});
};

// Permissions.contacts = function(win) {
// 
	// var hasContactsPermissions = Ti.Contacts.hasContactsPermissions();
	// if (Config.mode == 0) {
		// Ti.API.info('Ti.Contacts.hasContactsPermissions: ' + hasContactsPermissions);
	// }
// 
	// if (hasContactsPermissions) {
		// Permissions.contactOpen = false;
		// return true;
	// }
// 
	// Ti.Contacts.requestContactsPermissions(function(e) {
// 
		// if (e.success) {
// 
			// Permissions.contactOpen = false;
			// return true;
// 
		// } else if (Config.isAndroid) {
// 
			// var dialog = Ti.UI.createAlertDialog({
				// title : 'Permisos no otorgados',
				// message : 'No autorizaste los permisos para leer los contactos del teléfono, si los desactivaste de forma permanente los puedes activar en: Settings -> Apps -> HRapp -> Permissions',
				// buttonNames : ['Cambiar', 'Cancelar'],
				// cancel : 1
			// });
// 
			// dialog.addEventListener('click', function(e) {
				// if (e.index === e.source.cancel) {
					// Permissions.contactOpen = false;
				// } else {
					// Permissions.editPermissions(win);
				// }
			// });
// 
			// dialog.show();
// 
		// } else {
// 
			// var dialog = Ti.UI.createAlertDialog({
				// title : 'Permisos no otorgados.',
				// message : e.error,
				// ok : 'OK'
			// });
// 
			// dialog.addEventListener('click', function(e) {
				// Permissions.contactOpen = false;
				// return false;
			// });
// 
			// dialog.show();
// 
		// }
	// });
// };

module.exports = Permissions;
