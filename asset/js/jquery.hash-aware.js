
	var _HASH = {};
	_HASH.now = '';
	_HASH.then = '';
	
	_HASH.interval = 500;
	
	_HASH.check = function(){
		_HASH.then = _HASH.now+'';
		_HASH.now = window.location.hash;
		if(_HASH.then!=_HASH.now) $('body').trigger('hashchange',[_HASH.now]);
	}
	
	$.hashaware = function(interval){
		_HASH.now = window.location.hash;
		if(interval) _HASH.interval = interval;
		setInterval(function(){_HASH.check();},_HASH.interval);
	}