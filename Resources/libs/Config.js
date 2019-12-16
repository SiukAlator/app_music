function Config() {
};

Config.isAndroid = Ti.Platform.osname == 'android' ? true : false;


Config.drawer = null;

Config.intentData = null;

// 0 = dev ; 1 = prod
Config.mode = 1;
Config.modeURL = 1;


if (Config.isAndroid) {
	Config.device_type = 'android';
	Config.androidCode = Ti.App.Android.getAppVersionCode();
} else {
	Config.device_type = 'ios';
}

//Config.tracker.startSession();
//Agregar mas language en bbdd
var local = Ti.Locale.currentLocale;
//Config.locale = local.substring(0, 2);
Config.locale = 'es';

if (Config.isAndroid) {
	Config.device_type = 'android';
} else {
	Config.device_type = 'ios';
}
Config.ubqti_api_version = '1';

Config.purple = '#781975';
Config.blue = '#0154a0';
Config.red = '#cb3636';
Config.green = '#45ad45';
Config.orange = '#ea8c27';
Config.yellow = '#dbd82e';
Config.darkpurple = '#631a61';
Config.darkblue = "#0A579F";
Config.darkerblue = "#094985";
Config.darkerpurple = '#4e134c';
Config.darkred = '#b91927';
Config.darkgreen = '#2e8f4b';
Config.darkorange = '#c57621';
Config.lightpurple = '#a872a7';

Config.black = '#000000';
Config.almostblack = '#151515';
Config.darkgray = '#292929';
Config.overgray = '#3c3c3c';
Config.somegray = '#444444';
Config.lightgray = '#737373';
Config.hintgray = '#c7c7c7';
Config.somewhite = '#eeeeee';
Config.almostwhite = '#f7f7f7';
Config.white = '#ffffff';
Config.whiteEffect = '#50ffffff';

/*** General ***/
Config.colorWallpaper1 = '#2E415A';
Config.colorWallpaper2 = '#2E415A';
Config.colorBar = '#4F4F4F';
Config.coverMask = '#DD000000';
Config.barTouchFeedback = true;
Config.barRippleColor = Config.red;
Config.barButtonHeight = '40dp';
Config.backgroundColorLogoEmp = '#403F41';
Config.rowFont = {
	fontSize: '16dp'
};

if (Config.isAndroid) {
	Config.barHeight = 60;
} else {
	Config.barHeight = 60;
}
Config.colorDayCurrent = '#419488';
Config.colorLineFina = '#B5B5B5';
Config.blueLow = '#7A93B1';
Config.barHeightW = '56dp';
Config.googleBlue = '#4885ED';
Config.campoTexto = '#413732';
Config.colorPrimario1 = '#2E415A';
Config.colorPrimario2 = '#cc8420';
Config.color1 = '#4E9ED6';
Config.heightRowBoxOrange = '21dp';
Config.rellenoCampoTexto = '#413732';
Config.fondoBoton = '#413732';
Config.heightWidthIconBoton = '26dp';
Config.heightWidthIconAdjunt = '40dp';
Config.backgroundColor = '#365173';
Config.heightAutoComplete = '43dp';
Config.spaceAutoComplete = 40; //Espacio entre resultados. Formato entero
Config.heightSwitchPercentage = '390dp';
Config.colorBackgroundBoton = '#39302d';
Config.marginMenuPrincipal = '20dp';
Config.backgroundColorGoogle = '#589fe2';
Config.tamCheckPartidas100 = "30dp";
Config.widhtPopup = '30dp';
Config.colorGlobo = '#F4A22F';

/*** Tracing ***/
Config.tamCheckCalidad = "25dp";
Config.marginViewSeguimiento = '50dp';

/*** Tracing UC ***/
Config.colorPercentage0 = '#787878';
Config.colorPercentage25 = '#9c3636';
Config.colorPercentage50 = '#c48021';
Config.colorPercentage75 = '#235d93';
Config.colorPercentage100 = '#268b29';

