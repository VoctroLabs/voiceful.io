var spinner = $('#spinner'),
    playBtn = $('#play-btn'),
    playBtnFg = playBtn.find('#play-btn-fg'),
    playBtnBg = playBtn.find('#play-btn-bg'),
    audio_url = url('?audio_url'),
    lyrics = url('?lyrics'),
    sound,
    btnsCircle = $('.btns-circle').find('a'),
    facebookBtn = $('#facebook-btn'),
    twitterBtn = $('#twitter-btn'),
    emailBtn = $('#email-btn'),
    currentUrl = document.location.href;

// Returns if we are running in development mode
function devMode() {
    return location.hostname === "localhost" || location.hostname === "127.0.0.1";
}

function stepTransition(hideElem, showElem, func) {
    hideElem.fadeOut(200, function () {
        func && func.call(this);
        showElem.fadeIn(1000);
    });
}

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
        stepTransition(spinner, playBtn);
    });
    sound.on('play', showStopButton);
    sound.on('stop', showPlayButton);
    sound.on('end', showPlayButton);
}

function newWindow(url) {
    var width = 600,
        height = 400,
        dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left,
        dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top,
        screenWidth = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width,
        screenHeight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height,
        left = ((screenWidth / 2) - (width / 2)) + dualScreenLeft,
        top = ((screenHeight / 2) - (height / 2)) + dualScreenTop,
        specs = [
            'width=' + width,
            'height=' + height,
            'top=' + top,
            'left=' + left,
            'location=no',
            'menubar=no',
            'scrollbars=no',
            'status=no',
            'titlebar=no',
            'toolbar=no'
        ].join(',');
    return window.open(url, '_blank', specs);
}

// Pass a url that contains "CURRENT_URL"
function newShareWindow(url) {
    newWindow(url.replace('CURRENT_URL', currentUrl));
}

facebookBtn.click(function () {
    var url = "https://www.facebook.com/sharer/sharer.php?kid_directed_site=0&sdk=joey&u=CURRENT_URL&display=popup&ref=plugin&src=share_button"
    newShareWindow(url);
});

twitterBtn.click(function () {
    var message = 'Check this out CURRENT_URL #voiceful_io #voctrolabs',
        url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(message);
    newShareWindow(url);
});

emailBtn.click(function () {
    var subject = 'Guess who it is',
        message = 'Check this out:\n\nCURRENT_URL';
        url = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(message);
    newShareWindow(url);
});

// ### Run on load ready

$(document).ready(function () {
    if (!audio_url) {
        !devMode() && alert('Ups! There is no audio to play. Did you get here by mistake? Anyway, we will play you another thing then :)');
        audio_url = 'https://s3-eu-west-1.amazonaws.com/media.voctrolabs/vocloud/votrans_tasks/5e2f90c9-4760-4117-a560-973ffbc870fc/outputs/original/output.wav'
    }
    $('#lyrics').text('\"'+decodeURIComponent(lyrics)+'\"');

    createAudio(audio_url);
});
