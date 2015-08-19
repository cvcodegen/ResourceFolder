/**
 * javascript functionalities related to agent booking search results
 * 
 * @date 03-05-2013
 */

$(document).ready(function() {	
	initPaging(); 
});

//send paging request
function sendpagingRequest(param, div) {
	doAjax("jsp/agent/searchResultsList.jsp", param, pagingCallBack, div, null);
}

//callback function for paging
function pagingCallBack(data, div) {
	replaceExistingResult(data, div);
	initPaging(); 
}