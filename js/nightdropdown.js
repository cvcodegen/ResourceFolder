/**
 * @autor Amali
 * @date 24-10-2012 Javascript used to load the Night drop down list
 */
var isClipper ;

if (BASE_URL == null) {
	var BASE_URL = getBaseUrl();
}

var WEB_SERVICE_URL_NIGHT = BASE_URL + "jaxrs/json/nightDropDown?callback=?";

var NightDropDown = function(id, opt) {
	$__night = jQuery.noConflict();// Resolve conflicts
	_thisN = this;
	_id=opt.nightId;
	_opt = opt ? opt : {};
	_isDefaultDropDown=false;

	this.init = function() {

		if ($__night('#' + opt.departureDate).val() == null || $__night('#' + opt.departureDate).val() == "" ) {

			date = new Date();
			year = date.getFullYear();
			month = date.getMonth();
			var tmpMonth = month +1  ;
			if(tmpMonth.toString.length == 1){
				tmpMonth = '0'+ tmpMonth ;
			}
			day = date.getDate();
			dayStr = (day < 10 ? '0' : '') + day;
			$__night('#' + opt.departureDate).val((tmpMonth) + "/" + dayStr + "/" + year);

		} else {

			temp = $__night('#' + opt.departureDate).val();
			var pieces = temp.split("/");
			year = pieces[2];
			month = pieces[0] - 1; // 0= jan , 11 = dec
			day = pieces[1];
		}
		// check multi cities

		if( opt.multicities != "" & opt.multicities != undefined && $__night("#" + opt.multicities).val()!="" && $__night("#" + opt.multicities).val()!= undefined){
			cityList = $__night("#" + opt.multicities).val();
			var cities = cityList.split("-");
			key = cities[cities.length -1];
			for( var k = cities.length-2 ; k >= 0 ; k --){
				key = key + "-" + cities[k];
			}

		}else{
			if(opt.fromCity!="" && opt.toCity!=""){
				fromCity =$__night('#'+opt.fromCity).val();
				toCity = $__night('#'+opt.toCity).val();
				key = toCity + "-" + fromCity;
			}
			else{
				key="-";
			}
		}

		if(_id=="changeHotelNights" || defaultCalander){
			_isDefaultDropDown=true;
		}

		if(selectedTab == SELECTED_TAB_CLIPPER_ONLY){
			isClipper = true ;
		}else{
			isClipper = false ;
		}

		_thisN.get(year, month, day, key , isClipper,_isDefaultDropDown );
	};

	this.get = function(y, m, d, rs ,isClipper,isDefaultDropDown) {

		  if(document.getElementById(opt.nightId).options.length > 9 ){
			  ulNight = $__night("#"+opt.nightId).empty();
		  }

		if ($__night.trim(rs) == "-") {
			//console.log("No City");
			return ;
		} else {
		var	urlNight = WEB_SERVICE_URL_NIGHT + "&year=" + y + "&month=" + m + "&day=" + d + "&route=" + rs + "&isClipper=" + isClipper;
			$__night
					.getJSON(
							urlNight,
							function(response) {
								if (response.status == 1) {

									ulNight = $__night("#" + opt.nightId);
									$__night("#" + opt.nightId + " option[value^='t_']").css("display", "none");

									$__night
											.each(
													response.data,
													function(k, v) {
														if (k == 0) {
															ulNight
																	.append($__night('<option value ="'
																			+ k
																			+ '">'
																			+ "0	  Day Trip"
																			+ '</option>'));
														} else {
															if (v.available || isDefaultDropDown) {
																ulNight
																		.append($__night('<option value="'
																				+ k
																				+ '">'
																				+ k
																				+ "   "
																				+ "Returns "
																				+ v.code
																				+ " "
																				+ v.month
																				+ " "
																				+ v.dayOfMonth
																				+ '</option>'));
															} else {
																ulNight
																		.append($__night('<option disabled="disabled">'
																				+ k
																				+ "    "
																				+ "Returns "
																				+ v.code
																				+ "  "
																				+ v.month
																				+ "  "
																				+ v.dayOfMonth
																				+ '</option>'));
															}
														}
													});
									ulNight.css('width', '125');

									// BUG 558
									if(_opt.nightId=="nights_pkg"){
										var defaultNights=0;
										if($__night("#defaultNights").val()!=null && $__night("#defaultNights").val()!=""){
											defaultNights=$__night("#defaultNights").val();
											if(!response.data[defaultNights].available){
												defaultNights=0;
											}
										}
										popUpBannerShowSelectedNights(defaultNights,_opt.nightId);
									}

								}

								// Call the callback if available
								if (_opt.onComplete) {
									_opt.onComplete();
								}
							});

		}

	};
};