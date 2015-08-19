/**
 * java script functionality related to add favicon icon in to header
 * 
 * @autor Amali
 * @date 26-04-2013
 * 
 */

$(document).ready(function() {
	addFavicon();
});

/**
 * Function to add clipper favicon icon into page header
 */

function addFavicon(){

	var l = document.createElement('link');
	l.rel = 'shortcut icon';
	l.href = 'images/clipper_favicon.ico';
	document.getElementsByTagName('head')[0].appendChild(l);
			
}