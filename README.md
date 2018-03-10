# MMM-LondonTransitStatus

This a module for <strong>MagicMirror</strong><br>
https://magicmirror.builders/<br>
https://github.com/MichMich/MagicMirror

This module displays status alerts for TfL London Transport.

## Installation

1. Navigate to your MagicMirro `modules` directory and execute<br>
`git clone https://github.com/jclarke0000/MMM-LondonTransitStatus.git`
2. Enter the new `MMM-LondonTransitStatus` directory and execute `npm install`.

## London Transport API Application ID and Key

You may use this without an API App ID and Key, but you might run into rate limiting.  With an App ID and Key your rate limit increases to 500 requests per minute – far more than you'll ever need for this module.

Register for an API App ID and Key here:
<a href="https://api.tfl.gov.uk/" target="_blank">https://api.tfl.gov.uk/</a>

## Configuration

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>app_id</code></td>
      <td>Your Application ID as provided by registering at https://api.tfl.gov.uk/<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>""</code>.</td>
    </tr>
    <tr>
      <td><code>app_key</code></td>
      <td>Your Application Key as provided by registering at https://api.tfl.gov.uk/<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>""</code>.</td>
    </tr>
    <tr>
      <td><code>modes</code></td>
      <td>Comma delinetated string indicating the transit modes to show alerts for.  Valid options are <code>tube</code>, <code>dlr</code>, <code>overground</code>, <code>tflrail</code> and <code>tram</code>. Alerts for bus routes are specified with the <code>busLines</code> property.  if you ONLY want to show alerts for bus lines, then make sure <code>modes</code> is specified as <code>""</code>.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"tube"</code>.</td>
    </tr>
    <tr>
      <td><code>busLines</code></td>
      <td>While it's technically possible to poll the API for the entire bus system, there are over 300 routes and the query takes some time.  Likely you are only interested in a handful of routes, so specify them by number here.  Separate multiple route numbers with commas.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>""</code>.</td>
    </tr>
    <tr>
      <td><code>dataPollInterval</code></td>
      <td>How frequently to poll the TfL API for status alerts.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>300000</code> (5 minutes).</td>
    </tr>
    <tr>
      <td><code>alertCarouselInterval</code></td>
      <td>In the case of multiple alerts, only one will be shown at a time. This specifies how long an alert stays on screen before cycling to the next one.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>30000</code> (30 seconds).</td>
    </tr>
    <tr>
      <td><code>animationSpeed</code></td>
      <td>Fade duration when transitioning between alerts and hiding / showing the module.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>1000</code> (1 second).</td>
    </tr>
    <tr>
      <td><code>hideIfNoAlerts</code></td>
      <td>Whether the module should hide itself if there are no alerts to display.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code>.</td>
    </tr>
    <tr>
      <td><code>noAlertsMessage</code></td>
      <td>Message to be displayed when there are no system alerts. Not shown if <code>hideIfNoAlerts</code> is set to <code>true</code>.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"All clear! No service interruptions."</code>.</td>
    </tr>

  </tbody>
</table>

## Sample Config

```
{
  module: "MMM-LondonTransitStatus",
  position: "top_right",
  config: {
    app_id: "** Your App ID **",
    app_key: "** Your App Key **",
    modes: "tube,dlr,overground,tflrail,tram",
    busLines: "27,97,237,391,H91,267",
    alertCarouselInterval: 15000, //15 seconds
    dataPollInterval: 60000 //one minute
  }
},
```