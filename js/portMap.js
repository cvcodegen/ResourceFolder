/**
 * @autor Amali
 * @date 30-10-2012 Javascript used to load port location Google map
 */
var BASE_URL = getBaseUrl();
var RESOURCE_URL = getResourceBaseURL();
var WEB_SERVICE_URL_ALL_PORTS = BASE_URL + "jaxrs/json/allPorts?callback=?";
var MAP_VIEW_HEIGHT = 400;
var MAX_ZOOM_LEVEL = 18;
var MIN_ZOOM_LEVEL = 10 ;
var HOTEL_ZOOM_LEVEL = 14;
var DEFAULT_SOOM_LEVEL = 14;
var code;
var results;
var hotelResults = null;
var baseIcon = null;
var filteredIcon = null;

$(document).ready(function() {

	initPortLocationsData(); // load one port data [all data ]
	initMapFunctions();
});

function initMapFunctions()
{
	$("#close").unbind('click');
	$("#close").click(function() {
		$('#portView').hide();
	});

	$("div[id^='tempLoc']").unbind('click');
	$("div[id^='tempLoc']").click(function() {
		loadPortPoint(this.id);
	});
}

/*
 * this call in yourTripPage.js to bind click event
 */
function initMapView() {

	$("#viewAllPorts").unbind('click');
	$("#viewAllPorts").click(function() {
		isMapLoaded=true;
		if(!isNoresults){
			loadMultiplePointsMap();
			$('#hotelMapDiv').css("width", "880px");
			$('#hotelMapDiv').css("height", "450px");
			$('#hotelMapDiv').addClass('pd10 fSiz12 fcol3');
			$('#updatedHotels').hide();
			$('#hotelMapDiv').show();
			$('#htlSortingDiv').css("visibility", "hidden");
		}

		$('#viewAllPorts').hide();
		$('#closeAllPorts').show();

	});

	$("#closeAllPorts").click(function() {
		isMapLoaded=false;
		if(!isNoresults){
			$('#hotelMapDiv').hide();
			$('#updatedHotels').show();
		}
		$('#htlSortingDiv').css("visibility", "");
		$('#viewAllPorts').show();
		$('#closeAllPorts').hide();
	});
}

/*
 * initialize all the port locations
 */

function initPortLocationsData() {

	portUrl = WEB_SERVICE_URL_ALL_PORTS;
	$.getJSON(portUrl, function(response) {
		if (response.status == 1 && (response.data != null)) {
			results = response.data;
		}
	});
}

/*
 * load one point in to map
 */
function loadPortPoint(id) {

	$('#headerText').text($('#' + id).text());

	var pieces = id.split("_");
	code = pieces[1];

	var i = 0;
	while (results[i] != undefined) {
		if (results[i]['code'] == code) {
			initMap(results[i]['lat'], results[i]['lng'], id);
		}
		i++;
	}
}
/*
 * used for load one point
 */
function initMap(lat, lng, id) {

	var mapSWBoundLatlng = new google.maps.LatLng(lat - 4, lng - 4);
	var mapNEBoundLatlng = new google.maps.LatLng(lat + 4, lng + 4);

	mapBounds = new google.maps.LatLngBounds(mapSWBoundLatlng, mapNEBoundLatlng);

	var navigationControlOptions = {
		style : google.maps.NavigationControlStyle.DEFAULT,
		position : google.maps.ControlPosition.RIGHT_TOP
	};

	var mapTypeControlOptions = {
		mapTypeIds : [ "map" ]
	};
	var center = new google.maps.LatLng(lat, lng);

	mapOptions = {
		zoom : DEFAULT_SOOM_LEVEL,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		center : center,
		disableDefaultUI : false,
		navigationControl : true,
		streetViewControl : false,
		scrollwheel : true,
		maxZoom : MAX_ZOOM_LEVEL,
		minZoom : MIN_ZOOM_LEVEL,
		panControl : false,
		zoomControl : true,
		streetViewControl : false,
		rotateControl : false,
		navigationControlOptions : navigationControlOptions,
		mapTypeControlOptions : mapTypeControlOptions
	};

	$("#portViewMap").empty();
	map = new google.maps.Map($("#portViewMap").get(0), mapOptions);

	// load map related data after the map is loaded
	google.maps.event.addListener(map, 'tilesloaded', function() {
	});

	google.maps.event.addListener(map, 'idle', function() {
		// console.log('map loaded');
	});

	var marker = new google.maps.Marker({
		position : center,
		map : map
	});

	showPort(id);
	var c = map.getCenter();
	google.maps.event.trigger(map, 'resize');
	map.setCenter(c);
}

var lastPortId;

/*
 * show position in the pop up one port
 */
