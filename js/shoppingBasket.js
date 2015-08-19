/**
 * javascript functionalities related to shopping basket
 * @author ureka
 * @date 05-11-2012
 */
var isDateChanged=false;
var selectedAltType;
var selectedItemForChange="";

$(document).ready(function() {
	initShoppingBasket(); //shopping basket related init functions
	if($("#selectedTabHF").val()=='true'){
		selectedTab=SELECTED_TAB_CLIPPER_ONLY;
	}
	else{
		selectedTab=SELECTED_TAB_COMBO;
	}
	
	//this populates nights to night dropdown & initilize the date picker
	initializeDatesSearch();
	
	$('#availabilityError').hide();
});

//refresh the shopping basket to display updated details
function refreshBasket(){
	doAjax("jsp/bookingFlow/ShoppingBasket.jsp", "", displayBasket, null, null);
}

//callback function for update shopping basket details
function displayBasket(data){
	$("#shoppingBakset").html(data); //replace the div with the updated details
	changeBasketButton(IS_CROSSSELL_LOADED);	//change the basket button according to the selected/not selected items
	initShoppingBasket();	//shopping basket related init functions
}

//bind shopping basket related init functions
function initShoppingBasket(){
	//bind taxes and fees popup functionality
	$("#taxFees").unbind('mouseenter mouseleave');
	$("#taxFees").hover(function(event) {
		shoSupp();
	}, function() {
		$('#supplimentList').hide();
	});
	
	//floatBasket();
	
	//bind best deal popup related functionality
	$("#bestDeal").unbind('click');
	$("#bestDeal").click(function(event) {
		/*showBestDealPopup($(this));
		$("#bestDealClose").click(function(event){
			$("div[id='bestDealPopup']").hide();
		});*/
		window
		.open(
				$("#clipperBase").val()+"best-price-guarantee",
				"",
				"resizable=no,toolbar=1,status=0,scrollbars=1,menubar=0,fullscreen=no,width="
						+ 850 + ",height=" + 1000
						+ ",top=" + 100 + ",left="
						+ 200);
	});
	
	//bind combo transport supplements popup related functionality
	$("div[id^='trpSupp-']").unbind('click');
	$("div[id^='trpSupp-']").bind('click', function()
	{
		var idSplit = $(this).attr('id').split("-");
		$("div[id^='trpSupps_'][id$='" + idSplit[1] + "']").click();
	});
	
	//bind clipper transport supplements hover related functionality
	$("div[id^='trpHoverSupp_']").unbind('hover');
	$("div[id^='trpHoverSupp_']").hover( function( event )
	{		
		showClipperSupp($(this));		
		}, function() {
			var idSplit = $(this).attr('id').split("_");
			$("div[id='clpSuppHover_" + idSplit[1] + "']").hide();		
	});

	selectSupplementDropDown(); //bind selecting transport supplements 
	initSearchFunction(); //bind change dates and new search functionality
}

//change the basket button according to the required action
function changeBasketButton(isCrosssellLoaded){
	$("img[id^='confirmButton']").unbind('click');
	var availStatus = $("#availStatus").val(); //check whether the selected items contain any onrequest items
	var isButtonChanged = false;
	
	//if the selected items contain any onrequest items we display the call to book button.
	if (availStatus != -1) {
		//if the crosssell loaded only we change the button accordingly
		if (isCrosssellLoaded) {
			//check the value of eachs electedMandatory hidden input field
			$('input[id^=selectedMandatory_]').each(function() {
				var itemType = $(this).attr('id').split("_")[1];
				var isMandatory = $(this).val().split("-")[1];
				var isSelected = $(this).val().split("-")[0];

				if (isMandatory == 'true' && isSelected == 'false') {
					$('#confirmButton').attr('src','images/btn_cho_you_'+ itemType+ '_h.png'); //change the button image according to the required action
					popUpShow(itemType); //display the item required popup
					isButtonChanged = true;
					return false; //break the loop
				}
			});
			
			//if the button did not change to display the item required message change it to book your trip button
			if (!isButtonChanged) {
				initAddBasketItems(); //bind add book your trip button functionality
//				$('#confirmButton').attr('src','images/btn_book_your_trip.png');
//				$('#confirmButton').attr('alt','Book your trip');
//				$('#confirmButton').hover(function() {
//					$('#confirmButton').attr('src','images/btn_book_your_trip_hover.png');
//				},
//				   function(){
//					$('#confirmButton').attr('src','images/btn_book_your_trip.png');
//				   });
				
				// Btn CHange
				$('#confirmButton').attr('class','btnT1Cont displayTblCell');
				
			}
		}
	}
}

