/**
 * Javascript functionalities related to hotel results page
 */
var FILTER_CLEARED_DUE_TO_NO_RESULTS = 1000;
var IS_FILTER_ALREADY_APPLIED = false;
var IS_SORT_ALREADY_APPLIED = false;
var SELECTED_FILTER="0";
var CURRENT_FILTER="0";
var newAmenities="";
var isMapLoaded=false;
var isNoresults=false;
var selecedtRoomId = null ;

//init functions related to hotels
function initHotel(){
	initFiltering();
	initSorter();	
	displayDetailViewMsg();
	displayItemDetailView();
	loadChangeDate();
	renderImages();
	initMapView();
}

//bind hotel filter functions
function initFiltering(){
	initStarFilter(); //bind hotel star filtering
	
	//bind amenity filter
	$("#amenityFilterLink").unbind( 'click' );
	var position = $("#amenityFilterLink").position();	
	$("#amenityFilterLink").bind( 'click', function()
	{
		//display amenity dropdown
		showOverlay($("#amenityFilterOverlay"),null, null, 1000, AMINATION_SLIDE_DOWN);
		
		//bind amenity filter button function
		$("#amenityFilterButton").unbind( 'click' );
		$("#amenityFilterButton").bind( 'click', doAmenityFilter );
		
		//bind amenity filter close button function
		$("#filterCloseBtn").click( function() 
		{
			$("#amenityFilterOverlay").slideUp();
			var amenityArray=newAmenities.split(",");
			$( amenityArray ).each(function( index ) {
				  $("#"+this).attr("checked",false);
			});
		});
		
		//bind amenity filter clear button function
		$("#clearFilter").unbind( 'click' );
		$("#clearFilter").bind( 'click', function()
		{
			clearAmenityFilter();
		});
		
		$("input[id^='amenity_chbx_']").unbind('click');
		$("input[id^='amenity_chbx_']").bind( 'click', function()
		{
			newAmenities+=$(this).attr("id")+",";
		});
	});		
}

//send amenity filter request
function doAmenityFilter()
{
	newAmenities="";
	var slectedAmenities = "";
	$("input[name='amenity_chbx']:checked").each( function() //get selected amenities
	{
		slectedAmenities = slectedAmenities + "_" + $(this).val();
	});
	
	//if amenities are selected remove first character("_")
	if( !empty(slectedAmenities) )
	{
		slectedAmenities = slectedAmenities.substring(1, slectedAmenities.length);
	}
	//if no amenities selected
	else
	{
		if( IS_FILTER_ALREADY_APPLIED )//if filter already applied send request to get all hotel items
		{
			slectedAmenities = "all";
		}
		else
		{
			return;//otherwise display already displayed items
		}
	}
	
	$("#amenityFilterLink").removeClass("CDrop");
	$("#amenityFilterLink").addClass("CDrop2");
	var params = "filterType=amenityFilter&pdct=HTL&view=listView&filterAmenities=" + slectedAmenities;//send amenity filter request
	doAjax("FilterController", params, filterCallBack, "", "json");
	$("#amenityFilterOverlay").hide();
}

//clear amenity filter
function clearAmenityFilter(){
	if( IS_FILTER_ALREADY_APPLIED )//if filter already applied send request to display all items
	{
		slectedAmenities = "all";
		$("input[name='amenity_chbx']:checked").each(function(){
			$(this).attr("checked",false);
		});
	}
	
	//if filter already not applied display already displayed items
	else
	{
		 $("#amenityFilterOverlay").hide();
		return;
	}
	$("#amenityFilterLink").removeClass("CDrop2");
	$("#amenityFilterLink").addClass("CDrop");
	var params = "filterType=amenityFilter&pdct=HTL&view=listView&filterAmenities=" + slectedAmenities;
	doAjax("FilterController", params, filterCallBack, "", "json");
	$("#amenityFilterOverlay").hide();
}

