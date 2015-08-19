/**
 * @autor Amali
 * @date 06-02-2013 Javascript  for Calendar component  change date component
 *
 */

if (BASE_URL == null) {
	var BASE_URL = getBaseUrl();
}

var WEB_SERVICE_URL_calChangeENDER_CD = BASE_URL + "jaxrs/json/calendar?callback=?";
var DEFAULT_DATE_FORMAT = 'MM-DD-YYYY';
var yearChange;
var monthChange;
var isClipper = true;
var countChange = 0;
var key;
var currentDate;
var tmpToday = new Date();
var firstTimeLoaded = null;

var ChangeDatesCalander = function(id, opt) {
	var $__calChange = jQuery.noConflict();// Resolve conflicts
	var _calChange = $__calChange('<div class="BKE_Cal" id="baseCalChange"></div>');
	var _modal = $__calChange('<div id="modelBase"></div>');
	var _idBase = id;
	var _opt = opt ? opt : {};
	var _thisCD = this;
	/**
	 * Initialize the component
	 */
	this.init = function() {
		date = _thisCD.getDate();
		yearChange = date.getFullYear();
		monthChange = date.getMonth();

		_calChange.hide();
		_thisCD.get(yearChange, monthChange, _thisCD.getDate(true), "SEA-YYJ");

		$__calChange('#' + _idBase).unbind("click");
		$__calChange('#' + _idBase).bind('click', function() {
			date = _thisCD.getDate();
			yearChange = date.getFullYear();
			monthChange = date.getMonth();
			day = date.getDate();
			if (_opt.onStart) {
				_opt.onStart();
			}

			_thisCD.get(yearChange, monthChange, _thisCD.getDate(true), "SEA-YYJ", function() {
				_thisCD.showDivCal();
			}, isClipper, _thisCD.firstTimeLoaded);
		});

		$__calChange(_modal).unbind('click');
		$__calChange(_modal).bind('click', function() {
			_thisCD.hide();
		});
	};

	this.get = function(y, m, s, k, c, isClipper, firstTimeLoaded) {

		defaultCalander = true;

		var changeDatesURL = WEB_SERVICE_URL_calChangeENDER_CD + "&year=" + y + "&month="
				+ m + "&start=" + s.getTime() + "&key=" + k + "&isClipper="
				+ isClipper;

		setTimeout(
				function() {
					$__calChange
							.getJSON(
									changeDatesURL,
									function(response) {
										if (response.status == 1) {

											_calChange.empty();
											br1 = $__calChange('<br class="FClear"/>');

											divMain = _calChange;

											divContainer = $__calChange('<div class="bkRepImg"></div>');

											divOut = $__calChange('<div class="CalMonth pdB6"></div>');
											divItem1 = $__calChange('<div class="fltLeft width24"></div>');
											imgLeft = $__calChange('<img src="'
													+ BASE_URL
													+ 'images/cal_left.png" width="24" height="23"></img>');

											divItem2 = $__calChange('<div class="fltLeft MaRigAuto MaRigAuto fcol1 fSiz14 txtAlgCenter width170 pdT4 fBold" id="yearMonth">'
													+ (response.data.name + " " + response.data.year)
													+ '</div>');

											divItem3 = $__calChange('<div class="fltRight width24"></div>');
											imgRight = $__calChange('<img src="'
													+ BASE_URL
													+ 'images/cal_right.png" width="24" height="23" style="position:relative; left:-8px;"></img>');

											// Bind click function to prev month
											// action
											imgLeft.unbind('click');
											imgLeft.bind('click', function() {
												_thisCD.previousMonth();
											});

											// Bind click function to next month
											// action
											imgRight.unbind('click');
											imgRight.bind('click', function() {
												_thisCD.nextMonth();
											});

											divItem1.append(imgLeft);
											divOut.append(divItem1);
											divOut.append(divItem2);
											divItem3.append(imgRight);
											divOut.append(divItem3);
											divOut.append(br1);
											divContainer.append(divOut);

											divDays = $__calChange('<div></div>'); // mon,tue,wed,...
											ulDays = $__calChange('<ul class="DaysCal"></ul>');
											ulDays.append($__calChange('<li>' + "SUN"+ '</li>'));
											ulDays.append($__calChange('<li>' + "MON"+ '</li>'));
											ulDays.append($__calChange('<li>' + "TUE"+ '</li>'));
											ulDays.append($__calChange('<li>' + "WED"+ '</li>'));
											ulDays.append($__calChange('<li>' + "THU"+ '</li>'));
											ulDays.append($__calChange('<li>' + "FRI"+ '</li>'));
											ulDays.append($__calChange('<li>' + "SAT"+ '</li>'));
											divDays.append(ulDays);
											divContainer.append(divDays);

											divDay = $__calChange('<div class="DatesCal"></div>'); // 1,2,3,...

											ulDay = $__calChange('<ul id="listContainer"></ul>');

											noOfDats = response.data.days.length;
											firstDay = response.data.days[0];

											if (firstDay.code == "Sun") {
												$__calChange.each(response.data.days, function(k,
														v) {
													if (v.available) {
														_thisCD.availableDayChange(ulDay,v.dayOfMonth, v.code,v.lastWeek);
													} else {
														_thisCD.notAvailableDayChange(ulDay,v.dayOfMonth, v.code,v.lastWeek , defaultCalander);
													}
												});

												_thisCD.addEmtyBoxEnd(ulDay);
												countChange = 0;

											} else if (firstDay.code == "Mon") {
												templi = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												ulDay.append(templi);
												$__calChange.each(response.data.days, function(k,
														v) {

													if (v.available) {
														_thisCD.availableDayChange(ulDay,v.dayOfMonth, v.code,v.lastWeek);
													} else {
														_thisCD.notAvailableDayChange(ulDay,v.dayOfMonth, v.code,v.lastWeek , defaultCalander);
													}
												});
												_thisCD.addEmtyBoxEnd(ulDay);
												countChange = 0;

											} else if (firstDay.code == "Tue") {
												templi1 = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												templi2 = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												ulDay.append(templi1);
												ulDay.append(templi2);
												$__calChange.each(response.data.days, function(k,
														v) {

													if (v.available) {
														_thisCD.availableDayChange(ulDay,v.dayOfMonth, v.code,v.lastWeek);
													} else {
														_thisCD.notAvailableDayChange(ulDay,v.dayOfMonth, v.code,v.lastWeek , defaultCalander);
													}
												});
												_thisCD.addEmtyBoxEnd(ulDay);
												countChange = 0;

											} else if (firstDay.code == "Wed") {
												templi1 = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												templi2 = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												templi3 = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												ulDay.append(templi1);
												ulDay.append(templi2);
												ulDay.append(templi3);
												$__calChange.each(response.data.days, function(k,
														v) {

													if (v.available) {
														_thisCD.availableDayChange(ulDay,v.dayOfMonth, v.code,v.lastWeek);
													} else {
														_thisCD.notAvailableDayChange(ulDay,v.dayOfMonth, v.code,v.lastWeek , defaultCalander);
													}
												});
												_thisCD.addEmtyBoxEnd(ulDay);
												countChange = 0;

											} else if (firstDay.code == "Thu") {
												templi1 = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												templi2 = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												templi3 = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												templi4 = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												ulDay.append(templi1);
												ulDay.append(templi2);
												ulDay.append(templi3);
												ulDay.append(templi4);
												$__calChange.each(response.data.days, function(k,
														v) {

													if (v.available) {
														_thisCD.availableDayChange(ulDay,v.dayOfMonth, v.code,v.lastWeek);
													} else {
														_thisCD.notAvailableDayChange(ulDay,v.dayOfMonth, v.code,v.lastWeek , defaultCalander);
													}
												});
												_thisCD.addEmtyBoxEnd(ulDay);
												countChange = 0;

											} else if (firstDay.code == "Fri") {
												templi1 = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												templi2 = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												templi3 = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												templi4 = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												templi5 = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												ulDay.append(templi1);
												ulDay.append(templi2);
												ulDay.append(templi3);
												ulDay.append(templi4);
												ulDay.append(templi5);
												$__calChange.each(response.data.days, function(k,
														v) {

													if (v.available) {
														_thisCD.availableDayChange(ulDay,v.dayOfMonth, v.code,v.lastWeek);
													} else {
														_thisCD.notAvailableDayChange(ulDay,v.dayOfMonth, v.code,v.lastWeek , defaultCalander);
													}
												});
												_thisCD.addEmtyBoxEnd(ulDay);
												countChange = 0;

											} else if (firstDay.code == "Sat") {

												templi1 = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												templi2 = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												templi3 = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												templi4 = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												templi5 = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												templi6 = $__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine emptyClass"></li>');
												ulDay.append(templi1);
												ulDay.append(templi2);
												ulDay.append(templi3);
												ulDay.append(templi4);
												ulDay.append(templi5);
												ulDay.append(templi6);
												$__calChange.each(response.data.days, function(k,
														v) {

													if (v.available) {
														_thisCD.availableDayChange(ulDay,v.dayOfMonth, v.code,v.lastWeek);
													} else {
														_thisCD.notAvailableDayChange(ulDay,v.dayOfMonth, v.code,v.lastWeek , defaultCalander);
													}
												});
												_thisCD.addEmtyBoxEnd(ulDay);
												countChange = 0;

											}

											br2 = $__calChange('<br class="FClear"/>');
											ulDay.append(br2);
											divDay.append(ulDay);
											divFooter = $__calChange('<div  class=" NDRow"></div>'); // check
											// box
											divIn1 = $__calChange('<div class="fltLeft NDDiv"></div>');
											divIn2 = $__calChange('<div class="fltLeft fSiz11 fcol3  pdL10 pdT4">'
													+ " No Availability "
													+ '</div>');
											br3 = $__calChange('<br class="FClear"/>');
											divFooter.append(divIn1);
											divFooter.append(divIn2);
											divFooter.append(br3);

											dateTemp = _thisCD.getDate(true);

											divContainer.append(divDay);
											divMain.append(divContainer);

											$__calChange('#' + _idBase).after(_modal);
											$__calChange('#' + _idBase).after(divMain);

											// current dare
											if (response.data.monthOfYear == dateTemp
													.getMonth()) {
												if (response.data.year == dateTemp
														.getFullYear()) {
													currentDate = dateTemp
															.getDate();
													$__calChange(
															"li[id="
																	+ (currentDate - 1)
																	+ "]")
															.addClass(
																	'SpDateBg');
												}
											}

											_thisCD.bindEvents(ulDay,
													response.data.year,
													response.data.monthOfYear);
										}

										// Call to end function in the options
										if (_opt.onEnd) {
											_opt.onEnd();
										}
										// Call to callback if available
										if (c) {
											c();
										}

									});
				}, 500);
		// console.log(defaultCalander);
	};

	this.bindEvents = function(ul, y, m) {
		$__calChange(ul)
				.find('li')
				.click(
						function() {
							available = ($__calChange(this).attr("class").indexOf(
									"DtNotAvil") == -1)
									& ($__calChange(this).attr("class").indexOf(
											"emptyClass") == -1);
							if (available) {
								date = new Date(y, m, parseInt($__calChange(this)
										.html(), 10));

								if (_opt.format) {
									$__calChange('#' + _idBase)
											.val(
													_thisCD.dateFormat(date,
															_opt.format));
								} else {
									$__calChange('#' + _idBase).val(
											_thisCD.dateFormat(date,
													DEFAULT_DATE_FORMAT));
								}

								if (_opt.select) {
									_opt.select(date);
								}

								// Clear today parameter
								_thisCD.today = null;
								_thisCD.hide();

								if (_opt.departureDate == "changeDateDepartureDate"
										|| _opt.departureDate == "changeHotelDepartureDate") {
									var nightList = new NightDropDown(id, {
										onComplete : loading(true),
										departureDate : _opt.departureDate,
										nightId : _opt.nightId,
										fromCity : _opt.fromCity,
										toCity : _opt.toCity
									});
									loading(false);
									nightList.init();
									setTimeout(
											function() {
												// $("#"+_opt.nightId+"
												// option[value='0']").css("display","none");
												if ($("#searchedNights").val() == 0) {
													val = 0;
												} else {
													$(
															"#"
																	+ _opt.nightId
																	+ "  option[value='0']")
															.css("display",
																	"none");
													val = $(
															"#changeDateNightsHF")
															.val();
												}
												showSelectedVal(val,
														_opt.nightId);
												$(
														"#"
																+ _opt.nightId
																+ "  option[value^='t_']")
														.prop("selected",
																"selected");
											}, 50);
								} else {
									if (selectedTab == SELECTED_TAB_COMBO
											& LOAD_NIGHT_DROPDOWN == true) {
										if (selectedOption == SELECTED_OPTION_ROUND_TRIP) {

											var nightList = new NightDropDown(
													id,
													{
														onComplete : loading(true),
														departureDate : _opt.departureDate,
														nightId : _opt.nightId,
														fromCity : _opt.fromCity,
														toCity : _opt.toCity
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
		_calChange.hide();
		_modal.hide();
		yearChange = '';
		monthChange = '';
		this.today = _thisCD.getDate();
		_opt.isDefaultCal = false;

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
		// Calculate date parts and replace instances in format string accordingly
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
		var dstr = $__calChange.trim(s ? "" : $__calChange('#' + _idBase).val());

		var format = _opt.format ? _opt.format : DEFAULT_DATE_FORMAT;

		if (dstr == "" && _opt.minDate) {
			dstr = $__calChange.trim($__calChange('#' + opt.minDate).val());
		}

		if (dstr != "") {
			var di = format.indexOf("DD");
			var d = dstr.substring(di, di + 2);

			var mi = format.indexOf("MM");
			var m = dstr.substring(mi, mi + 2) - 1;

			var yi = format.indexOf("YYYY");
			var y = dstr.substring(yi, yi + 4);

			date = new Date(y, m, d);
		}

		return date;
	};

	this.showDivCal = function() {

		w = $__calChange('#' + _idBase).width();
		h = $__calChange('#' + _idBase).height() + 10;
		p = $__calChange('#' + _idBase).position();
		// Set calendar
		_calChange.css("top", (p.top + h));
		_calChange.css("left", (p.left + 'px'));
		_calChange.css("position", "absolute");
		_calChange.css("z-index", "99999999");
		// Set modal
		_modal.css("top", 0);
		_modal.css("left", 0);
		_modal.css("position", "fixed");
		_modal.css("z-index", "999999");
		_modal.css("width", "100%");
		_modal.css("height", "100%");

		_calChange.show();
		_modal.show();
	};


	/*
	 * function to create li element considering availability,last week ,satday
	 */
	this.availableDayChange = function(ulDay, day, code, lastWk) {

		if (code == "Sat") { // satday
			if (lastWk) { // last week - true
				ulDay.append($__calChange('<li class="DayB hnd" id="' + day + '">' // available ,sat ,lastWk
						+ (day + 1) + '</li>'));
				countChange++;

			} else {
				ulDay.append($__calChange('<li class="DayB CalDtBoBLine hnd" id="' + day
						+ '">' // available ,sat ,non lastWk
						+ (day + 1) + '</li>'));
			}

		} else { // non sat
			if (lastWk) { // last week - true
				ulDay.append($__calChange('<li class="DayB CalDtBoRLine hnd" id="' + day
						+ '">' // available ,non sat ,lastWk
						+ (day + 1) + '</li>'));
				countChange++;
			} else {
				ulDay
						.append($__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine hnd" id="'
								+ day + '">' // available ,non sat , non lastWk
								+ (day + 1) + '</li>'));
			}
		}
	};

	this.notAvailableDayChange = function(ulDay, day, code, lastWk ) {

		var x= new Date();
		x.setFullYear(yearChange,monthChange,day+1); //display current date

		var dstr = $__calChange.trim($__calChange('#' + opt.minDate).val());
		var mindate=new Date();
		var format = _opt.format ? _opt.format : DEFAULT_DATE_FORMAT;

		if (dstr != "") {
			var di = format.indexOf("DD");
			var d = dstr.substring(di, di + 2);

			var mi = format.indexOf("MM");
			var m = dstr.substring(mi, mi + 2) - 1;

			var yi = format.indexOf("YYYY");
			var y = dstr.substring(yi, yi + 4);

			mindate = new Date(y, m, d);
		}

		if (x > mindate ) {
			_thisCD.availableDayChange(ulDay, day, code, lastWk);
		} else {

			if (code == "Sat") {
				if (lastWk) { // last week - true
					ulDay.append($__calChange('<li class="DayB DtNotAvil" id="' + day
							+ '">' // not available ,sat ,lastWk
							+ (day + 1) + '</li>'));
					countChange++;
				} else {
					ulDay
							.append($__calChange('<li class="DayB CalDtBoBLine DtNotAvil" id="'
									+ day + '">' // not available ,sat ,non lastWk
									+ (day + 1) + '</li>'));
				}

			} else {
				if (lastWk) {
					ulDay
							.append($__calChange('<li class="DayB CalDtBoRLine DtNotAvil" id="'
									+ day + '">' // not available ,non sat,lastWk
									+ (day + 1) + '</li>'));
					countChange++;
				} else {
					ulDay
							.append($__calChange('<li class="DayB CalDtBoRLine  CalDtBoBLine DtNotAvil" id="'
									+ day + '">' // not available , non sat , non lastWk
									+ (day + 1) + '</li>'));
				}
			}

		}

	};


	this.addEmtyBoxEnd = function(ulDay) {

		templi1 = $__calChange('<li class="DayB CalDtBoRLine emptyClass"></li>');
		templi2 = $__calChange('<li class="DayB CalDtBoRLine emptyClass"></li>');
		templi3 = $__calChange('<li class="DayB CalDtBoRLine emptyClass"></li>');
		templi4 = $__calChange('<li class="DayB CalDtBoRLine emptyClass"></li>');
		templi5 = $__calChange('<li class="DayB CalDtBoRLine emptyClass"></li>');
		templi6 = $__calChange('<li class="DayB emptyClass"></li>');

		if (countChange == 1) {
			ulDay.append(templi1);
			ulDay.append(templi2);
			ulDay.append(templi3);
			ulDay.append(templi4);
			ulDay.append(templi5);
			ulDay.append(templi6);

		} else if (countChange == 2) {
			ulDay.append(templi1);
			ulDay.append(templi2);
			ulDay.append(templi3);
			ulDay.append(templi4);
			ulDay.append(templi6);

		} else if (countChange == 3) {
			ulDay.append(templi1);
			ulDay.append(templi2);
			ulDay.append(templi3);
			ulDay.append(templi6);

		} else if (countChange == 4) {

			ulDay.append(templi1);
			ulDay.append(templi2);
			ulDay.append(templi6);

		} else if (countChange == 5) {
			ulDay.append(templi1);
			ulDay.append(templi6);

		} else if (countChange == 6) {
			ulDay.append(templi6);

		}
	};

	this.previousMonth = function() {

		if (!this.today) {
			this.today = _thisCD.getDate();
		}

		yearChange = this.today.getFullYear();
		monthChange = this.today.getMonth();
		day = 1;
		key = "SEA-YYJ";

		if (monthChange < 1) {
			monthChange = 12;
			yearChange = yearChange - 1;
		}

		monthChange = monthChange - 1;
		this.today = new Date(yearChange, monthChange, day);

		var lastDay = _thisCD.getLastDayCal();
		if (this.today > lastDay) {
			_opt.isDefaultCal = true;
		} else {
			_opt.isDefaultCal = false;
		}

		if (selectedTab == SELECTED_TAB_CLIPPER_ONLY) {
			isClipper = true;
		} else {
			isClipper = false;
		}

		_thisCD.get(yearChange, monthChange, _thisCD.getDate(true), key, function() {
			_thisCD.showDivCal();
		}, isClipper);
	};

	this.nextMonth = function() {

		if (!this.today) {
			this.today = _thisCD.getDate();
		}

		yearChange = this.today.getFullYear();
		monthChange = this.today.getMonth();
		day = 1;
		key = "SEA-YYJ";

		if (monthChange > 10) {
			monthChange = -1;
			yearChange = yearChange + 1;
		}
		monthChange = monthChange + 1;
		this.today = new Date(yearChange, monthChange, day);

		var lastDay = _thisCD.getLastDayCal();
		if (this.today > lastDay) {
			_opt.isDefaultCal = true;
		} else {
			_opt.isDefaultCal = false;
		}

		if (selectedTab == SELECTED_TAB_CLIPPER_ONLY) {
			isClipper = true;
		} else {
			isClipper = false;
		}

		_thisCD.get(yearChange, monthChange, _thisCD.getDate(true), key, function() {
			_thisCD.showDivCal();
		}, isClipper);
	};

	this.setNote = function(data) {

		for ( var i = 0; i < data.length; i++) {
			if (!(data[i].note == null | data[i].note == "")) {
				return note = data[i].note;
			}
		}
	};

	this.getLastDayCal = function() {

		var tmpLastDay = new Date(new Date(tmpToday).setMonth(tmpToday
				.getMonth() + 5, 1));
		var tm = tmpLastDay.getMonth();
		var ty = tmpToday.getFullYear();
		var lastDay;
		var isLeapYear = false;

		if (ty % 4 == 0) {
			isLeapYear = true;
		}

		if (tm == 0 | tm == 2 | tm == 4 | tm == 6 | tm == 7 | tm == 9
				| tm == 11) {
			lastDay = new Date(new Date(tmpToday).setMonth(tm, 31));
		} else if (tm == 1) {
			if (isLeapYear) {
				lastDay = new Date(new Date(tmpToday).setMonth(tm, 29));
			} else {
				lastDay = new Date(new Date(tmpToday).setMonth(tm, 28));
			}
		} else {
			lastDay = new Date(new Date(tmpToday).setMonth(tm, 30));
		}

		return lastDay;
	};
};