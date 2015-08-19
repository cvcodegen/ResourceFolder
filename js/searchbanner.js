/**
 * javascript functionalities related to search banner
 *
 * @date 19-10-2012
 */
var numericPattern = "^[0-9]*$";
var alphaNumericPattern = "^[a-zA-Z0-9]*$";
var dtRegex = new RegExp(/\b\d{1,2}[\/]\d{1,2}[\/]\d{4}\b/);

var selectedTab = "Clipper";
var selectedOption = "roundTrip";

var SELECTED_TAB_CLIPPER_ONLY = "Clipper";
var SELECTED_TAB_COMBO = "Combo";
var SELECTED_OPTION_ROUND_TRIP = "roundTrip";
var SELECTED_OPTION_ONE_WAY = "oneWay";
var INPUT_DATE_FORMAT = 'MM/DD/YYYY';
var LOAD_NIGHT_DROPDOWN = true ;
var isValidPromoCode;
var isValidAffiliateCode;
var change = false;
var todayDate = new Date();
var mainBanner = true;

$__searchBan = jQuery.noConflict();

_modal = $__searchBan('<div></div>');

// for night drop down
_nig = $__searchBan('<div class="DropDwn"></div>');

$__searchBan(document).ready(function() {
	//initFunctions();
});

//init functions for search banner
function initFunctions() {
	
	if(!mainBanner)
	{
		$__searchBan('#combo_deals').click();
	}
	//bind go button functionality
	$__searchBan("#goButton").unbind("click");
	$__searchBan("#goButton").on('click', function() {
		hideModel();
		var status = validate();
		if (status == true) {
			$__searchBan('#errorMsg').remove();
			forwardRequest();
		}
		else {
			return;
		}
	});

	//bind roundtrip radio button function
	$__searchBan("#roundTripRadio").unbind("click");
	$__searchBan("#roundTripRadio").click(function() {
		hideModel();
		selectedOption = SELECTED_OPTION_ROUND_TRIP;
		removeErrorClass();
		displayItem();
		$__searchBan("#departureDate").val("");
		$__searchBan("#arrivalDate").val("");
	});

	//bind one way radio button function
	$__searchBan("#oneWayRadio").unbind("click");
	$__searchBan("#oneWayRadio").click(function() {
		hideModel();
		selectedOption = SELECTED_OPTION_ONE_WAY;
		removeErrorClass();
		displayItem();
	});

	//populate passengers drop downs
	setPassengers();

	$__searchBan("div[name='childAgeParent']").each(function(i, parentBackground) {
		$__searchBan(parentBackground).hide();
	});

	// Dynamically generate child ages combo boxes
	insertChildAges(SELECTED_TAB_COMBO);

	displayItem(); //display elements based on selected searchtypes
	displayCityLists(); //populate city lists
	changeToCityList(); //bind fromcity change event to display to city list accordingly

	setTabs();
	intNightDropDown('nightContainer');
	intCalander();
	displayItem();
	if(!mainBanner)
	{
		$__searchBan('#combo_deals').click();
	}
}

//display elements based on selected searchtypes
function displayItem() {
	if (selectedTab == SELECTED_TAB_CLIPPER_ONLY) {
		$__searchBan("#nightDiv").hide();
		if (selectedOption == SELECTED_OPTION_ROUND_TRIP) {
			$__searchBan("#arrivalDiv").show();
		}
		else if(selectedOption == SELECTED_OPTION_ONE_WAY) {
			$__searchBan("#arrivalDiv").hide();
		}
	}

	else if (selectedTab == SELECTED_TAB_COMBO) {
		$__searchBan("#arrivalDiv").hide();
		if (selectedOption == SELECTED_OPTION_ROUND_TRIP) {
//			$__searchBan('#night').empty();
			$__searchBan("#nightDiv").show();
		} else if(selectedOption == SELECTED_OPTION_ONE_WAY) {
			$__searchBan("#nightDiv").hide();
		}
	}

	// set promotion code or affiliate code based on url parameters
	var vars = getUrlVars();
	var key = "promotion_code";
	if( key in vars )
	{
		var promotion_code = getUrlVars()["promotion_code"];
		if( promotion_code !== 'undefined' && promotion_code.length > 0 )
		{
			$__searchBan('#code').val( promotion_code );
		}
	}
	key = "npoCode";
	if( key in vars )
	{
		var npoCode = getUrlVars()["npoCode"];
		if( npoCode != 'undefined' && npoCode.length > 0 )
		{
			$__searchBan('#code').val( npoCode );
		}
	}
}

