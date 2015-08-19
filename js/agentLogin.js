/**
 * agent login related js functionalities
 * @autor ureka
 * @date 05-04-2013
 */
var isError = false;

$(document).ready(function() {
	sendRedirect();
});

function sendRedirect() {
	//agent submit button - Click
	$("#agentLoginSubmitButton").click(function(event) {
		validate();
	});

	//agent submit button - Key press( Enter key )
	 $(document).bind("keydown", function(event) {
	      var keycode = (event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode));
	      if (keycode == 13) {
				event.preventDefault();
				validate();
	      }
	   });


	//agent Back Button
	$("#agentBackButton").click(function(event) {
		event.preventDefault();
		// REDIRECT URL
		var url = $("#agentLoginBackUrl").val();
		var temp = encodeURI(url);
		$(location).attr('href', temp);
		return true;
	});
}

function validate() {

	isError = false;
	if ($("#agentID").val() == "") {
		$("#agentID").addClass('borderRed');
		isError = true;
	}
	else {
		$("#agentID").removeClass('borderRed');
	}
	if ($("#agentPassword").val() == "") {
		$("#agentPassword").addClass('borderRed');
		isError = true;
	}
	else {
		$("#agentPassword").removeClass('borderRed');
	}

	if (isError) {
		return false;
	}
	else {
		var params="agentID=" + $("#agentID").val() + "&agentPassword="+$("#agentPassword").val();
		doAjax("AgentLoginController", params, agentLoginCallBack , null, "json");
	}

}

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
	url = $("#agentBase").val() + url;
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


function agentLoginCallBack(data,div){
	var status = data["status"];
	if (status == SUCCESS)
	{
		if(status == -1)
		{
			if(data["isLoginPage"] == 1){
				displayMessage(data, null, null, null);
			}else{
				$(location).attr('href', data["data"]);
			}
		}else if(status == 1){
			$(location).attr('href', data["data"]);
		}
	}
	else
	{
		displayMessage(null, data["status"], data["msg"], data["data"]);
	}
}