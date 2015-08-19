/**
 * The remote javascript file is to initialize and retrieve remote content in
 * order to embed scriptles
 */

var SEARCH_BANNER = 100;// Search banner scriptlet
var VIEW_BOOKING = 200;// View booking scriptlet
var SEARCH_BANNER_AND_VIEW_BOOKING = 300;// Both Search banner and View booking scriptlets
var SEARCH_POPUP = 400;// Marketing site package search scriptlet
var SEARCH_BANNER_AND_SEARCH_POPUP = 500;// Both search banner and marketing site package search scriptlets

var CGClipper = function(id, type) {
	// Constants for resource urls

	var currTime = new Date().getTime();
	var BASE_URL = getBaseUrl();
	var RESOURCE_URL = getResourceBaseURL();
	var JQUERY_URL = RESOURCE_URL + "js/jquery-1.8.2.min.js";
	var JQUERY_MIGRATE_URL = RESOURCE_URL + "js/jquery-migrate-1.2.1.js";
	
	
	var AVAIL_CALENDAR_URL = RESOURCE_URL + "js/availcal.js?js=" + currTime;
	var CITY_LIST_URL = RESOURCE_URL + "js/cityList.js?js=" + currTime;
	var SEARCH_BANNER_URL = RESOURCE_URL + "js/searchbanner.js?js=" + currTime;
	var NIGHT_DROP_DOWN_UEL = RESOURCE_URL + "js/nightdropdown.js?js=" + currTime;
	var VIEW_BOOKING_URL = RESOURCE_URL + "js/viewBooking.js?js=" + currTime;
	var COMBO_POPUP_BANNER = RESOURCE_URL + "js/comboPopUpBanner.js?js=" + currTime;
	var BROWSER_DETECT = RESOURCE_URL + "js/browserDetect.js?js=" + currTime;

	var CSS_URL_LAYOUT = RESOURCE_URL + "css/C_homeP_BE.css";

	var JSON_CONTENT_URL = BASE_URL + "jaxrs/json/scriptlet?callback=?&type=";

	var TIMEOUT = 1000;

	_id = id;

	// Flag to check whther JQuery is loaded or not
	hasScripts = false;
	// Call to onload function based on the browser support
	if (document.addEventListener) {
		window.addEventListener("load", function() {
			__ready();
		}, false);
	} else if (document.attachEvent) {
		window.attachEvent("onload", function() {
			__ready();
		});
	}

	/**
	 * Add resources to the page and ready for rendering the widgets
	 */
	__ready = function() {
		$__cgj = jQuery.noConflict();// Resolve conflicts
		if (typeof (jQuery) == 'undefined') {
			if (!this.hasScripts) {
				__addScript(JQUERY_URL);
				__addScript(JQUERY_MIGRATE_URL);				
				hasScripts = true;
			}
			setTimeout(__ready, 500);
		} else {
			__addLink(CSS_URL_LAYOUT);
			switch (type) {

			case SEARCH_BANNER:
				$__cgj.when($__cgj.getScript(SEARCH_BANNER_URL),
						$__cgj.getScript(BROWSER_DETECT),
						$__cgj.getScript(CITY_LIST_URL),
						$__cgj.getScript(AVAIL_CALENDAR_URL),
						$__cgj.getScript(NIGHT_DROP_DOWN_UEL),
						$__cgj.Deferred(function(deferred) {
							$__cgj(deferred.resolve);
						})).done(function() {

					__bind(type);
				});
				break;
			case VIEW_BOOKING:
				__addScript(VIEW_BOOKING_URL);
				setTimeout(function() {
					__bind(type);
				}, TIMEOUT);
				break;
			case SEARCH_BANNER_AND_VIEW_BOOKING:

				$__cgj.when($__cgj.getScript(SEARCH_BANNER_URL),
						$__cgj.getScript(BROWSER_DETECT),
						$__cgj.getScript(CITY_LIST_URL),
						$__cgj.getScript(AVAIL_CALENDAR_URL),
						$__cgj.getScript(NIGHT_DROP_DOWN_UEL),
						$__cgj.getScript(VIEW_BOOKING_URL),
						$__cgj.Deferred(function(deferred) {
							$__cgj(deferred.resolve);
						})).done(function() {
					__bind(SEARCH_BANNER);
					__bind(VIEW_BOOKING);
				});
				break;
			case SEARCH_POPUP:
				$__cgj.when($__cgj.getScript(AVAIL_CALENDAR_URL),
						$__cgj.getScript(NIGHT_DROP_DOWN_UEL),
						$__cgj.getScript(COMBO_POPUP_BANNER),
						$__cgj.Deferred(function(deferred) {
							$__cgj(deferred.resolve);
						})).done(function() {
					__bind(SEARCH_POPUP);
				});
				break;
			case SEARCH_BANNER_AND_SEARCH_POPUP:
				$__cgj.when($__cgj.getScript(SEARCH_BANNER_URL),
						$__cgj.getScript(BROWSER_DETECT),
						$__cgj.getScript(CITY_LIST_URL),
						$__cgj.getScript(AVAIL_CALENDAR_URL),
						$__cgj.getScript(NIGHT_DROP_DOWN_UEL),
						$__cgj.getScript(COMBO_POPUP_BANNER),
						$__cgj.Deferred(function(deferred) {
							$__cgj(deferred.resolve);
						})).done(function() {
					__bind(SEARCH_BANNER);
					__bind(SEARCH_POPUP);
				});
				break;
			default:
				break;
			}
		}
	};

	/**
	 * Add script tags to with give source url
	 */
	__addScript = function(u) {
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = u;
		document.getElementsByTagName('head')[0].appendChild(s);
	};

	/**
	 * Add css link tags with given url
	 */
	__addLink = function(u) {
		var l = document.createElement('link');
		l.type = 'text/css';
		l.rel = 'stylesheet';
		l.href = u;
		document.getElementsByTagName('head')[0].appendChild(l);
	};

	/**
	 * Get remote content
	 */
	__bind = function(contentType) {
		$__cgj = jQuery.noConflict();// Resolve conflicts
		// Get json data
		$__cgj.getJSON(JSON_CONTENT_URL + contentType,
						function(response) {
							if (response.status == 1) {
								switch (contentType) {
								case SEARCH_BANNER:
									// process JSON content
									// alert(response.data);
									$__cgj('#' + _id).html(response.data);
									// bind city lists to the search banner
									var cityList = new CityList(
											{onComplete : function() {
													selectedTab = SELECTED_TAB_CLIPPER_ONLY;
													selectedOption = SELECTED_OPTION_ROUND_TRIP;
													initFunctions();
												}
											});
									cityList.init();
									break;
								case VIEW_BOOKING:
									var popUpLeft = ($__cgj(window).width() > 500) ? ($__cgj(window).width() - 500) / 2: 0;
									// process JSON content
									// Since the content is shown in a remote location
									$__cgj('body').prepend(response.data.replace(/CLP_BASE_URL/g, BASE_URL));
									$__cgj("#viewBookingPopUp").css({
										'left' : popUpLeft,
										'top' : '30%',
										'position' : 'absolute',
										'z-index' : 1001
									});
									$__cgj("#loadingAnim").css(
											{
												'left' : ($__cgj(window).width() - 300) / 2,
												'top' : '30%',
												'position' : 'absolute',
												'z-index' : 1002,
												'background' : '#fff'
											});
									var bgBlock = $__cgj("<div/>");
									bgBlock.attr('id', 'ViewBkgBGBlock');
									bgBlock.attr('class', 'ViewBkgBGBlock');
									bgBlock.css('display', 'none');
									$__cgj('body').prepend(bgBlock);

									var viewBkg = new viewBooking();
									viewBkg.init();
									break;
								case SEARCH_POPUP:
									// Calculate popup left
									var popUpLeft = ($__cgj(window).width() > 500) ? ($__cgj(window).width() - 500) / 2: 0;
									var popupDiv = $__cgj(response.data);
									popupDiv.css({
										'left' : popUpLeft,
										'top' : '17%',
										'position' : 'absolute',
										'z-index' : 1001
									});
									// attach the popup to body tag
									$__cgj('body').append(popupDiv);
									$__cgj('body').append($__cgj('<div id="__pumodal"></div>'));
									break;
								default:
									break;
								}
							} else {
								alert(response.message);
							}
						});
	};
};
