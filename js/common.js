var SUCCESS = 1;
var ERROR = -1;
var WARNING = 0;
var NO_RESULT_FROM_FILTER = 1000;
var INFORMATION = 300;
var ADD_TO_BASKET = 400;
var ADD_TO_BASKET = 400;
var AMINATION_SLIDE_DOWN = "SD";
var AMINATION_FADE_IN = "FI";
var PAGE_VERSION = "pv";
var browserType = navigator.userAgent;
var currentOrientation = "";
var currentScreenWidth = 0;
var browserName = null ;

$(document).ready(function() {
	shoppingBasketContinue();
	initBackBtn();
	renderImages();
	clearCache();
	initWindowResize();
	warningMessageTop();
	BrowserDetect.init();
	browserName = BrowserDetect.Browser;
});

/**
 * used to send ajax request to the given url
 *
 * @param url
 *            url for the servlet or jsp
 * @param param
 *            parameters in the format "name=John&location=Boston"
 * @param successMethod
 *            method to execute when the ajax method returns success status.
 * @param div
 *            id of the div, of which the content should be replaced.
 */
function doAjax(url, param, successMethod, div, dType) {
	url = getBaseUrl() + url;
	if (!dType) {
		dType = "html";
	}
	if (param == "") {
		param = "ts=" + new Date().getTime();
	} else {
		param = param + "&ts=" + new Date().getTime();
	}

	url += ";jsessionid=" + $("#sid").val();
	$.ajax({
		type : "POST",
		url : url,
		data : param,
		dataType : dType,
		timeout : 1800000,
		success : function(data) {
			successMethod(data, div);
		},
		error : function(err, status, errTh) {
			unblockUi();
			// timeout
			// if(status === "timeout")
			// {
			// displayMessage(null, ERROR, TIME_OUT_ERROR, TIME_OUT_ERROR_DESC);
			// }
			// else
			// {
			// //This was done to avoid the error message displaying in the
			// start
			// page without a proper reason
			// if(browserType.indexOf("MSIE 7.0") < 0)
			// {
			// displayMessage(null, ERROR, TIME_OUT_ERROR, "");
			// }
			// }
		}
	});

}

/**
 * used to send ajax request to the given url
 *
 * @param url
 *            url for the servlet or jsp with the base
 * @param param
 *            parameters in the format "name=John&location=Boston"
 * @param successMethod
 *            method to execute when the ajax method returns success status.
 * @param div
 *            id of the div, of which the content should be replaced.
 */
function doAjaxWithBase(url, param, successMethod, div, dType) {
	if (!dType) {
		dType = "html";
	}
	if (param == "") {
		param = "ts=" + new Date().getTime();
	} else {
		param = param + "&ts=" + new Date().getTime();
	}

	url += ";jsessionid=" + $("#sid").val();
	$.ajax({
		type : "POST",
		url : url,
		data : param,
		dataType : dType,
		timeout : 1800000,
		success : function(data) {
			successMethod(data, div);
		},
		error : function(err, status, errTh) {
			unblockUi();
			// timeout
			// if(status === "timeout")
			// {
			// displayMessage(null, ERROR, TIME_OUT_ERROR, TIME_OUT_ERROR_DESC);
			// }
			// else
			// {
			// //This was done to avoid the error message displaying in the
			// start
			// page without a proper reason
			// if(browserType.indexOf("MSIE 7.0") < 0)
			// {
			// displayMessage(null, ERROR, TIME_OUT_ERROR, "");
			// }
			// }
		}
	});

}

/**
 * Used to change price in a location given by id. This function has been
 * centralized and can be used in any place in the web
 *
 * @param price
 * @param id
 * @return
 */
function changePrice(price, id) {
	$(id).html(formatPrice(price));
}

/**
 * Formats price
 *
 * @param price
 * @return
 */
function formatPrice(price) {
	price = parseFloat(price);
	return price.toFixed(2);
}

/**
 * Displays the message from the given data
 *
 * @param data
 * @param p_status
 * @param p_message
 * @param p_desc
 * @return
 */
