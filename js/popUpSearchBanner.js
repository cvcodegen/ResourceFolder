/**
 * javascript related to pop up search banner
 *
 * @autor Amali
 * @date 09-11-2012
 *
 */

var selectedTab = "Clipper";
var selectedOption = "roundTrip";

var SELECTED_TAB_CLIPPER_ONLY = "Clipper";
var SELECTED_TAB_COMBO = "Combo";
var SELECTED_OPTION_ROUND_TRIP = "roundTrip";
var SELECTED_OPTION_ONE_WAY = "oneWay";

var BASE_URL = getBaseUrl();
var TIMEOUT = 1000;

var BROWSER_NAME =  null ;

$(document).ready(function() {

	BrowserDetect.init();
	BROWSER_NAME = BrowserDetect.Browser;
	loadSearchBanner();
	displaySetting();
	// load serach banner for header url
	$("#searchImg").click(function() {
		$("div[id='errorMsg']").hide();
		$("#Combo input,select").each(function() {

			var obj = $(this);
			obj.removeClass('borderRed');

		});
		popupSearchBannerNew();
	});

	// load search banner for Search summary url
	$("#newSearchSS").click(function() {
		$("div[id='errorMsg']").hide();
		$("#Combo input,select").each(function() {

			var obj = $(this);
			obj.removeClass('borderRed');

		});
		popupSearchBannerNew();
	});

	$("#oldSearchSS").click(function() {
		$("div[id='errorMsg']").hide();
		$("#Combo input,select").each(function() {

			var obj = $(this);
			obj.removeClass('borderRed');

		});
		popupSearchBannerOld(true);
	});

});

function loadSearchBanner() {

	var currTime = new Date().getTime();

	// bind city lists to the search banner
	var cityList = new CityList();
	cityList.init();
	//addScript("js/searchbanner.js?js="+ currTime);
	setTimeout(function() {
		initFunctions();
		//displayCityLists();
	}, TIMEOUT);
}

function popupSearchBannerNew() {
	selectedTab = SELECTED_TAB_CLIPPER_ONLY;
	var cityList = new CityList();
	cityList.init();
	displayCityLists();
	$('#clipperonlyDiv').show();
	$('#combodealsDiv').show();

	$("#clipperonlyDiv").removeClass('bESelTb').addClass('bESelTbHovSel');
	$("#combodealsDiv").removeClass('bESelTbHov').addClass('bESelTbSel');
	$("#nightDiv").hide();

	if (BROWSER_NAME == "Explorer") {
		setOptionIE();
		$('#arrivalDiv').show();
		selectedOption = SELECTED_OPTION_ROUND_TRIP;
	}else{
		$('#roundTripRadio').prop("checked", "checked");
		$('#oneWayRadio').removeAttr("checked");
		$('#arrivalDiv').show();
		selectedOption = SELECTED_OPTION_ROUND_TRIP;
	}

	$('#departureDate').val("");
	$('#arrivalDate').val("");

	$('#fromCity').val("");
	$('#toCity').val("");

//	$('#night').empty();

	$("div[id='childAges']").html("");
	$('#childAgeParent').css('display', 'none');
	$('#ageErrorMsg').css('display', 'none');

	$('#adults option').eq(1).prop("selected", "selected");
	$('#children option:first-child').prop("selected", "selected");
	$('#seniors option:first-child').prop("selected", "selected");

	$("#code").val("");

//	blockUiSearchPopup("searchBannerPopup");
	 $(".blockPage").removeAttr("style");
	 $("searchBannerPopup").hide();
	 blockInMiddle("searchBannerPopup");
	 $("searchBannerPopup").show();

	$('#closeSearchBanner').click(function() {
		$.unblockUI();

	});
	//bind detail view close function(clicking outer space)
	$(".blockOverlay").unbind('click');
	$(".blockOverlay").bind("click", function() {
		$.unblockUI();
	});

}
/*
 * load search banner with user selected details
 */

