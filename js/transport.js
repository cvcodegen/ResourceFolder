/**
 * Javascript functionalities related to transport items in your trip page
 */
function initTrpItem()
{
	$("div[id^='trpChangeTimes_']").unbind('click');
	$("div[id^='trpChangeTimes_']").click( function()
	{
		$("#headChangeDtes").addClass('mgR20');
		$("div[id='trpPopwithscrolDiv']").each(function() {
			$(this).addClass('popwithscrol');
		});
		$("div[id^=cssRemoveClp-]").addClass('RovHglDiv_ie7');

		var idSplit=$(this).attr("id").split("_");
	//	$.blockUI({ message: $('#trpTimeAlternatives_'+idSplit[1]) ,centerX: false,css: { width:'auto',left:'15%', top:'10%' } ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
		 blockInMiddle("trpTimeAlternatives_"+idSplit[1]);
		$("#trpTimeAlternatives_" + idSplit[1]).show();


		$(".blockPage").removeAttr("style");
		$(".blockPage").attr("style",updateBlockUIStyle("trpTimeAlternatives_"+idSplit[1]));
		$(window).trigger("resize");

		//bind  close function(clicking outer space)
		$(".blockOverlay").unbind('click');
		$(".blockOverlay").bind("click", function()
		{

			$("#trpPopwithscrolDiv").removeClass('popwithscrol');
			$("#headChangeDtes").removeClass('mgR20');
			$("div[id^='cssRemoveClp-']").removeClass('RovHglDiv_ie7');

//			var idSplits=$(this).attr("id").split("_");
			 $.unblockUI();
			 $("#trpTimeAlternatives_" + idSplit[1]).hide();
		} );
	});


	$("img[id^='trpCloseButton_']").unbind('click');
	$("img[id^='trpCloseButton_']").bind( "click", function()
	{
		$("div[id='trpPopwithscrolDiv']").each(function() {
			$(this).removeClass('popwithscrol');
		});

		$("#headChangeDtes").removeClass('mgR20');
		$("div[id^='cssRemoveClp-']").removeClass('RovHglDiv_ie7');

		var idSplit=$(this).attr("id").split("_");
		 $.unblockUI();
		 $("#trpTimeAlternatives_" + idSplit[1]).hide();
	} );

	$("div[id^='trpSupps_']").unbind('click');
	$("div[id^='trpSupps_']").click( function()
	{
		var idSplit=$(this).attr("id").split("_");
	//	$.blockUI({ message: $('#trpSupplementsDiv-'+idSplit[1]) ,centerX: false,css: { width:'auto',left:'15%', top:'10%' } ,overlayCSS:  { backgroundColor: '#000', opacity: '0.5' }});
		blockInMiddle("trpSupplementsDiv-"+idSplit[1]);
		$("#trpSupplementsDiv-" + idSplit[1]).show();
	});

	initTrpSupplement();
	selectTrpAlternative();
	initMapFunctions();
}

function initTrpSupplement()
{
	$("img[id^='trpSupClose-']").unbind('click');
	$("img[id^='trpSupClose-']").bind( "click", function()
	{
		var idSplit=$(this).attr("id").split("-");
		 $.unblockUI();
		 $("#trpSupplementsDiv-" + idSplit[1]).hide();
		 selectSupplementDropDown();
	} );

	$("div[id^='addTrpSuppBtn-']").unbind('click');
	$("div[id^='addTrpSuppBtn-']").bind( "click", function ()
	{
		var idSplit=$(this).attr("id").split("-");
		var param = "itemType=" + idSplit[1] + "&";
		param += "trpIndex=" + idSplit[2] + "&";

		$("select[id*='SUPP']").each(function ()
        {
            var selectedValue = $(this).find(":selected").val();
            if( selectedValue > 0)
            {
            	param += $(this).attr("name") + "=" + $(this).attr("name").split("-")[2] + "-" + selectedValue + "&" ;
            }
        });

		/*if( isNotMandatory && !isSuppSelected )
		{
			jAlert($("#continueErrorMsg").html(), "Alert", function(r) {});
			return;
		}*/
		var div = $("#trpSupplementsDiv-" + idSplit[1] + "-" + idSplit[2]);
		doAjax("TrpSupplementController", param, addTrpSuppCallback, div, "json");
	});

	selectSupplementDropDown();
}

function selectSupplementDropDown()
{
	$("select[id*='SUPP']").each(function ()
    {
        var ishidden = $(this).attr("ishidden");
        if( ishidden == null )
        {
        	var idSplit=  $(this).attr("name").split("-");
        	var supItem = $("input[id='SUPItem-" + idSplit[2] + "']");
        	if( supItem.length > 0 )
        	{
        		$(this).val( supItem.val() );
        	}
        	else
    		{
        		$(this)[0].selectedIndex = 0;
    		}

        }
    });
}

function addTrpSuppCallback(data, div)
{
	$.unblockUI();
	div.hide();
	var status = data["status"];
	if (status == SUCCESS)
	{
		refreshBasket();
	}
	else
	{
		displayMessage(null, data["status"], data["msg"], data["data"]);
	}
}

function selectTrpAlternative()
{
	$("div[id^='TRPALT']").unbind("click");
	$("div[id^='TRPALT']").bind("click", function ()
	{
		selectTrpAlternativeItem($(this));
	});
}