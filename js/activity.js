/**
 * Javascript functionalities related to activity results page
 */
var FILTER_CLEARED_DUE_TO_NO_RESULTS = 1000;


//Activity related init functions
function initActivity(){
	initElementGroupFilter();	
	displayDetailViewMsg();
	displayItemDetailView();
	renderImages();
}


//ajax request to display updated activities
function viewUpdatedActivities() {
	var param = "itemId=" + $("#itemId").val() + "&altType="+ $("#altType").val()+"&itemPrice="+ALREDY_SELECTED__ITEM_PRICE;
	doAjax("jsp/tour/updatedActivities.jsp", param, displayUpdatedItems,"updatedActivities", "");
}

//element group filtering for activities
function initElementGroupFilter(){
	$('ul.elementGroupFilter').each(function() { //get the ul elements having elementGroupFilter class(filtering tabs)
		
		// For each set of tabs, we want to keep track of which tab is active and it's associated content
		var active, links = $(this).find('a');

		// If the location.hash matches one of the links, use that as the active tab.
		// If no match is found, use the first link as the initial  active tab.
		active = $(links.filter('[href="' + location.hash + '"]')[0]|| links[0]);
		active.parent().addClass('NSelect');		

		// Bind the click event handler
		$(this).on('click', 'a', function(e) {
			// Make the old tab inactive.
			active.parent().removeClass('NSelect');

			// Update the variables with the new link and content
			active = $(this);			

			// Make the tab active.
			active.parent().addClass('NSelect');
			// $content.show();

			// Prevent the anchor's default click action
			e.preventDefault();

			doElementGroupFiltering($(this).attr('id'));
		});
		active.click();
	});
}

//element group filtering request
function doElementGroupFiltering(id)
{	
	var idSplit = id.split("_");
	var param = "filterType=elementGroupFilter&type=" + idSplit[1] + "&view=listView&pdct=GEN";
	doAjax("FilterController", param, ActivityFilterCallback, "", "json");
}
		

//callback function for activity filtering
function ActivityFilterCallback(data, div) 
{
	IS_FILTER_ALREADY_APPLIED=true;
	var status = data["status"];
	if (status == SUCCESS) {
		viewUpdatedActivities();
	} 
	else {
		showNoResultsMsg("updatedActivities"); //if filtering is not success show no results message
	}
}

//display activity detail view popup
function displayActivityDetailViewCallback(data, div) {
	$("#allItems").hide(); //hide all items popup
	replaceExistingResult(data, div);	
	changePrice();
	
	//bind activity detail view close button action
	$("#detailViewCloseButton").bind("click", function() {
		if ($("#allItems").html() == "") {
			$.unblockUI();	
		} 
		else {
			displayAllItemsPopUp(); // if detail view is shown by clicking an item on allitems popup it will be displayed
		}
		$("#detailItem").html("");
	});	
	
	//bind activity detail view close action (outer space)
	$(".blockOverlay").bind("click", function() {
		if ($("#allItems").html() == "") {
			$.unblockUI();	
		} 
		else {
			displayAllItemsPopUp(); // if detail view is shown by clicking an item on allitems popup it will be displayed
		}
		$("#detailItem").html("");
	});	
	$(".blockPage").removeAttr("style");
	var eleId = $('#detailItem').find(".popouter");
	 $(".blockPage").removeAttr("style");
	 $(".blockPage").attr("style",updateBlockUIStyle("activityPopUp"));
	bindAddActivityFunctions();
	renderImages();
}

//bind activity alternatives radio button action to change the price accordingly
function changePrice(){
	$("input[id^='alternative-']").click(function() {
	//	$("#callToBookDiv").hide(); //if the previously selected item was onrequest hide the calltobook div and display addToTripButton div
		$("#addToTripButton").show();
		var selectedPrice=$("#selectedActivityPrice").val();
		var idSplit = $(this).attr('id').split("-");
		var newAltPrice=$("input[id='activityPrice-" + idSplit[1] + "']").val();
		var newPrice=parseFloat(selectedPrice)+parseFloat(newAltPrice);
		$("#priceDisplay").text((newPrice).toFixed(2));
		$("#selectedAlternative").val($(this).val());
		$("#altDescription").html($("p[id='activityDescription-" + idSplit[1] + "']").html());
	});
}

