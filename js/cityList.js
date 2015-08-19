/**
 * @autor ureka
 * @date 22-10-2012
 * Javascript used to load the city list in the search banner
 */

if(BASE_URL == null ){
	var BASE_URL = getBaseUrl();	
}
var WEB_SERVICE_URL_CITY_LIST = BASE_URL + "jaxrs/json/cityList?callback=?";

var CityList = function(opt)
{
	$__cityList = jQuery.noConflict();// Resolve conflicts

	_thisC = this;
	_opt = opt ? opt : {};

	/**
	 * Initialize the component
	 */
	this.init = function()
	{
		_thisC.get();
	};

	//get the combo and clipper from and to city lists and store in hidden fields
	this.get = function()
	{
		BrowserDetect.init();
		var browserName  = BrowserDetect.Browser;

		urlCity = WEB_SERVICE_URL_CITY_LIST;
		$__cityList.getJSON(urlCity, function(response)
		{
			if (response.status == 1)
			{
				$__cityList.each(response.data,function(k,v){
					_cityList = $__cityList("select[id='"+k+"']");
					_cityList.empty();

					//if the list is a toCity list
					if(k.indexOf("ToCity")>=0){
						if(browserName == "Safari"){
							_cityList.append('<option value="">Select to city</option>');
						}else{
							_cityList.append('<option value="">--Select to city--</option>');
						}
					$__cityList.each(v,function(k1,v1){
						_cityList.append($__cityList('<option class="Country" disabled="disabled" value="'+k1+'">'+ k1 +'</option>'));//disable the option is it is a country
						$__cityList.each(v1,function(k2,v2){
							// fixing for IE
							if(browserName == "Firefox"){
								_cityList.append($__cityList('<option class="City" value="'+v2.code+'">'+ "  "+v2.city +'</option>'));
							}else{
								_cityList.append($__cityList('<option class="City" value="'+v2.code+'">'+ "&nbsp&nbsp"+v2.city +'</option>'));
							}


						});
					});
					}

					// if the city list is from city list
					else{
						if(browserName == "Safari"){
							_cityList.append('<option value="">Select from city</option>');
						}else{
							_cityList.append('<option value="">--Select from city--</option>');
						}
						// if the city list is combo from city list
						if(k.indexOf("combo")>=0){
							_exceptionsList=$__cityList("#comboExceptionsList");//get combo exceptions list
						}
						// if the city list is clipper from city list
						else{
							_exceptionsList=$__cityList("#clipperExceptionsList");//get clipper exceptions list
						}
						_exceptionsList.empty();//empty the existing exceptions list

						//map cities with country
						$__cityList.each(v,function(k1,v1){
							_cityList.append($__cityList('<option class="Country" disabled="disabled" value="'+k1+'">'+ k1 +'</option>'));//disable the option is it is a country
							$__cityList.each(v1,function(k2,v2){
								// fixing for IE
								if(browserName == "Firefox"){
									_cityList.append($__cityList('<option class="City" value="'+v2.code+'">'+ "  "+v2.city +'</option>'));
								}else{
									_cityList.append($__cityList('<option class="City" value="'+v2.code+'">'+ "&nbsp&nbsp"+v2.city +'</option>'));
								}
								_exceptionsList.append($__cityList("<input id='exception_"+v2.code+"' value='"+v2.exception+"' type='hidden'/>"));//append the related to city exceptions list
							});
						});
					}

				});

				//Call to call back if define
				if(_opt.onComplete)
				{
					_opt.onComplete();
				}
			}
		});
	};
};