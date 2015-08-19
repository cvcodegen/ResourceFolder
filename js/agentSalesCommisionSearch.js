/**
 * This is used to functions in agentSalesCommissionSearch.jsp
 * 
 * @author Ureka
 * @date 05-04-2013
 */

var isError = false;

$(document).ready(function() {
	$(document).idleTimeout({redirect_url: 'agentlogin'});
	initPaging();
	formToDatePicker();
});


/*
 * Customize the date picker for the form to date 
 */
function formToDatePicker(){
	
	var dateToday = new Date();
	var dates = $("#agentFromDate, #agentToDate").datepicker({
	    numberOfMonths:1,
	    onSelect: function(selectedDate) {
	        var option = this.id == "agentFromDate" ? "minDate" : "maxDate",
	            instance = $(this).data("datepicker"),
	            date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
	        dates.not(this).datepicker("option", option, date);
	    }
	});
	
}	
	

/**
 * Validate search and forward the request.
 * 
 * @return
 */
function searchCommision() {

	$("div[id^='errorCommition_']").remove();
	$("#agentFromDate").removeClass('borderRed');
	$("#agentToDate").removeClass('borderRed');		
	
	isError = false;
	if ($("#agentFromDate").val() == "") {
		$("#agentFromDate").addClass('borderRed');
		setError("Please enter 'From' date", $('#agentFromDate'), true, null);
		isError = true;
	}
	if ($("#agentToDate").val() == "") {
		$("#agentToDate").addClass('borderRed');
		setError("Please enter 'To' date", $('#agentToDate'), true, null);
		isError = true;
	}

	if (isError) {
		return false;
	} else {
		params = $("#agentFromDate").attr('name') + "="
				+ $("#agentFromDate").attr('value') + "&"
				+ $("#agentToDate").attr('name') + "="
				+ $("#agentToDate").attr('value');

		// REDIRECT URL
		var url = "viewcommisions;jsessionid=" + $("#sid").val() + "?" + params;
		var temp = encodeURI(url);
		$(location).attr('href', temp);
		return true;
	}
}


function setError(message, obj, idError, type) {

	if (idError) {
		obj.addClass("borderRed");
	}

	if(message.length > 0){
		var id = obj.attr("id");
		var errorDiv = $('<div class="agentError" id="errorCommition_' + id + '">'+ message + '<div/>');
		var position = obj.position();
		errorDiv.css("display", "");
		obj.parent().append(errorDiv);
	}
}

//send paging request
function sendpagingRequest(param, div) {
	doAjax("jsp/agent/salesCommisionResultsList.jsp", param, pagingCallBack, div, null);
}

//callback function for paging
function pagingCallBack(data, div) {
	replaceExistingResult(data, div);
	initPaging(); 
}