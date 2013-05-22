var notification = null;

function init(){
	chrome.runtime.onInstalled.addListener(function(details){
		var thisVersion = chrome.runtime.getManifest().version;
		if(details.reason == "install"){
			_gaq.push(['_trackEvent', 'ext', 'install', thisVersion]);
		}else if(details.reason == "update"){
			_gaq.push(['_trackEvent', 'ext', 'update', thisVersion]);
			//console.log("Updated from " + details.previousVersion + " to " + thisVersion +" + !");
		}
		//check if bkurl is set
		chrome.storage.sync.get('bkurl', function(items){
			if(!items.bkurl){
				chrome.tabs.create({ url: 'options.html' });
			}
		});
	});
	var t = setInterval(checkUpdate, FETCH_INTERVAL);

	//TODO use alarms instead of setInterval as suggested by Chrome extension guidline
	/*
	chrome.alarms.create(ALARM_NAME, {
		periodInMinutes: 1
	});
	*/
	checkUpdate();

	/*
	//for testing
	var notification = webkitNotifications.createHTMLNotification(
	  'notification.html#1'  // html url - can be relative
	);
	notification.show();
	chrome.extension.getViews({type:"notification"}).forEach(function(win) {
	  console.log(win);
	});
	});
	*/
}
var evtNotifSrc = 'bg-notif';

function clearNotification(){
	if(notification != null){
		notification.cancel();
		notification = null;
		//_gaq.push(['_trackEvent', evtNotifSrc, 'canceled']);
	}
}

function checkUpdate(){
	console.log('checking update');
	chrome.storage.sync.get('bkurl', function(items){
		var bkurl = items.bkurl;
		if(bkurl){
			var notifurl = bkurl + NOTIF_URL;
			console.log('check notification with ' + notifurl);
			$.get(notifurl, function(data){
				if(typeof data.data === 'undefined'){
					chrome.browserAction.setBadgeText( { text: "ERR"} );
				}else{
					var binding = data.data.binding;
					$.each( binding, function(idx, val){
						if(idx == "/instance"){
							console.log("# of notification: " + val.notification);
							var badgeText = "";
							if(val.notification > 0){
								badgeText = "" + val.notification;
								
								if(notification == null){
									_gaq.push(['_trackEvent', evtNotifSrc, 'created']);
								}
								clearNotification();
								notification = webkitNotifications.createNotification(
								  'img/icon128.png',  // icon url - can be relative
								  'You have ' + val.notification + ' notification' + (val.notification > 1?'s':'')+ '!',  // notification title
								  ''  // notification body text
								);
								
								notification.onclose = function(){
									//_gaq.push(['_trackEvent', evtNotifSrc, 'closed']);
									notification = null;							
								};
								notification.onclick = function(){
									_gaq.push(['_trackEvent', evtNotifSrc, 'clicked']);
									chrome.tabs.create({ url: bkurl });
									clearNotification();
								};
								notification.show();
							}else{
								clearNotification();
							}
							chrome.browserAction.setBadgeText( { text: badgeText} );
						}
					});
				}
			})
			.fail(function(){console.log("failed to fetch notification data")});
		}
	});
}

init();