//validate inputs before submit
function validate() {
	var isValid = true;

	$__searchBan('#errorMsg').empty();

	$__searchBan("#Combo input,select").each(function() {
		var obj = $__searchBan(this);
		obj.removeClass('borderRed');

	});

	var fromCity = "";
	var toCity = "";
	var sameCity = "";
	var fromDate = "";
	var toDate = "";
	var night = "";
	var adults = "";
	var code = "";
	var dptDate = true;
	var arrDate = true;
	var failFormat = "";
	var dateDiff = "";

	if (selectedTab == SELECTED_TAB_COMBO) {
		if (selectedOption == SELECTED_OPTION_ROUND_TRIP) {
			if ($__searchBan('#night').text() == null || $__searchBan('#night').text() == "") {
				night = $__searchBan('<div>').text(" -Night(s) can not be empty");
				$__searchBan('#night').addClass('borderRed');
				isValid = false;
			}
		}

		// common validation combo_deals for roundTrip and oneWay
		if ($__searchBan('#fromCity').val() == "") {
			fromCity = $__searchBan('<div></div>').text(" -From city is required");
			$__searchBan('#fromCity').addClass('borderRed');
			isValid = false;
		}

		if ($__searchBan('#toCity').val() == "") {
			toCity = $__searchBan('<div></div>').text(" -To city is required");
			$__searchBan('#toCity').addClass('borderRed');
			isValid = false;
		}

		if (($__searchBan('#toCity').val() != "" && $__searchBan('#toCity').val() != "")
				&& $__searchBan('#toCity').val() == $__searchBan('#fromCity').val()) {
			sameCity = $__searchBan('<div>').text(" -Can not select same city");
			$__searchBan('#toCity').addClass('borderRed');
			$__searchBan('#fromCity').addClass('borderRed');
			isValid = false;
		}

		if ($__searchBan('#departureDate').val() == ""|| $__searchBan('#departureDate').val() == null) {
			fromDate = $__searchBan('<div>').text(" -Departure date is required");
			$__searchBan('#departureDate').addClass('borderRed');
			isValid = false;
		} else if (!dtRegex.test($__searchBan('#departureDate').val())) {
			fromDate = $__searchBan('<div>').text(" -Date Format should be MM/DD/YYYY");
			$__searchBan('#departureDate').addClass('borderRed');
			isValid = false;
		}else{
			var depTmpDay = $__searchBan('#departureDate').val();
			var dptAddDate = new Date( depTmpDay.split('/')[2] , depTmpDay.split('/')[0]-1 , depTmpDay.split('/')[1] , 23 ,59 ,59 );
				if(dptAddDate < todayDate ){
					fromDate = $__searchBan('<div>').text(" -Departure date should grater than current date");
					$__searchBan('#departureDate').addClass('borderRed');
					isValid = false;
				}
		}

		if ($__searchBan('#adults').val() < 1 & $__searchBan('#seniors').val() < 1  ) {
			adults = $__searchBan('<div>').text(" -Should select at least 1 adult");
			$__searchBan('#adults').addClass('borderRed');
			isValid = false;
		}

		// promo code validation
		if (!validatePromoAffiliateCode('code')) {
			code = $__searchBan('<div>').text(" -Not a valid affiliate or promo code");
			$__searchBan('#code').addClass('borderRed');
			isValid = false;
		}

		var header = $__searchBan('<div>').text("Please correct the following:");
		if (!isValid) {
			$__searchBan('#errorMsg').addClass('errorMsg').append(header)
					.append(fromCity).append(toCity).append(sameCity)
					.append(fromDate).append(night).append(adults).append(code); // add error messages
			$__searchBan('#errorMsg').show();
		}

	} else if (selectedTab == SELECTED_TAB_CLIPPER_ONLY) {

		if (selectedOption == SELECTED_OPTION_ROUND_TRIP) {
			if ($__searchBan('#arrivalDate').val() == ""|| $__searchBan('#arrivalDate').val() == null) {
				toDate = $__searchBan('<div>').text(" -Return date is required");
				$__searchBan('#arrivalDate').addClass('borderRed');
				isValid = false;
				arrDate = false;
			}
		}

		if ($__searchBan('#fromCity').val() == "") {
			fromCity = $__searchBan('<div></div>').text(" -From city is required");
			$__searchBan('#fromCity').addClass('borderRed');
			isValid = false;
		}

		if ($__searchBan('#toCity').val() == "") {
			toCity = $__searchBan('<div></div>').text(" -To city is required");
			$__searchBan('#toCity').addClass('borderRed');
			isValid = false;
		}

		if (($__searchBan('#toCity').val() != "" && $__searchBan('#toCity').val() != "")
				&& $__searchBan('#toCity').val() == $__searchBan('#fromCity').val()) {
			sameCity = $__searchBan('<div>').text(" -Can not select same city");
			$__searchBan('#toCity').addClass('borderRed');
			$__searchBan('#fromCity').addClass('borderRed');
			isValid = false;
		}

		if ($__searchBan('#departureDate').val() == ""|| $__searchBan('#departureDate').val() == null) {
			fromDate = $__searchBan('<div>').text(" -Departure date is required");
			$__searchBan('#departureDate').addClass('borderRed');
			isValid = false;
			dptDate = false;
		}

		if ( dptDate & arrDate) {

			var outD = getInputDate('departureDate');
			var outA = getInputDate('arrivalDate');

			if (!outD.inFormat) {
				failFormat = $__searchBan('<div>').text(" -Date Format should be MM/DD/YYYY");
				$__searchBan('#departureDate').addClass('borderRed');
				isValid = false;
			}

			if (selectedOption == SELECTED_OPTION_ROUND_TRIP) {

				if (!outA.inFormat) {
					failFormat = $__searchBan('<div>').text(" -Date Format should be MM/DD/YYYY");
					$__searchBan('#arrivalDate').addClass('borderRed');
					isValid = false;
				}

				if (outD.inFormat & outA.inFormat) {
					if (outD.fDate > outA.fDate) {
						dateDiff = $__searchBan('<div>').text(" -Return date Should grater than departure date");
						$__searchBan('#arrivalDate').addClass('borderRed');
						isValid = false;
					}
				}


				var arrTmpDay = $__searchBan('#arrivalDate').val();
				var arrAddDate = new Date( arrTmpDay.split('/')[2] , arrTmpDay.split('/')[0]-1 , arrTmpDay.split('/')[1] , 23 ,59 ,59);

				 if( arrAddDate < todayDate){
					toDate = $__searchBan('<div>').text(" -Return date should grater than current date");
					$__searchBan('#arrivalDate').addClass('borderRed');
					isValid = false;
				}
			}

			var depTmpDay = $__searchBan('#departureDate').val();
			var dptAddDate = new Date( depTmpDay.split('/')[2] , depTmpDay.split('/')[0]-1 , depTmpDay.split('/')[1], 23 ,59 ,59 );

				if(dptAddDate < todayDate ){
					fromDate = $__searchBan('<div>').text(" -Departure date should grater than current date");
					$__searchBan('#departureDate').addClass('borderRed');
					isValid = false;
				}
		}

		if ($__searchBan('#adults').val() < 1 & $__searchBan('#seniors').val() < 1  ) {
			adults = $__searchBan('<div>').text(" -Should select at least 1 adult");
			$__searchBan('#adults').addClass('borderRed');
			isValid = false;
		}

		// promo code validation
		if (!validatePromoAffiliateCode('code')) {
			code = $__searchBan('<div>').text(" -Not a valid affiliate or promo code");
			$__searchBan('#code').addClass('borderRed');
			isValid = false;
		}
		header = $__searchBan('<div>').text("Please correct the following:");
		if (!isValid) {
			$__searchBan('#errorMsg').addClass('errorMsg').append(header)
					.append(fromCity).append(toCity).append(sameCity)
					.append(fromDate).append(toDate).append(failFormat).append(dateDiff)
					.append(adults).append(code); // add error messages
			$__searchBan('#errorMsg').show();
		}		
		
	}
	if(!tempValidation()){
		header = $__searchBan('<div>').text("No Seattle/Victoria service December 25 and January 6-17, 2014");
		$__searchBan('#errorMsg').addClass('errorMsg').append(header);
		$__searchBan('#errorMsg').show();
		isValid = false;
	}
	

	return isValid;
	displayItem();
}