function displayMessage(data, p_status, p_message, p_desc) {
	var id = createMessages(data, p_status, p_message, p_desc);
	var obj = $("#" + id);
	obj.show();

	scrollView(id);
}

/**
 * Creates the message box from the given data.
 *
 * @param data
 *            JSON object
 * @param p_status
 * @param p_message
 * @param p_desc
 * @return Id of the created message box
 */
function createMessages(data, p_status, p_message, p_desc) {

	var status = null;
	var message = null;
	var desc = null;

	if (!emptyExcludeZero(data)) {
		var msg = data["obj"];
		if (msg) {
			status = msg.successStatus;
			message = msg.message;
			desc = msg.desc;
		} else {
			status = data["status"];
			message = data["msg"];
			desc = data["data"];
		}
	} else {
		status = p_status;
		message = p_message;
		desc = p_desc;
	}

	var messageBox;
	var messageTextBox;
	var descBox;

	if (status == ERROR) {
		messageBox = $("#errorDialog");
		messageTextBox = $("#messageError");
		descBox = $("#descError");
	} else if (status == SUCCESS) {
		messageBox = $("#successDialog");
		messageTextBox = $("#messageSuccess");
		descBox = $("#descSuccess");
	} else if (status == INFORMATION) {
		messageBox = $("#informationDialog");
		messageTextBox = $("#messageInformation");
		descBox = $("#descInformation");
	} else if (status == ADD_TO_BASKET) {
		messageBox = $("#addToBasketDialog");
		messageTextBox = $("#messageAddToBasket");
		descBox = $("#descAddToBasket");
	} else if (status == NO_RESULT_FROM_FILTER) {
		messageBox = $("#informationDialog");
		messageTextBox = $("#messageInformation");
		descBox = $("#descInformation");
	}

	messageTextBox.html(message);
	descBox.html(desc);

	return messageBox.attr("id");
}

function scrollView(id) {
	if ($('#' + id) != null && $('#' + id).offset() != null) {
		$('html, body').animate({
			scrollTop : $('#' + id).offset().top
		}, 300);
	}
};

/*
 * this function is used to check the existence of an element @param mixed_var -
 * variable to be checked
 *
 * example 1: empty(null); returns : true example 2: empty(undefined); returns :
 * true example 3: empty([]); returns : true
 */
function empty(mixed_var) {
	if (!mixed_var
			|| mixed_var === ""
			|| mixed_var === 0
			|| mixed_var === "0"
			|| mixed_var === null
			|| mixed_var === false
			|| mixed_var === undefined
			|| ((typeof mixed_var == 'array' || typeof mixed_var == 'object') && mixed_var.length === 0)) {
		return true;
	}

	return false;
}

function emptyExcludeZero(mixed_var) {
	if (!mixed_var
			|| mixed_var === ""
			|| mixed_var === null
			|| mixed_var === false
			|| mixed_var === undefined
			|| ((typeof mixed_var == 'array' || typeof mixed_var == 'object') && mixed_var.length === 0)) {
		return true;
	}

	return false;
}

function initPaging() {
	/**
	 * Paging navigation
	 */
	$("li[id*='paging']").unbind("click");
	$("li[id*='paging']").click(function() {
		var queryString = $(this).attr('name');
		sendpagingRequest(queryString, 'result');
	});
	scrollTop();
}

function scrollTop() {
	$('html, body').animate({
		scrollTop : 0
	}, 450);
}

/**
 * used to replace the existing element content with a given content.
 *
 * @param data
 *            new context to be used.
 */
function replaceExistingResult(data, div) {
	$("#" + div).show();
	$("#" + div).html(data);
}

/**
 * show overlay div
 */
function showOverlay(element, posLeft, posTop, zIndex, animationType) {
	element.css('z-index', zIndex);
	element.css({
		position : "absolute",
		marginLeft : 0,
		marginTop : 0,
		top : posTop,
		left : posLeft
	});
	if (!empty(animationType)) {
		if (animationType === AMINATION_SLIDE_DOWN) {
			element.slideDown();
		} else if (animationType === AMINATION_FADE_IN) {
			element.fadeIn();
		} else {
			element.show();
		}
	} else {
		element.show();
	}
}

function left(obj) {
	return obj.offset().left;
}

