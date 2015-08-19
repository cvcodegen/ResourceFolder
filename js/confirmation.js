/**
 * Jacascripts related to confirmation page.
 * 
 * @author madhawa
 * */

$(document).ready(function() {
	initConfirmationPage();
	initRightSideBasket();
});

function initConfirmationPage()
{
	initConfirmationSupplierDescription();
	renderImages();
	$("#printBtn").unbind("click");
	$("#printBtn").click(function(){
		window.print();
	});
	$("#taxAndFees").unbind('hover');
	$("#taxAndFees").hover(function(event) {
		shoSupp();
	}, function() {
		$('#supplimentList').hide();		
	});
	
	$("p[id^='gcDownldLink_']").unbind("click");
	$("p[id^='gcDownldLink_']").click(function(){
		var itemNum=$(this).attr("id").split("_")[1];
		var bookingid=$("#bookingId").val();
		var myurl = getBaseUrl() + "GiftCardGenerator";		
		var win=window.open(myurl+"?bookingID="+bookingid+"&itemNum="+itemNum, '_blank');
		  win.focus();

	});

}


function initConfirmationSupplierDescription()
{	
	$("div[id^='fullDescriptionTrp-']").unbind('hover');
	$("div[id^='fullDescriptionTrp-']").hover(function(e) {
		var itemId = $(this).attr("id").split("-")[1];				
		showConfirmationItemDetails(e,$(this), itemId, 'Trp');
	}, function() {
		var itemType = $(this).attr("id").split("-")[1];		
		hideConfirmationItemDetails($(this), itemType, 'Trp');
	});
	$("div[id^='fullDescriptionHtl-']").unbind('hover');
	$("div[id^='fullDescriptionHtl-']").hover(function(e) {
		var itemId = $(this).attr("id").split("-")[1];
		showConfirmationItemDetails(e,$(this), itemId, 'Htl');
	}, function() {
		var itemId = $(this).attr("id").split("-")[1];
		hideConfirmationItemDetails($(this), itemId, 'Htl');
	});
	$("div[id^='fullDescriptionAct-']").unbind('hover');
	$("div[id^='fullDescriptionAct-']").hover(function(e) {
		var itemId = $(this).attr("id").split("-")[1];
		showConfirmationItemDetails(e,$(this), itemId, 'Act');
	}, function() {
		var itemId = $(this).attr("id").split("-")[1];
		hideConfirmationItemDetails($(this), itemId, 'Act');
	});
}

function showConfirmationItemDetails(e,obj, itemId, itemType) {
	var element=$("div[id='fullDescriptionPopUp" + itemType + "-" + itemId + "']");
	element.css('z-index', 9000);
	element.css('position', "absolute");
	element.show();
/*	
	var position = obj.position();
	var topVal = position.top+40;
	var leftVal = position.left-10;
	showOverlay($("div[id='fullDescriptionPopUp" + itemType + "-" + itemId + "']"), leftVal, topVal,
				9000);*/
}

function hideConfirmationItemDetails(obj, itemId,itemType) {
	$("div[id='fullDescriptionPopUp" + itemType + "-" + itemId + "']").hide();
}

function shoSupp(){
	
	p = $('#taxAndFees').position();
	
	$('#supplimentList').css('position', "absolute");
	$('#supplimentList').css('display', "");
	$('#supplimentList').css('top',( p.top + 25+'px') );
	$('#supplimentList').css('left', ( p.left- 165 +'px'));
	
}