var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');
var push = require('/mods/push');
var NappDrawerModule = require('dk.napp.drawer');

var SideMenu;

var clicking;

var fullW = Ti.Platform.displayCaps.getPlatformWidth();
if (Config.isAndroid) {
	fullW = fullW / Ti.Platform.displayCaps.getLogicalDensityFactor();
}
var fullWdp = fullW + 'dp';

function Menu(postLogin) {

	clicking = false;
	var drawer;

	var view;

	var close = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : [L('Menu_dialog1Ok'), L('Menu_dialog1Cancelar')],
		message : L('Menu_dialog1Message'),
		title : L('Menu_dialog1Title')
	});
	close.addEventListener('click', function(e) {
		if (e.index == 0) {
			drawer.close();
		}
	});

	function construct() {

		SideMenu = require('/ui/p_propietario/SideMenu');
		SideMenu = new SideMenu();

		SideMenu.addEventListener('click', function(e) {

			if ('id' in e.source) {
				Ti.API.info('e.source.index:', e.source.index);
				switch(e.source.index) {

				case 0:
					if (e.source.callback == undefined) {
						e.source.callback = function(e) {
							openTracing();
							drawer.toggleLeftWindow();
						};
						e.source.finish = function(e) {
							clicking = false;
						};
					}
					if (clicking == false) {
						clicking = true;
						ripple.effect(e);
					}
					break;
				case 10:
					if (e.source.callback == undefined) {
						e.source.callback = function(e) {
							openEditarPerfil();
							drawer.toggleLeftWindow();
						};
						e.source.finish = function(e) {
							clicking = false;
						};
					}
					if (clicking == false) {
						clicking = true;
						ripple.effect(e);
					}
					break;
				case 9:
					if (e.source.callback == undefined) {
						e.source.callback = function(e) {
							openAreasComunes();
							drawer.toggleLeftWindow();
						};
						e.source.finish = function(e) {
							clicking = false;
						};
					}
					if (clicking == false) {
						clicking = true;
						ripple.effect(e);
					}
					break;
				case 11:

					if (e.source.callback == undefined) {
						e.source.callback = function(e) {
							cerrarSesion();
						};
						e.source.finish = function(e) {
							clicking = false;
						};
					}
					if (clicking == false) {

						ripple.effect(e);
					}
					break;
				case 2:

					if (e.source.callback == undefined) {
						e.source.callback = function(e) {
							openEventos();
						};
						e.source.finish = function(e) {
							clicking = false;
						};
					}
					if (clicking == false) {

						ripple.effect(e);
					}
					break;

				case 12:
					if (e.source.callback == undefined) {
						e.source.callback = function(e) {
							//drawer.toggleLeftWindow();
							volverMenu();
							clicking = false;
						};
						e.source.finish = function(e) {
							clicking = false;
						};
					}
					if (clicking == false) {
						clicking = true;
						ripple.effect(e);
						clicking = false;

					}
					break;
				}
			}
		});

		if (Config.isAndroid) {

			view = Ti.UI.createView({
				backgroundColor : Config.backgroundColor,
				height : Ti.UI.FILL,
				width : Ti.UI.FILL,
				backgroundTopCap : '20dp'
			});
			drawer = NappDrawerModule.createDrawer({
				navBarHidden : true,
				exitOnClose : true,
				fullscreen : false,
				windowSoftInputMode : Config.softInput,
				backgroundColor: Config.sidemenuBackgroundColor,
				leftWindow : SideMenu,
				centerWindow : view,
				fading : 0.0,
				parallaxAmount : 0.2,
				shadowWidth : '0dp',
				leftDrawerWidth : (fullW * 0.8)+ 'dp',
				rightDrawerWidth : Ti.UI.FILL,
				rightDrawerHeight : Ti.UI.FILL,
				animationMode : NappDrawerModule.ANIMATION_NONE,
				closeDrawerGestureMode : NappDrawerModule.CLOSE_MODE_MARGIN,
				openDrawerGestureMode : NappDrawerModule.OPEN_MODE_MARGIN,
				orientationModes : Config.orientation
			});

			push.register();

		} else {

			view = Ti.UI.createWindow({
				navBarHidden : false,
				exitOnClose : true,
				windowSoftInputMode : Config.softInput,
				backgroundColor : Config.backgroundColor,
				orientationModes : Config.orientation,
				top : '20dp'
			});

			drawer = NappDrawerModule.createDrawer({
				navBarHidden : false,
				exitOnClose : true,
				fullscreen : false,
				windowSoftInputMode : Config.softInput,
				leftWindow : SideMenu,
				centerWindow : view,
				fading : 0.0,
				parallaxAmount : 0.2,
				shadowWidth : '0dp',
				leftDrawerWidth : fullWdp,
				rightDrawerWidth : fullWdp,
				animationMode : NappDrawerModule.ANIMATION_NONE,
				closeDrawerGestureMode : NappDrawerModule.CLOSE_MODE_ALL,
				openDrawerGestureMode : NappDrawerModule.OPEN_MODE_NONE,
				orientationModes : Config.orientation
			});

		}

		drawer.addEventListener('open', function(e) {
			openHome();
			if (!Config.isAndroid) {
				Ti.UI.iOS.setAppBadge(0);
			}
		});

		drawer.open();
		if (postLogin != null)
			postLogin();

	}

	function openSwitchProject() {

		//if (Config.drawer.reload == null || typeof Config.drawer.reload == 'undefined' || Config.drawer.reload == '')
		//Config.drawer.reload = reload;
		clicking = false;
		var Window = require('/ui/SwitchProject');
		new Window(drawer.nav, reload);
	}

	function openTracing() {
		clicking = false;
		var Window = require('/ui/p_propietario/Tracing');
		new Window(drawer.nav);
	}

	function openPlanning() {
		clicking = false;
		var Window = require('/ui/p_propietario/Planning');
		new Window(drawer.nav);
	}

	function openEditarPerfil() {
		clicking = false;
		var Window = require('/ui/firstLogin');
		new Window(drawer.nav, 1, reload);
	}

	function openAreasComunes() {
		clicking = false;
		var Window = require('/ui/p_propietario/areas_comunes/acHome');
		new Window(drawer.nav, 1, reload, null);
	}

	function openEventos() {
		clicking = false;
		var dialog = Ti.UI.createAlertDialog({
			title: 'Menú no disponible',
			message: 'Aun se encuentra en desarrollo, muy pronto estará disponible!',
			ok: 'Ok'
		});
		dialog.show();
		// var Window = require('/ui/p_propietario/eventos');
		// new Window(drawer.nav);
	}

	function openPrevention() {
		clicking = false;
		var Window = require('/ui/Options');
		new Window(drawer.nav);
	}

	function openQuality() {
		clicking = false;
		var Window = require('/ui/Options');
		new Window(drawer.nav);
	}

	function cerrarSesion() {

		var close = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : [L('Menu_dialog2Ok'), L('Menu_dialog2Cancelar')],
			message : L('Menu_dialog2Message'),
			title : L('Menu_dialog2Title')
		});
		close.addEventListener('click', function(e) {
			if (e.index == 0) {

				if (Config.isAndroid) {
					var params = {
						token : Ti.App.Properties.getString('me', null),
						fhora_entrada : Ti.App.Properties.getString('fhora_entrada', null),
						fhora_salida : fechaHoy()
					};

					//xhr.marcarHora(successful, params);
					successful();
					//var activity = Titanium.Android.currentActivity;
					//activity.finish();

				} else {
					Config.drawer.close();
					drawer.nav.close();
					var Window = require('/ui/Login');
					new Window();
					drawer.close();
				}
			}

		});
		close.show();
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


	function successful() {
		
			Ti.App.Properties.removeAllProperties();
			drawer.close();
			Config.drawer.close();


	}

	function openHome() {
		clicking = false;
		var Window = require('/ui/p_propietario/Home');
		new Window(drawer);
	}

	function tryGetGeneralTables(json) {

		if (json == false) {
		} else {
			switch(json.status.code) {
			case '200':
				db.dropGENERAL();
				for (index in json.response.data) {
					var generalData = json.response.data[index];
					db.insertGENERAL(generalData);
				}
				break;
			}
		}

	}

	construct();

	function volverMenu() {
		if (drawer.isLeftWindowOpen()) {
			drawer.toggleLeftWindow();

		}
		if (drawer.isRightWindowOpen()) {
			drawer.toggleRightWindow();
		}
		clicking = false;

	}


	drawer.addEventListener('android:back', function(e) {
		e.cancelBubble = true;
		if (clicking == false) {
			if (drawer.isAnyWindowOpen()) {
				if (drawer.isLeftWindowOpen()) {
					drawer.toggleLeftWindow();
				}
				if (drawer.isRightWindowOpen()) {
					drawer.toggleRightWindow();
				}
			} else {
				close.show();
			}
			clicking = false;
		}
	});

	function reload() {
		/*
		if (Config.isAndroid) {
		Config.drawer.close();

		} else {
		Config.drawer.close();
		drawer.nav.close();
		}
		*/
		//SideMenu.reloadHead();
		Config.reloadHead();
		/*
		 construct();

		 var aux = Config.drawer;

		 Config.drawer = drawer;
		 Config.drawer.reload = reload;

		 if (Config.isAndroid) {
		 aux.close();
		 }*/

	}


	Config.drawer = drawer;
	Config.drawer.reload = reload;

}

module.exports = Menu;
