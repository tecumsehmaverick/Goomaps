
// Options to initialise a simple map
var goomap = {
	debug: true;
	center: [15.12345, 1.12345],
//	center: "14 Stevensons Road, Longstanton, Cambridge, CB24 3GY",
	zoom: 10,
	type: "roadmap"
}

// Options to add Markers to a map.
// Single Marker
var marker = {
	options: {
		// Required
		position: [52.257347,0.054988],
	//	position: 'Address string',
		title: '',
		// Optional
		// Custom icon, either string or object of options
	//	icon: '',
		icon: {
			url: '',
			size: [0,0,'px'],
			origin: [0,0],
			anchor: [0,0]
		},
		// Custom shadow, either a string or object of options
	//	shadow: '',
		shadow: {
			url: '',
			size: [0,0,'px'],
			origin: [0,0],
			anchor: [0,0]
		},
		clickable: true,
		draggable: false,
		info: ''
		uid: '',	// string unique identifier, even numbers must be a string!!!
		// user supplied data for storage
		data: {
			key: 'value'
		}
	},
	events: {
		click: function(event){},	// Returns LatLng
		dblclick: function(event){},
		rightclick: function(event){},
		mousedown: function(event){},
		mouseup: function(event){},
		mouseover: function(event){},
		mouseout: function(event){},
		drag: function(event){},
		dragstart: function(event){},
		dragend: function(event){}
	}
}
// Array of markers
var markers = [
	{
		options: {

		},
		events: {

		}
	}
]
// Function returning either Array or Object
var markerfunc = function(){
	//blah code here
	return {};
}


// Options to add Polylines to a map
// Single Polyline
var polyline = {
	points: [
		[15.12345, 1.12345],
		[16.12345, 2.12345],
		[17.12345, 3.12345]
	],
	options: {
		// Required
		strokeColor: '',
		strokeOpacity: 1,
		strokeWeight: 2,
		// Optional
		clickable: true,
		geodesic: false
	},
	events: {
		click: function(event){},
		dblclick: function(){},
		rightclick: function(event){},
		mousedown: function(){},
		mouseup: function(){},
		mouseover: function(){},
		mouseout: function(){}
	}
}
// Array of Polylines
var polylines = [
	{
		points: [

		],
		options: {

		},
		events: {

		}
	}
]
// Function returning either Array or Object
var polylinefunc = function(){}

// Options to add Polygons to a map
// Single Polygon
var polygon = {
	points: [
		[15.12345, 1.12345],
		[16.12345, 2.12345],
		[17.12345, 3.12345]
	],
	options: {
		// Required
		fillColor: '',
		fillOpacity: 1,
		strokeColor: '',
		strokeOpacity: 1,
		strokeWeight: 2,
		// Optional
		clickable: true,
		geodesic: false
	},
	events: {
		click: function(event){},
		dblclick: function(){},
		rightclick: function(event){},
		mousedown: function(){},
		mouseup: function(){},
		mouseover: function(){},
		mouseout: function(){},
		mousemove: function(){}
	}
}
// Array of Polygons
var polygons = [
	{
		points: [

		],
		options: {

		},
		events: {

		}
	}
]
// Function returning either Array or Object
var polygonfunc = function(){}

// Options to add layers to a map
// Single layer
var layer = {
	options: {
		type: '', // bicycling, traffic, fusion, kml
		// Fusion Options
		id: 0, // Fusion table ID
		query: '',
		heatmap: false,
		// KML Options
		url: '',
		// Fusion & KML Options
		clickable: true
	},
	// For KML and Fusion Table layers
	events: {
		click: function(event){}
	}
}

var layers = [
	{
		options: {
			type: '', // bicycling, traffic, fusion, kml
			// Fusion Options
			id: 0, // Fusion table ID
			query: '',
			heatmap: false,
			// KML Options
			url: '',
			// Fusion & KML Options
			clickable: true
		},
		// For KML and Fusion Table layers
		events: {
			click: function(event){}
		}
	}
]