/**
 * 
 * @param Temporary validation of holiday
 * @returns date 26/11/2013
 */

function tempValidation()
{
	var isTempValid = true;
	var depTmpDays = $__searchBan('#departureDate').val();
	var dptAddDates = new Date( depTmpDays.split('/')[2] , depTmpDays.split('/')[0]-1 , depTmpDays.split('/')[1], 23 ,59 ,59 );
	var arrTmpDays = $__searchBan('#arrivalDate').val();
	var arrAddDates = new Date( arrTmpDays.split('/')[2] , arrTmpDays.split('/')[0]-1 , arrTmpDays.split('/')[1] , 23 ,59 ,59);
	var decHoliday = new Date( '12/25/2013'.split('/')[2] , '12/25/2013'.split('/')[0]-1 , '12/25/2013'.split('/')[1] , 23 ,59 ,59 );
	var janHolidayS = new Date( '01/06/2014'.split('/')[2] , '01/06/2014'.split('/')[0]-1 , '01/06/2014'.split('/')[1] , 23 ,59 ,59 );
	var janHolidayE = new Date( '01/17/2014'.split('/')[2] , '01/17/2014'.split('/')[0]-1 , '01/17/2014'.split('/')[1] , 23 ,59 ,59 );
		
	
	if (($__searchBan('#fromCity').val() == "SEA" &&  $__searchBan('#toCity').val() == "YYJ") || ($__searchBan('#fromCity').val() == "YYJ" &&  $__searchBan('#toCity').val() == "SEA")  ) {
		if (selectedTab == SELECTED_TAB_CLIPPER_ONLY){
			if(((decHoliday <= dptAddDates) && (dptAddDates <= decHoliday)) || ((janHolidayS <= dptAddDates) && (dptAddDates <= janHolidayE)) || ((decHoliday <= arrAddDates) && (arrAddDates <= decHoliday)) || ((janHolidayS <= arrAddDates) && (arrAddDates <= janHolidayE)) ){
				isTempValid = false;
			}
		}
		else if(selectedTab == SELECTED_TAB_COMBO){			
			if (selectedOption == SELECTED_OPTION_ROUND_TRIP) {				
				var noNights = $__searchBan('#night').val();
				var noOfNights = noNights.split('_')[1];
				var arr = dptAddDates;	
				arr.setDate(dptAddDates.getDate() + parseInt(noOfNights));
				var arrAdd = new Date( arr );
				var depTmpDays = $__searchBan('#departureDate').val();
				var dptAddDates = new Date( depTmpDays.split('/')[2] , depTmpDays.split('/')[0]-1 , depTmpDays.split('/')[1], 23 ,59 ,59 );
			
			if(((decHoliday <= dptAddDates) && (dptAddDates <= decHoliday)) || ((janHolidayS <= dptAddDates) && (dptAddDates <= janHolidayE)) || ((decHoliday <= arrAdd) && (arrAdd <= decHoliday)) || ((janHolidayS <= arrAdd) && (arrAdd <= janHolidayE)) ){				
				isTempValid = false;
			}
			}else if (selectedOption == SELECTED_OPTION_ONE_WAY){
				if(((decHoliday <= dptAddDates) && (dptAddDates <= decHoliday)) || ((janHolidayS <= dptAddDates) && (dptAddDates <= janHolidayE)) ){
					isTempValid = false;
				}
			}
		}
	}
	return isTempValid;	
}