/** Calendario **/
Config.colorLast_name = '#33557F';
Config.color1CO = '#224D87';
Config.color2CO = '#505050';

/*** dashboard p_propietario ***/
Config.colorGraphic1Back = '#FFFFFF';
Config.colorGraphic1Front1 = '#589FE2';
Config.colorGraphic1Front2 = '#226cb2';
Config.colorGraphic2Back = '#5DA95F';
Config.colorGraphic2Front1 = '#268b29';
Config.colorGraphic2Front2 = '#2b512c';
Config.colorBorderGraphic = Config.white;

/*** detalle de partida ***/
Config.cantImagenesMax = 4;
Config.tamImagenAdjunta = 250;
Config.tamContentImagenAbierta = 280;
Config.tamViewContent = Config.tamContentImagenAbierta + 110;
//Formato entero
Config.tamImagenAdjuntaAbierta = 800;
//Formato entero
Config.hashThumbnail = '_thumb';
/*** Nuevo usuario - pantalla formulario***/
Config.marginNewUser = '18dp';
Config.heightContentText = '70dp';
Config.cantImagenesMaxNU = 1;

/*** Planificación ***/
Config.widthRespEmp = '120dp';
Config.heightSeparatorPlanning = '1dp';
Config.fontSizePlanningDeptos = 16;
//Formato entero

/*** Filtros Planficicación ***/
Config.marginViewPlanificacionFiltros = '50dp';

/*** Transparencia oscura ***/
/*
 100% — FF
 95% — F2
 90% — E6
 85% — D9
 80% — CC
 75% — BF
 70% — B3
 65% — A6
 60% — 99
 55% — 8C
 50% — 80
 45% — 73
 40% — 66
 35% — 59
 30% — 4D
 25% — 40
 20% — 33
 15% — 26
 10% — 1A
 5% — 0D
 0% — 00
 *
 */
Config.transparenceBlack = '#4D000000';
Config.transparenceBlack2 = '#8C000000';

Config.orientation = [Ti.UI.PORTRAIT];

Config.containerBackgroundColor = Config.white;
Config.containerTextColor = Config.overgray;

Config.actionbarBackgroundColor = '#493d2f';
Config.titleTextColor = Config.white;
Config.titleButtonColor = Config.almostwhite;
Config.shadowColor = Config.blue;
Config.shadowHeight = '0dp';

Config.sidemenuBackgroundColor = Config.colorWallpaper2;
Config.sidemenuBoxesColor = Config.overgray;
Config.sidemenuTextColor = Config.somewhite;
Config.menuActionbarBackgroundColor = Config.darkgray;
Config.menuActionbarTextColor = Config.white;
Config.menuBackgroundColor = Config.somewhite;
Config.menuTextColor = Config.overgray;
Config.headTitle = {
	fontSize: '16dp',
	fontWeight: 'bold'
};
Config.subtitleFont = {
	fontSize: '16dp',
	fontWeight: 'bold'
};

Config.head1 = {
	fontSize: '22dp',
	fontWeight: 'bold'
};

Config.head2 = {
	fontSize: '34dp',
	fontWeight: 'bold'
};

Config.sizeDesa = {
	fontSize: '10dp',
	fontWeight: 'bold'
};

Config.colorBorder1dp = '#E2E2E2';
Config.subtitleBackgroundColor = Config.blue;
Config.subtitleTextColor = Config.white;
Config.subtitleHeight = '32dp';
Config.subtitleBorderRadius = '16dp';