function popupSearchBannerOld(type) {

	displaySetting();

	$("div[id='childAges']").html("");
	$('#childAgeParent').css('display', 'none');
	$('#ageErrorMsg').css('display', 'none');
	$('#adults option').eq(1).prop("selected", "selected");
	$('#children option:first-child').prop("selected", "selected");
	$('#seniors option:first-child').prop("selected", "selected");

	$('#departureDate').val($('#departureDateHF').val());
	$('#arrivalDate').val($('#arrivalDateHF').val());

	getMatchValue('fromCity', 'fromCityHF');
	displayNewToCityList();

	if ($('#childAllHF').val() > 0) {
		createChildAge();
	}

	getMatchValue('toCity', 'toCityHF');
	getMatchValue('adults', 'adultsHF');
	getMatchValue('seniors', 'seniorsHF');
	getMatchValue('children', 'childAllHF');

	var val = $('#noOfNightsHF').val();
	setNights(val);

	if (!($('#promoCodeHF').val() == "-1") & !($('#promoCodeHF').val() == "")) {
		$('#code').val($('#promoCodeHF').val());
	} else if (!($('#affiliateCodeHF').val() == "-1")
			& !($('#affiliateCodeHF').val() == "")) {
		$('#code').val($('#affiliateCodeHF').val());
	}
	;

	if (type) {
		// $("#searchBannerPopup").show();

		//blockUiSearchPopup("searchBannerPopup");
		 blockInMiddle("searchBannerPopup");

		$('#closeSearchBanner').click(function() {
			$.unblockUI();

		});
		$('.blockOverlay').click(function() {
			$.unblockUI();

		});
	}

	$("#clipper_only").click(function() {
		$('#departureDate').val("");
		$('#arrivalDate').val("");
		$('#night').empty();
	});

	$("#combo_deals").click(function() {
		$('#departureDate').val("");
		$('#arrivalDate').val("");
		$('#night').empty();
	});

}

function displaySetting() {

	if ($('#selectedTabHF').val() == "true") // clipper
	{
		$("#clipperonlyDiv").removeClass('bESelTb').addClass('bESelTbHovSel');
		$("#combodealsDiv").removeClass('bESelTbHov').addClass('bESelTbSel');
		$("#nightDiv").hide();

		if ($('#selectedOptionHF').val() == "false") { // round trip

			$('#roundTripRadio').prop("checked", "checked");
			$('#oneWayRadio').removeAttr("checked");
			$('#arrivalDiv').show();
			selectedOption = SELECTED_OPTION_ROUND_TRIP;
		} else { // one way

			if (BROWSER_NAME == "Explorer") {

				$('#rtLabel').empty();
				var roundTripRadio = $("<input class='fltLeft' id='roundTripRadio' name='searchMode' type='radio' value='roundTrip'/>");
			//	var labelValRT = $("<label class='fltLeft pdL20'> Roundtrip</label>");
				$('#rtLabel').addClass('fltLeft pdL1');
				$('#rtLabel').append(roundTripRadio);
		//		$('#rtLabel').append(labelValRT);

				$('#owLabel').empty();
				var oneWayRadio = $("<input class='fltLeft' id='oneWayRadio' name='searchMode' type='radio' value='oneWay' checked='checked'/>");
			//	var labelValOW = $("<label class='fltLeft pdL20'>One Way</label>");
				$('#owLabel').addClass('fltLeft pdL1');
				$('#owLabel').append(oneWayRadio);
			//	$('#owLabel').append(labelValOW);

			} else {
				$('#oneWayRadio').prop("checked", "checked");
				$('#roundTripRadio').removeAttr("checked");
			}

			$('#arrivalDiv').hide();
			selectedOption = SELECTED_OPTION_ONE_WAY;
		}
		selectedTab = SELECTED_TAB_CLIPPER_ONLY;
	} else // non clipper
	{
		$("#clipperonlyDiv").removeClass('bESelTbHovSel').addClass('bESelTb');
		$("#combodealsDiv").removeClass('bESelTbSel').addClass('bESelTbHov');
		$("#arrivalDiv").hide();

		if ($('#selectedOptionHF').val() == "false") { // round trip
			$('#roundTripRadio').prop("checked", "checked");
			$('#oneWayRadio').removeAttr("checked");
			$("#nightDiv").show();
			selectedOption = SELECTED_OPTION_ROUND_TRIP;
		} else { // one way

			if (BROWSER_NAME == "Explorer") {

				$('#rtLabel').empty();
				var roundTripRadio = $("<input class='fltLeft' id='roundTripRadio' name='searchMode' type='radio' value='roundTrip' checked='checked'/>");
		//		var labelValRT = $("<label class='fltLeft pdL20'> Roundtrip</label>");
				$('#rtLabel').addClass('fltLeft pdL1');
				$('#rtLabel').append(roundTripRadio);
		//		$('#rtLabel').append(labelValRT);

				$('#owLabel').empty();
				var oneWayRadio = $("<input class='fltLeft'id='oneWayRadio' name='searchMode' type='radio' value='oneWay'/> One Way");
		//		var labelValOW = $("<label class='fltLeft pdL20'>One Way</label>");
				$('#owLabel').addClass('fltLeft pdL1');
				$('#owLabel').append(oneWayRadio);
		//		$('#owLabel').append(labelValOW);

			} else {
				$('#oneWayRadio').prop("checked", "checked");
				$('#roundTripRadio').removeAttr("checked");
			}
			$("#nightDiv").hide();
			selectedOption = SELECTED_OPTION_ONE_WAY;
		}
		selectedTab = SELECTED_TAB_COMBO;
	}
}

