var videoModal = $('#video-modal');
var videoPlayer = videoModal.find('iframe')[0];
videoModal
    // Pause video when modal closes
    .on('hidden.bs.modal', function (e) {
        videoPlayer.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    })
    // Play video when modal is shown
    .on('shown.bs.modal', function (e) {
        videoPlayer.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    });