(function ($) {
    $.fn.extend({
        bobsled: function (extend) {
            var options = $.extend({
                minFrameTime: 10, // seconds
                minShowTime: 40, // seconds
                timer: undefined,

                offset : 'data-bobsled-offset',
                
                select : {
                    owner  : '.slider',
                    frame  : '.slider-frame',
                    dots   : '.slider-selector-item'
                },
                
                c : {
                    direction : ['before', 'after'],
                    numbers   : ['one', 'two', 'three'],
                    active    : 'active'
                },
                
                defaultFrame : 0,
                activeFrame  : 0
            }, extend),
            
            setOffset = function() {
                var position = -1 * options.activeFrame;
                
                $(options.select.frame, that).each(function() {
                    $(this).attr(options.offset, position++);
                });
                
                $(that).bobsledRender( options );
            },
            
            setupTimer = function() {
                var time  = options.minShowTime / count,
                    time  = (time < options.minFrameTime) ? options.minFrameTime : time;
                    
                if (options.timer !== undefined) clearTimeout(options.timer);
                                
                options.timer = setTimeout(function () {
                    options.activeFrame = (options.activeFrame >= count - 1) ? 0 : options.activeFrame + 1;
                    
                    setOffset();
                    setupTimer();
                    
                }, time * 1000);
            },
            
            that = this,
            count = $(options.select.dots, that).length;
            
            options.activeFrame = options.defaultFrame;
            setOffset();
            setupTimer();
            
            
            $(options.select.frame, this).click (function() {                 
                options.activeFrame = $(this).index();
                setOffset();
                setupTimer();
            });
            
            $(options.select.dots, this).click (function() { 
                options.activeFrame = $(this).index();
                setOffset();
                setupTimer();
            });
            
            return this;
        },
        
        bobsledRender: function (options) {
            return this.each(function() {                
                var offset = $($(options.select.frame, this).get(0)).attr(options.offset);
                
                $(options.select.frame, this).each(function(index) {
                    var position = $(this).attr(options.offset);
                    
                    $(this).removeClass(options.c.direction.join(' ') + ' ' + options.c.numbers.join(' ') + ' ' + options.c.active);
                
                    if (position ==  0) $(this).addClass(options.c.active); 
                    
                    
                    if (position == -1) $(this).addClass(options.c.direction[0] + ' ' + options.c.numbers[0]); 
                    if (position ==  1) $(this).addClass(options.c.direction[1] + ' ' + options.c.numbers[0]); 
                    
                    if (position == -2) $(this).addClass(options.c.direction[0] + ' ' + options.c.numbers[1]); 
                    if (position ==  2) $(this).addClass(options.c.direction[1] + ' ' + options.c.numbers[1]); 
                    
                    if (position <= -3) $(this).addClass(options.c.direction[0] + ' ' + options.c.numbers[2]);
                    if (position >=  3) $(this).addClass(options.c.direction[1] + ' ' + options.c.numbers[2]);
                });
                
                
                $(options.select.dots, this).removeClass(options.c.active);
                $($(options.select.dots, this)[Math.abs(offset)]).addClass(options.c.active);
            });
        }    
    })
})(jQuery);