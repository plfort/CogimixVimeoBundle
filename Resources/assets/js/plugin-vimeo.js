function vimeoPlayer(musicPlayer) {

	this.name = "Vimeo";
	this.cancelRequested = false;
	this.interval;
	this.musicPlayer = musicPlayer;
	this.currentState = null;
	this.vimeo = null;
	this.widgetElement = $("#vimeoPlayerContainer");
	var self = this;

	this.requestCancel = function() {
		self.cancelRequested = true;
	};

	this.hideWidget = function() {
		if (self.widgetElement != null) {
			loggerVimeo.debug('hide youtube player in youtubeplugin');
			self.widgetElement.addClass('fakeHide');
		}
	};
	this.showWidget = function() {
		if (self.widgetElement != null) {
			loggerVimeo.debug('show vimeo player in vimeoplugin');
			self.widgetElement.removeClass('fakeHide');
		}
	};
	this.play = function(item) {
		var videoId = item.entryId;
				
		if (self.currentState == 1) {
			self.resume();
		}
		
			$("#vimeoplayer").attr('src','//player.vimeo.com/video/VIDEO_ID?api=1&player_id=vimeoplayer&autoplay=1'.replace('VIDEO_ID',videoId));
			var iframe = $('#vimeoplayer')[0];
		    self.vimeo = $f(iframe);
		    self.vimeo.addEvent('ready', function() {
	
		      
		       self.vimeo.addEvent('play', function(){
		        	self.onPlay();
		        });
		        self.vimeo.addEvent('finish', function(){
		        	self.onFinish();
		        });
		        self.vimeo.addEvent('playProgress',function(event){
		        	self.onPlayProgress(event);
		        } );
		        self.vimeo.addEvent('loadProgress',function(event){
		        	self.onLoadProgress(event);
		        } );
		        
		    });
		
		

	};
	this.stop = function() {
		loggerVimeo.debug('call stop in youtube plugin');

		if (self.vimeo != null) {
			self.vimeo.api('unload');
		}
		
	};

	this.pause = function() {
		if (self.vimeo != null) {
			self.vimeo.api('pause');
		}
	};
	
	this.resume = function() {
		if (self.vimeo != null) {
			self.vimeo.api('play');
		}
	};

	this.setVolume = function(value) {
		loggerVimeo.debug('call setVolume youtube');
		if (self.vimeo != null) {
			self.vimeo.api('setVolume',value/100);
		}
	};
	this.enableFullscreen=function(){
		var elem = document.getElementById("vimeoplayer");
		if (elem.requestFullscreen) {
		  elem.requestFullscreen();
		} else if (elem.msRequestFullscreen) {
		  elem.msRequestFullscreen();
		} else if (elem.mozRequestFullScreen) {
		  elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
		  elem.webkitRequestFullscreen();
		}
	}
	


	
	this.onLoadProgress = function(event){
		self.musicPlayer.cursor.progressbar('value', event.percent*100);
			
		
	};
	this.onPlayProgress = function(event){
		
		self.musicPlayer.cursor.slider("value",event.seconds);
		self.musicPlayer.cursor.slider("option", "max",event.duration);
	};
	this.onFinish = function(){
		
		self.musicPlayer.cursor.slider("value",0);
		self.musicPlayer.cursor.progressbar('value',0);
		self.musicPlayer.next();
	};
	
	this.onPlay = function(){
		self.setVolume(self.musicPlayer.volume);
		self.musicPlayer.enableControls();
		self.musicPlayer.cursor.slider("value", 0);
		self.musicPlayer.bindCursorStop(function(value) {
			self.vimeo.api('seekTo',value);
		});

	};
	
	this.onYoutubePlayerStateChange = function(event) {
		var newState = event.data;
		var oldState = self.currentState;
		loggerVimeo.debug('Youtube state changed ' + newState);
		self.currentState = newState;

		if (newState == -1 || newState == 5) {

			self.clearInterval();
			self.musicPlayer.unbinCursorStop();
			self.musicPlayer.cursor.progressbar("value", 0);
			//self.hideWidget();
			return;
		}
		if (newState == 2) {
			loggerVimeo.debug('Clear interval');
			self.clearInterval();
			return;
		}

		if (newState == 0) {

			self.clearInterval();
			self.musicPlayer.unbinCursorStop();
			self.musicPlayer.cursor.progressbar("value", 0);
			loggerVimeo.debug('Call next from youtube plugin');
			self.musicPlayer.next();
			return;
		}
		if (newState == 1) {
			if (self.cancelRequested == false) {
				//self.showWidget();
				self.musicPlayer.enableControls();
				self.musicPlayer.cursor.slider("value", 0);

				var duration = self.ytplayer.getDuration();
				var loaded = self.ytplayer.getVideoLoadedFraction();
				self.musicPlayer.cursor.slider("option", "max", duration).progressbar({
					value : loaded * 100,
				});

				self.musicPlayer.bindCursorStop(function(value) {
					self.ytplayer.seekTo(value, true);
				});

				loggerVimeo.debug('Create interval');
				self.createCursorInterval(1000);
			} else {
				self.cancelRequested = false;
				self.stop();
			}
			return;
		}

	};
	this.clearInterval = function() {
		loggerVimeo.debug('clear interval: ' + self.interval);
		window.clearInterval(self.interval);
	};

	this.createCursorInterval = function(delay) {
		self.clearInterval();
		self.interval = window.setInterval(function() {
			//loggerVimeo.debug('update youtube cursor');
			var percentLoaded = self.ytplayer.getVideoLoadedFraction();
			var duration = self.ytplayer.getDuration();
			self.musicPlayer.cursor.progressbar('value', percentLoaded * 100);
			if (self.musicPlayer.controls.volumeSlider.data('isdragging') == false) {
				self.musicPlayer.controls.volumeSlider.slider("value", self.ytplayer.getVolume());
			}
			if (self.musicPlayer.cursor.data('isdragging') == false) {
				self.musicPlayer.cursor.slider("value", self.ytplayer.getCurrentTime());
			}
		}, delay);
		loggerVimeo.debug('Interval : ' + self.interval + ' created');
	};

}


$("body").on('musicplayerReady',function(event){
	event.musicPlayer.addPlugin('vimeo',new vimeoPlayer(event.musicPlayer));

});

function addVimeoPlugin(musicPlayer) {
	

	//musicPlayer.plugin['vimeo'].onVimeoIframeAPIReady();
	musicPlayer.play();
}