function topT(obj) {
	return obj.offset().top;
}

function blockUi(div, top, left, position) {
	if (!position) {
		position = "fixed";
	}
//	$.blockUI({
//		message : $("#" + div),
//		centerX : false,
//		css : {
//			width : 'auto',
//			left : left + '%',
//			top : top + '%',
//			position : position
//		},
//		overlayCSS : {
//			backgroundColor : '#000',
//			'-moz-opacity': '0.50',
//			'-khtml-opacity': '0.50',
//			opacity : '0.5',
//			'-ms-filter':'progid:DXImageTransform.Microsoft.Alpha(Opacity=50)',
//			filter: 'progid:DXImageTransform.Microsoft.Alpha(opacity=50)',
//			filter: 'alpha(opacity=50)'
//		}
//	});
	$(".blockPage").removeAttr("style");
	$.blockUI({
		message : $("#" + div),
		centerX : true,
		onBlock : function() {
					$(".blockPage").removeAttr("style");
					$(".blockPage").attr("style",updateBlockUIStyle(div));
				  },
		overlayCSS : {
			backgroundColor : '#000',
			'-moz-opacity': '0.50',
			'-khtml-opacity': '0.50',
			opacity : '0.5',
			'-ms-filter':'progid:DXImageTransform.Microsoft.Alpha(Opacity=50)',
			filter: 'progid:DXImageTransform.Microsoft.Alpha(opacity=50)',
			filter: 'alpha(opacity=50)'
		},
		fadeIn:  1
	});

}

function blockUiSearchPopup(div) {
		position = "fixed";
	$(".blockPage").removeAttr("style");
	$.blockUI({
		message : $("#" + div),
		centerX : true,
		centerY : true,
//		css: {
//			padding:	0,
//			margin:		0,
//			width:		'30%',
//			top:		'15%',
//			left:		'30%',
//			//textAlign:	'center',
//			color:		'#000',
//			border:		'0px solid #aaa',
//			//backgroundColor:'#fff',
//			cursor:		'default'
//		},
		onBlock : function() {
			 		$(".blockPage").removeAttr("style");
					$(".blockPage").attr("style",updateBlockUIStyle("searchBannerPopup"));
				  },
		overlayCSS : {
			backgroundColor : '#000',
			'-moz-opacity': '0.50',
			'-khtml-opacity': '0.50',
			opacity : '0.5',
			'-ms-filter':'progid:DXImageTransform.Microsoft.Alpha(Opacity=50)',
			filter: 'progid:DXImageTransform.Microsoft.Alpha(opacity=50)',
			filter: 'alpha(opacity=50)'
		},
		fadeIn:  5
	});

}

function unblockUi() {
	$.unblockUI();
}

function replaceAll(str, find, replaceWith) {
	return str.replace(/find/g, "replace");
}

function getScreenWidth() {
	return $(window).width();
}

function getScreenHeight() {
	return $(window).height();
}

function getWidth(div) {
	return $("#" + div).width();
}

function getHeight(div) {
	return $("#" + div).height();
}

function blockInMiddle(divId) {
	var divWidth = getWidth(divId);
	var divHeight = getHeight(divId);
	var left = (((getScreenWidth() / 2) - (divWidth / 2)) * 100)
			/ getScreenWidth();
	var top = (((getScreenHeight() / 2) - (divHeight / 2)) * 100)
			/ getScreenHeight();

	blockUi(divId, top, left);
}
// new method for suppliments
function blockInMiddleSup(divId) {
	var divWidth = getWidth(divId);
	var divHeight = getHeight(divId);
	var left = (((getScreenWidth() / 2) - (divWidth / 2)) * 100)
			/ getScreenWidth();
	var top = (((getScreenHeight() / 2) - (divHeight / 2)) * 100)
			/ getScreenHeight();
	if (top < 0) {
		top = 0;
	}
	blockUi(divId, top, left, 'absolute');
}