/*
 * Function for check and format the input departure date and Arrival date
 */
function getInputDate(id) {
	var date = new Date();
	var dstr = $__searchBan('#' + id).val();// Return just the start date

	var format = INPUT_DATE_FORMAT;

	var inFormat = dtRegex.test(dstr);

	if (inFormat) {
		if (dstr != "") {
			var di = format.indexOf("DD");
			var d = dstr.substring(di, di + 2);

			var mi = format.indexOf("MM");
			var m = dstr.substring(mi, mi + 2) - 1;

			var yi = format.indexOf("YYYY");
			var y = dstr.substring(yi, yi + 4);

			date = new Date(y, m, d);
		}
	}

	return {
		'fDate' : date,
		'inFormat' : inFormat
	};
}

/**
 * @param startDate
 *            (String) - In the format of MM/DD/YYYY
 * @param endDate
 *            String) - In the format of MM/DD/YYYY
 * @return true if start date is less than end date.
 */
function compareDates(startDate, endDate) {
	var firstMM = startDate.split("/")[0] - 1;
	var secondMM = endDate.split("/")[0] - 1;
	var firstDate = new Date(startDate.split("/")[2], firstMM, startDate
			.split("/")[1]);
	var secondDate = new Date(endDate.split("/")[2], secondMM, endDate
			.split("/")[1]);
	if (firstDate <= secondDate) {
		return true;
	} else {
		return false;
	}
}

//send the request to search
function forwardRequest() {
	var parameters = "";
	parameters += "searchType="
			+ selectedTab
			+ "&"
			+ $__searchBan("#Combo  input[name='searchMode']:checked").prop('name') + "="
			+ $__searchBan("#Combo  input[name='searchMode']:checked").val()
			+ "&" + $__searchBan("#Combo  select[id='fromCity']").prop('name')
			+ "=" + $__searchBan("#Combo  select[id='fromCity']").val() + "&"
			+ $__searchBan("#Combo  select[id='toCity']").prop('name') + "="
			+ $__searchBan("#Combo  select[id='toCity']").val() + "&"
			+ $__searchBan("#Combo  input[id='departureDate']").prop('name')
			+ "=" + $__searchBan("#Combo  input[id='departureDate']").val()
			+ "&" + $__searchBan("#Combo  select[id='adults']").prop('name')
			+ "=" + $__searchBan("#Combo  select[id='adults']").val() + "&"
			+ $__searchBan("#Combo  select[id='seniors']").prop('name') + "="
			+ $__searchBan("#Combo  select[id='seniors']").val() + "&"
			+ $__searchBan("#Combo  select[id='children']").prop('name') + "="
			+ $__searchBan("#Combo  select[id='children']").val() + "&";

	//pass nights parameter only for combo roundtrip
	if (selectedTab == SELECTED_TAB_COMBO & selectedOption == SELECTED_OPTION_ROUND_TRIP) {
		var pieces = $__searchBan('#night').val().split("_");
		if (pieces[0] != 't') {
			code = pieces[0];
		}
		else {
			code = pieces[1];
		}
		parameters += "nights=" + code + "&";
	}

	//pass arrival date parameter only for clipper only roundtrip
	else {
		if (selectedOption == SELECTED_OPTION_ROUND_TRIP) {
			parameters += $__searchBan("#Combo  input[id='arrivalDate']").prop(
					"name")
					+ "="
					+ $__searchBan("#Combo  input[id='arrivalDate']").val()
					+ "&";
		}
	}

	if (isValidAffiliateCode == true) {
		parameters += "affiliateCode="
				+ $__searchBan("#Combo input[id='code']").val() + "&";
	}
	else if (isValidPromoCode == true) {
		parameters += "promoCode="
				+ $__searchBan("#Combo input[id='code']").val() + "&";
	}
	if ($__searchBan("#Combo select[id='children']").val() > 0) {
		$__searchBan("#Combo select[name^='childAge_']").each(
				function(i, el) {
					parameters += $__searchBan(el).prop('name') + "="
							+ $__searchBan(el).val() + "&";
				});
	}
	var url;
	if($__searchBan("#isAgent").val() == "true"){
		url = $__searchBan("#agentBase").val() + "welcome;jsessionid="
		+ $__searchBan("#sid").val() + "?selectedTab=" + selectedTab + "&"
		+ parameters;
	}else{
		url = $__searchBan("#webBase").val() + "welcome;jsessionid="
		+ $__searchBan("#sid").val() + "?selectedTab=" + selectedTab + "&"
		+ parameters;
	}


	var temp = encodeURI(url);
	$__searchBan("#searchBoxForm").prop('action', temp);
	$__searchBan("#searchBoxForm").submit();
	return true;
}

