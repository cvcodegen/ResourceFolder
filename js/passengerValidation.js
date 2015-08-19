/**
 * @autor Amali
 * @date 05-12-2012 Java script used to validate and functionality for passenger
 *       details page
 */

var namePattern = /^[a-zA-Z\-\'\s]*$/;
var emailPattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
var agePattern = /^[0-9]*$/;
var passportPattern = /^[a-zA-Z0-9]*$/;
var expDatePattern = /^(0[1-9]|1[012])+\/((0[1-9]|[12][0-9]|3[01]))+\/((20)\d\d)+$/;
var phonePattern = /^[0-9\ +-\\(\\)]*$/;
var dobPattern = /^(0[1-9]|1[012])+\/((0[1-9]|[12][0-9]|3[01]))+\/((19|20)\d\d)+$/;
var dobMonth = /^(0[1-9]|[1-9]|1[012])/;
var dobDay = /^(0[1-9]|[1-9]|[12][0-9]|3[01])/;
var dobYear = /^((19|20)\d\d)/;
var cvvPattern = /\d{3}|\d{4}/;
var date = new Date();
var BILLING_AS_LEAD_STATE = false;
var BILLING_AS_LEAD_CITY = false;
var LOAD_COUNTRY = false ;
var ZIP_CODE_FAIL = false;
var LEAD_KEY_UP_CITY_CALLED = false;
var PAYMENT_KEY_UP_CITY_CALLED = false;

//var bgDiv = $('<div class="BodyRside fltLeft txtAlgLeft pdB30"  id="modelClose"></div>');
var bgDiv = $('<div class=" fltLeft txtAlgLeft pdB30"  id="modelClose"></div>');

$(document).ready(function() {	

	initPayments();

	validateLeadDOBonType();
	validateOtherDOBonType();
	initCityStateDropdown();
	cityDisableLead();
	cityDisableOrder();
	selectPreSelectedPassenger();

	formatCardNumberBoxes(false);
	$(document).idleTimeout();
	showpopUp();

	$("#leadPassportExp").datepicker({
		minDate: 0
	});
	$("input[id^='otherPassportExp-']").datepicker({
		minDate: 0
	});
	$("div[id='ui-datepicker-div']").css("display", "none");

	$("#searchBackLink").remove();

	$('#popUpCVV').after(bgDiv);

	$(bgDiv).unbind('click');
	$(bgDiv).bind('click', function() {
		hidePopUpManager('paymentPopUpCity');
		hidePopUpManager('paymentPopUpCVV');
	});

	BrowserDetect.init();
	var browserName  = BrowserDetect.Browser;
	if(browserName != "Explorer")
	{
		initRightSideBasket();
	}	
	if(browserName == "Safari")
	{

		/*window.onunload=function(){					
			
			showMessage("Do you want to Continue??", "Warning Message",false,"");
			
		};*/
		
		/*window.location.hash="Again-No-back-button";
		window.location.hash="no-back-button";
		window.location.hash="no-back-button";	*/
	}
	/*if($("#leadCountry").val() == "US" || $("#leadCountry").val() == "CA")
	{
		$("#leadZipCode").trigger("keyup");
	}*/
	//$.unblockUI();
	$("#blockedDiv").hide();
	$("#messageBlock").hide();
	
	/*
	 * Newly added script to support hybrid mode for zip code load 
	 * 
	 * */
	var overlay = document.getElementById('overlayLead');
	overlay.addEventListener('click', function () {
	    $("#leadZipCode").trigger("keyup");
	}, true);
	
	var overlayPayment = document.getElementById('overlayPayment');
	overlayPayment.addEventListener('click', function () {
	    $("#orderZipCode").trigger("keyup");
	}, true);
	
});

/*
 * Auto tab functionality for DOB
 */
function initOtherDOB() {

	var int = $("#count").val();

	for ( var count = 0; count <= int; count++) {

		$("input[id='otherBMonth-" + count + "']").autotab({
			target : 'otherBDay-' + count + '',
			format : 'numeric'
		});
		$("input[id='otherBDay-" + count + "']").autotab({
			target : 'otherBYear-' + count + '',
			maxlength : 2,
			format : 'numeric',
			previous : 'otherBMonth-' + count + ''
		});
		$("input[id='otherBYear-" + count + "']").autotab({
			format : 'numeric',
			previous : 'otherBDay-' + count + ''
		});
	}
}

function initPayments() {
	// set city drop down in billing details to default
	$('#orderCity').val('');

	// Set default Auto-tab for VISA card.
	$('#cardNumber_1').autotab({
		target : 'cardNumber_2',
		format : 'numeric'
	});
	$('#cardNumber_2').autotab({
		target : 'cardNumber_3',
		maxlength : 4,
		format : 'numeric',
		previous : 'cardNumber_1'
	});
	$('#cardNumber_3').autotab({
		target : 'cardNumber_4',
		format : 'numeric',
		previous : 'cardNumber_2'
	});
	$('#cardNumber_4').autotab({
		format : 'numeric',
		previous : 'cardNumber_3'
	});

	
	if($("#isGiftCardFlow").val()=="true"){
		$('#leadBYear').val("1980");
		$('#leadBMonth').val("01");
		$('#leadBDay').val("01");		
	}else{
		// set DOB
		$('#leadBMonth').autotab({
			target : 'leadBDay',
			format : 'numeric'
		});
		$('#leadBDay').autotab({
			target : 'leadBYear',
			maxlength : 2,
			format : 'numeric',
			previous : 'leadBMonth'
		});
		$('#leadBYear').autotab({
			format : 'numeric',
			previous : 'leadBDay'
		});
	}


	// Set numeric input for CVV field
	$('#cardCW').autotab({
		format : 'numeric'
	});

	$('#cardNumber').autotab({
		maxlength : 19,
		format : 'numeric'
	});
	

	
	// remove from onload improve js
	initOtherDOB();

	// Confirm button initialization
	$("#confirmBtn").unbind("click");
	$("#confirmBtn").click(function() {
		if($("#addPayment").length>0){
			if($("#addPayment").attr("checked")!=null && $("#addPayment").attr("checked")){
				sendRequest(true);
			}
			else{
				sendRequest(false);
			}
		}
		else{
			sendRequest(true);
		}
											});

	// bind add payment checkbox functionality for credit agents
	$("#addPayment").unbind("click");
	$("#addPayment").click(function() {
		if ($(this).attr("checked")) {
			$("#billingDetailsDiv").show();
		}
		else{
			$("#billingDetailsDiv").hide();
						}
					});

	/**
	 * Initialize the selecting order details as the lead details function
	 */
	$("#sameAsLeadToOrder").click(function() {
		if ($(this).attr("checked")) {
			
			BILLING_AS_LEAD_STATE = true;
			$("#orderCountry").val($("#leadCountry").val()).change();
			$("#orderGender").val($("#leadGender").val());
			$("#orderFirstName").val($("#leadFirstName").val());
			$("#orderLastName").val($("#leadLastName").val());
			$("#orderAddress").val($("#leadAddress").val());
			

			// set lead passenger preferred phone number for billing phone number
			var preferredVal = $("#leadPhone_1").val();
			$("#orderPreferedPhone").val(preferredVal);
			$("#leadPreferedPhone").val(preferredVal);
			$("#cardHolderName").val($("#leadFirstName").val() + " " + $("#leadLastName").val());

			$("#orderCountry").val($("#leadCountry").val());
			$("#orderState").val($("#leadState").val());
			$("#orderZipCode").val($("#leadZipCode").val());
			if($("#leadCountry").val() != 'US' && $("#leadCountry").val() != 'CA')
			{
				$("#orderCity").val($("#leadCity").val());
			}else
			{
				if(!ZIP_CODE_FAIL)
				{
					$("#orderCity").empty();
					if($("#leadCity").val()!=null){
						$("#orderCity").append("<option selected='selected' value='"+$("#leadCity").val()+"'>"+ $("#leadCity").val() + "</option>");
					}
				}
				else
				{
					var elements = $("#orderState");
					cityStateChangeZipCode( elements, cityStateDropdownCallback, "");
					if($("#leadCity").val()!=null){	
						$("#orderCity").val($("#leadCity").val());
					}
					
				}
			}
			$('#infoOrderCityDiv').remove();
		}
		else
		{
			$("#orderGender").val('');
			$("#orderFirstName").val('');
			$("#orderLastName").val('');
			$("#orderAddress").val('');
			$("#orderCountry").val('').change();
//			$("#orderState").val('').change();
			$("#orderCity").empty();
			$("#orderZipCode").val('');
			$("#orderPreferedPhone").val('');
			$("#cardHolderName").val('');
		}
	});	

	$("a[id='termsAndConditionsBoxLink']")
			.click(
					function() {
						window
								.open(
										$("#clipperBase").val()+"terms-conditions/",
										"",
										"resizable=no,toolbar=1,status=0,scrollbars=1,menubar=0,fullscreen=no,width="
												+ 850 + ",height=" + 1000
												+ ",top=" + 100 + ",left="
												+ 200);
					});

	$("a[id='properIdLink']")
			.click(
					function() {
						window
								.open(
										$("#clipperBase").val()+"crossing-the-us-border/",
										"",
										"resizable=no,toolbar=1,status=0,scrollbars=1,menubar=0,fullscreen=no,width="
												+ 850 + ",height=" + 1000
												+ ",top=" + 100 + ",left="
												+ 200);
					});

	$("a[id='addPhoneNum_1']").click(function() {
		document.getElementById("phoneNum_2").style.display = "";
		document.getElementById("addNo1").style.display = "none";
	});

	$("a[id='addPhoneNum_2']").click(function() {
		document.getElementById("phoneNum_3").style.display = "";
		document.getElementById("addNo2").style.display = "none";
	});	
	
	$("#cardNumber").die('keyup');
	$("#cardNumber").live('keyup',function(){
		if($(this).val().length==19){
			var BASE_URL = getBaseUrl();
			var BALANCE_CHECK = BASE_URL + "jaxrs/json/getGiftCardBalance?callback=?";		
			if(true)
			{	
				$(".ErrLbl").remove();
				//blockInMiddle("waitingAnim");
				BALANCE_CHECK+"&"+"tbxSession="+$("#sid").val()+"&"+"cardNum="+$("#cardNumber").val();
				var urlCheckBalance = BALANCE_CHECK + "&tbxSession=" + $("#sid").val() + "&cardNum=" + $("#cardNumber").val();
				$.getJSON(urlCheckBalance, function(response) {
					//unblockUi();
					$("#blockedDiv").hide();
					$("#messageBlock").hide();
					if (response.status == 1) {
						var amount = response.data ;
						$("#cardAvailBalance").val(amount);	
						$(window).scrollTop($('#cardAvailBalance').position().top);
					} else {
						// Remove previous gift card error messages 
						$("#errGCAmntTot").remove();
						$("#cardAvailBalance").parent().append('<div class="ErrLbl" id="errGCAmntTot">'+response.message+'</div>');
					}
				});
			}
		}
	});
	
	//cardAmount
	$("#cardAmount").die('keyup');
	$("#cardAmount").live('keyup',function(){
		$(".ErrLbl").remove();//cardNumber
		var isSucsus=true;
		if($("#cardNumber").val().length<19){
			$("#cardAmount").val("");
			$("#cardNumber").parent().append('<div class="ErrLbl" id="errGCAmntTot">Please enter valid card number</div>');
			isSucsus=false;
		}else if(parseFloat($("#cardAmount").val())>parseFloat($("#actualTotal").val())){
			$("#cardAmount").parent().append('<div class="ErrLbl" id="errGCAmntTot">Amount you enter is greater than total</div>');
			$("#cardAmount").val("");
			isSucsus=false;
		}
		if(parseFloat($("#cardAmount").val())>parseFloat($("#cardAvailBalance").val())){
			$("#cardAmount").val("");
			$("#cardAmount").parent().append('<div class="ErrLbl" id="errGCAmntTot">Card doesn\'t have required balance</div>');
			isSucsus=false;
		}
		if(isSucsus){
			if($("#cardAmount").val().trim().length<1){
				$("#basketTotal").html(parseFloat($("#actualTotal").val()).toFixed(2));
			}else{
				var nwAmount=parseFloat($("#actualTotal").val()).toFixed(2)-parseFloat($("#cardAmount").val()).toFixed(2);
				$("#basketTotal").html(nwAmount.toFixed(2));
			}
		}else{
			$("#basketTotal").html(parseFloat($("#actualTotal").val()).toFixed(2));
		}
		
	});
	
		$('#cardAmount').keypress(function (event) {
		    
			if (event.which !=8 && (event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
		        event.preventDefault();
		    }

		    var text = $(this).val();

		    if (event.which !=8 && (text.indexOf('.') != -1) && (text.substring(text.indexOf('.')).length > 2)) {
		        event.preventDefault();
		    }
		});
	
	$("#giftCardPayment").click(function() {
		if ($(this).attr("checked")) {			
			$("#cardNumber").val('');
			$("#cardAmount").val('');
			$("#cardAvailBalance").val('');
			$("#cardNumber").prop('disabled', false);
			$("#cardAmount").prop('disabled', false);
		}
		else
		{
			$("#cardNumber").val('');
			$("#cardAmount").val('');
			$("#cardAvailBalance").val('');
			$("#cardNumber").prop('disabled', true);
			$("#cardAmount").prop('disabled', true);
			$("#basketTotal").html(parseFloat($("#actualTotal").val()).toFixed(2));
		}
	});	
}

function isTotalPayByGC(){
	var basketTotal = $("#basketTotal").val();
	var giftcardAmount =$("#cardAmount").val();
	var actualTotal= $("#actualTotal").val();
	var payFromGiftCard = $("#giftCardPayment").attr("checked");
	if(payFromGiftCard=='checked'){
		return parseFloat(giftcardAmount).toFixed(2)==parseFloat(actualTotal).toFixed(2);
	}else{
		return false;
	}
}
function bookingCallBack(data, div) {
	var status = data["status"];
	var samePage = data["samePage"];
	$("#blockedDiv").hide();
	$("#messageBlock").hide();
	if (status == SUCCESS) {
		window.location.href = getBaseUrl() + $("#bookingSuccessRedirect").val()
				+ ";jsessionid=" + $("#sid").val() + "?ts="
				+ new Date().getTime();
	}
	else if(status==100){//payment unsuccess retry status
		window.location.href = getBaseUrl() + "paymentError;jsessionid="+ $("#sid").val() + "?ts=" + new Date().getTime();
	}
	else if (samePage) {
		//unblockUi();
		$("#blockedDiv").hide();
		$("#messageBlock").hide();
		displayMessage(null, data["status"], data["msg"], data["data"]);
		addingMargingTopF();
		addingMargingTopShpBskt();
		$("#confirmBtn").bind('click');
	} else {
		window.location.href = getBaseUrl() + "error;jsessionid="
				+ $("#sid").val() + "?ts=" + new Date().getTime();
	}
}

function sendRequest(isAddPayment){
	setleadDetails();
	if (allValidation(isAddPayment)) {
		setPreferedPhoneNumber();
		setOrderPhoneNumbers();
		setleadDetails();
		findPax();
		//blockInMiddle("waitingAnim");
		$("#blockedDiv").show();
		$("#messageBlock").show();
		var param = "";
		$("#submitForm input[type='text'],input[type='hidden'],select,input[type='radio']:checked,input[type='checkbox']:checked")
				.each(function() {
							param += $(this).attr("name")
									+ "=" + encodeURI($.trim( $(this).val()))
									+ "&";
						});

		$("#direcClientInfo input").each(
				function() {
					param += "&" + $(this).attr("name")+ "=" + $.trim($(this).val());
				});
		param += "&isAddPayment="+isAddPayment;
		param += "&isZipCodeFail="+ZIP_CODE_FAIL;
		param += "&orderCityName="+$("#orderCity>option:selected").html();
		param += "&leadCityName="+$("#leadCity>option:selected").html();
		param += "&giftCardFlow="+$("#isGiftCardFlow").val();		
		doAjaxWithBase(getBaseUrl()+ "BookingController", param,bookingCallBack, "", "json");
	} else {
		scrollTop();
		$('#errorMsgMainDiv').css('display', '');

	}
}

/*
 * Fill the lead details in input fields
 */

function setleadDetails() {

	$("#otherPTitle-1").val($("#leadGender").val());
	$("#otherPFirstName-1").val($("#leadFirstName").val());
	$("#otherPLastName-1").val($("#leadLastName").val());
	$("#otherBDay-1").val($("#leadBDay").val());
	$("#otherBMonth-1").val($("#leadBMonth").val());
	$("#otherBYear-1").val($("#leadBYear").val());
	$("#otherCityzenship-1").val($("#leadCityzenship").val());
	$("#otherPassportNum-1").val($("#leadPassportNum").val());
	$("#otherPassportExp-1").val($("#leadPassportExp").val());
}

function allValidation(isAddPayment) {

	var success = true;
	// success = validateMainPassenger(true);

	$("div[id^='errorPayment_']").remove();

	$("#submitForm input[type='text'] ,select").each(function() {
		var obj = $(this);
		obj.removeClass('ErrFeeld');
	});

	$("#termsAndConditionsBox").parent().attr("class","TitleFR fcol4 fltLeft width20 pdT2 maRight4");

	if(isAddPayment){
	formatCardNumberBoxes(true);

	tmp1 = validateLeadPassenger();
	tmp2 = orderValidation();
	tmp3 = subPassengerValidation();
	tmp4 = validatePayment();
	tmp5 = creditCardSelect();

	success = tmp1 && tmp2 && tmp3 && tmp4 && tmp5;
	}
	else{
		tmp1 = validateLeadPassenger();
		tmp2 = subPassengerValidation();

		success = tmp1 && tmp2;
	}

	/**
	 * Validate terms and condition box
	 */
	if (!$("#termsAndConditionsBox").attr('checked')) {
		success = false;
		setErrorPosition("- You have to agree the terms and conditions",$('#errorMsgMainDivSub'), false, null);
		if (navigator.userAgent.indexOf("Silk") != -1)
		{
			$("#termsAndConditionsBox").parent().attr("class","TitleFR fcol4 fltLeft width20 pdT2 maRight4 ErrDivSil ");
		}
		else
		{
			$("#termsAndConditionsBox").parent().attr("class","TitleFR fcol4 fltLeft width20 pdT2 maRight4 ErrDiv ");
		}
	}
	return success;
}


function findPax() {

	today = new Date();
	// gap = today.getFullYear()-leadPax ;
	var childMinAge =  $("#childMinAge").val();

	$("div[id^='passenger-']").each(function() {
		var id = $(this).attr("id");
		var pasNo = id.split("-")[1];

		$("[id^='otherBYear-'][id$='" + pasNo + "']").each(function() {
			// var inputId = $(this).attr("id");
			var inputValue = $(this).val();
			gap = today.getFullYear() - inputValue;

			if (gap >= 65)
			{
				$("#passengerAssociation-" + pasNo).val("SCIT");
			}
			else if (gap < 65 && gap > 18)
			{
				$("#passengerAssociation-" + pasNo).val("ADULTDUMMY");
			}
			else if (gap <= 18 && gap >= childMinAge)
			{
				$("#passengerAssociation-" + pasNo).val("CHILDDUMMY");
			}
			else if ( gap < childMinAge)
			{
				$("#passengerAssociation-" + pasNo).val("INFANTDUMMY");
			}
		});
	});

	var leadBOB = $("#leadBYear").val();
	leadGap = today.getFullYear() - leadBOB;

	if (leadGap >= 65)
	{
		$("#passengerAssociation-1").val("SCIT");
	}
	else if (leadGap < 65 && leadGap > 18)
	{
		$("#passengerAssociation-1").val("ADULTDUMMY");
	}
	else if (leadGap <= 18 && gap > childMinAge)
	{
		$("#passengerAssociation-1").val("CHILDDUMMY");
	}
	else if ( leadGap <= childMinAge)
	{
		$("#passengerAssociation-1").val("INFANTDUMMY");
	}

}

/**
 * This will render the credit card no boxes in accordance with the credit card
 * type.
 *
 * AMERICAN EXPRESS: (37/34)XX XXXXXX XXXXX (4, 6, 5) - 15
 *
 * VISA 4XXX XXXX XXXX XXXX (4,4,4,4) - 16/15
 *
 * MASTER CARD (51-55)xx xxxx xxxx xxxx (4,4,4,4) -16
 *
 * DISCOVER 6011 XXXX XXXX XXXX (4,4,4,4) -16
 *
 */
function formatCardNumberBoxes(type) {
	$("input[name*='cardType']").change(function() {

		$("#outCCDiv div[id^='errorPayment_']").remove();

		// Unbind default bindings
		$('#cardNumber_1').unbind('keyup');
		$('#cardNumber_2').unbind('keyup');
		$('#cardNumber_3').unbind('keyup');
		$('#cardNumber_4').unbind('keyup');

		// Clear text boxes.
		$('#cardNumber_1').val("");
		$('#cardNumber_2').val("");
		$('#cardNumber_3').val("");
		$('#cardNumber_4').val("");

		if ($(this).val() === 'A') {
			// Hide last text input field
			$("input[name='cardNumber_4']").hide();
			// Set Maxlength to 6 in the second input, 5 in the 3rd input
			$("input[name='cardNumber_2']").attr("maxlength", "6");
			$("input[name='cardNumber_3']").attr("maxlength", "5");
			// Set CSS
			$("input[name='cardNumber_2']").css("width", "45px");
			$("input[name='cardNumber_3']").css("width", "40px");

			// Set Auto-tab
			$('#cardNumber_1').autotab({
				target : 'cardNumber_2',
				format : 'numeric'
			});
			$('#cardNumber_2').autotab({
				target : 'cardNumber_3',
				maxlength : 6,
				format : 'numeric',
				previous : 'cardNumber_1'
			});
			$('#cardNumber_3').autotab({
				format : 'numeric',
				previous : 'cardNumber_2'
			});
		} else {
			// Undone above changes
			$("input[name='cardNumber_4']").show();
			$("input[name='cardNumber_2']").attr("maxlength", "4");
			$("input[name='cardNumber_3']").attr("maxlength", "4");
			$("input[name='cardNumber_2']").css("width", "35px");
			$("input[name='cardNumber_3']").css("width", "35px");

			$('#cardNumber_1').autotab({
				target : 'cardNumber_2',
				format : 'numeric'
			});
			$('#cardNumber_2').autotab({
				target : 'cardNumber_3',
				maxlength : 4,
				format : 'numeric',
				previous : 'cardNumber_1'
			});
			$('#cardNumber_3').autotab({
				target : 'cardNumber_4',
				maxlength : 4,
				format : 'numeric',
				previous : 'cardNumber_2'
			});
			$('#cardNumber_4').autotab({
				format : 'numeric',
				previous : 'cardNumber_3'
			});
		}

		if(type){
			creditCardSelect();
		}


	});
}

function initCityStateDropdown() {

	var ua = navigator.userAgent;
	if ((ua.match(/iPad/i))) {
		$('select').hover(function(e) {
			e.preventDefault();
			$(this).trigger("click");
			// alert("Cliked");
		});
	}
	$("#leadCountry").die('change');
	$("#leadCountry").live('change',function(){
		$("#leadZipCode").val("");
		$("#leadZipCode").removeClass("ErrFeeld");
		$('#infoCityDiv').remove();
		cityStateChange($(this), cityStateDropdownCallback, "");	
		if($("#leadCountry").val() != 'US' && $("#leadCountry").val() != 'CA' && $("#leadCountry").val() != 'GB')
		{						
			setNoStateCityInfoMessage();			
		}
	});

	$("#leadState").die('change');
	$("#leadState").live('change',function(){
		$("div[id^='errorPayment_leadZipCode']").remove();
		$("#leadZipCode").val("");
		$("#leadZipCode").removeClass("ErrFeeld");
		$("#leadState").removeClass("ErrFeeld");
		$("#errorPayment_leadState").remove();
		if($("#leadCountry").val() != 'US' && $("#leadCountry").val() != 'CA' )
		{
			cityStateChange($(this), cityStateDropdownCallback, "");
			setCityInfoMessage();
		}
		else
		{
			$("#leadCity").empty();
		}
	});

	$("#orderCountry").die('change');
	$("#orderCountry").live('change',function(){
		$("div[id^='errorPayment_orderZipCode']").remove();
		$("#orderZipCode").val("");
		$("#orderZipCode").removeClass("ErrFeeld");
		$('#infoOrderCityDiv').remove();
		cityStateChange($(this), cityStateDropdownCallback, "");
		if($("#orderCountry").val() != 'US' && $("#orderCountry").val() != 'CA' && $("#orderCountry").val() != 'GB')
		{						
			setNoStateOrderCityInfoMessage();			
		}
	});

	$("#orderState").die('change');
	$("#orderState").live('change',function(){
		$("div[id^='errorPayment_orderZipCode']").remove();
		$("#orderZipCode").val("");
		$("#orderZipCode").removeClass("ErrFeeld");
		$("#orderState").removeClass("ErrFeeld");
		$("#errorPayment_orderState").remove();
		if($("#orderCountry").val() != 'US' && $("#orderCountry").val() != 'CA' )
		{
			cityStateChange($(this), cityStateDropdownCallback, "");
			setOrderCityInfoMessage();
		}
		else
		{
			if(ZIP_CODE_FAIL)
			{
				cityStateChange($(this), cityStateDropdownCallback, "");
			}
			else
			{
				$("#orderCity").empty();
			}
		}
	});


		$("#leadCountry").die('keyup');
		$("#leadCountry").live('keyup',function(){
			cityStateChange($(this), cityStateDropdownCallback, "");
		});

		$("#leadState").die('keyup');
		$("#leadState").live('keyup',function(){
			$("div[id^='errorPayment_leadZipCode']").remove();
			$("#leadZipCode").val("");
			$("#leadZipCode").removeClass("ErrFeeld");
			$("#leadState").removeClass("ErrFeeld");
			$("#errorPayment_leadState").remove();
			if($("#leadCountry").val() != 'US' && $("#leadCountry").val() != 'CA' )
			{
				cityStateChange($(this), cityStateDropdownCallback, "");
				setCityInfoMessage();
			}
			else
			{
				$("#leadCity").empty();
			}
		});

		$("#orderCountry").die('keyup');
		$("#orderCountry").live('keyup',function(){
			cityStateChange($(this), cityStateDropdownCallback, "");
		});

		$("#orderState").die('keyup');
		$("#orderState").live('keyup',function(){
			$("div[id^='errorPayment_orderZipCode']").remove();
			$("#orderZipCode").val("");
			$("#orderZipCode").removeClass("ErrFeeld");
			$("#orderState").removeClass("ErrFeeld");
			$("#errorPayment_orderState").remove();
			if($("#orderCountry").val() != 'US' && $("#orderCountry").val() != 'CA' )
			{
				cityStateChange($(this), cityStateDropdownCallback, "");
			}
			else
			{
				$("#orderCity").empty();
			}
		});

		$("#leadCity").die('change');
		$("#leadCity").live('change',function(){
			$('#infoCityDiv').remove();
		});	
		
		$("#orderCity").die('change');
		$("#orderCity").live('change',function(){
			$('#infoOrderCityDiv').remove();
		});	
		
		$("#leadZipCode").die('change');
		$("#leadZipCode").live('change',function(){
			
			if(LEAD_KEY_UP_CITY_CALLED == false)
			{
				$("#leadZipCode").removeClass("ErrFeeld");
			    $("div[id^='errorPayment_leadZipCode']").remove();
				if(($("#leadCountry").val() == 'US' || $("#leadCountry").val() == 'CA') && $("#leadZipCode").val() != "" )
				{
					var leadZipCodeVals = $.trim($("#leadZipCode").val());
					 
					//Remove city filed already loaded since postal code is change
					$("#leadCity").empty();
					if($("#leadCountry").val() == 'US'  )
					{
						if(leadZipCodeVals.length == 5)
						{
							loadCityForZipCode($(this));
						}
						else
						{
							$("#leadCity").empty();
							$("#leadCity").attr('disabled','disabled');
							setErrorPosition("Cannot find city. Please enter a valid zip code.", $("#leadZipCode") , true,null);
						}
					}
					else if($("#leadCountry").val() == 'CA')
					{
						var leadZipCodeVal = leadZipCodeVals.replace(" ","");
						if(leadZipCodeVal.length == 6)
						{
							loadCityForZipCode($(this));
						}
						else
						{
							$("#leadCity").empty();
							$("#leadCity").attr('disabled','disabled');
							setErrorPosition("Cannot find city. Please enter a valid postal code.", $("#leadZipCode") , true,null);
						}
					}
				}
			}
		});	
				
		
		
		$("#leadZipCode").die('keyup');
		$("#leadZipCode").live('keyup',function(){

			LEAD_KEY_UP_CITY_CALLED = false ;
			$("#leadZipCode").removeClass("ErrFeeld");
			$("div[id^='errorPayment_leadZipCode']").remove();
			$("#leadState").removeClass("ErrFeeld");
			$("div[id^='errorPayment_leadState']").remove();
			if(($("#leadCountry").val() == 'US' || $("#leadCountry").val() == 'CA') && $("#leadZipCode").val() != "" )
			{
				var leadZipCodeVals = $.trim($("#leadZipCode").val());
				var leadstateVal = $.trim($("#leadState").val());
				 
				if(leadstateVal !=''){
					if($("#leadCountry").val() == 'US'  )
					{
						if(leadZipCodeVals.length == 5)
						{
							LEAD_KEY_UP_CITY_CALLED = true ;
							loadCityForZipCode($(this));
						}
						else if(leadZipCodeVals.length <5)
						{
							
						}
						else
						{
							$("#leadCity").empty();
							$("#leadCity").attr('disabled','disabled');
							setErrorPosition("Cannot find city. Please enter a valid zip code.", $("#leadZipCode") , true,null);
						}
					}
					else if($("#leadCountry").val() == 'CA')
					{
						var leadZipCodeVal = leadZipCodeVals.replace(" ","");
						if(leadZipCodeVal.length == 6)
						{
							LEAD_KEY_UP_CITY_CALLED = true ;
							loadCityForZipCode($(this));
						}
						else if(leadZipCodeVal.length < 6)
						{
							
						}
						else
						{
							$("#leadCity").empty();
							$("#leadCity").attr('disabled','disabled');
							setErrorPosition("Cannot find city. Please enter a valid postal code.", $("#leadZipCode") , true,null);
						}
					}
				}
				else
				{
					$("#leadState").removeClass("ErrFeeld");
					$("div[id^='errorPayment_leadState']").remove();
					//$("#leadZipCode").val("");
					var stateorProvince=null;
					if(($("#leadCountry").val() == 'US'))
					{
						stateorProvince="state";
					}
					else
					{
						stateorProvince="province";
					}
					setErrorPosition("Please select "+stateorProvince+" first.", $("#leadState") , true,null);
					
				}				
			}			
		});
		
		
		$("#orderZipCode").die('change');
		$("#orderZipCode").live('change',function(){
			
			if(PAYMENT_KEY_UP_CITY_CALLED == false)
			{
				
				$("#orderZipCode").removeClass("ErrFeeld");
			    $("div[id^='errorPayment_orderZipCode']").remove();
			    $("#orderZipCode").removeClass("ErrFeeld");
				$("div[id^='errorPayment_orderZipCode']").remove();
				$("#orderState").removeClass("ErrFeeld");
				$("div[id^='errorPayment_orderState']").remove();
				if(($("#orderCountry").val() == 'US' || $("#orderCountry").val() == 'CA') && $("#orderZipCode").val() != "" )
				{
					var leadZipCodeVals = $.trim($("#orderZipCode").val());
					 
					if($("#orderCountry").val() == 'US'  )
					{
						if(leadZipCodeVals.length == 5)
						{
							loadCityForZipCode($(this));
						}
						else
						{
							$("#orderCity").empty();
							$("#orderCity").attr('disabled','disabled');
							setErrorPosition("Cannot find city. Please enter a valid zip code.", $("#orderZipCode") , true,null);
						}
					}
					else if($("#leadCountry").val() == 'CA')
					{
						var leadZipCodeVal = leadZipCodeVals.replace(" ","");
						if(leadZipCodeVal.length == 6)
						{
							loadCityForZipCode($(this));
						}
						else
						{
							$("#orderCity").empty();
							$("#orderCity").attr('disabled','disabled');
							setErrorPosition("Cannot find city. Please enter a valid postal code.", $("#orderZipCode") , true,null);
						}
					}
				}
			}

		});
		
		
		$("#orderZipCode").die('keyup');
		$('#orderZipCode').live('keyup',function(){
			
			PAYMENT_KEY_UP_CITY_CALLED = false;
			$("#orderZipCode").removeClass("ErrFeeld");
			$("div[id^='errorPayment_orderZipCode']").remove();
			if(($("#orderCountry").val() == 'US' || $("#orderCountry").val() == 'CA') && $("#orderZipCode").val() != "" )
			{
				var orderZipCodeVals = $.trim($("#orderZipCode").val());
				var orderstateVal = $.trim($("#orderState").val());
				 
				if(orderstateVal !='')
				{
					if($("#orderCountry").val() == 'US'  )
					{
						if(orderZipCodeVals.length == 5)
						{
							PAYMENT_KEY_UP_CITY_CALLED = true;
							loadCityForZipCode($(this));							
							$("#oderPhone_1").focus();
						}
						else if(orderZipCodeVals.length < 5)
						{
							
						}
						else
						{
							$("#orderCity").empty();
							$("#orderCity").attr('disabled','disabled');
							setErrorPosition("Cannot find city. Please enter a valid zip code.", $("#orderZipCode") , true,null);
						}
					}
					else if($("#orderCountry").val() == 'CA')
					{
						var orderZipCodeVal = orderZipCodeVals.replace(" ","");
						if(orderZipCodeVal.length == 6)
						{
							PAYMENT_KEY_UP_CITY_CALLED = true;
							loadCityForZipCode($(this));
							$("#oderPhone_1").focus();
						}
						else if(orderZipCodeVal.length < 6)
						{
							
						}
						else
						{
							$("#orderCity").empty();
							$("#orderCity").attr('disabled','disabled');
							setErrorPosition("Cannot find city. Please enter a valid postal code.", $("#orderZipCode") , true,null);
						}
					}
				}
				else
				{
					$("#orderState").removeClass("ErrFeeld");
					$("div[id^='errorPayment_orderState']").remove();
					//$("#leadZipCode").val("");
					var stateorProvince=null;
					if(($("#orderCountry").val() == 'US'))
					{
						stateorProvince="state";
					}
					else
					{
						stateorProvince="province";
					}
					setErrorPosition("Please select "+stateorProvince+" first.", $("#orderState") , true,null);
				}
			}
		});
}

function setCityInfoMessage(){

	$('#infoCityDiv').remove();
		if( $('#leadState').val() != "" ){
			$("#stateDivlead").append('<div class="errorRed pdT5 pdB5 TitleFR fltLeft width5275" id="infoCityDiv">If your city is missing from the dropdown options please select the next closest </div>');
		}
}

function setOrderCityInfoMessage(){

	$('#infoOrderCityDiv').remove();
		if( $('#orderState').val() != "" && $('#orderCity').val() != "" ){
			$("#stateDivorder").append('<div class="errorRed pdT5 pdB5 TitleFR fltLeft width5275" id="infoOrderCityDiv">If your city is missing from the dropdown options please select the next closest </div>');
		}
}

function setNoStateCityInfoMessage(){

	$('#infoCityDiv').remove();
		if( $('#leadCountry').val() != "" ){
			$("#countryDivlead").append('<div class="errorRed pdT5 pdB5 TitleFR fltLeft width5275" id="infoCityDiv">If your city is missing from the dropdown options please select the next closest </div>');
		}
		
}
function setNoStateOrderCityInfoMessage(){

	$('#infoOrderCityDiv').remove();
		
		if($('#orderCountry').val() != "" ){
			$("#countryDivorder").append('<div class="errorRed pdT5 pdB5 TitleFR fltLeft width5275" id="infoOrderCityDiv">If your city is missing from the dropdown options please select the next closest </div>');
		}
}

/**
 * Function which is called when a city, country, state is changed.
 *
 * @param obj
 * @param callBack
 * @param data
 *            data which needs to be moved to the call-back method.
 * @return
 */
function cityStateChange(obj, callBack, data) {
	var selectedId = obj.attr("id");
	var value = obj.val();
	var lead = selectedId.indexOf("lead") > -1 ? "lead" : "order";
	var tabIndex = obj.attr("tabIndex");
	var param = "";
	var replaceId = "";
	var objId = "";
	var allowToSendAjax = true;
	
	$("div[id^='errorPayment_leadZipCode']").remove();
	 $("#" + lead + "ZipCode").val("");
	 
	if (selectedId.indexOf("Country") > -1)
	{
		if($("#" + lead + "Country").val() == 'US' || $("#" + lead + "Country").val() == 'CA' || $("#" + lead + "Country").val() == 'GB')
		{
			param += "requestType=STATE" + "&parentCode=" + value + "&context="+ lead + "State" + "&tabIndex=" + tabIndex;
			replaceId = lead + "StateDiv";
			objId = lead + "State";
		}
		else
		{
			param += "requestType=CITY" + "&parentCode=" + "" + "-"+ $("#" + lead + "Country").val() + "&context=" + lead + "City" + "&tabIndex=" + tabIndex;
			replaceId = lead + "CityDiv";
			objId = lead + "City";
		}

		changeLabelText(value, lead);
	}
	else if (selectedId.indexOf("State") > -1 && ($("#" + lead + "Country").val() != 'US' || $("#" + lead + "Country").val() != 'CA' ))
	{
		param += "requestType=CITY" + "&parentCode=" + value + "-"+ $("#" + lead + "Country").val() + "&context=" + lead + "City" + "&tabIndex=" + tabIndex;
		replaceId = lead + "CityDiv";
		objId = lead + "City";
	}
	else
	{
		allowToSendAjax = false;
	}
	if (allowToSendAjax) {
		doAjax("jsp/payment/city_state.jsp", param, cityStateDropdownCallback,(replaceId + "-" + objId + "-" + data), "html");
	}
}


function callOtherDomain(invocation ,url) {
	  if(invocation) {    
	    invocation.open('GET', url, true);
	    invocation.onreadystatechange = 'handler';
	    invocation.send(); 
	 }
}

/**
* for given zip code lode the city from outer DB
*/
function loadCityForZipCode( obj ){
	//blockInMiddle("blockuiwrapper");
	$("#blockedDiv").show();
	$("#messageBlock").show();
	var selectedId = obj.attr("id");
	var lead = selectedId.indexOf("lead") > -1 ? "lead" : "order";
	var param = "";
	
	// load city from given zipcode fro us and canadaa
	if($("#" + lead + "Country").val() == 'US' || $("#" + lead + "Country").val() == 'CA' )
	{
		var zipCodeVals = $.trim($("#" + lead + "ZipCode").val());
		zipCodeVals = zipCodeVals.replace(" ",""); 
		
		if($("#" + lead + "Country").val() == 'US')
		{
			param += "countryCode=us5" +"&lead="+ lead + "&zipCode=" + zipCodeVals;				
		}
		else if ($("#" + lead + "Country").val() == 'CA')
		{
			param += "countryCode=CA" +"&lead="+ lead + "&zipCode=" + zipCodeVals;
		}

		doAjaxWithBase( getBaseUrl()+ "ZipCodeController", param , zipCodeCallBack, "", "json");		
	}
}

/**
* This is the default callback method for cityName
* 
* New development for zipCodeDevelopment
*/

function zipCodeCallBack(data)
{

	var status = data["successStatus"];
	var result = data["cityList"];
	var lead = data["lead"];

	$("#"+ lead +"City").empty();
	
	$("div[id^='errorPayment_"+ lead +"ZipCode']").remove();
	$("div[id^='errorPayment_"+ lead +"State']").remove();
	
	if (status == SUCCESS)
	{
		ZIP_CODE_FAIL = false;
		// MUM-856006 Zip Code Database Development: bugs in UAT  development - since "North West Territories" province in Canada is saved differently in db
		if($("#"+ lead +"State").val() == result[0].state || ($("#"+ lead +"Country").val() == "CA" && ($("#"+ lead +"State").val()).replace(".","")== result[0].state))
		{
			
			for ( var int = 0; int < result.length; int++) 
			{
				$("#"+ lead +"City").append('<option value="'+result[int].cityCode+'">'+ result[int].name+ '</option>');
			}
			$("#errorPayment_"+lead+"State").remove();
			$("#"+lead+"State").removeClass('ErrFeeld');
			$("#"+ lead +"City").removeAttr('disabled','');
			$("#" + lead + "ZipCode").removeClass('ErrFeeld');
			$('#infoCityDiv').remove();
			$('#infoOrderCityDiv').remove();
		}
		else
		{
			$("#errorPayment_"+lead+"State").remove();
			$("#errorPayment_"+lead+"ZipCode").remove();
			if($("#"+ lead +"Country").val() == "US")
			{
				setErrorPosition("Cannot find city. Please enter a valid zip code.", $("#"+lead+"ZipCode") , true,null);	
				setErrorPosition("Cannot find city. Please enter a valid State.", $("#"+lead+"State") , true,null);
			}
			if($("#"+ lead +"Country").val() == "CA")
			{
				setErrorPosition("Cannot find city. Please enter a valid postal code.", $("#"+lead+"ZipCode") , true,null);
				setErrorPosition("Cannot find city. Please enter a valid Province.", $("#"+lead+"State") , true,null);
			}
					
		}
		$("#blockedDiv").hide();
		$("#messageBlock").hide();
	}
	else if( status == INFORMATION )
	{
		ZIP_CODE_FAIL = false;
		if($("#"+ lead +"Country").val() == "US")
		{
			setErrorPosition("Cannot find city. Please enter a valid zip code.", $("#"+lead+"ZipCode") , true,null);
		}
		if($("#"+ lead +"Country").val() == "CA")
		{
			setErrorPosition("Cannot find city. Please enter a valid postal code.", $("#"+lead+"ZipCode") , true,null);
		}
		$("#blockedDiv").hide();
		$("#messageBlock").hide();
	}
	else if(status == ERROR)
	{
		ZIP_CODE_FAIL = true;
		var element = $("#"+lead+"State");
		cityStateChangeZipCode( element, cityStateDropdownCallback, "");
	}
	//$.unblockUI();
	
}

/**
* Function which is called when a city, country, state is changed. when us or canada , when failed connet zipcode 
*
* @param obj
* @param callBack
* @param data
*            data which needs to be moved to the call-back method.
* @return
*/
function cityStateChangeZipCode(obj, callBack, data ) {
	var selectedId = obj.attr("id");
	var value = obj.val();
	var lead = selectedId.indexOf("lead") > -1 ? "lead" : "order";
	var tabIndex = obj.attr("tabIndex");
	var param = "";
	var replaceId = "";
	var objId = "";
	var allowToSendAjax = true;
	
	if (selectedId.indexOf("Country") > -1)
	{
			param += "requestType=STATE" + "&parentCode=" + value + "&context="+ lead + "State" + "&tabIndex=" + tabIndex;
			replaceId = lead + "StateDiv";
			objId = lead + "State";

			changeLabelText(value, lead);

	}
	else if (selectedId.indexOf("State") > -1)
	{
			param += "requestType=CITY" + "&parentCode=" + value + "-"+ $("#" + lead + "Country").val() + "&context=" + lead + "City" + "&tabIndex=" + tabIndex;
			replaceId = lead + "CityDiv";
			objId = lead + "City";
	}
	else
	{
		allowToSendAjax = false;
	}
	if (allowToSendAjax) {
		doAjax("jsp/payment/city_state.jsp", param, cityStateDropdownCallback,(replaceId + "-" + objId + "-" + data), "html");
	}
	$("#blockedDiv").hide();
	$("#messageBlock").hide();
}







/**
 * This is the default callback method for state option change.
 *
 * @param data
 * @param divId
 * @return
 */
function cityStateDropdownCallback(data, divId) {
	var currentValue=$("#"+divId.split("-")[1]).val();
	replaceExistingResult(data, divId.split("-")[0]);
	initCityStateDropdown();
	if ( BILLING_AS_LEAD_STATE ) // this is to set same state for billing pax as lead pax
	{
		BILLING_AS_LEAD_STATE = false;
		BILLING_AS_LEAD_CITY = true;
		//$("#orderState").val($("#leadState").val()).click();
		if($("#orderCountry").val() == 'US' || $("#orderCountry").val() == 'CA' )
		{
			if(ZIP_CODE_FAIL)
			{
				$("#orderState").val($("#leadState").val()).change();
				$("#orderZipCode").val($("#leadZipCode").val());
			}
			else
			{
				$("#orderState").val($("#leadState").val()).click();
			}
		}
		else if( $("#orderCountry").val() == 'GB')
		{
			$("#orderState").val($("#leadState").val()).change();
			$("#orderZipCode").val($("#leadZipCode").val());
		}
		else
		{
			BrowserDetect.init();
			var browserNames  = BrowserDetect.Browser;
			if(browserNames != "Explorer")
			{
				if(sameAsLeadToOrder.checked)
				{
					$("#orderCity").val($("#leadCity").val());
				}
			}
			else if (browserNames == "Explorer")
			{
				if($("#sameAsLeadToOrder").is(":checked"))
				{
					$("#orderCity").val($("#leadCity").val());
				}
			}
		}
	}
	else if ( BILLING_AS_LEAD_CITY ) // this is to set same city for billing pax as lead pax
	{
		BILLING_AS_LEAD_CITY = false;
		$("#orderCity").val($("#leadCity").val());
	}
	else
	{
		if (divId.split("-").length > 1) {
			$("#" + divId.split("-")[1]).val(currentValue);
			$("#" + divId.split("-")[1]).trigger("click");
		}
	}

	if( $("#leadCountry").val() == 'CA' || $("#leadCountry").val() == 'GB' ||  $("#leadCountry").val() == 'US' )
	{
		cityDisableLead();
	}
	else
	{
		$("#leadCity").removeAttr('disabled','');
	}

	if( $("#orderCountry").val() == 'CA' || $("#orderCountry").val() == 'GB' ||  $("#orderCountry").val() == 'US' )
	{
		cityDisableOrder();
	}
	else
	{
		$("#orderCity").removeAttr('disabled','');
	}
	
}

function selectPreSelectedPassenger() {
	$("select[id*='passengerAddFromOther']").unbind("change");
	$("select[id*='passengerAddFromOther']").change(
			function() {

				var passengerId = $(this).attr("id").split("-")[1] + "-" + $(this).attr("id").split("-")[2];
				var value = $(this).val().split("|");

				$("input[id$='" + passengerId + "'], select[id$='" + passengerId + "']").each(function() {
					var inputId = $(this).attr("id");
					if (inputId.indexOf("passengerTitle") > -1) {
						var gender = value[8] ? value[8] : "";
						$(this).val(value[0] + "-" + gender);
					}
					if (inputId.indexOf("passengerFirstName") > -1) {
						$(this).val(value[1] ? value[1] : "");
					}
					if (inputId.indexOf("passengerLastName") > -1) {
						$(this).val(value[2] ? value[2] : "");
					}

					if (inputId.indexOf("passengerBday") > -1) {
						$(this).val(value[4] ? value[4] : "");
					}
					if (inputId.indexOf("passengerPassportNo") > -1) {
						$(this).val(value[5] ? value[5] : "");
					}
					if (inputId.indexOf("isLead") > -1) {
						$(this).val(value[6]);
					}
					if (inputId.indexOf("PassportExpDate") > -1) {
						$(this).val(value[7] ? value[7] : "");
					}
					if (inputId.indexOf("passengerGender") > -1) {
						$(this).val(value[8] ? value[8] : "");
					}
					if (inputId.indexOf("passengerCityzenship") > -1) {
						$(this).val(value[9] ? value[9] : "");
					}
				});
			});	
	
	// prevent browser back
	/*document.onkeydown = function(e) 
	  {	
		var key = e.keyCode || e.charCode;

		if (key == 8 || key == 46 || isPaymentPage ) 
		{			
			window.location.hash="no-back-button";				

			if(browserName == "Safari")
			{					
					window.location.hash="no-back-button";					
			}
			else
			{
					window.location.hash="no-back-button";					
			}
		}
	};*/	
}

function validateLeadPassenger() {

	var isValid = true;

	if ($.trim($('#leadFirstName').val()) == "" || $.trim($('#leadFirstName').val()).length < 0) {
		setErrorPosition("Please enter First Name", $('#leadFirstName'),true, null);
		isValid = false;
	} else if (!$('#leadFirstName').val().match(namePattern)) {
		setErrorPosition("Please enter valid First Name",$('#leadFirstName'), true, null);
		isValid = false;
	}

	if ($.trim($('#leadLastName').val()) == "" || $.trim($('#leadLastName').val()).length < 0) {
		setErrorPosition("Please enter Last Name", $('#leadLastName'), true,null);
		isValid = false;
	} else if (!$('#leadLastName').val().match(namePattern)) {
		setErrorPosition("Please enter valid Last Name",$('#leadLastName'), true, null);
		isValid = false;
	}

	var d = true;
	var m = true;
	var y = true;

	if ($('#leadBMonth').val() == "" || $('#leadBMonth').val().length < 0) {
		m = false;
	} else if (parseInt($('#leadBMonth').val()) > 12|| !$('#leadBMonth').val().match(dobMonth)) {
		m = false;
	}

	if ($('#leadBDay').val() == "" || $('#leadBDay').val().length < 0) {
		d = false;
	} else if (parseInt($('#leadBDay').val()) > 31|| !$('#leadBDay').val().match(dobDay)) {
		d = false;
	}

	if ($('#leadBYear').val() == "" || $('#leadBYear').val().length < 0) {
		y = false;
	} else if (!$('#leadBYear').val().match(dobYear)) {
		y = false;
	}

	if (!(d & m & y)) {
		setErrorPosition("Please enter valid Date of Birth", $('#leadBdob'),false, 200);
		isValid = false;
	}
	else
	{
		// lead passenger must be over 18yrs
		var enteredYear = $('#leadBYear').val();
		var currentYear = new Date().getFullYear();

		if(enteredYear > currentYear){
			isValid = false;
			setErrorPosition("Please enter valid Date of Birth", $('#leadBdob'),false, 200);
		}
		else
		{
			 var today = new Date(); // today date object
		     var birthday = new Date( $('#leadBYear').val(),$('#leadBMonth').val()-1,$('#leadBDay').val()); // birthday date object
		     // calculate age
		     var age = (today.getMonth() == birthday.getMonth() && today.getDate() >= birthday.getDate()) ?
		            today.getFullYear() - birthday.getFullYear() : ((today.getMonth() > birthday.getMonth()) ?
		                  today.getFullYear() - birthday.getFullYear() :
		                        today.getFullYear() - birthday.getFullYear()-1);
		     if(age < 18)
		     {
		    	 isValid = false;
		    	 setErrorPosition("Lead Passenger should be 18yrs or older", $('#leadBdob'),false, 200);
		     }
		}
	}

	if ($.trim($('#leadAddress').val()) == "" || $.trim($('#leadAddress').val()).length < 0) {
		setErrorPosition("Please enter Address", $('#leadAddress'), true,null);
		isValid = false;
	}
	if ($.trim($('#leadCity').val()) == "" || $.trim($('#leadCity').val()).length < 0) {
		setErrorPosition("Please enter City", $('#leadCity'), true , null);
		isValid = false;
	}

	if ($.trim($('#leadZipCode').val()) == "" || $.trim($('#leadZipCode').val()).length < 0)
	{
		if ( $("span[id='zipLblUSlead']").is(":visible") )
		{
			setErrorPosition("Please enter Zip Code", $('#leadZipCode'), true,null);
		}
		else
		{
			setErrorPosition("Please enter Postal Code", $('#leadZipCode'), true,null);
		}
		isValid = false;
	}
	if ($.trim($('#leadPhone_1').val()) == "" || $.trim($('#leadPhone_1').val()).length < 0) {
		setErrorPosition("Please enter Phone Number", $('#leadPhone_1'),true, null);
		isValid = false;
	}
	$("input[id^='leadPhone']").each( function()
	{
		var obj = $(this);
		var value = $.trim(obj.val());
		if ( (value.length > 0 && value.length < 9) || !phonePattern.test( value ) )
		{
			isValid = false;
			//mark as red since values are not valid
			setErrorPosition("Please enter valid Phone Number",obj, true, null);
		}
	});

	if ($.trim($('#leadEmail').val()) == "" || $.trim($('#leadEmail').val()).length < 0) {
		setErrorPosition("Please enter Email", $('#leadEmail'), true, null);
		isValid = false;
	} else if (!$('#leadEmail').val().match(emailPattern)) {
		setErrorPosition("Please enter valid Email", $('#leadEmail'), true,null);
		isValid = false;
	}

	if ($.trim($('#leadConfirmAddress').val()) == ""|| $.trim($('#leadConfirmAddress').val()).length < 0) {
		setErrorPosition("Please enter Confirm Email Address",$('#leadConfirmAddress'), true, null);
		isValid = false;
	} else if (!$('#leadConfirmAddress').val().match(emailPattern)) {
		setErrorPosition("Please enter valid Confirm Email Address",$('#leadConfirmAddress'), true, null);
		isValid = false;
	}

	else if ($('#leadConfirmAddress').val() != $('#leadEmail').val()) {
		setErrorPosition("Emails do not match",$('#leadConfirmAddress'), true, null);
		isValid = false;
	}

	if ($('#leadPassportNum').length > 0) {
		if ($.trim($('#leadPassportNum').val()) == ""|| $.trim($('#leadPassportNum').val()).length < 0) {
			setErrorPosition("Please Enter passport Number",$('#leadPassportNum'), true, null);
			isValid = false;
		} else if (!$('#leadPassportNum').val().match(passportPattern)) {
			setErrorPosition("Please Enter valid passport Number",$('#leadPassportNum'), true, null);
			isValid = false;
		}
	}

	if ($('#leadPassportExp').length > 0) {
		if ($.trim($('#leadPassportExp').val()) == ""|| $.trim($('#leadPassportExp').val()).length < 0)
		{
			setErrorPosition("Please Enter passport Expire Date",$('#leadPassportExp'), true, null);
			isValid = false;
		}
		else if (!$('#leadPassportExp').val().match(expDatePattern))
		{
			setErrorPosition("Please Enter passport Expire Date in MM/DD/YYYY format",$('#leadPassportExp'), true, null);
			isValid = false;
		}
		else if( $("input[id='passportExpDateValidate']").length > 0 )
		{
			var validTo = $("input[id='passportExpDateValidate']").val();
			var shouldValidUntil = new Date();
			var validDateUntilArr = validTo.split("/");
			shouldValidUntil.setFullYear(parseFloat(validDateUntilArr[2]),(parseFloat(validDateUntilArr[0]) - 1),parseFloat(validDateUntilArr[1]));

			var validDate = new Date();
			var validDateArr = $('#leadPassportExp').val().split("/");
			validDate.setFullYear(parseFloat(validDateArr[2]),(parseFloat(validDateArr[0]) - 1),parseFloat(validDateArr[1]));

			if( validDate < shouldValidUntil )
			{
				isValid = false;
				setErrorPosition("Your passport should be valid until your itinerary is complete",$('#leadPassportExp'), true, null);
			}
		}
	}

	return isValid;
}

function orderValidation() {

	var isValid = true;

	if ($.trim($('#orderFirstName').val()) == ""|| $.trim($('#orderFirstName').val()).length < 0) {
		setErrorPosition("Please enter First Name", $('#orderFirstName'),true, null);
		isValid = false;
	} else if (!$('#orderFirstName').val().match(namePattern)) {
		setErrorPosition("Please enter valid First Name",$('#orderFirstName'), true, null);
		isValid = false;
	}

	if ($.trim($('#orderLastName').val()) == "" ||$.trim($('#orderLastName').val()).length < 0) {
		setErrorPosition("Please enter Last Name", $('#orderLastName'),true, null);
		isValid = false;
	} else if (!$('#orderLastName').val().match(namePattern)) {
		setErrorPosition("Please enter valid Last Name",$('#orderLastName'), true, null);
		isValid = false;
	}

	if ($.trim($('#orderAddress').val()) == "" || $.trim($('#orderAddress').val()).length < 0) {
		setErrorPosition("Please enter Address", $('#orderAddress'), true,null);
		isValid = false;
	}

	if ($.trim($('#orderCity').val()) == "" || $.trim($('#orderCity').val()).length < 0 || $.trim($('#orderCity').val()) == "null") {
		setErrorPosition("Please enter City", $('#orderCity'), true , null);
		isValid = false;
	}

	if ($.trim($('#orderZipCode').val()) == "" || $.trim($('#orderZipCode').val()).length < 0)
	{
		if ( $("span[id='zipLblUSorder']").is(":visible") )
		{
			setErrorPosition("Please enter Zip Code", $('#orderZipCode'), true,null);
		}
		else
		{
			setErrorPosition("Please enter Postal Code", $('#orderZipCode'), true,null);
		}
		isValid = false;
	}

	return isValid;

}

function subPassengerValidation() {

	var isValid = true;
	/**
	 * Validate item passengers
	 */
	var titleArray = new Array();
	var firstNameArray = new Array();
	var lastNameArray = new Array();
	var passportArray = new Array();
	var birthdaysArrayDD = new Array();
	var birthdaysArrayMM = new Array();
	var birthdaysArrayYY = new Array();

	$("div[id^='passenger-']")
			.each(
					function() {
						var id = $(this).attr("id");
						var pasNo = id.split("-")[1];

						if ($.trim($('#otherPFirstName-' + pasNo).val()) == "" || $.trim($('#otherPFirstName-' + pasNo).val()).length < 0) {
							setErrorPosition("Please enter First Name",$('#otherPFirstName-' + pasNo), true, null);
							isValid = false;
						} else if (!$('#otherPFirstName-' + pasNo).val().match(namePattern)) {
							setErrorPosition("Please enter valid First Name",$('#otherPFirstName-' + pasNo), true, null);
							isValid = false;
						}

						if ($.trim($('#otherPLastName-' + pasNo).val()) == ""|| $.trim($('#otherPLastName-' + pasNo).val()).length < 0) {
							setErrorPosition("Please enter Last Name",$('#otherPLastName-' + pasNo), true, null);
							isValid = false;
						} else if (!$('#otherPLastName-' + pasNo).val().match(namePattern)) {
							setErrorPosition("Please enter valid Last Name",$('#otherPLastName-' + pasNo), true, null);
							isValid = false;
						}

						var d = true;
						var m = true;
						var y = true;
						if ( $.trim($('#otherBDay-' + pasNo).val()) == ""||  $.trim($('#otherBDay-' + pasNo).val()).length < 0) {
							d = false;
						} else if (parseInt( $('#otherBDay-' + pasNo).val()) > 31|| !$('#otherBDay-' + pasNo).val().match(dobDay)) {
							d = false;
						}

						if ( $.trim($('#otherBMonth-' + pasNo).val()) == ""||  $.trim($('#otherBMonth-' + pasNo).val()).length < 0) {
							m = false;
						} else if (parseInt($('#otherBMonth-' + pasNo).val()) > 12|| !$('#otherBMonth-' + pasNo).val().match(dobMonth)) {
							m = false;
						}

						if ( $.trim($('#otherBYear-' + pasNo).val()) == ""||  $.trim($('#otherBYear-' + pasNo).val()).length < 0) {
							y = false;
						} else if (!$('#otherBYear-' + pasNo).val().match(dobYear)) {
							y = false;

						}

						if (!(d & m & y)) {
							setErrorPosition("Please enter valid Date of Birth",$('#otherBDob-' + pasNo), false, pasNo);
							isValid = false;
						}

						if ($('#otherPassportNum-' + pasNo).length > 0) {
							if ($.trim($('#otherPassportNum-' + pasNo).val()) == ""|| $.trim($('#otherPassportNum-' + pasNo).val()).length < 0) {
								setErrorPosition("Please enter Passport Number",$('#otherPassportNum-' + pasNo), true,null);
								isValid = false;
							} else if (!$('#otherPassportNum-' + pasNo).val().match(passportPattern)) {
								setErrorPosition("Please enter valid Passport Number",$('#otherPassportNum-' + pasNo), true ,null);
								isValid = false;
							}
						}

						if ($('#otherPassportExp-' + pasNo).length > 0)
						{
							if ($.trim($('#otherPassportExp-' + pasNo).val()) == ""|| $.trim($('#otherPassportExp-' + pasNo).val()).length < 0)
							{
								setErrorPosition("Please enter Passport Expire Date",$('#otherPassportExp-' + pasNo), true,null);
								isValid = false;
							}
							else if (!$('#otherPassportExp-' + pasNo).val().match(expDatePattern))
							{
								setErrorPosition("Please enter Passport Expire Date as MM/DD/YYYY format",$('#otherPassportExp-' + pasNo), true,null);
								isValid = false;
							}
							else if( $("input[id='passportExpDateValidate']").length > 0 )
							{
								var validTo = $("input[id='passportExpDateValidate']").val();
								var shouldValidUntil = new Date();
								var validDateUntilArr = validTo.split("/");
								shouldValidUntil.setFullYear(parseFloat(validDateUntilArr[2]),(parseFloat(validDateUntilArr[0]) - 1),parseFloat(validDateUntilArr[1]));

								var validDate = new Date();
								var validDateArr = $('#otherPassportExp-' + pasNo).val().split("/");
								validDate.setFullYear(parseFloat(validDateArr[2]),(parseFloat(validDateArr[0]) - 1),parseFloat(validDateArr[1]));

								if( validDate < shouldValidUntil )
								{
									isValid = false;
									setErrorPosition("Your passport should be valid until your itinerary is complete",$('#otherPassportExp-' + pasNo), true, null);
								}
							}
						}

					// check for same passenger and passport details
					titleArray[pasNo] = $('#otherPTitle-' + pasNo);
					firstNameArray[pasNo] = $('#otherPFirstName-' + pasNo);
					lastNameArray[pasNo] = $('#otherPLastName-' + pasNo);
					passportArray[pasNo] = $('#otherPassportNum-' + pasNo);
					birthdaysArrayDD[pasNo] = $('#otherBDay-' + pasNo);
					birthdaysArrayMM[pasNo] = $('#otherBMonth-' + pasNo);
					birthdaysArrayYY[pasNo] = $('#otherBYear-' + pasNo);


					});
					/**
					 * Validate name equality.
					 */
					var setError = false ;
					for(var x = 1; x < titleArray.length; x++)
					{
						var toRed = new Array();
						toRed[0] = titleArray[x];
						toRed[1] = firstNameArray[x];
						toRed[2] = lastNameArray[x];
						toRed[3] = birthdaysArrayDD[x];
						toRed[4] = birthdaysArrayMM[x];
						toRed[5] = birthdaysArrayYY[x];

						if( (!titleArray[x].val() || titleArray[x].val().length < 1) || (!firstNameArray[x].val() || firstNameArray[x].val().length < 1) || (!lastNameArray[x].val() || lastNameArray[x].val().length < 1) )
						{
							continue;
						}
						var compName = titleArray[x].val() + firstNameArray[x].val() + lastNameArray[x].val();
						var compBday = birthdaysArrayDD[x].val()+birthdaysArrayMM[x].val()+birthdaysArrayYY[x].val();
						for(var y = x + 1; y < titleArray.length; y++)
						{
							toRed[3] = titleArray[y];
							toRed[4] = firstNameArray[y];
							toRed[5] = lastNameArray[y];
							var toCompName = titleArray[y].val() + firstNameArray[y].val() + lastNameArray[y].val();
							var toCompBday = birthdaysArrayDD[y].val()+birthdaysArrayMM[y].val()+birthdaysArrayYY[y].val();

							if( (!titleArray[y].val() || titleArray[y].val().length < 1) || (!firstNameArray[y].val() || firstNameArray[y].val().length < 1) || (!lastNameArray[y].val() || lastNameArray[y].val().length < 1) )
							{
								continue;
							}

							if(compName === toCompName && compBday === toCompBday)
							{
								isValid = false;
								setError = true ;

								for(var z = 0; z < toRed.length; z++)
								{
									unbindHover(toRed[z]);
									$("div[id='errorPayment_"+ toRed[z].attr("id") +"']").remove();
									setError = true ;
								}
							}

							if(setError){
								setErrorPosition("values should be unique for passenger",$('#otherPTitle-'+ x), true,null);
								setErrorPosition("",$('#otherPFirstName-'+ x), true,null);
								setErrorPosition("",$('#otherPLastName-'+ x), true,null);
								setErrorPosition("",$('#otherPassportNum-'+ x), true,null);

								setErrorPosition("",$('#otherBDay-'+ x), true,null);
								setErrorPosition("",$('#otherBMonth-'+ x), true,null);
								setErrorPosition("",$('#otherBYear-'+ x), true,null);


								setErrorPosition("values should be unique for passenger",$('#otherPTitle-'+ y), true,null);
								setErrorPosition("",$('#otherPFirstName-'+ y), true,null);
								setErrorPosition("",$('#otherPLastName-'+ y), true,null);
								setErrorPosition("",$('#otherPassportNum-'+ y), true,null);

								setErrorPosition("",$('#otherBDay-'+ y), true,null);
								setErrorPosition("",$('#otherBMonth-'+ y), true,null);
								setErrorPosition("",$('#otherBYear-'+ y), true,null);

								setError = false ;
							}
						}
					}

					/**
					 * Validate for passport equality
					 */
					for(var x = 1; x < passportArray.length; x++)
					{
						var toRed = new Array();
						toRed[0] = passportArray[x];
						var compPassCode = passportArray[x].val();
						if(!compPassCode || compPassCode.length < 1)
						{
							continue;
						}
						for(var y = x + 1; y < passportArray.length; y++)
						{
							toRed[1] = passportArray[y];
							var toCompPassCode = passportArray[y].val();
							if(!toCompPassCode || toCompPassCode.length < 1)
							{
								continue;
							}
							if(compPassCode === toCompPassCode)
							{
								isValid = false;
								for(var z = 0; z < toRed.length; z++)
								{
									//make item red since names are equal
									setErrorPosition("values should be unique.",toRed[z], true,null);
								}
							}
						}
					}
	return isValid;

}

function validatePayment() {

	var isValid = true;
	// card details
	var isTotalGiftCard=isTotalPayByGC();
	if (!isTotalGiftCard && $.trim($('#cardHolderName').val()) == ""|| $.trim($('#cardHolderName').val()).length < 0) {
		setErrorPosition("Please enter Card Holder Name",$('#cardHolderName'), true, null);
		isValid = false;
	} else if (!isTotalGiftCard && !$('#cardHolderName').val().match(namePattern)) {
		setErrorPosition("Please enter valid Card Holder Name",$('#cardHolderName'), true, null);
		isValid = false;
	}

	if (!isTotalGiftCard && $('#cardExpireYear').val() == ""|| $('#cardExpireYear').val().length < 0) {
		setErrorPosition("Please enter Card Expiry Year", $('#ccError'), false,500);
		isValid = false;
	}

	if (!isTotalGiftCard && $('#cardExpireMoth').val() == ""|| $('#cardExpireMoth').val().length < 0) {
		setErrorPosition("Please enter card Expiry Month", $('#ccError'),false, 400);
		isValid = false;
	}

	var nCCMonth = $('#cardExpireMoth').val();
	var nCCYear = $('#cardExpireYear').val();

	var currentMonth = date.getMonth();
	var currentYear = date.getFullYear();

	if (!isTotalGiftCard && nCCYear == currentYear) {
		if (nCCMonth <= currentMonth) {
			setErrorPosition("Please provide a valid card expiry date",$('#ccError'), false, 400);
			isValid = false;
		}
	} else if (nCCYear < currentYear) {
		setErrorPosition("Please provide a valid card expiry date",$('#ccError'), false, 500);
		isValid = false;
	}

	if (!isTotalGiftCard && $('#cardCW').val() == "" || $('#cardCW').val().length < 0) {
		setErrorPosition("Please enter cardCW .", $('#cardCW'), true, null);
		isValid = false;
	} else if (!isTotalGiftCard && $('#cardCW').val().length < 3) {
		setErrorPosition("Enter 3 or 4 digit code depending on the credit card type. For all types besides Amex, this is located on the back of the card.",
				$('#cardCW'), true, null);
		isValid = false;
	}

	return isValid;
}

function hideModel(){

	$__searchBan("div[id='baseCal']").each(
			function() {
				$__searchBan(this).hide();
			});
}

function creditCardSelect() {

	var isValid = true;

	// Validate credit card Number details
	var isTotalGiftCard=isTotalPayByGC();
	if (!isTotalGiftCard && $('#cardType-V').attr('checked')) {
		if (($('#cardNumber_1').val().substring(0, 1) != "4")) {
			setErrorPosition("Please fill the credit card number in the format of 4XXX XXXX XXXX XXXX ",$('#ccDiv'), false, null);
			isValid = false;
		}
	}
	if (!isTotalGiftCard && $('#cardType-M').attr('checked')) {
		if (($('#cardNumber_1').val().substring(0, 1) != "5")) {
			setErrorPosition("Please fill the credit card number in the format of 5XXX XXXX XXXX XXXX",$('#ccDiv'), false, null);
			isValid = false;
		}
	}
	if (!isTotalGiftCard && $('#cardType-A').attr('checked')) {
		if (($('#cardNumber_1').val().substring(0, 1) != "3")) {
			setErrorPosition("Please fill the credit card number in the format of 37XX XXXXXX XXXXX",$('#ccDiv'), false, null);
			isValid = false;
		}
	}
	if (!isTotalGiftCard && $('#cardType-D').attr('checked')) {
		if (($('#cardNumber_1').val().substring(0, 1) != "6")) {
			setErrorPosition("Please fill the credit card number in the format of 6011 XXXX XXXX XXXX",$('#ccDiv'), false, null);
			isValid = false;
		}
	}

	return isValid;
}


function setErrorPosition(message, obj, idError, type) {

	if (idError) {
		obj.addClass("ErrFeeld");
	}

	if (type == 200) { // lead bob
		$("#leadBMonth").addClass("ErrFeeld");
		$("#leadBDay").addClass("ErrFeeld");
		$("#leadBYear").addClass("ErrFeeld");
	} else if (type == 400) {// exp date
		$("#cardExpireMoth").addClass("ErrFeeld");
	} else if (type == 500) {// exp date
		$("#cardExpireYear").addClass("ErrFeeld");
	} else if (type < 30) { // other
			$('#otherBDay-' + type).addClass("ErrFeeld");
			$('#otherBMonth-' + type).addClass("ErrFeeld");
			$('#otherBYear-' + type).addClass("ErrFeeld");
	}

	if(message.length > 0){
		var id = obj.attr("id");
		var errorDiv = $('<div class="ErrLbl" id="errorPayment_' + id + '">'+ message + '<div/>');
		var position = obj.position();
		errorDiv.css("display", "");
		obj.parent().append(errorDiv);
	}
}

function showError(message, obj, addClass) {
	if (addClass) {
		obj.addClass("ErrFeeld");
	}
	$(obj).hover(function() {
		var errorMsgDiv = $("#validationErrorDivContent");
		var position = obj.position();
		errorMsgDiv.html(message);

	}, function() {
		$("#validationErrorDiv").hide();
	});
}

function setOrderPhoneNumbers() {
	// set lead phone numbers to order phone numbers for creating direct client
	$("input[name*='leadPhone']").each(function() {

		var tpID = $(this).attr("id").split('_')[1];
		var tpVal = $(this).val();
		if (tpID === '1') {
			$("#orderPhone_1").val(tpVal);
		} else if (tpID === '2') {
			$("#orderPhone_2").val(tpVal);
		} else if (tpID === '3') {
			$("#orderPhone_3").val(tpVal);
		}
	});
	$("select[name*='leadPhoneType']").each(function() {

		var typeID = $(this).attr("id").split('_')[1];
		var typeVal = $(this).val();
		if (typeID === '1') {
			$("#orderPhoneType_1").val(typeVal);
		} else if (typeID === '2') {
			$("#orderPhoneType_2").val(typeVal);
		} else if (typeID === '3') {
			$("#orderPhoneType_3").val(typeVal);
		}
	});

	var leademail = $('#leadEmail').val();
	$("#orderEmail").val(leademail);
}

function setPreferedPhoneNumber() {

	var value = $('#leadPhone_1').val();
	$("#orderPreferedPhone").val(value);
	$("#leadPreferedPhone").val(value);
}

/**
 * Used to unbind the error messages and change the displaying again.
 *
 * @param obj
 * @return
 */
function unbindHover(obj) {
	obj.removeClass("fieldError");
	$(obj).hover(function() {
		$("#validationErrorDiv").hide();
	}, function() {
		$("#validationErrorDiv").hide();
	});
}

/**
 * function to display mouse city , and CVV pop up
 *
 * @param obj
 * @return
 */
function showpopUp() {

	$("#popUpCVV").unbind('click');
	$("a[id='popUpCVV']").click(function() {
		var p2 = $('#popUpCVV').position();
		$("#paymentPopUpCVV").css('display', '');
//		$("#paymentPopUpCVV").css('top', p2.top + 30  + 'px');
		$("#paymentPopUpCVV").css('left', p2.left -5 + 'px');
		$("#paymentPopUpCVV").css('position', "absolute");
		$("#paymentPopUpCVV").css('margin-top', -170 + "px");

		showPopManager('paymentPopUpCVV');

		$(window).resize(function() {

/*			p2 = $('#popUpCVV').position();
			$("#paymentPopUpCVV").css('display', 'none');
			$("#paymentPopUpCVV").css('top', p2.top - 90 + 'px');
			$("#paymentPopUpCVV").css('left', p2.left -100 + 'px');
			$("#paymentPopUpCVV").css('position', "absolute");
			showPopManager('paymentPopUpCVV');*/
			 $("#paymentPopUpCVV").removeAttr("style");
			$("#paymentPopUpCVV").css('display', 'none');
		});

	});

	$("#taxFees").unbind('hover');
	$("#taxFees").hover(function(event) {
		var p3 = $('#taxFees').position();
		$('#supplimentList').css('position', "absolute");
		$('#supplimentList').css('display', "");
		$('#supplimentList').css('top', (p3.top + 25 + 'px'));
		$('#supplimentList').css('left', (p3.left - 165 + 'px'));
	}, function() {
		$('#supplimentList').hide();
	});

	$("#bestDeal").unbind('click');
	$("#bestDeal").click(function(event) {

		window
		.open(
				$("#clipperBase").val()+"best-price-guarantee",
				"",
				"resizable=no,toolbar=1,status=0,scrollbars=1,menubar=0,fullscreen=no,width="
						+ 850 + ",height=" + 1000
						+ ",top=" + 100 + ",left="
						+ 200);
	});

	$("a[id='properIdLink']").unbind('hover');
	$("a[id='properIdLink']").hover(function(e) {
		var p4 = $('#properIdLink').position();
		$("#identificationPopUp").show();
		if(window.innerWidth < 600){
			$("#identificationPopUp").css('top',600 + 'px');
			$("#identificationPopUp").css('left', 330 + 'px');
		}else if(window.innerWidth == 600 ){
			$("#identificationPopUp").css('top',650 + 'px');
			$("#identificationPopUp").css('left', 430 + 'px');
		}else if (window.innerWidth > 600 && (window.innerWidth < 850 || window.innerWidth == 800 )){
			$("#identificationPopUp").css('top', 550 + 'px');
			$("#identificationPopUp").css('left', 480 + 'px');
		}else if (window.innerWidth > 850){
			$("#identificationPopUp").css('top', p4.top + 20 + 'px');
			$("#identificationPopUp").css('left', p4.left -100 + 'px');
		}
		BrowserDetect.init();
		var browserName  = BrowserDetect.Browser;
		if(browserName == "Explorer" && BrowserDetect.version == 8){
			$("#identificationPopUp").css('top', p4.top + 20 + 'px');
			$("#identificationPopUp").css('left', p4.left -200 + 'px');
		}
		$("#identificationPopUp").css('z-index' , ' 99999');
		$("#identificationPopUp").css('position', "absolute");

	}, function() {
		$('#identificationPopUp').hide();
	});
	$(window).resize(function() {
		$('#identificationPopUp').hide();
	});

	$("#paymentClose_2").click(function() {
		$("#paymentPopUpCVV").css('display', 'none');
		bgDiv.hide();
	});

	$("#identificationPopUp_Close").click(function() {
		$("#identificationPopUp").css('display', 'none');
		bgDiv.hide();
	});

	$("#leadBMonth").unbind('hover');
	$("#leadBMonth").hover(function(event) {
		if ($("#leadBMonth").val() == "MM") {
			$("#leadBMonth").val('');
		}
	}, function() {
		if ($("#leadBMonth").val() == '') {
			$("#leadBMonth").val('MM');
		}
	});

	$("#leadBDay").unbind('hover');
	$("#leadBDay").hover(function(event) {
		if ($("#leadBDay").val() == "DD") {
			$("#leadBDay").val('');
		}
	}, function() {
		if ($("#leadBDay").val() == '') {
			$("#leadBDay").val('DD');
		}
	});

	$("#leadBYear").unbind('hover');
	$("#leadBYear").hover(function(event) {
		if ($("#leadBYear").val() == "YYYY") {
			$("#leadBYear").val('');
		}
	}, function() {
		if ($("#leadBYear").val() == '') {
			$("#leadBYear").val('YYYY');
		}
	});

	$("div[id^='passenger-']").each(function() {
		var id = $(this).attr("id");
		var pasNo = id.split("-")[1];

		$('#otherBDay-' + pasNo).unbind('hover');
		$('#otherBDay-' + pasNo).hover(function(event) {
			if ($('#otherBDay-' + pasNo).val() == "DD") {
				$('#otherBDay-' + pasNo).val('');
			}
		}, function() {
			if ($('#otherBDay-' + pasNo).val() == '') {
				$('#otherBDay-' + pasNo).val('DD');
			}
		});

		$('#otherBMonth-' + pasNo).unbind('hover');
		$('#otherBMonth-' + pasNo).hover(function(event) {
			if ($('#otherBMonth-' + pasNo).val() == "MM") {
				$('#otherBMonth-' + pasNo).val('');
			}
		}, function() {
			if ($('#otherBMonth-' + pasNo).val() == '') {
				$('#otherBMonth-' + pasNo).val('MM');
			}
		});

		$('#otherBYear-' + pasNo).unbind('hover');
		$('#otherBYear-' + pasNo).hover(function(event) {
			if ($('#otherBYear-' + pasNo).val() == "YYYY") {
				$('#otherBYear-' + pasNo).val('');
			}
		}, function() {
			if ($('#otherBYear-' + pasNo).val() == '') {
				$('#otherBYear-' + pasNo).val('YYYY');
			}
		});
	});

}

function OnFocusInput(input) {

	if (input.value == "MM" | input.value == "DD" | input.value == "YYYY") {
		input.value = '';
	}
}


function changeLabelText(value, lead)
{
	if( value === 'CA' )
	{
		$("div[id='stateDiv" + lead + "']").show();
		$("span[id='stateLblCA" + lead + "']").show();
		$("span[id='stateLblUS" + lead + "']").hide();
		$("span[id='stateLblGB" + lead + "']").hide();

		$("span[id='zipLblUS" + lead + "']").hide();
		$("span[id='zipteLblOther" + lead + "']").show();
	}
	else if( value === 'GB' )
	{
		$("div[id='stateDiv" + lead + "']").show();
		$("span[id='stateLblCA" + lead + "']").hide();
		$("span[id='stateLblUS" + lead + "']").hide();
		$("span[id='stateLblGB" + lead + "']").show();

		$("span[id='zipLblUS" + lead + "']").hide();
		$("span[id='zipteLblOther" + lead + "']").show();
	}
	else if( value === 'US' )
	{
		$("div[id='stateDiv" + lead + "']").show();
		$("span[id='stateLblCA" + lead + "']").hide();
		$("span[id='stateLblUS" + lead + "']").show();
		$("span[id='stateLblGB" + lead + "']").hide();

		$("span[id='zipLblUS" + lead + "']").show();
		$("span[id='zipteLblOther" + lead + "']").hide();
	}
	else
	{
		$("div[id='stateDiv" + lead + "']").hide();
		$("span[id='zipLblUS" + lead + "']").hide();
		$("span[id='zipteLblOther" + lead + "']").show();
	}
}

function showBestDealPopup(obj){
	var position = obj.position();
	var topVal = position.top+45;
	var leftVal = position.left-10;
	showOverlay($("div[id='bestDealPopup']"), leftVal, topVal,9000);
}

function hidePopUpManager(popUpId){

	$("#"+ popUpId).hide();
	bgDiv.hide();
}

function showPopManager(popUpId){

	bgDiv.css("top", '0');
	bgDiv.css("left", 0);
	bgDiv.css("position", "fixed");
	bgDiv.css("z-index", "999999");
	bgDiv.css("width", "70%");
	bgDiv.css("height", "100%");

	$("#"+ popUpId).show();
	$("#"+ popUpId).css("z-index", "1000000");
	bgDiv.show();
}


function cityDisableLead(){

		if($("#leadState").val() == null ||$("#leadState").val() == ""){
			$("#leadCity").attr('disabled','disabled');
		}else{
			$("#leadCity").removeAttr('disabled','');
		}
}


function cityDisableOrder(){

	if($("#orderState").val() == null ||$("#orderState").val() == ""){
		$("#orderCity").attr('disabled','disabled');
	}else{
		$("#orderCity").removeAttr('disabled','');
	}
}

/*
 * Function for validate date of birthday fields when typing
 */
function validateLeadDOBonType(){

	$('#leadBMonth').keyup(function() {

		if (parseInt($('#leadBMonth').val()) > 12|| !$('#leadBMonth').val().match(dobMonth)) {
			$("div[id^='errorPayment_leadB']").remove();
			setErrorPosition("Please enter valid Month", $('#leadBMonth'),true, null);
		}else{
			$('#leadBMonth').removeClass('ErrFeeld');
			$("div[id='errorPayment_leadBMonth']").remove();
		}
	});

	$('#leadBDay').keyup(function() {

		if (parseInt($('#leadBDay').val()) > 31|| !$('#leadBDay').val().match(dobDay)) {
			$("div[id^='errorPayment_leadB']").remove();
			setErrorPosition("Please enter valid Day", $('#leadBDay'),true, null);
		}else{
			$('#leadBDay').removeClass('ErrFeeld');
			$("div[id='errorPayment_leadBDay']").remove();
		}
	});

	$('#leadBYear').keyup(function() {

		if (!$('#leadBYear').val().match(dobYear)) {
			$("div[id^='errorPayment_leadB']").remove();
			setErrorPosition("Please enter valid Year", $('#leadBYear'),true, null);
		}else{
			$('#leadBYear').removeClass('ErrFeeld');
			$("div[id='errorPayment_leadBYear']").remove();
		}
	});
}

function validateOtherDOBonType(){

	$("div[id^='passenger-']")
	.each(
			function() {
				var id = $(this).attr("id");
				var pasNo = id.split("-")[1];

				$('#otherBMonth-' + pasNo).keyup(function() {

						 if (parseInt($('#otherBMonth-' + pasNo).val()) > 12|| !$('#otherBMonth-' + pasNo).val().match(dobMonth)) {
							$("div[id^='errorPayment_otherB']").remove();
							setErrorPosition("Please enter valid Month", $('#otherBMonth-' + pasNo),true, null);
						}else{
							$('#otherBMonth-' + pasNo).removeClass('ErrFeeld');
							$('#errorPayment_otherBMonth-'+ pasNo).remove();
						}
					});

				$('#otherBDay-' + pasNo).keyup(function() {

						 if (parseInt( $('#otherBDay-' + pasNo).val()) > 31|| !$('#otherBDay-' + pasNo).val().match(dobDay)) {
							$("div[id^='errorPayment_otherB']").remove();
							setErrorPosition("Please enter valid Day", $('#otherBDay-' + pasNo),true, null);
						}else{
							$('#otherBDay-' + pasNo).removeClass('ErrFeeld');
							$('#errorPayment_otherBDay-'+ pasNo).remove();
						}
					});

				$('#otherBYear-' + pasNo).keyup(function() {

						if (!$('#otherBYear-' + pasNo).val().match(dobYear)) {
							$("div[id^='errorPayment_otherB']").remove();
							setErrorPosition("Please enter valid Year", $('#otherBYear-' + pasNo),true, null);
						}else{
							$('#otherBYear-' + pasNo).removeClass('ErrFeeld');
							$('#errorPayment_otherBYear-'+ pasNo).remove();
						}
			 });
	 });
}