function renderImages() {
	$(".required").on("error",function() {
		$(this).attr(
				"src",
				getBaseUrl()
						+ "images/image_not_available250x250.png");
	});
	
	
	$(".required175x96").on("error",function() {
		$(this).attr(
				"src",
				getBaseUrl()
						+ "images/image_not_available175x96.png");
	});	
	
	$(".required17596").on("error",function(){
		$(this).attr(
				"src",
				getBaseUrl()
						+ "images/image_not_available175x96.png");
	});
	$(".required80x70").on("error",function(){
		$(this).attr(
				"src",
				getBaseUrl()
						+ "images/image_not_available80x70.png");
	});
	$(".required200x142").on("error",function(){
		$(this).attr(
				"src",
				getBaseUrl()
						+ "images/image_not_available200x142.png");
	});
	$(".required216x250").on("error",function(){
		$(this).attr(
				"src",
				getBaseUrl()
						+ "images/image_not_available216x250.png");
	});
	$(".required238x175").on("error",function(){
		$(this).attr(
				"src",
				getBaseUrl()
						+ "images/image_not_available238x175.png");
	});
	$(".required248x140").on("error",function(){
		$(this).attr(
				"src",
				getBaseUrl()
						+ "images/image_not_available238x175.png");
	});
	$(".required200x150").on("error",function(){
		$(this).attr(
				"src",
				getBaseUrl()
						+ "images/image_not_available200x150.png");
	});
	$(".required242x182").on("error",function(){
		$(this).attr(
				"src",
				getBaseUrl()
						+ "images/image_not_available242x182.png");
	});
	
	
	//Deprecated method "error " hence commented the bellow & add the above .on function instead of .error
 	
	/*
	
	$(".required").unbind("error");
	$(".required").error(
			function() {
				$(this).attr(
						"src",
						getBaseUrl()
								+ "images/image_not_available250x250.png");
			});

	$(".required175x96").unbind("error");
	$(".required175x96").error(
			function() {
				$(this).attr(
						"src",
						getBaseUrl()
								+ "images/image_not_available175x96.png");
			});

	$(".required17596").unbind("error");
	$(".required17596").error(
			function() {
				$(this).attr(
						"src",
						getBaseUrl()
								+ "images/image_not_available175x96.png");
			});

	$(".required80x70").unbind("error");
	$(".required80x70").error(
			function() {
				$(this).attr(
						"src",
						getBaseUrl()
								+ "images/image_not_available80x70.png");
			});
	$(".required200x142").unbind("error");
	$(".required200x142").error(
			function() {
				$(this).attr(
						"src",
						getBaseUrl()
								+ "images/image_not_available200x142.png");
			});
	$(".required216x250").unbind("error");
	$(".required216x250").error(
			function() {
				$(this).attr(
						"src",
						getBaseUrl()
								+ "images/image_not_available216x250.png");
			});
	$(".required238x175").unbind("error");
	$(".required238x175").error(
			function() {
				$(this).attr(
						"src",
						getBaseUrl()
								+ "images/image_not_available238x175.png");
			});

	$(".required248x140").unbind("error");
	$(".required248x140").error(
			function() {
				$(this).attr(
						"src",
						getBaseUrl()
								+ "images/image_not_available238x175.png");
			});
	$(".required200x150").unbind("error");
	$(".required200x150").error(
			function() {
				$(this).attr(
						"src",
						getBaseUrl()
								+ "images/image_not_available200x150.png");
			});
	$(".required242x182").unbind("error");
	$(".required242x182").error(
			function() {
				$(this).attr(
						"src",
						getBaseUrl()
								+ "images/image_not_available242x182.png");
			});*/

	
	
	

	// This was added since the error function not firing issue even though the
	// img src returns 404 status
/*	$(
			"img.required80x70,img.required17596,img.required175x96,img.required,img.required200x142,img.required242x182,img.required200x150,img.required216x250,img.required238x175,img.required248x140")
			.each(function() {
				$(this).attr("src", $(this).attr("src"));
			});*/

	$("img.required242x182,img.required238x175,img.required242x182,img.required200x150,img.required216x250,img.required238x175,img.required248x140").each(function() {
		$(this).attr("src", $(this).attr("src"));
	});
}

function reRenderImages() {
	renderImages();
}

