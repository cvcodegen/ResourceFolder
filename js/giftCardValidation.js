/**
 * @author Gayani
 * @date 21-08-2014 Java script used to validate the functionality for Gift Card Purchase page
 *       
 */


var namePattern = /^[a-zA-Z\-\'\s]*$/;
var emailPattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
var dtRegex = new RegExp(/\b\d{1,2}[\/]\d{1,2}[\/]\d{4}\b/);
var cartTotal=0;
var itemsInCart = false;
var selectedTab = "Clipper";
var selectedOption = "roundTrip";

var SELECTED_TAB_CLIPPER_ONLY = "Clipper";
var SELECTED_TAB_COMBO = "Combo";
var SELECTED_OPTION_ROUND_TRIP = "roundTrip";
var SELECTED_OPTION_ONE_WAY = "oneWay";
var INPUT_DATE_FORMAT = 'MM/DD/YYYY';
var LOAD_NIGHT_DROPDOWN = true ;


//load the Gift Card Purchase Page .
function loadGiftCardPurchPg(){
	
	resetGiftCardPage();
	initFunctions();
}

$(document).ready(function() {	
	
	
	initFunctions();
	initRightSideBasket();
	initWindowResize();
});





var iconSelector = " .GiftCardBtn"; //.GiftCardBtn,
function initFunctions(){
	
	
	if(standardGCBtn.checked)
	{
		$("#RecipientNameDiv").show();
	}
	
	$('#giftCardAmnt').autotab({		
		format : 'numeric'
	});
	
/*	$("#leadBDay").val('DD');
	$("#leadBMonth").val('MM');
	$("#leadBYear").val('YYYY');
*/	
	// Balance Div Slider Click 
	$(".GiftCardBtn").unbind("click");
	$(".GiftCardBtn").click(function() {
		$(".GiftCardBtn").hide;
		
		
		
		//Closing function clicking on page
		$("#pageContent").unbind("click");
		$("#pageContent").click(function(){
			if( ( $("#GiftCardBtn").is(":visible")) )
			{
				$(".giftRside").hide();
			}
		});
		
		$(".GiftCardBtnInside").unbind("click");
		$(iconSelector).click(function() {
			if( ( $("#GiftCardBtn").is(":visible")) )
			{
				$(".giftRside").hide();
			}
			
			
		});
		
		$(".giftRside").show();
		$("#shoppingBskt").show();		
		$("#shoppingBskt").removeClass('shoppingBskt');
		$("#shoppingBskt").show();
		
		
			});
	
	$(iconSelector).each(function() {
		$(this).css("cursor","pointer");
	});
	
	$(".GiftCardBtn").css("cursor","pointer");
	
	
	
	
	// Standard GiftCard Radio Button Click 
	$("#standardGCBtn").unbind("click");
	$("#standardGCBtn").click(function() {
		$("#addressDiv").show();
		$("#RecipientNameDiv").show();
		$("#RecipientEmailDiv").hide();
		$("#BuyerEmailDiv").hide();
		$("#GiftCardDate").hide();
			});
	
	// Instant GiftCard Radio Button Click 
	$("#instantGCBtn").unbind("click");
	$("#instantGCBtn").click(function() {
		$("#addressDiv").hide();
		$("#RecipientNameDiv").hide();
		$("#RecipientEmailDiv").show();
		$("#BuyerEmailDiv").show();
		$("#GiftCardDate").show();
		//var ac1 = new Calendar("changeDateDepartureDate",{fromCity:"",toCity:"",format:"MM/DD/YYYY"},"changeTripDatePopUp");		
		//ac1.init();
		$( "#changeDateDepartureDate" ).datepicker({ minDate: 0}).datepicker("setDate", new Date());
	});
	
	
	// Instant GiftCard Radio Button Click 
	$("#addToCartBtn").unbind("click");
	$("#addToCartBtn").click(function() {
		
		//validate the Amount & total amnt
		var paramObj = "searchtype=CMU&";
		if(validateDetails())
		{			
			addGiftCardToCart();			
							
		}
		
	});
	
	function fmltUpdateCallBack() {
	    location.href = $("#orderOverviewBase").val()+ "?" ;
	}
	
	// Confirm button initialization
	$("#confirmGCBtn").unbind("click");
	$("#confirmGCBtn").click(function() {
		
		//Chk whether cart has items & pop up giving the total items & asking to proceed if no items
		//give error msg saying add items to cart to proceed
		//If items are there and want to proceed go to payment page
		var cartTotal=$("#basketSize").val();
		if(cartTotal > 0 )
		{
			//Give a message telling the total items in cart				
			blockInMiddle("waitingAnim");
			window.location.href =  getBaseUrl() +"passengerDetails;jsessionid=" + $("#sid").val() + "?" + "&ts=" +  new Date().getTime()+"&giftCardFlow=true";			
		}
		else
		{
			//give error msg saying add items to cart to proceed
			alert("Please add Gift Card to shopping basket");
			//displayMessage(null, SUCCESS, "Please add Gift Card to shopping basket", "");
		}		
		//window.location.href =  getBaseUrl() +"passengerDetails;jsessionid=" + $("#sid").val() + "?" + "&ts=" +  new Date().getTime();
			});
	
	
	//Key up function for giftCardAmnt
	$("#giftCardAmnt").die('keyup');
	$('#giftCardAmnt').keyup(function() {			
			var giftCardAmntVal = $.trim($("#giftCardAmnt").val());
			var quantityVal = $.trim($("#giftCardQty").val());			 
			$("#giftCardAmntTotal").val(giftCardAmntVal*quantityVal + ".00");						
					
	});
	
	//Quantity change function
	$("#giftCardQty").die('change');
	$("#giftCardQty").live('change',function(){
		var giftCardAmntVal = $.trim($("#giftCardAmnt").val());
		var quantityVal = $.trim($("#giftCardQty").val());
		 
		$("#giftCardAmntTotal").val(giftCardAmntVal*quantityVal + ".00");
	});	

	$("#BalanceCheckBtn").unbind("click");
	$("#BalanceCheckBtn").click(function() {
		$(".ErrLbl").remove();
		var BASE_URL = getBaseUrl();
		var BALANCE_CHECK = BASE_URL + "jaxrs/json/getGiftCardBalance?callback=?";		
		if(true)
		{			
			blockInMiddle("waitingAnim");
			BALANCE_CHECK+"&"+"tbxSession="+$("#sid").val()+"&"+"cardNum="+$("#leadAddress").val();
			var urlCheckBalance = BALANCE_CHECK + "&tbxSession=" + $("#sid").val() + "&cardNum=" + $("#leadAddress").val();
			$.getJSON(urlCheckBalance, function(response) {
				unblockUi();
				if (response.status == 1) {
					var amount = response.data ;
					$("#giftCardBalance").html(amount);	
					$("#currentBalanceDiv").show();
				} else {
					$("#currentBalanceDiv").hide();
					$("#leadAddress").parent().append('<div class="ErrLbl" id="errGCAmntTot">'+response.message+'</div>');
				}
			});
		}
		
	});
	
	$("#leadAddress").on("change", function(response) {
		$("#giftCardBalance").val("");
	});
	$("#leadAddress").on("focus", function(response) {
		$(this).select();
	});
	$('#giftCardMsg').keyup(function () {
		var characters=150;
		if($(this).val().length > characters){
	        $(this).val($(this).val().substr(0, characters));
		}else{
		    var left = 150 - $(this).val().length;
		    if (left < 0) {
		        left = 0;
		    }
		    $('#msgRemaining').text(left+' Characters Remaining');
		}

	});
	
	// set DOB
	/*$('#leadBMonth').autotab({
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
	});*/
	
/*	$("#leadBMonth").unbind('hover');
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
	});*/
	
	//changeDateDepartureDate
	/*var ac1 = new Calendar("changeDateDepartureDate",{fromCity:"",toCity:"",format:"MM/DD/YYYY",departureDate:"changeDateDepartureDate",nightId:"changeDateNights"},"changeTripDatePopUp");
	ac1.init();*/
}

function resetGiftCardPage() {
	$("#giftCardAmnt").val("");	
	
}


function OnFocusInput(input) {

	if (input.value == "MM" | input.value == "DD" | input.value == "YYYY") {
		input.value = '';
	}
}

function isDate(txtDate)
{
  var currVal = txtDate;
  if(currVal == '')
    return false;
  
  //Declare Regex  
  var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/; 
  var dtArray = currVal.match(rxDatePattern); // is format OK?

  if (dtArray == null)
     return false;
 
  //Checks for mm/dd/yyyy format.
  dtMonth = dtArray[1];
  dtDay= dtArray[3];
  dtYear = dtArray[5];

  if (dtMonth < 1 || dtMonth > 12)
      return false;
  else if (dtDay < 1 || dtDay> 31)
      return false;
  else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31)
      return false;
  else if (dtMonth == 2)
  {
     var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
     if (dtDay> 29 || (dtDay ==29 && !isleap))
          return false;
  }
  return true;
}

