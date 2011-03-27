
(function($) {

	/**
	 * Checks if all properties in obj1 exists in obj2 and are of the same value
	 * @param 	{Object} 	obj1
	 * @param 	{Object} 	obj2
	 * @returns {Boolean}	true if obj2 contains all values of obj1
	 */
	var isin = function(needle, haystack){
		for(prop in needle){
			if (typeof(haystack[prop]) == 'undefined'){
				return false;
			}
			if(typeof(needle[prop]) == 'object'){
				if(!isin(needle[prop], haystack[prop])) {
					return false;
				}
			}
			if(needle[prop] != haystack[prop]) { return false; }
		}
		return true;
	};
	/**
	 * Goomaps function. Checks for method and applies the correct method. Falls
	 * back to init method.
	 *
	 * @param   {method} method   Method to initiate on the jQuery object
	 *
	 * @returns {Object}   Returns the passed in jQuery object for chainability
	 */
	$.fn.goomaps = function(method){

		if($.fn.goomaps.methods[method]){
			return $.fn.goomaps.methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}else if(typeof method === 'object' || !method){
			return $.fn.goomaps.methods.init.apply(this, arguments);
		}else{
			$.error('Method ' + method + ' does not exist on jQuery.goomaps');
		}

	};

	$.fn.goomaps.methods = {
		/**
		 * Initialise the Google Map and store it in the element. If there are options
		 * provided, process them onto the map.
		 *
		 * If there is a map already stored in the element, it will be removed first.
		 *
		 * @param   {Object} options   Google Maps Map options
		 *
		 * @returns {Object} Returns the object passed in, for chainability.
		 */
		init: function(options){
			if(options && options.debug) $.fn.goomaps.debug = options.debug;
			return this.each(function(){
				// Remove any map data for this element
				$(this).goomaps('destroy');
				// Initialise a map, attach it to the element itself
				var map = new google.maps.Map(this, $.fn.goomaps.defaults);
				if(options && options.center){
					if(typeof options.center === 'string'){
						$.fn.goomaps.geocode(options.center, function(result){
							map.setCenter(result);
						});
					}else if($.isArray(options.center)){
						map.setCenter($.fn.goomaps.latlng(options.center));
					}else{
						if($.fn.goomaps.debug && window.console) console.log('options.center must be either type Array or String');
					}
				}
				if(options && options.zoom){
					map.setZoom(options.zoom);
				}
				if(options && options.MapTypeId){
					map.setMapTypeId(options.MapTypeId);
				}
				var add = {
					map: map
				}
				$(this).data('goomaps', add);
			});
		},
		/**
		 * Update an existing Google Map with new basic options
		 *
		 * @param   {Object} options   Google Maps Map options
		 *
		 * @returns {Object}   Returns the object passed in, for chainability
		 */
		update: function(options){
			if(options && options.debug === true) $.fn.goomaps.debug = options.debug;
			return this.each(function(){
				var map = $(this).data('goomaps').map;
				if(options && options.center){
					if(typeof options.center === 'string'){
						$.fn.goomaps.geocode(options.center, function(result){
							map.setCenter(result);
						});
					}else if($.isArray(options.center)){
						map.setCenter($.fn.goomaps.latlng(options.center));
					}else{
						// Expand the error console logging
						if($.fn.goomaps.debug && window.console) console.log('options.center must be either type Array or String');
					}
				}
				if(options && options.zoom){
					map.setZoom(options.zoom);
				}
				if(options && options.MapTypeId){
					map.setMapTypeId(options.MapTypeId);
				}
			});
		},
		/**
		 * Remove data from the elment.
		 * This method will remove the goomaps data stored with the element.
		 * All data applied to the map will still be visible, but cannot be updated or reused.
		 *
		 * @param {String} key   If passed will remove the passed key only
		 *
		 * @returns {Object}   Returns the object passed in, for chainablity
		 */
		destroy: function(key){
			return this.each(function(){
				if($(this).data(key)){
					$(this).removeData(key);
				}else{
					$(this).empty();
				}
			});
		},
		/**
		 * Add Markers to an existing Google Map object.
		 *
		 * Markers are stored with the element containing the map, as an array
		 * of Google Maps Marker objects.
		 *
		 * @param   {Array} markers   Array of Marker objects
		 *
		 * @returns {Object}   Returns the object passed in, for chainability
		 */
		setmarkers: function(markers){
			return this.each(function(){
				$this = $(this);
				if(!$.isArray(markers)) markers = [markers];
				var map = $(this).data('goomaps').map;
				var add = {markers:[]};
				$.each(markers, function(i, marker){
					marker.options.map = map;
					// UID
					if(marker.options.uid){
						//i = marker.options.uid;	// Sets the iterator to the UID passed by the user.
					}
					// Custom Icon
					if(marker.options.icon && typeof marker.options.icon != 'string'){
						marker.options.icon = $.fn.goomaps.markerimage(marker.options.icon);
					}
					// Custom Shadow
					if(marker.options.shadow && typeof marker.options.shadow != 'string'){
						marker.options.shadow = $.fn.goomaps.markerimage(marker.options.shadow);
					}
					// Position
					if(marker.options.position && $.isArray(marker.options.position)){
						marker.options.position = $.fn.goomaps.latlng(marker.options.position);
						add.markers[i] = new google.maps.Marker(marker.options);
					}else{
						if($.fn.goomaps.debug && window.console) console.log('Markers must be provided with a position.');
					}
					// Events
					if(marker.events){
						$.fn.goomaps.setevents(add.markers[i], marker.events);
					}
					// Infowindow
					if(marker.options.info){
						$.fn.goomaps.infowindow(add.markers[i], marker.options.info, map);
						// Open the info window straight away
						if(marker.options.initialopen == true){
							google.maps.event.trigger(add.markers[i], 'click');
						}
					}
				});
				$.extend($this.data('goomaps'), add);
			});
		},

		/**
		 *	Select all markers by a given selection-object.
		 *	If you want to find a marker that is defined as:
		 *	{
		 *		position: [0, 0],
		 *		userdefined: { identity: 'id_0815' },
		 *		hello: 'world'
		 *	}
		 *
		 * 	You can use one of following selection objects
		 *
		 * 	{
		 *		userdefined: { identity: 'id_0815' },
		 * 	}
		 *
		 * 	{
		 *		hello: 'world',
		 * 	}
		 *
		 *	TODO: currently you can't select by position.
		 *
		 *	This method will return all markers that define a subset of the given selection-object.
		 *	If a marker doesn't contain all values of the given selection-object it wont't be returned.
		 *	But be aware, if there are many markers this method can be very slow as it iterates over all markers.
		 *	If no selection is given it returns all markers.
		 *
		 *	@param		{Object}	selection	is a subset of all values for the returned markers (optional). If no selection is given
		 *											it returns all markers of a map
		 *	@returns	{Array}		Array of all markers that have defined all values of the given selection-object. If there is no
		 *											matching marker it returns an empty array
		 */
		getmarkers: function(data){
			var results = [];
			var markers = $(this).data('goomaps').markers;
			// Check for array number
			if(data === 0 || typeof data === 'number'){
				results.push(markers[data]);
				console.log('number');
			}else if($.isPlainObject(data) || $.isArray(data) || typeof data === 'string'){
				if($.isArray(data)) var position = $.fn.goomaps.latlng(data); // Get LatLng of array
				$.each(markers, function(i, marker){
					if($.isArray(data)){
						var mpos = marker.getPosition(); // Get marker position LatLng
						if(mpos.equals(position)) results.push(marker); // check it equals position, add to results
					}else if(typeof data === 'string'){
						if(marker.uid && marker.uid == data) results.push(marker); // check supplied uid
					}else if(isin(data, marker)){
						results.push(marker); // check supplied data object
					}
				});
			}
			// Check for no data, also check that a number of 0 isn't passed
			if(data !== 0 && !data) results.push(markers);
			console.log(data, results);
		},


		addevents: function(events){
			return this.each(function(){
				$.fn.goomaps.setevents($(this), events);

			});
		}
	};

// -----------------------------------------------------------------------------

	/**
	 * Create a Google Maps LatLng object from array of coordinates
	 *
	 * @param   {Array} coords   Array of coordinates as [lat,lng]
	 *
	 * @returns {LatLng}   Google Maps LatLng object
	 */
	$.fn.goomaps.latlng = function(coords){
		if($.isArray(coords)){
			return new google.maps.LatLng(coords[0], coords[1]);
		}else{
			if($.fn.goomaps.debug && window.console) console.log('latlng must be provided with an array of coordinates.');
		}
	};

	/**
	 * Create a Google Maps LatLngBounds object from array of coordinates
	 */
	$.fn.goomaps.latlngbounds = function(coords){
		var a = $.fn.goomaps.latlng(coords[0]);
		var b = $.fn.goomaps.latlng(coords[1]);
		return new google.maps.LatLngBounds(a, b);
	};
	/**
	 * Google Maps Geocoder object
	 */
	$.fn.goomaps.geocoder = {};

	/**
	 * Geocode addresses using the Google Maps Geocoder service
	 *
	 * @param   {String} address   Address to geocode
	 * @param   {Function} callback   Callback function
	 *
	 * @returns {LatLng}   Google Maps LatLng object
	 */
	$.fn.goomaps.geocode = function(address, callback){
		if($.isEmptyObject($.fn.goomaps.geocoder)) $.fn.goomaps.geocoder = new google.maps.Geocoder();
		if(typeof address === 'string' && $.isFunction(callback)){
			$.fn.goomaps.geocoder.geocode({address: address}, function(results, status){
				if(status == google.maps.GeocoderStatus.OK){
					callback(results[0].geometry.location);
				}else{
					if($.fn.goomaps.debug && window.console) console.log('Geocoder status returned: '+status);
				}
			});
		}else{
			if(typeof address != 'string' && !$.isFunction(callback)){
				if($.fn.goomaps.debug && window.console) return console.log('Geocoder requires an address string, and a callback function');
			}else if(typeof address != 'string'){
				if($.fn.goomaps.debug && window.console) return console.log('Geocoder requires an address string');
			}else if(!$.isFunction(callback)){
				if($.fn.goomaps.debug && window.console) return console.log('Geocoder requires a callback function');
			}
		}
	};

	/**
	 * Create a MarkerImage for use on a Google Maps Marker
	 *
	 * @param   {Object} options   Google Maps MarkerImage options
	 *
	 * @returns {MarkerImage}   Google Maps MarkerImage object
	 */
	$.fn.goomaps.markerimage = function(options){
		if(options.size){
			options.size = new google.maps.Size(options.size[0], options.size[1]);
		}
		if(options.anchor){
			o.anchor = new google.maps.Point(options.anchor[0], options.anchor[1]);
		}
		if(options.origin){
			o.origin = new google.maps.Point(options.origin[0], options.origin[1]);
		}
		return new google.maps.MarkerImage(options);
	};

	/**
	 * Create a Google Maps InfoWindow attached to the provided Marker
	 *
	 * @param   {Marker} marker   Google Maps Marker object
	 * @param   {String} info   Either a selector or string of data
	 *
	 * @returns {InfoWindow}   Google Maps InfoWindow object
	 */
	$.fn.goomaps.infowindow = function(marker, info, map){
		var infowindow;
		if(typeof info === 'string' && info.match('^#')){
			$(info).hide();
			infowindow = new google.maps.InfoWindow({content: $(info).html()});
		}else{
			infowindow = new google.maps.InfoWindow({content: info});
		}
		$.fn.goomaps.setevents(marker, { 'click': function(){
			infowindow.open(map, marker);
		}});
	};


	/**
	 * Set events from an object containing event callbacks
	 *
	 * @param   {Object} target   The object to attach the event listener to
	 * @param   {Object} events   The event callbacks
	 *
	 */
	$.fn.goomaps.setevents = function(target, events){
		$.each(events, function(event, callback){
			google.maps.event.addListener(target, event, callback);
		});
	};
	/**
	 * Goomaps Default options for initialisation of the map
	 */
	$.fn.goomaps.defaults = {
		center: new google.maps.LatLng(0,0),
		zoom: 10,
		MapTypeId: google.maps.MapTypeId.ROADMAP
	};

	/**
	 * Goomaps debugger switch
	 */
	$.fn.goomaps.debug = false;

	/**
	 * Goomaps plugin version number
	 */
	$.fn.goomaps.pluginVersion = "1.0";

	/**
	 * Google Maps API version number
	 */
	$.fn.goomaps.apiVersion = "3.4";

})(jQuery);