function shoppingBasketContinue() {

	$("div[id*='ShoppingBasketContinue']").click(
			function() {
				window.location.href =  getBaseUrl() +"ReviewCrossSellMapper;jsessionid="
						+ $("#sid").val() + "?";
			});
}

function initBackBtn() {
	$("a[id*='backBtn']").click(function() {
		history.back(-1);
		return false;
	});

}

// used to fix IE 7 issue with href attribute
function getRelativeHref(path) {
	if (path.indexOf("/")) {
		return "#" + path.split("#")[1];
	} else {
		return path;
	}
}

/**
 * If the page version does not match trigger the page reload
 */
function clearCache()
{
	if($.cookie)
	{
		var pv_cookie = $.cookie(PAGE_VERSION);
		var pv_page = $("#pv").val();

		if(pv_cookie && pv_cookie != "")
		{
			pvc = parseInt(pv_cookie, 10);
			pvp = parseInt(pv_page, 10);

			if(pvc > pvp)
			{
				$("#pvReload").show();
				blockInMiddle("pvReload");
				url = window.location.href;
				if(url.indexOf("?") > 0)
				{
					window.location.href = url + "&ts=" + new Date().getTime();
				}
				else
				{
					window.location.href = url + "?ts=" + new Date().getTime();
				}
			}
		}
	}
}

var style;
var minPopupWidth = 550;
var searchPopupWidth = 300;
var updatingPopupAdjustment = 140;
var currentBlockedUIElementId;

function updateBlockUIStyle(div, extraH, extraW) {

	if (extraH == null || extraH == undefined) {
		extraH = 0;
	}
	if (extraW == null || extraW == undefined) {
		extraW = 0;
	}

	if (jQuery.type(div) === "string" && $("#" + div).height() != null
			&& $("#" + div).height() != undefined) {
		currentBlockedUIElementId = div;
		var elementWidth = getElementZoomedWidth($("#" + div), extraW);

		var height = $("#" + div).height() + extraH;
		var eleHeight = height;

		if ($("#" + div).attr("id") == "searchBannerPopupTb") {
			height = 600;
			elementWidth = searchPopupWidth;
		}
	
		if(div == "addToBasketLoader" || div == "waitingAnimation" || div == "waitingAnim" || div == "selectTrpLoader" )
		{
			style = upadteingStyle(elementWidth, height, div, eleHeight);
		}
		else
		{
			style = createPopupStyle(elementWidth, height,  div, eleHeight);
		}


	} else if (jQuery.type(div) === "object" && $(div).height() != null
			&& $(div).height() != undefined && $(div).height() > 0) {
		currentBlockedUIElementId = $(div).attr("id");
		var elementWidth = getElementZoomedWidth(div, extraW);

		var height = $(div).height() + extraH;
		if ($(div).attr("id") == "searchBannerPopupTb") {
			height = 600;
			elementWidth = searchPopupWidth;
		}

		var eleHeight = height;
		if(div == "addToBasketLoader" || div == "waitingAnimation" || div == "waitingAnim" || div == "selectTrpLoader" )
		{
			style = upadteingStyle(elementWidth, height, div, eleHeight);

		}else
		{
			style = createPopupStyle(elementWidth, height,  div, eleHeight);
		}

	}
	//console.log($(window).width() + " ,,,, " + screen.width);
	scrollToTop();
//	initPopupReziseUpdater();

	 if( browserName == "Explorer")
	 {
		 $("#pageBlock").removeClass("blockPage");
	 }

	return style;

}

function getElementZoomedWidth(element, extraW) {
	var zoomFactor = 1;
	if( $(element).css("zoom") != null && $(element).css("zoom") != undefined  && (element).css("zoom") != "normal" /*&& element.attr("id") != "changeTripDatePopUp"*/){
		zoomFactor = $(element).css("zoom");
	}
	return ( getCorrectElementWidth(  $(element)) + extraW  )*zoomFactor;
}

