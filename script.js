(function(){
    var script = {
 "start": "this.init()",
 "scrollBarVisible": "rollOver",
 "mobileMipmappingEnabled": false,
 "height": "100%",
 "id": "rootPlayer",
 "vrPolyfillScale": 1,
 "minHeight": 20,
 "scrollBarMargin": 2,
 "desktopMipmappingEnabled": false,
 "width": "100%",
 "children": [
  "this.MainViewer",
  "this.Container_AD0CA7F8_BA53_6FC4_4187_7494AA37F1CC"
 ],
 "scrollBarOpacity": 0.5,
 "backgroundPreloadEnabled": true,
 "borderSize": 0,
 "layout": "absolute",
 "paddingLeft": 0,
 "defaultVRPointer": "laser",
 "shadow": false,
 "scrollBarWidth": 10,
 "downloadEnabled": false,
 "scripts": {
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "unregisterKey": function(key){  delete window[key]; },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "getKey": function(key){  return window[key]; },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "existsKey": function(key){  return key in window; },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "registerKey": function(key, value){  window[key] = value; },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); }
 },
 "contentOpaque": false,
 "borderRadius": 0,
 "horizontalAlign": "left",
 "paddingRight": 0,
 "propagateClick": false,
 "class": "Player",
 "verticalAlign": "top",
 "mouseWheelEnabled": true,
 "scrollBarColor": "#000000",
 "overflow": "visible",
 "data": {
  "name": "Player460"
 },
 "paddingTop": 0,
 "gap": 10,
 "paddingBottom": 0,
 "definitions": [{
 "initialPosition": {
  "yaw": 84.49,
  "class": "PanoramaCameraPosition",
  "pitch": -5.88
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A091509B_BA53_2045_41E3_28996935DE61",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_camera",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": 0.73,
  "class": "PanoramaCameraPosition",
  "pitch": -2.94
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A11B71A3_BA53_2045_41CD_8B3B5D5E8BFB",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": 85.22,
  "class": "PanoramaCameraPosition",
  "pitch": -2.2
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A146B157_BA53_20CD_41DC_EC4564FA3950",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "buttonCardboardView": "this.IconButton_AD0D57F8_BA53_6FC4_41D3_5EAE2CEEA553",
 "mouseControlMode": "drag_acceleration",
 "viewerArea": "this.MainViewer",
 "class": "PanoramaPlayer",
 "id": "MainViewerPanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "touchControlMode": "drag_rotation",
 "displayPlaybackBar": true
},
{
 "headerPaddingBottom": 10,
 "bodyBorderSize": 0,
 "id": "window_A0C55568_B989_42C8_41CA_7AC30A91CADF",
 "width": 400,
 "minHeight": 20,
 "closeButtonIconLineWidth": 2,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "closeButtonIconWidth": 12,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "headerPaddingLeft": 10,
 "closeButtonBorderSize": 0,
 "shadowSpread": 1,
 "veilOpacity": 0.4,
 "closeButtonIconColor": "#000000",
 "headerBorderColor": "#000000",
 "footerBackgroundOpacity": 1,
 "modal": true,
 "bodyBorderColor": "#000000",
 "closeButtonBackgroundOpacity": 1,
 "shadow": true,
 "closeButtonPaddingRight": 0,
 "closeButtonPressedIconColor": "#FFFFFF",
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "backgroundOpacity": 1,
 "closeButtonBackgroundColorRatios": [],
 "footerBorderSize": 0,
 "closeButtonIconHeight": 12,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "closeButtonPaddingLeft": 0,
 "height": 600,
 "bodyPaddingRight": 5,
 "veilShowEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "horizontalAlign": "center",
 "headerPaddingRight": 10,
 "closeButtonBorderRadius": 11,
 "title": "NEW ARRIVALS",
 "veilColorRatios": [
  0,
  1
 ],
 "veilColorDirection": "horizontal",
 "backgroundColor": [],
 "paddingRight": 0,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "verticalAlign": "middle",
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "propagateClick": false,
 "closeButtonBackgroundColor": [],
 "showEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "titleFontColor": "#000000",
 "titlePaddingLeft": 5,
 "closeButtonPaddingTop": 0,
 "class": "Window",
 "bodyBackgroundColorDirection": "vertical",
 "titleFontWeight": "normal",
 "titlePaddingBottom": 5,
 "overflow": "scroll",
 "footerBorderColor": "#000000",
 "shadowVerticalLength": 0,
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "footerHeight": 5,
 "closeButtonBackgroundColorDirection": "vertical",
 "headerVerticalAlign": "middle",
 "minWidth": 20,
 "hideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "backgroundColorDirection": "vertical",
 "veilHideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "scrollBarMargin": 2,
 "shadowColor": "#000000",
 "borderSize": 0,
 "layout": "vertical",
 "children": [
  "this.htmlText_A0C7656F_B989_42C8_41C7_7365EAB2C234",
  "this.image_uidA0AA1031_BA53_2044_4158_F8BFB2FF9D20_1"
 ],
 "closeButtonBorderColor": "#000000",
 "headerBackgroundOpacity": 1,
 "headerBackgroundColorDirection": "vertical",
 "paddingLeft": 0,
 "shadowBlurRadius": 6,
 "titleFontStyle": "normal",
 "bodyPaddingLeft": 5,
 "bodyPaddingBottom": 5,
 "scrollBarWidth": 10,
 "shadowOpacity": 0.5,
 "borderRadius": 5,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "contentOpaque": false,
 "bodyPaddingTop": 5,
 "footerBackgroundColorDirection": "vertical",
 "backgroundColorRatios": [],
 "titlePaddingRight": 5,
 "headerPaddingTop": 10,
 "titleFontSize": "1.29vmin",
 "titlePaddingTop": 5,
 "headerBorderSize": 0,
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "closeButtonRollOverIconColor": "#FFFFFF",
 "scrollBarColor": "#000000",
 "titleTextDecoration": "none",
 "data": {
  "name": "Window42705"
 },
 "paddingTop": 0,
 "gap": 10,
 "bodyBackgroundOpacity": 1,
 "paddingBottom": 0,
 "scrollBarOpacity": 0.5,
 "closeButtonPaddingBottom": 0,
 "shadowHorizontalLength": 3,
 "scrollBarVisible": "rollOver",
 "titleFontFamily": "Arial"
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "thumbnailUrl": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "id": "panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F",
 "label": "A_4 - Panorama",
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_t.jpg",
 "vfov": 180,
 "pitch": 0,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3D480A3_B989_4278_41C6_A6E2BB574012",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC",
   "class": "AdjacentPanorama"
  }
 ],
 "hfovMin": "120%",
 "partial": false,
 "overlays": [
  "this.overlay_AD8A6EB0_B988_DE58_41DF_E605715D42A3",
  "this.overlay_AD54ED1C_B989_4248_41C8_08CD77C6E014",
  "this.overlay_AD2028E6_B98F_C3F8_41E4_29F256AECBFE",
  "this.overlay_ACD1CA0D_B989_4648_41D6_EE696B077875",
  "this.overlay_ACFA39CE_B98B_C5C8_41DC_2AC01FDF370D",
  "this.overlay_AC4F30C0_B989_C238_41DB_10EE51EC62A0"
 ]
},
{
 "initialPosition": {
  "yaw": -53.63,
  "class": "PanoramaCameraPosition",
  "pitch": -5.88
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A30F030B_BA53_2045_41D9_38BB964D1F19",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "label": "Daikin FXUQ71-500x500.product_popup",
 "id": "photo_A2D7E83A_B98B_4248_41D1_94B2E2B8AC44",
 "width": 500,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/photo_A2D7E83A_B98B_4248_41D1_94B2E2B8AC44.jpg",
    "class": "ImageResourceLevel"
   }
  ]
 },
 "class": "Photo",
 "thumbnailUrl": "media/photo_A2D7E83A_B98B_4248_41D1_94B2E2B8AC44_t.jpg",
 "duration": 5000,
 "height": 500
},
{
 "items": [
  {
   "media": "this.panorama_B3D480A3_B989_4278_41C6_A6E2BB574012",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3",
   "end": "this.trigger('tourEnded')",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 0)",
   "player": "this.MainViewerPanoramaPlayer"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_camera",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": 99.92,
  "class": "PanoramaCameraPosition",
  "pitch": -1.47
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A08A20C2_BA53_21C7_4190_7E9A2946A929",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": 67.59,
  "class": "PanoramaCameraPosition",
  "pitch": 0.73
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A3EEE38A_BA53_2047_41C9_4D9109E17392",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": -29.39,
  "class": "PanoramaCameraPosition",
  "pitch": -36
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A139A171_BA53_20C5_41E2_7D992EAAB151",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": -0.73,
  "class": "PanoramaCameraPosition",
  "pitch": -27.18
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A10D61BC_BA53_2043_41E4_596246DAE8AE",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "thumbnailUrl": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "id": "panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3",
 "label": "A_7 - Panorama",
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_t.jpg",
 "vfov": 180,
 "pitch": 0,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0",
   "class": "AdjacentPanorama"
  }
 ],
 "hfovMin": "120%",
 "partial": false,
 "overlays": [
  "this.overlay_A1E04FEA_B988_DDCB_41E1_BFBC488FBE9F"
 ]
},
{
 "initialPosition": {
  "yaw": -109.47,
  "class": "PanoramaCameraPosition",
  "pitch": -8.82
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A31CF2BB_BA53_2045_41CD_3B405E922F82",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": -166.04,
  "class": "PanoramaCameraPosition",
  "pitch": 1.47
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A31992D6_BA53_21CF_41D5_8D976AE3DDD5",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "headerPaddingBottom": 10,
 "bodyBorderSize": 0,
 "id": "window_A3220815_B9B8_C258_41E6_F560578C0F0C",
 "width": 400,
 "minHeight": 20,
 "closeButtonIconLineWidth": 2,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "closeButtonIconWidth": 12,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "headerPaddingLeft": 10,
 "headerBorderColor": "#000000",
 "shadowSpread": 1,
 "veilOpacity": 0.4,
 "closeButtonIconColor": "#000000",
 "modal": true,
 "bodyBorderColor": "#000000",
 "shadow": true,
 "closeButtonPressedIconColor": "#FFFFFF",
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "backgroundOpacity": 1,
 "closeButtonBackgroundColorRatios": [],
 "closeButtonIconHeight": 12,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "height": 600,
 "bodyPaddingRight": 5,
 "veilShowEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "horizontalAlign": "center",
 "headerPaddingRight": 10,
 "closeButtonBorderRadius": 11,
 "title": "RAINCOATS",
 "veilColorRatios": [
  0,
  1
 ],
 "veilColorDirection": "horizontal",
 "backgroundColor": [],
 "paddingRight": 0,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "verticalAlign": "middle",
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "propagateClick": false,
 "closeButtonBackgroundColor": [],
 "showEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "titleFontColor": "#000000",
 "titlePaddingLeft": 5,
 "shadowVerticalLength": 0,
 "class": "Window",
 "bodyBackgroundColorDirection": "vertical",
 "titleFontWeight": "normal",
 "titlePaddingBottom": 5,
 "overflow": "scroll",
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "footerHeight": 5,
 "headerVerticalAlign": "middle",
 "minWidth": 20,
 "hideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "backgroundColorDirection": "vertical",
 "veilHideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "scrollBarMargin": 2,
 "shadowColor": "#000000",
 "borderSize": 0,
 "layout": "vertical",
 "children": [
  "this.htmlText_A321D816_B9B8_C258_41E0_FCC7D0849C7B",
  "this.image_uidA0A87037_BA53_204C_41DE_10D995EA830B_1"
 ],
 "headerBackgroundOpacity": 1,
 "headerBackgroundColorDirection": "vertical",
 "paddingLeft": 0,
 "shadowBlurRadius": 6,
 "titleFontStyle": "normal",
 "bodyPaddingLeft": 5,
 "bodyPaddingBottom": 5,
 "scrollBarWidth": 10,
 "shadowOpacity": 0.5,
 "borderRadius": 5,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "contentOpaque": false,
 "bodyPaddingTop": 5,
 "footerBackgroundColorDirection": "vertical",
 "backgroundColorRatios": [],
 "titlePaddingRight": 5,
 "headerPaddingTop": 10,
 "titleFontSize": "1.29vmin",
 "titlePaddingTop": 5,
 "headerBorderSize": 0,
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "closeButtonRollOverIconColor": "#FFFFFF",
 "scrollBarColor": "#000000",
 "titleTextDecoration": "none",
 "data": {
  "name": "Window48317"
 },
 "paddingTop": 0,
 "gap": 10,
 "bodyBackgroundOpacity": 1,
 "paddingBottom": 0,
 "scrollBarOpacity": 0.5,
 "shadowHorizontalLength": 3,
 "scrollBarVisible": "rollOver",
 "titleFontFamily": "Arial"
},
{
 "headerPaddingBottom": 10,
 "bodyBorderSize": 0,
 "id": "window_A3563EA2_B989_FE78_41DD_5551D2C66245",
 "width": 400,
 "minHeight": 20,
 "closeButtonIconLineWidth": 2,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "closeButtonIconWidth": 12,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "headerPaddingLeft": 10,
 "headerBorderColor": "#000000",
 "shadowSpread": 1,
 "veilOpacity": 0.4,
 "closeButtonIconColor": "#000000",
 "modal": true,
 "bodyBorderColor": "#000000",
 "shadow": true,
 "closeButtonPressedIconColor": "#FFFFFF",
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "backgroundOpacity": 1,
 "closeButtonBackgroundColorRatios": [],
 "closeButtonIconHeight": 12,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "height": 600,
 "bodyPaddingRight": 5,
 "veilShowEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "horizontalAlign": "center",
 "headerPaddingRight": 10,
 "closeButtonBorderRadius": 11,
 "title": "AIR CONDITIONER",
 "veilColorRatios": [
  0,
  1
 ],
 "veilColorDirection": "horizontal",
 "backgroundColor": [],
 "paddingRight": 0,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "verticalAlign": "middle",
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "propagateClick": false,
 "closeButtonBackgroundColor": [],
 "showEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "titleFontColor": "#000000",
 "titlePaddingLeft": 5,
 "shadowVerticalLength": 0,
 "class": "Window",
 "bodyBackgroundColorDirection": "vertical",
 "titleFontWeight": "normal",
 "titlePaddingBottom": 5,
 "overflow": "scroll",
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "footerHeight": 5,
 "headerVerticalAlign": "middle",
 "minWidth": 20,
 "hideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "backgroundColorDirection": "vertical",
 "veilHideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "scrollBarMargin": 2,
 "shadowColor": "#000000",
 "borderSize": 0,
 "layout": "vertical",
 "children": [
  "this.htmlText_A350FEA3_B989_FE78_41A7_3FD527AA27CC",
  "this.image_uidA0A68039_BA53_2044_41B5_3051F37A4C39_1"
 ],
 "headerBackgroundOpacity": 1,
 "headerBackgroundColorDirection": "vertical",
 "paddingLeft": 0,
 "shadowBlurRadius": 6,
 "titleFontStyle": "normal",
 "bodyPaddingLeft": 5,
 "bodyPaddingBottom": 5,
 "scrollBarWidth": 10,
 "shadowOpacity": 0.5,
 "borderRadius": 5,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "contentOpaque": false,
 "bodyPaddingTop": 5,
 "footerBackgroundColorDirection": "vertical",
 "backgroundColorRatios": [],
 "titlePaddingRight": 5,
 "headerPaddingTop": 10,
 "titleFontSize": "1.29vmin",
 "titlePaddingTop": 5,
 "headerBorderSize": 0,
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "closeButtonRollOverIconColor": "#FFFFFF",
 "scrollBarColor": "#000000",
 "titleTextDecoration": "none",
 "data": {
  "name": "Window51624"
 },
 "paddingTop": 0,
 "gap": 10,
 "bodyBackgroundOpacity": 1,
 "paddingBottom": 0,
 "scrollBarOpacity": 0.5,
 "shadowHorizontalLength": 3,
 "scrollBarVisible": "rollOver",
 "titleFontFamily": "Arial"
},
{
 "headerPaddingBottom": 10,
 "bodyBorderSize": 0,
 "id": "window_A3357EBC_B98B_FE48_415C_6D45A765702A",
 "width": 400,
 "minHeight": 20,
 "closeButtonIconLineWidth": 2,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "closeButtonIconWidth": 12,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "headerPaddingLeft": 10,
 "headerBorderColor": "#000000",
 "shadowSpread": 1,
 "veilOpacity": 0.4,
 "closeButtonIconColor": "#000000",
 "modal": true,
 "bodyBorderColor": "#000000",
 "shadow": true,
 "closeButtonPressedIconColor": "#FFFFFF",
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "backgroundOpacity": 1,
 "closeButtonBackgroundColorRatios": [],
 "closeButtonIconHeight": 12,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "height": 600,
 "bodyPaddingRight": 5,
 "veilShowEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "horizontalAlign": "center",
 "headerPaddingRight": 10,
 "closeButtonBorderRadius": 11,
 "title": "BIKER JACKET",
 "veilColorRatios": [
  0,
  1
 ],
 "veilColorDirection": "horizontal",
 "backgroundColor": [],
 "paddingRight": 0,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "verticalAlign": "middle",
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "propagateClick": false,
 "closeButtonBackgroundColor": [],
 "showEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "titleFontColor": "#000000",
 "titlePaddingLeft": 5,
 "shadowVerticalLength": 0,
 "class": "Window",
 "bodyBackgroundColorDirection": "vertical",
 "titleFontWeight": "normal",
 "titlePaddingBottom": 5,
 "overflow": "scroll",
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "footerHeight": 5,
 "headerVerticalAlign": "middle",
 "minWidth": 20,
 "hideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "backgroundColorDirection": "vertical",
 "veilHideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "scrollBarMargin": 2,
 "shadowColor": "#000000",
 "borderSize": 0,
 "layout": "vertical",
 "children": [
  "this.htmlText_A3372EBD_B98B_FE48_41E6_3385C67D3A9D",
  "this.image_uidA0A7E038_BA53_2044_41E4_DF0CEF8F4108_1"
 ],
 "headerBackgroundOpacity": 1,
 "headerBackgroundColorDirection": "vertical",
 "paddingLeft": 0,
 "shadowBlurRadius": 6,
 "titleFontStyle": "normal",
 "bodyPaddingLeft": 5,
 "bodyPaddingBottom": 5,
 "scrollBarWidth": 10,
 "shadowOpacity": 0.5,
 "borderRadius": 5,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "contentOpaque": false,
 "bodyPaddingTop": 5,
 "footerBackgroundColorDirection": "vertical",
 "backgroundColorRatios": [],
 "titlePaddingRight": 5,
 "headerPaddingTop": 10,
 "titleFontSize": "1.29vmin",
 "titlePaddingTop": 5,
 "headerBorderSize": 0,
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "closeButtonRollOverIconColor": "#FFFFFF",
 "scrollBarColor": "#000000",
 "titleTextDecoration": "none",
 "data": {
  "name": "Window49705"
 },
 "paddingTop": 0,
 "gap": 10,
 "bodyBackgroundOpacity": 1,
 "paddingBottom": 0,
 "scrollBarOpacity": 0.5,
 "shadowHorizontalLength": 3,
 "scrollBarVisible": "rollOver",
 "titleFontFamily": "Arial"
},
{
 "initialPosition": {
  "yaw": -120.49,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A3E6C3A2_BA53_2047_41D0_B79086B1AD51",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_camera",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": 77.14,
  "class": "PanoramaCameraPosition",
  "pitch": -8.08
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A3F48372_BA53_20C7_41D1_69B7B371FCD3",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "label": "Screenshot 2023-12-30 141436",
 "id": "photo_A03468B9_B9BB_4248_41D0_28BECE50992E",
 "width": 483,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/photo_A03468B9_B9BB_4248_41D0_28BECE50992E.png",
    "class": "ImageResourceLevel"
   }
  ]
 },
 "class": "Photo",
 "thumbnailUrl": "media/photo_A03468B9_B9BB_4248_41D0_28BECE50992E_t.png",
 "duration": 5000,
 "height": 514
},
{
 "initialPosition": {
  "yaw": 19.1,
  "class": "PanoramaCameraPosition",
  "pitch": -5.14
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A08070D9_BA53_21C7_41D1_31635BD87B4D",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_camera",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": 97.71,
  "class": "PanoramaCameraPosition",
  "pitch": -5.14
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A1EFD1EC_BA53_23C3_41E0_C76D4BCE1B28",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": 16.16,
  "class": "PanoramaCameraPosition",
  "pitch": -13.22
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A16C310A_BA53_2045_41E2_F94FAE99E674",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_camera",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "headerPaddingBottom": 10,
 "bodyBorderSize": 0,
 "id": "window_A211D40F_B989_4248_4190_6CD9A0535906",
 "width": 400,
 "minHeight": 20,
 "closeButtonIconLineWidth": 2,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "closeButtonIconWidth": 12,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "headerPaddingLeft": 10,
 "headerBorderColor": "#000000",
 "shadowSpread": 1,
 "veilOpacity": 0.4,
 "closeButtonIconColor": "#000000",
 "modal": true,
 "bodyBorderColor": "#000000",
 "shadow": true,
 "closeButtonPressedIconColor": "#FFFFFF",
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "backgroundOpacity": 1,
 "closeButtonBackgroundColorRatios": [],
 "closeButtonIconHeight": 12,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "height": 600,
 "bodyPaddingRight": 5,
 "veilShowEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "horizontalAlign": "center",
 "headerPaddingRight": 10,
 "closeButtonBorderRadius": 11,
 "title": "SPOTLIGHT",
 "veilColorRatios": [
  0,
  1
 ],
 "veilColorDirection": "horizontal",
 "backgroundColor": [],
 "paddingRight": 0,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "verticalAlign": "middle",
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "propagateClick": false,
 "closeButtonBackgroundColor": [],
 "showEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "titleFontColor": "#000000",
 "titlePaddingLeft": 5,
 "shadowVerticalLength": 0,
 "class": "Window",
 "bodyBackgroundColorDirection": "vertical",
 "titleFontWeight": "normal",
 "titlePaddingBottom": 5,
 "overflow": "scroll",
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "footerHeight": 5,
 "headerVerticalAlign": "middle",
 "minWidth": 20,
 "hideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "backgroundColorDirection": "vertical",
 "veilHideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "scrollBarMargin": 2,
 "shadowColor": "#000000",
 "borderSize": 0,
 "layout": "vertical",
 "children": [
  "this.htmlText_A5EE0415_B989_4258_414F_EA6F0B3F8877",
  "this.image_uidA0A6203B_BA53_2045_41D1_133AE5A0A3FE_1"
 ],
 "headerBackgroundOpacity": 1,
 "headerBackgroundColorDirection": "vertical",
 "paddingLeft": 0,
 "shadowBlurRadius": 6,
 "titleFontStyle": "normal",
 "bodyPaddingLeft": 5,
 "bodyPaddingBottom": 5,
 "scrollBarWidth": 10,
 "shadowOpacity": 0.5,
 "borderRadius": 5,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "contentOpaque": false,
 "bodyPaddingTop": 5,
 "footerBackgroundColorDirection": "vertical",
 "backgroundColorRatios": [],
 "titlePaddingRight": 5,
 "headerPaddingTop": 10,
 "titleFontSize": "1.29vmin",
 "titlePaddingTop": 5,
 "headerBorderSize": 0,
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "closeButtonRollOverIconColor": "#FFFFFF",
 "scrollBarColor": "#000000",
 "titleTextDecoration": "none",
 "data": {
  "name": "Window53103"
 },
 "paddingTop": 0,
 "gap": 10,
 "bodyBackgroundOpacity": 1,
 "paddingBottom": 0,
 "scrollBarOpacity": 0.5,
 "shadowHorizontalLength": 3,
 "scrollBarVisible": "rollOver",
 "titleFontFamily": "Arial"
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "thumbnailUrl": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "id": "panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC",
 "label": "A_2 - Panorama",
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_t.jpg",
 "vfov": 180,
 "pitch": 0,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3D480A3_B989_4278_41C6_A6E2BB574012",
   "class": "AdjacentPanorama"
  }
 ],
 "hfovMin": "120%",
 "partial": false,
 "overlays": [
  "this.overlay_ABAD4E95_B9FB_FE59_41D1_0F83D6F199FB",
  "this.overlay_ADD37B4E_B9F9_46C8_41DA_5FC2DB953EB7",
  "this.overlay_AAB677E1_B9FB_4DF8_41D4_6C4F0FE47198",
  "this.overlay_AA665158_B9F8_C2C8_41E1_1510DF6C02B4"
 ]
},
{
 "initialPosition": {
  "yaw": 27.92,
  "class": "PanoramaCameraPosition",
  "pitch": -1.47
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A32052A2_BA53_2047_41D5_D804AEB57D3B",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "thumbnailUrl": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "id": "panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF",
 "label": "A_3 - Panorama",
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_t.jpg",
 "vfov": 180,
 "pitch": 0,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC",
   "class": "AdjacentPanorama"
  }
 ],
 "hfovMin": "120%",
 "partial": false,
 "overlays": [
  "this.overlay_ADD83579_B989_42C8_41CE_349D56B584CB",
  "this.overlay_A108EF26_B989_DE78_4198_3ECFACBB6983",
  "this.overlay_A3A1C4AC_B9B8_C24F_41E1_6773F57C1D8C",
  "this.overlay_A3B62525_B98B_C279_41A3_45F06FDFFB51",
  "this.overlay_A2B636F2_B989_4FD8_41E3_D0F0EC277F64",
  "this.overlay_A32C1728_B989_4E48_41E2_80BDBB8629AE"
 ]
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_camera",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "thumbnailUrl": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "id": "panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230",
 "label": "A_5 - Panorama",
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_t.jpg",
 "vfov": 180,
 "pitch": 0,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3D480A3_B989_4278_41C6_A6E2BB574012",
   "class": "AdjacentPanorama"
  }
 ],
 "hfovMin": "120%",
 "partial": false,
 "overlays": [
  "this.overlay_AC15F203_B998_C638_41E6_FDF0DEDEF56E",
  "this.overlay_AFDCDCB2_B999_C258_41C6_925FEA91CDAC",
  "this.overlay_AF5D5F8F_B99B_3E49_41DD_8F070689695C",
  "this.overlay_AF9F4A41_B998_C638_41B4_1FD03AC073A6",
  "this.overlay_AF30CF20_B999_DE78_41DC_5AE256D35D46"
 ]
},
{
 "initialPosition": {
  "yaw": -76.41,
  "class": "PanoramaCameraPosition",
  "pitch": -0.73
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A1D2722D_BA53_205C_41D8_1A89516AD4FE",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "label": "istockphoto-481529769-612x612",
 "id": "photo_A3EDCCCF_B988_C3C8_41E5_263CE943C226",
 "width": 612,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/photo_A3EDCCCF_B988_C3C8_41E5_263CE943C226.jpg",
    "class": "ImageResourceLevel"
   }
  ]
 },
 "class": "Photo",
 "thumbnailUrl": "media/photo_A3EDCCCF_B988_C3C8_41E5_263CE943C226_t.jpg",
 "duration": 5000,
 "height": 475
},
{
 "initialPosition": {
  "yaw": 0.73,
  "class": "PanoramaCameraPosition",
  "pitch": -16.9
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A3FCD359_BA53_20C5_41CE_3980A9EB8A0F",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "thumbnailUrl": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "id": "panorama_B3D480A3_B989_4278_41C6_A6E2BB574012",
 "label": "A_1 - Panorama",
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_t.jpg",
 "vfov": 180,
 "pitch": 0,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC",
   "class": "AdjacentPanorama"
  }
 ],
 "hfovMin": "170%",
 "partial": false,
 "overlays": [
  "this.overlay_B722AF90_B988_FE57_41E1_C3DEEC9347CD",
  "this.overlay_B66805A2_B998_C278_41E3_545F3DB81B51",
  "this.overlay_A8E5F9CD_B98B_45C8_41D0_3EE54528F61E",
  "this.overlay_A807D74A_B98F_4EC8_41E4_2BD2FDCBDDB9",
  "this.overlay_A87A072F_B989_4E48_41D0_60E54189C6DC",
  "this.overlay_AB66E448_B9FF_C237_41DD_4ED2FA71A2A8"
 ]
},
{
 "initialPosition": {
  "yaw": -155.76,
  "class": "PanoramaCameraPosition",
  "pitch": -5.88
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A3092324_BA53_204C_41E1_F17FFFA7A80C",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_camera",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "label": "Screenshot 2023-12-30 142553",
 "id": "photo_A308FFA0_B998_DE78_41C1_06A4FEC9DD7D",
 "width": 527,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/photo_A308FFA0_B998_DE78_41C1_06A4FEC9DD7D.png",
    "class": "ImageResourceLevel"
   }
  ]
 },
 "class": "Photo",
 "thumbnailUrl": "media/photo_A308FFA0_B998_DE78_41C1_06A4FEC9DD7D_t.png",
 "duration": 5000,
 "height": 760
},
{
 "initialPosition": {
  "yaw": -59.51,
  "class": "PanoramaCameraPosition",
  "pitch": -8.08
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A1E06209_BA53_2045_41CA_868E1C278C28",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": -122.69,
  "class": "PanoramaCameraPosition",
  "pitch": -9.55
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A160E124_BA53_204C_41AA_C92C37925C4E",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": -81.55,
  "class": "PanoramaCameraPosition",
  "pitch": -11.76
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A155D13F_BA53_20BD_41C0_08A99F73D226",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": 13.96,
  "class": "PanoramaCameraPosition",
  "pitch": -8.08
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A302933E_BA53_20BC_41AA_7A8502053828",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": 28.65,
  "class": "PanoramaCameraPosition",
  "pitch": -5.14
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A1FD11D6_BA53_23CC_41E6_A03B84493F5C",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": 64.65,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A12A4189_BA53_2044_41BD_BBA0588521CA",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "initialPosition": {
  "yaw": -73.47,
  "class": "PanoramaCameraPosition",
  "pitch": -2.94
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A17660F2_BA53_21C7_41D3_F33907FD626C",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "thumbnailUrl": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "height": 3072,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "id": "panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0",
 "label": "A_6 - Panorama",
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_t.jpg",
 "vfov": 180,
 "pitch": 0,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_B3D480A3_B989_4278_41C6_A6E2BB574012",
   "class": "AdjacentPanorama"
  }
 ],
 "hfovMin": "120%",
 "partial": false,
 "overlays": [
  "this.overlay_AEEC56F3_B999_4FD9_41E5_D49993264815",
  "this.overlay_AECE8361_B999_46F8_41E6_FB6695E6170E",
  "this.overlay_A1C1BFA9_B99B_7E48_41C5_66F36987099C",
  "this.overlay_A1DCAC9A_B999_4248_419C_860AD8771C84",
  "this.overlay_AE2DFC6B_B998_C2C8_41C8_94DC4481E8EC"
 ]
},
{
 "label": "mob-data",
 "id": "photo_A312BEA9_B989_7E48_41C4_3578541D72F2",
 "width": 1280,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/photo_A312BEA9_B989_7E48_41C4_3578541D72F2.jpg",
    "class": "ImageResourceLevel"
   }
  ]
 },
 "class": "Photo",
 "thumbnailUrl": "media/photo_A312BEA9_B989_7E48_41C4_3578541D72F2_t.jpg",
 "duration": 5000,
 "height": 1024
},
{
 "initialPosition": {
  "yaw": -52.9,
  "class": "PanoramaCameraPosition",
  "pitch": -5.14
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_A31472EF_BA53_21DC_41DA_91ABBCEF9728",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 }
},
{
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipTextShadowBlurRadius": 3,
 "toolTipTextShadowColor": "#000000",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "id": "MainViewer",
 "toolTipPaddingBottom": 4,
 "playbackBarHeight": 10,
 "minHeight": 50,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "width": "100%",
 "toolTipFontWeight": "normal",
 "playbackBarRight": 0,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipShadowColor": "#333333",
 "progressBarBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "shadow": false,
 "playbackBarProgressBorderSize": 0,
 "progressBarBorderRadius": 0,
 "toolTipShadowOpacity": 1,
 "playbackBarBorderRadius": 0,
 "toolTipFontStyle": "normal",
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderRadius": 0,
 "height": "100%",
 "paddingRight": 0,
 "toolTipFontFamily": "Arial",
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarProgressOpacity": 1,
 "class": "ViewerArea",
 "progressLeft": 0,
 "playbackBarBorderSize": 0,
 "playbackBarHeadBorderSize": 0,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "toolTipBackgroundColor": "#F6F6F6",
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "toolTipFontColor": "#606060",
 "progressBarBackgroundColorDirection": "vertical",
 "toolTipShadowHorizontalLength": 0,
 "minWidth": 100,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "toolTipShadowVerticalLength": 0,
 "progressBackgroundOpacity": 1,
 "transitionDuration": 500,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "borderSize": 0,
 "paddingLeft": 0,
 "progressBottom": 0,
 "playbackBarHeadShadowOpacity": 0.7,
 "toolTipPaddingRight": 6,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "toolTipBorderSize": 0,
 "vrPointerColor": "#FFFFFF",
 "toolTipPaddingTop": 4,
 "progressBarOpacity": 1,
 "toolTipDisplayTime": 600,
 "progressBorderSize": 0,
 "toolTipPaddingLeft": 6,
 "displayTooltipInTouchScreens": true,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "transitionMode": "blending",
 "progressBorderRadius": 0,
 "playbackBarHeadHeight": 15,
 "playbackBarLeft": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#000000",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColorDirection": "vertical",
 "playbackBarHeadOpacity": 1,
 "playbackBarBottom": 5,
 "toolTipShadowSpread": 0,
 "toolTipShadowBlurRadius": 3,
 "progressBorderColor": "#000000",
 "data": {
  "name": "Main Viewer"
 },
 "paddingTop": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipOpacity": 1,
 "toolTipBorderColor": "#767676",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipFontSize": "1.11vmin",
 "paddingBottom": 0
},
{
 "scrollBarVisible": "rollOver",
 "verticalAlign": "top",
 "id": "Container_AD0CA7F8_BA53_6FC4_4187_7494AA37F1CC",
 "left": "0%",
 "children": [
  "this.Container_AD0DD7F8_BA53_6FC4_41DD_56889CF94F5F",
  "this.IconButton_AD0D57F8_BA53_6FC4_41D3_5EAE2CEEA553"
 ],
 "minHeight": 1,
 "scrollBarMargin": 2,
 "layout": "absolute",
 "height": "12.832%",
 "scrollBarOpacity": 0.5,
 "right": "0%",
 "borderSize": 0,
 "paddingLeft": 0,
 "backgroundImageUrl": "skin/Container_AD0CA7F8_BA53_6FC4_4187_7494AA37F1CC.png",
 "shadow": false,
 "backgroundOpacity": 0.6,
 "scrollBarWidth": 10,
 "bottom": "0%",
 "contentOpaque": false,
 "borderRadius": 0,
 "horizontalAlign": "left",
 "paddingRight": 0,
 "class": "Container",
 "propagateClick": true,
 "scrollBarColor": "#000000",
 "overflow": "visible",
 "data": {
  "name": "--- MENU"
 },
 "paddingTop": 0,
 "gap": 10,
 "paddingBottom": 0,
 "minWidth": 1
},
{
 "cursor": "hand",
 "transparencyActive": true,
 "id": "IconButton_AD0D57F8_BA53_6FC4_41D3_5EAE2CEEA553",
 "width": 49,
 "minHeight": 1,
 "borderSize": 0,
 "right": 30,
 "paddingLeft": 0,
 "shadow": false,
 "backgroundOpacity": 0,
 "bottom": 8,
 "maxWidth": 49,
 "iconURL": "skin/IconButton_AD0D57F8_BA53_6FC4_41D3_5EAE2CEEA553.png",
 "horizontalAlign": "center",
 "mode": "push",
 "maxHeight": 37,
 "borderRadius": 0,
 "paddingRight": 0,
 "propagateClick": true,
 "height": 37,
 "class": "IconButton",
 "verticalAlign": "middle",
 "rollOverIconURL": "skin/IconButton_AD0D57F8_BA53_6FC4_41D3_5EAE2CEEA553_rollover.png",
 "data": {
  "name": "IconButton VR"
 },
 "paddingTop": 0,
 "paddingBottom": 0,
 "minWidth": 1
},
{
 "scrollBarVisible": "rollOver",
 "id": "htmlText_A0C7656F_B989_42C8_41C7_7365EAB2C234",
 "width": "100%",
 "minHeight": 0,
 "scrollBarMargin": 2,
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingLeft": 10,
 "shadow": false,
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "paddingRight": 10,
 "propagateClick": false,
 "class": "HTMLText",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\">This T-shirt by VeBNoR is made of poly cotton making it a versatile fabric to have in your closet. Cotton is gentle on the skin and adaptable, and polyester is durable and wrinkle-resistant. They reduced shrinking results from the addition of polyester to cotton.Combining these two fibers lessens fabric bubbling. These T-shirts are pleasant to wear as well as suitable for a variety of weather.</SPAN></DIV><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p></div>",
 "height": "31%",
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText42706"
 },
 "paddingTop": 10,
 "paddingBottom": 10,
 "minWidth": 0
},
{
 "id": "image_uidA0AA1031_BA53_2044_4158_F8BFB2FF9D20_1",
 "width": "100%",
 "minHeight": 0,
 "borderSize": 0,
 "url": "media/photo_A03468B9_B9BB_4248_41D0_28BECE50992E.png",
 "paddingLeft": 0,
 "shadow": false,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "horizontalAlign": "center",
 "borderRadius": 0,
 "paddingRight": 0,
 "propagateClick": false,
 "class": "Image",
 "height": "68%",
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image12333"
 },
 "paddingTop": 0,
 "paddingBottom": 0,
 "minWidth": 0
},
{
 "maps": [
  {
   "yaw": -46.74,
   "hfov": 10.49,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -4.95,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_AD8A6EB0_B988_DE58_41DF_E605715D42A3",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF, this.camera_A30F030B_BA53_2045_41D9_38BB964D1F19); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 10.49,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0_HS_0_0.png",
      "width": 239,
      "height": 232,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -4.95,
   "yaw": -46.74,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Image"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": 53.07,
   "hfov": 9.57,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -4.47,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_AD54ED1C_B989_4248_41C8_08CD77C6E014",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3, this.camera_A31992D6_BA53_21CF_41D5_8D976AE3DDD5); this.mainPlayList.set('selectedIndex', 6)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.57,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0_HS_1_0.png",
      "width": 218,
      "height": 228,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -4.47,
   "yaw": 53.07,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Image"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": 104.09,
   "hfov": 9.91,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0_HS_2_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -4.49,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_AD2028E6_B98F_C3F8_41E4_29F256AECBFE",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0, this.camera_A302933E_BA53_20BC_41AA_7A8502053828); this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.91,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0_HS_2_0.png",
      "width": 226,
      "height": 228,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -4.49,
   "yaw": 104.09,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Image"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": -86.56,
   "hfov": 11.6,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0_HS_3_0_0_map.gif",
      "width": 57,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -25.99,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_ACD1CA0D_B989_4648_41D6_EE696B077875",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC, this.camera_A3FCD359_BA53_20C5_41CE_3980A9EB8A0F); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 11.6,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_AC16366E_B988_CEC8_41C4_34F7D1CAFF72",
   "yaw": -86.56,
   "pitch": -25.99,
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Point 01c"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": 126.33,
   "hfov": 15.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0_HS_4_0_0_map.gif",
      "width": 28,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -48.53,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_ACFA39CE_B98B_C5C8_41DC_2AC01FDF370D",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230, this.camera_A31472EF_BA53_21DC_41DA_91ABBCEF9728); this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 15.18,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_AC16866E_B988_CEC8_41E6_A95C6845FF72",
   "yaw": 126.33,
   "pitch": -48.53,
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle 01a"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": 174.85,
   "hfov": 12.89,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0_HS_5_0_0_map.gif",
      "width": 57,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -26.01,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_AC4F30C0_B989_C238_41DB_10EE51EC62A0",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3D480A3_B989_4278_41C6_A6E2BB574012, this.camera_A3092324_BA53_204C_41E1_F17FFFA7A80C); this.mainPlayList.set('selectedIndex', 0)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.89,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_AC16D66E_B988_CEC8_41CC_CF2E7A4ED8F7",
   "yaw": 174.85,
   "pitch": -26.01,
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Point 01c"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": -91.04,
   "hfov": 20.61,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0_HS_0_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -19.81,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_A1E04FEA_B988_DDCB_41E1_BFBC488FBE9F",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0, this.camera_A091509B_BA53_2045_41E3_28996935DE61); this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 20.61,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_A1DB916F_B989_42C9_41DD_31F01ABFAB86",
   "yaw": -91.04,
   "pitch": -19.81,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 06a"
 },
 "enabledInCardboard": true
},
{
 "scrollBarVisible": "rollOver",
 "id": "htmlText_A321D816_B9B8_C258_41E0_FCC7D0849C7B",
 "width": "100%",
 "minHeight": 0,
 "scrollBarMargin": 2,
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingLeft": 10,
 "shadow": false,
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "paddingRight": 10,
 "propagateClick": false,
 "class": "HTMLText",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\">You can find sheer coats that allow you to flaunt your outfit while wearing the coat over it. Other than that, you can also explore various trending patterns, like colour-block, solid, camouflage print, striped, and more. You can explore and select the latest options available for both men and women. Apart from that, you can choose hooded neck style coats with different closure types like zippers and buttons. Additionally, you can also explore some coats without a hood, allowing you to choose the best option.</SPAN></DIV></div>",
 "height": "40%",
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText48318"
 },
 "paddingTop": 10,
 "paddingBottom": 10,
 "minWidth": 0
},
{
 "id": "image_uidA0A87037_BA53_204C_41DE_10D995EA830B_1",
 "width": "100%",
 "minHeight": 0,
 "borderSize": 0,
 "url": "media/photo_A3EDCCCF_B988_C3C8_41E5_263CE943C226.jpg",
 "paddingLeft": 0,
 "shadow": false,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "horizontalAlign": "center",
 "borderRadius": 0,
 "paddingRight": 0,
 "propagateClick": false,
 "class": "Image",
 "height": "59%",
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image12334"
 },
 "paddingTop": 0,
 "paddingBottom": 0,
 "minWidth": 0
},
{
 "scrollBarVisible": "rollOver",
 "id": "htmlText_A350FEA3_B989_FE78_41A7_3FD527AA27CC",
 "width": "100%",
 "minHeight": 0,
 "scrollBarMargin": 2,
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingLeft": 10,
 "shadow": false,
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "paddingRight": 10,
 "propagateClick": false,
 "class": "HTMLText",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\">Daikin VRV Under Ceiling FXUQ100A Unique unit for high rooms with no false ceilings nor free floor space in shopping centres, hotels air conditioning</SPAN></DIV></div>",
 "height": "33%",
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText51625"
 },
 "paddingTop": 10,
 "paddingBottom": 10,
 "minWidth": 0
},
{
 "id": "image_uidA0A68039_BA53_2044_41B5_3051F37A4C39_1",
 "width": "100%",
 "minHeight": 0,
 "borderSize": 0,
 "url": "media/photo_A2D7E83A_B98B_4248_41D1_94B2E2B8AC44.jpg",
 "paddingLeft": 0,
 "shadow": false,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "horizontalAlign": "center",
 "borderRadius": 0,
 "paddingRight": 0,
 "propagateClick": false,
 "class": "Image",
 "height": "66%",
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image12336"
 },
 "paddingTop": 0,
 "paddingBottom": 0,
 "minWidth": 0
},
{
 "scrollBarVisible": "rollOver",
 "id": "htmlText_A3372EBD_B98B_FE48_41E6_3385C67D3A9D",
 "width": "100%",
 "minHeight": 0,
 "scrollBarMargin": 2,
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingLeft": 10,
 "shadow": false,
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "paddingRight": 10,
 "propagateClick": false,
 "class": "HTMLText",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\">A forever piece with style icon credentials, the biker jacket holds classic appeal. From casual outfits to evening ensembles, it can be worn all year round. A singular style that always exudes cool.</SPAN></DIV></div>",
 "height": "30%",
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText49706"
 },
 "paddingTop": 10,
 "paddingBottom": 10,
 "minWidth": 0
},
{
 "id": "image_uidA0A7E038_BA53_2044_41E4_DF0CEF8F4108_1",
 "width": "100%",
 "minHeight": 0,
 "borderSize": 0,
 "url": "media/photo_A312BEA9_B989_7E48_41C4_3578541D72F2.jpg",
 "paddingLeft": 0,
 "shadow": false,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "horizontalAlign": "center",
 "borderRadius": 0,
 "paddingRight": 0,
 "propagateClick": false,
 "class": "Image",
 "height": "69%",
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image12335"
 },
 "paddingTop": 0,
 "paddingBottom": 0,
 "minWidth": 0
},
{
 "scrollBarVisible": "rollOver",
 "id": "htmlText_A5EE0415_B989_4258_414F_EA6F0B3F8877",
 "width": "100%",
 "minHeight": 0,
 "scrollBarMargin": 2,
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingLeft": 10,
 "shadow": false,
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "paddingRight": 10,
 "propagateClick": false,
 "class": "HTMLText",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\">This tracking light fixture provides adequate illumination to set the ideal mood in your home's kitchen, hallway, living room, or for wall art in shopping centers, restaurants, or showrooms.</SPAN></DIV></div>",
 "height": "26%",
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText53104"
 },
 "paddingTop": 10,
 "paddingBottom": 10,
 "minWidth": 0
},
{
 "id": "image_uidA0A6203B_BA53_2045_41D1_133AE5A0A3FE_1",
 "width": "100%",
 "minHeight": 0,
 "borderSize": 0,
 "url": "media/photo_A308FFA0_B998_DE78_41C1_06A4FEC9DD7D.png",
 "paddingLeft": 0,
 "shadow": false,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "horizontalAlign": "center",
 "borderRadius": 0,
 "paddingRight": 0,
 "propagateClick": false,
 "class": "Image",
 "height": "73%",
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image12337"
 },
 "paddingTop": 0,
 "paddingBottom": 0,
 "minWidth": 0
},
{
 "maps": [
  {
   "yaw": -124.37,
   "hfov": 8.86,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0_HS_0_0_0_map.gif",
      "width": 57,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -21.32,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_ABAD4E95_B9FB_FE59_41D1_0F83D6F199FB",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3D480A3_B989_4278_41C6_A6E2BB574012, this.camera_A3E6C3A2_BA53_2047_41D0_B79086B1AD51); this.mainPlayList.set('selectedIndex', 0)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 8.86,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_ABE9B5F6_B9F8_CDD8_41E3_C8BF01D40505",
   "yaw": -124.37,
   "pitch": -21.32,
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Point 01c"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": 92,
   "hfov": 10.35,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -4.43,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_ADD37B4E_B9F9_46C8_41DA_5FC2DB953EB7",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF, this.camera_A3EEE38A_BA53_2047_41C9_4D9109E17392); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 10.35,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0_HS_1_0.png",
      "width": 236,
      "height": 248,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -4.43,
   "yaw": 92,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Image"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": 174.11,
   "hfov": 9.63,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0_HS_2_0_0_map.gif",
      "width": 61,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -38.78,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_AAB677E1_B9FB_4DF8_41D4_6C4F0FE47198",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F, this.camera_A3F48372_BA53_20C7_41D1_69B7B371FCD3); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.63,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_AC076855_B987_42D8_41CF_DEA559F509AC",
   "yaw": 174.11,
   "pitch": -38.78,
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle 01c"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": -164.05,
   "hfov": 8.65,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0_HS_3_0_0_map.gif",
      "width": 15,
      "height": 18,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -2.4,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_AA665158_B9F8_C2C8_41E1_1510DF6C02B4",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 8.65,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0_HS_3_0.png",
      "width": 197,
      "height": 226,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -2.4,
   "yaw": -164.05,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Image"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": -118.89,
   "hfov": 13.64,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0_HS_0_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -16,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_ADD83579_B989_42C8_41CE_349D56B584CB",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC, this.camera_A155D13F_BA53_20BD_41C0_08A99F73D226); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 13.64,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_ADACEC6B_B988_C2C9_41DD_5A148EF77661",
   "yaw": -118.89,
   "pitch": -16,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 06a"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": -88.68,
   "hfov": 2.27,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0_HS_1_0_0_map.gif",
      "width": 16,
      "height": 20,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": 1.75,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_A108EF26_B989_DE78_4198_3ECFACBB6983",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.showWindow(this.window_A0C55568_B989_42C8_41CA_7AC30A91CADF, null, false)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 2.27,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0_HS_1_0.png",
      "width": 51,
      "height": 66,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": 1.75,
   "yaw": -88.68,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Image"
 }
},
{
 "maps": [
  {
   "yaw": 61.06,
   "hfov": 4.64,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0_HS_2_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": 0.95,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_A3A1C4AC_B9B8_C24F_41E1_6773F57C1D8C",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.showWindow(this.window_A3220815_B9B8_C258_41E6_F560578C0F0C, null, false)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 4.64,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0_HS_2_0.png",
      "width": 105,
      "height": 105,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": 0.95,
   "yaw": 61.06,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Image"
 }
},
{
 "maps": [
  {
   "yaw": 138.19,
   "hfov": 4.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0_HS_3_0_0_map.gif",
      "width": 15,
      "height": 15,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": 0.23,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_A3B62525_B98B_C279_41A3_45F06FDFFB51",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.showWindow(this.window_A3357EBC_B98B_FE48_415C_6D45A765702A, null, false)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 4.54,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0_HS_3_0.png",
      "width": 103,
      "height": 103,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": 0.23,
   "yaw": 138.19,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Image"
 }
},
{
 "maps": [
  {
   "yaw": -117.01,
   "hfov": 5.91,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0_HS_4_0_0_map.gif",
      "width": 16,
      "height": 17,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": 43.12,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_A2B636F2_B989_4FD8_41E3_D0F0EC277F64",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.showWindow(this.window_A3563EA2_B989_FE78_41DD_5551D2C66245, null, false)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 5.91,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0_HS_4_0.png",
      "width": 184,
      "height": 196,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": 43.12,
   "yaw": -117.01,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Image"
 }
},
{
 "maps": [
  {
   "yaw": -16.52,
   "hfov": 4.76,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0_HS_5_0_0_map.gif",
      "width": 16,
      "height": 20,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": 49.11,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_A32C1728_B989_4E48_41E2_80BDBB8629AE",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.showWindow(this.window_A211D40F_B989_4248_4190_6CD9A0535906, null, false)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 4.76,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0_HS_5_0.png",
      "width": 165,
      "height": 209,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": 49.11,
   "yaw": -16.52,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Image"
 }
},
{
 "maps": [
  {
   "yaw": -138.65,
   "hfov": 9.7,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": 9.66,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_AC15F203_B998_C638_41E6_FDF0DEDEF56E",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0, this.camera_A08070D9_BA53_21C7_41D1_31635BD87B4D); this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.7,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0_HS_0_0.png",
      "width": 224,
      "height": 229,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": 9.66,
   "yaw": -138.65,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Image"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": -22.19,
   "hfov": 11.2,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0_HS_1_0_0_map.gif",
      "width": 57,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -17.29,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_AFDCDCB2_B999_C258_41C6_925FEA91CDAC",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3D480A3_B989_4278_41C6_A6E2BB574012, this.camera_A160E124_BA53_204C_41AA_C92C37925C4E); this.mainPlayList.set('selectedIndex', 0)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 11.2,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_A1D9116B_B989_42C8_41DD_0B46F262C4B9",
   "yaw": -22.19,
   "pitch": -17.29,
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Point 01c"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": 44.54,
   "hfov": 10.65,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0_HS_2_0_0_map.gif",
      "width": 57,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -10.68,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_AF5D5F8F_B99B_3E49_41DD_8F070689695C",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC, this.camera_A16C310A_BA53_2045_41E2_F94FAE99E674); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 10.65,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_A1D9216C_B989_42CF_41C2_DAFFFA361AC0",
   "yaw": 44.54,
   "pitch": -10.68,
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Point 01c"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": 64.17,
   "hfov": 6.17,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0_HS_3_0_0_map.gif",
      "width": 16,
      "height": 19,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": 5.88,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_AF9F4A41_B998_C638_41B4_1FD03AC073A6",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF, this.camera_A17660F2_BA53_21C7_41D3_F33907FD626C); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 6.17,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0_HS_3_0.png",
      "width": 141,
      "height": 173,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": 5.88,
   "yaw": 64.17,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Image"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": 134.93,
   "hfov": 9.43,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0_HS_4_0_0_map.gif",
      "width": 18,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": 9.1,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_AF30CF20_B999_DE78_41DC_5AE256D35D46",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3, this.camera_A08A20C2_BA53_21C7_4190_7E9A2946A929); this.mainPlayList.set('selectedIndex', 6)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.43,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0_HS_4_0.png",
      "width": 217,
      "height": 185,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": 9.1,
   "yaw": 134.93,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Image"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": -51.08,
   "hfov": 8.81,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0_HS_0_0_0_map.gif",
      "width": 57,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -16.39,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_B722AF90_B988_FE57_41E1_C3DEEC9347CD",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC, this.camera_A1FD11D6_BA53_23CC_41E6_A03B84493F5C); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 8.81,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_AD5DFEE1_B989_DFF9_41DD_132407359D79",
   "yaw": -51.08,
   "pitch": -16.39,
   "distance": 50
  }
 ],
 "data": {
  "label": "Circle Point 01c"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": 35.24,
   "hfov": 11.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0_HS_2_0_0_map.gif",
      "width": 28,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -45.69,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_B66805A2_B998_C278_41E3_545F3DB81B51",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230, this.camera_A139A171_BA53_20C5_41E2_7D992EAAB151); this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 11.22,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_A857705A_B999_42C8_41E6_E9937129369C",
   "yaw": 35.24,
   "pitch": -45.69,
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle 02a"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": -16.26,
   "hfov": 9.7,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0_HS_5_0_0_map.gif",
      "width": 57,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -21.03,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_A8E5F9CD_B98B_45C8_41D0_3EE54528F61E",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F, this.camera_A10D61BC_BA53_2043_41E4_596246DAE8AE); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.7,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_AD5E6EE2_B989_DFFB_41A5_C4A8DFB33D17",
   "yaw": -16.26,
   "pitch": -21.03,
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Point 01c"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": -25.9,
   "hfov": 9,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0_HS_6_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -1.47,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_A807D74A_B98F_4EC8_41E4_2BD2FDCBDDB9",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF, this.camera_A12A4189_BA53_2044_41BD_BBA0588521CA); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0_HS_6_0.png",
      "width": 204,
      "height": 201,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -1.47,
   "yaw": -25.9,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Image"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": 27.72,
   "hfov": 9.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0_HS_7_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -1.89,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_A87A072F_B989_4E48_41D0_60E54189C6DC",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3, this.camera_A146B157_BA53_20CD_41DC_EC4564FA3950); this.mainPlayList.set('selectedIndex', 6)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.4,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0_HS_7_0.png",
      "width": 213,
      "height": 201,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -1.89,
   "yaw": 27.72,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Image"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": 70.87,
   "hfov": 8.71,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0_HS_8_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -1.43,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_AB66E448_B9FF_C237_41DD_4ED2FA71A2A8",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0, this.camera_A11B71A3_BA53_2045_41CD_8B3B5D5E8BFB); this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 8.71,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0_HS_8_0.png",
      "width": 198,
      "height": 210,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -1.43,
   "yaw": 70.87,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Image"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": 144.01,
   "hfov": 11.05,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0_HS_0_0_0_map.gif",
      "width": 57,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -26.22,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_AEEC56F3_B999_4FD9_41E5_D49993264815",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3D480A3_B989_4278_41C6_A6E2BB574012, this.camera_A31CF2BB_BA53_2045_41CD_3B405E922F82); this.mainPlayList.set('selectedIndex', 0)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 11.05,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_A1DAA16D_B989_42C9_4171_1B7F8DF5AB23",
   "yaw": 144.01,
   "pitch": -26.22,
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Point 01c"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": -91.2,
   "hfov": 10.85,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0_HS_1_0_0_map.gif",
      "width": 17,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -3.92,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_AECE8361_B999_46F8_41E6_FB6695E6170E",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3, this.camera_A1EFD1EC_BA53_23C3_41E0_C76D4BCE1B28); this.mainPlayList.set('selectedIndex', 6)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 10.85,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0_HS_1_0.png",
      "width": 247,
      "height": 223,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -3.92,
   "yaw": -91.2,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Image"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": -149.61,
   "hfov": 7.92,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0_HS_2_0_0_map.gif",
      "width": 16,
      "height": 18,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -2.05,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_A1C1BFA9_B99B_7E48_41C5_66F36987099C",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF, this.camera_A1D2722D_BA53_205C_41D8_1A89516AD4FE); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 7.92,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0_HS_2_0.png",
      "width": 180,
      "height": 207,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -2.05,
   "yaw": -149.61,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Image"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": -152.66,
   "hfov": 8.55,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0_HS_3_0_0_map.gif",
      "width": 61,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -23.88,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_A1DCAC9A_B999_4248_419C_860AD8771C84",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F, this.camera_A1E06209_BA53_2045_41CA_868E1C278C28); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 8.55,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_A1DA316E_B989_42CB_41E4_C50138C4F432",
   "yaw": -152.66,
   "pitch": -23.88,
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle 01c"
 },
 "enabledInCardboard": true
},
{
 "maps": [
  {
   "yaw": -166.82,
   "hfov": 8.69,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0_HS_4_0_0_map.gif",
      "width": 57,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -14.37,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "id": "overlay_AE2DFC6B_B998_C2C8_41C8_94DC4481E8EC",
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC, this.camera_A32052A2_BA53_2047_41D5_D804AEB57D3B); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 8.69,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_A1DBC16F_B989_42C9_41E5_FD5986D86CCF",
   "yaw": -166.82,
   "pitch": -14.37,
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Point 01c"
 },
 "enabledInCardboard": true
},
{
 "scrollBarVisible": "rollOver",
 "verticalAlign": "middle",
 "id": "Container_AD0DD7F8_BA53_6FC4_41DD_56889CF94F5F",
 "left": "0%",
 "width": 1199,
 "minHeight": 1,
 "scrollBarMargin": 2,
 "borderSize": 0,
 "layout": "horizontal",
 "scrollBarOpacity": 0.5,
 "paddingLeft": 30,
 "shadow": false,
 "backgroundOpacity": 0,
 "scrollBarWidth": 10,
 "bottom": "0%",
 "contentOpaque": false,
 "borderRadius": 0,
 "horizontalAlign": "left",
 "paddingRight": 0,
 "propagateClick": true,
 "height": 51,
 "class": "Container",
 "scrollBarColor": "#000000",
 "overflow": "scroll",
 "data": {
  "name": "-button set container"
 },
 "paddingTop": 0,
 "gap": 10,
 "paddingBottom": 0,
 "minWidth": 1
},
{
 "colCount": 4,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0_HS_3_0.png",
   "width": 1000,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "frameCount": 22,
 "id": "AnimatedImageResource_AC16366E_B988_CEC8_41C4_34F7D1CAFF72",
 "class": "AnimatedImageResource"
},
{
 "colCount": 4,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0_HS_4_0.png",
   "width": 1080,
   "height": 750,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 5,
 "frameCount": 20,
 "id": "AnimatedImageResource_AC16866E_B988_CEC8_41E6_A95C6845FF72",
 "class": "AnimatedImageResource"
},
{
 "colCount": 4,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B3FE3FB2_B989_5E5B_41E4_EAAA4F40A71F_0_HS_5_0.png",
   "width": 1000,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "frameCount": 22,
 "id": "AnimatedImageResource_AC16D66E_B988_CEC8_41CC_CF2E7A4ED8F7",
 "class": "AnimatedImageResource"
},
{
 "colCount": 4,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B3FD602B_B988_C248_41E3_9AEDCB2992B3_0_HS_0_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "frameCount": 24,
 "id": "AnimatedImageResource_A1DB916F_B989_42C9_41DD_31F01ABFAB86",
 "class": "AnimatedImageResource"
},
{
 "colCount": 4,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0_HS_0_0.png",
   "width": 1000,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "frameCount": 22,
 "id": "AnimatedImageResource_ABE9B5F6_B9F8_CDD8_41E3_C8BF01D40505",
 "class": "AnimatedImageResource"
},
{
 "colCount": 4,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B3EA4DF3_B989_DDDF_41D4_FC295558CDCC_0_HS_2_0.png",
   "width": 1080,
   "height": 350,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 5,
 "frameCount": 20,
 "id": "AnimatedImageResource_AC076855_B987_42D8_41CF_DEA559F509AC",
 "class": "AnimatedImageResource"
},
{
 "colCount": 4,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B3FBFE74_B989_3ED8_41E1_2298C8B45CDF_0_HS_0_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "frameCount": 24,
 "id": "AnimatedImageResource_ADACEC6B_B988_C2C9_41DD_5A148EF77661",
 "class": "AnimatedImageResource"
},
{
 "colCount": 4,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0_HS_1_0.png",
   "width": 1000,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "frameCount": 22,
 "id": "AnimatedImageResource_A1D9116B_B989_42C8_41DD_0B46F262C4B9",
 "class": "AnimatedImageResource"
},
{
 "colCount": 4,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B3FDFDD1_B989_7DD9_41E5_7D36BCD76230_0_HS_2_0.png",
   "width": 1000,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "frameCount": 22,
 "id": "AnimatedImageResource_A1D9216C_B989_42CF_41C2_DAFFFA361AC0",
 "class": "AnimatedImageResource"
},
{
 "colCount": 4,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0_HS_0_0.png",
   "width": 1000,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "frameCount": 22,
 "id": "AnimatedImageResource_AD5DFEE1_B989_DFF9_41DD_132407359D79",
 "class": "AnimatedImageResource"
},
{
 "colCount": 4,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0_HS_2_0.png",
   "width": 1080,
   "height": 900,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "frameCount": 24,
 "id": "AnimatedImageResource_A857705A_B999_42C8_41E6_E9937129369C",
 "class": "AnimatedImageResource"
},
{
 "colCount": 4,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B3D480A3_B989_4278_41C6_A6E2BB574012_0_HS_5_0.png",
   "width": 1000,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "frameCount": 22,
 "id": "AnimatedImageResource_AD5E6EE2_B989_DFFB_41A5_C4A8DFB33D17",
 "class": "AnimatedImageResource"
},
{
 "colCount": 4,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0_HS_0_0.png",
   "width": 1000,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "frameCount": 22,
 "id": "AnimatedImageResource_A1DAA16D_B989_42C9_4171_1B7F8DF5AB23",
 "class": "AnimatedImageResource"
},
{
 "colCount": 4,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0_HS_3_0.png",
   "width": 1080,
   "height": 350,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 5,
 "frameCount": 20,
 "id": "AnimatedImageResource_A1DA316E_B989_42CB_41E4_C50138C4F432",
 "class": "AnimatedImageResource"
},
{
 "colCount": 4,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B3F53CB2_B989_4258_41E6_D32B75636EF0_0_HS_4_0.png",
   "width": 1000,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "frameCount": 22,
 "id": "AnimatedImageResource_A1DBC16F_B989_42C9_41E5_FD5986D86CCF",
 "class": "AnimatedImageResource"
}],
 "minWidth": 20
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
