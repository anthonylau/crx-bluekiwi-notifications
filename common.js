var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-40637862-1']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var BASE_URL = "https://zen.myatos.net";
var NOTIF_URL = BASE_URL + "/notification/updater"
var NOTIF_FEED_URL = BASE_URL + "/notification/get?offset=0"
var NOTIF_READ_URL = BASE_URL + "/notification/read";

var FETCH_INTERVAL = 2 * 60 * 1000;
var ALARM_NAME = "notification_checker";