function createPopupStyle(elementWidth, elementHeight,  div, eleHeight) {

	var isProgressPopup = false;

	if( $("#" +div).attr("id") == "addToBasketLoader" ||  $("#" +div).attr("id") == "addItemsBasket" || $("#" +div).attr("id") == "selectTrpLoader"){
		elementWidth = 670;
		isProgressPopup = true;
	}
	

	var leftPercentage = (((getScreenWidth()-elementWidth)/2)/getScreenWidth()*100);
	var left;
	if( leftPercentage < 0 ){
		left = "1%";
	}else{
		left = leftPercentage+"%";
	}

	if( (isProgressPopup && getScreenWidth() <= 600) ||
//			( $("#"+div).attr("id").match("^trpTimeAlternatives") != null && getScreenWidth() <= 600 ) ||
			(elementWidth > getScreenWidth()) ||
			(leftPercentage > 0 && leftPercentage < 4 )){
		left = "0%";
	}




	var top = (((getScreenHeight() - eleHeight )/2*100)/getScreenHeight());
	if((top < 0 || eleHeight == 0 ) && !($("#" + div).attr("id") == "searchBannerPopupTb")){
		top = 0;
	}

	var width;
	if(isProgressPopup){
	//	width = "100%";
		width =  $("#" +div).width() + "px";

	}else{
		width = (((getScreenWidth()-elementWidth)/2)+elementWidth)+"px";
	}

	$(".blockOverlay").css("width",getScreenWidth());

	var style = "width:"+width+"; "+
	"height:0; "+
	"top:"+top+"%; "+
	"right:0; "+
	"left:" +left+";"+
	"margin:auto; "+
	"position:fixed; "+
	"z-index:99999; "+
	"cursor:default; ";

	return style;
}


function upadteingStyle(elementWidth, elementHeight,  div, eleHeight){

	var width;
	var height;

	elementHeight =  $("#" +div).height();
	elementWidth =  $("#" +div).width();

	width = elementWidth+"px";
	height = elementHeight +"px";

	var marginLeft = elementWidth/2 +"px";
	var marginTop = elementHeight/2  +"px";

//	IE change last
	var style ="width:"+width+"; "+
	"height:"+ height +";"+
	"top:50% !important;"+
	"left:50% !important;"+
	"position:absolute !important; "+
	"margin-left:-"+ marginLeft +"; "+
	"margin-top:-"+ marginTop +";" +
	"z-index:99999 !important; ";

	return style;

}

function getCorrectElementWidth(element){
	var width = $(element).width();
	if($(element).attr("id") == "searchBannerPopup"){
		return $(element).find("#searchBannerPopupTb").width();
	}

	var condition;
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		condition = width > getScreenWidth();
//		alert("SC:"+ getScreenWidth() +" , "+navigator.userAgent);
	}else{
		condition = width >= getScreenWidth();
	}

	var widthFound = false;
	condition = false;// Temp Testing
	if( condition ){
		var widthArray = new Array();
		$(element).children().each(function() {
			if( !widthFound && width > $(this).width()){
				widthArray.push($(this).width());
//				widthFound = true;
			}
		});
		widthArray.sort(descending);
		for ( var i = 0; i < widthArray.length; i++) {
			var arEl = widthArray[i];
			if(arEl < width){
				width = arEl;
				break;
			}
		}
	}

	if(minPopupWidth>width){
		width = minPopupWidth;
	}
	return width;
}

function descending( a, b ) {
    return b - a;
}

