 /**
 * javascript related to your trip page
 * @date 31-10-2012
 */
var ITEM_TYPE_HOTEL="hotel";
var ITEM_TYPE_ACTIVITY="activity";
var IS_CROSSSELL_LOADED=false;
var SEARCH_TYPE_TMD="TMD";
var SEARCH_TYPE_CRSSSL="CRSSL";
var CLICKED_ITEM_ID="";
var SELECTED_ITEM_ID="";
var SELECTED_ITEM_TYPE="";
var SUPPLEMENT_RESELECT_MSG = "";
var ALREDY_SELECTED_ITEM_ID="";
var ALREDY_SELECTED__ITEM_PRICE="";

$(document).ready(function() {
	BrowserDetect.init();
	var browserName  = BrowserDetect.Browser;
			/*if(browserName == "Safari")
			{				
				setTimeout(function(){
					initTripPage();
					getCrossSellResults();
					$(document).idleTimeout();
					mouseHoverAdded();
				},10800);
			}
			else
			{*/
				initTripPage();
				getCrossSellResults();
				$(document).idleTimeout();
				mouseHoverAdded();
//			}	
});

function initTripPage(){
	initSupplierDescription(); //display about supplier popup
	initRemoveItem();//bind remove item link function
	initViewAllItems();//bind view all items link function
	initTrpItem(); //selected transport item related functions
	initSelectedHotel(); //selected hotel item related functions
	initSelectedActivity(); //selected activity items related functions
	 $("img[id^='confirmButton']").unbind('click');//unbind the click function if already binded
	 initRightSideBasket();
}

//bind display and hide the about supplier popup
function initSupplierDescription(){
	//transport items
	$("div[id^='fullDescriptionTrp-']").unbind('mouseenter mouseleave');
	$("div[id^='fullDescriptionTrp-']").hover(function(e) {
		var itemType = $(this).attr("id").split("-")[1];
		var itemId = $(this).attr("id").split("-")[2];
		var itemIndex = $(this).attr("id").split("-")[3];
		showItemDetails(e,$(this), itemType, itemId, itemIndex, 'Trp');
	}, function() {
		var itemType = $(this).attr("id").split("-")[1];
		var itemId = $(this).attr("id").split("-")[2];
		var itemIndex = $(this).attr("id").split("-")[3];
		hideItemDetails($(this), itemType, itemId, itemIndex, 'Trp');
	});

	
	
	//Booking Flow Updates - transport item Image Hover
	$("img[id^='fullDescriptionTrpImg-']").unbind('mouseenter mouseleave');
	$("img[id^='fullDescriptionTrpImg-']").hover(function(e) {
		var itemType = $(this).attr("id").split("-")[1];
		var itemId = $(this).attr("id").split("-")[2];
		var itemIndex = $(this).attr("id").split("-")[3];
		showItemDetails(e,$(this), itemType, itemId, itemIndex, 'Trp');
	}, function() {
		var itemType = $(this).attr("id").split("-")[1];
		var itemId = $(this).attr("id").split("-")[2];
		var itemIndex = $(this).attr("id").split("-")[3];
		hideItemDetails($(this), itemType, itemId, itemIndex, 'Trp');
	});
	
	
	
	//hotel items
	$("div[id^='fullDescriptionHtl-']").unbind('mouseenter mouseleave');
	$("div[id^='fullDescriptionHtl-']").hover(function(e) {
		var itemType = $(this).attr("id").split("-")[1];
		var itemId = $(this).attr("id").split("-")[2];
		var itemIndex = $(this).attr("id").split("-")[3];
		showItemDetails(e,$(this), itemType, itemId, itemIndex, 'Htl');
	}, function() {
		var itemType = $(this).attr("id").split("-")[1];
		var itemId = $(this).attr("id").split("-")[2];
		var itemIndex = $(this).attr("id").split("-")[3];
		hideItemDetails($(this), itemType, itemId, itemIndex, 'Htl');
	});
	
	//Booking Flow Updates - hotel item Image Hover
	$("img[id^='fullDescriptionHtlImg-']").unbind('mouseenter mouseleave');
	$("img[id^='fullDescriptionHtlImg-']").hover(function(e) {
		var itemType = $(this).attr("id").split("-")[1];
		var itemId = $(this).attr("id").split("-")[2];
		var itemIndex = $(this).attr("id").split("-")[3];
		showItemDetails(e,$(this), itemType, itemId, itemIndex, 'Htl');
	}, function() {
		var itemType = $(this).attr("id").split("-")[1];
		var itemId = $(this).attr("id").split("-")[2];
		var itemIndex = $(this).attr("id").split("-")[3];
		hideItemDetails($(this), itemType, itemId, itemIndex, 'Htl');
	});	
	
	//activity items
	$("div[id^='fullDescriptionAct-']").unbind('mouseenter mouseleave');
	$("div[id^='fullDescriptionAct-']").hover(function(e) {
		var itemType = $(this).attr("id").split("-")[1];
		var itemId = $(this).attr("id").split("-")[2];
		var itemIndex = $(this).attr("id").split("-")[3];
		showItemDetails(e,$(this), itemType, itemId, itemIndex, 'Act');
	}, function() {
		var itemType = $(this).attr("id").split("-")[1];
		var itemId = $(this).attr("id").split("-")[2];
		var itemIndex = $(this).attr("id").split("-")[3];
		hideItemDetails($(this), itemType, itemId, itemIndex, 'Act');
	});
	

	//Booking Flow Updates - activity item Image Hover
	$("img[id^='fullDescriptionActImg-']").unbind('mouseenter mouseleave');
	$("img[id^='fullDescriptionActImg-']").hover(function(e) {
		var itemType = $(this).attr("id").split("-")[1];
		var itemId = $(this).attr("id").split("-")[2];
		var itemIndex = $(this).attr("id").split("-")[3];
		showItemDetails(e,$(this), itemType, itemId, itemIndex, 'Act');
	}, function() {
		var itemType = $(this).attr("id").split("-")[1];
		var itemId = $(this).attr("id").split("-")[2];
		var itemIndex = $(this).attr("id").split("-")[3];
		hideItemDetails($(this), itemType, itemId, itemIndex, 'Act');
	});
}

