var NodeHelper = require("node_helper");
var Request = require("request");

module.exports = NodeHelper.create({

  apiBaseURL: "https://api.tfl.gov.uk/Line/",

  start: function() {
    console.log("Starting node_helper for module [" + this.name + "]");
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification == "GET_LONDON_TRANSIT_STATUS") {
      this.getStatus(payload);
    }
  },


  /*
    Request for bus line status done separately in order to keep the data volume to a minimum.
    While it is technically possible to query for the status of every single bus line, chances
    are you only really care about a handful that you use on a regular basis.  So it doesn't
    make sense to query for all 600+ bus lines along with the status for the other modes
    of transport.

    So we create up to two URLs, and request them in a loop.  Once all requests have been fulfilled
    we send an array of alerts back to the front end.
  */
  getStatus: function(payload) {

    var self = this;    
    var alertsToReturn = [];
    var urls = [];
    var requestCounter = 0;

    if (payload.modes != "") {
      urls.push(this.apiBaseURL + "Mode/" + payload.modes + "/Status?app_id=" + payload.app_id + "&app_key=" + payload.app_key);
    }

    if (payload.busLines != "") {
      urls.push(this.apiBaseURL + payload.busLines + "/Status?app_id=" + payload.app_id + "&app_key=" + payload.app_key);
    }

    if (urls.length == 0) {

      //nothing to query for.  return an empty array
      this.sendSocketNotification("LONDON_TRANSIT_STATUS", []);
    
    } else {

      for (var i = 0; i < urls.length; i++) {
  
        Request({url:urls[i], method: "GET"}, function(error, response, body) {

          var index = i;

          if(!error && response.statusCode == 200 && body != null) {
            
            //merge the processed JSON into the master array that will
            //eventually get returned to the front end.
            Array.prototype.push.apply(alertsToReturn, self.processJSON(body));
            
            requestCounter = requestCounter + 1;
            if (requestCounter >= urls.length) {

              // console.log("------------------------ > " + alertsToReturn.length + " alerts:");
              // console.log(JSON.stringify(alertsToReturn));


              self.sendSocketNotification("LONDON_TRANSIT_STATUS", alertsToReturn);
            }

          } else {

            //write an error into the console
            console.log("[" + self.name + "] Cannot get status update: " + error);
            console.log("      url: " + urls[index]);
            
            //update the counter anyway, so the front end will get notified
            requestCounter = requestCounter + 1;
            if (requestCounter >= urls.length) {
              self.sendSocketNotification("LONDON_TRANSIT_STATUS", alertsToReturn);
            }            
          }

        });

      }
    }


  },

  /*
    We'll create an object of alerts with anything with
    statusSeverity other than 10 (Good Service).
  */
  processJSON: function(json) {

    var alerts = [];

    json = JSON.parse(json);

    for (var i = 0; i < json.length; i++) {
      var line = json[i];
      for (var j = 0; j < line.lineStatuses.length; j++) {
        var status = line.lineStatuses[j];
        if (status.statusSeverity != 10) {
          alerts.push({
            lineId: line.id,
            lineName: line.name,
            transportMode: line.modeName,
            statusSeverity: status.statusSeverity,
            statusShort: status.statusSeverityDescription,
            statusLong: status.reason ? status.reason.substring(status.reason.indexOf(":")+1) : ""
          });
        }
      }
    }

    return alerts;

  }

});