var iconSelector = ".iconSearch, .iconCheck, .iconBrif, .head_row3Bc, .giftHead";
//var iconSelector2 = $('<div class="BodyRside fltLeft txtAlgLeft pdB30" style="cursor: pointer;">');
function initRightSideBasket() {
	$(".orgCageRside").unbind("click");
	$(".orgCageRside").click(function() {
		$(".orgCageRside").hide();

		$(iconSelector).each(function() {
			$(this).css("cursor","pointer");
		});
		$(iconSelector).unbind("click");
		$(iconSelector).click(function() {
			$(".shoppingBskt").hide();
            $("#orgCageRside").show();
		});

		//Closing function clicking on page
		$("#pageContent").unbind("click");
		$("#pageContent").click(function(){
			if( ( $("#orgCageRside").is(":visible")) )
			{
				$(".shoppingBskt").hide();
			}
		});

		$(".paymentCl").unbind("click");
		$(".paymentCl").click(function(){
			if( ( $("#orgCageRside").is(":visible")) )
			{
				$(".shoppingBskt").hide();
			}
		});
		if($("#isGiftCardPage").val()!='true'){
			$("#shoppingBskt").addClass('shoppingBskt');
		}		
		$(".shoppingBskt").show();

	});

	$(".orgCageRsideViwRes").unbind("click");
	$(".orgCageRsideViwRes").click(function() {
		$(".orgCageRsideViwRes").hide();
		$(".shoppingBskt").show("slide");
		$(iconSelector).each(function() {
			$(this).css("cursor","pointer");
		});
		$(iconSelector).unbind("click");
		$(iconSelector).click(function() {
			$(".shoppingBskt").hide("slide");
		});

		//Closing function clicking on page
		$("#pageContent").unbind("click");
		$("#pageContent").click(function(){
			$(".shoppingBskt").hide("slide");
		});
		$("#pageContents").unbind("click");
		$("#pageContents").click(function(){
			if( ( $("#orgCageRsideViwRes").is(":visible")) )
			{
				$(".shoppingBskt").hide("slide");
			}
		});

	});

	$(".icReference").unbind("click");
	$(".icReference").click(function() {
		$(".icReference").hide();

		$("#shoppingBskt").removeClass('shoppingBskt');
		if($("#isGiftCardPage").val()!='true'){
			$("#shoppingBskt").addClass('icReferenceShop shoppingBskt');
		}else{
			$("#shoppingBskt").addClass('icReferenceShop');
		}
		$(".shoppingBskt").show();

		$(iconSelector).each(function() {
			$(this).css("cursor","pointer");
		});
		$(iconSelector).unbind("click");
		$(iconSelector).click(function() {
			$(".shoppingBskt").hide();
		});

		//Closing function clicking on page
		$("#pageContents").unbind("click");
		$("#pageContents").click(function(){
			if( ( $("#icReference").is(":visible")) )
			{
				$(".shoppingBskt").hide();
			}
		});
	});
	
	// Balance Div Slider Click 
	$(".GiftCardBtn").unbind("click");
	$(".GiftCardBtn").click(function() {
		$(".GiftCardBtn").hide;
		$("#balanceDiv").css("cursor","pointer");
		$(iconSelector).each(function() {
			$(this).css("cursor","pointer");
		});
		
		$("#balanceDiv").unbind("click");
		$("#balanceDiv").click(function() {
			$(".giftRside").hide();
		});
		
		
		//Closing function clicking on page
		$("#pageContent").unbind("click");
		$("#pageContent").click(function(){
			if( ( $("#GiftCardBtn").is(":visible")) )
			{
				$(".giftRside").hide();
			}
		});
		
		
		$(".giftRside").show();
		$(".shoppingBskt").show();
			});

}

function initWindowResize() {
	$(window).resize(function() {
		// result page shopping basket display		
		if( $(".orgCageRsideViwRes") != null &&  $(".orgCageRsideViwRes").size() > 0 && $(".orgCageRsideViwRes") != undefined && !($(".orgCageRsideViwRes").is(":visible"))){
			$(".shoppingBskt").show("slide");
			$(iconSelector).unbind("click");
			$(iconSelector).each(function() {
				$(this).css("cursor","default");
			});
			//$(".shoppingBskt").show("slide");
		}else if( $(".orgCageRside") != null &&  $(".orgCageRside").size() > 0 && $(".orgCageRside") != undefined && !($(".orgCageRside").is(":visible"))){
			$(".shoppingBskt").show("slide");
			$(iconSelector).unbind("click");
			$(iconSelector).each(function() {
				$(this).css("cursor","default");
			});
		}else if( $(".icReference") != null &&  $(".icReference").size() > 0 && $(".icReference") != undefined && !($(".icReference").is(":visible"))){
			$(iconSelector).unbind("click");
			$(iconSelector).each(function() {
				$(this).css("cursor","default");
			});
			$(".shoppingBskt").show("slide");
		}else if( $(".GiftCardBtn") != null &&  $(".GiftCardBtn").size() > 0 && $(".GiftCardBtn") != undefined && !($(".GiftCardBtn").is(":visible"))){
			$(".giftRside").show();
			$(iconSelector).unbind("click");
			$(iconSelector).each(function() {
				$(this).css("cursor","default");
			});
			initRightSideBasket();
		}else if( $(iconSelector) != null && $(iconSelector) != undefined ){
			$(".shoppingBskt").hide();
			$(iconSelector).unbind("click");
			$(iconSelector).click(function() {
				if($("#isGiftCardPage").val()=='true'){
					$(".shoppingBskt").show("slide");
					$(".shoppingBskt").css("display","block");
				}else{
					$(".shoppingBskt").hide("slide");
					$(".shoppingBskt").css("display","none");
				}
			});
			initRightSideBasket();
		}

		if( $(".blockPage") != null && $(".blockPage") != undefined ){

			if( $(".blockPage").find("#"+currentBlockedUIElementId).width() != null && $(".blockPage").find("#"+currentBlockedUIElementId).width() != undefined ){
				 $(".blockPage").removeAttr("style");
				$(".blockPage").delay(1000).attr("style",updateBlockUIStyle(currentBlockedUIElementId));
			}else{
				 $(".blockPage").removeAttr("style");
				$(".blockPage").delay(1000).attr("style",updateBlockUIStyle($(".blockPage").find(".popouter").attr("id")));
			}
		}
		warningMessageTop();
	});
}