//validate promo or affiliate code
function validatePromoAffiliateCode(id) {
	var code = $__searchBan.trim($__searchBan("#Combo input[id='"+id+"']").val());

	//if user has not entered a value to the input box return
	if (code == "") {
		return true;
	}
	//if user has enetered a value check its format
	else {
		//check for affiliate code format
		if (code.match(numericPattern)) {
			isValidAffiliateCode = true;
			isValidPromoCode = false;
			return true;
		}
		//check for promo code format
		else if (code.match(alphaNumericPattern)) {
			isValidAffiliateCode = false;
			isValidPromoCode = true;
			return true;
		}
		//if does not match promo or affiliate code format return
		else {
			isValidAffiliateCode = false;
			isValidPromoCode = false;
			return false;
		}
	}
}

//populate passenger dropdowns
function setPassengers() {
	// Adult box
	var $selectAdults = $__searchBan("select[id='adults']");
	$selectAdults.empty();
	$selectAdults.each(function(j, el) {
		$__searchBan("<option value =" + 0 + ">0</option>").appendTo(el);
		$__searchBan("<option value =" + 1 + ">1</option>").appendTo(el).prop("selected",true) ;
		for ( var i = 2; i < 10; i++) {
			$__searchBan("<option value =" + i + ">" + i + "</option>")
					.appendTo(el);
		}
	});

	// Seniors box
	var $selectSeniors = $__searchBan("select[id='seniors']");
	$selectSeniors.empty();
	$selectSeniors.each(function(j, el) {
		$__searchBan("<option value =" + 0 + ">0</option>").appendTo(el);
		for ( var i = 1; i < 10; i++) {
			$__searchBan("<option value =" + i + ">" + i + "</option>")
					.appendTo(el);
		}
	});

	// Child box
	var $selectChildren = $__searchBan("select[id='children']");
	$selectChildren.empty();
	$selectChildren.each(function(j, el) {
		$__searchBan("<option value =" + 0 + ">0</option>").appendTo(el);
		$__searchBan("<option value =" + 1 + ">1</option>").appendTo(el);
		for ( var i = 2; i < 10; i++) {
			$__searchBan("<option value =" + i + ">" + i + "</option>")
					.appendTo(el);
		}
	});
}

function insertChildAges(type) {
	// bind child select box change function to display child age boxes
	$__searchBan("#" + type + "  select[id='children']").change(function() {
		if ($__searchBan("#" + type + "   select[name='childs']").val() === "0") {
			$__searchBan("#" + type + "   div[id='childAgeParent']").hide();
			$__searchBan("div[id='ageErrorMsg']").hide();
		}
		else {
			createChildAges(type);
			$__searchBan("#" + type + "   div[id='childAgeParent']").show();
			showChildAgeError(type); //display child age error mesage for age <1
		}
	});
};

//child age select boxes
function createChildAges(type) {
	// Remove all the pre-created combo boxes
	$__searchBan("#" + type + " div[id='childAges']").html("");
	$__searchBan("#" + type + " select[name^='childAge_']").unbind();

	var childrenNumber = $__searchBan("#" + type + " select[name='childs']").val();

	// Create new combo boxes
	for ( var chldAges = 1; chldAges <= childrenNumber; chldAges++) {
		// Populate option values.
		var option = "";
		for ( var count = 18; count >= parseInt($__searchBan("#childMinAge")
				.val()); count--) {
			option += "<option value = " + count + ">" + count + "</option>";
		}
		option += "<option value = 0>&lt;1</option>";

		$__searchBan("#" + type + " div[id*='childAges']").append(
				"<div class='childAgeCol1'> <p class='pv1'>Child" + chldAges
						+ "</p> <div><select name='childAge_" + chldAges + "'>"
						+ option + "</select> </div></div>");

	}
	$__searchBan("#" + type + " div[id*='childAges']").append("<br class='FClear'>");

	// Bind mouse over to the child age boxes.
	// Bind child age <1 message
	$__searchBan("#" + type + " select[name^='childAge_']").bind('change',function() {
		showChildAgeError(type); //display child age error mesage for age <1
	});
}

