/**
 * Javascript functionalities related to package results page
 */
$(document).ready(function()
{
	initResults();
	$(document).idleTimeout();
});

//package results related init functions
function initResults() {
	storedPackageSubmit(); //bind add to trip button function
	initPaging(); //paging
	openTaxesAndFeesToolTip(); //bind taxes and tools popup
	initRightSideBasket();
}

//send paging request
function sendpagingRequest(param, div) {
	doAjax("jsp/package/packageResultsList.jsp", param, packageResultCallBack, div, null);
}

//callback function for paging
function packageResultCallBack(data, div) {
	replaceExistingResult(data, div);
	initResults();
}

//bind package submit button
function storedPackageSubmit() {
	$("div[id*='packageId-']").click( function() {
		blockInMiddle("waitingAnimation");
		var id = $(this).attr("id").split("-")[1];
		window.location.href =  getBaseUrl() +"yourTrip;jsessionid=" + $("#sid").val() + "?packageId=" + id + "&ts=" +  new Date().getTime();
	});
}

//bind taxes and fees popup
function openTaxesAndFeesToolTip(){
	$("span[id^='taxesAndFees-']").hover(function(event) {
		var packageId = $(this).attr("id").split("-")[1];
		mouseEnterAnchor($(this), packageId,event);
	}, function() {
		var packageId = $(this).attr("id").split("-")[1];
		mouseLeaveAnchor($(this), packageId);
	});
}

//display taxes and fees popup
function mouseEnterAnchor(obj, idVal, event) {
	var position = obj.position();

	var p = obj.position();
	$("span[id='taxesAndFeesPopUp-" + idVal + "']").css('position', "absolute");
	$("span[id='taxesAndFeesPopUp-" + idVal + "']").css('display', "");
	$("span[id='taxesAndFeesPopUp-" + idVal + "']").css('left', ( p.left - 160 +'px'));
	$("span[id='taxesAndFeesPopUp-" + idVal + "']").css('z-index', "99999");

//	var topVal = obj.offset().top+32;
//	var leftVal = obj.offset().left - 190;
//	showOverlay($("span[id='taxesAndFeesPopUp-" + idVal + "']"), leftVal, topVal,9000);
}

//hide taxes and fees popup
function mouseLeaveAnchor(obj, idVal) {
	$("span[id='taxesAndFeesPopUp-" + idVal + "']").attr("style", "display:none;");
}