//Validate the given details before adding to Cart or proceed to payment
function validateDetails() {
	var isValid = true;
	$(".ErrLbl").remove();
	
	if ($.trim($('#giftCardAmnt').val()) == "" || $.trim($('#giftCardAmnt').val()).length < 0) {
		$('#giftCardAmnt').parent().append('<div class="ErrLbl" id="errGCAmntTot">Please Enter Valid Amount. </div>');		
		isValid = false;
	}	
	
	if ($("#instantGCBtn").prop("checked")) {
	
		//changeDateDepartureDate
	
		/*if (($.trim($('#changeDateDepartureDate').val()) == "" || $.trim($('#changeDateDepartureDate').val()).length < 0)) {
			$('#changeDateDepartureDate').parent().append('<div class="ErrLbl" id="errGCAmntTot">Please Enter Valid date. </div>');
			isValid = false;
		}else if(!isDate($('#changeDateDepartureDate').val())){
			$('#changeDateDepartureDate').parent().append('<div class="ErrLbl" id="errGCAmntTot">Please Enter Valid date. </div>');
			isValid = false;
		}*/
	if ($.trim($('#recipEmail').val()) == "" || $.trim($('#recipEmail').val()).length < 0) {
		$('#recipEmail').parent().append('<div class="ErrLbl" id="errGCAmntTot">Please Enter Valid Email Address. </div>');
		isValid = false;
	} else if (!$('#recipEmail').val().match(emailPattern)) {
		$('#recipEmail').parent().append('<div class="ErrLbl" id="errGCAmntTot">Please Enter Valid Email Address. </div>');
		isValid = false;
	}
	if ($.trim($('#buyerEmail').val()) == "" || $.trim($('#buyerEmail').val()).length < 0) {
		
	} else if (!$('#buyerEmail').val().match(emailPattern)) {
		$('#buyerEmail').parent().append('<div class="ErrLbl" id="errGCAmntTot">Please Enter Valid Email Address. </div>');
		isValid = false;
	}
	}
	if ($("#standardGCBtn").prop("checked")) {	   
		//validate the Address
		if ($.trim($('#gcMailAddress').val()) == "" || $.trim($('#gcMailAddress').val()).length < 0) {
			$('#gcMailAddress').parent().append('<div class="ErrLbl" id="errGCAmntTot">Please Enter Valid Mail Address. </div>');
			isValid = false;
		}
		if ($.trim($('#city').val()) == "" || $.trim($('#city').val()).length < 0) {
			$('#city').parent().append('<div class="ErrLbl" id="errGCAmntTot">Please Enter Valid city. </div>');
			isValid = false;
		}
		if ($.trim($('#stateRegion').val()) == "" || $.trim($('#city').val()).length < 0) {
			$('#stateRegion').parent().append('<div class="ErrLbl" id="errGCAmntTot">Please Enter Valid city. </div>');
			isValid = false;
		}
		if ($.trim($('#zipCode').val()) == "" || $.trim($('#zipCode').val()).length < 0) {
			$('#zipCode').parent().append('<div class="ErrLbl" id="errGCAmntTot">Please Enter Valid zip code. </div>');
			isValid = false;
		}
		if ($.trim($('#country').val()) == "" || $.trim($('#country').val()).length < 0) {
			$('#country').parent().append('<div class="ErrLbl" id="errGCAmntTot">Please Enter Valid country. </div>');
			isValid = false;
		}
		if ($.trim($('#recipName').val()) == "" || $.trim($('#recipName').val()).length < 0) {
			$('#recipName').parent().append('<div class="ErrLbl" id="errGCAmntTot">Please Enter Valid name. </div>');		
			isValid = false;
		}
	}
	/*if ($.trim($('#giftCardTo').val()) == "" || $.trim($('#giftCardTo').val()).length < 0) {
		$('#giftCardTo').parent().append('<div class="ErrLbl" id="errGCAmntTot">Please Enter Valid name. </div>');		
		isValid = false;
	}
	if ($.trim($('#giftCardFrom').val()) == "" || $.trim($('#giftCardFrom').val()).length < 0) {
		$('#giftCardFrom').parent().append('<div class="ErrLbl" id="errGCAmntTot">Please Enter Valid name. </div>');		
		isValid = false;
	}*/

	return isValid;
}