//callback function for hotel filtering
function filterCallBack( data, div )
{
	IS_FILTER_ALREADY_APPLIED = true;
	var status = data["status"];
	
	//if filtering success display updated hotels
	if(status == SUCCESS)
	{
		isNoresults=false;
		viewUpdatedHotels();
	}
	//if filtering not success display no results message
	else 
	{
		isNoresults=true;
		showNoResultsMsg("hotelList");
		$("#hotelMapDiv").hide();
		$("#updatedHotels").hide();
	}
}

//display updated hotels
function viewUpdatedHotels(){
	var param="itemId="+$("#itemId").val()+"&altType="+$("#altType").val()+"&itemPrice="+ALREDY_SELECTED__ITEM_PRICE;	
	$("#noResultsDiv").hide();
	if(isMapLoaded==true){
		$("#hotelMapDiv").show();
	}
	else{
		$("#updatedHotels").show();
	}
	doAjax("jsp/hotel/updatedHotels.jsp", param, displayUpdatedItems, "updatedHotels", "");
}

//display no results message
function showNoResultsMsg(div){
	$("#noResultsDiv").show();
}

//hotel star filtering function
function initStarFilter(){
	$('ul.starFiltering').each(function(){
	    // For each set of tabs, we want to keep track of which tab is active and it's associated content
	    var active, content, links = $(this).find('a');

	    // If the location.hash matches one of the links, use that as the active tab.
	    // If no match is found, use the first link as the initial active tab.
	    active = $(links.filter('[href="'+location.hash+'"]')[0] || links[0]);
	    $('#'+(active).attr('id')+' img').each(function() {
        	$(this).attr('src',"images/"+(active).attr('id')+"_selected.png");
        });
	    content =getRelativeHref((active).attr('href'));

	    // Bind the click event handler
	    $(this).on('click', 'a', function(e){	    	
	    	$('#hotelMapDiv').hide();
	    	$('#updatedHotels').show();
	    	$("#amenityFilterOverlay").hide();
	    	
	    	// Make the old tab inactive. change to not active image
	       // $('#'+(active).attr('id')+' img').each(function() {
	        $("a[id='"+(active).attr('id')+"']"+' img').each(function() {
	        //	$(this).attr('src',"images/"+(active).attr('id')+".png");
	        	$(this).attr('src',"images/"+(active).attr('id')+".png");	
	        	
	        });
	        $(content).show();

	        // Update the variables with the new link and content
	        active = $(this);
	        content = getRelativeHref($(this).attr('href'));

	        // Make the selected tab active. change to active image
	        $("a[id='"+(active).attr('id')+"']"+' img').each(function() {
	        	$(this).attr('src',"images/"+(active).attr('id')+"_selected.png");
	        });
	       // $(content).hide();

	        // Prevent the anchor's default click action
	        e.preventDefault();
	    	
	    	var id = $(this).attr('id');
			id = id.split("_");
			
			//send filter request
			var param = "filterType=starFilter&rating=" + id[1] + "&view=listView&pdct=HTL";
			doAjax("FilterController", param , filterCallBack, "result", "json", false);
	       
	    });
	});
}

//bind hotel sort events	
function initSorter(){
	$('ul.hotelSort').each(function(){
	    // For each set of tabs, we want to keep track of  which tab is active and it's associated content
	    var active, links = $(this).find('a');

	    // If the location.hash matches one of the links, use that as the active tab. 
	    // If no match is found, use the first link as the initial active tab.
	    active = $(links.filter('[href="'+location.hash+'"]')[0] || links[0]);
	    active.parent().addClass('SelectSubTb');
	  
	    // Bind the click event handler
	    $(this).on('click', 'a', function(e){
	        // Make the old tab inactive.
	        active.parent().removeClass('SelectSubTb');
	        
	        // Update the variables with the new link and content
	        active = $(this);
	      
	        // Make the tab active.
	        active.parent().addClass('SelectSubTb');
	       
	        // Prevent the anchor's default click action
	        e.preventDefault();
	        
	        doSorting($(this).attr('id'));//send sort request
	    });
	});
}

