/**
 * @autor Amali
 * @date 05-11-2012 Javascript used to check the mandatory items and set user
 *       alert to inform
 */

var massage;
var transport;
var hotel;
var activity;
var count = 0;

$(document).ready(function() {

	popUpShow();
	
	$("#confirmButton").click(function() {
		getItemDetails();
	});
	
	$("#closeChange").click(function() {
		$('#itemConf').hide();		
	});	
	
	if (count == 0) {
		$('#confirmButton').attr('src', 'images/btn_lets_go.png');
		$("#confirmButton").hover(function(event) {
			$('#confirmButton').attr('src', 'images/btn_lets_go.png');	
		}, function() {
			$('#confirmButton').attr('src', 'images/btn_lets_go_hover.png');
		});
		
	}
	
	$("#taxFees").hover(function(event) {
		shoSupp();
	}, function() {
		$('#supplimentList').hide();		
	});

});

function getItemDetails() {

	var idT = $("input[id^='transport']");
	var idH = $("input[id^='hotel']");
	var idA = $("input[id^='activity']");

	i = 0;
	while (idT[i] != undefined) {

		temp = idT[i].value;
		var pieces = temp.split("_");
		selected = pieces[0];
		mandatory = pieces[1];

		if ((mandatory) & (!selected)) {
			transport = "Transport";
			count = count + 1;
		}
		i++;
	}

	j = 0;
	while (idH[j] != undefined) {

		temp = idH[j].value;
		var pieces = temp.split("_");
		selected = pieces[0];
		mandatory = pieces[1];

		if ((mandatory) & (!selected)) {
			hotel = "Hotel";
			count = count + 1;
		}
		j++;
	}

	k = 0;
	while (idA[k] != undefined) {

		temp = idA[k].value;
		var pieces = temp.split("_");
		selected = pieces[0];
		mandatory = pieces[1];

		if ((mandatory) & (!selected)) {
			activity = "Activity";
			count = count + 1;
		}
		k++;
	}

	message = "Combination Deals require the addition of ";
	messageHead = "Required ";

	if (transport != null) {
		message = message + "a " + transport;
		messageHead = transport + messageHead;
	}
	if (hotel != null) {
		message = message + "a " + hotel + " ";
		messageHead = hotel + " " + messageHead;
	}
	if (activity != null) {
		message = message + "an " + activity;
		messageHead = activity + " " + messageHead;
	}
	
	setMessage(message , messageHead);
}

function setMessage(message, messageHead) {

	$('#messageHead').empty();
	$('#message').empty();
	
	if (count > 0) {
		$('#confirmButton').attr('src', 'images/btn_choos_hotel.jpg');
		$('#itemConf').css('display', "");
		$('#supplimentList').css('position', "absolute");
	}else{
		$('#confirmButton').attr('src', 'images/btn_lets_go.png');
		$("#confirmButton").hover(function(event) {
			$('#confirmButton').attr('src', 'images/btn_lets_go.png');	
		}, function() {
			$('#confirmButton').attr('src', 'images/btn_lets_go_hover.png');
		});
	}
	
	p = $('#confirmButton').position();
	
	var msgDiv = $('<div></div>');
	msgDiv.text(message);

	
	var msgDivHead = $('<div></div>');
	msgDivHead.text(messageHead);
	
		$('#messageHead').append(msgDivHead);
		$('#message').append(msgDiv);					

		
		$('#itemConf').css('top',( p.top + 40+'px') );
		$('#itemConf').css('left', ( p.left+'px'));
}


function popUpShow(){
	
	$("#confirmButton").hover(function(event) {
		getItemDetails();
	}, function() {
		$('#itemConf').hide();		
	});
}


function shoSupp(){
		
	p = $('#taxFees').position();
	
	$('#supplimentList').css('position', "absolute");
	$('#supplimentList').css('display', "");
	$('#supplimentList').css('top',( p.top + 40+'px') );
	$('#supplimentList').css('left', ( p.left-50 +'px'));
	
}



