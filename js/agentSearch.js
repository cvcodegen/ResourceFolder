/**
 * javascript functionalities related to agent search banner
 * 
 * @date 04-04-2013
 */

$(document).ready(function() {
	
	var cityList = new CityList({
		onComplete : function(){
			selectedTab=SELECTED_TAB_CLIPPER_ONLY;
			selectedOption=SELECTED_OPTION_ROUND_TRIP;
			initFunctions();
		}
	});
	cityList.init();
	$(document).idleTimeout({redirect_url: 'agentlogin'});
});