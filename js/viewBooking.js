/**
 * Javascript functionalities related to view booking popup
 * @author madhawa 
 */

var WEB_SERVICE_URL_LOAD_BOOKING = BASE_URL + "jaxrs/json/loadBooking?callback=?";

var viewBooking = function()
{
	$__viewBkg = jQuery.noConflict();
	
	__thisVB = this;
	
	this.init = function ()
	{
		$__viewBkg("#viewBkgBtn").die('click');
		$__viewBkg("#viewBkgBtn").live('click', function(){
			if(__thisVB.validateViewBooking())
			{
				$__viewBkg("#viewBookingPopUp").hide();
				$__viewBkg("#loadingAnim").show();
				__thisVB.loadBooking();
			}
			else
			{
				$__viewBkg("#viewBookingErrorMsg").show();
			}
		});
		
		$__viewBkg("#viewBookingClose").die('click');
		$__viewBkg("#viewBookingClose").live('click', function(){
			$__viewBkg("#viewBookingPopUp").hide();
			$__viewBkg("#ViewBkgBGBlock").hide();
			__thisVB.clearViewBookingErrors();
		});
		
		$__viewBkg("#showViewBookingPanel").die('click');
		$__viewBkg("#showViewBookingPanel").live('click', function(){
			__thisVB.showViewBookingPanel();
		});
	};
	
	/**
	 * Validate booking id and last name
	 * @returns validity
	 */
	this.validateViewBooking = function ()
	{
		var isValid = true;
		var bookingId = $__viewBkg("#viewBkgBookingId").val();
		var lastName = $__viewBkg("#viewBkgLastName").val();
		
		__thisVB.clearViewBookingErrors();
		
		if(bookingId != null && bookingId != "")
		{
			if(isNaN(parseFloat(bookingId)) || !isFinite(bookingId))		
			{
				$__viewBkg("#viewBookingErrorMsg").append($__viewBkg('<div>').text("-Invalid booking reference"));
				$__viewBkg('#viewBkgBookingId').addClass('borderRed');
				isValid = false;
			}
		}
		else
		{
			$__viewBkg("#viewBookingErrorMsg").append($__viewBkg('<div>').text("-Please enter the booking reference"));
			$__viewBkg('#viewBkgBookingId').addClass('borderRed');
			isValid = false;
		}	
		
		if(lastName == null || lastName == "")
		{
			$__viewBkg("#viewBookingErrorMsg").append($__viewBkg('<div>').text("-Please enter the Lastname"));
			$__viewBkg('#viewBkgLastName').addClass('borderRed');
			isValid = false;
		}
		
		return isValid;
	};
	
	/**
	 * Load booking obj to the web session
	 */
	this.loadBooking = function ()
	{	
		var url = WEB_SERVICE_URL_LOAD_BOOKING + 
			"&bookingId=" + $__viewBkg("#viewBkgBookingId").val() + "&lastName=" + $__viewBkg("#viewBkgLastName").val();
		
		$__viewBkg.getJSON(url, function(response) {
			if (response.status == 1) 
			{
				var messages = response.data;
				if(messages.successStatus == "1")
				{
					window.location= BASE_URL + "ViewMyBooking;jsessionid=" + messages["SID"];
				}
				else
				{
					$__viewBkg("#loadingAnim").hide();
					$__viewBkg("#viewBookingPopUp").show();				
					$__viewBkg("#viewBookingErrorMsg").append($__viewBkg('<div>').text(messages["errorMessage"]));
					$__viewBkg("#viewBookingErrorMsg").show();
				}
			}
			else
			{
				$__viewBkg("#loadingAnim").hide();
				$__viewBkg("#viewBookingPopUp").show();
				$__viewBkg("#viewBookingErrorMsg").append($__viewBkg('<div>').text("Error occured while attempting to load the booking"));
				$__viewBkg("#viewBookingErrorMsg").show();
			}
		}); 
	};
	
	
	/**
	 * This method has to be called at the remote page when the required event is triggered.
	 * Show view booking panel.  
	 */
	this.showViewBookingPanel = function ()
	{
		$__viewBkg("#ViewBkgBGBlock").show();
		$__viewBkg("#viewBookingPopUp").show();
		
		$__viewBkg(document).bind(
				"keydown",
				function(event) {
					var keycode = (event.keyCode ? event.keyCode
							: (event.which ? event.which : event.charCode));
					if (keycode == 13) 
					{
						$__viewBkg("#viewBkgBtn").trigger('click');
					}
				});
	};
	
	/**
	 * Clear error messages and error markings 
	 */
	this.clearViewBookingErrors = function ()
	{
		$__viewBkg("#viewBookingErrorMsg").hide().empty();
		$__viewBkg("input[id^='viewBkg']").removeClass('borderRed');
	};
};