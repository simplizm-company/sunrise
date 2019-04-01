/*
 * Eclipse for jQuery
 * Version: 1.0.1
 * Author: shinyongjun
 * Website: http://www.simplizm.com/
 */

 // issue connected event error

;(function($){
    'use strict';

    var Sunrise = (function(){
        var fnidx = 0;

        function Sunrise(settings){
            var _ = this;

            _.defaults = {
                target: null,
                ajax: false,
                dataType: 'html',

                openCallback: function () {},
                closeCallback: function () {}
            }

            _.options = $.extend({}, _.defaults, settings);

            _.initial = {
                fnidx: ++fnidx
            }

            _.markups = {
                outer: '<div class="sunrise-outer">',
                inner: '<div class="sunrise-inner">',
                scene: '<div class="sunrise-scene">',
                frame: '<div class="sunrise-frame">'
            }

            _.element = {
                body: $('body'),
                target: !_.options.ajax ? $(_.options.target) : null
            }

            _.events = {
                click: 'click.sunrise'+_.initial.fnidx
            }

            _.init(true);
        }

        return Sunrise;
    }());

    Sunrise.prototype.layoutMarkup = function () {
        var _ = this;

        _.initial.scrollTop = $(window).scrollTop();
        _.element.body.addClass('sunrise-fixed').css({'top': -_.initial.scrollTop});
        _.element.outer = _.element.body.append(_.markups.outer).children('.sunrise-outer');
        _.element.inner = _.element.outer.append(_.markups.inner).children('.sunrise-inner');
        _.element.scene = _.element.inner.append(_.markups.scene).children('.sunrise-scene');
        _.element.frame = _.element.scene.append(_.markups.frame).children('.sunrise-frame');
    }

    Sunrise.prototype.drawPopup = function () {
        var _ = this;

        if (_.options.ajax) {
            $.ajax({
                url: _.options.target,
                timeout: 10000,
                dataType: _.options.dataType,
                success: function (popup) {
                    _.element.target = $(popup);
                    _.options.openCallback(_.element.target);
                    _.element.popup = _.element.target.appendTo(_.element.frame).show();
                    _.element.frame.addClass('sunrise-visible');
                }
            });
        } else {
            _.options.openCallback(_.element.target);
            _.element.popup = _.element.target.appendTo(_.element.frame).show();
            _.element.frame.addClass('sunrise-visible');
        }
    }

    Sunrise.prototype.closePopup = function () {
        var _ = this;

        if (!_.options.ajax) {
            _.element.popup.appendTo(_.element.body).hide();
        }
        _.options.closeCallback(_.element.target);
        _.element.outer.remove();
        _.element.body.removeClass('sunrise-fixed').css({'top': 0});
        $(window).scrollTop(_.initial.scrollTop);
    }

    Sunrise.prototype.eventsRegister = (function () {
        return {
            close: function (_) {
                $(document).on(_.events.click, function (e) {
                    if (e.target === _.element.inner[0] || e.target === _.element.scene[0]) {
                        _.closePopup();
                    }
                });
            }
        }
    })();

    Sunrise.prototype.sunrise = function (method) {
        var _ = this;

        if (_[method]) {
            _[method](arguments[1]);
        } else {
            console.log('This is not the method of Sunrise.');
        }
    }

    Sunrise.prototype.init = function () {
        var _ = this;

        _.layoutMarkup();
        _.drawPopup();

        _.eventsRegister.close(_);
    }

    window.sunrise = function () {
        return new Sunrise(arguments[0]);
    }
}(jQuery));