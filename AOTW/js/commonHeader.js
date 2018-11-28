addSearchBtnClickListener();
initTopPopover();

function addSearchBtnClickListener() {
	document.getElementById('searchBtn').onclick = function() {
		mui.openWindow({
			url : "searchGroups.html",
			id : "searchGroups.html"
		})
	}
}

function initTopPopover() {
	var menus = document.getElementById('topMenu').getElementsByTagName('li');
	var createGroupMenu = menus[0];
	var joinGroupMenu = menus[1];
	var scanMenu = menus[2];
	
	createGroupMenu.onclick = function() {
		mui.openWindow({
			url : 'createGroup.html',
			id : 'createGroup.html'
		})
		mui('#topPopover').popover('hide');
	}
	
	joinGroupMenu.onclick = function() {
		mui.openWindow({
			url : "searchGroups.html",
			id : "searchGroups.html"
		})
		mui('#topPopover').popover('hide');
	}
	
	scanMenu.onclick = function() {
		mui.openWindow({
			url : "barcodeScan.html",
			id : "barcodeScan.html"
		})
		mui('#topPopover').popover('hide');
	}
}