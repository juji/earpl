
(function(a){
	
	
	/*
	 * grid cell
	 * 
	 * represents each cell in the grid
	 * 
	 */
	
	a._GridCell = function(elm){
		this.element = elm;
		this.parent = elm.parent();
		this.element.addClass('draggableGrid');
		this.setInitData();
		
		this.top = 't';
		this.left = 'l';
		this.bottom = 'b';
		this.right = 'r';
		this.center = 'c';
		
		this.mousex = 0;
		this.mousey = 0;
		this.mousedX = 0;
		this.mousedY = 0;
		this.overlapped = false;
		this.clone = null;
		
		this.initMouse();
		this.element.data('gridCell',this);
	};
	
	//drop Action
	a._GridCell.dropAction = function(){
		$('body').trigger('gridlayout.dropaction',[
			this,
			this.overlapped.element.data('gridCell')
		]);
	};
	
	
	var fn = a._GridCell.prototype;
	
	
	// inits
	fn.setInitData = function(){
		this.element.data('gridInit',this.getPosData(this.element));
	};
	
	fn.initMouse = function(){
		var GL = this;
		this.element.unbind('gridlayout.mousedown')
		.bind('gridlayout.mousedown',function(e){
			GL.fn.startDrag(e.pageX,e.pageY);
			return false;
		}).unbind('touchstart').bind('touchstart',function(event){
			var touch = event.touches[0];
			GL.fn.startDrag(touch.pageX,touch.pageY);
			return false;
		});
	}
	
	
	//mouse || touch events
	fn.onDrag = function(mx,my){
		this.mouseX = mx;
		this.mouseY = my;	
		this.moveElement();
		var o = this.getOverlaps();
		o && $('body').trigger('gridlayout.overlap',[o]);
	};
	
	fn.startDrag = function(mousex,mousey){
		var GL = this;
		var elm = this.element;
		var parent = this.parent;
		
		//add Class and create clone
		elm.addClass('isDragged');
		this.clone = elm.clone()
		.html('').attr('id','isDragged')
		.removeClass('draggableGrid');
		
		this.parent.append(this.clone);
		
		//set instance attribute
		this.mouseX = mousex;
		this.mouseY = mousex;
		this.mousedX = Math.abs(elm.data('gridInit').left - mousex);
		this.mousedY = Math.abs(elm.data('gridInit').top - mousey);
		
		//add mouse / touch events
		$('body').unbind('gridlayout.overlap')
		.bind('gridlayout.overlap',function(e,data){
			GL.drawBorder(parent,data.element,data.grid,data.region);
			return false;
		});
		
		$('body').unbind('gridlayout.mousemove')
		.bind('gridlayout.mousemove',function(e){
			GL.ondrag(e.pageX,e.pageY);
			return false;
		});
		
		$('body').unbind('touchmove')
		.bind('touchmove',function(event){
			var e = event.touches[0];
			GL.ondrag(e.pageX,e.pageY);
			return false;
		});
		
		$('body').unbind('gridlayout.mouseup')
		.bind('gridlayout.mouseup',function(){
			GL.stopDrag();
			return false;
		});
		
		$('body').unbind('touchend')
		.bind('touchend',function(){
			GL.stopDrag();
			return false;
		});
	};
	
	fn.stopDrag = function(){
		$('body').unbind('gridlayout.overlap')
		.unbind('gridlayout.mouseup')
		.unbind('gridlayout.mousemove')
		.unbind('touchend').unbind('touchmove');
		$('.isDragged').removeClass('isDragged');
		$('#isDragged').remove();
		this.dropAction();
	};
	
	
	/// Utils
	
	fn.getInitData = function(){
		return this.element.data('gridInit');
	};
	
	fn.getPosData = function(elm){
		var pos = elm.position();
		pos.height = elm.outerHeight() || elm.height();
		pos.width = elm.outerWidth() || elm.width();
		return pos;
	};
	
	fn.getOverlaps = function(){
		this.overlapped = false;
		var posDatDrag = this.getPosData(this.clone);
		
		this.parent.find('.draggableGrid').each(function(){
			
			if($(this).is('.isDragged')) return true;
			var posDatElm = $(this).data('gridInit');
			if(!par.isOverlapping(posDatDrag,posDatElm)) return true;
				
			this.overlapped = {
				'element':$(this),
				'grid':posDatElm,
				'region':par.getOverlappingRegion(posDatDrag,posDatElm)
			};
			return false;
		});
		
		return this.overlapped;
	};
	
	
	fn.isOverlapping = function(movPos,posElm){
		var x = movPos.left <= (posElm.left + posElm.width) && movPos.left >= posElm.left;
		var y = movPos.top <= (posElm.top + posElm.height) && movPos.top >= posElm.top;	
		return x && y;
	};
	
	fn.getOverlappingRegion = function(posDrag,posElm){
		
		var margin = 10;
		
		var top = (posDrag.top - posElm.top + margin) <=0 ? 't' : false;
		var bottom = ((posDrag.top + posDrag.height) - (posElm.top + posElm.height) + margin) <=0 ? false : 'b';
		var left = (posDrag.left - posElm.left + margin) <=0 ? 'l' : false;
		var right = ((posDrag.left + posDrag.width) - (posElm.left + posElm.width) + margin) <=0 ? false : 'r';
		var center = (!top&&!bottom&&!left&&!right) ? 'c' : false;
		
		return center || top || bottom || left || right;
	};
	
	fn.drawBorder = function(parent,elm,cell,region){
		$('.Grid-Border').remove();
		$('.Grid-Center').removeClass('Grid-Center');
		if(region==this.center) {elm.addClass('Grid-Center'); return;}
		
		var dim = {};
		if(region==this.top) dim={'top':cell.top-1,'left':0,'width':0,'height':1};
		if(region==this.left) dim={'top':0,'left':cell.left-1,'width':1,'height':0};
		if(region==this.bottom) dim={'top':cell.top+cell.height+1,'left':0,'width':0,'height':1};
		if(region==this.right) dim={'top':0,'left':cell.left+cell.width+1,'width':1,'height':0};
		for(var i in dim) if(dim[i]) dim[i]+='px';
		dim['position']='absolute';
		dim['background-color']='#0080FF';
		
		var d = $('<div />');
		d.addClass('Grid-Border').css(dim);
		parent.append(d);
	};
	
	fn.moveElement = function(){
		var top = this.mousey - this.mousedy;
		var left = this.mousex - this.mousedx; 
		this.clone.css({'top':top+'px', 'left': left+'px'});
	}
	
})(window);