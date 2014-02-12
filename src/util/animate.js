/**
 *
 * Author: songyaru | songyaru9@gmail.com
 * Date: 14-1-20  下午2:06
 *
 */
(function ($, undefined) {
    var pluginName = "slide";
    var currentClassName = "cur";
    var vendorPrefix = (function () { //todo jquery自动加上了vendorPrefix，简化为判断是否支持css3的transition
        var body = document.body || document.documentElement,
            style = body.style;
        var transition = "Transition";
        var vendor = [ "O", "ms" , "Moz", "Webkit"], len = vendor.length;
        while (len--) {
            if (vendor[len] + transition in style) {
                return vendor[len];
            }
        }
        return false;
    })();

    var pluginImpl = {
        options: {
            animate: {
                styles: "slide",//"fade","slide"
                easing: "linear",
                speed: 800
            }
        },

        slide: function (direct, speed, easing) {
            var _this = this;
            var value = [ "-100%" , "0", "100%"];

            this.current.css("left", value[1 + direct]).show();
            if (vendorPrefix) {
                this.container.css({
                    "transform": "translateX(" + value[1 - direct] + ")", //todo translateY
                    "transitionDuration": speed + "ms"
                }).one("transitionend", function () {
                        _this.animateDone(direct);
                    });
            } else {
                this.container.animate({"left": value[1 - direct]}, speed, easing, function () {
                    _this.animateDone(direct);
                });
            }
        },

        fade: function (direct, speed) {
            var _this = this;
            var flag = 2;
            this.last.fadeOut(speed, function () {
                _this.last.removeClass(currentClassName);
                _this._isAnimate = --flag;
            });
            this.current.fadeIn(speed, function () {
                _this.current.addClass(currentClassName);
                _this._isAnimate = --flag;
            });
        },
        animate: function (direct) {
            this._isAnimate = true;
            var animateOpts = this.options.animate;
            var animStyle = animateOpts.styles;
            if (animStyle == "slide" || animStyle == "fade") {
                this[animStyle](direct, animateOpts.speed, animateOpts.easing);
            }
        },
        animateDone: function (direct) {
            this.container[0].style.cssText = "";//todo 默认style
            this.last.removeClass(currentClassName).hide();
            this.current.addClass(currentClassName).css("left", 0).show();
            this._isAnimate = false;
            this.element.trigger("ui_animate_done");
        },
        _createAnimate: function (options) {
            var _this = this;
            this.element.on("ui_jump", function (e, data) {
                _this.animate(data.direct)
            })
        }
    };

    var plugin = $[pluginName];
    plugin._extend(pluginImpl);

//    require.async("slide", function (plugin) {
//        $.extend(plugin.prototype, pluginImpl);
//    });

})(jQuery);