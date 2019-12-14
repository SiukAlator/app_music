var Config = require('/libs/Config');

exports.newwindow = function(fullscreen, exitOnClose, background, isHome) {

	var self;

	if (isHome) {

		self = Ti.UI.createView({
			backgroundColor : Config.backgroundColor,
			height : Ti.UI.FILL,
			width : Ti.UI.FILL
		});

	} else {

		self = Ti.UI.createWindow({
			fullscreen : fullscreen,
			exitOnClose : exitOnClose,
			navBarHidden : false,
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

	var bg_container = Ti.UI.createScrollView({
		backgroundColor : Config.backgroundColor,
		showVerticalScrollIndicator : false,
		width : Ti.UI.FILL,
		top : '0dp',
		bottom : '0dp',
		scrollType : 'vertical',
		layout : 'vertical',
		touchEnabled : false
	});

	var bg_image = Ti.UI.createImageView({
		image : background,
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		top : '0dp',
		touchEnabled : false
	});

	bg_container.add(bg_image);

	self.add(bg_container);

	return self;
};

exports.actionbar = function(text) {

	var view = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		top : '0dp',
		layout : 'vertical'
	});

	var actionBar = Ti.UI.createView({
		top : '0dp',
		height : Config.barHeight,
		width : Ti.UI.FILL,
		backgroundColor : Config.actionbarBackgroundColor
	});

	var centerLabel = Ti.UI.createLabel({
		text : text,
		font : {
			fontSize : '20dp'
		},
		color : Config.titleTextColor
	});

	var leftView = Ti.UI.createView({
		left : '4dp',
		height : Config.barButtonHeight,
		width : Ti.UI.SIZE,
		layout : 'horizontal'
	});

	var rightView = Ti.UI.createView({
		right : '4dp',
		height : Config.barButtonHeight,
		width : Ti.UI.SIZE,
		layout : 'horizontal'
	});

	actionBar.add(centerLabel);
	actionBar.add(leftView);
	actionBar.add(rightView);

	var barShadow = Ti.UI.createView({
		backgroundColor : Config.shadowColor,
		top : '0dp',
		height : Config.shadowHeight,
		width : Ti.UI.FILL
	});

	view.add(actionBar);
	view.add(barShadow);

	view.actionBar = actionBar;
	view.leftView = leftView;
	view.rightView = rightView;
	view.barShadow = barShadow;

	view.add_left = function(_button) {
		view.leftView.add(_button);
	};

	view.add_right = function(_button) {
		view.rightView.add(_button);
	};

	return view;

};

exports.transparentactionbar = function(text) {

	var view = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		top : '0dp',
		layout : 'vertical'
	});

	var actionBar = Ti.UI.createView({
		top : '0dp',
		height : Config.barHeight,
		width : Ti.UI.FILL
	});

	var centerLabel = Ti.UI.createLabel({
		text : text,
		font : {
			fontSize : '20dp'
		},
		color : Config.titleTextColor
	});

	var leftView = Ti.UI.createView({
		left : '2dp',
		height : Config.barButtonHeight,
		width : Ti.UI.SIZE,
		layout : 'horizontal'
	});

	var rightView = Ti.UI.createView({
		right : '2dp',
		height : Config.barButtonHeight,
		width : Ti.UI.SIZE,
		layout : 'horizontal'
	});

	actionBar.add(centerLabel);
	actionBar.add(leftView);
	actionBar.add(rightView);

	var barShadow = Ti.UI.createView({
		top : '0dp',
		height : Config.shadowHeight,
		width : Ti.UI.FILL
	});

	view.add(actionBar);
	view.add(barShadow);

	view.actionBar = actionBar;
	view.leftView = leftView;
	view.rightView = rightView;
	view.barShadow = barShadow;

	view.add_left = function(_button) {
		view.leftView.add(_button);
	};

	view.add_right = function(_button) {
		view.rightView.add(_button);
	};

	return view;

};

