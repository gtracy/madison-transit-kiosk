
var metro_direction = [];
var metro_location = [];

function update(stopID, direction, key) {
    metro_direction[stopID] = direction;
    updateClock();
    refreshTimes(stopID,direction, key);
}

function refreshTimes(stopID, Direction, key) {
    // abusers are taking advantage of the default
    if( key != "kiosk" ) {
        var url = 'https://api.smsmybus.com/v1/getarrivals';
        $.ajax({
            type: "GET",
            url: url,
            data: {'key':key,'stopID':stopID},
            dataType: 'json',
            success: arrivalsCallback,
        });
    }
} // refreshTimes

function getLocation(stopID,key) {
    // abusers are taking advantage of the default
    if( key != "kiosk" ) {
        var url = 'https://api.smsmybus.com/v1/getstoplocation';
        $.ajax({
            type: "GET",
            url: url,
            data: {'key':key,'stopID':stopID},
            dataType: 'json',
            success: locationCallback,
        });
    }
}

function locationCallback(jsondata) {
    if( jsondata.status == "0") {
        stopID = jsondata.stopID;
        metro_location[stopID] = jsondata.intersection;
    }
}

function arrivalsCallback(jsondata) {
    if( jsondata.status == "-1") {
        $("#"+jsondata.stopID+"-estimates").replaceWith('<div id="'+jsondata.stopID+'-estimates" class="estimates"><span class="direction">'+metro_direction[jsondata.stopID]+'</span><div class="subhead"> &nbsp; &nbsp; Next bus at <span id="location">' + metro_location[jsondata.stopID] + '</span> ' + jsondata.timestamp + ' estimate</div>');
        $("#"+jsondata.stopID+"-estimates").append('<span class="arrival">'+jsondata.description+'</span>');
    } else {
        stopID = jsondata.stop.stopID;
      	timestamp = jsondata.timestamp;
        $("#"+stopID+"-estimates").replaceWith('<div id="'+stopID+'-estimates" class="estimates"><span class="direction">'+metro_direction[stopID]+'</span><div class="subhead"> &nbsp; &nbsp; Next bus at <span id="location">' + metro_location[stopID] + '</span> ' + timestamp + ' estimate</div>');

        var routes = jsondata.stop.route;
        for( var i=0; i < routes.length; i++ ) {
          	var routeID = routes[i].routeID;
          	var minutes = routes[i].minutes;
      	    if (i>4) {
                // limit number of rows
                $("#"+stopID+"-estimates").append('<span class="arrival"> ...#'+routeID+' in '+minutes+' min </span>');
                return true;
            } 
          	var destination = routes[i].destination;
          	destination = destination.substring(0,12); //limit the length in case of long ones (unknown risk)
          	if (minutes<6) {
                time = '<div class="arrival"><span class="coming-soon">#<span class="route-label">'+routeID+'</span> to <span class="destination-abbrev">'+destination+'</span> in <span class="minutes">'+minutes+'</span> min</span></div><div class="destination-text">'+destination+'</span></div>';
      	    } else {
                time = '<div class="arrival">#<span class="route-label">'+routeID+'</span> to <span class="destination-abbrev">'+destination+'</span> in <span class="minutes">'+minutes+'</span> min</span></div><div class="destination-text">'+destination+'</div>';
            }
      	    $("#"+stopID+"-estimates").append(time);        	          
        };
    }   
} // success function

function updateClock ( )
{
	  var currentTime = new Date ( );
	
	  var currentHours = currentTime.getHours ( );
	  var currentMinutes = currentTime.getMinutes ( );
	  var currentSeconds = currentTime.getSeconds ( );
	
	  // Pad the minutes and seconds with leading zeros, if required
	  currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
	  currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;
	
	  // Choose either "AM" or "PM" as appropriate
	  var timeOfDay = ( currentHours < 12 ) ? "am" : "pm";
	
	  // Convert the hours component to 12-hour format if needed
	  currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;
	
	  // Convert an hours component of "0" to "12"
	  currentHours = ( currentHours == 0 ) ? 12 : currentHours;
	
	  // Compose the string for display
	  var currentTimeString = currentHours + ":" + currentMinutes + " " + timeOfDay;
	
	  // Update the time display
	  document.getElementById("clock").firstChild.nodeValue = currentTimeString;
}