function showPort(id) {

	w = $('#' + id).width();
	h = $('#' + id).height();
	p = $('#' + id).offset();
	var zoom = 1;
	var eleZoom = $(".BodyRside").css("zoom");
	if( eleZoom != null && eleZoom != undefined && eleZoom != "normal"){
		zoom = eleZoom;
	}
	$('#portView').css("position", "absolute");
	$('#portView').css('top', ((p.top * zoom) + 50 + 'px'));
	$('#portView').css('left', ((p.left * zoom) - 180 + 'px'));
	$('#portView').css('display', "");
	$('#portView').css('z-index', "1000");

	lastPortId = id;
	$(window).resize(function () {
		//showPort(lastPortId);
		$('#portView').css('display', "none");
	});
}


/*
 * used to display multiple points in the map
 */

function loadMultiplePointsMap() {
	var Hotelurl = BASE_URL + "MapViewDataLoader;jsessionid="+ $("#sid").val() +  "?timestamp="+ new Date().getTime() ;
	$.getJSON(Hotelurl, function(data) {
				hotelResults = eval(data);
				mapLoadingHotel();
			});
}

function mapLoadingHotel(){

	var mapBounds = new google.maps.LatLngBounds(); // Area of the map to be displayed
	var mvMap = new google.maps.Map(document
			.getElementById('hotelMapDiv'), {
		zoom : HOTEL_ZOOM_LEVEL,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	});

	var infowindow = new google.maps.InfoWindow();
	var marker, i;
	contentHtml = [];
	var itemId = $("#itemId").val();
	for (i = 0; i < hotelResults.length; i++) {
		marker = new google.maps.Marker({
			position : new google.maps.LatLng(
					hotelResults[i].lat, hotelResults[i].lng),
			map : mvMap,
			minZoom : MIN_ZOOM_LEVEL
		// title : hotelResults[i].name
		});

		var hotel = hotelResults[i];
		var hotelNo, index, curSymbol, price, name, starRating, lat, lng, image, caption;
		hotelNo = hotel.hotelNo;
		index = hotel.hotelIndex;
		isFiltered = hotel.isFiltered;
		curSymbol = hotel.curSymbol;
		price = hotel.price;
		name = hotel.name;
		starRating = hotel.starRating;
		lat = hotel.lat;
		lng = hotel.lng;
		caption = hotel.imageCaption;
		image = hotel.imageUrl;

		if(typeof String.prototype.trim !== 'function') {
			  String.prototype.trim = function() {
			    return this.replace(/^\s+|\s+$/g, '');
			  }
		}

		if(image == null || image == undefined || (image != null && image.trim().length == 0 )){
			image = "../images/image_not_available150x109.png";
		}

		contentHtml[i] = "<div class='fltLeft pdL10 width248'><div class='fltLeft pdT10'><div width='93' height='69' class='requiredMap175x96' style='background-image:url("
				+ image
				+ ")' ></div><br clear='all' /><div class='fSiz15 fltLeft'>"
				+ name
				+ "</div><br clear='all' /><div class='fSiz14 fltLeft pdT3 fBold fcol3'>"
				+ price
				+ "</div><br clear='all' /><a><div class='fSiz14 fltLeft fSiz12 hnd' onclick='loadAddHotelPopUp(this.id);' id='popupHotelImage-"
				+ index +"-"+itemId+"--hotel"+ "'>" + name + "</div></a></div>";

		google.maps.event
				.addListener(
						marker,
						'click',
						(function(marker, i) {
							return function() {
								infowindow
										.setContent(contentHtml[i]);
								infowindow.open(mvMap,
										marker);
							};
						})(marker, i));

		var latlng = new google.maps.LatLng(lat, lng);
		mapBounds.extend(latlng);
	}

	$('#hotelMapDiv').css("width", "850px");
	$('#hotelMapDiv').css("height", "450px");
	$('#hotelMapDiv').addClass('pd10 fSiz12 fcol3');
	$('#updatedHotels').hide();
	$('#hotelMapDiv').show();

	mvMap.fitBounds(mapBounds);
	var c = mvMap.getCenter();
	google.maps.event.trigger(mvMap, 'resize');
	mvMap.setCenter(c);

}



/*
 * Functionality to load Add hotel pop up
 */
function loadAddHotelPopUp(id) {
	CLICKED_ITEM_ID=id;

	var idSplit = id.split("-");
	var itemType = "hotel";

	var searchType = $("#altType").val();
	var itemId = $("#itemId").val();

	$.blockUI({
		message : $('#detailItem'),
		centerX : false,
		css : {
			width : 'auto',
			left : '12.5%',
			top : '10%'
		},
		overlayCSS : {
			backgroundColor : '#000',
			opacity : '0.5'
		}
	});
	var param = "altIndex=" + idSplit[1] + "&searchType=" + searchType
			+ "&itemId=" + itemId;
	doAjax("jsp/hotel/addAHotel.jsp", param, displayHotelDetailViewCallback,
			"detailItem", "");

}