/**
 * 
 * @autor Amali
 * @date 08-01-2013 Javascript used to display banner and functionality for pop
 *       up banner for package
 * 
 */

var numericPattern = "^[0-9]*$";
var alphaNumericPattern = "^[a-zA-Z0-9]*$";
var dtRegex = new RegExp(/\b\d{1,2}[\/]\d{1,2}[\/]\d{4}\b/);

var selectedTab = "Combo";
var selectedOption = "roundTrip";

var SELECTED_TAB_CLIPPER_ONLY = "Clipper";
var SELECTED_TAB_COMBO = "Combo";
var SELECTED_OPTION_ROUND_TRIP = "roundTrip";
var SELECTED_OPTION_ONE_WAY = "oneWay";
var LOAD_NIGHT_DROPDOWN = true;
var INPUT_DATE_FORMAT = 'MM/DD/YYYY';

var isValidPromoCode;
var isValidAffiliateCode;
var isAlternativePopUpBanner = false;

$__bannerPopup = jQuery.noConflict();


/*
 * Initialize the pop up search banner functions
 */
function initPopUpBanner(altPopUpBanner) {

	$__bannerPopup("#goButton_pkg").click(function() {
		var status = validatePopUpBanner();
		if (status == true) {
			$__bannerPopup('#errorMsg_pkg').remove();
			popUpBannerForwadRequest();
		} else {
			return;
		}
	});

	$__bannerPopup("#closeSearchBanner").unbind("click");
	$__bannerPopup("#closeSearchBanner").click(function() {
		$__bannerPopup("#__pumodal").hide();
		$__bannerPopup("#__searchpopup").hide();
	});
	selectedTab=SELECTED_TAB_COMBO;
	
	intpopUpBannerCalander(altPopUpBanner);
	popUpBannerinsertChildAges('ComboPopup');
	popUpBannerSetPassengers();

	selectedOption = $__bannerPopup('#searchType').val();

	$__bannerPopup("div[name='childAgeParent']").each(
			function(i, parentBackground) {
				$__bannerPopup(parentBackground).hide();
			});
	$__bannerPopup("#__searchpopup").hide();
}

/*
 * Initialize the calendar
 */
function intpopUpBannerCalander(altPopUpBanner) {

	var dpCal = new Calendar("departureDate_pkg", {
		fromCity : "fromLocation",
		toCity : "toLocation",
		format : "MM/DD/YYYY",
		onStart : function() {
			popUpBannerLoading(true);
		},
		onEnd : function() {
			popUpBannerLoading(false);
		},
		departureDate : "departureDate_pkg",
		nightId : "nights_pkg" ,
		multicities : "multicities",
		alternativePopUpBanner : altPopUpBanner
		
	});

	dpCal.init();
}

/**
 * Show search popup box
 */
function showPopUpBanner() {
	isAlternativePopUpBanner = false;
	initPopUpBanner(isAlternativePopUpBanner);
	$__bannerPopup('#childAgeParent_pkg').css('display', 'none');
	$__bannerPopup('#ageErrorMsg_pkg').css('display', 'none');
	$__bannerPopup('#adults_pkg option').eq(1).prop("selected", "selected");
	$__bannerPopup('#children_pkg option:first-child').prop("selected",
			"selected");
	$__bannerPopup('#seniors_pkg option:first-child').prop("selected",
			"selected");
	$__bannerPopup("#departureDate_pkg").val("");
	var defaultNights=0;
	if($__bannerPopup("#defaultNights").val()!=null && $__bannerPopup("#defaultNights").val()!=""){
		defaultNights=$__bannerPopup("#defaultNights").val();
	}
	
	popUpBannerShowSelectedNights(defaultNights);

	if ($__bannerPopup("#searchType").val() == "oneWay") {
		$__bannerPopup("#nightDiv_pkg").hide();
	}
	else{
		$__bannerPopup("#nightDiv_pkg").show();
	}
	// Show modal
	var __pumodal = $__bannerPopup("#__pumodal");
	var __popup = $__bannerPopup("#__searchpopup");// Need to change this and support multi popup boxes in same page
	// Set popup
	__popup.css("position", "fixed");
	__popup.css("z-index", "99999999");
	// Set modal
	__pumodal.css("top", 0);
	__pumodal.css("left", 0);
	__pumodal.css("position", "fixed");
	__pumodal.css("z-index", "999999");
	__pumodal.css("width", "100%");
	__pumodal.css("height", "100%");
	__pumodal.css("filter", "alpha(opacity=60)");
	__pumodal.css("opacity", "0.6");
	__pumodal.css("background-color", "#000");

	__popup.show();
	__pumodal.show();
	
	// set promotion code or affiliate code based on url parameters
	var vars = getUrlVars();
	var key = "promotion_code";
	if( key in vars )
	{
		var promotion_code = getUrlVars()["promotion_code"];		
		if( promotion_code !== 'undefined' && promotion_code.length > 0 )
		{
			$__bannerPopup('#code_pkg').val( promotion_code );
		}			
	}
	key = "npoCode";
	if( key in vars )
	{		
		var npoCode = getUrlVars()["npoCode"];		
		if( npoCode != 'undefined' && npoCode.length > 0 )
		{
			$__bannerPopup('#code_pkg').val( npoCode );
		}	
	}
}