exports.barButton = function(callback, url) {

	var button = Ti.UI.createView({
		borderRadius : Config.barButtonBorderRadius,
		height : Config.barButtonHeight,
		width : Config.barButtonHeight,
		left : '4dp',
		right : '4dp',
		touchEnabled : false
	});

	var action = Ti.UI.createView({
		backgroundColor : Config.actionbarBackgroundColor,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		touchFeedback : Config.barTouchFeedback,
		touchFeedbackColor : Config.barRippleColor,
		touchEnabled : true
	});

	var icon = Ti.UI.createImageView({
		image : url,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		touchEnabled : false
	});

	action.addEventListener('click', callback);
	button.action = action;
	button.icon = icon;
	button.add(action);
	button.add(icon);

	button.icon_hide = Ti.UI.createAnimation({
		duration : 160,
		opacity : 0.0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	button.icon_show = Ti.UI.createAnimation({
		duration : 160,
		opacity : 1.0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	button.animate_show = function() {
		button.icon.show();
		button.icon.animate(button.icon_show, function(e) {
			button.action.touchEnabled = true;
		});
	};

	button.animate_hide = function() {
		button.action.touchEnabled = false;
		button.icon.animate(button.icon_hide, function(e) {
			button.icon.hide();
		});
	};

	return button;

};

exports.transparentbarButton = function(callback, url) {

	var button = Ti.UI.createView({
		borderRadius : Config.barButtonBorderRadius,
		height : Config.barButtonHeight,
		width : Config.barButtonHeight,
		left : '4dp',
		right : '4dp',
		touchEnabled : false
	});

	var action = Ti.UI.createView({
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		touchFeedback : Config.barTouchFeedback,
		touchFeedbackColor : Config.barRippleColor,
		touchEnabled : true
	});

	var icon = Ti.UI.createImageView({
		image : url,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		touchEnabled : false
	});
	
	if (url.indexOf('192_list') != -1)
	{
		icon.height = '30dp';
		icon.width  = '30dp';
	}if (url.indexOf('Filter Filled-100') != -1)
	{
		icon.height = '25dp';
		icon.width  = '25dp';
	}

	if (callback) {
		action.addEventListener('click', callback);
	}
	button.action = action;
	button.icon = icon;
	button.add(action);
	button.add(icon);

	button.icon_hide = Ti.UI.createAnimation({
		duration : 160,
		opacity : 0.0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	button.icon_show = Ti.UI.createAnimation({
		duration : 160,
		opacity : 1.0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	button.animate_show = function() {
		button.icon.show();
		button.icon.animate(button.icon_show, function(e) {
			button.action.touchEnabled = true;
		});
	};

	button.animate_hide = function() {
		button.action.touchEnabled = false;
		button.icon.animate(button.icon_hide, function(e) {
			button.icon.hide();
		});
	};

	return button;

};

exports.menuoption = function(id, url, text) {

	var button = Ti.UI.createView({
		height : Config.optionsRowHeight,
		width : Ti.UI.FILL,
		touchEnabled : false
	});

	var action = Ti.UI.createView({
		identifier : id,
		backgroundColor : Config.optionsBackground,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		touchFeedback : Config.touchFeedback,
		touchFeedbackColor : Config.optionsSelectedBackground,
		touchEnabled : true
	});

	var layout = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		layout : 'vertical',
		touchEnabled : false
	});

	var icon = Ti.UI.createImageView({
		image : url,
		height : '36dp',
		width : '36dp',
		touchEnabled : false
	});

	var text = Ti.UI.createLabel({
		text : text,
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font : Config.optionsTitleFont,
		color : Config.optionsTitleColor,
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		top : '4dp',
		bottom : '8dp',
		ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
		wordWrap : false,
		touchEnabled : false
	});

	var underscore = Ti.UI.createView({
		backgroundColor : Config.accent,
		height : Config.underscoreHeight,
		width : Config.underscoreWidth,
		touchEnabled : false
	});

	layout.add(icon);
	layout.add(text);
	layout.add(underscore);

	button.add(action);
	button.add(layout);

	return button;

};

exports.overview = function() {

	var view = Ti.UI.createView({
		overrideCurrentAnimation : true,
		backgroundColor : Config.overMask,
		top : (parseInt(Config.barHeight) + parseInt(Config.shadowHeight)) + 'dp',
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		zindex : 666
	});

	view.opacity = 0.0;
	view.hide();

	view.mask_hide = Ti.UI.createAnimation({
		duration : 160,
		opacity : 0.0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	view.mask_show = Ti.UI.createAnimation({
		duration : 160,
		opacity : 1.0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	view.animate_show = function() {
		view.show();
		if (Config.isAndroid) {
			view.animate(view.mask_show);
		}
	};

	view.animate_hide = function() {
		if (Config.isAndroid) {
			view.animate(view.mask_hide, function(e) {
				view.hide();
			});
		} else {
			view.hide();
		}
	};

	return view;

};

exports.contexthelp = function(leftBtn, rightBtn, main, extra) {

	var summon = this;

	var view = Ti.UI.createScrollView({
		overrideCurrentAnimation : true,
		showVerticalScrollIndicator : true,
		backgroundColor : Config.coverMask,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		top : '0dp',
		bottom : '0dp',
		layout : 'vertical',
		scrollType : 'vertical',
		zindex : 777
	});
	//if (Config.isAndroid)
	view.opacity = 0.0;

	view.hide();

	view.mask_hide = Ti.UI.createAnimation({
		duration : 320,
		opacity : 0.0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	view.mask_show = Ti.UI.createAnimation({
		duration : 320,
		opacity : 1.0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	view.animate_show = function() {
		view.show();
		view.animate(view.mask_show);
	};

	view.animate_hide = function() {

		view.animate(view.mask_hide, function(e) {
			view.hide();
		});

	};

	view.addEventListener('click', function() {
		view.animate_hide();
	});
	if (Config.isAndroid) {
		var actionbar = summon.transparentactionbar('');
		view.add(actionbar);
	}

	var viewTop = Ti.UI.createView({
		height : Ti.UI.SIZE,
		top : '8dp',
		left : '20dp',
		right : '20dp',
		layout : 'vertical'
	});

	for (var left in leftBtn) {
		var btn = summon.transparentbarButton(null, leftBtn[left].img);
		if (Config.isAndroid) {
			actionbar.add_left(btn);
		}
		var horizontal = Ti.UI.createView({
			height : Ti.UI.SIZE,
			bottom : '4dp',
			layout : 'horizontal'
		});

		var icon = summon.transparentbarButton(null, leftBtn[left].img);
		var text = Ti.UI.createLabel({
			text : leftBtn[left].text,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : '8dp',
			color : Config.white,
			font : Config.rowFont
		});

		horizontal.add(icon);
		horizontal.add(text);
		viewTop.add(horizontal);
	}
	for (var right in rightBtn) {
		var btn = summon.transparentbarButton(null, rightBtn[right].img);
		if (Config.isAndroid) {
			actionbar.add_right(btn);
		}

		var horizontal = Ti.UI.createView({
			height : Ti.UI.SIZE,
			bottom : '4dp',
			layout : 'horizontal'
		});

		var icon = summon.transparentbarButton(null, rightBtn[right].img);
		var text = Ti.UI.createLabel({
			text : rightBtn[right].text,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : '8dp',
			color : Config.white,
			font : Config.rowFont
		});

		horizontal.add(icon);
		horizontal.add(text);
		viewTop.add(horizontal);
	}

	view.add(viewTop);

	var viewMain = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		top : '36dp',
		layout : 'vertical'
	});

	for (var m in main) {
		viewMain.add(main[m]);
	}

	view.add(viewMain);

	var viewExtra = Ti.UI.createView({
		height : Ti.UI.SIZE,
		top : '36dp',
		left : '20dp',
		right : '20dp',
		bottom : '8dp',
		layout : 'vertical'
	});

	for (var e in extra) {
		viewExtra.add(Ti.UI.createLabel({
			text : extra[e],
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : '0dp',
			bottom : '8dp',
			color : Config.white,
			font : Config.rowFont
		}));
	}

	view.add(viewExtra);

	return view;

};


exports.contexthelpMenu = function(leftBtn, rightBtn, main, extra) {

	var summon = this;

	var view = Ti.UI.createScrollView({
		overrideCurrentAnimation : true,
		showVerticalScrollIndicator : true,
		backgroundColor : Config.coverMask,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		top : '0dp',
		bottom : '0dp',
		layout : 'vertical',
		scrollType : 'vertical',
		zindex : 777
	});
	

	//if (Config.isAndroid)
	view.opacity = 0.0;

	view.hide();

	view.mask_hide = Ti.UI.createAnimation({
		duration : 320,
		opacity : 0.0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	view.mask_show = Ti.UI.createAnimation({
		duration : 320,
		opacity : 1.0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	view.animate_show = function() {
		view.show();
		view.animate(view.mask_show);
	};

	view.animate_hide = function() {

		view.animate(view.mask_hide, function(e) {
			view.hide();
		});

	};

	view.addEventListener('click', function() {
		view.animate_hide();
	});
	if (Config.isAndroid) {
		var actionbar = summon.transparentactionbar('');
		view.add(actionbar);
	}

	var viewTop = Ti.UI.createView({
		height : Ti.UI.SIZE,
		top : '8dp',
		left : '20dp',
		right : '20dp',
		layout : 'vertical'
	});
	
	if(!Config.isAndroid)
	{
		viewTop.top = '68dp';
	}
	

	for (var left in leftBtn) {
		var btn = summon.transparentbarButton(null, leftBtn[left].img);
		if (Config.isAndroid) {
			actionbar.add_left(btn);
		}
		var horizontal = Ti.UI.createView({
			height : Ti.UI.SIZE,
			bottom : '4dp',
			layout : 'horizontal'
		});

		var icon = summon.transparentbarButton(null, leftBtn[left].img);
		var text = Ti.UI.createLabel({
			text : leftBtn[left].text,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : '8dp',
			color : Config.white,
			font : Config.rowFont
		});

		horizontal.add(icon);
		horizontal.add(text);
		viewTop.add(horizontal);
	}
	for (var right in rightBtn) {
		var btn = summon.transparentbarButton(null, rightBtn[right].img);
		if (Config.isAndroid) {
			actionbar.add_right(btn);
		}

		var horizontal = Ti.UI.createView({
			height : Ti.UI.SIZE,
			bottom : '4dp',
			layout : 'horizontal'
		});

		var icon = summon.transparentbarButton(null, rightBtn[right].img);
		var text = Ti.UI.createLabel({
			text : rightBtn[right].text,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : '8dp',
			color : Config.white,
			font : Config.rowFont
		});

		horizontal.add(icon);
		horizontal.add(text);
		viewTop.add(horizontal);
	}

	view.add(viewTop);

	var viewMain = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		top : '36dp',
		layout : 'vertical'
	});

	for (var m in main) {
		viewMain.add(main[m]);
	}

	view.add(viewMain);

	var viewExtra = Ti.UI.createView({
		height : Ti.UI.SIZE,
		top : '36dp',
		left : '20dp',
		right : '20dp',
		bottom : '8dp',
		layout : 'vertical'
	});

	for (var e in extra) {
		viewExtra.add(Ti.UI.createLabel({
			text : extra[e],
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : '0dp',
			bottom : '8dp',
			color : Config.white,
			font : Config.rowFont
		}));
	}

	view.add(viewExtra);

	return view;

};


exports.contexthelpDashboard = function(leftBtn, rightBtn, main1, extra1, main2, extra2) {

	var summon = this;

	var view = Ti.UI.createScrollView({
		overrideCurrentAnimation : true,
		showVerticalScrollIndicator : true,
		backgroundColor : Config.coverMask,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		top : '0dp',
		bottom : '0dp',
		layout : 'vertical',
		scrollType : 'vertical',
		zindex : 777
	});
	//if (Config.isAndroid)
	view.opacity = 0.0;

	view.hide();

	view.mask_hide = Ti.UI.createAnimation({
		duration : 320,
		opacity : 0.0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	view.mask_show = Ti.UI.createAnimation({
		duration : 320,
		opacity : 1.0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	view.animate_show = function() {
		view.show();
		view.animate(view.mask_show);
	};

	view.animate_hide = function() {

		view.animate(view.mask_hide, function(e) {
			view.hide();
		});

	};

	view.addEventListener('click', function() {
		view.animate_hide();
	});
	if (Config.isAndroid) {
		var actionbar = summon.transparentactionbar('');
		view.add(actionbar);
	}

	var viewTop = Ti.UI.createView({
		height : Ti.UI.SIZE,
		top : '8dp',
		left : '20dp',
		right : '20dp',
		layout : 'vertical'
	});

	for (var left in leftBtn) {
		var btn = summon.transparentbarButton(null, leftBtn[left].img);
		if (Config.isAndroid) {
			actionbar.add_left(btn);
		}
		var horizontal = Ti.UI.createView({
			height : Ti.UI.SIZE,
			bottom : '4dp',
			layout : 'horizontal'
		});

		var icon = summon.transparentbarButton(null, leftBtn[left].img);
		var text = Ti.UI.createLabel({
			text : leftBtn[left].text,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : '8dp',
			color : Config.white,
			font : Config.rowFont
		});

		horizontal.add(icon);
		horizontal.add(text);
		viewTop.add(horizontal);
	}
	for (var right in rightBtn) {
		var btn = summon.transparentbarButton(null, rightBtn[right].img);
		if (Config.isAndroid) {
			actionbar.add_right(btn);
		}

		var horizontal = Ti.UI.createView({
			height : Ti.UI.SIZE,
			bottom : '4dp',
			layout : 'horizontal'
		});

		var icon = summon.transparentbarButton(null, rightBtn[right].img);
		var text = Ti.UI.createLabel({
			text : rightBtn[right].text,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : '8dp',
			color : Config.white,
			font : Config.rowFont
		});

		horizontal.add(icon);
		horizontal.add(text);
		viewTop.add(horizontal);
	}

	view.add(viewTop);

	var viewMain1 = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		top : '36dp',
		layout : 'vertical'
	});

	for (var m in main1) {
		viewMain1.add(main1[m]);
	}

	view.add(viewMain1);

	var viewExtra1 = Ti.UI.createView({
		height : Ti.UI.SIZE,
		top : '36dp',
		left : '20dp',
		right : '20dp',
		bottom : '8dp',
		layout : 'vertical'
	});

	for (var e in extra1) {
		viewExtra1.add(Ti.UI.createLabel({
			text : extra1[e],
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : '0dp',
			bottom : '8dp',
			color : Config.white,
			font : Config.rowFont
		}));
	}

	view.add(viewExtra1);

	var viewMain2 = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		top : '36dp',
		layout : 'vertical'
	});

	for (var m in main2) {
		viewMain2.add(main2[m]);
	}

	view.add(viewMain2);

	var viewExtra2 = Ti.UI.createView({
		height : Ti.UI.SIZE,
		top : '36dp',
		left : '20dp',
		right : '20dp',
		bottom : '8dp',
		layout : 'vertical'
	});

	for (var e in extra2) {
		viewExtra2.add(Ti.UI.createLabel({
			text : extra2[e],
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : '0dp',
			bottom : '8dp',
			color : Config.white,
			font : Config.rowFont
		}));
	}

	view.add(viewExtra2);

	return view;

};

exports.contexthelpTracing = function(leftBtn, rightBtn, extra0, main1, extra1, main2, extra2, main3, extra3) {

	var summon = this;

	var view = Ti.UI.createScrollView({
		overrideCurrentAnimation : true,
		showVerticalScrollIndicator : true,
		backgroundColor : Config.coverMask,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		top : '0dp',
		bottom : '0dp',
		layout : 'vertical',
		scrollType : 'vertical',
		zindex : 777
	});
	//if (Config.isAndroid)
	view.opacity = 0.0;

	view.hide();

	view.mask_hide = Ti.UI.createAnimation({
		duration : 320,
		opacity : 0.0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	view.mask_show = Ti.UI.createAnimation({
		duration : 320,
		opacity : 1.0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	view.animate_show = function() {
		view.show();
		view.animate(view.mask_show);
	};

	view.animate_hide = function() {

		view.animate(view.mask_hide, function(e) {
			view.hide();
		});

	};

	view.addEventListener('click', function() {
		view.animate_hide();
	});
	if (Config.isAndroid) {
		var actionbar = summon.transparentactionbar('');
		view.add(actionbar);
	}

	var viewTop = Ti.UI.createView({
		height : Ti.UI.SIZE,
		top : '8dp',
		left : '20dp',
		right : '20dp',
		layout : 'vertical'
	});

	for (var left in leftBtn) {
		var btn = summon.transparentbarButton(null, leftBtn[left].img);
		if (Config.isAndroid) {
			actionbar.add_left(btn);
		}
		var horizontal = Ti.UI.createView({
			height : Ti.UI.SIZE,
			bottom : '4dp',
			layout : 'horizontal'
		});

		var icon = summon.transparentbarButton(null, leftBtn[left].img);
		var text = Ti.UI.createLabel({
			text : leftBtn[left].text,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : '8dp',
			color : Config.white,
			font : Config.rowFont
		});

		horizontal.add(icon);
		horizontal.add(text);
		viewTop.add(horizontal);
	}
	for (var right in rightBtn) {
		var btn = summon.transparentbarButton(null, rightBtn[right].img);
		if (Config.isAndroid) {
			actionbar.add_right(btn);
		}

		var horizontal = Ti.UI.createView({
			height : Ti.UI.SIZE,
			bottom : '4dp',
			layout : 'horizontal'
		});

		var icon = summon.transparentbarButton(null, rightBtn[right].img);
		var text = Ti.UI.createLabel({
			text : rightBtn[right].text,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : '8dp',
			color : Config.white,
			font : Config.rowFont
		});

		horizontal.add(icon);
		horizontal.add(text);
		viewTop.add(horizontal);
	}

	view.add(viewTop);
	
	var viewExtra0 = Ti.UI.createView({
		height : Ti.UI.SIZE,
		top : '36dp',
		left : '20dp',
		right : '20dp',
		bottom : '8dp',
		layout : 'vertical'
	});

	for (var e in extra0) {
		viewExtra0.add(Ti.UI.createLabel({
			text : extra0[e],
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : '0dp',
			bottom : '8dp',
			color : Config.white,
			font : Config.rowFont
		}));
	}

	view.add(viewExtra0);

	var viewMain1 = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		top : '36dp',
		layout : 'vertical'
	});

	for (var m in main1) {
		viewMain1.add(main1[m]);
	}

	view.add(viewMain1);

	var viewExtra1 = Ti.UI.createView({
		height : Ti.UI.SIZE,
		top : '36dp',
		left : '20dp',
		right : '20dp',
		bottom : '8dp',
		layout : 'vertical'
	});

	for (var e in extra1) {
		viewExtra1.add(Ti.UI.createLabel({
			text : extra1[e],
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : '0dp',
			bottom : '8dp',
			color : Config.white,
			font : Config.rowFont
		}));
	}

	view.add(viewExtra1);

	var viewMain2 = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		top : '36dp',
		layout : 'vertical'
	});

	for (var m in main2) {
		viewMain2.add(main2[m]);
	}

	view.add(viewMain2);

	var viewExtra2 = Ti.UI.createView({
		height : Ti.UI.SIZE,
		top : '36dp',
		left : '20dp',
		right : '20dp',
		bottom : '8dp',
		layout : 'vertical'
	});

	for (var e in extra2) {
		viewExtra2.add(Ti.UI.createLabel({
			text : extra2[e],
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : '0dp',
			bottom : '8dp',
			color : Config.white,
			font : Config.rowFont
		}));
	}

	view.add(viewExtra2);

	var viewMain3 = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		top : '36dp',
		layout : 'vertical'
	});

	for (var m in main3) {
		viewMain3.add(main3[m]);
	}

	view.add(viewMain3);

	var viewExtra3 = Ti.UI.createView({
		height : Ti.UI.SIZE,
		top : '36dp',
		left : '20dp',
		right : '20dp',
		bottom : '8dp',
		layout : 'vertical'
	});

	for (var e in extra3) {
		viewExtra3.add(Ti.UI.createLabel({
			text : extra3[e],
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : '0dp',
			bottom : '8dp',
			color : Config.white,
			font : Config.rowFont
		}));
	}

	view.add(viewExtra3);

	return view;

};

exports.fullwork = function() {

	var work = Ti.UI.createView({
		overrideCurrentAnimation : true,
		backgroundColor : Config.overMask,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		zindex : 999
	});

	var indicator = Ti.UI.createActivityIndicator({
		style : Config.isAndroid ? Ti.UI.ActivityIndicatorStyle.BIG_DARK : Ti.UI.ActivityIndicatorStyle.DARK,
		height : '120dp',
		width : '120dp'
	});
	indicator.show();

	work.add(indicator);
	work.opacity = 0.0;
	work.hide();

	work.mask_hide = Ti.UI.createAnimation({
		duration : 160,
		opacity : 0.0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	work.mask_show = Ti.UI.createAnimation({
		duration : 160,
		opacity : 1.0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	work.animate_show = function() {
		work.show();
		work.animate(work.mask_show);
	};

	work.animate_hide = function() {
		work.animate(work.mask_hide, function(e) {
			work.hide();
		});
	};

	return work;

};

exports.contextwork = function() {

	var work = Ti.UI.createView({
		overrideCurrentAnimation : true,
		height : '120dp',
		width : '120dp'
	});

	var indicator = Ti.UI.createActivityIndicator({
		style : Config.isAndroid ? Ti.UI.ActivityIndicatorStyle.BIG_DARK : Ti.UI.ActivityIndicatorStyle.DARK,
		height : '120dp',
		width : '120dp'
	});
	indicator.show();

	work.add(indicator);
	work.opacity = 0.0;
	work.hide();

	work.mask_slim = Ti.UI.createAnimation({
		duration : 160,
		height : '0dp',
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	work.mask_fat = Ti.UI.createAnimation({
		duration : 160,
		height : '120dp',
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	work.mask_hide = Ti.UI.createAnimation({
		duration : 160,
		opacity : 0.0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	work.mask_show = Ti.UI.createAnimation({
		duration : 160,
		opacity : 1.0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	work.animate_show = function() {
		work.animate(work.mask_fat, function(e) {
			work.show();
			work.animate(work.mask_show);
		});
	};

	work.animate_hide = function() {
		work.animate(work.mask_hide, function(e) {
			work.hide();
			work.animate(work.mask_slim);
		});
	};

	return work;

};

exports.icontitle = function(url, text, callback) {

	var view = Ti.UI.createView({
		height : '90dp',
		width : Ti.UI.FILL,
		touchEnabled : false
	});

	var flat = Ti.UI.createView({
		backgroundColor : Config.backgroundColor,
		height : Config.subtitleBorderRadius,
		width : Ti.UI.FILL,
		bottom : '0dp',
		touchEnabled : false
	});

	var round = Ti.UI.createView({
		borderRadius : Config.subtitleBorderRadius,
		height : '90dp',
		width : Ti.UI.FILL,
		left : '48dp',
		right : '48dp',
		touchEnabled : false
	});

	var content = Ti.UI.createView({
		backgroundColor : Config.backgroundColor,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		touchFeedback : Config.touchFeedback,
		touchFeedbackColor : Config.accent,
		touchEnabled : true
	});

	var iconView = Ti.UI.createImageView({
		image : url,
		height : '36dp',
		width : '36dp',
		top : '12dp',
		touchEnabled : false
	});

	var titleView = Ti.UI.createLabel({
		text : text,
		font : Config.subtitleFont,
		color : Config.accent,
		bottom : '8dp',
		ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
		wordWrap : false,
		touchEnabled : false
	});

	var underscore = Ti.UI.createView({
		backgroundColor : Config.accent,
		height : Config.underscoreHeight,
		width : Config.underscoreWidth,
		bottom : '4dp',
		touchEnabled : false
	});

	content.add(iconView);
	content.add(titleView);
	content.add(underscore);
	round.add(content);
	view.add(flat);
	view.add(round);

	if (callback) {
		content.addEventListener('click', callback);
	}

	return view;

};

exports.tabtitle = function(text, callback) {

	var view = Ti.UI.createView({
		height : '48dp',
		width : Ti.UI.FILL,
		touchEnabled : false
	});

	var flat = Ti.UI.createView({
		backgroundColor : Config.backgroundColor,
		height : Config.subtitleBorderRadius,
		width : Ti.UI.FILL,
		bottom : '0dp',
		touchEnabled : false
	});

	var round = Ti.UI.createView({
		borderRadius : Config.subtitleBorderRadius,
		height : '48dp',
		width : Ti.UI.FILL,
		left : '48dp',
		right : '48dp',
		touchEnabled : false
	});

	var content = Ti.UI.createView({
		backgroundColor : Config.backgroundColor,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		touchFeedback : Config.touchFeedback,
		touchFeedbackColor : Config.accent,
		touchEnabled : true
	});

	var titleView = Ti.UI.createLabel({
		text : text,
		font : Config.subtitleFont,
		color : Config.accent,
		bottom : '16dp',
		ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
		wordWrap : false,
		touchEnabled : false
	});

	var underscore = Ti.UI.createView({
		backgroundColor : Config.accent,
		height : Config.underscoreHeight,
		width : Config.underscoreWidth,
		bottom : '12dp',
		touchEnabled : false
	});

	content.add(titleView);
	content.add(underscore);
	round.add(content);
	view.add(flat);
	view.add(round);

	view.label = titleView;

	view.setText = function(text) {
		view.label.text = text;
	};

	if (callback) {
		content.addEventListener('click', callback);
	}

	return view;

};

exports.doubletitle = function(text1, text2, callback) {

	var view = Ti.UI.createView({
		height : '70dp',
		width : Ti.UI.FILL,
		touchEnabled : false
	});

	var flat = Ti.UI.createView({
		backgroundColor : Config.backgroundColor,
		height : Config.subtitleBorderRadius,
		width : Ti.UI.FILL,
		bottom : '0dp',
		touchEnabled : false
	});

	var round = Ti.UI.createView({
		borderRadius : Config.subtitleBorderRadius,
		height : '70dp',
		width : Ti.UI.FILL,
		left : '48dp',
		right : '48dp',
		touchEnabled : false
	});

	var content = Ti.UI.createView({
		backgroundColor : Config.backgroundColor,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		touchFeedback : Config.touchFeedback,
		touchFeedbackColor : Config.accent,
		touchEnabled : true
	});

	var title1View = Ti.UI.createLabel({
		text : text1,
		font : Config.subtitleFont,
		color : Config.subtitleTextColor,
		top : '8dp',
		ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
		wordWrap : false,
		touchEnabled : false
	});

	var title2View = Ti.UI.createLabel({
		text : text2,
		font : Config.subtitleFont,
		color : Config.accent,
		bottom : '16dp',
		ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
		wordWrap : false,
		touchEnabled : false
	});

	var underscore = Ti.UI.createView({
		backgroundColor : Config.accent,
		height : Config.underscoreHeight,
		width : Config.underscoreWidth,
		bottom : '12dp',
		touchEnabled : false
	});

	content.add(title1View);
	content.add(title2View);
	content.add(underscore);
	round.add(content);
	view.add(flat);
	view.add(round);

	if (callback) {
		content.addEventListener('click', callback);
	}

	return view;

};

exports.roundtitle = function(text, callback) {

	var view = Ti.UI.createView({
		borderRadius : Config.borderRadius,
		elevation : Config.elevation,
		height : '48dp',
		width : Ti.UI.FILL,
		left : '10dp',
		right : '10dp',
		touchEnabled : false
	});

	var content = Ti.UI.createView({
		backgroundColor : Config.containerBackgroundColor,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		touchFeedback : Config.touchFeedback,
		touchFeedbackColor : Config.accent,
		touchEnabled : true
	});

	var titleView = Ti.UI.createLabel({
		text : text,
		font : Config.subtitleFont,
		color : Config.containerTextColor,
		ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
		wordWrap : false,
		touchEnabled : false
	});

	var underscore = Ti.UI.createView({
		backgroundColor : Config.accent,
		height : Config.underscoreHeight,
		width : Config.underscoreWidth,
		bottom : '8dp',
		touchEnabled : false
	});

	content.add(titleView);
	content.add(underscore);
	view.add(content);

	view.label = titleView;

	view.setText = function(text) {
		view.label.text = text;
	};

	if (callback) {
		content.addEventListener('click', callback);
	}

	return view;

};

exports.explanationBox = function(text1, text2, url, callback) {

	var view = Ti.UI.createView({
		borderRadius : Config.borderRadius,
		elevation : Config.elevation,
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		left : '10dp',
		right : '10dp',
		touchEnabled : false
	});

	var content = Ti.UI.createView({
		backgroundColor : Config.containerBackgroundColor,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		touchFeedback : Config.touchFeedback,
		touchFeedbackColor : Config.accent,
		touchEnabled : true
	});

	var iconView = Ti.UI.createImageView({
		image : url,
		height : '36dp',
		width : '36dp',
		right : '10dp',
		touchEnabled : false
	});

	var verticalLeft = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		layout : 'vertical',
		left : '10dp',
		right : '56dp',
		touchEnabled : false
	});

	var title1View = Ti.UI.createLabel({
		text : text1,
		font : Config.inputFont,
		color : Config.containerTextColor,
		top : '8dp',
		left : '0dp',
		ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
		wordWrap : false,
		touchEnabled : false
	});

	var title2View = Ti.UI.createLabel({
		text : text2,
		font : Config.inputFont,
		color : Config.accent,
		left : '0dp',
		ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
		wordWrap : false,
		touchEnabled : false
	});

	var underscore = Ti.UI.createView({
		backgroundColor : Config.accent,
		height : Config.underscoreHeight,
		width : Config.underscoreWidth,
		top : '4dp',
		left : '0dp',
		bottom : '8dp',
		touchEnabled : false
	});

	verticalLeft.add(title1View);
	verticalLeft.add(title2View);
	verticalLeft.add(underscore);
	content.add(verticalLeft);
	content.add(iconView);
	view.add(content);

	if (callback) {
		content.addEventListener('click', callback);
	}

	return view;

};

exports.explanationSteps = function(text1, text2, text3, callback) {

	var view = Ti.UI.createView({
		borderRadius : Config.borderRadius,
		elevation : Config.elevation,
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		left : '10dp',
		right : '10dp',
		touchEnabled : false
	});

	var content = Ti.UI.createView({
		backgroundColor : Config.containerBackgroundColor,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		touchFeedback : Config.touchFeedback,
		touchFeedbackColor : Config.accent,
		touchEnabled : true
	});

	var verticalLeft = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		layout : 'vertical',
		left : '10dp',
		right : '56dp',
		touchEnabled : false
	});

	var title1View = Ti.UI.createLabel({
		text : text1,
		font : Config.containerTextColor,
		color : Config.inputTextColor,
		top : '8dp',
		left : '0dp',
		ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
		wordWrap : false,
		touchEnabled : false
	});

	var title2View = Ti.UI.createLabel({
		text : text2,
		font : Config.inputFont,
		color : Config.accent,
		left : '0dp',
		ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
		wordWrap : false,
		touchEnabled : false
	});

	var title3View = Ti.UI.createLabel({
		text : text3,
		font : Config.subtitleFont,
		color : Config.accent,
		right : '10dp',
		ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
		wordWrap : false,
		touchEnabled : false
	});

	var underscore = Ti.UI.createView({
		backgroundColor : Config.accent,
		height : Config.underscoreHeight,
		width : Config.underscoreWidth,
		top : '4dp',
		left : '0dp',
		bottom : '8dp',
		touchEnabled : false
	});

	verticalLeft.add(title1View);
	verticalLeft.add(title2View);
	verticalLeft.add(underscore);
	content.add(verticalLeft);
	content.add(title3View);
	view.add(content);

	if (callback) {
		content.addEventListener('click', callback);
	}

	return view;

};

exports.contactItem = function(text1, text2, url, key, value) {

	var view = Ti.UI.createView({
		borderRadius : Config.borderRadius,
		elevation : Config.elevation,
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		left : '10dp',
		right : '10dp',
		touchEnabled : false
	});

	var content = Ti.UI.createView({
		itemKey : key,
		itemValue : value,
		backgroundColor : Config.containerBackgroundColor,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		touchFeedback : Config.touchFeedback,
		touchFeedbackColor : Config.accent,
		touchEnabled : true
	});

	var iconView = Ti.UI.createImageView({
		image : url,
		height : '36dp',
		width : '36dp',
		right : '10dp',
		touchEnabled : false
	});

	var verticalLeft = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		layout : 'vertical',
		left : '10dp',
		right : '56dp',
		touchEnabled : false
	});

	var title1View = Ti.UI.createLabel({
		text : text1,
		font : Config.inputFont,
		color : Config.containerTextColor,
		top : '8dp',
		left : '0dp',
		ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
		wordWrap : false,
		touchEnabled : false
	});

	var title2View = Ti.UI.createLabel({
		text : text2,
		font : Config.inputFont,
		color : Config.accent,
		left : '0dp',
		ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
		wordWrap : false,
		touchEnabled : false
	});

	var underscore = Ti.UI.createView({
		backgroundColor : Config.accent,
		height : Config.underscoreHeight,
		width : Config.underscoreWidth,
		top : '4dp',
		left : '0dp',
		bottom : '8dp',
		touchEnabled : false
	});

	verticalLeft.add(title1View);
	verticalLeft.add(title2View);
	verticalLeft.add(underscore);
	content.add(verticalLeft);
	content.add(iconView);
	view.add(content);

	var itemFunction;

	if (value && key) {

		function goPhone(itemValue) {
			// Ti.API.error('Click Item: '+ itemValue);
			// Ti.API.error('Click Item T: '+ typeof(itemValue));
			//Ti.Platform.openURL("tel:" + Ti.App.Properties.getString(itemValue));

			var myPhone = "tel:" + itemValue;

			//		Ti.API.error('My Phone: '+ myPhone);
			Ti.Platform.openURL(myPhone);
		}

		function goMail(itemValue) {
			var emailDialog = Ti.UI.createEmailDialog();
			emailDialog.toRecipients = [itemValue];
			emailDialog.open();
		}

		function goWeb(itemValue) {
			var webview = Titanium.UI.createWebView({
				url : itemValue
			});
			var window = Titanium.UI.createWindow();
			window.add(webview);
			window.open({
				modal : true
			});
		}


		content.addEventListener('click', function(e) {
			switch(e.source.itemKey) {
			case 'phone':
				goPhone(e.source.itemValue);
				break;
			case 'mail':
				goMail(e.source.itemValue);
				break;
			case 'web':
				goWeb(e.source.itemValue);
				break;
			}

		});
	}

	return view;

};
