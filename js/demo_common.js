// Function to fade out the current step and fade in the next one
function stepTransition(hideElem, showElem, func) {
    hideElem.fadeOut(200, function () {
        func && func.call(this);
        showElem.fadeIn(1000);
    });
}

// Returns if we are running in development mode
function devMode() {
    return location.hostname === "localhost" || location.hostname === "127.0.0.1";
}

/* VOCLOUD */

function VocloudTask(api) {
    var self = this;
    self.api = api;
    self.logEnabled = devMode();
    self.vocloudUrl = devMode() ? 'http://localhost:3000/api': 'https://cloud.voctrolabs.com/api';

    // Common fail function for all AJAX calls
    self._fail = function _fail(jqXHR, textStatus, errorThrown) {
        self.log('Error: ' + textStatus);
        if (jqXHR.status === 0) {
            alert('No connection: Verify Network.');
        } else if (jqXHR.status === 404) {
            alert('Requested page not found [404]');
        } else if (jqXHR.status === 500) {
            alert('Internal server error [500].');
        } else if (jqXHR.status === 429) {
            alert('You have exceeded the maximum amount of requests allowed. Please wait some minutes and try later.');
        } else if (jqXHR.status === 403) {
            alert('Access forbidden [403].\nYou have exceeded the maximum amount of requests allowed in the demo. Please wait some minutes and try later.');
        } else if (textStatus === 'parsererror') {
            alert('Requested JSON parse failed.');
        } else if (textStatus === 'timeout') {
            alert('Time out error.');
        } else if (textStatus === 'abort') {
            alert('Ajax request aborted.');
        } else {
            alert('Unknown error');
        }
    };

    self.ajax = function ajax(settings) {
        return $.ajax($.extend({},
            {
                contentType: 'application/json',
                dataType: 'json',
                headers: {
                    Authorization: eval('(function(){var F=Array.prototype.slice.call(arguments),Z=F.shift();return F.reverse().map(function(y,k){return String.fromCharCode(y-Z-0-k)}).join(\'\')})(52,176,147,170,176,169,209,162,172,176,133,196,167,180,199,158,188,154,199,150,162,163,188,129,180,169,117,146,117,164,115,130,111,160,177,146,130,148,89,155,160,169,150,118)+(845).toString(36).toLowerCase()+(11).toString(36).toLowerCase().split(\'\').map(function(H){return String.fromCharCode(H.charCodeAt()+(-13))}).join(\'\')+(959).toString(36).toLowerCase().split(\'\').map(function(q){return String.fromCharCode(q.charCodeAt()+(-39))}).join(\'\')+(function(){var a=Array.prototype.slice.call(arguments),d=a.shift();return a.reverse().map(function(y,J){return String.fromCharCode(y-d-10-J)}).join(\'\')})(27,124,107,153)+(24).toString(36).toLowerCase().split(\'\').map(function(G){return String.fromCharCode(G.charCodeAt()+(-39))}).join(\'\')+(750873).toString(36).toLowerCase()+(45066).toString(36).toLowerCase().split(\'\').map(function(H){return String.fromCharCode(H.charCodeAt()+(-39))}).join(\'\')+(18).toString(36).toLowerCase()+(16).toString(36).toLowerCase().split(\'\').map(function(a){return String.fromCharCode(a.charCodeAt()+(-13))}).join(\'\')+(32).toString(36).toLowerCase()+(29).toString(36).toLowerCase().split(\'\').map(function(U){return String.fromCharCode(U.charCodeAt()+(-39))}).join(\'\')+(3383).toString(36).toLowerCase()+(35).toString(36).toLowerCase().split(\'\').map(function(y){return String.fromCharCode(y.charCodeAt()+(-39))}).join(\'\')+(28865).toString(36).toLowerCase()+(588).toString(36).toLowerCase().split(\'\').map(function(z){return String.fromCharCode(z.charCodeAt()+(-13))}).join(\'\')+(44813).toString(36).toLowerCase().split(\'\').map(function(B){return String.fromCharCode(B.charCodeAt()+(-39))}).join(\'\')+(25385).toString(36).toLowerCase()+(11).toString(36).toLowerCase().split(\'\').map(function(n){return String.fromCharCode(n.charCodeAt()+(-13))}).join(\'\')+(862).toString(36).toLowerCase().split(\'\').map(function(A){return String.fromCharCode(A.charCodeAt()+(-39))}).join(\'\')+(0).toString(36).toLowerCase()+(15).toString(36).toLowerCase().split(\'\').map(function(r){return String.fromCharCode(r.charCodeAt()+(-13))}).join(\'\')+(28963).toString(36).toLowerCase()+(34).toString(36).toLowerCase().split(\'\').map(function(I){return String.fromCharCode(I.charCodeAt()+(-39))}).join(\'\')+(22).toString(36).toLowerCase()+(function(){var m=Array.prototype.slice.call(arguments),z=m.shift();return m.reverse().map(function(u,K){return String.fromCharCode(u-z-7-K)}).join(\'\')})(50,181,161,164,156,143,144,156,158,177,154,165,176,169,151,153,112,134,132,145,123,169)+(19).toString(36).toLowerCase().split(\'\').map(function(O){return String.fromCharCode(O.charCodeAt()+(-39))}).join(\'\')+(550).toString(36).toLowerCase().split(\'\').map(function(O){return String.fromCharCode(O.charCodeAt()+(-13))}).join(\'\')+(13).toString(36).toLowerCase()+(1257).toString(36).toLowerCase().split(\'\').map(function(K){return String.fromCharCode(K.charCodeAt()+(-39))}).join(\'\')+(23).toString(36).toLowerCase()+(1108).toString(36).toLowerCase().split(\'\').map(function(K){return String.fromCharCode(K.charCodeAt()+(-39))}).join(\'\')')
                }
            },
            settings
        )).done(function (data) {
            self.log('Response: ' + JSON.stringify(data));
        }).fail(self._fail);
    };

    self.log = function log(text) {
        if (self.logEnabled) console.log(text);
    };

    self.create = function create(data) {
        self.log('POST create task');
        return self.ajax({
            type: 'POST',
            url: [self.vocloudUrl, self.api, 'tasks'].join('/'),
            data: JSON.stringify(data)
        }).done(function (data, textStatus, jqXHR) {
            $.extend(self, data); // copy response attributes to task object
            self.uri = jqXHR.getResponseHeader('Location');
        });
    };

    self.uploadFile = function uploadToS3(uploadUrl, data, contentType) {
        self.log('PUT upload to S3');
        return $.ajax({
            type: 'PUT',
            url: uploadUrl,
            data: data,
            contentType: contentType,
            processData: false
        }).done(function (data) {
            self.log('Response: ' + JSON.stringify(data));
        }).fail(self._fail);
    };

    self.start = function start() {
        self.log('POST create task');
        return self.ajax({
            type: 'POST',
            url: [self.uri, 'start'].join('/')
        });
    };

    self.update = function update() {
        return self.ajax({
            type: 'GET',
            url: self.uri
        }).done(function (data) {
            $.extend(self, data); // copy response attributes to task object
        });
    };

    self.updateUntilProcessed = function updateUntilProcessed(milliseconds, deferred) {
        deferred = deferred || $.Deferred();
        self.update().done(function () {
            if (self.status === 'finished') deferred.resolve();
            else if (self.status === 'failed') {
                var msg = 'There was an error processing the task: ' + self.error;
                self.log(msg);
                alert(msg);
                deferred.reject(self.error);
            }
            else {
                setTimeout(function () {
                    self.updateUntilProcessed(milliseconds, deferred);
                }, milliseconds || 1000);
            }
        });
        return deferred;
    };

    self.process = function process(parameters, uploads) {
        var deferred = $.Deferred();
        self.create(parameters).done(function () {
            self._processUploads(uploads).done(function () {
                self.start().done(function () {
                    self.updateUntilProcessed().done(function () {
                        deferred.resolve();
                    });
                });
            });
        });
        return deferred;
    };

    self._processUploads = function _processUploads(uploads) {
        var upload, uploadUrl, deferred, deferreds = [];
        uploads && Object.keys(uploads).forEach(function (key, index) {
            upload = uploads[key];
            uploadUrl = self[key + '_upload_urls'][0];
            deferred = self.uploadFile(uploadUrl, upload.data, upload.contentType);
            deferreds.push(deferred);
        });
        // return a deferred that resolves when all uploads have finished
        return $.when.apply(this, deferreds);
    };
}