/**
 * Show Alternative search popup box - Booking Flow Modification
 */
function showAltPopUpBanner() {
	isAlternativePopUpBanner = true;
	initPopUpBanner(isAlternativePopUpBanner);
	$__bannerPopup('#childAgeParent_pkg').css('display', 'none');
	$__bannerPopup('#ageErrorMsg_pkg').css('display', 'none');
	$__bannerPopup('#adults_pkg option').eq(1).attr("selected", "selected");
	$__bannerPopup('#children_pkg option:first-child').attr("selected",
			"selected");
	$__bannerPopup('#seniors_pkg option:first-child').attr("selected",
			"selected");
	$__bannerPopup("#departureDate_pkg").val("");
	var defaultNights=0;
	if($__bannerPopup("#defaultNights").val()!=null && $__bannerPopup("#defaultNights").val()!=""){
		defaultNights=$__bannerPopup("#defaultNights").val();
	}
	
	popUpBannerShowSelectedNights(defaultNights);

	if ($__bannerPopup("#searchType").val() == "oneWay") {
		$__bannerPopup("#nightDiv_pkg").hide();
	}
	else{
		$__bannerPopup("#nightDiv_pkg").show();
	}
	// Show modal
	var __pumodal = $__bannerPopup("#__pumodal");
	var __popup = $__bannerPopup("#__searchpopup");// Need to change this and support multi popup boxes in same page
	// Set popup
	__popup.css("position", "fixed");
	__popup.css("z-index", "99999999");
	// Set modal
	__pumodal.css("top", 0);
	__pumodal.css("left", 0);
	__pumodal.css("position", "fixed");
	__pumodal.css("z-index", "999999");
	__pumodal.css("width", "100%");
	__pumodal.css("height", "100%");
	__pumodal.css("filter", "alpha(opacity=60)");
	__pumodal.css("opacity", "0.6");
	__pumodal.css("background-color", "#000");

	__popup.show();
	__pumodal.show();
	
	// set promotion code or affiliate code based on url parameters
	var vars = getUrlVars();
	var key = "promotion_code";
	if( key in vars )
	{
		var promotion_code = getUrlVars()["promotion_code"];		
		if( promotion_code !== 'undefined' && promotion_code.length > 0 )
		{
			$__bannerPopup('#code_pkg').val( promotion_code );
		}			
	}
	key = "npoCode";
	if( key in vars )
	{		
		var npoCode = getUrlVars()["npoCode"];		
		if( npoCode != 'undefined' && npoCode.length > 0 )
		{
			$__bannerPopup('#code_pkg').val( npoCode );
		}	
	}
}


/*
 * validate fields in
 */