//send hotel sort request
function doSorting(id)
{	
	var pieces = id.split("_");
	code = pieces[1];   // popular , priceDes , priceAsc ,rating
	
	var des = "false";
	if( pieces[2] == "des" )
	{
		des = "true";
	}
	var params = "sortType=" + code + "&des=" + des;
	doAjax("SortController", params, sortingCallBack, "", "json");

}

//callback function for hotel sort
function sortingCallBack( data, div )
{
	IS_SORT_ALREADY_APPLIED=true;
	var status = data["status"];
	if(status == SUCCESS)//if hotel sorting success display updated items
	{
		viewUpdatedHotels();
	}
	else //if hotel sorting not success display error message
	{
		replaceExistingResult( '<p>Error in hotel sorting</p>', div );
	}
}	

//callback function for view hotel detail view
function displayHotelDetailViewCallback(data,div){
	$("#allItems").hide();
	 replaceExistingResult( data, div );	 
	 initHotelTabs();
	 
	 //if items are available change the 'Room' heading padding
	 var isRadioExists = $('.HotRadio').length;
	 var isCallLinkExists =$('.call-link').length;
	 if (isCallLinkExists == undefined || isCallLinkExists < 1) {
		 
		if ( isRadioExists!=undefined && isRadioExists > 0) {
//			$('.room-col-heading-lbl').css('padding-left', '23px');
		}
	}
 	 else if (isCallLinkExists != undefined && isCallLinkExists > 0) {
		if ( isRadioExists!=undefined && isRadioExists > 0) {
			$('.HotRadio').css('width', '80px');
		} else {
			$('.HotRadio').css('width', '80px');
		}
	}
	
		
	 
	 bindPhotoTabEvents();
	 loadChangeDate();
	 $(".blockOverlay").unbind('click');
	 $(".blockOverlay").bind("click",function(){
		 if ($("#allItems").html() == "") { 
				var altType=CLICKED_ITEM_ID.split("-")[3];
				if(altType=="CRSSL"){
					var newId=$("#currentItemId").val();
					var param = "itemId=" + newId + "&altType=CRSSL";
					doAjax("jsp/result/threeResultList.jsp", param, displayThreeResults, null, null);
				}
				$(".blockPage").removeAttr("style");
				$.unblockUI();	
			} 
			else {
				$(".blockPage").removeAttr("style");
				displayAllItemsPopUp();//if the item was shown from allitems popup it will be displayed
			}
			$("#detailItem").html(""); 
	 });
	 //bind close button function
	 $("#detailViewCloseButton").unbind('click');
	 $("#detailViewCloseButton").bind("click", function() {
		if ($("#allItems").html() == "") { 
			var altType=CLICKED_ITEM_ID.split("-")[3];
			if(altType=="CRSSL"){
				var newId=$("#currentItemId").val();
				var param = "itemId=" + newId + "&altType=CRSSL";
				doAjax("jsp/result/threeResultList.jsp", param, displayThreeResults, null, null);
			}
			$(".blockPage").removeAttr("style");
			$.unblockUI();	
		} 
		else {
			$(".blockPage").removeAttr("style");
			displayAllItemsPopUp();//if the item was shown from allitems popup it will be displayed
		}
		$("#detailItem").html("");
	});
	 
	 
	 
	 //bind hotel more details link function
	 $("#htlMoreDetail").bind("click", function() {
		$("#hotelOverviewLink") .trigger("click");//display overview tab
	});
	 
	 $(".blockPage").removeAttr("style");
//	 var eleId = $('#detailItem').find(".popouter");
	 $(".blockPage").removeAttr("style");
	 $(".blockPage").attr("style",updateBlockUIStyle("addHotelPopup"));
	 bindAddHotelFunctions();
	 renderImages();
}

