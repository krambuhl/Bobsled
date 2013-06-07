(function ($) {
    $.fn.extend({
    	vAlign: function() {
			return this.each(function(i){
				var ah = $(this).height();
				var ph = $(this).parent().height();
				var mh = Math.ceil((ph-ah) / 2);
				$(this).parent().css('margin-top', mh);
			});
		},

        bobsled: function (extend) {
            var options = $.extend({
                slideTime    : 4,   // seconds
                resetTime    : 0.5, // seconds
                timeout      : 0,
                timer        : undefined,

                select : {
                    nav         : '.bobsled-nav',
                    navItem     : '.bobsled-nav-item',
                    progress    : '.bobsled-progressbar',

                    content     : '.bobsled-content',
                    slide       : '.bobsled-slide',
                    background  : '.bobsled-slide-background > img'
                },

                state : {
	                nav : {
	                	stagePre   : 'bobsled-nav-stage-before',
	                	stagePost  : 'bobsled-nav-stage-after',

	                	inactive : 'bobsled-nav-inactive',
	                	active   : 'bobsled-nav-active',
	                	complete : 'bobsled-nav-complete',
	                },

	                slide : {
	                	stagePre   : 'bobsled-slide-stage-before',
	                	stagePost  : 'bobsled-slide-stage-after',

	                	stage    : 'bobsled-slide-stage',
	                	inactive : 'bobsled-slide-inactive',
	                	active   : 'bobsled-slide-active',
	                	complete : 'bobsled-slide-complete',
	                }
                },

                activeSlide  : 0,
                defaultSlide : -1
            }, extend),


            setupTimer = function() {
                if (options.timer !== undefined) clearTimeout(options.timer);

                options.timer = setTimeout(function () {
                    options.activeSlide = options.activeSlide + 1;

                    if (options.activeSlide < count) {
			        	options.timeout = options.slideTime;
			        	renderBobsled();
			        	renderProgressBar();
                    } else {
                    	options.activeSlide = -1;
	                	options.timeout = options.resetTime;
			        	renderProgressBar();
			        	renderBobsled();
			        }

			        setupTimer();

                }, options.timeout * 1000);
            },


            renderBobsled = function() {
            	if (options.activeSlide == -1 && options.activeSlide < count - 1)
            		var override = 0;
            	else
            		var override = options.activeSlide;

              	$(options.select.navItem, that)
            		.removeClass(options.state.nav.stagePre)
            		.removeClass(options.state.nav.stagePost)
            		.removeClass(options.state.nav.inactive)
            		.removeClass(options.state.nav.active)
            		.removeClass(options.state.nav.complete)

            	$(options.select.slide, that)
            		.removeClass(options.state.slide.stagePre)
            		.removeClass(options.state.slide.stagePost)
            		.removeClass(options.state.slide.inactive)
            		.removeClass(options.state.slide.active)
            		.removeClass(options.state.slide.complete)

				for (var i = 0; i < count; i++) {
					if (i < override - 1) {
						$(options.select.navItem, that).eq(i).addClass(options.state.nav.stagePost);
						$(options.select.slide,   that).eq(i).addClass(options.state.slide.stagePost);
					}

					if (i == override - 1) {
						$(options.select.navItem, that).eq(i).addClass(options.state.nav.complete);
						$(options.select.slide,   that).eq(i).addClass(options.state.slide.complete);
					}

					if (i == override) {
						$(options.select.navItem, that).eq(i).addClass (options.state.nav.active);
						$(options.select.slide,   that).eq(i).addClass (options.state.slide.active);
					}

					if (i == override + 1) {
						$(options.select.navItem, that).eq(i).addClass(options.state.nav.inactive);
						$(options.select.slide,   that).eq(i).addClass(options.state.slide.inactive);
					}

					if (i > override + 1) {
						$(options.select.navItem, that).eq(i).addClass(options.state.nav.stagePre);
						$(options.select.slide,   that).eq(i).addClass(options.state.slide.stagePre);
					}
				}
            },

            renderProgressBar = function () {
				progress = (options.activeSlide + 1) * 20;
				$(options.select.progress).animate({ width : (progress + '%')}, options.timeout * 1000, 'linear');
            },


            // private definitions
            that  = this,
            count = $(options.select.navItem, that).length;

            // program
            options.activeSlide = options.defaultSlide;

	        setupTimer();
	        renderBobsled();


	        //background vertical align
	        $(window).resize(function() { $(options.select.background, that).vAlign(); });
	        $(window).load  (function() { $(options.select.background, that).vAlign(); });


	        //clicks

            $(options.select.navItem + ' > a', that).bind('click', function(index) {
	            console.log(this, that, index);

				clearTimeout(options.timer);

				options.activeSlide = $(this).index(options.select.navItem + ' > a');
				progress = (options.activeSlide + 1) * 20;

				$(options.select.progress).stop(true, true).css('width', (progress + '%'));
				renderBobsled()

            });


            // swipes

            if ($().swipe !== undefined) {
	           	$(options.select.content).swipe({
	           		swipe: function (event, direction) {
						clearTimeout(options.timer);

	           			if (direction == 'left')
	           				options.activeSlide  = (options.activeSlide + 1 > count - 1) ? 0 : options.activeSlide + 1;

	           			if (direction == 'right')
	           				options.activeSlide = (options.activeSlide - 1 < 0) ? count - 1 : options.activeSlide - 1;

						progress = (options.activeSlide + 1) * 20;

						$(options.select.progress).stop(true, true).css('width', (progress + '%'));
						renderBobsled()
	           		},
	           		threshold : 0
	           	});
            }

            return this;
        }
    })
})(jQuery);