function validatePopUpBanner() {

	var isValid = true;

	$__bannerPopup('#errorMsg_pkg').empty();

	$__bannerPopup("#popupSearchBoxForm input,select").each(function() {
		var obj = $__bannerPopup(this);
		obj.removeClass('borderRed');

	});

	var fromDate = "";
	var toDate = "";
	var night = "";
	var adults = "";
	var code = "";
	var dptDate = true;
	var failFormat = "";
	var dateDiff = "";

	if (selectedOption.toLowerCase() == SELECTED_OPTION_ROUND_TRIP.toLowerCase()) {

		if ($__bannerPopup('#nights_pkg').val() == ""
				|| $__bannerPopup('#nights_pkg').val() == null) {
			fromDate = $__bannerPopup('<div>').text(" -Nights is required");
			$__bannerPopup('#nights_pkg').addClass('borderRed');
			isValid = false;

		}
	}

	if ($__bannerPopup('#departureDate_pkg').val() == ""|| $__bannerPopup('#departureDate_pkg').val() == null) {
		fromDate = $__bannerPopup('<div>').text(" -Departure date is required");
		$__bannerPopup('#departureDate_pkg').addClass('borderRed');
		isValid = false;
		dptDate = false;
	}

	if (dptDate) {
		var outD = getInputDate('departureDate_pkg');
		if (!outD.inFormat) {
			failFormat = $__bannerPopup('<div>').text(" -Date Format should be MM/DD/YYYY");
			$__bannerPopup('#departureDate_pkg').addClass('borderRed');
			isValid = false;
		}
	}

	if ($__bannerPopup('#adults_pkg').val() < 1 & $__bannerPopup('#seniors_pkg').val() < 1) {
		adults = $__bannerPopup('<div>').text(" -Should select at least 1 adult");
		$__bannerPopup('#adults_pkg').addClass('borderRed');
		isValid = false;
	}

	// promo code validation
	if (!popUpBannerValidatePromoAffiliateCode('code_pkg')) {
		code = $__bannerPopup('<div>').text(" -Not a valid affiliate or promo code");
		$__bannerPopup('#codde_pkg').addClass('borderRed');
		isValid = false;
	}

	
	if (!isValid) {
		var header = $__bannerPopup('<div>').text("Please correct the following:");
		$__bannerPopup('#errorMsg_pkg').addClass('errorMsg').append(header)
				.append(fromDate).append(toDate).append(failFormat)
				.append(dateDiff).append(night).append(adults).append(code); // add error messages
		$__bannerPopup('#errorMsg_pkg').show();
	}
	if(!tempValidationPkg()){
		header = $__bannerPopup('<div>').text("No Seattle/Victoria service December 25 and January 6-17, 2014");
		$__bannerPopup('#errorMsg_pkg').addClass('errorMsg').append(header);
		$__bannerPopup('#errorMsg_pkg').show();
		isValid = false;
	}
	return isValid;
}

/**
 * 
 * @param Temporary validation of holiday
 * @returns date 26/11/2013
 *  Update validation message for dry dock dates (VRN-794746)
 */

function tempValidationPkg()
{
	var isTempValid = true;
	var depTmpDays = $__bannerPopup('#departureDate_pkg').val();
	
	var dptAddDates = new Date( depTmpDays.split('/')[2] , depTmpDays.split('/')[0]-1 , depTmpDays.split('/')[1], 23 ,59 ,59 );	
	
	var decHoliday = new Date( '12/25/2013'.split('/')[2] , '12/25/2013'.split('/')[0]-1 , '12/25/2013'.split('/')[1] , 23 ,59 ,59 );
	var janHolidayS = new Date( '01/06/2014'.split('/')[2] , '01/06/2014'.split('/')[0]-1 , '01/06/2014'.split('/')[1] , 23 ,59 ,59 );
	var janHolidayE = new Date( '01/17/2014'.split('/')[2] , '01/17/2014'.split('/')[0]-1 , '01/17/2014'.split('/')[1] , 23 ,59 ,59 );
		
	
	if (($__bannerPopup('#fromLocation').val() == "SEA" &&  $__bannerPopup('#toLocation').val() == "YYJ") || ($__bannerPopup('#fromLocation').val() == "YYJ" &&  $__bannerPopup('#toLocation').val() == "SEA")  ) {
			
				
		var noNights = $__bannerPopup('#nights_pkg').val();
				
		var noOfNights = noNights.split('_')[1];
				
		var arr = dptAddDates;	
		arr.setDate(dptAddDates.getDate() + parseInt(noOfNights));
		var arrAdd = new Date( arr );
				

		var depTmpDays = $__bannerPopup('#departureDate_pkg').val();
		var dptAddDates = new Date( depTmpDays.split('/')[2] , depTmpDays.split('/')[0]-1 , depTmpDays.split('/')[1], 23 ,59 ,59 );
			
		if(((decHoliday <= dptAddDates) && (dptAddDates <= decHoliday)) || ((janHolidayS <= dptAddDates) && (dptAddDates <= janHolidayE)) || ((decHoliday <= arrAdd) && (arrAdd <= decHoliday)) || ((janHolidayS <= arrAdd) && (arrAdd <= janHolidayE)) )
		{				
			isTempValid = false;
		}
					
	}
	return isTempValid;	
}