//bind add hotel popup tabs functions
function initHotelTabs(){
	$('ul.addHotelTabs').each(function(){
	    // For each set of tabs, we want to keep track of which tab is active and it's associated content
	    var active, content, links = $(this).find('a');

	    // If the location.hash matches one of the links, use that as the active tab.
	    // If no match is found, use the first link as the initial active tab.
	    active = $(links.filter('[href="'+location.hash+'"]')[0] || links[0]);
	    active.parent().addClass('NSelect');
	    content = getRelativeHref(active.attr('href'));

	    // Hide the remaining content
	    links.not(active).each(function () {
	    	$(getRelativeHref($(this).attr('href'))).hide();
	    });

	    // Bind the click event handler
	    $(this).on('click', 'a', function(e){
	        // Make the old tab inactive.
	       active.parent().removeClass('NSelect');
	       $(getRelativeHref((active.attr('href')))).hide();

	        // Update the variables with the new link and content
	       active = $(this);
	       content = getRelativeHref($(this).attr('href'));

	        // Make the tab active.
	        active.parent().addClass('NSelect');
		     $(content).show();
		     
	        // Prevent the anchor's default click action
	        e.preventDefault();
	        
	        if(getRelativeHref($(this).attr('href'))=="#addHotelMap"){
		    	 loadMap($("#latitude").val(), $("#longitude").val());
		     }
	    });
	});
}

