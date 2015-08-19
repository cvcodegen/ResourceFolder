/**
 * Javascript functionalities related to transport results page
 */
$(document).ready(function()
{
	initTrpResults();
	$(document).idleTimeout();
	mouseHoverAdded();
	initRightSideBasket();
});

function initTrpResults()
{
	$("div[id^='TRPALT']").unbind("click");
	$("div[id^='TRPALT']").bind("click", function ()
	{
		var idSplit = $(this).attr("id").split("-");
	//	$.blockUI({ message: $('#selectTrpLoader') ,centerX: false,css: { width:'auto',left:'30%', top:'10%' } ,overlayCSS:  { backgroundColor: '#000', opacity: "0.5" }});
		blockInMiddle("selectTrpLoader");

		var upgradeIndex = idSplit[2];
		var params = "selectAlt=true";
	    params += "&itemResIndex=" + idSplit[1];
	    params += "&upgrade-" + idSplit[1] + "=" + upgradeIndex;
		doAjax("UpdateController", params, trpSelectCallback, null, "json");
	});
}

function trpSelectCallback(data, div)
{
	$("#selectTrpLoader").hide();
	$.unblockUI();
	var status = data["status"];
	if (status == SUCCESS)
	{
		window.location.href =  getBaseUrl() +"yourTrip;jsessionid=" + $("#sid").val() + "?ts=" +  new Date().getTime();
	}
	else
	{
		displayMessage(null, data["status"], data["msg"], data["data"]);
		addingMargingTopS();
		addingMargingTopShpBskt();
	}
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
}