// display the about item popup
function showItemDetails(e,obj, itemTxt, itemId, idVal, itemType) {
	var element=$("div[id='fullDescriptionPopUp" + itemType + "-" + itemTxt + "-" + itemId + "-" + idVal + "']");
	element.css('z-index', 9000);
	element.css('position', "absolute");
	element.show();
}

//hide the about item popup
function hideItemDetails(obj, itemTxt, itemId, idVal, itemType) {
	$("div[id='fullDescriptionPopUp" + itemType + "-" + itemTxt +"-" + itemId + "-" + idVal + "']").hide();
}

//bind remove item function
function initRemoveItem()
{
	$("a[id^='removeItem-'] , div[id^='changeAndRemoveItem-']").unbind('click');
	$("a[id^='removeItem-'] , div[id^='changeAndRemoveItem-']").click( function()
	{
		CLICKED_ITEM_ID=$(this).attr('id');

		var params="";
		var idSplit=$(this).attr("id").split("-");
		var isMandatory = $("#selectedMandatory_" + idSplit[4] + "_" + idSplit[2]).val().split("-")[1];

		ALREDY_SELECTED__ITEM_PRICE = $('#selectedPrice-'+idSplit[1] + "-" + idSplit[2]).val();
		ALREDY_SELECTED_ITEM_ID = CLICKED_ITEM_ID ;

		//$("#selectedMandatory_"  +idSplit[4] + "_" + idSplit[2]).val('false-' + isMandatory);//change 'selectednamdatoey' hidden input to reflect not selected
		$("#currentItemId").val( idSplit[2] );
		params += "itemId=" + idSplit[2];
		params += "&searchType=" + idSplit[1];
		params += "&resultIndex=" + idSplit[3];

		if(idSplit[1] == "TMD"){
			//send request to get alternatives for package
			if(screen.width==1024 & screen.height== 768){
				$.blockUI({ message: $('#allItems') ,centerX: false, overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
			}else{
				$.blockUI({ message: $('#allItems') ,centerX: false, overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
			}
			doAjax("AlternativeSearchController", params, displayPackageAllItems , null, "json");
		}else{
			// selected shouldn't be changed for package items according to BUG 534
			$("#selectedMandatory_"  +idSplit[4] + "_" + idSplit[2]).val('false-' + isMandatory);//change 'selectednamdatoey' hidden input to reflect not selected
			//block the item div
			 $(".blockPage").removeAttr("style");
			$.blockUI({ message: '<div style="position:absolute; left:100px; top:0px" ><img src="images/ajax-loader (1).gif"  /></div>' ,  onBlock: function() {  $(".blockPage").attr("style",updateBlockUIStyle("PopUpAddHotel"));  } });
			doAjax("AlternativeSearchController", params, removeItemCallback, null, "json");
		}
	});
}
/*
 *
 */
function displayPackageAllItems(){

	var param="itemId="+CLICKED_ITEM_ID.split("-")[2]+"&altType="+CLICKED_ITEM_ID.split("-")[1]+"&itemPrice="+ALREDY_SELECTED__ITEM_PRICE;

	var type = CLICKED_ITEM_ID.split("-")[4];

	if(type==ITEM_TYPE_HOTEL){
		doAjax("jsp/hotel/allHotels.jsp", param, displayAllHotels, "allItems", "");
	}else if(type==ITEM_TYPE_ACTIVITY){
		doAjax("jsp/tour/allActivities.jsp", param, displayAllActivities, "allItems", "");
	}
}

//display animation
function showAnimation(object){
	var position = object.position();
	$("#itemsLoader").css({ "position": "absolute", "top": +position.top+(position.top/2), "left":+ position.left+(position.left/2) });
	$("#itemsLoader").show();
}

function removeItemCallback(data){
	$.unblockUI();
	if ( data.successStatus == 1 )
	{
		var currentId=$("#currentItemId").val();
		var newId=data["itemId"];
		$("#threeResultsDesc-"+currentId).attr("id","threeResultsDesc-"+newId);
		$("#selectedItem-"+currentId).attr("id","selectedItem-"+newId);
		$("#threeResults-"+currentId).attr("id","threeResults-"+newId);
		$("#selectedMandatory_"  +CLICKED_ITEM_ID.split("-")[4] + "_" + currentId).attr("id","selectedMandatory_"  +CLICKED_ITEM_ID.split("-")[4] + "_" + newId);
		if($("#viewAllCRSActivities-"+currentId+"-CRSSL").length>0){
			$("#viewAllCRSActivities-"+currentId+"-CRSSL").attr("id","viewAllCRSActivities-"+newId+"-CRSSL");
		}
		else if($("#viewAllCRSHotels-"+currentId+"-CRSSL").length>0){
			$("#viewAllCRSHotels-"+currentId+"-CRSSL").attr("id","viewAllCRSHotels-"+newId+"-CRSSL");
		}
		$("#currentItemId").val(newId);
		var param = "itemId=" + newId + "&altType=" + CLICKED_ITEM_ID.split("-")[1];
		if( CLICKED_ITEM_ID.split("-")[4] === ITEM_TYPE_ACTIVITY )
		{
			doAjax("jsp/result/crossSellResults.jsp", "",displayCrossSellThreeResults, "crossSellResults", null);
		}
		else
		{
			doAjax("jsp/result/threeResultList.jsp", param, displayThreeResults, null, null);
		}
	}
}


function displayAllAlternatives(type){

	var params="";

	var idSplit=ALREDY_SELECTED_ITEM_ID.split("-");
	$("#currentItemId").val(idSplit[1]);
	params+="itemId="+idSplit[1];
	params+="&searchType="+idSplit[2];

	if(screen.width==1024 & screen.height== 768){
		$.blockUI({ message: $('#allItems') ,centerX: false,css: { width:'auto',left:'3.8%', top:'2%' } ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
	}else{
		$.blockUI({ message: $('#allItems') ,centerX: false,css: { width:'auto',left:'15%', top:'10%' } ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
	}


	if(type==ITEM_TYPE_ACTIVITY)
	{
		var pDiv = $("#" + div).closest('.additionalActivityContainer');
		var pDivId = threeRsltDiv;
		if (pDiv.length > 0  )
		{
			pDivId = $(pDiv).attr('id').split("-")[1];
		}
		params += "&originalActivity=" + pDivId;
		params += "&moreActivityIndex=" + idSplit[3];

		doAjax("GetAlternativesController", params, viewAllActivitiesCallback, null, "json");
	}
	else if(type==ITEM_TYPE_HOTEL){
		doAjax("GetAlternativesController", params, viewAllHotelsCallback, null, "json");
	}
}


function displayThreeResults(data)
{
	$(".blockPage").removeAttr("style");
	var currentId=$("#currentItemId").val();
	$("#threeResultsDesc-"+currentId).html(data);
	$("#selectedItem-"+currentId).hide();
	$("#threeResults-"+currentId).show();
	$("#threeResultsDesc-"+currentId).find(".ImgBox").last().removeClass("mgR20");
	initViewAllItems();
	refreshBasket();
	displayDetailViewMsg();
	displayItemDetailView();
	loadChangeDate();
	renderImages();
}

/**  this method will get the cross-sell results*/
function getCrossSellResults()
{
	var params="refetch=true";
	/*if(browserName == "Safari")
	{
		setTimeout(function(){
			doAjax("CrossSellAjaxHandler", params, refreshResults, null, "json");
		},2000);
		
	}
	else
	{*/
		doAjax("CrossSellAjaxHandler", params, refreshResults, null, "json");
//	}
}
/** refresh the results, if refetch is true send the search again */
function refreshResults(data)
{
	var isRefetch = data["refetch"];
	var hasResults = data["hasResults"];

	if( hasResults )
	{
		doAjax("jsp/result/crossSellResults.jsp", "",displayCrossSellThreeResults, "crossSellResults", null);
	}

	if ( isRefetch )
	{
		var params="refetch=true";
		doAjax("CrossSellAjaxHandler", params,	refreshResults, null, "json");
	}
	else
	{
		$("#crossSellajaxLoader").hide();
		IS_CROSSSELL_LOADED=true;
		$("#backButtonDiv").css('display',"");

		if(!hasResults){
			refreshBasket();
		}
	}
}

/** this method will display the cross-sell results */
function displayCrossSellThreeResults(data)
{
	$("#crossSellResultsDiv").html("");
	$("#crossSellResultsDiv").html(data);
	$("#crossSellajaxLoader").hide();
	initViewAllCrossSellItems();
	$("#crossSellResultsDiv").find("div[id^='threeResultsDesc-']").each(function() {
		$(this).find(".ImgBox").last().removeClass("mgR20");
	});
	displayDetailViewMsg();
	loadChangeDate();
	displayItemDetailView();
	renderImages();
	refreshBasket();

	$("#detailItem").html("");
	$("#detailItem").hide();
	$.unblockUI();
	initSupplierDescription();
	initRemoveItem();
	initSelectedHotel();
	initSelectedActivity();
}

function initViewAllItems()
{
	$("a[id^='viewAllActivities-']").unbind('click');
	$("a[id^='viewAllActivities-']").click(function() {
		CLICKED_ITEM_ID=$(this).attr('id');
		getAllItems($(this),ITEM_TYPE_ACTIVITY);
	});

	$("a[id^='viewAllHotels-']").unbind('click');
	$("a[id^='viewAllHotels-']").click(function() {
		CLICKED_ITEM_ID=$(this).attr('id');
		getAllItems($(this),ITEM_TYPE_HOTEL);
	});
}

function initViewAllCrossSellItems()
{
	loadChangeDate();
	$("a[id^='viewAllCRSActivities-']").unbind('click');
	$("a[id^='viewAllCRSActivities-']").click(function()
	{
		CLICKED_ITEM_ID=$(this).attr('id');
		getAllItems($(this),ITEM_TYPE_ACTIVITY);


	});

	$("a[id^='viewAllCRSHotels-']").unbind('click');
	$("a[id^='viewAllCRSHotels-']").click(function()
	{
		CLICKED_ITEM_ID=$(this).attr('id');
		getAllItems($(this),ITEM_TYPE_HOTEL);

	});
}

function getAllItems(element,itemType){
	var params="";

	var idSplit=element.attr("id").split("-");
	$("#currentItemId").val(idSplit[1]);
	params+="itemId="+idSplit[1];
	params+="&searchType="+idSplit[2];
//	params+="&orientation="+getCurrentOrientation();
//	params+="&screenWidth="+getCurrentScreenWidth();

//	if(screen.width==1024 & screen.height== 768){
//		$.blockUI({ message: $('#allItems') ,centerX: false, css: function() {  $(".blockPage").removeAttr("css"); } ,onBlock: function() {  $(".blockPage").attr("style",updateBlockUIStyle("allItems"));  },overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
//	}else{
//		$.blockUI({ message: $('#allItems') ,centerX: false,  css: function() {  $(".blockPage").removeAttr("css"); } , onBlock: function() {  $(".blockPage").attr("style",updateBlockUIStyle("allItems"));  },overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
//	}
	if(itemType==ITEM_TYPE_ACTIVITY){
		 $(".blockPage").removeAttr("style");
		$.blockUI({ message: $('#allItems') ,centerX: false,  css: function() {  $(".blockPage").removeAttr("css"); } , onBlock: function() {  $(".blockPage").attr("style",updateBlockUIStyle("PopUpAddHotel"));  },overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
		var pDiv = $(element).closest('div[id^="additionalActivity-"]');
		if (pDiv.length > 0 )
		{
			var pDivId = $(pDiv).attr('id').split("-")[1];
			params += "&originalActivity=" + pDivId;
			params += "&moreActivityIndex=" + idSplit[3];
		}
		doAjax("GetAlternativesController", params, viewAllActivitiesCallback, null, "json");
	}
	else if(itemType==ITEM_TYPE_HOTEL){
		 $(".blockPage").removeAttr("style");
		$.blockUI({ message: $('#allItems') ,centerX: false,  css: function() {  $(".blockPage").removeAttr("css"); } , onBlock: function() {  $(".blockPage").attr("style",updateBlockUIStyle("popUpallHotels"));  },overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
		doAjax("GetAlternativesController", params, viewAllHotelsCallback, null, "json");
	}
}

function viewAllActivitiesCallback(){
	var param="itemId="+CLICKED_ITEM_ID.split("-")[1]+"&altType="+CLICKED_ITEM_ID.split("-")[2]+"&itemPrice="+ALREDY_SELECTED__ITEM_PRICE;
	doAjax("jsp/tour/allActivities.jsp", param, displayAllActivities, "allItems", "");
}

function viewAllHotelsCallback(){

	var param="itemId="+CLICKED_ITEM_ID.split("-")[1]+"&altType="+CLICKED_ITEM_ID.split("-")[2]+"&itemPrice="+ALREDY_SELECTED__ITEM_PRICE;
	doAjax("jsp/hotel/allHotels.jsp", param, displayAllHotels, "allItems", "");
}

function rePrepareHotelImageBoxes(div){
	var top = 0;
	var rowElements = new Array();
	$("#"+div).find(".ImgBox").each(function() {
		if(top == 0){
			top = $(this).offset().top;
		}
		if(top != 0 && top==$(this).offset().top){
			rowElements.push($(this));
		}else{
			var maxHeight = 0;
			var isWidthDifferent = false;
			for ( var i = 0; i < rowElements.length; i++) {
				var element = rowElements[i];
				if (maxHeight == 0) {
					maxHeight = $(element).height();
				} else if (maxHeight < $(element).height()) {
					isWidthDifferent = true;
					maxHeight = $(element).height();
				}
			}
			for ( var i = 0; i < rowElements.length; i++) {
				$(rowElements[i]).css("height", (maxHeight + 30));
//				console.log(maxHeight);
			}
			top = 0;
			rowElements =  new Array();
			rowElements.push($(this));
		}

	});
}

function displayAllHotels(data,div){
	 replaceExistingResult( data, div );

	 $("#closeButton").unbind('click');
	 $("#closeButton").bind( "click", function()
		{
		 isDateChanged=false;
		 isMapLoaded=false;
		 isNoresults=false;
		 	IS_FILTER_ALREADY_APPLIED=false;
			IS_SORT_ALREADY_APPLIED=false;

			var itemIdSplit=CLICKED_ITEM_ID.split("-");
			var altType;
			if(itemIdSplit[1]=="viewAll"){
				altType=itemIdSplit[2];
			}
			else if(itemIdSplit[1]=="addHotel"){
				altType=itemIdSplit[3];
			}
			var altType=itemIdSplit[3];
			if(altType=="CRSSL"){
				var newId=$("#currentItemId").val();
				var param = "itemId=" + newId + "&altType=CRSSL";
				doAjax("jsp/result/threeResultList.jsp", param, displayThreeResults, null, null);
			}
			 $.unblockUI();
			 $("#allItems").html("");
		} );

	 //bind all item close function
	 $(".blockOverlay").unbind('click');
	 $(".blockOverlay").bind( "click", function()
		{
		 isDateChanged=false;
		 isMapLoaded=false;
		 isNoresults=false;
		 	IS_FILTER_ALREADY_APPLIED=false;
			IS_SORT_ALREADY_APPLIED=false;

			var itemIdSplit=CLICKED_ITEM_ID.split("-");
			var altType;
			if(itemIdSplit[1]=="viewAll"){
				altType=itemIdSplit[2];
			}
			else if(itemIdSplit[1]=="addHotel"){
				altType=itemIdSplit[3];
			}
			var altType=itemIdSplit[3];
			if(altType=="CRSSL"){
				var newId=$("#currentItemId").val();
				var param = "itemId=" + newId + "&altType=CRSSL";
				doAjax("jsp/result/threeResultList.jsp", param, displayThreeResults, null, null);
			}
			 $.unblockUI();
			 $("#allItems").html("");
		} );
	 $(".blockPage").removeAttr("style");
	 $(".blockPage").attr("style",updateBlockUIStyle("popUpallHotels"));
	 rePrepareHotelImageBoxes(div);
	 initHotel();
	 scrollToTop();
}
function displayAllActivities(data,div){
	 replaceExistingResult( data, div );

	 $("#closeButton").unbind('click');
	 $("#closeButton").bind( "click", function()
		{
		 isDateChanged=false;
		 	IS_FILTER_ALREADY_APPLIED=false;
			IS_SORT_ALREADY_APPLIED=false;
			 $.unblockUI();
			 $("#allItems").html("");
		} );

	 //bind all activities close function
	 $(".blockOverlay").unbind('click');
	 $(".blockOverlay").bind( "click", function()
		{
		 isDateChanged=false;
		 	IS_FILTER_ALREADY_APPLIED=false;
			IS_SORT_ALREADY_APPLIED=false;
			 $.unblockUI();
			 $("#allItems").html("");
		} );

	 $(".blockPage").removeAttr("style");
	 $(".blockPage").attr("style",updateBlockUIStyle("popUpallHotels"));
	 rePrepareHotelImageBoxes(div);
	 initActivity();
	 scrollToTop();
}

function displayUpdatedItems(data,div){
	 replaceExistingResult( data, div );
	 rePrepareHotelImageBoxes(div);
	 displayDetailViewMsg();
	 displayItemDetailView();
	 loadChangeDate();
	 if(isMapLoaded){
		 $("#viewAllPorts").click();
	 }
	 renderImages();

}

function displayDetailViewMsg(){
	$("div[id^='summaryImage']").unbind('mouseenter mouseleave');
	$("div[id^='summaryImage']").hover(function() {
		$(this).append("<div id='imageHover' class='imgDes4'><div> CLICK FOR DETAILS </div></div>");
	}, function() {
		$("#imageHover").remove();
	});
}

function displayItemDetailView(){
	$("div[id^='summaryImage-']").unbind('click');
	$("div[id^='summaryImage-']").click(function() {
		$("#currentItemId").val($(this).attr("id").split("-")[2]);
		$("#imageHover").remove();
		var idSplit=$(this).attr('id').split("-");
		var searchType=idSplit[3];
		CLICKED_ITEM_ID=$(this).attr('id');
		if(searchType!="" && !IS_FILTER_ALREADY_APPLIED && !IS_SORT_ALREADY_APPLIED){
			 var params="";
			params+="itemId="+idSplit[2];
			params+="&searchType="+idSplit[3];
			if( idSplit[4]==ITEM_TYPE_ACTIVITY )
			{
				var pDiv = $(this).closest('div[id^="additionalActivity-"]');
				if ( pDiv.length > 0 )
				{
					var pDivId = $(pDiv).attr('id').split("-")[1];
					params += "&originalActivity=" + pDivId;
					params += "&moreActivityIndex=" + idSplit[3];
				}
			}
			doAjax("GetAlternativesController", params, GetAlternatvesCallback, null, "json");
		}
		else{
			GetAlternatvesCallback();
		}
	});
}

function GetAlternatvesCallback(){
	var idSplit=CLICKED_ITEM_ID.split("-");
	var itemType=idSplit[4];
	var searchType="";
	var itemId="";
	if(idSplit[3]=="")
	{
		searchType=$("#altType").val();
		itemId=$("#itemId").val();
	}
	else
	{
		searchType=idSplit[3];
		itemId=idSplit[2];
	}


	var param="altIndex="+idSplit[1]+"&searchType="+searchType+"&itemId="+itemId+"&itemPrice="+ALREDY_SELECTED__ITEM_PRICE+"&isDateChanged="+isDateChanged;
	var eleId = $('#detailItem').find(".popouter");
	if(itemType==ITEM_TYPE_ACTIVITY)
	{
		if(screen.width==1024 & screen.height== 768){
			$.blockUI({ message: $('#detailItem') ,centerX: false, overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
		}else{
			$.blockUI({ message: $('#detailItem') ,centerX: false, overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
		}
		doAjax("jsp/tour/addAnActivity.jsp", param, displayActivityDetailViewCallback, "detailItem", "");
	}
	else if(itemType==ITEM_TYPE_HOTEL)
	{
		if(screen.width==1024 & screen.height== 768){
			$.blockUI({ message: $('#detailItem') ,centerX: false ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
		}else{
			$.blockUI({ message: $('#detailItem') ,centerX: false ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
		}
		doAjax("jsp/hotel/addAHotel.jsp", param, displayHotelDetailViewCallback, "detailItem", "");
	}
	else{

	}
}

/**
 * display all items popup
 */
function displayAllItemsPopUp(){
//	$(".blockPage").removeAttr("style");
//	var style = updateBlockUIStyle("popUpallHotels");
	if(screen.width==1024 & screen.height== 768){
		$.blockUI({
			message : $('#allItems'),
			centerX : false,
//			onBlock: function() {  $(".blockPage").attr("style",style);  },
			overlayCSS : {
				backgroundColor : '#000',
				opacity : '0.5'
			},
			fadeIn:10
		});
	}else{
		$.blockUI({
			message : $('#allItems'),
			centerX : false,
//			onBlock: function() {  $(".blockPage").attr("style",style);  },
			overlayCSS : {
				backgroundColor : '#000',
				opacity : '0.5'
			},
			fadeIn:10
		});
	}

	 $(".blockPage").removeAttr("style");
	 $(".blockPage").attr("style",updateBlockUIStyle("popUpallHotels"));

	$("#closeButton").bind("click", function() {
		IS_FILTER_ALREADY_APPLIED=false;
		IS_SORT_ALREADY_APPLIED=false;
		$.unblockUI();
		$("#allItems").html("");
	});

	$(".blockOverlay").unbind('click');
	$(".blockOverlay").bind("click", function() {
		IS_FILTER_ALREADY_APPLIED=false;
		IS_SORT_ALREADY_APPLIED=false;
		$.unblockUI();
		$("#allItems").html("");
	});
}

function selectAlternativeItem(element,itemType)
{
	var idSplit = element.attr("id").split("-");
	SELECTED_ITEM_ID = idSplit[1];
	SELECTED_ITEM_TYPE = idSplit[2];
	var upgradeIndex=$("#selectedAlternative").val();//$("input[name='alternatives']:checked").val();
	var params = "";
	if( idSplit[4] == 'CHDATE' )
	{
		params = "changeActDate=true";
	}
	else
	{
		params = "selectAlt=true";
	}
    params+="&itemResIndex=" + idSplit[3];
    params+="&searchType=" + idSplit[2];
    params+="&itemId=" + idSplit[1];
    params+="&upgrade-" + idSplit[3] + "=" + upgradeIndex;
    params+="&isDateChanged=" + isDateChanged;

  //  $.blockUI({ message: '<div style="position:absolute; left:140px; top:0px" ><img src="images/ajax-loader (1).gif"  /></div>' , css: { width:'auto'} ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
    blockInMiddle("addItemsBasket");
    if( itemType == ITEM_TYPE_HOTEL )
    {
    	$("input[id^='SUPP-']:checked").each(function(index) {
    		if($(this).attr('id').split("-")[1]=="" || $(this).attr('id').split("-")[1]==upgradeIndex){
    	    params+="&"+$(this).attr('name')+"="+1;
    		}
    	});
    }
    $("#detailItem").html("");
    if(isDateChanged){
    	doAjax("UpdateController", params, dateChangedUpdateCallback, null, "json");
    }
    else{

    	doAjax("UpdateController", params, updateCallback, null, "json");
    }
}

function updateCallback(data, div)
{
	var status = data["status"];
	$("#allItems").html("");
	if (status == SUCCESS)
	{
		var div = "selectedItem-"+ SELECTED_ITEM_ID;
		var params = "selectedItemType=" + SELECTED_ITEM_TYPE;
		params += "&itemId" +  SELECTED_ITEM_ID;

		var idSplit = CLICKED_ITEM_ID.split("-");
		var isMandatory = $("#selectedMandatory_" + idSplit[4] + "_" + idSplit[2]).val().split("-")[1];
		params+="&isMandatory="+isMandatory;
		// add more cross-sell activities
		if( SELECTED_ITEM_TYPE === SEARCH_TYPE_CRSSSL && ITEM_TYPE_ACTIVITY === idSplit[4] )
		{
			doAjax("jsp/result/crossSellResults.jsp", "",displayCrossSellThreeResults, "crossSellResults", null);
		}
		else
		{
			doAjax("jsp/result/updatedItem.jsp", params, displaySelectedItems, div, "");
		}
	}
	else
	{
		displayMessage(null, data["status"], data["msg"], data["data"]);
		addingMargingTopF();
		addingMargingTopShpBskt();
	}
}

/** this method will display the selected results */
function displaySelectedItems(data, div)
{
	$("#detailItem").html("");
	$("#detailItem").hide();
	$.unblockUI();
	replaceExistingResult( data, div );
	$("#" + div).show();
	var threeRsltDiv = div.split("-")[1];
	$("#threeResults-" + threeRsltDiv).hide();

	var idSplit = CLICKED_ITEM_ID.split("-");
	var isMandatory = $("#selectedMandatory_" + idSplit[4] + "_" + idSplit[2]).val().split("-")[1];
	$("#selectedMandatory_"  +idSplit[4] + "_" + idSplit[2]).val('true-' + isMandatory);

	initSupplierDescription();
	initRemoveItem();
	refreshBasket();
	initSelectedHotel();
	initSelectedActivity();
	renderImages()
}

function updateDisplay(data, div)
{
	$.unblockUI();
	replaceExistingResult( data, div );
	$("#" + div).show();
	initViewAllCrossSellItems();
	displayDetailViewMsg();
	loadChangeDate();
	displayItemDetailView();

	initSupplierDescription();
	initRemoveItem();
	refreshBasket();
	initSelectedHotel();
	initSelectedActivity();
	renderImages();
}

function initAddBasketItems()
{
	$("div[id^='confirmButton']").unbind('click');
	$("div[id^='confirmButton']").click( function()
	{
	//	$.blockUI({ message: $('#addToBasketLoader') ,centerX: false,css: { width:'auto',left:'30%', top:'10%' } ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
		 blockInMiddle("addToBasketLoader");
		var params = "addToBasket=true";
		doAjax("UpdateController", params, addBasketCallback, null, "json");
	});
}

function addBasketCallback(data, div)
{
	$("#addToBasketLoader").hide();
	$.unblockUI();
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

function selectTrpAlternativeItem(element)
{
	var idSplit = element.attr("id").split("-");
	SELECTED_ITEM_ID = idSplit[2];
	SELECTED_ITEM_TYPE = idSplit[1];
	var upgradeIndex=idSplit[4];
    var params = "selectAlt=true";
    params+="&itemResIndex=" + idSplit[3];
    params+="&searchType=" + idSplit[1];
    params+="&itemId=" + idSplit[2];
    params+="&upgrade-"+idSplit[3]+"="+upgradeIndex;
    blockInMiddle("addItemsBasket");
    doAjax("UpdateController", params, updateTrpCallback, null, "json");
}

function updateTrpCallback(data, div)
{
	var status = data["status"];
	if (status == SUCCESS)
	{
		SUPPLEMENT_RESELECT_MSG = data["supMsg"];
		var div = "selectedItem-"+ SELECTED_ITEM_ID;
		var params = "selectedItemType=" + SELECTED_ITEM_TYPE;
		params += "&itemId" +  SELECTED_ITEM_ID;
		doAjax("jsp/result/updatedItem.jsp", params, displayTrpSelectedItem, div, "");
	}
	else
	{
		displayMessage(null, data["status"], data["msg"], data["data"]);
		addingMargingTopF();
		addingMargingTopShpBskt();
	}
}

/** this method will display the selected results */
function displayTrpSelectedItem(data, div)
{
	$( "#trpCloseButton_" + SELECTED_ITEM_TYPE + "-" + SELECTED_ITEM_ID ).click();
	$( "#" + div ).html("");
	replaceExistingResult( data, div );
	//$("#" + div).show();

	initSupplierDescription();
	initRemoveItem();
	refreshBasket();
	initSelectedHotel();
	initSelectedActivity();
	renderImages();
	initTrpItem();
	//displayDetailView();
	if( SUPPLEMENT_RESELECT_MSG.length > 0 )
	{
		jAlert( SUPPLEMENT_RESELECT_MSG, "", null );
	}

}

/*
 * change date for hotel item
 */


function loadChangeDate(){

	$("div[id^='summaryImageOneWayToCity-']").unbind('click');
	$("div[id^='summaryImageOneWayToCity-']").click(function() {
			$("#currentItemId").val($(this).attr("id").split("-")[2]);
			popUpChangeDatesHotel($(this));
	});
}
function popUpChangeDatesHotel(obj){

	//$('#changeHotelDates').css('display', '');
	$("#allItems").html("");


	$.blockUI({ message: $('#changeHotelDatePopUp') ,centerX: false, overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});

	 $(".blockPage").removeAttr("style");
	 $(".blockPage").attr("style",updateBlockUIStyle("changeHotelDatePopUp"));

	//if($('#hotelChangedDate').val()==""){
	 $('#hotelChangedDate').val($('#changeDateDateHF').val());
	 // }
	 // if( $('#hotelChangedNights').val()==""){
	 $('#hotelChangedNights').val("t_"+$('#changeDateNightsHF').val());
	 // }
	$("#fromCity").val($("#fromCityHF").val());
	$("select[id='fromCity']").change();
	$("#toCity").val($("#toCityHF").val());
	$("#changeHotelDepartureDate").val($('#changeDateDateHF').val()) ;

	 var ac1 = new ChangeDatesCalander("changeHotelDepartureDate",{fromCity:"fromCityHF",toCity:"toCityHF",format:"MM/DD/YYYY",onStart:loading(true),onEnd:loading(false),departureDate:"changeHotelDepartureDate",nightId:"changeHotelNights",isDefaultCal:true,minDate:"changeDateDateHF"},"changeTripDatePopUp");
	 ac1.init();

	// $("#changeHotelNights").val($('#changeDateNightsHF').val()) ;

	 intNightDropDownload('changeHotelNights');

	 var val=$('#hotelChangedNights').val().split("_")[1];

	 showSelectedVal(val, "changeHotelNights");

	 callController(obj) ;

	$("#changeHotelCloseButton").unbind("click");
	$("#changeHotelCloseButton").bind("click", function() {
		var newId=$("#currentItemId").val();
		var param = "itemId=" + newId + "&altType=CRSSL";
		doAjax("jsp/result/threeResultList.jsp", param, displayThreeResults, null, null);
			$.unblockUI();
			$('#changeHotelDates').hide();
	});


}

function callController(obj){
	$("#changeHotelDatesBtn").unbind("click");
	$("#changeHotelDatesBtn").bind("click", function() {
		// $.blockUI({ message: $('#addToBasketLoader') ,centerX: false,css: { width:'auto',left:'30%', top:'10%' } ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
		 blockInMiddle("addToBasketLoader");
		 CLICKED_ITEM_ID = obj.attr('id');

		/*if($("#changeHotelDepartureDate").val() == $('#hotelChangedDate').val() && $("#changeHotelNights").val() == $('#hotelChangedNights').val() ){
				var idSplit = obj.attr('id').split("-");
				CLICKED_ITEM_ID = obj.attr('id');

				var params = "";
				params += "itemId=" + idSplit[2];
				params += "&searchType=" + idSplit[3];
				doAjax("GetAlternativesController", params, GetAlternatvesCallback, null, "json");

		}
		else
		{*/
			var idSplit= obj.attr('id').split("-");
			var nights=0;
			 var pieces = $('#changeHotelNights').val().split("_");
			if(pieces[0] != 't'){
				nights=pieces[0] ;
			}else{
				nights = pieces[1];
			}
			var param="newDate="+$("#changeHotelDepartureDate").val()+"&newNights="+nights+"&itemId="+idSplit[2]+"&itemIndex="+idSplit[1];
			doAjax("ChangeHotelDatesController", param, changeHotelDatesCallback, null, "json");
		//}
	});
}



function intNightDropDownload(id) {


	var nightList = new NightDropDown(id,{
		onComplete:loading(true),departureDate:"changeHotelDepartureDate",nightId:"changeHotelNights",fromCity:"fromCityHF",toCity:"toCityHF",isDefaultDropDown:true
	});

	//$__searchBan('#changeHotelNights').bind('click', function() {
			loading(false);
			nightList.init();
			//var val = 1;
			 var val=$('#hotelChangedNights').val().split("_")[1];

//			 setTimeout(function(){
				 showSelectedVal(val, "changeHotelNights");
				 $("#changeHotelNights  option[value='0']").css("display","none");
				 $("#changeHotelNights  option[value^='t_']").attr("selected","selected");
//			 },100);
	//});
}

/*function showSelectedVal(val , id){

	$__searchBan("#"+id).empty();  // to set
	$__searchBan('#'+id).append('<option  value="t_'+ val +'">'+ val+ '</option>');

}
*/
function changeHotelDatesCallback(data,div){

	var status  = data["successStatus"];
	var itemIndex = data["selectedItemIndex"];
	var itemId = data["newItemId"];
	var idSplit=CLICKED_ITEM_ID.split("-");
	var oldItemId=idSplit[2];

	if(status==SUCCESS){
		$("#currentItemId").val(itemId);
		$("div[id='selectedItem-"+oldItemId+"']").attr("id","selectedItem-"+itemId);
		$("div[id='threeResults-"+oldItemId+"']").attr("id","threeResults-"+itemId);
		$("div[id='threeResultsDesc-"+oldItemId+"']").attr("id","threeResultsDesc-"+itemId);
		$("a[id='viewAllCRSHotels-"+oldItemId+"-CRSSL']").attr("id","viewAllCRSHotels-"+itemId+"-CRSSL");

		CLICKED_ITEM_ID=idSplit[0]+"-"+itemIndex+"-"+itemId+"-"+idSplit[3]+"-"+idSplit[4]+"-"+idSplit[5];
		$("input[id='selectedMandatory_hotel_"+oldItemId+"']").attr("id","selectedMandatory_hotel_"+itemId);
		 $('#hotelChangedDate').val($("#changeHotelDepartureDate").val());
		 $('#hotelChangedNights').val($("#changeHotelNights").val());


		if(screen.width==1024 & screen.height== 768){
			$.blockUI({ message: $('#detailItem') ,centerX: false, overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
		}else{
			$.blockUI({ message: $('#detailItem') ,centerX: false, overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
		}


		var param="altIndex="+itemIndex+"&searchType="+idSplit[3]+"&itemId="+itemId;
		doAjax("jsp/hotel/addAHotel.jsp", param, displayDateChangedHotelDetailViewCallback, "detailItem", "");
	}
	else{
		$("#addToBasketLoader").hide();
		jAlert("Hotel not found for the new date.Please select another hotel", "Sorry!", hotelNotFoundCallBack);
	}

}

function hotelNotFoundCallBack(){
	unblockUi();

}

function displayDateChangedHotelDetailViewCallback(data,div){
	$("#allItems").hide();
	 replaceExistingResult( data, div );
	 initHotelTabs();
	 bindPhotoTabEvents();
	 loadChangeDate();

	 $("#detailViewCloseButton").unbind('click');
	 $("#detailViewCloseButton").bind("click", function() {
			if ($("#allItems").html() == "") {
				var newId=$("#currentItemId").val();
				var param = "itemId=" + newId + "&altType=CRSSL";
				doAjax("jsp/result/threeResultList.jsp", param, displayThreeResults, null, null);
				$(".blockPage").removeAttr("style");
				$.unblockUI();
			} else {
				$(".blockPage").removeAttr("style");
				displayAllItemsPopUp();
			}
			$("#detailItem").html("");
		});

	 $(".blockOverlay").unbind('click');
	 $(".blockOverlay").bind("click", function() {
			if ($("#allItems").html() == "") {
				var newId=$("#currentItemId").val();
				var param = "itemId=" + newId + "&altType=CRSSL";
				doAjax("jsp/result/threeResultList.jsp", param, displayThreeResults, null, null);
				$(".blockPage").removeAttr("style");
				$.unblockUI();
			} else {
				$(".blockPage").removeAttr("style");
				displayAllItemsPopUp();
			}
			$("#detailItem").html("");
		});
	 $("#htlMoreDetail").bind("click", function() {
		$("#hotelOverviewLink") .trigger("click");
		});

	 $(".blockPage").removeAttr("style");
	 $(".blockPage").attr("style",updateBlockUIStyle("addHotelPopup"));
	 bindAddHotelFunctions();
	 renderImages();
	 initTripPage();
}



function mouseHoverAdded(){

	 $("div[id^='cssAddedDivClp-']").unbind('mouseenter mouseleave');
	 $("div[id^='cssAddedDivClp-']").hover(function(e) {
		 var num1 = $(this).attr("id").split("-")[1];
		 var num2 = $(this).attr("id").split("-")[2];
		 $("div[id='cssRemoveClp-"+ num1  + "-" + num2 + "']" ).css("display","");
	 },function() {
		 var num1 = $(this).attr("id").split("-")[1];
		 var num2 = $(this).attr("id").split("-")[2];
		 $("div[id='cssRemoveClp-" + num1 + "-" + num2 + "']" ).css("display","none");
	 }
	 );


	 $("div[id^='cssAddedDivCmb-']").unbind('mouseenter mouseleave');
	 $("div[id^='cssAddedDivCmb-']").hover(function(e) {
		 var num1 = $(this).attr("id").split("-")[1];
		 var num2 = $(this).attr("id").split("-")[2];
		 $("div[id='cssRemoveCmb-"+ num1  + "-" + num2 + "']" ).css("display","");
	 },function() {
		 var num1 = $(this).attr("id").split("-")[1];
		 var num2 = $(this).attr("id").split("-")[2];
		 $("div[id='cssRemoveCmb-" + num1 + "-" + num2 + "']" ).css("display","none");
	 }
	 );	 
	 $(window).resize(function() {
		$('#callPopup').hide();
	});
}

//bind tool tips for call clipper tool tip
function bindHotelAvailabilityToolTip()
{
	$(".call-hotel-clipper").unbind('mouseenter mouseleave');
	$(".call-hotel-clipper").hover(function(e) {
		var position = $(this).position();
		var topVal = position.top + 15;
		var leftVal = position.left - 35;
		showOverlay($("div[id='hotelAvailabilityPoup']"), leftVal, topVal, 9000);
	}, function() {
		$("div[id='hotelAvailabilityPoup']").hide();
	});
	
	
	
	$(".call-activity-clipper").unbind('mouseenter mouseleave');
	$(".call-activity-clipper").hover(function(e) {
		var position = $(this).position();
		var topVal = position.top + 15;
		var leftVal = position.left - 35;
		showOverlay($("div[id='activityAvailabilityPoup']"), leftVal, topVal, 9000);
	}, function() {
		$("div[id='activityAvailabilityPoup']").hide();
	});
	
}