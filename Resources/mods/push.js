var Config = require('/libs/Config');

function push() {
}

push.register = function (e) {

	function sendToken(token) {


		var xhr = Ti.Network.createHTTPClient({
			onload: function () {
				Ti.API.error("[TiPush] Token sent to our backend");
			},
			onerror: function () {
				Ti.API.error("[TiPush] Can't send tokend to our backend");
			},
			timeout: 20000
		});
		xhr.open('POST', Config.SERVER_BASE_URL + 'push_subscribe');
		xhr.setRequestHeader('Api_version', Config.api_version);
		xhr.setRequestHeader('Token', Ti.App.Properties.getString('me', null));
		xhr.send({
			device_type: Config.device_type,
			id_push: token
		});
	}

	function androidClick(data) {
		// Ti.API.info('ECHOPAJSASJ');
		// Config.drawer.close();
		// var Window = require('/ui/p_propietario/Menu');
		// new Window();
		Ti.API.log(JSON.stringify(data));

	}

	function iosBack(data) {

		Ti.API.log(JSON.stringify(data));

	}

	function iosFront(data) {
		Ti.API.log(JSON.stringify(data));

	}

	if (Config.isAndroid) {

		Config.TiGoosh.registerForPushNotifications({

			callback: function (e) {
				Ti.API.info("[TiPush]: 00", JSON.stringify(e));
				Config.getData();

				var data = JSON.parse(e.data || '');
				if (e.inBackground) {
					androidClick(data);
				} else {
					Ti.API.log(JSON.stringify(e));
				}
			},
			success: function (e) {
				Ti.API.info('[TiPush] TOKEN:', e.deviceToken);
				sendToken(e.deviceToken);
			},
			error: function (err) {
				Ti.API.debug('[TiPush] ERROR:', err);
			}
		});

	} else {

		var pnOptions;

		if (parseInt(Ti.Platform.version.split('.')[0], 10) >= 8) {

			var thumbUpAction = Ti.App.iOS.createUserNotificationAction({
				identifier: 'THUMBUP_IDENTIFIER',
				title: 'Agree',
				activationMode: Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_FOREGROUND,
				destructive: false,
				authenticationRequired: false
			});

			var thumbDownAction = Ti.App.iOS.createUserNotificationAction({
				identifier: 'THUMBDOWN_IDENTIFIER',
				title: 'Disagree',
				activationMode: Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_BACKGROUND,
				destructive: false,
				authenticationRequired: false
			});

			var thumbUpDownCategory = Ti.App.iOS.createUserNotificationCategory({
				identifier: 'THUMBUPDOWN_CATEGORY',
				actionsForDefaultContext: [thumbUpAction, thumbDownAction],
				actionsForMinimalContext: [thumbUpAction, thumbDownAction]
			});

			pnOptions = {
				types: [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE],
				categories: [thumbUpDownCategory]
			};

		} else {

			pnOptions = {
				types: [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
			};

		}

		function registerForPush() {
			Ti.Network.registerForPushNotifications({
				callback: function (e) {
					Ti.API.debug("[TiPush] 11:", JSON.stringify(e));
					Ti.UI.iOS.appBadge = null;
					var data = e.data;
					if (e.inBackground) {
						iosBack(data);
					} else {
						iosFront(data);
					}
				},
				success: function (e) {
					Ti.API.debug('[TiPush] TOKEN:', e.deviceToken);
					sendToken(e.deviceToken);
				},
				error: function (err) {
					Ti.API.debug('[TiPush] ERROR:', err);
				}
			});
			Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);
		}


		Ti.App.iOS.addEventListener('usernotificationsettings', registerForPush);

		Ti.App.iOS.registerUserNotificationSettings({
			types: pnOptions.types,
			categories: pnOptions.categories
		});
	}

};

module.exports = push;
