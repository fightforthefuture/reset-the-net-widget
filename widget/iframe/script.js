window.setTimeout(function() {
	document.getElementById('scene1').style.display = 'block';
}, 100);

window.setTimeout(function() {
	var cta = document.getElementById('cta');
	var str = 'A year after the first NSA revelation, Congress has failed to protect our rights. Starting today, June 5th, we\'re taking steps to directly block government surveillance on the Internet. Here\'s how to protect your devices too:';

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
			$('#button a').on('mouseenter', function() {
				$('#button_glow2').css('opacity', .5);
			});
			$('#button a').on('mouseleave', function() {
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