Config.inputBackgroundColor = Config.white;
Config.inputBackgroundSelectedColor = Config.white;
Config.inputBorderColor = Config.hintgray;
Config.inputHintColor = '#7B94B2';
Config.inputTextColor = Config.overgray;
Config.inputFont = {
	fontSize: '14dp',
	fontWeight: 'bold'
};
Config.inputLabelMargin = Config.isAndroid ? '16dp' : '16dp';
Config.inputTextMargin = Config.isAndroid ? '13dp' : '13dp';
Config.inputPickerMargin = Config.isAndroid ? '8dp' : '8dp';
Config.inputHeight = Config.isAndroid ? '40dp' : '40dp';
Config.inputIconSize = Config.isAndroid ? '24dp' : '24dp';
Config.inputIconMargin = Config.isAndroid ? '8dp' : '8dp';

Config.biginputFont = {
	fontSize: '18dp',
	fontWeight: 'bold'
};
Config.biginputLabelMargin = Config.isAndroid ? '16dp' : '16dp';
Config.biginputTextMargin = Config.isAndroid ? '13dp' : '13dp';
Config.biginputPickerMargin = Config.isAndroid ? '8dp' : '8dp';
Config.biginputHeight = Config.isAndroid ? '48dp' : '48dp';
Config.biginputIconSize = Config.isAndroid ? '32dp' : '32dp';
Config.biginputIconMargin = Config.isAndroid ? '8dp' : '8dp';

Config.biggerinputHeight = Config.isAndroid ? '64dp' : '64dp';
Config.biggerinputFont = {
	fontSize: '20dp',
	fontWeight: 'bold'
};

Config.font24 = {
	fontSize: '24dp',
	fontWeight: 'bold'
};

Config.font28 = {
	fontSize: '28dp',
	fontWeight: 'bold'
};

Config.font32 = {
	fontSize: '32dp',
	fontWeight: 'bold'
};

Config.font36 = {
	fontSize: '36dp',
	fontWeight: 'bold'
};

Config.optionsBackground = Config.somewhite;
Config.optionsSelectedBackground = Config.almostwhite;
Config.optionsSeparatorColor = Config.hintgray;
Config.optionsRowHeight = Config.isAndroid ? '80dp' : '80dp';
Config.optionsTitleColor = Config.overgray;
Config.optionsTitleFont = {
	fontSize: '18dp',
	fontWeight: 'bold'
};
Config.optionsMessageColor = Config.somegray;
Config.optionsMessageFont = {
	fontSize: '12dp'
};

Config.buttonTextColor = Config.white;
Config.accent = Config.blue;
Config.success = Config.green;
Config.darksuccess = Config.darkblue;
Config.warning = Config.yellow;
Config.danger = Config.red;
Config.info = Config.blue;
Config.neutral = Config.somegray;
Config.neutralSelected = Config.lightgray;

Config.bigborderRadius = '10dp';
Config.borderRadius = '8dp';
Config.borderWidth = '3dp';


Config.fileDocs = 'docs';
Config.fileImages = 'images';
Config.fileVideos = 'videos';

Config.mapareaStrokeWidth = Config.isAndroid ? 5 : '2dp';
Config.mapareaStrokeColor = '#0154a0';
Config.mapareaFillColor = '#160154a0';

Config.wallpaperApp = '/images/fondo_leqtus_oscuro.jpg';

Config.AppVersion = Titanium.App.getVersion();
Config.densityScreen = Titanium.Platform.displayCaps.density;




Config.timeOut = 50000;



//Config.DOMAIN_URL= prod;



Config.SERVER_BASE_URL = 'https://itunes.apple.com/';

Config.DATABASE_NAME = 'app_music';


if (Config.isAndroid) {
	//Config.softInput = Ti.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	Config.softInput = Ti.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_RESIZE;
	Config.softInputTracing = Ti.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_RESIZE;
	Config.hideKeyboard = Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS;
	Config.showKeyboard = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
	Config.focusTracing = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
} else {
	Config.softInputTracing = '';
	Config.softInput = '';
	Config.hideKeyboard = '';
	Config.showKeyboard = '';
	Config.focusTracing = '';
}

module.exports = Config;