//display child age error mesage for age <1
function showChildAgeError(type) {
	$__searchBan("div[id='ageErrorMsg']").hide();
	$__searchBan("#" + type +" select[name^='childAge_']").each(function() {
		if ($__searchBan(this).val() == 0) {
			$__searchBan("div[id='ageErrorMsg']").show();
			return;
		}
	});
}

//arrival and departure available calendar
function intCalander() {
	var ac1 = new Calendar("departureDate", {
		fromCity : "fromCity",
		toCity : "toCity",
		format : "MM/DD/YYYY",
		onStart : function() {
			loading(true);
		},
		onEnd : function() {
			loading(false);
		},
		departureDate : "departureDate",
		nightId : "night"
	});

	var ac2 = new Calendar("arrivalDate", {
		fromCity : "toCity",
		toCity : "fromCity",
		format : "MM/DD/YYYY",
		minDate : "departureDate",
		onStart : function() {
			loading(true);
		},
		onEnd : function() {
			loading(false);
		},
		departureDate : "departureDate",
		nightId : "night"
	});

	ac1.init();
	ac2.init();
}

//night dropdown
function intNightDropDown(id) {
	if (selectedTab == SELECTED_TAB_COMBO) {
		if (selectedOption == SELECTED_OPTION_ROUND_TRIP) {
			var nightList = new NightDropDown(id, {
				onComplete : loading(true),
				departureDate : "departureDate",
				nightId : "night",
				fromCity : "fromCity",
				toCity : "toCity"
			});
			loading(false);
			nightList.init();
		}
	}
}

//display selected value of night dropdown
function showSelected(val) {
	var selectobject = document.getElementById('night');

	for ( var i = 0; i < selectobject.length; i++) {
		var tmpval = selectobject.options[i].value;
		if (tmpval.substring(0, 1) == "t") {
			selectobject.removeChild(selectobject.options[i]);
		}
	}

	var optionsList = $__searchBan($__searchBan('#night')).find('option').clone();
	$__searchBan('#night').empty();
	$__searchBan('#night').append('<option  value="t_' + val + '">' + val + '</option>');
	optionsList.appendTo($__searchBan('#night'));
	$__searchBan("#night option[value^='t_']").css("display", "none");


// testing

/*	$__searchBan("#nightValue").val("");

	var text = $__searchBan("#night option[value="+val+"]").text();

	$__searchBan("#nightValue").attr('text', val);
	$__searchBan("#nightValue").val(text);

	$__searchBan("#night option[value="+val+"]").text(val);*/

//	$__searchBan('#night').append('<option><div class="hideme"  value="t_' + val + '">' + val + '</div></option>');
//  $__searchBan('#night').append('<div class="hideme"  value="t_' + val + '">' + val + '</div>');
//  $__searchBan('#night')value = val;

//  $__searchBan('#night').append('<option selected="selected"></option>').append('<div class="hideme"  value="t_' + val + '">' + val + '</div>');
//	optionsList.appendTo($__searchBan('#night'));
//	$__searchBan("#night div[value^='t_']").css("display", "none");

//	 $__searchBan("#night option[value^='t_']").attr("visible",false);
//	 $__searchBan("#night option[value^='t_']").css('display','none');
//	 $__searchBan("#night option[value^='t_']").css('position','relative');
//	 $__searchBan("#night option[value^='t_']").css('height','0px');*/
//	 document.getElementById("night option[value^='t_']").style.display = "none";
//	 $__searchBan("#night div[value^='t_']").css("visible",'false');

// end testing
}

//bind click event for clipper only and combo tabs
function setTabs() {
	$__searchBan("#clipper_only").click(
			function() {
				hideModel();
				selectedTab = SELECTED_TAB_CLIPPER_ONLY;
				removeErrorClass();
				$__searchBan("#clipperonlyDiv").removeClass('bESelTb').addClass('bESelTbHovSel');
				$__searchBan("#combodealsDiv").removeClass('bESelTbHov').addClass('bESelTbSel');
				displayItem();
				displayCityLists();
				/*$__searchBan("#departureDate").val("");
				$__searchBan("#arrivalDate").val("");*/
			});

	$__searchBan("#combo_deals").click(
			function() {
				hideModel();
				selectedTab = SELECTED_TAB_COMBO;
				removeErrorClass();
//				$__searchBan("#departureDate").val("");
				$__searchBan("#clipperonlyDiv").removeClass('bESelTbHovSel').addClass('bESelTb');
				$__searchBan("#combodealsDiv").removeClass('bESelTbSel').addClass('bESelTbHov');
				displayItem();
				displayCityLists();
				/*$__searchBan("#departureDate").val("");
				$__searchBan("#arrivalDate").val("");*/
				if($__searchBan("#departureDate").val() != null && $__searchBan("#departureDate").val() != "" && $__searchBan("#night").val() == null)
				{
					intNightDropDown('nightContainer');
				}
			});
}

