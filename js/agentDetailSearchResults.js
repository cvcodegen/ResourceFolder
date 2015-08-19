/**
 * This script is used to bind button events in agentDetailSearchResults.jsp
 * 
 */
$(document).ready(function() {
	initBookingDetails();
	$(document).idleTimeout({redirect_url: 'agentlogin'});
	initSupplierDescription();
});

/**
 * Init booking details fucntion 
 * @return
 */
function initBookingDetails() {
	/**
	 * Trigger back button to agent search page.
	 */
	$("#bookingDetailsBack").click(function() {
		// REDIRECT URL
			var url = "agentBookingSearch;jsessionid=" + $("#sid").val();
			var temp = encodeURI(url);
			$(location).attr('href', temp);
			return true;
		});

	/**
	 * View the agent details
	 */
	$("#bookingDetailsAgentDetails").click(function() {
		// REDIRECT URL
			var url = "getAgentDetails;jsessionid=" + $("#sid").val();
			var temp = encodeURI(url);
			$(location).attr('href', temp);
			return true;
		});

}

//bind display and hide the about supplier popup
function initSupplierDescription(){
	$("div[id^='fullDescriptionTrp-']").unbind('hover');
	$("div[id^='fullDescriptionTrp-']").hover(function(e) {
		var itemId = $(this).attr("id").split("-")[1];
		showItemDetails(e,$(this), itemId);
	}, function() {
		var itemId = $(this).attr("id").split("-")[1];
		hideItemDetails($(this), itemId);
	});	
}

// display the about item popup
function showItemDetails(e,obj, itemId) {
	var element=$("div[id='fullDescriptionPopUpTrp" + "-" + itemId + "']");
	element.css('z-index', 9000);
	element.css('position', "absolute");
	element.show();
}

//hide the about item popup
function hideItemDetails(obj, itemId) {
	$("div[id='fullDescriptionPopUpTrp" + "-" + itemId + "']").hide();
}