//bind add activity popup functions
function bindAddActivityFunctions()
{
	//bind add activity view all items function
	$("#addActivity-viewAll").unbind('click');
	$("#addActivity-viewAll").bind("click", function() {	
		//if the item was not shown from allitems popup get the all items and display
		if ($("#allItems").html() == "") 
		{				
			if(screen.width==1024 & screen.height== 768){
				$.blockUI({ message: $('#allItems') ,centerX: false,css: { width:'auto',left:'5%', top:'2%' } ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
			}else{
				$.blockUI({ message: $('#allItems') ,centerX: false,css: { width:'auto',left:'15%', top:'10%' } ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
			}
			
			 
			 var searchType=$("#altType").val();
			 var itemId=$("#itemId").val();
			 var param="altType="+searchType+"&itemId="+itemId;
			 doAjax("jsp/tour/allActivities.jsp", param, displayAllActivities, "allItems", "");
		} 
		
		//if the item was shown from allitems popup display the already loaded allitems popup
		else 
		{
			displayAllItemsPopUp();			
		}
		$("#detailItem").html("");
	});
	
	//bind add activity view previous activity function
	$("li[id^='previousAct-']").unbind('click');			
	$("li[id^='previousAct-']").bind("click", function() {
		var searchType=$("#altType").val();
		var itemId=$("#itemId").val();
		var param="altIndex="+$(this).attr('id').split("-")[1]+"&searchType="+searchType+"&itemId="+itemId+"&isDateChanged="+isDateChanged;
		doAjax("jsp/tour/addAnActivity.jsp", param, displayActivityDetailViewCallback, "detailItem", "");
	});
	
	//bind add activity view next activity function
	$("li[id^='nextAct-']").unbind('click');
	$("li[id^='nextAct-']").bind("click", function() {
		var searchType=$("#altType").val();
		var itemId=$("#itemId").val();
		var param="altIndex="+$(this).attr('id').split("-")[1]+"&searchType="+searchType+"&itemId="+itemId+"&isDateChanged="+isDateChanged;
		doAjax("jsp/tour/addAnActivity.jsp", param, displayActivityDetailViewCallback, "detailItem", "");
	});
	
	//bind add activity button function
	 $("div[id^='addActivityBtn-']").unbind('click');
	 $("div[id^='addActivityBtn-']").bind("click", function() {
		 IS_FILTER_ALREADY_APPLIED=false;
		 IS_SORT_ALREADY_APPLIED=false;
		selectAlternativeItem($(this),'activity');
	});
	 
	changeActivityDate(); //bind change activity date functions
	bindCallPopup(); //bind call popup for onrequest alternatives
	
}

//bind selected activity functions
function initSelectedActivity(){
	//bind change date function for selected activity. display change activity datetime popup
	$("div[id^='changeActDate-']").unbind('click');
	$("div[id^='changeActDate-']").bind("click", function() {
		CLICKED_ITEM_ID=$(this).attr('id');
		var idSplit=$(this).attr('id').split("-");
		var searchType=idSplit[1];
		var itemId=idSplit[2];
		
		if(screen.width==1024 & screen.height== 768){
			$.blockUI({ message: $('#detailItem') ,centerX: false, overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
		}else{
			$.blockUI({ message: $('#detailItem') ,centerX: false, overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
		}
		
		var param="searchType="+searchType+"&itemId="+itemId+"&isDateChanged="+isDateChanged;
		doAjax("jsp/tour/changeActivityDateTime.jsp", param, changeDateCallBack, "detailItem", "");
	});
}

//callback function for activity change date time popup
function changeDateCallBack(data,div){
	replaceExistingResult(data, div);	
	changeActivityDate();
	bindCallPopup();
	changePrice();
	
	//bind detail view close button function
	$("#detailViewCloseButton").unbind('click');
	$("#detailViewCloseButton").bind("click", function() {
		$.unblockUI();			
		$("#detailItem").html("");
	});
	
	//bind detail view close function(clicking outer space)
	$(".blockOverlay").unbind('click');
	$(".blockOverlay").bind("click", function() {
		$.unblockUI();			
		$("#detailItem").html("");
	});
	
	//bind change activity date/time button function
	$("div[id^='addActivityBtn-']").unbind('click');
	$("div[id^='addActivityBtn-']").bind("click", function() {
		IS_FILTER_ALREADY_APPLIED=false;
		IS_SORT_ALREADY_APPLIED=false;
		selectAlternativeItem($(this),'activity'); //select alternatative activity
	});
	
	renderImages();
	 $(".blockPage").removeAttr("style");
	 $(".blockPage").attr("style",updateBlockUIStyle("activityPopUp"));
}

//bind call popup for onrequest alternatives
function bindCallPopup(){
	//bind popup for hover
	$("span[id^='call-']").unbind('mouseenter mouseleave');
	$("span[id^='call-']").hover(function(e) {
		var position = $(this).position();
		var topVal = position.top+15;
		var leftVal = position.left-20;
		showOverlay($("div[id='activityAvailabilityPoup']"), leftVal, topVal, 9000);
	}, function() {
		$("div[id='activityAvailabilityPoup']").hide();//hide popup
	});
}

//bind activity date chage function for select item change event
function changeActivityDate(){
	$("select[id^='dateSelect']").change(function(){
		$("#activityPopUp").block({  message: '<div style="position:absolute; left:100px; top:0px" ><img src="images/ajax-loader (1).gif"  /></div>' });
		CLICKED_ITEM_ID=$(this).attr('id');
		var idSplit=$(this).attr('id').split("-");
		var param="newDate="+$(this).val()+"&searchType="+idSplit[3]+"&itemId="+idSplit[2]+"&resultIndex="+idSplit[1]+"&itemIndex="+idSplit[5]+"&isDateChanged="+isDateChanged;
		doAjax("ChangeDateActivitySearchController", param, changeActivityDateCallBack, "", "json");
	});
}

//change activity date callback
function changeActivityDateCallBack( data, div )
{
	var status = data["successStatus"];
	//if date change is success display activity for new date
	if ( status == SUCCESS) 
	{
		var selectedItem = data["selectedItem"];
		var idSplit = CLICKED_ITEM_ID.split("-");
		var param = "searchType=" + idSplit[3] + "&itemId=" + idSplit[2] + "&selectedItem=" + selectedItem+"&isDateChanged="+isDateChanged;
		doAjax("jsp/tour/dateChangedActivity.jsp", param,displayChangedActivity, "activityDetailsDiv", "");
	}
	
	//if date change is unsuccess display a message
	else
	{
		$("#changeDateAjaxLoader").hide();		
		jAlert("Activity not found for the new date. Go back to original date", "Sorry!",activityNotFoundCallback);
	}
}

//bind changed activity functions
function displayChangedActivity(data,div){
	replaceExistingResult(data, div);	
	$('#activityPopUp').unblock();
	$("#changeDateAjaxLoader").hide();
	bindCallPopup();
	changePrice();
	var selectedAltIndex = $("input[id^='selectedAlternative']").val();
	$("#altDescription").html($("p[id='activityDescription-" + selectedAltIndex + "']").html());
	//bind add activity button function
	$("div[id^='addActivityBtn-']").unbind('click');
	$("div[id^='addActivityBtn-']").bind("click", function() {
		IS_FILTER_ALREADY_APPLIED=false;
		IS_SORT_ALREADY_APPLIED=false;
		selectAlternativeItem($(this),'activity');
	});
}

//function for activty not found alert ok button click
function activityNotFoundCallback(){
	$('#activityPopUp').unblock();
	$("select[id^='dateSelect-']").val(0);
}