/**
 * Loading animation to show the ajax process
 *
 * @param state
 */
function loading(state) {
	if (state) {
		$__searchBan(".lodAni").show();
	} else {
		$__searchBan(".lodAni").hide();
	}
}

//remove error fields of inputs
function removeErrorClass() {
	$__searchBan("input ,select").each(function() {
		$__searchBan(this).removeClass("borderRed");
	});
	$__searchBan('#errorMsg').hide();
}

//bind functionality to display to city list according to selected from city
function changeToCityList() {
	$__searchBan("select[id='fromCity']").unbind("change");
	$__searchBan("select[id='fromCity']").change(function() {
		displayNewToCityList();
		hideModel();
		$__searchBan('#night').empty();
		$__searchBan("#departureDate").val("");
		$__searchBan("#arrivalDate").val("");
	});
	onChangeToCity();
}

function onChangeToCity(){

	$__searchBan("select[id='toCity']").unbind("change");
	$__searchBan("select[id='toCity']").change(function() {
		hideModel();
		$__searchBan('#night').empty();
		$__searchBan("#departureDate").val("");
		$__searchBan("#arrivalDate").val("");
	});
}

//display city lists accoring to selected tab
function displayCityLists() {
	var fromCityList = $__searchBan("select[id='fromCity']").clone();
	var toCityList = $__searchBan("select[id='toCity']").clone();

	var fromCity= $__searchBan("select[id='fromCity']").val();
	var toCity=$__searchBan("select[id='toCity']").val();
	$__searchBan("select[id='fromCity']").remove();
	//$__searchBan("select[id='toCity']").remove();

	var option0 = $__searchBan((toCityList).find('option')[0]).clone();

	if (selectedTab == SELECTED_TAB_COMBO) {
		newFromCityList = $__searchBan("select[id='comboFromCity']");
		// _newToCityList = $__cityList("select[id='comboToCity']");
	} else {
		newFromCityList = $__searchBan("select[id='clipperFromCity']");
		// _newToCityList = $__cityList("select[id='clipperToCity']");
	}
	fromCityList.empty();
	$__searchBan(newFromCityList).find('option').clone().appendTo(fromCityList);
	fromCityList.appendTo("#fromCityDiv");
	toCityList.empty();
	option0.appendTo(toCityList);

	BrowserDetect.init();
	var browserName  = BrowserDetect.Browser;

	if( fromCity != null &&  fromCity != "" ){
		if(browserName == "Safari" &&  fromCity != 'Select from city'){
			$__searchBan("#fromCity option[value=" + fromCity +"]").prop("selected","selected") ;
			displayNewToCityList();
		}else if(browserName != "Safari" && fromCity != "--Select from city--" ){
			$__searchBan("#fromCity option[value=" + fromCity +"]").prop("selected","selected") ;
			displayNewToCityList();
		}
	}else {
		$__searchBan("select[id='toCity']").remove();

		if(browserName == "Safari"){
			var option0 = $__searchBan('<option>Select to city</option>');
			toCityList.empty();
			option0.appendTo(toCityList);
		}
		toCityList.appendTo("#toCityDiv");
	}

	if( toCity != null && toCity != "" ){

		if(browserName == "Safari" &&  toCity != 'Select to city'){
			$__searchBan("#toCity option[value=" + toCity +"]").prop("selected","selected") ;
		}else if(browserName != "Safari" && toCity != "--Select to city--"  ){
			$__searchBan("#toCity option[value=" + toCity +"]").prop("selected","selected") ;
		}
	}
	changeToCityList();

}

//display tocity list
function displayNewToCityList() {

		var fromCity = $__searchBan("select[id='fromCity']").val();
		var toCityList = $__searchBan("select[id='toCity']").clone();
		$__searchBan("select[id='toCity']").remove();
		if (fromCity != "" ) {
			toCityList.empty();
			var newToCityList;
			var exceptionList;
			if (selectedTab == SELECTED_TAB_CLIPPER_ONLY) {
				exceptionList = $__searchBan(
						"#clipperExceptionsList input[id='exception_" + fromCity + "']").val().split(",");
				newToCityList = $__searchBan("select[id='clipperToCity']");
			} else {
				exceptionList = $__searchBan(
						"#comboExceptionsList input[id='exception_" + fromCity
								+ "']").val().split(",");
				newToCityList = $__searchBan("select[id='comboToCity']");
			}
			var optionsList = $__searchBan(newToCityList).find('option').clone();
			optionsList.appendTo(toCityList);
			optionsList
					.each(function() {
						if ($__searchBan.inArray($__searchBan(this).val(),
								exceptionList) > -1) {
							$__searchBan(this).remove();
						}
					});
		} else {
			var option0 = $__searchBan((toCityList).find('option')[0]).clone();
			toCityList.empty();
			option0.appendTo(toCityList);
		}
		toCityList.appendTo("#toCityDiv");
		onChangeToCity();

}

