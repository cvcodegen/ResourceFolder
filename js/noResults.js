/**
 * java script functionality related no results.jsp page
 *
 * @autor Amali
 * @date 16-11-2012
 *
 */

var BASE_URL = getBaseUrl();
var NEXT_AVAILABLE_DATE = BASE_URL + "jaxrs/json/nextAvlDay?callback=?";
var TIMEOUT = 1000;

$(document).ready(function() {
	loadBanner();

});

function loadBanner() {

	var currTime = new Date().getTime();
	var cityList = new CityList();
	cityList.init();
	markError();
	getNextAvailDate();
	changeText();
	setTimeout(function() {
		initFunctions();
		popupSearchBannerOld(false);
	}, TIMEOUT);
}

function addScript(u) {
	var s = document.createElement('script');
	s.type = 'text/javascript';
	s.src = u;
	document.getElementsByTagName('head')[0].appendChild(s);
}

function markError() {

	$('#arrivalDate').addClass('borderRed');
	$('#night').addClass('borderRed');

}

function getNextAvailDate() {

	var tmp = $('#departureDateHF').val();

	var pieces = tmp.split("/");
	year = pieces[2];
	month = pieces[0];
	day = pieces[1];
	var currDate = year + month + day ;

	var key = $('#fromCityHF').val() + "-" + $('#toCityHF').val();

	if ($('#selectedTabHF').val() == "true") {
		isClipper = true;
	} else {
		isClipper = false;
	}

	var urlNoResualt = NEXT_AVAILABLE_DATE + "&currDay=" + currDate + "&key=" + key + "&isClipper=" + isClipper;

	$.getJSON(urlNoResualt, function(response) {
		if (response.status == 1 && (response.data != null)) {
			var msg = response.data ;
			message = msg.substring(4,6) + "/"+ msg.substring(6,8) + "/" + msg.substring(0,4);
			$('#avalDate').text(message);
			$('#notAvalDate').css('display','none');
		} else {
			$('#notAvalDate').text('please choose another date');
			$('#notAvalDate').css('display','');
			$('#dateContaner').hide();
		}
	});

}

function changeText()
{
	var searchType = $('#searchType').val();
	if( searchType === 'TMD' )
	{
		$('#trpError').hide();
		$('#pkgError').show();
	}
	else
	{
		$('#pkgError').hide();
		$('#trpError').show();
	}
}