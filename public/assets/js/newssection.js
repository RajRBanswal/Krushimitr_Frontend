(function(){

    function scroller() {
    
      var scroll = $('div.scroll');
      
      var height = scroll.height();
      
      var topAdj = -height-30; 
        
        scroll.animate({
            'top' : [topAdj, 'linear'] 
        }, 30000, function(){
            scroll.css('top', 80);
            scroller();
        });}
        
    scroller();
    
    })();