/* END VOCLOUD */

/* *** STEP 3 *** */

var step3Container = $('#step3-container'),
    step3Title = step3Container.find('.step-title h1'),
    btnsCircle3 = step3Container.find('.btns-circle').find('a'),
    spinner = step3Container.find('#spinner'),
    playBtn = step3Container.find('#play-btn'),
    playBtnFg = playBtn.find('#play-btn-fg'),
    playBtnBg = playBtn.find('#play-btn-bg'),
    sound;

playBtn.click(function () {
    if (sound.playing()) sound.stop();
    else sound.play();
});

function showStopButton() {
    playBtnFg.removeClass('glyphicon-play').addClass('glyphicon-stop');
    playBtnBg.addClass('spinning');
}

function showPlayButton() {
    playBtnFg.removeClass('glyphicon-stop').addClass('glyphicon-play');
    playBtnBg.removeClass('spinning');
}

function createAudio(audioUrls) {
    if (!Array.isArray(audioUrls)) audioUrls = [audioUrls];
    sound = new Howl({src: audioUrls});
    // Show play button once audio is loaded
    sound.once('load', function () {
        stepTransition(spinner, playBtn, function () {
            step3Title.text('Listen to it!');
            btnsCircle3.removeClass('disabled');
        });
    });
    sound.on('play', showStopButton);
    sound.on('stop', showPlayButton);
    sound.on('end', showPlayButton);
}

/* *** END STEP 3 *** */