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

$('#audio-modal')
    // Change audio modal title and audio source dynamically depending on the pressed button
    .on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var title = button.data('title');
        var iframe_src = button.data('audio');
        var modal = $(this);
        modal.find('.modal-title').text(title);
        modal.find('.modal-body .video-wrapper iframe').attr('src', iframe_src + '?autoplay=1')
    })
    // Stop reproduction when audio modal closes
    .on('hidden.bs.modal', function (event) {
        var modal = $(this);
        modal.find('.modal-body .video-wrapper iframe').attr('src', '')
    });

$('#video-carousel').bind('slide.bs.carousel', function (e) {
  $( ".youtube-video" ).each(function() {
    $(this)[0].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
  });
}); 
