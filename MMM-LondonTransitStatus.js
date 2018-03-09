Module.register("MMM-LondonTransitStatus", {

  defaults: {
    dataPollInterval: 5 * 60 * 1000, //poll TfL Api every 5 minutes
    alertCarouselInterval: 30 * 1000, //cycle through alerts every 30 seconds
    modes: "tube,dlr,overground,tflrail",
    busLines: "",
    hideIfNoAlerts: true,
    animationSpeed: 1000
  },

  /* the only valid values for modes. All others will be ignored */
  transitModes: [
    "tube",
    "dlr",
    "overground",
    "tflrail",
    "tram"
  ],

  start: function() {
    this.loaded = false;
    this.alertsObj = null;
    this.currentAlertIndex = 0;
    this.pollTimer = null;
    this.carouselTimer = null;
    this.carouselStarted = false;

    /* sanitize input */
    this.config.modes = this.sanitizeModes(this.config.modes);

    var self = this;

    this.sendSocketNotification("GET_LONDON_TRANSIT_STATUS", this.config);
    this.pollTimer = setInterval(function() {
      self.sendSocketNotification("GET_LONDON_TRANSIT_STATUS", this.config);
    }, this.config.dataPollInterval);
  },

  startCarouselTimer: function() {
    var self = this;
    this.carouselTimer = setInterval(function() {
      self.updateDom(self.config.animationSpeed);
    }, this.config.alertCarouselInterval);
    this.carouselStarted = true;
  },

  getStyles: function () {
    return ["MMM-LondonTransitStatus.css"];
  },

  svgIconFactory: function(glyph) {

    var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttributeNS(null, "class", glyph);
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttributeNS("http://www.w3.org/1999/xlink", "href", this.file("icon_sprite.svg#") + glyph);
    svg.appendChild(use);
    
    return(svg);
  },   


  getDom: function() {


    var wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");


    if (!this.loaded) {
      wrapper.innerHTML = this.translate("LOADING");
      wrapper.className = "dimmed light small";
      return wrapper;
    }

    if (this.alertsObj.length == 0 && !this.hideIfNoAlerts) {
      var allGoodDiv = document.createElement("div");
      allGoodDiv.classList.add("all-good-service");
      allGoodDiv.innerHTML = "No service interuptions to report";
      wrapper.appendChild(allGoodDiv);
      return wrapper;
    }

    //check to see if there is a next index.  If not, reset to zero.
    var alert;
    if (this.alertsObj[this.currentAlertIndex]) {
      alert = this.alertsObj[this.currentAlertIndex];
    } else {
      this.currentAlertIndex = 0;
      alert = this.alertsObj[0];
    }

    var alertDiv = document.createElement("div");
    alertDiv.classList.add("alert", alert.lineId, alert.transportMode);

    if (this.alertsObj.length > 1) {
      var carouselCount = document.createElement("span");
      carouselCount.classList.add("carousel-count");
      carouselCount.innerHTML = (this.currentAlertIndex + 1) + "/" + this.alertsObj.length;
      alertDiv.appendChild(carouselCount);
    }
    alertDiv.appendChild(this.svgIconFactory("alert-icon"));

    var line = document.createElement("span");
    line.classList.add("line-name");

    //add icons
    if (alert.transportMode == "bus") {
      line.appendChild(this.svgIconFactory("double-decker-bus-icon"));
    } else {
      line.appendChild(this.svgIconFactory("tube-icon"));
    }
    
    var lineTxt = document.createTextNode(alert.lineName);
    line.appendChild(lineTxt);
    alertDiv.appendChild(line);

    var alertType = document.createElement("span");
    alertType.classList.add("alert-type", "sev-" + alert.statusSeverity);
    alertType.innerHTML = alert.statusShort;
    alertDiv.appendChild(alertType);

    var alertDesc = document.createElement("span");
    alertDesc.classList.add("alert-desc");
    alertDesc.innerHTML = alert.statusLong;
    alertDiv.appendChild(alertDesc);

    wrapper.appendChild(alertDiv);

    this.currentAlertIndex = this.currentAlertIndex + 1;
    if (!this.carouselStarted) {
      this.startCarouselTimer();
    }
    return wrapper;


  },

  socketNotificationReceived: function(notification, payload) {
    if (notification == "LONDON_TRANSIT_STATUS") {
      this.alertsObj = payload;
      if (!this.loaded) {
        this.loaded = true;
        this.updateDom(this.config.animationSpeed);      
      }
    } 
  },

  sanitizeModes: function(str) {
    var inputModes = str.split(",");
    var sanitizedModes = [];

    for (var i = 0; i < inputModes.length; i++) {
      if (this.transitModes.indexOf(inputModes[i]) != -1) {
        sanitizedModes.push(inputModes[i]);
      } 
    }

    return sanitizedModes.join(",");
  }

});