//bind add a hotel popup functions
function bindAddHotelFunctions()
{
	//bind add a hotel view all link functions
	$("#addHotel-viewAll").unbind('click');
	$("#addHotel-viewAll").bind("click", function() {
		//if the popup was not loaded from allitems popup load allhotels popup and display
		if ($("#allItems").html() == "") {
			
			if(screen.width==1024 & screen.height== 768){
				$.blockUI({ message: $('#allItems') ,centerX: false,css: { width:'auto',left:'5%', top:'2%' } ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
			}else{
				$.blockUI({ message: $('#allItems') ,centerX: false,css: { width:'auto',left:'15%', top:'10%' } ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
			}
			 
			 var searchType=$("#altType").val();
			 var itemId=$("#itemId").val();
			 var param="altType="+searchType+"&itemId="+itemId;
			 doAjax("jsp/hotel/allHotels.jsp", param, displayAllHotels, "allItems", "");
		} 
		
		//if the popup was loaded from allitems popup display all items popup
		else {
			displayAllItemsPopUp();			
		}
		 $("#detailItem").html("");
	});
		
	//bind previous hotel lnk function
	$("li[id^='previousHtl-']").unbind('click');
	$("li[id^='previousHtl-']").bind("click", function() {
		var searchType=$("#altType").val();
		var itemId=$("#itemId").val();
		var param="altIndex="+$(this).attr('id').split("-")[1]+"&searchType="+searchType+"&itemId="+itemId;
		doAjax("jsp/hotel/addAHotel.jsp", param, displayHotelDetailViewCallback, "detailItem", "");
	});
	
	//bind next hotel link function
	$("li[id^='nextHtl-']").unbind('click');
	$("li[id^='nextHtl-']").bind("click", function() {
		var searchType=$("#altType").val();
		var itemId=$("#itemId").val();
		var param="altIndex="+$(this).attr('id').split("-")[1]+"&searchType="+searchType+"&itemId="+itemId;
		doAjax("jsp/hotel/addAHotel.jsp", param, displayHotelDetailViewCallback, "detailItem", "");
	});
	
	//bind other links functions
	changeRoomFunctions();
	
}

//bind rooms related functions in add a hotel popup
function bindRoomFunctions(){
	//paging functionality
	initPaging();	
	
	//display suuplements and discounts and change room price when room radio button is clicked
	$("input[id^='roomSet-']").unbind('click');
	$("input[id^='roomSet-']").bind("click", function() {		
		displaySupplementsAndDiscounts($(this).attr('id'));
		changeRoomPrice(this);
	});
	
	//display call popup for onrequest rooms
	$("span[id^='call-']").unbind('mouseenter mouseleave');
	$("span[id^='call-']").hover(function(e) {
		var position = $(this).position();
		var topVal = position.top + 15;
		var leftVal = position.left - 35;
		showOverlay($("div[id='hotelAvailabilityPoup']"), leftVal, topVal, 9000);
	}, function() {
		$("div[id='hotelAvailabilityPoup']").hide();
	});
	
	//display room details popup when clicked on room name
	$("a[id^='roomName-']").unbind('click');
	$("a[id^='roomName-']").bind("click", function() {
		var idSplit=$(this).attr('id').split("-");
		var position = $(this).position();
		var topVal = position.top+20;
		var leftVal = $("#rommsDiv").position().left+5;
			
		$("div[id^='roomDetailPopUp-']").hide();				
		$("div[id='roomDetailPopUp-"+idSplit[1]+"-"+idSplit[2]+"']").css('position', "absolute");
		$("div[id='roomDetailPopUp-"+idSplit[1]+"-"+idSplit[2]+"']").css('display', "");
		$("div[id='roomDetailPopUp-"+idSplit[1]+"-"+idSplit[2]+"']").css('left', (leftVal));
		$("div[id='roomDetailPopUp-"+idSplit[1]+"-"+idSplit[2]+"']").css('z-index', "99999");	
		$("div[id='roomDetailPopUp-"+idSplit[1]+"-"+idSplit[2]+"']").show();

	//	showOverlay($("div[id='roomDetailPopUp-"+idSplit[1]+"-"+idSplit[2]+"']"), leftVal, topVal, 9000);
		
		//bind room details popup close button function
		$("img[id='roomDetailCloseButton-"+idSplit[1]+"-"+idSplit[2]+"']").unbind('click');
		$("img[id='roomDetailCloseButton-"+idSplit[1]+"-"+idSplit[2]+"']").bind("click", function() {
			$("div[id='roomDetailPopUp-"+idSplit[1]+"-"+idSplit[2]+"']").hide();
		});
		
		selecedtRoomId =  $(this);
	});
	$(window).resize(function() {
		if(( $(".roomdetl").is(":visible")) && selecedtRoomId != null ){
			var idSplit=$(selecedtRoomId ).attr('id').split("-");
			var position = $(selecedtRoomId ).position();
			var topVal = position.top+20;
			var leftVal = $("#rommsDiv").position().left+5;
				
			$("div[id^='roomDetailPopUp-']").hide();			
			$("div[id='roomDetailPopUp-"+idSplit[1]+"-"+idSplit[2]+"']").css('position', "absolute");
			$("div[id='roomDetailPopUp-"+idSplit[1]+"-"+idSplit[2]+"']").css('display', "");
			$("div[id='roomDetailPopUp-"+idSplit[1]+"-"+idSplit[2]+"']").css('left', (leftVal));
			$("div[id='roomDetailPopUp-"+idSplit[1]+"-"+idSplit[2]+"']").css('z-index', "99999");	
			$("div[id='roomDetailPopUp-"+idSplit[1]+"-"+idSplit[2]+"']").show();		
			//showOverlay($("div[id='roomDetailPopUp-"+idSplit[1]+"-"+idSplit[2]+"']"), leftVal, topVal, 9000);
			
			//bind room details popup close button function
			$("img[id='roomDetailCloseButton-"+idSplit[1]+"-"+idSplit[2]+"']").unbind('click');
			$("img[id='roomDetailCloseButton-"+idSplit[1]+"-"+idSplit[2]+"']").bind("click", function() {
				$("div[id='roomDetailPopUp-"+idSplit[1]+"-"+idSplit[2]+"']").hide();
			});
		}
	});
	
	$("input[id='roomSet-"+$("#selectedAlternative").val()+"']").attr("checked","checked");//set selected alternative result index to the hidden field
	
}

//load hotel location map
function loadMap(hotelLat, hotelLon) {
	//if location details not available display a message
	if (hotelLat == "" || hotelLon == "") {
		$("#hotelLocationMap").empty();
		$("#hotelLocationMap").append("<p>Location details not available</p>");
	} 
	
	//if location details available load map
	else {
		var latlng = new google.maps.LatLng(hotelLat, hotelLon);
		var mapOptions = {
			disableDefaultUI : false,
			center : latlng,
			zoom : DEFAULT_SOOM_LEVEL,
			maxZoom : MAX_ZOOM_LEVEL,
			minZoom : MIN_ZOOM_LEVEL,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(document.getElementById("hotelLocationMap"), mapOptions);
		var marker = new google.maps.Marker({
			position : latlng,
			map : map
		});
		marker.setMap(map);
	}
}

//bind photo tab related functions
function bindPhotoTabEvents()
 {
	//display the large image when clicked on thumb image
	$("img[id^='thumbImage-']").unbind('click');
	$("img[id^='thumbImage-']").bind('click', function() {
		var src = $(this).attr("src");
		$("#mainImage").attr("src", src);		
		$("img[id^='thumbImage-']").each( function() 
		{
			$(this).addClass("ImgNonSel");
		});
		$(this).removeClass("ImgNonSel");
	});
}

//display supplements and discounts according to the selected room
function displaySupplementsAndDiscounts(id){
	var idSplit=id.split("-");	
	$("div[id^='supps-']").hide();
	$("div[id='supps-"+idSplit[1]+"']").show();
	$("div[id='roomSupps']").append($("div[id='supps-"+idSplit[1]+"']"));
	$("div[id^='discounts-']").hide();
	$("div[id='discounts-"+idSplit[1]+"']").show();
	$("div[id='roomDiscounts']").append($("div[id='discounts-"+idSplit[1]+"']"));
	$("#selectedAlternative").val(idSplit[1]);
}

//paging request for hotel room list
function sendpagingRequest(param, div) {
	doAjax("jsp/hotel/hotelRoomList.jsp", param, pagingCallback, div, null);
}

//callback function for rooms list paging
function pagingCallback(data,div){
	replaceExistingResult(data, div);
	
	//display page list and hide more combinations link
	$("div[id='paging']").show();
	$("div[id='moreCombinations']").hide();
	
	//display discounts and supplements
	if(	$("input[id='roomSet-"+$("#selectedAlternative").val()+"']").length!=0 || $("span[id='call-"+$("#selectedAlternative").val()+"']").length!=0){
		$("div[id='roomSupps']").empty();
		$("div[id='roomDiscounts']").empty();
	}
	
	var selectedAlt=$("#selectedAlternative").val();
	$("div[id^='supps-']").hide();
	$("div[id='supps-"+selectedAlt+"']").show();
	$("div[id='roomSupps']").append($("div[id='supps-"+selectedAlt+"']"));
	$("div[id^='discounts-']").hide();
	$("div[id='discounts-"+selectedAlt+"']").show();
	$("div[id='roomDiscounts']").append($("div[id='discounts-"+selectedAlt+"']")); 
	
	bindRoomFunctions();	//bind room functions
}

//selected hotel related functions
function initSelectedHotel(){
	//bind change room link function
	$("div[id^='changeRoom-']").unbind('click');
	$("div[id^='changeRoom-']").bind("click", function() {
		CLICKED_ITEM_ID=$(this).attr('id');
		var idSplit=$(this).attr('id').split("-");
		var searchType=idSplit[1];
		var itemId=idSplit[2];
		
		 var style = updateBlockUIStyle("changeRoomPopup");
		if(screen.width==1024 & screen.height== 768){
			$.blockUI({ message: $('#detailItem') ,centerX: false,css: { width:'auto',left:'3%', top:'7%' } ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
		}else{
			$.blockUI({ message: $('#detailItem') ,centerX: false,css: { width:'auto',left:'12.5%', top:'10%' } ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
		}
		
		var param="searchType="+searchType+"&itemId="+itemId;		
		doAjax("jsp/hotel/changeRoom.jsp", param, changeRoomCallBack, "detailItem", "");
	});	
	
	//bind add extras funxtion
	$("div[id^='addExtras-']").unbind('click');
	$("div[id^='addExtras-']").bind("click", function() {
		CLICKED_ITEM_ID=$(this).attr('id');
		var idSplit=$(this).attr('id').split("-");
		var searchType=idSplit[1];
		var itemId=idSplit[2];
		
		if(screen.width==1024 & screen.height== 768){
			$.blockUI({ message: $('#detailItem') ,centerX: false,css: { width:'auto',left:'3%', top:'7%' } ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
		}else{
			$.blockUI({ message: $('#detailItem') ,centerX: false,css: { width:'auto',left:'12.5%', top:'10%' } ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
		}
		
		var param="searchType="+searchType+"&itemId="+itemId;
		doAjax("jsp/hotel/changeRoom.jsp", param, changeRoomCallBack, "detailItem", "");
	});	
}

//callback function for change room
function changeRoomCallBack(data,div){
	replaceExistingResult(data, div);	
	initHotelTabs();
	bindPhotoTabEvents();
	
	//bind detail view close button function
	$("#detailViewCloseButton").unbind('click');
	$("#detailViewCloseButton").bind("click", function() {
		$.unblockUI();			
		$("#detailItem").html("");
	});
	
	//bind detail view close function (outer space clicking)
	$(".blockOverlay").unbind('click');
	$(".blockOverlay").bind("click", function() {
		$.unblockUI();			
		$("#detailItem").html("");
	});
	
	//bind hotel more details link function
	$("#htlMoreDetail").bind("click", function() {
		$("#hotelOverviewLink") .trigger("click");
	});
	changeRoomFunctions();
	renderImages();
	
	$(".blockPage").removeAttr("style");
	$(".blockPage").attr("style",updateBlockUIStyle("changeRoomPopup"));
}
function changeRoomFunctions() {
	//bind add hotel button function
	$("div[id^='addHotelBtn-']").unbind('click');
	$("div[id^='addHotelBtn-']").bind("click", function() {
		IS_FILTER_ALREADY_APPLIED = false;
		IS_SORT_ALREADY_APPLIED = false;
		selectAlternativeItem($(this), 'hotel');
	});

	//bind more combinations link function
	$("div[id='moreCombinations']").unbind('click');
	$("div[id='moreCombinations']").bind("click", function() {
		$("li[id='pagingOther2']").click();
	});

	var selectedAlt = $("#selectedAlternative").val();//selected alternative index

	//display room supplements and discounts
	$("div[id^='supps-']").hide();
	$("div[id='supps-" + selectedAlt + "']").show();
	$("div[id='roomSupps']").append($("div[id='supps-" + selectedAlt + "']"));
	$("div[id^='discounts-']").hide();
	$("div[id='discounts-" + selectedAlt + "']").show();
	$("div[id='roomDiscounts']").append($("div[id='discounts-" + selectedAlt + "']"));
	
	bindRoomFunctions();//bind rooms related functions
}

//change room price when room radio button is clicked
function changeRoomPrice(element){
	//when radio button is clicked that means its a available one. therefore hide the callto book div and display add to trip utton
	//$("#callToBookDiv").hide();
	$("#addToTripButton").show();
	
	var newPrice = 0.00;
	var currentIndex;
	var currentPrice = 0.00;
	var selectedAltIndex = $(element).attr('id').split("-")[1];
	var selectedPrice = parseFloat($("input[id='hotelPrice-" + selectedAltIndex + "']").val());
	
	//change price of each hotel
	$("span[id^='roomPrice-']").each(function() {
		currentIndex = $(this).attr('id').split("-")[1];
		currentPrice = parseFloat($("input[id='hotelPrice-" + currentIndex + "']").val());
		if (currentPrice >= selectedPrice) {
			newPrice = currentPrice - selectedPrice;
			$(this).text("+ $" + newPrice.toFixed(2));
		} 
		else {
			newPrice = selectedPrice - currentPrice;
			$(this).text("- $" + newPrice.toFixed(2));
		}
	});

	$("span[id='roomPrice-" + selectedAltIndex + "']").text("Included");
}
