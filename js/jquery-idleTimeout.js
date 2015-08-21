//######
//## This work is licensed under the Creative Commons Attribution-Share Alike 3.0 
//## United States License. To view a copy of this license, 
//## visit http://creativecommons.org/licenses/by-sa/3.0/us/ or send a letter 
//## to Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
//## Some of the functions were disabled ( Please uncomment them in order to get them worked! )
//## 
//## Modified by Sampath.
//######

(function($){
 $.fn.idleTimeout = function(options) {
    var defaults = {
			inactivity:    900000, //1500000 25 Min (1200000 - 20 Minutes )(600000-10 Minutes)
			noconfirm:     300000, //300000 5 Min (10000  - 10 Seconds )
			sessionAlive: 1800000, //1800000 - 30 Minutes
			redirect_url: $("#clipperBackUrl").val(),
			click_reset: false,
			alive_url: '/ClipperWeb/keepAlive;jsessionid=' + $("#sid").val() ,
			logout_url: ''
		}
    
    //##############################
    //## Private Variables
    //##############################
    var opts = $.extend(defaults, options);
    var liveTimeout, confTimeout, sessionTimeout;
    var modal = "<div id='modal_pop'><p>You are about to be signed out due to inactivity.</p></div>";
    //##############################
    //## Private Functions
    //##############################
    var start_liveTimeout = function()
    {
      clearTimeout(liveTimeout);
      clearTimeout(confTimeout);
      liveTimeout = setTimeout(logout, opts.inactivity);
      
      if(opts.sessionAlive)
      {
        clearTimeout(sessionTimeout);
        sessionTimeout = setTimeout(keep_session, opts.sessionAlive);
      }
    }
    
    var logout = function()
    {
      confTimeout = setTimeout(redirect, opts.noconfirm);      
      jAlert("Do you want to continue with current Session?", "Your session is about to expire.", function(r){
			if(r){
				stay_logged_in();
			}
		});

		// Using a dialog box
//      $(modal).dialog({
//        buttons: {"Stay Logged In":  function(){
//          $(this).dialog('close');
//          stay_logged_in();
//        }},
//        modal: true,
//        title: 'Auto Logout'
//      });
      
    }
    
    var redirect = function()
    {
    	//Logout functionality 
//      if(opts.logout_url)
//      {
//        $.get(opts.logout_url);
//      }
      
    	// Alert to inform that session has expired. On click, redirect to the redirect url. 
      jAlert("Your session has expired.<br/> You will be redirected to starting page.", "Sorry!", function(r){
    	  if(r){
    		  window.location.href =  opts.redirect_url;
    	  }
      });
      
    }
    
    var stay_logged_in = function(el)
    {
      start_liveTimeout();
      if(opts.alive_url)
      {
        $.get(opts.alive_url);
      }
    }
    
    var keep_session = function()
    {
//      $.get(opts.alive_url);
      clearTimeout(sessionTimeout);
      sessionTimeout = setTimeout(keep_session, opts.sessionAlive);
    } 
    
    
    //###############################
    //Build & Return the instance of the item as a plugin
    // This is basically your construct.
    //###############################
    return this.each(function() {
      obj = $(this);
      
      //Start timer. 
      start_liveTimeout();
      
      // Identify successful ajax request completions and reset the timer
      $(document).bind("ajaxComplete", function(){
          start_liveTimeout();
      });
        
      // Bind click events to force restarting the counter
//      if(opts.click_reset)
//      {
//        $(document).bind('click', start_liveTimeout);
//      }
      
      //Send session alive packets to keep the session.
//      if(opts.sessionAlive)
//      {
//        keep_session();
//      }

    });
 };
})(jQuery);