//display the taxes and fees popup
function shoSupp(){	
	p = $('#taxFees').position();	
	$('#supplimentList').css('position', "absolute");
	$('#supplimentList').css('display', "");
	$('#supplimentList').css('top',( p.top + 25+'px') );
	$('#supplimentList').css('left', ( p.left- 165 +'px'));
	
}

//bind item required popup display
function popUpShow(itemType){
	$("#confirmButton").unbind('hover');
	$("#confirmButton").hover(function(event) {
		displayItemRequiredMessage(itemType);
	}, function() {
		$('#itemConf').hide();		
	});
}

//display the item required popup
function displayItemRequiredMessage(itemType){
	$('#messageHead').empty();
	$('#message').empty();
	p = $('#confirmButton').position();
	var message = "Combination Deals require the addition of ";
	if( itemType === 'activity' )
	{
		message = message + "an ";
	}
	else
	{
		message = message + "a ";
	}
	message = message + itemType;
	var messageHead = "Required "+ itemType;
	
	var msgDiv = $('<div></div>');
	msgDiv.text(message);

	
	var msgDivHead = $('<div></div>');
	msgDivHead.text(messageHead);
	
		$('#messageHead').append(msgDivHead);
		$('#message').append(msgDiv);					

		$('#itemConf').css('position', "absolute");
		$('#itemConf').css('top',( p.top + 40+'px') );
		$('#itemConf').css('left', ( p.left+'px'));
		$('#itemConf').show();
}

//display best deal popup
function showBestDealPopup(obj){
	var position = obj.position();
	var topVal = position.top+45;
	var leftVal = position.left-10;
	showOverlay($("div[id='bestDealPopup']"), leftVal, topVal,
				9000);
}

/*function floatBasket(){
	var top = $('#shoppingBakset').offset().top - parseFloat($('#shoppingBakset').css('marginTop').replace(/auto/, 0));
	
	  $(window).scroll(function (event) {
	    // what the y position of the scroll is
	    var y = $(this).scrollTop();
	  
	    // whether that's below the form
	    if (y >= top) {
	      // if so, ad the fixed class
	      $('#shoppingBakset').addClass('fixed');
	    } else {
	      // otherwise remove it
	      $('#shoppingBakset').removeClass('fixed');
	    }
	  });
}*/

//bind change trip dates and start a new search button functions
function initSearchFunction(){
	
	// load search banner for shopping basket url		
	$("#newSearchSB").click(function() {
		popupSearchBannerNew();
	});	
	//bind change trip dates function only if crosssell is loaded
	if(IS_CROSSSELL_LOADED){	
		$("#changeTripDatesLink").click(function() {
			popUpChangeTripDates();
		});	
	}
}

