/**
 * Availability Calendar component
 */

if (BASE_URL == null) {
	var BASE_URL = getBaseUrl();
}

var WEB_SERVICE_URL_CALENDER = BASE_URL + "jaxrs/json/calendar?callback=?";
var LOADING_IMAGE_PATH = BASE_URL + "images/sb_ajax_loader.gif";
var DEFAULT_DATE_FORMAT = 'MM-DD-YYYY';
var year;
var month;
var isClipper ;
var count = 0;
var key;
var currentDate;
var defaultCalander = false;
var tmpToday = new Date();
var firstTimeLoaded = null ;

var Calendar = function(id, opt) {
	var $__cal = jQuery.noConflict();// Resolve conflicts
	var _cal = $__cal('<div class="BKE_Cal" id="baseCal"></div>');
	var _modal = $__cal('<div id="model"></div>');
	var _ajaxLoader = $__cal('<img width="32" height="32" src="'+ LOADING_IMAGE_PATH +'" id="__bcal" style="display:none;position:relative;top:-130px;left:100px;z-index:99999999999;">');
	var _id = id;
	var _opt = opt ? opt : {};
	var _this = this;
	var _year = year ;
	var _month = month ;
	/**
	 * Initialize the component
	 */
	this.init = function() {
		date = _this.getDate();
		year = date.getFullYear();
		month = date.getMonth();

		_cal.hide();
		_this.get(year, month, _this.getDate(true), _this.createKey());

		$__cal('#' + _id).unbind("click");
		$__cal('#' + _id).bind(
				'click',
				function() {
					hideModel();
					date = _this.getDate();
					year = date.getFullYear();
					month = date.getMonth();
					day = date.getDate();
					if (_opt.onStart) {
						_opt.onStart();
					}

					if(selectedTab == SELECTED_TAB_CLIPPER_ONLY){
						isClipper = true ;
					}else{
						isClipper = false ;
					}

					if(_id == "arrivalDate"){
						_this.validateDefaultCal();
					}

					this.today = new Date(year, month, day);
					var lastDay = _this.getLastDayCal();

					if((_id == "departureDate" & $__cal.trim($__cal('#departureDate').val()) == "" & this.today < lastDay) || (_id == "departureDate_pkg" & $__cal.trim($__cal('#departureDate_pkg').val()) == "" & this.today < lastDay)){
						_this.firstTimeLoaded = 1 ;
					}else if(this.today > lastDay){
						_opt.isDefaultCal = true;
					}

					if(opt.multicities != "" & opt.multicities != undefined && $__cal("#" + opt.multicities).val()!="" && $__cal("#" + opt.multicities).val()!= undefined){
						if($__cal("#departureDate_pkg").val() == "" || $__cal("#departureDate_pkg").val() == null ){
							_this.firstTimeLoaded = 1 ;
							firstTimeLoaded = 1 ;
						}
					}

					_this.get(year, month, _this.getDate(true), _this.createKey(), function() {_this.showDivCal();} ,isClipper , _this.firstTimeLoaded);
				});

		$__cal(_modal).unbind('click');
		$__cal(_modal).bind('click', function() {
			_this.hide();
		});
	};

	/**
	 * Creating the key to identify availability
	 */
	this.createKey = function() {

		// get key for multi city [ eg : SEA-YYJ-YVR ]
		if(opt.multicities != "" & opt.multicities != undefined && $__cal("#" + opt.multicities).val()!="" && $__cal("#" + opt.multicities).val()!= undefined){
			key = $__cal("#" + opt.multicities).val();
			var keySet = key.split("-");
			if(keySet.length  < 2){
				key="-";
			}
		}else{
			if($__cal("#" + opt.fromCity).val() !="" && $__cal("#" + opt.toCity).val()!=""){
				fromCity = $__cal("#" + opt.fromCity).val();
				toCity = $__cal("#" + opt.toCity).val();
				key = fromCity + "-" + toCity;
			}
			else{
				key="-";
			}
		}
		return key;
	};

	this.get = function(y, m, s, k, c , isClipper ,firstTimeLoaded ) {
		
		BrowserDetect.init();
		var browserName  = BrowserDetect.Browser;

		if ($__cal.trim(k) == "-" || _opt.isDefaultCal ) {
			defaultCalander = true;
			k = "SEA-YYJ";// Set default values to load the calendar data
			//k=$__cal("#fromCity").val()+"-"+$__cal("#toCity").val();
		} else {
			defaultCalander = false;
			if($__cal("#fromCity").val() != "")
			{
				//Added to get correct availablility on calendar for return date
				if(id=="arrivalDate"){
					k=$__cal("#toCity").val()+"-"+$__cal("#fromCity").val();
				}else{
					k=$__cal("#fromCity").val()+"-"+$__cal("#toCity").val();
				}

			}
		}

		var	urlCalander = WEB_SERVICE_URL_CALENDER + "&year=" + y + "&month=" + m + "&start=" + s.getTime() + "&key=" + k + "&isClipper=" + isClipper;

		if(_this.firstTimeLoaded == 1){
			urlCalander = urlCalander + "&firstTime=" + firstTimeLoaded ;
			_this.firstTimeLoaded = null ;
			firstTimeLoaded = 0 ;
		}

		setTimeout(function(){
		$__cal
				.getJSON(
						urlCalander, function(response) {
							if (response.status == 1) {

								note = _this.setNote(response.data.days);
								_cal.empty();

								br1 = $__cal('<br class="FClear"/>');

								divMain = _cal;

								divContainer = $__cal('<div class="bkRepImg"></div>');

								divOut = $__cal('<div class="CalMonth pdB6"></div>');
								divItem1 = $__cal('<div class="fltLeft width24"></div>');
								imgLeft = $__cal('<img src="'+BASE_URL+'images/cal_left.png" width="24" height="23"></img>');

								divItem2 = $__cal('<div class="fltLeft MaRigAuto MaRigAuto fcol1 fSiz14 txtAlgCenter width170 pdT4 fBold" id="yearMonth">'
										+ (response.data.name + " " + response.data.year)
										+ '</div>');

								divItem3 = $__cal('<div class="fltRight width24"></div>');
								imgRight = $__cal('<img src="'+BASE_URL+'images/cal_right.png" width="24" height="23" style="position:relative; left:-8px;"></img>');

								// Bind click function to prev month action
								imgLeft.unbind('click');
								imgLeft.bind('click', function() {
									_ajaxLoader.show();
									_this.previousMonth();
								});

								// Bind click function to next month action
								imgRight.unbind('click');
								imgRight.bind('click', function() {
									_ajaxLoader.show();
									_this.nextMonth();
								});

								divItem1.append(imgLeft);
								divOut.append(divItem1);
								divOut.append(divItem2);
								divItem3.append(imgRight);
								divOut.append(divItem3);
								divOut.append(br1);
								divContainer.append(divOut);

								divDays = $__cal('<div></div>'); // mon,tue,wed,...
								ulDays = $__cal('<ul class="DaysCal"></ul>');
								ulDays.append($__cal('<li>' + "SUN" + '</li>'));
								ulDays.append($__cal('<li>' + "MON" + '</li>'));
								ulDays.append($__cal('<li>' + "TUE" + '</li>'));
								ulDays.append($__cal('<li>' + "WED" + '</li>'));
								ulDays.append($__cal('<li>' + "THU" + '</li>'));
								ulDays.append($__cal('<li>' + "FRI" + '</li>'));
								ulDays.append($__cal('<li>' + "SAT" + '</li>'));
								divDays.append(ulDays);
								divContainer.append(divDays);

								divDay = $__cal('<div class="DatesCal"></div>'); // 1,2,3,...

								ulDay = $__cal('<ul id="listContainer"></ul>');

								noOfDats = response.data.days.length;
								firstDay = response.data.days[0];

								if (firstDay.code == "Sun") {
									$__cal.each(response.data.days, function(k,
											v) {
										if (v.available) {
											_this.availableDay(ulDay,v.dayOfMonth, v.code,v.lastWeek);
										} else {
											_this.notAvailableDay(ulDay,v.dayOfMonth, v.code,v.lastWeek , defaultCalander);
										}
									});

									_this.addEmtyBoxEnd(ulDay);
									count = 0;

								} else if (firstDay.code == "Mon") {
									templi = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									ulDay.append(templi);
									$__cal.each(response.data.days, function(k,
											v) {
										if (v.available) {
											_this.availableDay(ulDay,v.dayOfMonth, v.code,v.lastWeek);
										} else {
											_this.notAvailableDay(ulDay,v.dayOfMonth, v.code,v.lastWeek ,defaultCalander);
										}
									});
									_this.addEmtyBoxEnd(ulDay);
									count = 0;

								} else if (firstDay.code == "Tue") {
									templi1 = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									templi2 = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									ulDay.append(templi1);
									ulDay.append(templi2);
									$__cal.each(response.data.days, function(k,
											v) {
										if (v.available) {
											_this.availableDay(ulDay,v.dayOfMonth, v.code,v.lastWeek);
										} else {
											_this.notAvailableDay(ulDay,v.dayOfMonth, v.code,v.lastWeek ,defaultCalander);
										}
									});
									_this.addEmtyBoxEnd(ulDay);
									count = 0;

								} else if (firstDay.code == "Wed") {
									templi1 = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									templi2 = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									templi3 = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									ulDay.append(templi1);
									ulDay.append(templi2);
									ulDay.append(templi3);
									$__cal.each(response.data.days, function(k,
											v) {
										if (v.available) {
											_this.availableDay(ulDay,v.dayOfMonth, v.code,v.lastWeek);
										} else {
											_this.notAvailableDay(ulDay,v.dayOfMonth, v.code,v.lastWeek ,defaultCalander);
										}
									});
									_this.addEmtyBoxEnd(ulDay);
									count = 0;

								} else if (firstDay.code == "Thu") {
									templi1 = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									templi2 = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									templi3 = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									templi4 = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									ulDay.append(templi1);
									ulDay.append(templi2);
									ulDay.append(templi3);
									ulDay.append(templi4);
									$__cal.each(response.data.days, function(k,
											v) {
										
										if (v.available) {
											_this.availableDay(ulDay,v.dayOfMonth, v.code,v.lastWeek);
										} else {
											_this.notAvailableDay(ulDay,v.dayOfMonth, v.code,v.lastWeek ,defaultCalander);
										}
									});
									_this.addEmtyBoxEnd(ulDay);
									count = 0;

								} else if (firstDay.code == "Fri") {
									templi1 = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									templi2 = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									templi3 = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									templi4 = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									templi5 = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									ulDay.append(templi1);
									ulDay.append(templi2);
									ulDay.append(templi3);
									ulDay.append(templi4);
									ulDay.append(templi5);
									$__cal.each(response.data.days, function(k,
											v) {
										if (v.available) {
											_this.availableDay(ulDay,v.dayOfMonth, v.code,v.lastWeek);
										} else {
											_this.notAvailableDay(ulDay,v.dayOfMonth, v.code,v.lastWeek ,defaultCalander);
										}
									});
									_this.addEmtyBoxEnd(ulDay);
									count = 0;

								} else if (firstDay.code == "Sat") {

									templi1 = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									templi2 = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									templi3 = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									templi4 = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									templi5 = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									templi6 = $__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
									ulDay.append(templi1);
									ulDay.append(templi2);
									ulDay.append(templi3);
									ulDay.append(templi4);
									ulDay.append(templi5);
									ulDay.append(templi6);
									$__cal.each(response.data.days, function(k,
											v) {
										if (v.available) {
											_this.availableDay(ulDay,v.dayOfMonth, v.code,v.lastWeek);
										} else {
											_this.notAvailableDay(ulDay,v.dayOfMonth, v.code,v.lastWeek ,defaultCalander);
										}
									});
									_this.addEmtyBoxEnd(ulDay);
									count = 0;

								}

								br2 = $__cal('<br class="FClear"/>');
								ulDay.append(br2);
								
								divDay.append(ulDay);
								divFooter = $__cal('<div  class=" NDRow"></div>'); // check box
								divIn1 = $__cal('<div class="fltLeft NDDiv"></div>');
								divIn2 = $__cal('<div class="fltLeft fSiz11 fcol3  pdL10 pdT4">'
										+ " No Availability " + '</div>');
								br3 = $__cal('<br class="FClear"/>');
								divFooter.append(divIn1);
								divFooter.append(divIn2);
								divFooter.append(br3);


								dateTemp = _this.getDate(true);
								
								if (  !defaultCalander) {
									divDay.append(divFooter); // append note only for availability
									if (!(note == null | note == "")) {

										divNote = $__cal('<div class="InfoPop2">'
												+ note + '</div>');
										divDay.append(divNote);
									}
							}

								_year = response.data.year ;
								_month = response.data.monthOfYear ;

								divContainer.append(divDay);
								divMain.append(divContainer);
								_cal.append(_ajaxLoader);

								$__cal('#' + _id).after(_modal);
								$__cal('#' + _id).after(divMain);

								// current dare
								if (response.data.monthOfYear == dateTemp.getMonth()) {
									if (response.data.year == dateTemp.getFullYear()) {
										currentDate = dateTemp.getDate();
										$__cal("li[id=" + (currentDate - 1)+ "]").addClass('SpDateBg');
									}
								}

								_this.bindEvents(ulDay, response.data.year, response.data.monthOfYear);
							}

							// Call to end function in the options
							if (_opt.onEnd) {
								_opt.onEnd();
							}
							// Call to callback if available
							if (c) {
								c();
							}
							//Hide calendar loading icon ofr next/prev
							_ajaxLoader.hide();
						});
		},500);
		//console.log(defaultCalander);
	};

	this.bindEvents = function(ul, y, m) {
		$__cal(ul)
				.find('li')
				.click(
						function() {
							available = ($__cal(this).prop("class").indexOf("DtNotAvil") == -1)& ($__cal(this).prop("class").indexOf("emptyClass") == -1);
							if (available) {
								date = new Date(y, m, parseInt($__cal(this).html(), 10));

								if (_opt.format) {
									$__cal('#' + _id).val(_this.dateFormat(date,_opt.format));
								} else {
									$__cal('#' + _id).val(_this.dateFormat(date,DEFAULT_DATE_FORMAT));
								}

								if (_opt.select) {
									_opt.select(date);
								}

								if(_id == "departureDate"){
									$__cal('#arrivalDate').val("");
								}

								// Clear today parameter
								_this.today = null;
								_this.hide();

								if(_opt.departureDate=="changeDateDepartureDate" || _opt.departureDate=="changeHotelDepartureDate"){
									var nightList = new NightDropDown(id, {
										onComplete : loading(true),
										departureDate : _opt.departureDate,
										nightId : _opt.nightId,
										fromCity : _opt.fromCity,
										toCity : _opt.toCity
									});
									loading(false);
									nightList.init();
									setTimeout(function(){
										// $("#"+_opt.nightId+"  option[value='0']").css("display","none");
										if($("#searchedNights").val()==0){
											val=0;
										}
										else{
											$("#"+_opt.nightId+"  option[value='0']").css("display","none");
											val=$("#changeDateNightsHF").val();
										}
										 showSelectedVal(val,_opt.nightId);
										 $("#"+_opt.nightId+"  option[value^='t_']").prop("selected","selected");
									 },50);
								}
								else{
								if (selectedTab.toLowerCase() == SELECTED_TAB_COMBO.toLowerCase() & LOAD_NIGHT_DROPDOWN == true  && !_opt.alternativePopUpBanner ) {
									if (selectedOption.toLowerCase() == SELECTED_OPTION_ROUND_TRIP.toLowerCase()) {

										var nightList = new NightDropDown(id, {
											onComplete : loading(true),
											departureDate : _opt.departureDate,
											nightId : _opt.nightId,
											fromCity : _opt.fromCity,
											toCity : _opt.toCity,
											multicities : _opt.multicities ,
											defaultCalander : defaultCalander
										});
										loading(false);
										nightList.init();
									}
								}
							}
							}
						});
	};

	this.hide = function() {
		_cal.hide();
		_modal.hide();
		year = '';
		month = '';
		this.today = _this.getDate();
		_opt.isDefaultCal = false ;

	};

	/**
	 * Format date as a string
	 *
	 * @param date -
	 *            a date object (usually "new Date();")
	 * @param format -
	 *            a string format, eg. "DD-MM-YYYY"
	 */
	this.dateFormat = function(date, format) {
		// Calculate date parts and replace instances in format string
		// accordingly
		format = format.replace("DD", (date.getDate() < 10 ? '0' : '')
				+ date.getDate()); // Pad with '0' if needed
		format = format.replace("MM", (date.getMonth() < 9 ? '0' : '')
				+ (date.getMonth() + 1)); // Months are zero-based
		format = format.replace("YYYY", date.getFullYear());
		return format;
	};

	/**
	 * Parse data object
	 *
	 */

	this.getDate = function(s) {
		var date = new Date();
		var dstr = $__cal.trim( s ? "" : $__cal('#' + _id).val());

		var format = _opt.format ? _opt.format : DEFAULT_DATE_FORMAT;

		if (dstr == "" && _opt.minDate) {
			dstr = $__cal.trim($__cal('#' + opt.minDate).val());
		}

		if (dstr != "") {
			var di = format.indexOf("DD");
			// var d = parseInt(dstr.substring(di, di + 2));
			var d = dstr.substring(di, di + 2);

			var mi = format.indexOf("MM");
			// var m = parseInt(dstr.substring(mi, mi + 2)) - 1;
			var m = dstr.substring(mi, mi + 2) - 1;

			var yi = format.indexOf("YYYY");
			// var y = parseInt(dstr.substring(yi, yi + 4));
			var y = dstr.substring(yi, yi + 4);

			date = new Date(y, m, d);
		}

		return date;
	};

	this.showDivCal = function() {

		w = $__cal('#' + _id).width();
		h = $__cal('#' + _id).height() + 10;
		p = $__cal('#' + _id).position();

        var minHeight = window.innerHeight - _cal.height();

        if(_cal.height() > minHeight){
            h =  h - 25;
        }

        // Set calendar
        _cal.css("top", (p.top + h));

		if(window.innerWidth > 600){
			_cal.css("left", ((p.left-95) + 'px'));
		}else{
			_cal.css("left", ((p.left-45) + 'px'));
		}
		_cal.css("position", "absolute");
		_cal.css("z-index", "99999999");
		// Set modal
		_modal.css("top", 0);
		_modal.css("left", 0);
		_modal.css("position", "fixed");
		_modal.css("z-index", "999999");
		_modal.css("width", "100%");
		_modal.css("height", "100%");

		_cal.show();
		_modal.show();
	};

	/*
	 * function to create li element considering availability,last week ,satday
	 */
	this.availableDay = function(ulDay, day, code, lastWk) {

		if (code == "Sat") { // satday
			if (lastWk) { // last week - true
				ulDay.append($__cal('<li class="DayB hnd" id="' + day + '">' // available ,sat ,lastWk
						+ (day + 1) + '</li>'));
				count++;

			} else {
				ulDay.append($__cal('<li class="DayB CalDtBoBLine hnd" id="' + day
						+ '">' // available ,sat ,non lastWk
						+ (day + 1) + '</li>'));
			}

		} else { // non sat
			if (lastWk) { // last week - true
				ulDay.append($__cal('<li class="DayB CalDtBoRLine hnd" id="' + day
						+ '">' // available ,non sat ,lastWk
						+ (day + 1) + '</li>'));
				count++;
			} else {
				ulDay
						.append($__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine hnd" id="'
								+ day + '">' // available ,non sat , non lastWk
								+ (day + 1) + '</li>'));
			}
		}
	};

	this.notAvailableDay = function(ulDay, day, code, lastWk, defaultCalander) {

		var x= new Date();
		if($__cal('#departureDate').val() != ""){
			var dateDpt = $__cal('#departureDate').val();
			tmpToday.setFullYear(dateDpt.split('/')[2] , dateDpt.split('/')[0]-1 , dateDpt.split('/')[1] );
		}

		x.setFullYear(year,month,day+1 );

		if (defaultCalander &  x > tmpToday ) {
			_this.availableDay(ulDay, day, code, lastWk);
			tmpToday = new Date();
		} else {

			if (code == "Sat") {
				if (lastWk) { // last week - true
					ulDay.append($__cal('<li class="DayB DtNotAvil" id="' + day
							+ '">' // not available ,sat ,lastWk
							+ (day + 1) + '</li>'));
					count++;
				} else {
					ulDay
							.append($__cal('<li class="DayB CalDtBoBLine DtNotAvil" id="'
									+ day + '">' // not available ,sat ,non lastWk
									+ (day + 1) + '</li>'));
				}

			} else {
				if (lastWk) {
					ulDay
							.append($__cal('<li class="DayB CalDtBoRLine DtNotAvil" id="'
									+ day + '">' // not available ,non sat,lastWk
									+ (day + 1) + '</li>'));
					count++;
				} else {
					ulDay
							.append($__cal('<li class="DayB CalDtBoRLine  CalDtBoBLine DtNotAvil" id="'
									+ day + '">' // not available , non sat , non lastWk
									+ (day + 1) + '</li>'));
				}
			}

		}

	};

	this.addEmtyBoxEnd = function(ulDay) {

		templi1 = $__cal('<li class="DayB CalDtBoRLine emptyClass"></li>');
		templi2 = $__cal('<li class="DayB CalDtBoRLine emptyClass"></li>');
		templi3 = $__cal('<li class="DayB CalDtBoRLine emptyClass"></li>');
		templi4 = $__cal('<li class="DayB CalDtBoRLine emptyClass"></li>');
		templi5 = $__cal('<li class="DayB CalDtBoRLine emptyClass"></li>');
		templi6 = $__cal('<li class="DayB emptyClass"></li>');

		if (count == 1) {
			ulDay.append(templi1);
			ulDay.append(templi2);
			ulDay.append(templi3);
			ulDay.append(templi4);
			ulDay.append(templi5);
			ulDay.append(templi6);

		} else if (count == 2) {
			ulDay.append(templi1);
			ulDay.append(templi2);
			ulDay.append(templi3);
			ulDay.append(templi4);
			ulDay.append(templi6);

		} else if (count == 3) {
			ulDay.append(templi1);
			ulDay.append(templi2);
			ulDay.append(templi3);
			ulDay.append(templi6);

		} else if (count == 4) {

			ulDay.append(templi1);
			ulDay.append(templi2);
			ulDay.append(templi6);

		} else if (count == 5) {
			ulDay.append(templi1);
			ulDay.append(templi6);

		} else if (count == 6) {
			ulDay.append(templi6);

		}
	};

	this.previousMonth = function() {

		tmpToday = new Date();
		if (!this.today) {
			this.today = _this.getDate();
		}

//		year = parseInt ($__cal('#hidenInputYear').val());
//		month =  parseInt($__cal('#hidenInputMonth').val());
//		day = this.today.getDate();

/*		year = this.today.getFullYear();
		month = this.today.getMonth();*/

		year = _year ;
		month = _month ;
		day =1;
		key = _this.createKey();

		if (month < 1) {
			month = 12;
			year = year - 1;
		}

		month = month - 1;
		this.today = new Date(year, month, day);

		var lastDay = _this.getLastDayCal();
		if (this.today > lastDay) {
				_opt.isDefaultCal = true;
		}else{
			_opt.isDefaultCal = false;
		}

		if(selectedTab == SELECTED_TAB_CLIPPER_ONLY){
			isClipper = true ;
		}else{
			isClipper = false ;
		}

		_this.get(year, month, _this.getDate(true), key ,function() {_this.showDivCal();}  ,isClipper);
	};

	this.nextMonth = function() {

		tmpToday = new Date();
		if (!this.today) {
			this.today = _this.getDate();
		}

//		year = parseInt ($__cal('#hidenInputYear').val());
//		month =  parseInt($__cal('#hidenInputMonth').val());
//		day = this.today.getDate();

	/*	year = this.today.getFullYear();
		month = this.today.getMonth();*/

		year = _year ;
		month = _month ;
		day =1;
		key = _this.createKey();

		if (month > 10) {
			month = -1;
			year = year + 1;
		}
		month = month + 1;
		this.today = new Date(year, month, day);

		var lastDay = _this.getLastDayCal();
		if (this.today > lastDay) {
			_opt.isDefaultCal = true;
		}else{
			_opt.isDefaultCal = false;
		}

		if(selectedTab == SELECTED_TAB_CLIPPER_ONLY){
			isClipper = true ;
		}else{
			isClipper = false ;
		}

		_this.get(year, month, _this.getDate(true), key, function() {_this.showDivCal();}  ,isClipper);
	};

	this.setNote = function(data) {

		for (var i = 0; i < data.length; i++) {
			if ( !(data[i].note == null | data[i].note == "")) {
				return note = data[i].note;
			}
		}
	};

	this.getLastDayCal = function(){

		var  tmpLastDay = new Date(new Date(tmpToday).setMonth(tmpToday.getMonth() + 5 ,1));
		var tm = tmpLastDay.getMonth();
		var ty = tmpToday.getFullYear();
		var tLy = tmpLastDay.getFullYear();
		var lastDay ;
		var isLeapYear = false ;

		if( ty % 4 == 0){
			isLeapYear = true ;
		}

		if( tm == 0 | tm == 2 |tm == 4 | tm == 6 | tm == 7 | tm == 9 | tm == 11 ){
			lastDay = new Date(new Date(tmpToday).setMonth(tm , 31));
		}else if( tm == 1 ){
			if(isLeapYear){
				lastDay = new Date(new Date(tmpToday).setMonth(tm ,29));
			}else{
				lastDay = new Date(new Date(tmpToday).setMonth(tm ,28));
			}
		}else{
			 lastDay = new Date(new Date(tmpToday).setMonth(tm,30));
		}
		
		//Calendar in Booking Widget Not Reflecting Availability (CEM-815297)
		if(tLy > ty)
		{
			lastDay = new Date(new Date(lastDay).setYear(tLy));
		}

		return lastDay ;
	};


	this.validateDefaultCal = function() {

		var lastDay = _this.getLastDayCal();
		var depTmpDay = $__cal('#departureDate').val();
		var arrTmpDay = $__cal('#arrivalDate').val();

		if( !depTmpDay == "" | !arrTmpDay == ""){

			var dptDate = new Date( depTmpDay.split('/')[2] , depTmpDay.split('/')[0]-1 , depTmpDay.split('/')[1] );
			var arrDate = new Date( arrTmpDay.split('/')[2] , arrTmpDay.split('/')[0]-1 , arrTmpDay.split('/')[1] );

			if(dptDate > lastDay | arrDate > lastDay){
					_opt.isDefaultCal = true ;
				}else{
					_opt.isDefaultCal = false ;
				}
		}

	};

};