function hideModel(){

		$__searchBan("div[id='baseCal']").each(
				function() {
					$__searchBan(this).hide();
				});
}

function resetSearchBanner(){
	$__searchBan('#clipperonlyDiv').show();
	$__searchBan('#combodealsDiv').show();

	$__searchBan("#clipperonlyDiv").removeClass('bESelTb').addClass('bESelTbHovSel');
	$__searchBan("#combodealsDiv").removeClass('bESelTbHov').addClass('bESelTbSel');
	$__searchBan("#nightDiv").hide();
	selectedTab = SELECTED_TAB_CLIPPER_ONLY;
	BrowserDetect.init();
	var BROWSER_NAME = BrowserDetect.Browser;
	if (BROWSER_NAME == "Explorer") {
		setOptionIESearchBanner();
		selectedOption = SELECTED_OPTION_ROUND_TRIP;
	}else{
		$__searchBan('#roundTripRadio').prop("checked", "checked");
		$__searchBan('#oneWayRadio').removeAttr("checked");
		$__searchBan('#arrivalDiv').show();
		selectedOption = SELECTED_OPTION_ROUND_TRIP;
	}

	$__searchBan('#departureDate').val("");
	$__searchBan('#arrivalDate').val("");

	$__searchBan('#fromCity').val("");
	$__searchBan('#toCity').val("");

	$__searchBan('#night').empty();

	$__searchBan("div[id='childAges']").html("");
	$__searchBan('#childAgeParent').css('display', 'none');
	$__searchBan('#ageErrorMsg').css('display', 'none');

	$__searchBan('#adults option').eq(1).prop("selected", "selected");
	$__searchBan('#children option:first-child').prop("selected", "selected");
	$__searchBan('#seniors option:first-child').prop("selected", "selected");
}

/*
 * fixing display default option values in IE 7
 */
function setOptionIESearchBanner(){

	$__searchBan('#rtLabel').empty();
	var roundTripRadio = $__searchBan("<input class='fltRight IeInput' id='roundTripRadio' name='searchMode' type='radio' value='roundTrip' checked='checked'/>");
	//var labelValRT = $__searchBan("<span class='fltRight pdL20 IeLbl'> Roundtrip</span>");
	$__searchBan('#rtLabel').addClass('fltLeft pdL1');
	$__searchBan('#rtLabel').append(roundTripRadio);
	//$__searchBan('#rtLabel').append(labelValRT);

	$__searchBan('#owLabel').empty();
	var oneWayRadio = $__searchBan("<input class='fltLeft' id='oneWayRadio' name='searchMode' type='radio' value='oneWay'/>");
	//var labelValOW = $__searchBan("<span class='fltRight pdL20'>One Way</span>");
	$__searchBan('#owLabel').addClass('fltLeft pdL1');
	$__searchBan('#owLabel').append(oneWayRadio);
	//$__searchBan('#owLabel').append(labelValOW);

}

//load the main search banner.
function loadMainSearchBanner(){
	
	mainBanner = true ;
	var divToAppend=$__searchBan("#htmlTag").clone();
	var divToRemove=$__searchBan("#htmlTag");
	$__searchBan("#mainBannerContainer").html("");
	$__searchBan("#mainBannerContainer").append(divToAppend);
	(divToRemove).remove();
	resetSearchBanner();
	initFunctions();
}

// load the search banner for plan your trip.
function loadSearchBannerPopup(){
	
	mainBanner = true ;
	var divToAppend=$__searchBan("#htmlTag").clone();
	var divToRemove=$__searchBan("#htmlTag");
	$__searchBan("#planYourTripBannerContainer").html("");
	$__searchBan("#planYourTripBannerContainer").append(divToAppend);
	(divToRemove).remove();
	resetSearchBanner();
	initFunctions();
}

//load the Alternate search banner .
function loadAltSearchBannerPopup(){
	
	mainBanner = false ;
	var divToAppend=$__searchBan("#htmlTag").clone();
	var divToRemove=$__searchBan("#htmlTag");
	$__searchBan("#planYourTripBannerContainer").html("");
	$__searchBan("#planYourTripBannerContainer").append(divToAppend);
	(divToRemove).remove();
	resetSearchBanner();
	initFunctions();
}

// get url parameters
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}