function popUpBannerForwadRequest() {
	// Load 3rd part parameters
	var pkgCode = $__bannerPopup('#StoredPackageCode').val();
	var frmCity = $__bannerPopup('#fromLocation').val();
	var toCity = $__bannerPopup('#toLocation').val();
	if(frmCity==null || frmCity=="" || toCity==null || toCity==""){
		var multiCities = $__bannerPopup("#multicities").val();
		if(multiCities!=null){
			if(multiCities.split("-")[0]!=null){
				frmCity=multiCities.split("-")[0];
			}
			if(multiCities.split("-")[1]!=null){
				toCity=multiCities.split("-")[1];
			}
		}
	}

	var parameters = "";
	parameters += "searchType=Combo"
			+ "&searchMode=roundTrip"
			+ "&fromCity=" + frmCity
			+ "&toCity=" + toCity
			+ "&spc=" + pkgCode
			+ "&"+ $__bannerPopup("#ComboPopup  input[id='departureDate_pkg']").prop('name')
			+ "="+ $__bannerPopup("#ComboPopup  input[id='departureDate_pkg']").val()
			+ "&"+ $__bannerPopup("#ComboPopup  select[id='adults_pkg']").prop('name')
			+ "="+ $__bannerPopup("#ComboPopup  select[id='adults_pkg']").val()
			+ "&"+ $__bannerPopup("#ComboPopup  select[id='seniors_pkg']").prop('name')
			+ "="+ $__bannerPopup("#ComboPopup  select[id='seniors_pkg']").val()
			+ "&"+ $__bannerPopup("#ComboPopup  select[id='children_pkg']").prop('name') 
			+ "="+ $__bannerPopup("#ComboPopup  select[id='children_pkg']").val()
			+ "&";
			
	if (selectedOption.toLowerCase() == SELECTED_OPTION_ROUND_TRIP.toLowerCase()) {
		var pieces = $__bannerPopup('#nights_pkg').val().split("_");
		if (pieces[0] != 't') {
			code = pieces[0];
		} else {
			code = pieces[1];
		}

		parameters += "nights=" + code + "&";
	}

	if (isValidAffiliateCode == true) {
		parameters += "affiliateCode=" + $__bannerPopup("#ComboPopup input[id='code_pkg']").val() + "&";
	} else if (isValidPromoCode == true) {
		parameters += "promoCode=" + $__bannerPopup("#ComboPopup input[id='code_pkg']").val() + "&";
	}
	if ($__bannerPopup("#ComboPopup select[id='children_pkg']").val() > 0) {
		$__bannerPopup("#ComboPopup select[name^='childAge_']").each(
				function(i, el) {
					parameters += $__bannerPopup(el).prop('name') + "=" + $__bannerPopup(el).val() + "&";
				});
	}

	var url = BASE_URL + "welcome?" + parameters;
	var temp = encodeURI(url);
	$__bannerPopup("#popupSearchBoxForm").prop('action', temp);
	$__bannerPopup("#popupSearchBoxForm").submit();
	return true;
}

/**
 * Loading animation to show the ajax process
 * 
 * @param state
 */
function popUpBannerLoading(state) {
	if (state) {
		$__bannerPopup("#lodAni_pkg").show();
	} else {
		$__bannerPopup("#lodAni_pkg").hide();
	}
}

function popUpBannerValidatePromoAffiliateCode(id) {

	var code = $__bannerPopup.trim($__bannerPopup("#ComboPopup input[id='" + id + "']").val());

	if (code == "") {
		return true;
	} else {
		if (code.match(numericPattern)) {
			isValidAffiliateCode = true;
			isValidPromoCode = false;
			return true;
		} else if (code.match(alphaNumericPattern)) {
			isValidAffiliateCode = false;
			isValidPromoCode = true;
			return true;
		} else {
			isValidAffiliateCode = false;
			isValidPromoCode = false;
			return false;
		}
	}
}

function popUpBannerinsertChildAges(type) {
	// PACKAGES
	$__bannerPopup("#" + type + "  select[name='childs']").change(
			function() {
				if ($__bannerPopup("#" + type + "   select[name='childs']").val() === "0") {
					$__bannerPopup("#" + type + "   div[id='childAgeParent_pkg']").hide();
					$__bannerPopup("div[id='ageErrorMsg_pkg']").hide();
				} else {
					popUpBannerCreateChildAges(type);
					$__bannerPopup("#" + type + "   div[id='childAgeParent_pkg']").show();
					popUpBannerShowChildAgeError();
				}

			});

};

