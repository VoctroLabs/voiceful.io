$(document).ready(function() {
    var disablePanel = false;
    
    $('.collapse').on('hide.bs.collapse', function (e) { 
      activePanel = $(this);
      if (disablePanel === true) {
        console.log("CloseDisabled");
        e.preventDefault();
      }
      else {
        e.preventDefault(); 
        setTimeout(function() {
          console.log(activePanel.attr("id"));
          activePanel.removeClass("in"); 
        }, 700);
      } 
    });
    $('.collapse').on('show.bs.collapse', function (e) {
      console.log("ClosedEnabled");
      disablePanel = false;
    });
    // $('#usesAccordion').on('hide.bs.collapse',function (e) {
    //   if (disablePanel === true) {
    //     console.log("CloseDisabled");
    //     e.preventDefault();
    //   }
    //   else {
    //     disablePanel = false;
    //     console.log("ClosedEnabled");
    //   }
    // });
    // $('#usesAccordion').on('show.bs.collapse', function (e) {
    //   console.log("ClosedEnabled");
    //   disablePanel = false;
    // });
    
    $('.panel-opener').on('click', function(ev) {
      var isOpened = $(this).attr("aria-expanded");
      // console.log(isOpened);
      if (isOpened == 'true') {
        disablePanel = true;
        // var target = $(this).attr("href");
        // target = $(target);
        // $(target).on('hide.bs.collapse', function (e) {
        //   e.preventDefault();
        // });
      }
    });
    $('.panel-closer').on('click', function(ev) {
      disablePanel = false;
    });
        
    // check if there is a hash in the url
    if ( window.location.hash != '' )
    {
        // remove any accordion panels that are showing (they have a class of 'in')
        $('.collapse').removeClass('in');
    
        // show the panel based on the hash now:
        $(window.location.hash + '.collapse').collapse('show');
    }
  });