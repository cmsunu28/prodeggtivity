function getWorkPlayTabs() {
	chrome.storage.sync.get("worktabs", function (worktablist) {
		worktabs=cleanUrlList(worktablist);
	});

	chrome.storage.sync.get("playtabs", function (playtablist) {
	    console.log(typeof(playtablist));
		playtabs=cleanUrlList(playtablist);
	});	
}

function cleanUrlList(tablist) {
	tabs=String(tablist).split("\n");
	for (x=0; x<tabs.length; x++) {
		if (tabs[x].includes("//")) {
			tabs[x]=tabs[x].split("//")[1];
		}
	}
	return tabs;
}

function getActiveTabSource() {
	var url;
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    	url = tabs[0].url;
    	console.log(url);
	});
	var sourceUrl=String(url).split("/")[2];
	return sourceUrl;
}

function checkTabs(source, tabs) {
	var counter=0;
	for (r=0; r<tabs.length; r++) {
		if (tabs.includes(source)) {
			counter++;
		}
	}
	if (counter>0) {
		return true;
	}
	else {
		return false;
	}
}

chrome.webNavigation.onCompleted.addListener(function () {
	newNavigation();
});

chrome.tabs.onActivated.addListener(function () {
	newNavigation();
});

// chrome.webNavigation.onHistoryStatusUpdated.addListener(function () {
// 	console.log("update nav");
// 	updateNav();
// });

var worktabs;
var playtabs;
var token;
var device;

chrome.storage.sync.get("worktabs", function (worktablist) {
		worktabs=cleanUrlList(worktablist.worktabs);
	})
chrome.storage.sync.get("playtabs", function (playtablist) {
		playtabs=cleanUrlList(playtablist.playtabs);
	})
chrome.storage.sync.get("token", function (obj) {
		token=obj.token;
	})
chrome.storage.sync.get("device", function (obj) {
		device=obj.device;
	})

var lastEvent;

function sendEvent(eventVal) {
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'https://api.particle.io/v1/devices/'+device+'/tap?access_token='+token, true);
    xhttp.send('arg='+eventVal);
    //actually send stuff here...
}

function newNavigation() {
	// getWorkPlayTabs();
	// sourceUrl=getAciveTabSource();
	 
	var url;
	var sourceUrl;
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    	if (tabs!=undefined) {
	    	url = tabs[0].url;
        	var urlArray=url.split("/");
	    	if (urlArray[2].split(".")[0]=="www") {
	    		sourceUrl=urlArray[2].split(".")[1]+"."+urlArray[2].split(".")[2]
	    	}
	    	else {
	    		sourceUrl=urlArray[2];
	    	}

			if (checkTabs(sourceUrl, worktabs)) {
				// if it is in worktabs, then start productivity
				console.log("send event for production!");
				sendEvent("1");
				lastEvent=1;
			}
			else if (checkTabs(sourceUrl,playtabs)) {
				// if it is in playtabs, then stop productivity
				console.log("send event to stop production!");
				sendEvent("-1");
				lastEvent=-1;
			}
			else {
				// otherwise, run at a regular rate without doing anything crazy
				console.log("send event to keep doing whatever you were doing...");
				sendEvent("0");
				lastEvent=0;
			}
    	}

	});

	// var sourceUrl=String(url).split("/")[2];
	
}

function updateNav() {
	console.log("Redo lastEvent, which was:");
	console.log(lastEvent);
}