//change trip dates popup functionality
function popUpChangeTripDates(){
	if($("#selectedTabHF").val()=='true'){
		selectedTab=SELECTED_TAB_CLIPPER_ONLY;
	}
	else{
		selectedTab=SELECTED_TAB_COMBO;
	}
	//display the popup
	$.blockUI({ message: $('#changeTripDatePopUp') ,centerX: false,css: { width:'auto',left:'30%', top:'40%' } ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
	
	
	 $(".blockPage").removeAttr("style");
	 $(".blockPage").attr("style",updateBlockUIStyle("changeTripDatePopUp"));
	 
	 
	//set fromcity and tocity values
	$("#fromCity").val($("#fromCityHF").val());
	$("#toCity").val($("#toCityHF").val());
	
	//availability calendar for daparture date
	var ac1 = new Calendar("changeDateDepartureDate",{fromCity:"fromCityHF",toCity:"toCityHF",format:"MM/DD/YYYY",onStart:loading(true),onEnd:loading(false),departureDate:"changeDateDepartureDate",nightId:"changeDateNights"},"changeTripDatePopUp");
	ac1.init();
	$("#changeDateDepartureDate").val($('#changeDateDateHF').val()) ;
	 
	//nights dropdown
	var nightList = new NightDropDown("changeDateNights",{onComplete:loading(false),departureDate:"changeDateDepartureDate",nightId:"changeDateNights",fromCity:"fromCityHF",toCity:"toCityHF"});		
	loading(false);
	nightList.init();			
	var val = $('#changeDateNightsHF').val();
	showSelectedVal(val, "changeDateNights");
	setTimeout(function(){
		if( $("#searchedNights").val()!=0){
			$("#changeDateNights  option[value='0']").css("display","none");
		}
		$("#changeDateNights  option[value^='t_']").attr("selected","selected");
	 },500);
	 
	//bind close button function
	 $("#changeDateCloseButton").unbind("click");
	 $("#changeDateCloseButton").bind("click", function() {
		$.unblockUI();
		$('#changeTripDates').hide();
	});
	 
	//bind detail view close function(clicking outer space)
	$(".blockOverlay").unbind('click');
	$(".blockOverlay").bind("click", function() { 
		$.unblockUI();
		$('#changeTripDates').hide();
	});
	 
	//bind change trip dates button function
	$("#changeTripDatesBtn").unbind("click");
	$("#changeTripDatesBtn").bind("click", function() {
		blockInMiddle("addToBasketLoader");
		var pieces = $('#changeDateNights').val().split("_");	
		var nights=0;
		if(pieces[0] != 't'){
			nights=pieces[0] ;
		}
		else{
			nights = pieces[1];
		}
		//set the hidden field values
		$('#changeDateNightsHF').val(nights);	
		$('#changeDateDateHF').val($("#changeDateDepartureDate").val());
		var param="newDate="+$("#changeDateDepartureDate").val()+"&newNights="+nights;
		doAjax("ChangeTripDatesController", param, changeTripDatesCallback, null, "json"); //send ajax request
	});
	
	//bind departure date change function to load the night drop down
	 $("#changeDateDepartureDate").change(function(){
		var nightList = new NightDropDown("changeDateNights",{onComplete:loading(false),departureDate:"changeDateDepartureDate",nightId:"changeDateNights",fromCity:"fromCityHF",toCity:"toCityHF"});			
		loading(false);
		nightList.init();
	 });
}

function initializeDatesSearch()
{
	//set fromcity and tocity values
	$("#fromCity").val($("#fromCityHF").val());
	$("#toCity").val($("#toCityHF").val());
	
	
	//availability calendar for daparture date
	var ac1 = new Calendar("changeDateDepartureDate",{fromCity:"fromCityHF",toCity:"toCityHF",format:"MM/DD/YYYY",onStart:loading(true),onEnd:loading(false),departureDate:"changeDateDepartureDate",nightId:"changeDateNights"},"changeTripDatePopUp");
	ac1.init();
	$("#changeDateDepartureDate").val($('#changeDateDateHF').val()) ;
	 
	//nights dropdown
	var nightList = new NightDropDown("changeDateNights",{onComplete:loading(false),departureDate:"changeDateDepartureDate",nightId:"changeDateNights",fromCity:"fromCityHF",toCity:"toCityHF"});		
	loading(false);
	nightList.init();			
	var val = $('#changeDateNightsHF').val();
	showSelectedVal(val, "changeDateNights");
	setTimeout(function(){
		if( $("#searchedNights").val()!=0){
			$("#changeDateNights  option[value='0']").css("display","none");
		}
		$("#changeDateNights  option[value^='t_']").prop("selected","selected");
	 },500);
	
	//bind change trip dates button function
	$("#changeTripDatesBtn").unbind("click");
	$("#changeTripDatesBtn").bind("click", function() {
		blockInMiddle("addToBasketLoader");
		var pieces = $('#changeDateNights').val().split("_");	
		var nights=0;
		if(pieces[0] != 't'){
			nights=pieces[0] ;
		}
		else{
			nights = pieces[1];
		}
		//set the hidden field values
		$('#changeDateNightsHF').val(nights);	
		$('#changeDateDateHF').val($("#changeDateDepartureDate").val());
		var param="newDate="+$("#changeDateDepartureDate").val()+"&newNights="+nights;
		doAjax("ChangeTripDatesController", param, changeTripDatesCallback, null, "json"); //send ajax request
	});
	
	//bind departure date change function to load the night drop down
	 $("#changeDateDepartureDate").change(function(){
		var nightList = new NightDropDown("changeDateNights",{onComplete:loading(false),departureDate:"changeDateDepartureDate",nightId:"changeDateNights",fromCity:"fromCityHF",toCity:"toCityHF"});			
		loading(false);
		nightList.init();
	 });
	
	
}

//show selected value of night dropdown
function showSelectedVal(val , id){
	var selectobject = document.getElementById(id);

	for ( var i = 0; i < selectobject.length; i++) {
		var tmpval = selectobject.options[i].value;
		if (tmpval.substring(0, 1) == "t") {
			selectobject.removeChild(selectobject.options[i]);
		}
	}

	var optionsList = $($('#'+id)).find('option').clone();

	$("#"+id).empty();
	$("#"+id).append('<option  value="t_' + val + '">' + val + '</option>');
	optionsList.appendTo($("#"+id));	
	
	$("#"+id+"  option[value^='t_']").prop("selected","selected");
	$("#"+id +"  option[value^='t_']").css("display", "none");		
}

//callback function for change trip dates
function changeTripDatesCallback(data,div){
	var status=data["status"];
	var searchType=$("#searchType").val();
	//if status is success display the updated items
	if(status==SUCCESS){
		isDateChanged=false;
		$('#hotelChangedDate').val($('#changeDateDateHF').val());
		$('#hotelChangedNights').val("t_"+$('#changeDateNightsHF').val());
		//$('#hotelChangedNights').val($('#changeDateNightsHF').val());
		if(searchType=="TMD"){
			doAjax("jsp/package/selectedPackage.jsp", null, displayUpdatedPacakgeItems, "packageResults", "");
		}
		else{
			doAjax("jsp/transport/selectedTransportItem.jsp", null, displayUpdatedPacakgeItems, "selectedItem-0", "");
		}		
	}
	
	//if the status is warning display the item not available popup
	else if(status==WARNING){
		isDateChanged=true;
		var param="canContinue="+data["canContinue"];
		doAjax("jsp/bookingFlow/itemNotAvailablePopup.jsp", param, displayAvailabilityError, "availabilityError", "");
	}
	
	//if status is error display alternatives not available popup
	else{
		doAjax("jsp/bookingFlow/alternativesNotAvailablePopup.jsp", "", displayAlternativesNotFound, "availabilityError", "");
	}
}

//display the updated package items in the your trip page
function displayUpdatedPacakgeItems(data,div){
	replaceExistingResult(data, div);		
	doAjax("jsp/result/crossSellResults.jsp", null, displayUpdatedCrosssell, "", "");
}

//display updated crossell items
function displayUpdatedCrosssell(data,div){
	displayCrossSellThreeResults(data);
	initTripPage(); //bind your trip page init functions
	refreshBasket(); //refresh the basket to reflect updated items
	isDateChanged=false;
	$.unblockUI();
}

//availability error related functions
function displayAvailabilityError(data,div){
	replaceExistingResult(data, div);
	
	
	//$.blockUI({ message: $('#availabilityError') ,centerX: false,css: { width:'auto',left:'50%', top:'50%' } ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
	blockInMiddle("availabilityError");

	//bind close button functionality
	$("#errorClose").unbind("click");
	$("#errorClose").bind("click", function() {
		isDateChanged=false;
		$.unblockUI();
		$('#availabilityError').hide();
		$('#availabilityError').html("");
	});
	$(".blockOverlay").unbind("click");
	$(".blockOverlay").bind("click", function() {
		isDateChanged=false;
		$.unblockUI();
		$('#availabilityError').hide();
		$('#availabilityError').html("");
	});
	
	//bind tool tips for call clipper tool tip
	bindHotelAvailabilityToolTip();
	
	//bind change hotel functionality
	/*$("img[id^='changeHtl-']").unbind("click");
	$("img[id^='changeHtl-']").bind("click", function() {
		blockInMiddle("addToBasketLoader");
		displayDateChangedAlternatives(ITEM_TYPE_HOTEL,this);			
	});*/
	
	// bind change hotel link click event
	$("a[id^='changeHtl-']").unbind("click");
	$("a[id^='changeHtl-']").bind("click", function() {
		blockInMiddle("addToBasketLoader");
		displayDateChangedAlternatives(ITEM_TYPE_HOTEL,this);			
	});
		
	
	//bind change activity functionality
	/*$("img[id^='changeAct-']").unbind("click");
	$("img[id^='changeAct-']").bind("click", function() {
		 blockInMiddle("addToBasketLoader");
		 displayDateChangedAlternatives(ITEM_TYPE_ACTIVITY,this);
	});*/
	
	// bind change activity link click event
	$("a[id^='changeAct-']").unbind("click");
	$("a[id^='changeAct-']").bind("click", function() {
		blockInMiddle("addToBasketLoader");
		displayDateChangedAlternatives(ITEM_TYPE_ACTIVITY,this);	
	});
	
	
	//bind continue without the items functionality
	$("img[id^='continueWithoutItems']").unbind("click");
	$("img[id^='continueWithoutItems']").bind("click", function() {
		 $("#availabilityError").hide();
		 isDateChanged=false;
		 var param="itemIdList=";
		 /*if(($("img[id^='changeAct-']").length>0 && $("img[id^='changeAct-']").attr("id").split("-")[1]!=""))
		 {
			param+= $("img[id^='changeAct-']").attr("id").split(/-(.+)?/)[1];
		 }
		 if(($("img[id^='changeHtl-']").length>0 && $("img[id^='changeHtl-']").attr("id").split("-")[1]!=""))
		 {
			 param+= $("img[id^='changeHtl-']").attr("id").split(/-(.+)?/)[1];
		 }*/
		 
		 
		 //prepare the itemList param
		 var paramHtl="";
		 $("a[id^='changeHtl-']").each(function() {
			 paramHtl+= $(this).attr("id").split(/-(.+)?/)[1] + '-';	  
		 });
		 
		 param+= paramHtl;
		
		 var paramAct="";
		 //check is there any existing [may be available items] for activity
		 $("a[id^='changeAct-']").each(function() {
			paramAct+= $(this).attr("id").split(/-(.+)?/)[1] + '-';	  	     
		 });
		
		 param+= paramAct;
		 
		 //ajax call to search alternatives for not available items	 
		 doAjax("MultipleItemsAlternativeSearchController", param, continueWithoutItemsCallBack , null, "json");
	});
	
	//bind goback to original dates functionality
	$("div[id='goBackToOriginaldates']").unbind("click");
	$("div[id='goBackToOriginaldates']").bind("click", function() {
		 isDateChanged=false;
		 $('#availabilityError').hide();
		 $("#availabilityError").html("");
		 $.unblockUI();		 
	});
	
	//bind try another dates functionality
	$("div[id='tryAnotherDates']").unbind("click");
	$("div[id='tryAnotherDates']").bind("click", function() {
		 isDateChanged=false;
		 $('#availabilityError').hide();
		 $("#availabilityError").html("");
		 //popUpChangeTripDates();
		 $.unblockUI();
	});
}

function continueWithoutItemsCallBack(){
	isDateChanged=false;
	$('#availabilityError').hide();
	$("#availabilityError").html("");
	doAjax("UpdateToChangedDateController", null, displayUpdatedDateChangedResults, "", "");	
}

//send ajax request to search alternatives for not available items 
function displayDateChangedAlternatives(itemType,element){
	var params="";
	
	/*var idSplit=$(element).attr("id").split("-");
	if(idSplit[1]!=""){
		var itemList=idSplit[1].split("_");
		$("#currentItemId").val( idSplit[0] );
		CLICKED_ITEM_ID=idSplit[1];
		 blockInMiddle("addItemsBasket");
		//$.blockUI({ message: $('#allItems') ,centerX: false,css: { width:'auto',left:'15%', top:'10%' } ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
		params += "itemId=" + itemList[0];
		params += "&searchType=" + itemList[1];
		if(itemType==ITEM_TYPE_ACTIVITY){
			$("#availabilityError").hide();
			//doAjax("DateChangedAlternativeSearchController", params, viewDateChangedAllActivitiesCallback, null, "json");
		}
		else if(itemType==ITEM_TYPE_HOTEL){
			$("#availabilityError").hide();
			//doAjax("DateChangedAlternativeSearchController", params, viewDateChangedAllHotelsCallback, null, "json");
		}
	}*/
	
	//set selected item id
	selectedItemForChange = $(element).attr("id");
	
	var idSplit=$(element).attr("id").split("-");
	if(idSplit!="")
	{
		var itemList=idSplit[1].split("_");
		$("#currentItemId").val( idSplit[0] );
		
		CLICKED_ITEM_ID=idSplit[1];
		 blockInMiddle("addItemsBasket");
		
		params += "itemId=" + itemList[0];
		params += "&searchType=" + itemList[1];
		if(itemType==ITEM_TYPE_ACTIVITY){
			$("#availabilityError").hide();
			doAjax("DateChangedAlternativeSearchController", params, viewDateChangedAllActivitiesCallback, null, "json");
		}
		else if(itemType==ITEM_TYPE_HOTEL){
			$("#availabilityError").hide();
			doAjax("DateChangedAlternativeSearchController", params, viewDateChangedAllHotelsCallback, null, "json");
		}
	}
	
}

//display the activity alternatives after selecting select another hotel or another activity
function viewDateChangedAllActivitiesCallback(data){
	$("#addToBasketLoader").hide();
	$.blockUI({ message: $('#allItems') ,centerX: false,css: { width:'auto',left:'15%', top:'10%' } ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
	var status=data["status"];
	var itemId=data["itemId"];
	if(status==SUCCESS){
		var param="itemId="+itemId+"&altType="+CLICKED_ITEM_ID.split("_")[1];
		selectedAltType=ITEM_TYPE_ACTIVITY;
		doAjax("jsp/tour/allActivities.jsp", param, displayAllActivities, "allItems", "");
	}
	else{
		var param="itemType="+data['itemType']+"&city="+data['city'];
		doAjax("jsp/bookingFlow/alternativesNotAvailablePopup.jsp", param, displayAlternativesNotFound, "availabilityError", "");
	}
}

//display the hotel alternatives after selecting select another hotel or another activity
function viewDateChangedAllHotelsCallback(data){
	$("#addToBasketLoader").hide();
	$.blockUI({ message: $('#allItems') ,centerX: false,css: { width:'auto',left:'15%', top:'10%' } ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
	var status=data["status"];
	var itemId=data["itemId"];
	if(status==SUCCESS){
		var param="itemId="+itemId+"&altType="+CLICKED_ITEM_ID.split("_")[1]+"&isTripDateChanged="+isDateChanged;
		selectedAltType=ITEM_TYPE_HOTEL;
		doAjax("jsp/hotel/allHotels.jsp", param, displayAllHotels, "allItems", "");
	}
	else{
		var param="itemType="+data['itemType']+"&city="+data['city'];
		doAjax("jsp/bookingFlow/alternativesNotAvailablePopup.jsp", param, displayAlternativesNotFound, "availabilityError", "");
	}
}

function loading(state)
{
	if(state)
	{
		$(".lodAni").show();
	}
	else
	{
		$(".lodAni").hide();
	}
}

//callback function for update items after date change
function dateChangedUpdateCallback(data){
	/*var status=data["status"];
	if (status == SUCCESS) 
	{		
		$("#allItems").html("");
		var changeId="";
		
		if(selectedAltType==ITEM_TYPE_ACTIVITY){
			changeId=$("img[id^='changeAct-']").attr("id");
		}
		else if(selectedAltType==ITEM_TYPE_HOTEL){
			changeId=$("img[id^='changeHtl-']").attr("id");
		}
		var idSplit=changeId.split("-");
		var newId=idSplit[0]+"-";
		var i;
		for (i = 2; i < idSplit.length; i++) {
		    newId+=idSplit[i]+"-";
		}
		
		//change the button id to remove the already selected items
		if(selectedAltType==ITEM_TYPE_ACTIVITY){
			$("img[id^='changeAct-']").attr("id",newId);			
		}
		else if(selectedAltType==ITEM_TYPE_HOTEL){
			$("img[id^='changeHtl-']").attr("id",newId);
		}
		
		//if all the items selected update to the changed date
		if(($("img[id^='changeAct-']").length<1 || $("img[id^='changeAct-']").attr("id").split("-")[1]=="") &&($("img[id^='changeHtl-']").length<1 || $("img[id^='changeHtl-']").attr("id").split("-")[1]=="")){
			doAjax("UpdateToChangedDateController", null, displayUpdatedDateChangedResults, "", "");		
		}
		//otherwise display the items not available popup
		else{
			var param="canContinue=false";
			doAjax("jsp/bookingFlow/itemNotAvailablePopup.jsp", param, displayAvailabilityError, "availabilityError", "");
		}
	} 
	else 
	{
		displayMessage(null, data["status"], data["msg"], data["data"]);
	}*/
	
	
	var status=data["status"];
	if (status == SUCCESS) 
	{		
		$("#allItems").html("");
		
		var existsCount = 0;
		
		//check is there any existing [may be available items] for hotel
		$("a[id^='changeHtl-']").each(function() {
			  if($(this).attr('id') != selectedItemForChange)
				  existsCount = existsCount + 1;				  
		});
		
		//check is there any existing [may be available items] for activity
		$("a[id^='changeAct-']").each(function() {
			  if($(this).attr('id') != selectedItemForChange)
				  existsCount = existsCount + 1;				  
		});
				
		//if all the items selected update to the changed date
		if(existsCount == 0)
		{	
			selectedItemForChange="";
			
			doAjax("UpdateToChangedDateController", null, displayUpdatedDateChangedResults, "", "");		
		}
		//otherwise display the items not available popup
		else{
			var param="canContinue=false";
			doAjax("jsp/bookingFlow/itemNotAvailablePopup.jsp", param, displayAvailabilityError, "availabilityError", "");
		}
	} 
	else 
	{
		displayMessage(null, data["status"], data["msg"], data["data"]);
	}
	
	
	
}

//display updated date changed results
function displayUpdatedDateChangedResults(){
	$('#hotelChangedDate').val($('#changeDateDateHF').val());
	$('#hotelChangedNights').val("t_"+$('#changeDateNightsHF').val());
	//$('#hotelChangedNights').val($('#changeDateNightsHF').val());
	$("#detailItem").html("");
	if($("#searchType").val()=="TMD"){
		doAjax("jsp/package/selectedPackage.jsp", null, displayUpdatedPacakgeItems, "packageResults", "");		
	}else{
		doAjax("jsp/transport/selectedTransportItem.jsp", null, displayUpdatedPacakgeItems, "transportResult", "");
	}
}

//display alternatives not found popup
function displayAlternativesNotFound(data,div){	
	replaceExistingResult(data, div);
	$.blockUI({ message: $('#availabilityError') ,centerX: false,css: { width:'auto',left:'30%', top:'20%' } ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
	
	//bind close button function
	$("#errorClose").unbind("click");
	$("#errorClose").bind("click", function() {
		isDateChanged=false;
		$.unblockUI();
		$('#availabilityError').hide();
		$('#availabilityError').html("");
	});
	
	//bind go back to original dates function
	$("div[id='goBackToOriginaldates']").unbind("click");
	$("div[id='goBackToOriginaldates']").bind("click", function() {
		 isDateChanged=false;
		 $('#availabilityError').hide();
		 $("#availabilityError").html("");
		 $.unblockUI();
		 
	});
	
	//bind try another dates function
	$("div[id='tryAnotherDates']").unbind("click");
	$("div[id='tryAnotherDates']").bind("click", function() {
		 isDateChanged=false;
		 $('#availabilityError').hide();
		 $("#availabilityError").html("");
		 //popUpChangeTripDates();
		 $.unblockUI();
	});
}

//display clipper supplement price popup
function showClipperSupp( obj )
{	
	var p = obj.position();
	var idSplit = obj.attr('id').split("_");
	var supHover = $("div[id='clpSuppHover_" + idSplit[1] + "']");
	supHover.css('position', "absolute");
	supHover.css('display', "");
	supHover.css('top',( p.top + 25+'px') );
	supHover.css('left', ( p.left-5 +'px'));
	
}