/**
 * jQuery custom <select> plugin
 * @verison 0.1
 * @author Anton Derugin
 */

(function ($) {
    var methods = {
        init: function(options) {
            var settings = $.extend({
                customSelect              : 'js-custom-select',
                customSelectInput         : 'js-custom-select__input',
                customSelectCurrent       : 'js-custom-select__current',
                customSelectMenu          : 'js-custom-select-menu',
                customSelectMenuCurrent   : 'js-custom-select-menu__current',
                customSelectMenuItems     : 'js-custom-select-menu__items',
                customSelectMenuItem      : 'js-custom-select-menu__item',
                customSelectMenuItemActive: 'js-custom-select-menu__item_state_active',
                shiftX                    : 0,
                shiftY                    : 0,
                defaultValue              : null
            }, options);

            var i = 0;

            return this.each(function() {
                // Attributes
                methods._settings                 = settings;
                methods._                         = this;
                methods._originSelectClasses      = $(this).attr('class');
                methods._originSelectPositionTop  = $(this).offset().top;
                methods._originSelectPositionLeft = $(this).offset().left;
                methods._originSelectOptions      = $(this).find('option');
                methods._originSelectName         = $(this).attr('name');
                methods._id                       = ++i;
                // Initialisation methods
                methods._createFakeSelect();
                // Events
                $('.' + settings.customSelectMenuItem).bind('click', methods._makeSelectOption);
                $('.' + settings.customSelect).unbind('click').bind('click', methods._toggleOptions);
                $('html').bind('click', methods._hideOptions);
            });
        },

        _makeSelectOption: function(event) {
            var settings = methods._settings,
                elementID = $(event.currentTarget).closest('.' + settings.customSelectMenu).data('id');

            $('.' + settings.customSelect + '[data-id=' + elementID + ']')
                .find('.' + settings.customSelectCurrent)
                .text($(this).text());

            $(this)
                .parent()
                .find('.' + settings.customSelectMenuItem)
                .removeClass(settings.customSelectMenuItemActive);
            $(this).addClass(settings.customSelectMenuItemActive);

            $('.' + settings.customSelectMenu + '[data-id=' + elementID + ']')
                .find('.' + settings.customSelectMenuCurrent)
                .text($(this).text());

            $('.' + settings.customSelect + '[data-id=' + elementID + ']')
                .find('.' + settings.customSelectInput)
                .val($(this).data('value'))
                .trigger('change');

            methods._toggleOptions();
        },

        _toggleOptions: function(event) {
            if (event === undefined) return;
            event.stopPropagation()

            var options = $('.' + methods._settings.customSelectMenu + 
                            '[data-id=' + $(event.currentTarget).data('id') + ']');

            if (options.is(':visible')) {
                options.hide(0);
            } else {
                options.show(0);
            };
        },

        _hideOptions: function() {
            $('.' + methods._settings.customSelectMenu).hide(0);
        },

        _getFakeOptions: function() {
            // Create options tree
            var objects = [];
            this._originSelectOptions.each(function() {
                objects.push({
                    value       : $(this).attr('value') || '',
                    name        : $(this).text(),
                    is_selected : $(this).is(':selected'),
                });
            });
            return objects
        },

        _createFakeSelect: function() {
            // Create fake html selector
            var settings = methods._settings,
                optionsArray = methods._getFakeOptions();

            var customSelectElement = 
                '<div class="' + settings.customSelect + ' ' + methods._originSelectClasses + '" data-id="' + methods._id + '">'
                + '<div class="' + settings.customSelectCurrent + '"></div>'
                + '<input type="hidden" class="' + settings.customSelectInput + '" name="' + methods._originSelectName + '">'
                + '</div>';

            var customSelectMenuElement = 
                '<div class="' + settings.customSelectMenu + '" data-id="' + methods._id + '">'
                + '<div class="' + settings.customSelectMenuCurrent + '"></div>'
                + '<div class="' + settings.customSelectMenuItems + '"></div>'
                + '</div>';

            // Replace default <select>
            $(this._).replaceWith(customSelectElement);
            $('body').append(customSelectMenuElement);

            var customSelect = $('.' + settings.customSelect + '[data-id=' + this._id + ']'),
                customSelectCurrent = customSelect.find('.' + settings.customSelectCurrent),
                customSelectInput = customSelect.find('.' + settings.customSelectInput);

            var customSelectMenu = $('.' + settings.customSelectMenu + '[data-id=' + this._id + ']'),
                customSelectMenuCurrent = customSelectMenu.find('.' + settings.customSelectMenuCurrent),
                customSelectMenuItems = customSelectMenu.find('.' + settings.customSelectMenuItems);
                
            for (var i = 0; i < optionsArray.length; i++) {
                if (optionsArray[i]['is_selected'] == true) {
                    customSelectCurrent.text(optionsArray[i].name);
                    customSelectMenuCurrent.text(optionsArray[i].name);
                    customSelectInput.val(optionsArray[i]['value']);
                    break;
                };
            };

            if (settings.defaultValue) {
                customSelectCurrent.text(settings.defaultValue);
                customSelectMenuCurrent.text(settings.defaultValue);
            };

            for (var i = 0; i < optionsArray.length; i++) {
                customSelectMenuItems.append('<div class="' + settings.customSelectMenuItem + '" data-value="' + optionsArray[i].value + '">' + optionsArray[i].name + '</div>')
            };

            customSelectMenu
                .hide(0)
                .css({
                    'position': 'absolute',
                    'top'     : methods._originSelectPositionTop + settings.shiftY,
                    'left'    : methods._originSelectPositionLeft + settings.shiftX,
                });
        }
    };

    $.fn.customSelect = function(options) {
        return methods.init.apply(this, [options]);
    };
})(jQuery);