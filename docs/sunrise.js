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
                closeConfirm: null,
                closeConfirmText: 'Are you sure?',
                backgroundClose: true,
                ajax: false,
                dataType: 'html',

                openCallback: function () {},
                closeCallback: function () {}
            }

            _.options = $.extend(true, _.defaults, settings);

            _.initial = {
                fnidx: ++fnidx,
                saveDefaultValue: [],
                isClose: true
            }

            _.markups = {
                outer: '<div class="sunrise-outer">',
                scrll: '<div class="sunrise-scrll">',
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
        _.element.body.addClass('sunrise-fixed');
        _.element.outer = _.element.body.append(_.markups.outer).children('.sunrise-outer:last-child');
        _.element.scrll = _.element.outer.append(_.markups.scrll).children('.sunrise-scrll');
        _.element.inner = _.element.scrll.append(_.markups.inner).children('.sunrise-inner');
        _.element.scene = _.element.inner.append(_.markups.scene).children('.sunrise-scene');
        _.element.frame = _.element.scene.append(_.markups.frame).children('.sunrise-frame');
    }

    Sunrise.prototype.cursorChecker = function () {
        var _ = this;

        if (!_.options.backgroundClose) {
            _.element.outer.addClass('cursor-default');
        }
    }

    Sunrise.prototype.saveDefaultValue = function () {
        var _ = this;

        if (_.options.closeConfirm) {
            $.each(_.options.closeConfirm, function () {
                _.initial.saveDefaultValue.push(_.element.popup.find('[name='+this+']').val());
            });
        }
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
                    _.element.outer.addClass('sunrise-visible');
                    _.saveDefaultValue();
                }
            });
        } else {
            _.options.openCallback(_.element.target);
            _.element.popup = _.element.target.appendTo(_.element.frame).show();
            _.element.outer.addClass('sunrise-visible');
            _.saveDefaultValue();
        }
    }

    Sunrise.prototype.closePopup = function () {
        var _ = this;

        _.closeConfirmCheck();

        if (!_.initial.isClose) {
            _.initial.isClose = confirm(_.options.closeConfirmText);
        }
        if (_.initial.isClose) {
            if (!_.options.ajax) {
                _.element.popup.appendTo(_.element.body).hide();
                if (_.options.closeConfirm) {
                    $.each(_.options.closeConfirm, function (i) {
                        _.element.popup.find('[name='+this+']').val(_.initial.saveDefaultValue[i]);
                    });
                }
            }
            _.options.closeCallback(_.element.target);
            _.element.outer.remove();
            _.element.body.removeClass('sunrise-fixed');
            $(window).scrollTop(_.initial.scrollTop);
        }
    }

    Sunrise.prototype.closeConfirmCheck = function () {
        var _ = this;

        if (_.options.closeConfirm) {
            $.each(_.options.closeConfirm, function (i) {
                if (_.element.popup.find('[name='+this+']').val() != _.initial.saveDefaultValue[i]) {
                    _.initial.isClose = false;
                    return false;
                }
            });
        }
    }

    Sunrise.prototype.eventsRegister = (function () {
        return {
            close: function (_) {
                if (_.options.backgroundClose) {
                    $(document).on(_.events.click, function (e) {
                        if (e.target === _.element.inner[0] || e.target === _.element.scene[0]) {
                            _.closePopup();
                        }
                    });
                }
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
        _.cursorChecker();
        _.drawPopup();

        _.eventsRegister.close(_);
    }

    window.sunrise = function () {
        return new Sunrise(arguments[0]);
    }
}(jQuery));