function createChildAge() {

	noOfInfant = $("input[id='infantHF']").val();
	noOfChild = $("input[id='childHF']").val();

	$("div[id='childAges']").html("");
	$("select[name^='childAge_']").unbind();

	var chldAges = 1;
	$("input[id^='childAgeHF_']")
			.each(
					function() {
						var obj = $(this);
						var value = obj.val();
						var option = "";

						for ( var count = 18; count >= parseInt($(
								"#childMinAge").val()); count--) {

							if (value == count) {
								option += "<option value = " + count
										+ " selected='selected'>" + count
										+ "</option>";
							} else {
								option += "<option value = " + count + ">"
										+ count + "</option>";
							}
						}
						option += "<option value = 0>&lt;1</option>";

						$("div[id*='childAges']").append(
								"<div class='childAgeCol1'> <p class='pv1'>Child"
										+ chldAges
										+ "</p> <div><select name='childAge_"
										+ chldAges + "'>" + option
										+ "</select> </div></div>");

						$("select[name^='childAge_']").bind('change',
								function() {

								});

						chldAges++;
					});

	for ( var infant = 1; infant <= noOfInfant; infant++) {
		// Populate option values.
		var option = "";
		for ( var count = 18; count >= parseInt($("#childMinAge").val()); count--) {
			option += "<option value = " + count + ">" + count + "</option>";
		}
		option += "<option value = 0 selected='selected'>&lt;1</option>";

		$("div[id*='childAges']").append(
				"<div class='childAgeCol1'> <p class='pv1'>Child"
						+ (infant + parseInt(noOfChild))
						+ "</p> <div><select name='childAge_"
						+ (infant + parseInt(noOfChild)) + "'>" + option
						+ "</select> </div></div>");

	}

	$("select[name^='childAge_']").bind('change', function() {

	});
	$('#childAgeParent').css('display', '');

	if (noOfInfant > 0) {
		$('#ageErrorMsg').css('display', '');
	}
}
/*
 * Functionality to set the selected valuse for select element
 */
function getMatchValue(bannerId, inputId) {

	var selectobject = document.getElementById(bannerId);
	for ( var i = 0; i < selectobject.length; i++) {
		if (selectobject.options[i].value == $('#' + inputId).val()) {
			// selectobject.attr( 'selected','selected');
			val = $('#' + inputId).val();
			$("#" + bannerId + " option[value=" + val + "]").prop("selected",
					"selected");
		}
	}
}
/*
 * Functionality to add js in to page hedder
 */
function addScript(u) {
	var s = document.createElement('script');
	s.type = 'text/javascript';
	s.src = u;
	document.getElementsByTagName('head')[0].appendChild(s);
}

/*
 * fixing display default option values in IE 7
 */
function setOptionIE(){

	$('#rtLabel').empty();
	var roundTripRadio = $("<input class='fltLeft' id='roundTripRadio' name='searchMode' type='radio' value='roundTrip' checked='checked'/>");
//	var labelValRT = $("<label class='fltLeft pdL20'> Roundtrip</label>");
	$('#rtLabel').addClass('fltLeft pdL1');
	$('#rtLabel').append(roundTripRadio);
//	$('#rtLabel').append(labelValRT);

	$('#owLabel').empty();
	var oneWayRadio = $("<input class='fltLeft' id='oneWayRadio' name='searchMode' type='radio' value='oneWay'/>");
//	var labelValOW = $("<label class='fltLeft pdL20'>One Way</label>");
	$('#owLabel').addClass('fltLeft pdL1');
	$('#owLabel').append(oneWayRadio);
//	$('#owLabel').append(labelValOW);


	//bind roundtrip radio button function
	$("#roundTripRadio").unbind("click");
	$("#roundTripRadio").click(function() {
		hideModel();
		selectedOption = SELECTED_OPTION_ROUND_TRIP;
		removeErrorClass();
		displayItem();
		$("#departureDate").val("");
		$("#arrivalDate").val("");
	});

	//bind one way radio button function
	$("#oneWayRadio").unbind("click");
	$("#oneWayRadio").click(function() {
		hideModel();
		selectedOption = SELECTED_OPTION_ONE_WAY;
		removeErrorClass();
		displayItem();
	});

}

function setNights(val ){

	var nightList = new NightDropDown('nightContainer', {
		onComplete : loading(true),
		departureDate : 'departureDateHF',
		nightId : 'night',
		fromCity : 'toCityHF' ,
		toCity : 'fromCityHF',
		multicities : false ,
		defaultCalander : defaultCalander
	});
	loading(false);
	nightList.init();

	var optionsList = $('#night').find('option').clone();
	$('#night').empty();
	$('#night').append('<option  value="t_' + val + '">' + val + '</option>');
	optionsList.appendTo($('#night'));
	$("#night option[value^='t_']").css("display", "none");

}