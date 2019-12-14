var Config = require('/libs/Config');
var core = require('firebase.core');
core.configure({
	file: "google-services.json"
});
var fcm = require('firebase.cloudmessaging');

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
		xhr.setRequestHeader('ubqti_api_version', Config.ubqti_api_version);
		xhr.setRequestHeader('ubqti_api_token', Ti.App.Properties.getString('me', null));
		xhr.send({
			device_type: Config.device_type,
			device_id: token
		});
	}

	function androidClick(data) {

		Ti.API.log(JSON.stringify(data));

	}

	function iosBack(data) {

		Ti.API.log(JSON.stringify(data));

	}

	function iosFront(data) {

		Ti.API.log(JSON.stringify(data));

	}

	if (Config.isAndroid) {

		// Config.TiGoosh.registerForPushNotifications({

		// 	callback: function (e) {
		// 		Ti.API.info("[TiPush]:", JSON.stringify(e));
		// 		var data = JSON.parse(e.data || '');
		// 		if (e.inBackground) {
		// 			androidClick(data);
		// 		} else {
		// 			Ti.API.log(JSON.stringify(e));
		// 		}
		// 	},
		// 	success: function (e) {
		// 		Ti.API.info('[TiPush] TOKEN:', e.deviceToken);
		// 		//sendToken(e.deviceToken);
		// 	},
		// 	error: function (err) {
		// 		Ti.API.debug('[TiPush] ERROR:', err);
		// 	}
		// });


		// Called when the Firebase token is registered or refreshed.
		fcm.addEventListener('didRefreshRegistrationToken', function (e) {
			Ti.API.info('Token', e.fcmToken);
			Ti.App.Properties.setString('push_token', e.fcmToken);
		}); // Called when direct messages arrive. Note that these are different from push notifications.
		fcm.addEventListener('didReceiveMessage', function (e) {
			Ti.API.info('Message', e.message);
		}); // Register the device with the FCM service.
		fcm.registerForPushNotifications(); // Check if token is already available.
		if (fcm.fcmToken) {
			Ti.API.info('FCM-Token', fcm.fcmToken);
			Ti.App.Properties.setString('push_token', fcm.fcmToken);
		} else {
			Ti.API.info('Token is empty. Waiting for the token callback ...');
		}


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
					Ti.API.debug("[TiPush]:", JSON.stringify(e));
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