function scrollToTop() {
	//window.scrollTo(0,0);
}

function initPopupReziseUpdater() {
//	$(window).unbind("resize");
	$(window).resize(function() {
//		 $(".blockPage").removeAttr("style");
		if( $(".blockPage") != null && $(".blockPage") != undefined ){
			 $(".blockPage").removeAttr("style");
			$(".blockPage").delay(1000).attr("style",updateBlockUIStyle(currentBlockedUIElementId));
		}
	});
}
function addingMargingTopF(){

	$("#orgCageRside").removeClass('orgCageRside');
	$("#orgCageRside").addClass('CageTop orgCageRside');
	$("#icReference").removeClass('icReference');
	$("#icReference").addClass('CageTop icReference');

	//document.getElementById("orgCageRside").className = "CageTop orgCageRside";
}
function addingMargingTopS(){

	$("#orgCageRsideViwRes").removeClass('orgCageRsideViwRes');
	$("#orgCageRsideViwRes").addClass('CageTop orgCageRsideViwRes');

	//document.getElementById("orgCageRsideViwRes").className = "CageTop orgCageRsideViwRes";
}
function addingMargingTopShpBskt(){

	$("#shoppingBskt").removeClass('shoppingBskt');
	if($("#isGiftCardPage").val()!='true'){
		$("#shoppingBskt").addClass('ShCrtTop shoppingBskt');
	}else{
		$("#shoppingBskt").addClass('ShCrtTop');
	}

	//document.getElementById("orgCageRsideViwRes").className = "CageTop orgCageRsideViwRes";
}

// Allow an element to scroll until it is 10px from the top then fix there
function scrollFixToTop(){

    var target = $("#orgCageRside"),
        targetTop = target.offset().top,
        timeout = null;
    $(window).scroll(function () {
        if (!timeout) {
            timeout = setTimeout(function () {
                clearTimeout(timeout);
                timeout = null;
                if ($(window).scrollTop() >= targetTop - 10) {
                    target.addClass("fixToBottom");
                } else {
                    target.removeClass("fixToBottom");
                }
            }, 250);
        }
    });
}
function warningMessageTop(){
	if(( $("#warningDialog").is(":visible")) && ( $("#orgCageRsideViwRes").is(":visible"))){
		$("#orgCageRsideViwRes").removeClass('orgCageRsideViwRes');
		$("#orgCageRsideViwRes").addClass('ProCageTop orgCageRsideViwRes');
		$("#shoppingBskt").removeClass('shoppingBskt');
		$("#shoppingBskt").addClass('ProShCrtTop shoppingBskt');
	}
	else{
		$("#shoppingBskt").removeClass('ProShCrtTop shoppingBskt');
		if($("#isGiftCardPage").val()!='true'){
			$("#shoppingBskt").addClass('shoppingBskt');
		}
	}
}