function popUpBannerCreateChildAges(type) {
	// Remove all the pre-created combo boxes
	$__bannerPopup("#" + type + " div[id='childAges_pkg']").html("");
	$__bannerPopup("#" + type + " select[name^='childAge_']").unbind();

	var childrenNumber = $__bannerPopup("#" + type + " select[name='childs']").val();

	// Create new combo boxes
	for ( var chldAges = 1; chldAges <= childrenNumber; chldAges++) {
		// Populate option values.
		var option = "";
		for ( var count = 18; count >= parseInt($__bannerPopup("#childMinAge").val()); count--) {
			option += "<option value = " + count + ">" + count + "</option>";
		}
		option += "<option value = 0>&lt;1</option>";

		$__bannerPopup("#" + type + " div[id*='childAges']").append(
				"<div class='childAgeCol1'> <p class='pv1'>Child" + chldAges
						+ "</p> <div><select name='childAge_" + chldAges + "'>"
						+ option + "</select> </div></div>");

	}
	$__bannerPopup("#" + type + " div[id*='childAges']").append("<br class='FClear'>");

	// Bind mouse over to the child age boxes.
	// Bind child age <1 message
	$__bannerPopup("#" + type + " select[name^='childAge_']").bind('change',
			function() {
				popUpBannerShowChildAgeError(type);
			});
}

function popUpBannerShowChildAgeError(type) {
	$__bannerPopup("div[id='ageErrorMsg_pkg']").hide();
	$__bannerPopup("#" + type + " select[name^='childAge_']").each(function() {
		if ($__bannerPopup(this).val() == 0) {
			$__bannerPopup("div[id='ageErrorMsg_pkg']").show();
			return;
		}
	});
}

function popUpBannerSetPassengers() {
	// Adult box
	var $selectAdults = $__bannerPopup("select[id='adults_pkg']");
	$selectAdults.each(function(j, el) {
		$__bannerPopup(el).empty();
		$__bannerPopup("<option value =" + 0 + ">0</option>").appendTo(el);
		$__bannerPopup("<option value =" + 1 + ">1</option>").appendTo(el).prop("selected", "selected");
		for ( var i = 2; i < 10; i++) {
			$__bannerPopup("<option value =" + i + ">" + i + "</option>").appendTo(el);
		}
	});
	// Seniors box
	var $selectSeniors = $__bannerPopup("select[id='seniors_pkg']");
	$selectSeniors.each(function(j, el) {
		$__bannerPopup(el).empty();
		$__bannerPopup("<option value =" + 0 + ">0</option>").appendTo(el);
		for ( var i = 1; i < 10; i++) {
			$__bannerPopup("<option value =" + i + ">" + i + "</option>").appendTo(el);
		}
	});
	// Child box
	var $selectChildren = $__bannerPopup("select[id='children_pkg']");
	$selectChildren.each(function(j, el) {
		$__bannerPopup(el).empty();
		$__bannerPopup("<option value =" + 0 + ">0</option>").appendTo(el);
		$__bannerPopup("<option value =" + 1 + ">1</option>").appendTo(el);
		for ( var i = 2; i < 10; i++) {
			$__bannerPopup("<option value =" + i + ">" + i + "</option>").appendTo(el);
		}
	});
}

/*
 * Function for check and format the input departure date and Arrival date
 */

function getInputDate(id) {
	var date = new Date();
	var dstr = $__bannerPopup('#' + id).val();// Return just the start date

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

function popUpBannerShowSelectedNights(val) {

	var selectobject = document.getElementById('nights_pkg');

	for ( var i = 0; i < selectobject.length; i++) {
		var tmpval = selectobject.options[i].value;
		if (tmpval.substring(0, 1) == "t") {
			selectobject.removeChild(selectobject.options[i]);
		}
	}
	var optionsList = $__bannerPopup($__bannerPopup('#nights_pkg')).find('option').clone();
	$__bannerPopup('#nights_pkg').empty();
	$__bannerPopup('#nights_pkg').append('<option  value="t_' + val + '">' + val + '</option>');
	optionsList.appendTo($__bannerPopup('#nights_pkg'));
	$__bannerPopup("#nights_pkg option[value^='t_']").css("display", "none");

}

function showPackagePopUpBanner(id){
	var idNo=id.split("_")[1];
	$__bannerPopup("#StoredPackageCode").val($__bannerPopup("#StoredPackageCode_"+idNo).val());
	$__bannerPopup("#fromLocation").val($__bannerPopup("#fromLocation_"+idNo).val());
	$__bannerPopup("#toLocation").val($__bannerPopup("#toLocation_"+idNo).val());
	$__bannerPopup("#searchType").val($__bannerPopup("#searchType_"+idNo).val());
	$__bannerPopup("#multicities").val($__bannerPopup("#multicities_"+idNo).val());
	$__bannerPopup("#defaultNights").val($__bannerPopup("#defaultNights_"+idNo).val());
	showPopUpBanner();
}

//get url parameters
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}