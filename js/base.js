
function isAgent() {
	if( $("#isAgent").val() != null && $("#isAgent").val() != undefined && $("#isAgent").val() == "true" ){
		return true;
	}else{
		return false;
	}
}

/**
 * Returns the valid url
 * @returns
 */
function getBaseUrl() {
	if (isAgent()) {
//		console.log("Agent Flow");
		return $("#agentBase").val();
	} else {
//		console.log("General Flow");
		return $("#webBase").val();
	}
}

//Load resource base
function getResourceBaseURL() {
	return $("#resourceBase").val();
}
