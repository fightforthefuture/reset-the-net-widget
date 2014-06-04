/*
 @licstart  The following is the entire license notice for the
    JavaScript code in this page.

 Copyright (C) 2014 Center for Rights in Action
 Copyright (C) 2014 Jeff Lyon

 The JavaScript code in this page is free software: you can
 redistribute it and/or modify it under the terms of the GNU
 General Public License (GNU GPL) as published by the Free Software
 Foundation, either version 3 of the License, or (at your option)
 any later version. The code is distributed WITHOUT ANY WARRANTY;
 without even the implied warranty of MERCHANTABILITY or FITNESS
 FOR A PARTICULAR PURPOSE. See the GNU GPL for more details.

 As additional permission under GNU GPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 @licend  The above is the entire license notice
    for the JavaScript code in this page.
*/

(function(){ // :)



if (typeof _rtn_options == "undefined") _rtn_options = {};
if (typeof _rtn_options.iframe_base_path == "undefined") _rtn_options.iframe_base_path = 'https://fightforthefuture.github.io/reset-the-net-widget/widget/iframe';
if (typeof _rtn_options.animation == "undefined") _rtn_options.animation = 'main';
if (typeof _rtn_options.delay == "undefined") _rtn_options.delay = 0;
if (typeof _rtn_options.debug == "undefined") _rtn_options.debug = false;
if (typeof _rtn_options.always_show_widget == "undefined") _rtn_options.always_show_widget = false;

var _rtn_animations = {
	main: {
		options: {
			modalAnimation: 'main'
		},
		init: function(options) {
			for (var k in options) this.options[k] = options[k];
			return this;
		},
		start: function() {
			var iframe = _rtn_util.createIframe();
			_rtn_util.bindIframeCommunicator(document.getElementById('_rtn_iframe'), this);
		},
		stop: function() {
			_rtn_util.destroyIframe();
		}
	}
}

var _rtn_util = {
	injectCSS: function(id, css)
	{
		var style = document.createElement('style');
		style.type = 'text/css';
		style.id = id;
		if (style.styleSheet) style.styleSheet.cssText = css;
		else style.appendChild(document.createTextNode(css));
		document.head.appendChild(style);
	},
	createIframe: function() {
		var iframe = document.createElement('iframe');
		iframe.id = '_rtn_iframe';
		iframe.src = _rtn_options.iframe_base_path + '/iframe.html';
		iframe.frameBorder = 0;
		iframe.allowTransparency = true; 
		iframe.style.display = 'none';
		document.body.appendChild(iframe);
		return iframe;
	},
	destroyIframe: function() {
		var iframe = document.getElementById('_rtn_iframe');
		iframe.parentNode.removeChild(iframe);
	},
	bindIframeCommunicator: function(iframe, animation) {
		var sendMessage = function(requestType, data)
		{
			data || (data = {});
			data.requestType = requestType;
			data.RTN_WIDGET_MSG = true;
			iframe.contentWindow.postMessage(data, '*');
		}

		var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
		var eventer = window[eventMethod];
		var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

		eventer(messageEvent,function(e) {
			if (!e.data || !e.data.RTN_IFRAME_MSG)
				return;

			delete e.data.RTN_IFRAME_MSG;

			switch (e.data.requestType) {
				case 'getAnimation':
					iframe.style.display = 'block';
					sendMessage('putAnimation', animation.options);
					break;
				case 'stop':
					animation.stop();
					break;
			}
		}, false);

	},
	setCookie: function(name,val,exdays)
	{
		var d = new Date();
		d.setTime(d.getTime()+(exdays*24*60*60*1000));
		var expires = "expires="+d.toGMTString();
		document.cookie = name + "=" + val + "; " + expires;
	},
	getCookie: function(cname)
	{
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++)
  		{
  			var c = ca[i].trim();
  			if (c.indexOf(name)==0)
  				return c.substring(name.length,c.length);
  		}
		return "";
	},
	log: function() {
		if (_rtn_options.debug)
			console.log.apply(console, arguments);
	}
}

function onDomContentLoaded() {
	
	// Should we show the widget, regardless?
	if (!_rtn_options.always_show_widget && window.location.href.indexOf('ALWAYS_SHOW_RTN_WIDGET') === -1) {
		// Only show once.
		if (_rtn_util.getCookie('_RTN_WIDGET_SHOWN')) {
			return;
		}

		// Only show on June 5th.
		var date = new Date();
		var dateString = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
		if (dateString !== '2014/6/5') {
			return;
		}
	}

	_rtn_util.setCookie('_RTN_WIDGET_SHOWN', 'true', 365);

	_rtn_util.injectCSS('_rtn_iframe_css', '#_rtn_iframe { position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 20000; }');

	var images = new Array()
	var preloaded = 0;

	function preload() {
		for (i = 0; i < preload.arguments.length; i++) {
			images[i] = new Image()
			images[i].src = _rtn_options.iframe_base_path + '/images/' + preload.arguments[i]
			images[i].onload = function() {
				preloaded++;
				_rtn_util.log('Preloaded ' + preloaded + ' images.');
				if (preloaded == images.length)
				{
					_rtn_util.log('DONE PRELOADING IMAGES. Starting animation in ' + _rtn_options.delay + ' milliseconds.');
					setTimeout(function() {
						var animation = _rtn_animations[_rtn_options.animation].init(_rtn_options).start();
					}, _rtn_options.delay);
				}
			}
		}
	}

	// Preload images before showing the animation
	preload(
		'background.png',
		'button.png',
		'button_glow.png',
		'camera.png',
		'houses_back.png',
		'houses_front.png',
		'logo.png',
		'record_light.png'
	);

}



// Wait for DOM content to load.
if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") {
	onDomContentLoaded();
} else if (document.addEventListener) {
	document.addEventListener('DOMContentLoaded', onDomContentLoaded, false);
}



})(); // :)
