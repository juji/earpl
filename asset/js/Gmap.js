
		
		var Gmap = {};
		
		Gmap.marker;
		Gmap.map;
		Gmap.geo;
		Gmap.options;
		
		Gmap.event = {};
		
		Gmap.event.onclick = function(e){
			Gmap.setMarkerPosition(e.latLng);
			console.log(Gmap.getMarkerPosition());
		};
		
		Gmap.event.searchresult = function(o){
			if(!o.success) return;
			var location = o.result[0].geometry.location;
			Gmap.setCenter(location);
		};
		
		Gmap.init = function(elmid){
			console.log('Gmap.init 1');
			if(typeof google == 'undefined' || 
			typeof google.maps ==  'undefined' || 
			typeof google.maps.LatLng ==  'undefined' ){
				setTimeout(function(){Gmap.init(elmid);},1000);
				return;
			}
			
			console.log('Gmap.init');
			Gmap.options = {
				center: new google.maps.LatLng(-6.211544, 106.84517200000005),  //jakarta
				zoom: 14,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			console.log('Gmap.init');
			Gmap.geo = new google.maps.Geocoder();
			Gmap.map = new google.maps.Map(document.getElementById(elmid),Gmap.options);
			
			Gmap.marker = new google.maps.Marker({
				position: Gmap.options.center,
				map: Gmap.map
			});
			
			console.log('Gmap.init');
			google.maps.event.addListener(Gmap.map, 'click', function(event) {
				Gmap.event.onclick(event);
			});
		}
		
		
		Gmap.setCenter = function(location){
			Gmap.options.center = location
			Gmap.map.setCenter(location);
		};
		
		
		Gmap.setMarkerPosition = function(loc){
			if(Gmap.marker) Gmap.marker.setPosition(loc);
			else{
				Gmap.marker = new google.maps.Marker({
					position: ( loc ? loc : Gmap.options.center ),
					map: Gmap.map,
					animation: google.maps.Animation.DROP
				});	
			}
		}
		
		Gmap.setMarker = function(d){
			if(Gmap.marker) Gmap.marker.setMap(null);
			Gmap.marker = null;
			d.map = Gmap.map;
			Gmap.marker = new google.maps.Marker(d);	
		}
		
		
		Gmap.getMarkerPosition = function(){
			if(!Gmap.marker) return false;
			var l = Gmap.marker.getPosition();
			return {'lat':l.lat(), 'long':l.lng()};
		};
		
		
		Gmap.search = function(address){
			
			Gmap.geo.geocode({'address': address}, function(results, status) {
				var statustext='';
				switch(status){
					case google.maps.GeocoderStatus.OK:
					status = true; statustext='ok'; break;
					case google.maps.GeocoderStatus.ERROR:
					status = false; statustext='There was a problem contacting the Google servers'; break;
					case google.maps.GeocoderStatus.INVALID_REQUEST:
					status = false; statustext='The search request was invalid'; break;
					case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
					status = false; statustext='Server busy, try again in a few minute.'; break;
					case google.maps.GeocoderStatus.REQUEST_DENIED:
					status = false; statustext='Your website is not allowed to use Google Geocoder.'; break;
					case google.maps.GeocoderStatus.UNKNOWN_ERROR:
					status = false; statustext='Ooops, google server error. you can try again.'; break;
					case google.maps.GeocoderStatus.ZERO_RESULTS:
					status = false; statustext='noresult'; break;
				}
				
				Gmap.event.searchresult({'result':results,'status':statustext,'success':status});
			});
			
		};
		