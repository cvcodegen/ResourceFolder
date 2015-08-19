/**
 * @autor Amali
 * @date 04-03-2013
 * Javascript used to validate the booking search banner and search the previously done bookings  
 *  
 */

	var isError = false;
	var selectedFromDate = null;
	var selectedToDate = null;
	var dtRegex = new RegExp(/\b\d{1,2}[\/]\d{1,2}[\/]\d{4}\b/);
	
	$(document).ready(function() {
		
		formToDatePicker();
		
		$("div[id='ui-datepicker-div']").css("display", "none");
		
		submitButton();
	
		$(document).idleTimeout({redirect_url: 'agentlogin'});

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
	
	
//For agent Search Booking button
function submitButton() {
	
	//Click button submit
		$("#agentSearchBookingButton").live('click', function() {
			//event.preventDefault();
			var isValid = validateSearchBooking();
			if (isValid == true) {
				forwardSearchRequest();
			} 
			else {
				return;
			}
		});
				
		//Enter key pressed submit
		 $(document).bind("keydown", function(event) {
		      var keycode = (event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode));
		      if (keycode == 13) { 
					event.preventDefault();
					validateSearchBooking();
		      }
		   });
}

function validateSearchBooking() {
	
	$("input[type='text'] ,select").each(function() {
		var obj = $(this);
		var id = obj.removeClass('borderRed');
	});

	
	var isValid  = true;

	
	if( $.trim($('#agentFromDate').val()) != "" && $.trim($('#agentToDate').val()) == ""){
		$('#agentToDate').addClass('borderRed');
		 isValid = false;
	}

	if($.trim($('#agentFromDate').val()) == "" && $.trim($('#agentToDate').val()) != "" ){
		 $('#agentFromDate').addClass('borderRed');
		 isValid = false;
	}
	
	if ($.trim($('#agentFromDate').val()) != "" &&  $('#agentFromDate').val() != null) {
		 if (!dtRegex.test($('#agentFromDate').val())) {
			 fromDate = $('<div>').text(" -Date Format should be MM/DD/YYYY");
			 $('#agentFromDate').addClass('borderRed');
			 isValid = false;
		}
	}
		
	if (  $.trim($('#agentToDate').val()) != "" && $('#agentToDate').val() != null) {
		if (!dtRegex.test($('#agentToDate').val())) {
			fromDate = $('<div>').text(" -Date Format should be MM/DD/YYYY");
			$('#agentToDate').addClass('borderRed');
			isValid = false;
		}
	}
	
	return isValid ;
}
	
function forwardSearchRequest(){
	
	var selectedBookingStatus = $("#bookingStatus").val();
	var params = "";
	
	params = "bookingRef="
	+ $("#bookingRef").attr('value') + "&"
	+ "agentFromDate="
	+ $("#agentFromDate").attr('value') + "&"
	+ "agentToDate="
	+ $("#agentToDate").attr('value')+ "&"
	+ "leadPassengerLastName="
	+ $("#leadPassengerLastName").attr('value') + "&";
		
	if( selectedBookingStatus == "ANY"){
		params = params + "bookingStatus=" + -1;
	}else if( selectedBookingStatus == "CONFIRMED"){
		params = params + "bookingStatus=" + 1000;
	}else if( selectedBookingStatus == "CANCELLED"){
		params = params + "bookingStatus=" + 2000;
	}else if( selectedBookingStatus == "EXPIRED"){
		params = params + "bookingStatus=" + 3000;
	}else if( selectedBookingStatus == "REQUEST"){
		params = params + "bookingStatus=" + 4000;
	}else if( selectedBookingStatus == "UNABLE"){
		params = params + "bookingStatus=" + 5000;
	}else if( selectedBookingStatus == "QUOTE"){
		params = params + "bookingStatus=" + 6000;
	}else if( selectedBookingStatus == "PENDING"){
		params = params + "bookingStatus=" + 7000;
	} 
		
	// REDIRECT URL
	var url = "agentSearchController;jsessionid=" + $("#sid").val()+"?"+params;
	var temp = encodeURI(url);
	$(location).attr('href', temp);
	return true ;
}


//For search Commision button
function CommisionSubmit(){
	$("#agentSearchCommisionButton").click(function(event) {
		event.preventDefault();
		validateSearchCommision();
	});
}


function validateSearchCommision() {
	isError = false;
	if ($("#agentFromDate").val() == "") {
		$("#agentFromDate").addClass('borderRed');
		isError = true;
	}else{
		$("#agentFromDate").removeClass('borderRed');
	}
	if ($("#agentToDate").val() == "") {
		$("#agentToDate").addClass('borderRed');
		isError = true;
	}else{
		$("#agentToDate").removeClass('borderRed');
	}
	
	if(isError){
		return false;
	}else{
		params = $("#agentFromDate").attr('name') + "="
		+ $("#agentFromDate").attr('value') + "&"
		+ $("#agentToDate").attr('name') + "="
		+ $("#agentToDate").attr('value');

		
		// REDIRECT URL
		var url = "viewcommisions;jsessionid=" + $("#sid").val()+"?"+params;
		var temp = encodeURI(url);
		$(location).attr('href', temp);
		return true;
	}
	
}


	
	function highlightWeekends(date) {
		if (date.getDay() == 0 || date.getDay() == 6) {
			return [ true, "highlight-weekend" ];
		} else {
			return [ true, "" ];
		}
	}
	
	
	/**
	 * jQurey related to DatePicker "from" "to"
	 * 
	 * @param range
	 * @param fromId
	 * @param toId
	 * @param fromDate
	 * @return
	 */
	function setDatePickerRange(range, fromId, toId, fromDate) {

		var toDateText = $("#" + toId).val();
		var fromDateText = $("#" + fromId).val();

		if (toDateText != null && toDateText != "") {
			var toDateArr;
			if (toDateText.indexOf("/") > 0) {
				toDateArr = toDateText.split("/");
			} else {
				toDateArr = toDateText.split("-");
			}
			if (toDateText.indexOf("/") > 0) {
				selectedToDate = new Date(toDateArr[2], (toDateArr[0] - 1),
						toDateArr[1]);
			} else {
				selectedToDate = new Date(toDateArr[2], (toDateArr[1] - 1),
						toDateArr[0]);
			}
		}
		if (fromDateText != null && fromDateText != "") {
			var fromDateArr;
			if (fromDateText.indexOf("/") > 0) {
				fromDateArr = fromDateText.split("/");
			} else {
				fromDateArr = fromDateText.split("-");
			}

			if (fromDateText.indexOf("/") > 0) {
				selectedFromDate = new Date(fromDateArr[2], (fromDateArr[0] - 1),
						fromDateArr[1]);
			} else {
				selectedFromDate = new Date(fromDateArr[2], (fromDateArr[1] - 1),
						fromDateArr[0]);
			}
		}

		// set the language
		if ($("#locale").val() === 'en') {
			$.datepicker.setDefaults($.datepicker.regional['']);
		} else {
			$.datepicker.setDefaults($.datepicker.regional[$("#locale").val()]);
		}
		var dates = range.datepicker( {
			numberOfMonths : 1,
			showCurrentAtPos : 0,
			firstDay : 0,
			beforeShowDay : function(date) {
				if (selectedFromDate != null) {
					if (selectedToDate != null) {
						// alert(selectedFromDate + " date :" + date + " to date :"
						// + selectedToDate );
						if (date.getTime() >= selectedFromDate.getTime()
								&& date.getTime() <= selectedToDate.getTime()) {
							return [ true, "ui-state-active" ];
						}
					} else {
						if (date.getTime() == selectedFromDate.getTime()) {
							return [ true, "ui-state-active" ];
						}
					}
				}

				if (date.getDay() == 0 || date.getDay() == 6) {
					return [ true, "highlight-weekend" ];
				} else {
					return [ true, "" ];
				}
			},
			minDate : fromDate,
			showAnim : 'fadeIn',
			onSelect : function(selectedDate) {
				var option = this.id == fromId ? "minDate" : "maxDate";
				if (option == "minDate") {
					var instance = $(this).data("datepicker");
					var date = $.datepicker.parseDate(instance.settings.dateFormat
							|| $.datepicker._defaults.dateFormat, selectedDate,
							instance.settings);
					selectedFromDate = date;

					dates.not(this).datepicker("option", option, date);
				} else {
					var instance = $(this).data("datepicker");
					var date = $.datepicker.parseDate(instance.settings.dateFormat
							|| $.datepicker._defaults.dateFormat, selectedDate,
							instance.settings);
					selectedToDate = date;
				}
			}
		});
	}


	/**
	 * jQuery to set Date Picker
	 * 
	 * @param elementId
	 * @param fromDate
	 * @return
	 */
	function setDatePicker(elementId, fromDate) {
		// set the language
		if ($("#locale").val() == 'en') {
			$.datepicker.setDefaults($.datepicker.regional['']);
		} else {
			$.datepicker.setDefaults($.datepicker.regional[$("#locale").val()]);
		}
		elementId.datepicker( {
			numberOfMonths : 1,
			beforeShowDay : highlightWeekends,
			firstDay : 0,
			minDate : fromDate,
			showAnim : 'fadeIn'
		});
	}

