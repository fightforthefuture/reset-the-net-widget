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

window.setTimeout(function() {
	document.getElementById('scene1').style.display = 'block';
}, 100);

window.setTimeout(function() {
	// Hide the flash, explicitly.
	$('#flash').hide();

	var cta = document.getElementById('cta');
	var str = 'A year after the first NSA revelation, the US Congress has failed to protect our rights. Starting today, June 5th, we\'re taking steps to directly block government surveillance on the Internet. Here\'s how to protect your devices too:';

	var fragment = document.createDocumentFragment();
	for (var i = 0; i < str.length; i++) {
		var span = document.createElement('span');
		span.style.color = 'transparent';
		span.innerHTML = str[i];
		fragment.appendChild(span);
	}
	cta.appendChild(fragment.cloneNode(true));

	var children = cta.childNodes;

	var setDisplayDelay = function(node, delay) {
		setTimeout(function() {
			node.style.color = 'white';
		}, delay);
	}

	var delay = 0;
	for (var i = 0; i < children.length; i++)
	{
		if (i && children[i-1].innerHTML == '.')
			delay += 500;
		else
			delay += 30;
		setDisplayDelay(children[i], delay)
	}
	setTimeout(function() {
		$('#button_glow').addClass('animate');
		$('#button_container').addClass('shown');
		setTimeout(function() { 
			$('#button_container').css('opacity', 1);
			$('#button a').on('mouseover', function() {
				$('#button_glow2').css('opacity', .5);
			});
			$('#button a').on('mouseout', function() {
				$('#button_glow2').css('opacity', 0);
			});
		}, 50);
		setTimeout(function() {
			$('#logo').show();
			setTimeout(function() { 
				$('#logo').css('opacity', 1);
			}, 50);
		}, 1000);
	}, 8000);

}, 7000);

var animations = {
	main: {
		options: {
			debug: false,
		},
		init: function(options) {
			for (var k in options) this.options[k] = options[k];
			return this;
		},
		start: function() {
			this.log('RTN ANIMATION STARTING');
		},
		log: function() {
			if (this.options.debug)
				console.log.apply(console, arguments);
		}
	}
}

window.addEventListener('message', function(e) {
	if (!e.data || !e.data.RTN_WIDGET_MSG)
		return;

	delete e.data.RTN_WIDGET_MSG;

	switch (e.data.requestType) {
		case 'putAnimation':
			animations[e.data.modalAnimation].init(e.data).start();
			break;
	}
});

var sendMessage = function(requestType, data)
{
	data || (data = {});
	data.requestType = requestType;
	data.RTN_IFRAME_MSG = true;
	parent.postMessage(data, '*');
}

$(document).ready(function() {
	sendMessage('getAnimation');

	// Add close button listener.
	$('#close').on('mousedown', function(e) {
		e.preventDefault();
		sendMessage('stop');
	});
});