//Add Gift Card to Cart
function addGiftCardToCart()
{
	var params = "";
	//params = "selectAlt=true";

	params+="&searchtype=CMU";
	params+= "&giftCAmnt="+ $("#giftCardAmnt").val() ;
	params+="&giftCQty=" + $("#giftCardQty").val();
	params+="&giftCFrom=" + $("#giftCardFrom").val();
	params+="&giftCTo=" + $("#giftCardTo").val();
	params+="&gcMessage=" + $("#giftCardMsg").val();

	if($("#instantGCBtn").prop("checked"))
	{
		//Add Email addresses & Msg to params
		params+="&gcInstantPrint=true";
		//params+="&gcCustomDate=" + $("#changeDateDepartureDate").val();
		params+="&gcRecipEmail=" + $("#recipEmail").val();
		params+="&gcBuyerEmail=" + $("#buyerEmail").val();
	}
	if($("#standardGCBtn").prop("checked"))
	{
		//Add Mail addresses to params
		params+="&gcInstantPrint=false";
		params+="&gcAdresFstLine=" + $("#gcMailAddress").val();
		params+="&gcAdresCity=" + $("#city").val();
		params+="&gcAdresSate=" + $("#stateRegion").val();
		params+="&gcAdresSecLine=" + $("#adressSecLine").val();
		params+="&gcAdresZip=" + $("#zipCode").val();
		params+="&gcAdrescountry=" + $("#country").val();
		params+="&gcRecipName=" + $("#recipName").val();
	}
	//Call the Manual Item adding Controller
	//doAjax("ManualItemController", params, updateShoppingBasketCallback, null, "json");
	blockInMiddle("waitingAnim");
	doAjaxWithBase("GiftCardController",params, updateShoppingBasketCallback, null, "json");

}

function updateShoppingBasketCallback(data)
{
	//If success
	//Give a message showing the total Number of items added to cart
	var status = data["status"];
	//unblockUi();
	if (status == SUCCESS)
	{
		cartTotal+=$("#giftCardQty").val();
		//itemsInCart = true;
		itemsInCart=true;
		window.location.href =  getBaseUrl() +"giftCard;jsessionid=" + $("#sid").val() + "?" + "&ts=" +  new Date().getTime();
	}
	else
	{
		unblockUi();
		displayMessage(null, data["status"], data["msg"], data["data"]);
		addingMargingTopF();
		addingMargingTopShpBskt();
	}
	//location.reload();
}

function addCartCallback(data, div)
{
	var status = data["status"];
	if (status == SUCCESS)
	{
		window.location.href =  getBaseUrl() +"passengerDetails;jsessionid=" + $("#sid").val() + "?" + "&ts=" +  new Date().getTime();
	}
	else
	{
		displayMessage(null, data["status"], data["msg"], data["data"]);
		addingMargingTopF();
		addingMargingTopShpBskt();
	}
}


