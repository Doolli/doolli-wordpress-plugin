(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';



document.addEventListener('DOMContentLoaded', function() {
    var utils  = require('./inc/utils.js'),
        init   = require('./inc/init.js');



    // Adding font-awesome
    utils.extra_style('//netdna.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css');

    // Starting everything
    if(document.querySelector('.doolli-wrapper')) {
        init.start();
    }
});
},{"./inc/init.js":6,"./inc/utils.js":12}],2:[function(require,module,exports){
'use strict';



var utils           = require('./utils.js'),
    DOM             = require('./variables.js'),
    filters         = require('./filters.js'),
    templates       = require('./templates.js')['JST'],
    url             = require('./url_proccessing.js'),


    // The wrapper controls functions
    filters_fn = require('./controls/filters.js'),
    sort_fn    = require('./controls/sort.js'),


    pagination_fn = function() {
        DOM.pager.addEventListener('click', function(e) {
            var button = e.target.nodeName.toLowerCase() === 'a' ? e.target : null,
                page   = button.getAttribute('href');

            if(button) {
                url.set_link({type: 'page', value: page, filter_url: filters.toString()});
                e.preventDefault();
            }
        }, false);
    } // end of pagination


module.exports = {
    init: function() {
        /** ==========================================================================================================
        * Main controls
         */

        // adding click events to the items in the list
        DOM.wrapper.addEventListener('click', function(e) {
            var link = e.target, //we only work with links, the rest we ignore using the if logic
                id   = '',
                href = '';

            // Getting the link  when clicking inside of it (text, image, etc)
            while(link.parentNode) {
                if(link.nodeName.toLowerCase() === 'a') {
                    break;
                }

                link = link.parentNode;                // iterating
            }

            if(!e.target.classList.contains('fa-expand') && link.parentNode && link.nodeName.toLowerCase() === 'a' && utils.closest_parent(link, 'doolli-item-inner')) {
                url.set_link({type: 'item', value: link.getAttribute('href')});
            }

            e.preventDefault();
        });


        if(DOM.filters) {
            filters_fn();
        }


        if(DOM.sort_button) {
            sort_fn();
        }



        /** ==========================================================================================================
        * Item view
         */

        document.querySelector('.doolli-wrapper').addEventListener('click', function(e) {
            var button = (e.target.parentNode && e.target.parentNode.classList.contains('doolli-btn-back')) ? e.target.parentNode : e.target;

            if(button.classList.contains('doolli-btn-back')) {
                url.set_link({type: '', value: ''});
            }
        });



        /** ==========================================================================================================
        * Pagination
         */

        if(DOM.pager) {
            pagination_fn();
        }
    }
}
},{"./controls/filters.js":3,"./controls/sort.js":4,"./filters.js":5,"./templates.js":10,"./url_proccessing.js":11,"./utils.js":12,"./variables.js":13}],3:[function(require,module,exports){
'use strict';



var utils           = require('../utils.js'),
    DOM             = require('../variables.js'),
    filters         = require('../filters.js'),
    url             = require('../url_proccessing.js');



module.exports = function() {
    // left side filter menu
    var main_category_filters = function(button) {
            // toggling the active from the old to the new
            DOM.filters_wrapper.querySelector('.doolli-categories .active').classList.remove('active');
            button.classList.add('active');


            // hidding the old and showing the new, by toggling the active class
            DOM.filters_wrapper.querySelector('.doolli-select .active').classList.remove('active');
            DOM.filters_wrapper.querySelector('.doolli-select .js_' + button.getAttribute('data-target')).classList.add('active');
        },


        // right side filters
        actual_filters = function(button) {
            if(utils.closest_parent(button, 'doolli-select-style-1')) { // numeric filters
                if(button.parentNode.classList.contains('doolli-select-style-1')) {
                    filters.add_filter({
                        type:       'numeric_filters',
                        field_name: button.getAttribute('data-field-name'),
                        min_value:  button.parentNode.querySelector('.doolli-slider-left span').innerHTML,
                        max_value:  button.parentNode.querySelector('.doolli-slider-right span').innerHTML
                    });
                    url.set_link({type: 'filters', value: filters.toString()});
                }
            } else {                                            // field filters
                if(button.tagName.toLowerCase() !== 'button') { // we've click on the span or the i tag (somewhere inside the button)
                    button = button.parentNode;
                }

                filters.add_filter({
                    type:        button.getAttribute('data-type'),
                    field_name:  button.getAttribute('data-field-name'),
                    field_value: button.getAttribute('data-field-value'),
                });
                url.set_link({type: 'filters', value: filters.toString()});
            }
        };


    // opening the filters                            JUST FOR NOW       V      only the first
    utils.forEach(document.querySelectorAll('.doolli-filters > button:first-child'), function(index, element) {
        if(!element.classList.contains('.doolli-close')) {
            element.addEventListener('click', function(e) {
                var button         = this,
                    opened_element = null;


                // only if it is not opened
                if(document.querySelector('.' + button.getAttribute('data-target')).style.display !== 'block') {
                    utils.forEach(document.querySelectorAll('.doolli-filters > div'), function(index, element) {
                        if(element.style.display === 'block') {
                            opened_element = element;
                        }
                    });

                    if(opened_element) {
                        $(opened_element).slideUp(500, function() {
                            $('.' + button.getAttribute('data-target')).slideDown(500);
                            DOM.filters.classList.add('opened');
                        });
                    } else {
                        $('.' + button.getAttribute('data-target')).slideDown(500);
                        DOM.filters.classList.add('opened');
                    }
                }

                e.preventDefault();
            });
        }
    });


    // close button
    DOM.filters.querySelector('.doolli-close').addEventListener('click', function(e) {
        utils.forEach(document.querySelectorAll('.doolli-filters > button'), function(index, element) {
            $('.' + element.getAttribute('data-target')).slideUp(500, function() {
                DOM.filters.classList.remove('opened');
            });
        });

        e.preventDefault();
    });


    // button controls
    DOM.filters_wrapper.addEventListener('click', function(e) {
        var button    = e.target;

        if(button && button.parentNode.classList.contains('doolli-categories') && !button.classList.contains('active')) {
            main_category_filters(button);
        } else if(button && utils.closest_parent(button, 'doolli-select')) {
            actual_filters(button);
        }

        e.preventDefault();
    });


    // query
    DOM.query_input_wrapper.addEventListener('submit', function(e) {
        url.set_link({type: 'query', value: DOM.query_input.value});
        e.preventDefault();
        return false;
    });


    // remove active filters
    DOM.active_filters.addEventListener('click', function(e) {
        var button = e.target;

        if(button && button.tagName.toLowerCase() === 'button') {
            filters.remove_filter(button.getAttribute('data-id'));
            DOM.active_filters.removeChild(button);
            url.set_link({type: 'filters', value: filters.toString()});
        }

        e.preventDefault();
    });
};
},{"../filters.js":5,"../url_proccessing.js":11,"../utils.js":12,"../variables.js":13}],4:[function(require,module,exports){
'use strict';



var utils           = require('../utils.js'),
    DOM             = require('../variables.js'),
    filters         = require('../filters.js'),
    url             = require('../url_proccessing.js');



module.exports = function() {
    DOM.sort_button.addEventListener('click', function(e) {
        if(DOM.sort_dropdown.style.display !== 'block') {
            DOM.sort_dropdown.style.display = 'block';
        } else {
            DOM.sort_dropdown.style.display = 'none';
        }
    });


    // closing
    document.body.addEventListener('click', function(e) {
        var that = e.target;

        if(that.parentNode && !that.parentNode.classList.contains(DOM.sort_dropdown_text) && !that.classList.contains(DOM.sort_button_name) && !that.parentNode.classList.contains(DOM.sort_button_name)) {
            DOM.sort_dropdown.style.display = 'none';
        }
    });


    // sorting action
    DOM.sort_dropdown.addEventListener('click', function(e) {
        var button   = e.target;

        if(button.parentNode.classList.contains(DOM.sort_dropdown_name)) {
            url.set_link({
                type:          'sort',
                sort_by:       button.getAttribute('data-sort-by'),
                sort_field_id: button.getAttribute('data-sort-field-id')
            });
        }
    });
};
},{"../filters.js":5,"../url_proccessing.js":11,"../utils.js":12,"../variables.js":13}],5:[function(require,module,exports){
'use strict';


// Private variables and functions
var utils      = require('./utils.js'),
    DOM        = require('./variables.js'),
    prefix     = DOM.url_prefix,
    template   = require('./templates.js')['JST']['filters_findwithin'],

    filters_info = [],

    filter_types   = ['field_filters', 'numeric_filters'],
    active_filters = [],
    // static value - used for indetifing filters when trying to remove them
    filter_index   = 0,


    add_selected_filters_as_buttons = function(args) {
        var button = document.createElement('button');
        button.setAttribute('data-id', args.id);
        button.innerHTML = args.button_text;
        DOM.active_filters.appendChild(button);
    },


    interprete_url = function(url_filters, url_query) {
        if(url_filters) {
            var url_split          = utils.urldecode(url_filters).split('&'),
                one_type_of_filter = null,
                type               = null,
                filter_value       = null,
                item               = {};

            // reseting the active filters
            active_filters = [];
            // reseting the active filters html placeholder
            DOM.active_filters.innerHTML = '';

            // constructing the filter array (for later addition and removal)
            // and adding the active filter buttons
            for(var j = 0, len1 = url_split.length; j < len1; j++) {
                one_type_of_filter = url_split[j].split('=');
                type               = one_type_of_filter[0];
                filter_value       = JSON.parse('{"value":' + one_type_of_filter[1] + '}').value;

                for(var i = 0, len2 = filter_value.length; i < len2; i++) {
                    item.type       = type;
                    item.field_name = filter_value[i].field_name;
                    if(type === 'numeric_filters') {
                        item.min_value   = filter_value[i].min_value;
                        item.max_value   = filter_value[i].max_value;
                    } else { // field_filters
                        item.field_value = filter_value[i].field_value;
                    }
                    add_filter(item);
                }
            }
        }

        if(url_query) {
            DOM.query_input.value = url_query.replace(/%20/g, ' ');
        }
    },


    add_filter = function(args) {
        var item        = {},
            button_text = '';

        if(!active_filters[args.type]) {
            active_filters[args.type] = [];
        }

        item.id         = filter_index;
        item.field_name = args.field_name; // the name comes with spaces
        if(args.type === 'numeric_filters') {
            item.min_value = args.min_value;
            item.max_value = args.max_value;
            button_text   += args.field_name + '(' + args.min_value + '-' + args.max_value + ')';
        } else { // field_filters
            item.field_value = args.field_value;
            button_text      = args.field_value;
        }

        // inserting the filter
        active_filters[args.type].push(item);
        // adding the button
        add_selected_filters_as_buttons({id: filter_index, button_text: button_text});

        filter_index++;
    },


    remove_filter = function(id) {
        var id            = parseInt(id);

        // search for the filter with id equals id
        for(var i = 0, len1 = filter_types.length; i < len1; i++) {
            if(active_filters[filter_types[i]]) {
                active_filters[filter_types[i]] = active_filters[filter_types[i]].filter(function(el) {
                    return el.id !== id;
                });
            }
        }
    },


    /**
    * Filter preparation for stringify
     *
     * Based on the documentation
     * https://www.doolli.com/developer#/docs#ViewFilters
     *
     * @return {String} final filter url
     */
    toString = function() {
        var final_url          = '',
            one_type_of_filter = null;

        for(var i = 0, len1 = filter_types.length; i < len1; i++) {
            one_type_of_filter = active_filters[filter_types[i]];
            if(!one_type_of_filter || one_type_of_filter.length === 0) {
                continue;
            }

            if(final_url !== '') {
                final_url += '&';
            }
            final_url += prefix + filter_types[i] + '=';
            // preparing for url-efication - by removing the id
            one_type_of_filter.map(function(el) {
                delete el.id;
                return el;
            });
            final_url += JSON.stringify(one_type_of_filter);
        }

        return utils.urlencode(final_url);
    },


    /**
    * Numeric slider functionality
     *
     * @param {DOM object} - slider_wrapper - called in populate_filters
     */
    numeric_slider = function(slider_wrapper) {
        var bar           = slider_wrapper.querySelector('.doolli-slider-bar'),
            btn_left      = slider_wrapper.querySelector('.doolli-slider-left'),
            btn_right     = slider_wrapper.querySelector('.doolli-slider-right'),

            max_value     = parseInt(slider_wrapper.getAttribute('data-max')),
            min_value     = parseInt(slider_wrapper.getAttribute('data-min')),

            max_pos       = 0,
            current_btn   = null,
            left_pos      = 0,
            right_pos     = 0,

            is_first_time = true;


        var init = function() {
            max_pos              = bar.offsetWidth;

            left_pos             = 0;
            right_pos            = max_pos;

            btn_left.style.left  = left_pos + 'px';
            btn_right.style.left = right_pos + 'px';

            is_first_time        = !is_first_time;
        }

        var start_slide = function(e) {
            current_btn = e.target.nodeName.toLowerCase() === 'span' ? e.target.parentNode : e.target;
            document.body.addEventListener('mousemove', move_slide, false);
            document.body.addEventListener('touchmove', move_slide, false);

            if(is_first_time) {
                init();
            }
        };


        var move_slide = function(e) {
            var movement      = e.changedTouches ? e.changedTouches[0].pageX : e.pageX,
                btn_pos       = movement - utils.offset(slider_wrapper).left - 10;

            btn_pos = btn_pos > max_pos ? max_pos : btn_pos;
            btn_pos = btn_pos < 0 ? 0 : btn_pos;

            if(current_btn === btn_left) {
                if(btn_pos >= right_pos) {
                    btn_pos = right_pos - 1;
                }
                left_pos = btn_pos;
            } else {
                if(btn_pos <= left_pos) {
                    btn_pos = left_pos + 1;
                }
                right_pos = btn_pos;
            }

            current_btn.style.left = btn_pos + 'px';
            current_btn.querySelector('span').innerHTML = parseInt(min_value + (max_value - min_value) * btn_pos / max_pos);

            bar.style.width      = right_pos - left_pos + 'px';
            bar.style.marginLeft = left_pos + 'px';
        };


        var stop_slide = function(e) {
            document.body.removeEventListener('mousemove', move_slide, false);
            document.body.removeEventListener('touchmove', move_slide, false);
        };


        btn_left.addEventListener('mousedown', start_slide, false);
        btn_left.addEventListener('touchstart', start_slide, false);
        btn_right.addEventListener('mousedown', start_slide, false);
        btn_right.addEventListener('touchstart', start_slide, false);

        document.body.addEventListener('mouseup', stop_slide, false);
        document.body.addEventListener('touchend', stop_slide, false);
        document.body.addEventListener('mouseout', function(e) {
            // when the mouse goes outside of the window
            if(e.relatedTarget === document.querySelector('html')) {
                stop_slide();
            }
        }, false);
    },



    update_filter_controlers = function() {
        // update numeric slider on the newly added elements
        utils.forEach(document.querySelectorAll('.doolli-slider-wrapper'), function(index, slider_wrapper) {
            numeric_slider(slider_wrapper);
        });
    },



    populate_filters = function(input) {
        var html = template(input);

        if(DOM.filters_wrapper) {
            DOM.filters_wrapper.innerHTML = html;

            update_filter_controlers();
        } else {
            console.log('".doolli-filters-wrapper" - doesn\'t exists');
        }
    };



// Public functions
module.exports = {
    update_DOM: function(data) {
        var input               = {
                buttons: [],
                filters_list: []
            },
            filters             = data.filters,
            categories          = data.category_filters,
            numeric             = data.numeric_filters,
            values              = null,
            index               = 0,
            name                = '',
            items               = null,
            categories_element  = null,
            subcategory_element = null,


            add_subcategories = function(sub_category) {
                var result = [];

                for(var i = 0, len = sub_category.length; i < len; i++) {
                    if(sub_category[i].sub_categories) {
                        result = result.concat(add_subcategories(sub_category[i].sub_categories));
                    } else {
                        result.push({
                            field_name:  'Category',
                            field_value: utils.urlencode(sub_category[i].value),
                            name: sub_category[i].value,
                            count: sub_category[i].filter_count,
                            type:  'field_filters'
                        });
                    }
                }

                return result;
            };


        // field filters
        if(filters.length > 0) {
            for(var i = 0, len = filters.length; i < len; i++, index++) {
                name = filters[i].field_name;
                input.buttons.push({name: name, target: index});   // getting the name

                items = filters[i].values.map(function(el) {        // adding the link
                    el.field_name  = utils.urlencode(name);
                    el.field_value = utils.urlencode(el.value);
                    el.name        = el.value
                    el.type        = 'field_filters';

                    return el;
                });

                input.filters_list.push({items: items, id: index});      // getting the list of filters
            }
        }


        // categories filters
        if(categories.length > 0) {
            for(var k = 0, len1 = categories.length; k < len1; k++) {
                categories_element = categories[k].values;
                for(var j = 0, len2 = categories_element.length; j < len2; j++, index++) {
                    subcategory_element = categories_element[j];
                    if(subcategory_element.filter_count > 0) { // only for the ones that are not empty
                        input.buttons.push({name: subcategory_element.value, target: index});                                  // getting the name
                        input.filters_list.push({items: add_subcategories(subcategory_element.sub_categories), id: index});    // getting the list of filters
                    }
                }
            }
        }


        // numeric filters
        if(numeric.length > 0) {
            for(var i = 0, len = numeric.length; i < len; i++, index++) {
                input.buttons.push({name: numeric[i].field_name, target: index});

                input.filters_list.push({
                    name: numeric[i].field_name,
                    id: index,
                    min_value: numeric[i].min_value,
                    max_value: numeric[i].max_value,
                    type: 'numeric_filters'
                });
            }
        }


        populate_filters(input);
    },

    interprete_url: interprete_url,

    add_filter:     add_filter,
    remove_filter:  remove_filter,

    toString:       toString
};
},{"./templates.js":10,"./utils.js":12,"./variables.js":13}],6:[function(require,module,exports){
'use strict';


var controls        = require('./controls.js'),
    loading         = require('./loading.js'),
    url             = require('./url_proccessing.js'),
    lightbox        = require('./lightbox.js');



module.exports = {
    start: function() {
        // retriving the db id - used for ajax calls
        ajax_vars.db_id     = document.querySelector('.doolli-wrapper').getAttribute('data-id');
        // retriving the itemcount - used for ajax calls
        ajax_vars.itemcount = document.querySelector('.doolli-wrapper').getAttribute('data-itemcount');
        // retriving the layout - used for ajax calls
        ajax_vars.layout    = document.querySelector('.doolli-wrapper').getAttribute('data-layout');

        // initializing the lightbox
        lightbox.init();

        controls.init();

        url.init();
    }
}
},{"./controls.js":2,"./lightbox.js":7,"./loading.js":8,"./url_proccessing.js":11}],7:[function(require,module,exports){
'use strict';


var DOM       = require('./variables.js'),
    templates = require('./templates.js')['JST'],


    init = function() {
        var lightbox = document.createElement('div');

        lightbox.className = 'doolli-lightbox';
        lightbox.innerHTML = templates['lightbox']();
        document.body.appendChild(lightbox);


        // Opening the lightbox on click
        DOM.wrapper.addEventListener('click', function(e) {
            var button = e.target;

            if(button && button.classList.contains('fa-expand')) {
                var lightbox_content = document.querySelector('.doolli-lightbox-content'),
                    image             = document.createElement('img');

                image.setAttribute('src', button.parentNode.querySelector('img').getAttribute('src').replace(DOM.image_show_size, ''));
                image.onload = function() {
                    lightbox_content.innerHTML = '';
                    lightbox_content.appendChild(image);
                    // taking care of proportions relative to the window
                    if((image.clientWidth / image.clientHeight) < (DOM.window_width / DOM.window_height)) {
                        image.style.height = DOM.window_height * 0.9 + 'px';
                    } else {
                        image.style.width = DOM.window_width * 0.9 + 'px';
                    }
                };

                lightbox_content.innerHTML = templates['loading_text']();
                document.querySelector('.doolli-lightbox').style.display = 'block';
                e.preventDefault();
                return false;
            }
        });


        // Closing the lightbox on fa-close click
        document.querySelector('.doolli-lightbox').addEventListener('click', function(e) {
            if(e.target.classList.contains('doolli-lightbox-content') || e.target.classList.contains('fa-close')) {
                document.querySelector('.doolli-lightbox').style.display = 'none';
            }
        }, false);
    };


module.exports = {
    init: init
};
},{"./templates.js":10,"./variables.js":13}],8:[function(require,module,exports){
'use strict';



var utils           = require('./utils.js'),
    DOM             = require('./variables.js'),


    /**
    * templates located in wordpress/dev/doolli_plugin/templates
     *
     * These are JSTs, already compiled templates (by gulp-jst-concat)
     */
    loading_text    = require('./templates.js')['JST']['loading_text'](),
    views           = require('./views.js'),
    filters         = require('./filters.js'),
    sort            = require('./sort.js'),


    // Singular
    load_item = function(id) {
        DOM.wrapper.classList.remove('doolli-show_filters');
        DOM.container.innerHTML = loading_text;
        // Removing the pagination
        DOM.pager.innerHTML = '';
        $.ajax({
            type :      'post',
            dataType :  'json',
            url :       ajax_vars.ajaxurl,
            data :      {
                action:    'item_view',
                nonce:     ajax_vars.items_load_nonce,
                db_id:     ajax_vars.db_id,
                id:        id
            },
            success:    function(response) {
                if(response.data.error) {
                    DOM.container.innerHTML = '<p class="doolli-error">Server error: ' + response.data.error + '</p>';
                } else {
                    views.update(response.data, 'single');
                }
            }
        });
    },



    // plural
    load_items = function(extra_data) {
        DOM.container.innerHTML = loading_text;
        // Removing the pagination
        DOM.pager.innerHTML = '';

        jQuery.ajax({
            type :      'post',
            dataType :  'json',
            url :       ajax_vars.ajaxurl,
            data :      {
                action:    'items_load',
                ajax_vars: ajax_vars,
                nonce:     ajax_vars.items_load_nonce,
                extra:     extra_data
            },
            success:    function(response) {
                if(response.data.error) {
                    DOM.container.innerHTML = '<p class="doolli-error">Server error: ' + response.data.error + '</p>';
                } else {
                    views.update(response.data);
                    filters.update_DOM(response.filters);
                    sort.update_DOM(response.data.fields);
                }
            }
        });
    };



module.exports = {
    load_items: load_items,
    load_item: load_item
};
},{"./filters.js":5,"./sort.js":9,"./templates.js":10,"./utils.js":12,"./variables.js":13,"./views.js":14}],9:[function(require,module,exports){
'use strict';



var utils           = require('./utils.js'),
    DOM             = require('./variables.js'),
    templates       = require('./templates.js'),

    active_sort     = '',


    interprete_url = function(args) {
        active_sort = args;
    },


    update_DOM = function(fields) {
        var data_for_template = fields.map(function(el) {
                var sort_by = 'asc',
                    type    = '',
                    active  = '';

                if(el.is_sortable) {
                    if(el.field_id === parseInt(active_sort.sort_field_id)) {
                        sort_by = (active_sort.sort_by === 'asc') ? 'desc' : 'asc';
                        active  = 'active';
                    }

                    if(el.is_numeric_filterable) {
                        type = 'numeric';
                    } else if(el.is_time_filterable) {
                        type = 'time';
                    } else if(el.is_date_time_filterable) {
                        type = 'time';
                    }

                    return {sort_field_id: el.field_id, sort_by: sort_by, value: el.field_name, field_type: type, is_active: active};
                }
            });

        DOM.sort_dropdown.innerHTML = templates['JST']['sort_buttons']({buttons: data_for_template});
    };



// Public functions
module.exports = {
    interprete_url: interprete_url,
    update_DOM: update_DOM
};
},{"./templates.js":10,"./utils.js":12,"./variables.js":13}],10:[function(require,module,exports){
this.JST = {"filters_findwithin": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '        <div class="doolli-categories">\r\n            ';
 _.forEach(buttons, function(button, index) { ;
__p += '\r\n                <button ';
 if(index === 0) { print('class="active"'); };
__p += ' data-target="' +
((__t = ( button.target )) == null ? '' : __t) +
'">' +
((__t = ( button.name )) == null ? '' : __t) +
'</button>\r\n            ';
 }); ;
__p += '\r\n        </div>\r\n        <div class="doolli-select">\r\n            ';
 _.forEach(filters_list, function(filter_list, index) { ;
__p += '\r\n                ';
 if(filter_list.type === 'numeric_filters') { ;
__p += '\r\n                    <div class="js_' +
((__t = ( filter_list.id )) == null ? '' : __t) +
' ';
 if(index === 0) { print('active'); };
__p += ' doolli-select-style-1">\r\n                        <div class="doolli-slider-wrapper" data-max="' +
((__t = ( filter_list.max_value )) == null ? '' : __t) +
'" data-min="' +
((__t = ( filter_list.min_value )) == null ? '' : __t) +
'">\r\n                            <div class="doolli-slider-bar"></div>\r\n                            <button class="doolli-slider-left"><span>' +
((__t = ( filter_list.min_value )) == null ? '' : __t) +
'</span></button>\r\n                            <button class="doolli-slider-right"><span>' +
((__t = ( filter_list.max_value )) == null ? '' : __t) +
'</span></button>\r\n                        </div>\r\n                        <button data-field-name="' +
((__t = ( filter_list.name )) == null ? '' : __t) +
'">Apply filter</button>\r\n                    </div>\r\n                ';
 } else { ;
__p += '\r\n                    <div class="js_' +
((__t = ( filter_list.id )) == null ? '' : __t) +
' ';
 if(index === 0) { print('active'); };
__p += '">\r\n                        ';
 _.each(filter_list.items, function(item) { ;
__p += '\r\n                        <button data-field-name="' +
((__t = ( item.field_name )) == null ? '' : __t) +
'" data-field-value="' +
((__t = ( item.field_value )) == null ? '' : __t) +
'" data-type="' +
((__t = ( item.type )) == null ? '' : __t) +
'"><span>' +
((__t = ( item.name )) == null ? '' : __t) +
'</span> <i>' +
((__t = ( item.count )) == null ? '' : __t) +
' results</i></button>\r\n                        ';
 }); ;
__p += '\r\n                    </div>\r\n                ';
 } ;
__p += '\r\n            ';
 }); ;
__p += '\r\n        </div>';

}
return __p
},
"item_in_list": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="doolli-item doolli-item-' +
((__t = ( layout )) == null ? '' : __t) +
'">\r\n    <div class="doolli-item-inner">\r\n        ';
 _.each(fields, function(item_field) { ;
__p += '\r\n            ';
 if(item_field.content_view === true && item_field.value) { ;
__p += '\r\n                    ';
 if(item_field.type === 'image') { ;
__p += '\r\n                        <span class="doolli-field-wrapper doolli-img-responsive">\r\n                            <a href="' +
((__t = ( id )) == null ? '' : __t) +
'" title="Item\'s image">\r\n                                <img class="doolli-img" src="' +
((__t = ( item_field.value )) == null ? '' : __t) +
'' +
((__t = ( image_show_size )) == null ? '' : __t) +
'" alt="Image" />\r\n                                <button class="fa fa-expand"></button>\r\n                            </a>\r\n                        </span>\r\n                    ';
 } else { ;
__p += '\r\n                        <span class="doolli-field-wrapper">\r\n                            ';
 if(item_field.display_label === true) { ;
__p += '\r\n                                <label>' +
((__t = ( item_field.name )) == null ? '' : __t) +
'</label>\r\n                            ';
 } ;
__p += '\r\n                            ';
 if(item_field.data_fields.is_title === true) { ;
__p += '\r\n                                <h2><a href="' +
((__t = ( id )) == null ? '' : __t) +
'" title="' +
((__t = ( item_field.value )) == null ? '' : __t) +
'">' +
((__t = ( item_field.value )) == null ? '' : __t) +
'</a></h2>\r\n                            ';
 } else { ;
__p += '\r\n                                <span>' +
((__t = ( item_field.value )) == null ? '' : __t) +
'</span>\r\n                            ';
 } ;
__p += '\r\n                        </span>\r\n                    ';
 } ;
__p += '\r\n            ';
 } ;
__p += '\r\n        ';
 }); ;
__p += '\r\n        <a href="' +
((__t = ( id )) == null ? '' : __t) +
'" title="View item">View item</a>\r\n    </div>\r\n</div>\r\n';

}
return __p
},
"item_view": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<button class="doolli-btn-back"><i class="fa fa-arrow-left"></i>See all items</button>\r\n\r\n<div class="doolli-item doolli-item-list">\r\n    <idv class="doolli-item-inner clearfix">\r\n        ';
 _.each(fields, function(item_field) { ;
__p += '\r\n                ';
 if(item_field.type === 'image') { ;
__p += '\r\n                    <div class="doolli-field-wrapper doolli-image-wrapper">\r\n                        <img class="doolli-img doolli-img-responsive" src="' +
((__t = ( item_field.value )) == null ? '' : __t) +
'' +
((__t = ( image_show_size )) == null ? '' : __t) +
'" alt="Image" />\r\n                        <button class="fa fa-expand"></button>\r\n                    </div>\r\n                ';
 } ;
__p += '\r\n            </span>\r\n        ';
 }); ;
__p += '\r\n\r\n        <div class="doolli-item-view-text">\r\n        ';
 _.each(fields, function(item_field) { ;
__p += '\r\n                ';
 if(item_field.type !== 'image') { ;
__p += '\r\n                    ';
 if(item_field.value) { ;
__p += '\r\n                        <div class="doolli-field-wrapper">\r\n                            <label class="doolli-label">' +
((__t = ( item_field.name )) == null ? '' : __t) +
'</label>\r\n                            <span>' +
((__t = ( item_field.value )) == null ? '' : __t) +
'</span>\r\n                        </div>\r\n                    ';
 } ;
__p += '\r\n                ';
 } ;
__p += '\r\n            </span>\r\n        ';
 }); ;
__p += '\r\n        </div>\r\n    </div>\r\n</div>';

}
return __p
},
"items_in_table": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="doolli-table-responsive">\r\n    <table class="doolli-table-responsive doolli-item-inner">\r\n        <thead>\r\n            <tr>\r\n                ';
 _.each(fields, function(field) { ;
__p += '\r\n                    ';
 if(field.content_view === true) { ;
__p += '\r\n                        <th>' +
((__t = ( field.field_name )) == null ? '' : __t) +
'</th>\r\n                    ';
 } ;
__p += '\r\n                ';
 }); ;
__p += '\r\n            </tr>\r\n        </thead>\r\n        <tbody>\r\n            ';
 _.each(items, function(item) { ;
__p += '\r\n                <tr>\r\n                    ';
 _.each(fields, function(field) {
                        var item_field = item.field_values[field.field_id];

                        if(field.content_view === true) { ;
__p += '\r\n                            <td class="doolli-table-field-wrapper">\r\n                                ';
 if(field.type === 'image' && item_field) { ;
__p += '\r\n                                    <div>\r\n                                        <img class="doolli-img doolli-img-responsive" src="' +
((__t = ( item_field.value )) == null ? '' : __t) +
'' +
((__t = ( image_show_size )) == null ? '' : __t) +
'" alt="Image" />\r\n                                        <button class="fa fa-expand"></button>\r\n                                    </div>\r\n                                ';
 } else { ;
__p += '\r\n                                    <span>' +
((__t = ( item_field )) == null ? '' : __t) +
'</span>\r\n                                ';
 } ;
__p += '\r\n                            </td>\r\n                        ';
 } ;
__p += '\r\n                    ';
 }); ;
__p += '\r\n                </tr>\r\n            ';
 }); ;
__p += '\r\n        </tbody>\r\n    </table>\r\n</div>';

}
return __p
},
"lightbox": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="doolli-lightbox-wrapper">\r\n    <button class="fa fa-close"></button>\r\n    <div class="doolli-lightbox-content"></div>\r\n</div>';

}
return __p
},
"loading_text": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<p class="doolli-loading"><img src="https://www.doolli.com/theme/img/assets/loader-trans.gif" alt="Doolli please wait" />Loading data ... Please wait</p>';

}
return __p
},
"pagination": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if(paging.last_page > 1) { ;
__p += '\r\n    ';
 if(paging.current_page > 1) { ;
__p += '\r\n        <a href="1" title="keywords for this">First</a>\r\n        <a href="' +
((__t = ( paging.previous_page )) == null ? '' : __t) +
'" title="Doolli Page ' +
((__t = ( paging.previous_page )) == null ? '' : __t) +
'">&lt;</a>\r\n    ';
 } ;
__p += '\r\n\r\n\r\n    ';
 _.each(paging.pages, function(page) { ;
__p += '\r\n        ';
 if(page === paging.current_page) { ;
__p += '\r\n            <span>' +
((__t = ( page )) == null ? '' : __t) +
'</span>\r\n        ';
 } else {;
__p += '\r\n            <a href="' +
((__t = ( page )) == null ? '' : __t) +
'" title="Doolli Page ' +
((__t = ( page )) == null ? '' : __t) +
'">' +
((__t = ( page )) == null ? '' : __t) +
'</a>\r\n        ';
 } ;
__p += '\r\n    ';
 }); ;
__p += '\r\n\r\n\r\n    ';
 if(paging.next_page > 0) { ;
__p += '\r\n        <a href="' +
((__t = ( paging.next_page )) == null ? '' : __t) +
'" title="Doolli Page ' +
((__t = ( paging.next_page )) == null ? '' : __t) +
'">&gt;</a>\r\n        <a href="' +
((__t = ( paging.last_page )) == null ? '' : __t) +
'" title="Doolli Page ' +
((__t = ( paging.last_page )) == null ? '' : __t) +
'">Last</a>\r\n    ';
 } ;
__p += '\r\n';
 } ;


}
return __p
},
"sort_buttons": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 _.each(buttons, function(button) {
    if(button) { ;
__p += '\r\n        <button class="' +
((__t = ( button.is_active )) == null ? '' : __t) +
'" data-sort-by="' +
((__t = ( button.sort_by )) == null ? '' : __t) +
'" data-sort-field-id="' +
((__t = ( button.sort_field_id )) == null ? '' : __t) +
'" data-field-type="' +
((__t = ( button.field_type )) == null ? '' : __t) +
'">' +
((__t = ( button.value )) == null ? '' : __t) +
'</button><br />\r\n';
 }
}); ;
__p += '\r\n';

}
return __p
}};
},{}],11:[function(require,module,exports){
'use strict';



var utils   = require('./utils.js'),
    loading = require('./loading.js'),
    filters = require('./filters.js'),
    sort    = require('./sort.js'),
    prefix  = require('./variables.js').url_prefix,


    // updating or adding (if it doesn't exists) a primitive value (like query, page, etc)
    update_primitive_in_url = function(parameters, args) {
        var parts_unsplit   = parameters,
            parts           = '',
            old_one_exists  = false,
            type            = '',
            new_value       = '',
            new_paramenters = '';

        for(var i = 0, len1 = args.length; i < len1; i++) {
            parts     = parts_unsplit.split('&');
            type      = args[i].type;
            new_value = args[i].value;

            for(var j = 0, len2 = parts.length; j < len2; j++) {
                if(parts[j].indexOf(prefix + type) > -1) {
                    if(new_value) {
                        parts[j] = parts[j].split('=')[0] + '=' + new_value;
                    } else {
                        parts[j] = '';
                    }

                    old_one_exists = true;
                }
            }

            if(!old_one_exists) {
                new_paramenters = parts_unsplit;
                if(new_value) {
                    new_paramenters += (parts_unsplit !== '') ? '&' : '';
                    new_paramenters += prefix + type + '=' + new_value;
                }
            } else {
                new_paramenters = parts.join('&');
            }

            parts_unsplit = new_paramenters;
        }

        return new_paramenters;
    },


    mapping_url = function(args) {
        var url   = {
                item:       null,
                page:       '',
                filter_url: '',
                query:      '',
                sort:       null
            },

            temp  = '',

            parts = args ? args.split('&') : [];


        for(var i = 0, len = parts.length; i < len; i++) {
            if(parts[i].indexOf(prefix + 'item') > -1) {
                url.item = parts[i].replace(prefix + 'item=', '');
                continue;
            }
            if(parts[i].indexOf(prefix + 'page') > -1) {
                url.page = parts[i].replace(prefix + 'page=', '');
                continue;
            }
            // we don't use prefix in this condition because we can have doolli-field_filters, doolli-numeric_filters, etc OR doolli-query
            if(parts[i].indexOf('filters=') > -1) {
                if(url.filter_url === '') {
                    url.filter_url += parts[i].replace(prefix, '');
                } else {
                    url.filter_url += '&' + parts[i].replace(prefix, '');
                }
                continue;
            }

            // query
            if(parts[i].indexOf(prefix + 'query=') > -1) {
                url.query = parts[i].replace(prefix + 'query=', '');
                continue;
            }

            // sort
            if(parts[i].indexOf(prefix + 'sort') > -1) {
                url.sort                              = url.sort || [];
                temp                                  = parts[i].split('=');
                url.sort[temp[0].replace(prefix, '')] = temp[1];
            }
        }

        return url;
    },


    get_link = function() {
        var url     = window.location.search.split('?'),
            parts   = mapping_url(url[1]),
            options = '';

        if(parts.item) {
            options = parts.item;
            loading.load_item(options);
        } else {
            if(url.length >= 2) {
                options = {
                    page:       parts.page,
                    filter_url: parts.filter_url,
                    query:      parts.query
                };

                if(parts.sort) {
                    options.sort ='&sort_by=' + parts.sort.sort_by + '&sort_field_id=' + parts.sort.sort_field_id;
                    sort.interprete_url(parts.sort);
                }

                filters.interprete_url(parts.filter_url, parts.query);
            }

            // main items load will have options = ''
            loading.load_items(options);
        }
    },


    set_link = function(args) {
        var type       = args.type,
            value      = args.value,
            base       = window.location.pathname.split('?')[0],
            parameters = window.location.search.replace('?', ''),
            link       = base,

            tmp        = null;


        if(type === 'filters') {
            link += '?' + args.value;
        } else if(type === 'query') {
            link += '?' + update_primitive_in_url(parameters, [{type: type, value: value}]);
        } else if(type === 'sort') {
            link += '?' + update_primitive_in_url(parameters, [
                        {type: 'sort_by',       value: args.sort_by},
                        {type: 'sort_field_id', value: args.sort_field_id}
                    ]);
        } else {
            if(value !== '') {
                link = '?' + prefix + type + '=' + value;
            }
        }

        // in case we don't have any parameters after '?'
        if(link === base + '?') {
            link = base;
        }

        history.pushState({}, '', link);
        get_link();
    };



module.exports = {
    init:     function() {
        get_link();

        // For back button
        window.addEventListener('popstate', function(e) {
            get_link();
        });
    },

    set_link: set_link
};
},{"./filters.js":5,"./loading.js":8,"./sort.js":9,"./utils.js":12,"./variables.js":13}],12:[function(require,module,exports){
'use strict';

module.exports = {
    /**
    * Getting the offset of a DOM element
     *
     * ### Examples:
     *
     *     utils.offset(document.querySelector('.my_element'));
     *
     * @param {Object} dom element (not jquery element)
     * @return {Object} a top / left object
     */
    offset: function(obj) {
        var top  = 0,
            left = 0;

        if(obj.offsetParent) {
            do {
                top  += obj.offsetTop;
                left += obj.offsetLeft;
            } while (obj = obj.offsetParent);
        }
        return { top: top, left: left };
    },


    /**
    * Adding dynamically a new external style into the html
     *
     * ### Examples:
     *
     *     utils.extra_style('http://netdna.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css');
     *
     * @param {String} the actual url (local or http)
     */
    extra_style: function(url) {
        var link_css = document.createElement("link");

        link_css.setAttribute("rel", "stylesheet");
        link_css.setAttribute("href", url);
        document.getElementsByTagName("head")[0].appendChild(link_css);
    },


    /**
    * Looping through DOM NodeList
     *
     * ### Examples:
     *
     *  utils.forEach(document.querySelectorAll('li'), function(index, element) { console.log(index, element); });
     *
     * @param {Array, Function, Scope}
     */
    forEach: function (array, callback, scope) {
        for (var i = 0, len = array.length; i < len; i++) {
            callback.call(scope, i, array[i]);
        }
    },


    /**
    * AJAX
     *
     * ### Examples:
     *
     *      utils.ajax.get({
     *          url:     '/test.php',
     *          data:    {foo: 'bar'},
     *          success: function() { // what to do on success; },
     *          error:   function() { // what to do on error; }
     *      });
     */
    ajax: function() {
        var http_req = new XMLHttpRequest(),
            get_fn   = null,
            post_fn  = null,
            send_fn  = null;

        send_fn = function(url, data, method, success_fn, error_fn, sync) {
            var x = http_req;
            x.open(method, url, sync);
            x.onreadystatechange = function() {
                if (x.readyState == 4) {
                    if(x.status === 200) {
                        success_fn(x.responseText)
                    } else {
                        error_fn();
                    }
                }
            };
            if(method === 'POST') {
                x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            }
            x.send(data);
        };

        get_fn = function(obj) {
            var query = [];

            for(var key in obj.data) {
                query.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj.data[key]));
            }
            //              url              data  method    success_fn     error_fn        sync
            send_fn(obj.url + '?' + query.join('&'), null, 'GET', obj.success, obj.error, obj.sync);
        };

        post_fn = function(obj) {
            var query = [];

            for(var key in obj.data) {
                query.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj.data[key]));
            }
            //    url         data         method    success_fn     error_fn        sync
            send_fn(obj.url, query.join('&'), 'POST', obj.success, obj.error, obj.sync);
        };

        return {get: get_fn, post: post_fn};
    },


    /**
    * urlencode equivalent from PHP
     *
     * @param  {String} - string to be encoded
     * @return {String} - the encoded string
     */
    urlencode: function(string) {
        string = (string + '').toString();

        return encodeURI(string)
            .replace(/!/g,   '%21')
            .replace(/'/g,   '%27')
            .replace(/\(/g,  '%28')
            .replace(/\)/g,  '%29')
            .replace(/\*/g,  '%2A')
            .replace(/%20/g, '+');
    },


    /**
    * urldecode equivalent from PHP
     *
     * @param  {String} - string to be decoded
     * @return {String} - the decoded string
     */
    urldecode: function(string) {
        string = (string + '').toString();

        return decodeURI(string)
            .replace(/%21/g,   '!')
            .replace(/%27/g,   '\'')
            .replace(/%28/g,  '(')
            .replace(/%29/g,  ')')
            .replace(/%2A/g,  '*')
            .replace(/\+/g, ' ');
    },


    /**
    * Checking if the element is contained inside a parent with a certain class
     *
     * @param {Object} - dom element (not jQuery)
              {String} - the name of the class we look for in the parents
     * @return {Boolean} - true if we find it, false otherwise
     */
    closest_parent: function(element, parent_name_class) {
        var el    = element;

        while(el.parentNode) {
            if(el.classList.contains(parent_name_class)) {
                return true;
            }
            el = el.parentNode;
        };

        return false;
    },
};
},{}],13:[function(require,module,exports){
'use strict';



module.exports = {
    url_prefix:          'doolli-',

    window_width:        document.documentElement.clientWidth,
    window_height:       document.documentElement.clientHeight,
    image_show_size:     '?fit=max&w=450',

    wrapper:             document.querySelector('.doolli-wrapper'),
    container:           document.querySelector('#doolli-database-container'),

    filters_wrapper:     document.querySelector('.doolli-filters-wrapper'),
    filters:             document.querySelector('.doolli-filters'),
    filter_item_count:   document.querySelector('.doolli-filters .item_count'),
    active_filters:      document.querySelector('.doolli-active-filters'),
    query_input_wrapper: document.querySelector('.doolli-search-form'),
    query_input:         document.querySelector('.doolli-search-form input'),

    sort_button:         document.querySelector('.doolli-sort'),
    sort_button_name:    'doolli-sort',
    sort_active:         document.querySelector('.doolli-sort span'),
    sort_dropdown:       document.querySelector('.doolli-sort-dropdown'),
    sort_dropdown_name:  'doolli-sort-dropdown',

    pager:               document.querySelector('.doolli-pager-wrapper')
};
},{}],14:[function(require,module,exports){
'use strict';



var utils       = require('./utils.js'),
    DOM         = require('./variables.js'),
    templates   = require('./templates.js')['JST'],



    data_fields = [],


    /**
    * Item View
     *
     * Takes the raw data of an item and inserts it into the template
     *
     * @param
     *      item      {JSON}    - the item from the data.items array
     *      view_type {String}  - the type of the layout ('grid' | 'list')
     *
     * @return        {String}  - the template field out
     */
    item_view = function(item, view_type) {
        var an_item = [];

        for(var i = 0, len = data_fields.length; i < len; i++) { // going through all the data_fields of an item
            an_item.push({
                data_fields:    data_fields[i],
                name:           data_fields[i].field_name,
                type:           data_fields[i].subtype.toLowerCase(),
                value:          item.field_values[data_fields[i].field_id][0],
                content_view:   data_fields[i].content_view,
                display_label:  data_fields[i].display_label
            });
        }

        if(view_type === 'grid') {
            return (templates['item_in_list'])({
                layout:          ajax_vars.layout,
                fields:          an_item,
                id:              item.content_item_id,
                image_show_size: DOM.image_show_size
            });
        } else {
            return (templates['item_view'])({
                fields:          an_item,
                id:              item.content_item_id,
                image_show_size: DOM.image_show_size
            });
        }
    };



module.exports = {
    /**
    * Handles the response from the ajax function
     *
     * @param
     *      data {JSON} - the response from the server
     *      type_of_response {String} - differentiate between single view and list view
     */
    update: function(data, type_of_response) {
        var items     = data.items ? data.items : null,
            all_items = '';


        // saving the fields as they'll be used in single item as well
        data_fields = data.fields;


        if(type_of_response !== 'single') {
            // showing the filters
            DOM.wrapper.classList.add('doolli-show_filters');

            if(ajax_vars.layout === 'table') {
                all_items = templates['items_in_table']({
                    fields:          data_fields,
                    items:           items,
                    image_show_size: DOM.image_show_size
                });
            } else {
                // going through all the items.
                for(var i = 0, len = items.length; i < len; i++) {
                    all_items += item_view(items[i], 'grid');
                }
            }

            // showing the numbers of items in the filter section
            DOM.filter_item_count.innerHTML = data.filtered_item_count + ' ' + ((data.filtered_item_count > 1) ? 'items' : 'item');
        } else {
            all_items += item_view(data, 'list');
        }


        // Adding everything in the page (in the proper place);
        DOM.container.innerHTML = all_items;

        if(data.paging) {
            DOM.pager.innerHTML += templates['pagination']({paging: data.paging});
        }
    }
}
},{"./templates.js":10,"./utils.js":12,"./variables.js":13}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiZG9vbGxpX3BsdWdpblxcanNcXHNjcmlwdC5qcyIsImRvb2xsaV9wbHVnaW5cXGpzXFxpbmNcXGNvbnRyb2xzLmpzIiwiZG9vbGxpX3BsdWdpblxcanNcXGluY1xcY29udHJvbHNcXGZpbHRlcnMuanMiLCJkb29sbGlfcGx1Z2luXFxqc1xcaW5jXFxjb250cm9sc1xcc29ydC5qcyIsImRvb2xsaV9wbHVnaW5cXGpzXFxpbmNcXGZpbHRlcnMuanMiLCJkb29sbGlfcGx1Z2luXFxqc1xcaW5jXFxpbml0LmpzIiwiZG9vbGxpX3BsdWdpblxcanNcXGluY1xcbGlnaHRib3guanMiLCJkb29sbGlfcGx1Z2luXFxqc1xcaW5jXFxsb2FkaW5nLmpzIiwiZG9vbGxpX3BsdWdpblxcanNcXGluY1xcc29ydC5qcyIsImRvb2xsaV9wbHVnaW5cXGpzXFxpbmNcXHRlbXBsYXRlcy5qcyIsImRvb2xsaV9wbHVnaW5cXGpzXFxpbmNcXHVybF9wcm9jY2Vzc2luZy5qcyIsImRvb2xsaV9wbHVnaW5cXGpzXFxpbmNcXHV0aWxzLmpzIiwiZG9vbGxpX3BsdWdpblxcanNcXGluY1xcdmFyaWFibGVzLmpzIiwiZG9vbGxpX3BsdWdpblxcanNcXGluY1xcdmlld3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcldBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHV0aWxzICA9IHJlcXVpcmUoJy4vaW5jL3V0aWxzLmpzJyksXHJcbiAgICAgICAgaW5pdCAgID0gcmVxdWlyZSgnLi9pbmMvaW5pdC5qcycpO1xyXG5cclxuXHJcblxyXG4gICAgLy8gQWRkaW5nIGZvbnQtYXdlc29tZVxyXG4gICAgdXRpbHMuZXh0cmFfc3R5bGUoJ2h0dHA6Ly9uZXRkbmEuYm9vdHN0cmFwY2RuLmNvbS9mb250LWF3ZXNvbWUvNC4yLjAvY3NzL2ZvbnQtYXdlc29tZS5taW4uY3NzJyk7XHJcblxyXG4gICAgLy8gU3RhcnRpbmcgZXZlcnl0aGluZ1xyXG4gICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRvb2xsaS13cmFwcGVyJykpIHtcclxuICAgICAgICBpbml0LnN0YXJ0KCk7XHJcbiAgICB9XHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG5cclxudmFyIHV0aWxzICAgICAgICAgICA9IHJlcXVpcmUoJy4vdXRpbHMuanMnKSxcclxuICAgIERPTSAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vdmFyaWFibGVzLmpzJyksXHJcbiAgICBmaWx0ZXJzICAgICAgICAgPSByZXF1aXJlKCcuL2ZpbHRlcnMuanMnKSxcclxuICAgIHRlbXBsYXRlcyAgICAgICA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzLmpzJylbJ0pTVCddLFxyXG4gICAgdXJsICAgICAgICAgICAgID0gcmVxdWlyZSgnLi91cmxfcHJvY2Nlc3NpbmcuanMnKSxcclxuXHJcblxyXG4gICAgLy8gVGhlIHdyYXBwZXIgY29udHJvbHMgZnVuY3Rpb25zXHJcbiAgICBmaWx0ZXJzX2ZuID0gcmVxdWlyZSgnLi9jb250cm9scy9maWx0ZXJzLmpzJyksXHJcbiAgICBzb3J0X2ZuICAgID0gcmVxdWlyZSgnLi9jb250cm9scy9zb3J0LmpzJyksXHJcblxyXG5cclxuICAgIHBhZ2luYXRpb25fZm4gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBET00ucGFnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIHZhciBidXR0b24gPSBlLnRhcmdldC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnYScgPyBlLnRhcmdldCA6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBwYWdlICAgPSBidXR0b24uZ2V0QXR0cmlidXRlKCdocmVmJyk7XHJcblxyXG4gICAgICAgICAgICBpZihidXR0b24pIHtcclxuICAgICAgICAgICAgICAgIHVybC5zZXRfbGluayh7dHlwZTogJ3BhZ2UnLCB2YWx1ZTogcGFnZSwgZmlsdGVyX3VybDogZmlsdGVycy50b1N0cmluZygpfSk7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICB9IC8vIGVuZCBvZiBwYWdpbmF0aW9uXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvKiogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICAgICogTWFpbiBjb250cm9sc1xyXG4gICAgICAgICAqL1xyXG5cclxuICAgICAgICAvLyBhZGRpbmcgY2xpY2sgZXZlbnRzIHRvIHRoZSBpdGVtcyBpbiB0aGUgbGlzdFxyXG4gICAgICAgIERPTS53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICB2YXIgbGluayA9IGUudGFyZ2V0LCAvL3dlIG9ubHkgd29yayB3aXRoIGxpbmtzLCB0aGUgcmVzdCB3ZSBpZ25vcmUgdXNpbmcgdGhlIGlmIGxvZ2ljXHJcbiAgICAgICAgICAgICAgICBpZCAgID0gJycsXHJcbiAgICAgICAgICAgICAgICBocmVmID0gJyc7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXR0aW5nIHRoZSBsaW5rICB3aGVuIGNsaWNraW5nIGluc2lkZSBvZiBpdCAodGV4dCwgaW1hZ2UsIGV0YylcclxuICAgICAgICAgICAgd2hpbGUobGluay5wYXJlbnROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBpZihsaW5rLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdhJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxpbmsgPSBsaW5rLnBhcmVudE5vZGU7ICAgICAgICAgICAgICAgIC8vIGl0ZXJhdGluZ1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZighZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmYS1leHBhbmQnKSAmJiBsaW5rLnBhcmVudE5vZGUgJiYgbGluay5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnYScgJiYgdXRpbHMuY2xvc2VzdF9wYXJlbnQobGluaywgJ2Rvb2xsaS1pdGVtLWlubmVyJykpIHtcclxuICAgICAgICAgICAgICAgIHVybC5zZXRfbGluayh7dHlwZTogJ2l0ZW0nLCB2YWx1ZTogbGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKX0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICBpZihET00uZmlsdGVycykge1xyXG4gICAgICAgICAgICBmaWx0ZXJzX2ZuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYoRE9NLnNvcnRfYnV0dG9uKSB7XHJcbiAgICAgICAgICAgIHNvcnRfZm4oKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgLyoqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICAqIEl0ZW0gdmlld1xyXG4gICAgICAgICAqL1xyXG5cclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZG9vbGxpLXdyYXBwZXInKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgdmFyIGJ1dHRvbiA9IChlLnRhcmdldC5wYXJlbnROb2RlICYmIGUudGFyZ2V0LnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdkb29sbGktYnRuLWJhY2snKSkgPyBlLnRhcmdldC5wYXJlbnROb2RlIDogZS50YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICBpZihidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdkb29sbGktYnRuLWJhY2snKSkge1xyXG4gICAgICAgICAgICAgICAgdXJsLnNldF9saW5rKHt0eXBlOiAnJywgdmFsdWU6ICcnfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcblxyXG5cclxuICAgICAgICAvKiogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICAgICogUGFnaW5hdGlvblxyXG4gICAgICAgICAqL1xyXG5cclxuICAgICAgICBpZihET00ucGFnZXIpIHtcclxuICAgICAgICAgICAgcGFnaW5hdGlvbl9mbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG5cclxudmFyIHV0aWxzICAgICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWxzLmpzJyksXHJcbiAgICBET00gICAgICAgICAgICAgPSByZXF1aXJlKCcuLi92YXJpYWJsZXMuanMnKSxcclxuICAgIGZpbHRlcnMgICAgICAgICA9IHJlcXVpcmUoJy4uL2ZpbHRlcnMuanMnKSxcclxuICAgIHVybCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4uL3VybF9wcm9jY2Vzc2luZy5qcycpO1xyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gbGVmdCBzaWRlIGZpbHRlciBtZW51XHJcbiAgICB2YXIgbWFpbl9jYXRlZ29yeV9maWx0ZXJzID0gZnVuY3Rpb24oYnV0dG9uKSB7XHJcbiAgICAgICAgICAgIC8vIHRvZ2dsaW5nIHRoZSBhY3RpdmUgZnJvbSB0aGUgb2xkIHRvIHRoZSBuZXdcclxuICAgICAgICAgICAgRE9NLmZpbHRlcnNfd3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuZG9vbGxpLWNhdGVnb3JpZXMgLmFjdGl2ZScpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gaGlkZGluZyB0aGUgb2xkIGFuZCBzaG93aW5nIHRoZSBuZXcsIGJ5IHRvZ2dsaW5nIHRoZSBhY3RpdmUgY2xhc3NcclxuICAgICAgICAgICAgRE9NLmZpbHRlcnNfd3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuZG9vbGxpLXNlbGVjdCAuYWN0aXZlJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIERPTS5maWx0ZXJzX3dyYXBwZXIucXVlcnlTZWxlY3RvcignLmRvb2xsaS1zZWxlY3QgLmpzXycgKyBidXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gcmlnaHQgc2lkZSBmaWx0ZXJzXHJcbiAgICAgICAgYWN0dWFsX2ZpbHRlcnMgPSBmdW5jdGlvbihidXR0b24pIHtcclxuICAgICAgICAgICAgaWYodXRpbHMuY2xvc2VzdF9wYXJlbnQoYnV0dG9uLCAnZG9vbGxpLXNlbGVjdC1zdHlsZS0xJykpIHsgLy8gbnVtZXJpYyBmaWx0ZXJzXHJcbiAgICAgICAgICAgICAgICBpZihidXR0b24ucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2Rvb2xsaS1zZWxlY3Qtc3R5bGUtMScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVycy5hZGRfZmlsdGVyKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogICAgICAgJ251bWVyaWNfZmlsdGVycycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkX25hbWU6IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmllbGQtbmFtZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5fdmFsdWU6ICBidXR0b24ucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCcuZG9vbGxpLXNsaWRlci1sZWZ0IHNwYW4nKS5pbm5lckhUTUwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heF92YWx1ZTogIGJ1dHRvbi5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoJy5kb29sbGktc2xpZGVyLXJpZ2h0IHNwYW4nKS5pbm5lckhUTUxcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB1cmwuc2V0X2xpbmsoe3R5cGU6ICdmaWx0ZXJzJywgdmFsdWU6IGZpbHRlcnMudG9TdHJpbmcoKX0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmllbGQgZmlsdGVyc1xyXG4gICAgICAgICAgICAgICAgaWYoYnV0dG9uLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gJ2J1dHRvbicpIHsgLy8gd2UndmUgY2xpY2sgb24gdGhlIHNwYW4gb3IgdGhlIGkgdGFnIChzb21ld2hlcmUgaW5zaWRlIHRoZSBidXR0b24pXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uID0gYnV0dG9uLnBhcmVudE5vZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZmlsdGVycy5hZGRfZmlsdGVyKHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAgICAgICAgYnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS10eXBlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgZmllbGRfbmFtZTogIGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmllbGQtbmFtZScpLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkX3ZhbHVlOiBidXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLWZpZWxkLXZhbHVlJyksXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHVybC5zZXRfbGluayh7dHlwZTogJ2ZpbHRlcnMnLCB2YWx1ZTogZmlsdGVycy50b1N0cmluZygpfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBvcGVuaW5nIHRoZSBmaWx0ZXJzICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpVU1QgRk9SIE5PVyAgICAgICBWICAgICAgb25seSB0aGUgZmlyc3RcclxuICAgIHV0aWxzLmZvckVhY2goZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRvb2xsaS1maWx0ZXJzID4gYnV0dG9uOmZpcnN0LWNoaWxkJyksIGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAgICAgaWYoIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCcuZG9vbGxpLWNsb3NlJykpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBidXR0b24gICAgICAgICA9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgb3BlbmVkX2VsZW1lbnQgPSBudWxsO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBvbmx5IGlmIGl0IGlzIG5vdCBvcGVuZWRcclxuICAgICAgICAgICAgICAgIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy4nICsgYnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKSkuc3R5bGUuZGlzcGxheSAhPT0gJ2Jsb2NrJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLmZvckVhY2goZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRvb2xsaS1maWx0ZXJzID4gZGl2JyksIGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9PT0gJ2Jsb2NrJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmVkX2VsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKG9wZW5lZF9lbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQob3BlbmVkX2VsZW1lbnQpLnNsaWRlVXAoNTAwLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy4nICsgYnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKSkuc2xpZGVEb3duKDUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBET00uZmlsdGVycy5jbGFzc0xpc3QuYWRkKCdvcGVuZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLicgKyBidXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpKS5zbGlkZURvd24oNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRE9NLmZpbHRlcnMuY2xhc3NMaXN0LmFkZCgnb3BlbmVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vIGNsb3NlIGJ1dHRvblxyXG4gICAgRE9NLmZpbHRlcnMucXVlcnlTZWxlY3RvcignLmRvb2xsaS1jbG9zZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHV0aWxzLmZvckVhY2goZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRvb2xsaS1maWx0ZXJzID4gYnV0dG9uJyksIGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICQoJy4nICsgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0JykpLnNsaWRlVXAoNTAwLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIERPTS5maWx0ZXJzLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW5lZCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vIGJ1dHRvbiBjb250cm9sc1xyXG4gICAgRE9NLmZpbHRlcnNfd3JhcHBlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB2YXIgYnV0dG9uICAgID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICAgIGlmKGJ1dHRvbiAmJiBidXR0b24ucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2Rvb2xsaS1jYXRlZ29yaWVzJykgJiYgIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgIG1haW5fY2F0ZWdvcnlfZmlsdGVycyhidXR0b24pO1xyXG4gICAgICAgIH0gZWxzZSBpZihidXR0b24gJiYgdXRpbHMuY2xvc2VzdF9wYXJlbnQoYnV0dG9uLCAnZG9vbGxpLXNlbGVjdCcpKSB7XHJcbiAgICAgICAgICAgIGFjdHVhbF9maWx0ZXJzKGJ1dHRvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8gcXVlcnlcclxuICAgIERPTS5xdWVyeV9pbnB1dF93cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB1cmwuc2V0X2xpbmsoe3R5cGU6ICdxdWVyeScsIHZhbHVlOiBET00ucXVlcnlfaW5wdXQudmFsdWV9KTtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vIHJlbW92ZSBhY3RpdmUgZmlsdGVyc1xyXG4gICAgRE9NLmFjdGl2ZV9maWx0ZXJzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHZhciBidXR0b24gPSBlLnRhcmdldDtcclxuXHJcbiAgICAgICAgaWYoYnV0dG9uICYmIGJ1dHRvbi50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdidXR0b24nKSB7XHJcbiAgICAgICAgICAgIGZpbHRlcnMucmVtb3ZlX2ZpbHRlcihidXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLWlkJykpO1xyXG4gICAgICAgICAgICBET00uYWN0aXZlX2ZpbHRlcnMucmVtb3ZlQ2hpbGQoYnV0dG9uKTtcclxuICAgICAgICAgICAgdXJsLnNldF9saW5rKHt0eXBlOiAnZmlsdGVycycsIHZhbHVlOiBmaWx0ZXJzLnRvU3RyaW5nKCl9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH0pO1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG5cclxudmFyIHV0aWxzICAgICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWxzLmpzJyksXHJcbiAgICBET00gICAgICAgICAgICAgPSByZXF1aXJlKCcuLi92YXJpYWJsZXMuanMnKSxcclxuICAgIGZpbHRlcnMgICAgICAgICA9IHJlcXVpcmUoJy4uL2ZpbHRlcnMuanMnKSxcclxuICAgIHVybCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4uL3VybF9wcm9jY2Vzc2luZy5qcycpO1xyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgRE9NLnNvcnRfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGlmKERPTS5zb3J0X2Ryb3Bkb3duLnN0eWxlLmRpc3BsYXkgIT09ICdibG9jaycpIHtcclxuICAgICAgICAgICAgRE9NLnNvcnRfZHJvcGRvd24uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgRE9NLnNvcnRfZHJvcGRvd24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8gY2xvc2luZ1xyXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IGUudGFyZ2V0O1xyXG5cclxuICAgICAgICBpZih0aGF0LnBhcmVudE5vZGUgJiYgIXRoYXQucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoRE9NLnNvcnRfZHJvcGRvd25fdGV4dCkgJiYgIXRoYXQuY2xhc3NMaXN0LmNvbnRhaW5zKERPTS5zb3J0X2J1dHRvbl9uYW1lKSAmJiAhdGhhdC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucyhET00uc29ydF9idXR0b25fbmFtZSkpIHtcclxuICAgICAgICAgICAgRE9NLnNvcnRfZHJvcGRvd24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8gc29ydGluZyBhY3Rpb25cclxuICAgIERPTS5zb3J0X2Ryb3Bkb3duLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHZhciBidXR0b24gICA9IGUudGFyZ2V0O1xyXG5cclxuICAgICAgICBpZihidXR0b24ucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoRE9NLnNvcnRfZHJvcGRvd25fbmFtZSkpIHtcclxuICAgICAgICAgICAgdXJsLnNldF9saW5rKHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICAgICAgICAgICdzb3J0JyxcclxuICAgICAgICAgICAgICAgIHNvcnRfYnk6ICAgICAgIGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtc29ydC1ieScpLFxyXG4gICAgICAgICAgICAgICAgc29ydF9maWVsZF9pZDogYnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1zb3J0LWZpZWxkLWlkJylcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8vIFByaXZhdGUgdmFyaWFibGVzIGFuZCBmdW5jdGlvbnNcclxudmFyIHV0aWxzICAgICAgPSByZXF1aXJlKCcuL3V0aWxzLmpzJyksXHJcbiAgICBET00gICAgICAgID0gcmVxdWlyZSgnLi92YXJpYWJsZXMuanMnKSxcclxuICAgIHByZWZpeCAgICAgPSBET00udXJsX3ByZWZpeCxcclxuICAgIHRlbXBsYXRlICAgPSByZXF1aXJlKCcuL3RlbXBsYXRlcy5qcycpWydKU1QnXVsnZmlsdGVyc19maW5kd2l0aGluJ10sXHJcblxyXG4gICAgZmlsdGVyc19pbmZvID0gW10sXHJcblxyXG4gICAgZmlsdGVyX3R5cGVzICAgPSBbJ2ZpZWxkX2ZpbHRlcnMnLCAnbnVtZXJpY19maWx0ZXJzJ10sXHJcbiAgICBhY3RpdmVfZmlsdGVycyA9IFtdLFxyXG4gICAgLy8gc3RhdGljIHZhbHVlIC0gdXNlZCBmb3IgaW5kZXRpZmluZyBmaWx0ZXJzIHdoZW4gdHJ5aW5nIHRvIHJlbW92ZSB0aGVtXHJcbiAgICBmaWx0ZXJfaW5kZXggICA9IDAsXHJcblxyXG5cclxuICAgIGFkZF9zZWxlY3RlZF9maWx0ZXJzX2FzX2J1dHRvbnMgPSBmdW5jdGlvbihhcmdzKSB7XHJcbiAgICAgICAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCBhcmdzLmlkKTtcclxuICAgICAgICBidXR0b24uaW5uZXJIVE1MID0gYXJncy5idXR0b25fdGV4dDtcclxuICAgICAgICBET00uYWN0aXZlX2ZpbHRlcnMuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIGludGVycHJldGVfdXJsID0gZnVuY3Rpb24odXJsX2ZpbHRlcnMsIHVybF9xdWVyeSkge1xyXG4gICAgICAgIGlmKHVybF9maWx0ZXJzKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmxfc3BsaXQgICAgICAgICAgPSB1dGlscy51cmxkZWNvZGUodXJsX2ZpbHRlcnMpLnNwbGl0KCcmJyksXHJcbiAgICAgICAgICAgICAgICBvbmVfdHlwZV9vZl9maWx0ZXIgPSBudWxsLFxyXG4gICAgICAgICAgICAgICAgdHlwZSAgICAgICAgICAgICAgID0gbnVsbCxcclxuICAgICAgICAgICAgICAgIGZpbHRlcl92YWx1ZSAgICAgICA9IG51bGwsXHJcbiAgICAgICAgICAgICAgICBpdGVtICAgICAgICAgICAgICAgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIC8vIHJlc2V0aW5nIHRoZSBhY3RpdmUgZmlsdGVyc1xyXG4gICAgICAgICAgICBhY3RpdmVfZmlsdGVycyA9IFtdO1xyXG4gICAgICAgICAgICAvLyByZXNldGluZyB0aGUgYWN0aXZlIGZpbHRlcnMgaHRtbCBwbGFjZWhvbGRlclxyXG4gICAgICAgICAgICBET00uYWN0aXZlX2ZpbHRlcnMuaW5uZXJIVE1MID0gJyc7XHJcblxyXG4gICAgICAgICAgICAvLyBjb25zdHJ1Y3RpbmcgdGhlIGZpbHRlciBhcnJheSAoZm9yIGxhdGVyIGFkZGl0aW9uIGFuZCByZW1vdmFsKVxyXG4gICAgICAgICAgICAvLyBhbmQgYWRkaW5nIHRoZSBhY3RpdmUgZmlsdGVyIGJ1dHRvbnNcclxuICAgICAgICAgICAgZm9yKHZhciBqID0gMCwgbGVuMSA9IHVybF9zcGxpdC5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIG9uZV90eXBlX29mX2ZpbHRlciA9IHVybF9zcGxpdFtqXS5zcGxpdCgnPScpO1xyXG4gICAgICAgICAgICAgICAgdHlwZSAgICAgICAgICAgICAgID0gb25lX3R5cGVfb2ZfZmlsdGVyWzBdO1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyX3ZhbHVlICAgICAgID0gSlNPTi5wYXJzZSgne1widmFsdWVcIjonICsgb25lX3R5cGVfb2ZfZmlsdGVyWzFdICsgJ30nKS52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwLCBsZW4yID0gZmlsdGVyX3ZhbHVlLmxlbmd0aDsgaSA8IGxlbjI7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udHlwZSAgICAgICA9IHR5cGU7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5maWVsZF9uYW1lID0gZmlsdGVyX3ZhbHVlW2ldLmZpZWxkX25hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZSA9PT0gJ251bWVyaWNfZmlsdGVycycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5taW5fdmFsdWUgICA9IGZpbHRlcl92YWx1ZVtpXS5taW5fdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ubWF4X3ZhbHVlICAgPSBmaWx0ZXJfdmFsdWVbaV0ubWF4X3ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIGZpZWxkX2ZpbHRlcnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5maWVsZF92YWx1ZSA9IGZpbHRlcl92YWx1ZVtpXS5maWVsZF92YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkX2ZpbHRlcihpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodXJsX3F1ZXJ5KSB7XHJcbiAgICAgICAgICAgIERPTS5xdWVyeV9pbnB1dC52YWx1ZSA9IHVybF9xdWVyeS5yZXBsYWNlKC8lMjAvZywgJyAnKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBhZGRfZmlsdGVyID0gZnVuY3Rpb24oYXJncykge1xyXG4gICAgICAgIHZhciBpdGVtICAgICAgICA9IHt9LFxyXG4gICAgICAgICAgICBidXR0b25fdGV4dCA9ICcnO1xyXG5cclxuICAgICAgICBpZighYWN0aXZlX2ZpbHRlcnNbYXJncy50eXBlXSkge1xyXG4gICAgICAgICAgICBhY3RpdmVfZmlsdGVyc1thcmdzLnR5cGVdID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdGVtLmlkICAgICAgICAgPSBmaWx0ZXJfaW5kZXg7XHJcbiAgICAgICAgaXRlbS5maWVsZF9uYW1lID0gYXJncy5maWVsZF9uYW1lOyAvLyB0aGUgbmFtZSBjb21lcyB3aXRoIHNwYWNlc1xyXG4gICAgICAgIGlmKGFyZ3MudHlwZSA9PT0gJ251bWVyaWNfZmlsdGVycycpIHtcclxuICAgICAgICAgICAgaXRlbS5taW5fdmFsdWUgPSBhcmdzLm1pbl92YWx1ZTtcclxuICAgICAgICAgICAgaXRlbS5tYXhfdmFsdWUgPSBhcmdzLm1heF92YWx1ZTtcclxuICAgICAgICAgICAgYnV0dG9uX3RleHQgICArPSBhcmdzLmZpZWxkX25hbWUgKyAnKCcgKyBhcmdzLm1pbl92YWx1ZSArICctJyArIGFyZ3MubWF4X3ZhbHVlICsgJyknO1xyXG4gICAgICAgIH0gZWxzZSB7IC8vIGZpZWxkX2ZpbHRlcnNcclxuICAgICAgICAgICAgaXRlbS5maWVsZF92YWx1ZSA9IGFyZ3MuZmllbGRfdmFsdWU7XHJcbiAgICAgICAgICAgIGJ1dHRvbl90ZXh0ICAgICAgPSBhcmdzLmZpZWxkX3ZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaW5zZXJ0aW5nIHRoZSBmaWx0ZXJcclxuICAgICAgICBhY3RpdmVfZmlsdGVyc1thcmdzLnR5cGVdLnB1c2goaXRlbSk7XHJcbiAgICAgICAgLy8gYWRkaW5nIHRoZSBidXR0b25cclxuICAgICAgICBhZGRfc2VsZWN0ZWRfZmlsdGVyc19hc19idXR0b25zKHtpZDogZmlsdGVyX2luZGV4LCBidXR0b25fdGV4dDogYnV0dG9uX3RleHR9KTtcclxuXHJcbiAgICAgICAgZmlsdGVyX2luZGV4Kys7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICByZW1vdmVfZmlsdGVyID0gZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICB2YXIgaWQgICAgICAgICAgICA9IHBhcnNlSW50KGlkKTtcclxuXHJcbiAgICAgICAgLy8gc2VhcmNoIGZvciB0aGUgZmlsdGVyIHdpdGggaWQgZXF1YWxzIGlkXHJcbiAgICAgICAgZm9yKHZhciBpID0gMCwgbGVuMSA9IGZpbHRlcl90eXBlcy5sZW5ndGg7IGkgPCBsZW4xOyBpKyspIHtcclxuICAgICAgICAgICAgaWYoYWN0aXZlX2ZpbHRlcnNbZmlsdGVyX3R5cGVzW2ldXSkge1xyXG4gICAgICAgICAgICAgICAgYWN0aXZlX2ZpbHRlcnNbZmlsdGVyX3R5cGVzW2ldXSA9IGFjdGl2ZV9maWx0ZXJzW2ZpbHRlcl90eXBlc1tpXV0uZmlsdGVyKGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsLmlkICE9PSBpZDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIEZpbHRlciBwcmVwYXJhdGlvbiBmb3Igc3RyaW5naWZ5XHJcbiAgICAgKlxyXG4gICAgICogQmFzZWQgb24gdGhlIGRvY3VtZW50YXRpb25cclxuICAgICAqIGh0dHBzOi8vd3d3LmRvb2xsaS5jb20vZGV2ZWxvcGVyIy9kb2NzI1ZpZXdGaWx0ZXJzXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7U3RyaW5nfSBmaW5hbCBmaWx0ZXIgdXJsXHJcbiAgICAgKi9cclxuICAgIHRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGZpbmFsX3VybCAgICAgICAgICA9ICcnLFxyXG4gICAgICAgICAgICBvbmVfdHlwZV9vZl9maWx0ZXIgPSBudWxsO1xyXG5cclxuICAgICAgICBmb3IodmFyIGkgPSAwLCBsZW4xID0gZmlsdGVyX3R5cGVzLmxlbmd0aDsgaSA8IGxlbjE7IGkrKykge1xyXG4gICAgICAgICAgICBvbmVfdHlwZV9vZl9maWx0ZXIgPSBhY3RpdmVfZmlsdGVyc1tmaWx0ZXJfdHlwZXNbaV1dO1xyXG4gICAgICAgICAgICBpZighb25lX3R5cGVfb2ZfZmlsdGVyIHx8IG9uZV90eXBlX29mX2ZpbHRlci5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihmaW5hbF91cmwgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBmaW5hbF91cmwgKz0gJyYnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpbmFsX3VybCArPSBwcmVmaXggKyBmaWx0ZXJfdHlwZXNbaV0gKyAnPSc7XHJcbiAgICAgICAgICAgIC8vIHByZXBhcmluZyBmb3IgdXJsLWVmaWNhdGlvbiAtIGJ5IHJlbW92aW5nIHRoZSBpZFxyXG4gICAgICAgICAgICBvbmVfdHlwZV9vZl9maWx0ZXIubWFwKGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgZWwuaWQ7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWw7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBmaW5hbF91cmwgKz0gSlNPTi5zdHJpbmdpZnkob25lX3R5cGVfb2ZfZmlsdGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB1dGlscy51cmxlbmNvZGUoZmluYWxfdXJsKTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBOdW1lcmljIHNsaWRlciBmdW5jdGlvbmFsaXR5XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtET00gb2JqZWN0fSAtIHNsaWRlcl93cmFwcGVyIC0gY2FsbGVkIGluIHBvcHVsYXRlX2ZpbHRlcnNcclxuICAgICAqL1xyXG4gICAgbnVtZXJpY19zbGlkZXIgPSBmdW5jdGlvbihzbGlkZXJfd3JhcHBlcikge1xyXG4gICAgICAgIHZhciBiYXIgICAgICAgICAgID0gc2xpZGVyX3dyYXBwZXIucXVlcnlTZWxlY3RvcignLmRvb2xsaS1zbGlkZXItYmFyJyksXHJcbiAgICAgICAgICAgIGJ0bl9sZWZ0ICAgICAgPSBzbGlkZXJfd3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuZG9vbGxpLXNsaWRlci1sZWZ0JyksXHJcbiAgICAgICAgICAgIGJ0bl9yaWdodCAgICAgPSBzbGlkZXJfd3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuZG9vbGxpLXNsaWRlci1yaWdodCcpLFxyXG5cclxuICAgICAgICAgICAgbWF4X3ZhbHVlICAgICA9IHBhcnNlSW50KHNsaWRlcl93cmFwcGVyLmdldEF0dHJpYnV0ZSgnZGF0YS1tYXgnKSksXHJcbiAgICAgICAgICAgIG1pbl92YWx1ZSAgICAgPSBwYXJzZUludChzbGlkZXJfd3JhcHBlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWluJykpLFxyXG5cclxuICAgICAgICAgICAgbWF4X3BvcyAgICAgICA9IDAsXHJcbiAgICAgICAgICAgIGN1cnJlbnRfYnRuICAgPSBudWxsLFxyXG4gICAgICAgICAgICBsZWZ0X3BvcyAgICAgID0gMCxcclxuICAgICAgICAgICAgcmlnaHRfcG9zICAgICA9IDAsXHJcblxyXG4gICAgICAgICAgICBpc19maXJzdF90aW1lID0gdHJ1ZTtcclxuXHJcblxyXG4gICAgICAgIHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIG1heF9wb3MgICAgICAgICAgICAgID0gYmFyLm9mZnNldFdpZHRoO1xyXG5cclxuICAgICAgICAgICAgbGVmdF9wb3MgICAgICAgICAgICAgPSAwO1xyXG4gICAgICAgICAgICByaWdodF9wb3MgICAgICAgICAgICA9IG1heF9wb3M7XHJcblxyXG4gICAgICAgICAgICBidG5fbGVmdC5zdHlsZS5sZWZ0ICA9IGxlZnRfcG9zICsgJ3B4JztcclxuICAgICAgICAgICAgYnRuX3JpZ2h0LnN0eWxlLmxlZnQgPSByaWdodF9wb3MgKyAncHgnO1xyXG5cclxuICAgICAgICAgICAgaXNfZmlyc3RfdGltZSAgICAgICAgPSAhaXNfZmlyc3RfdGltZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzdGFydF9zbGlkZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgY3VycmVudF9idG4gPSBlLnRhcmdldC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc3BhbicgPyBlLnRhcmdldC5wYXJlbnROb2RlIDogZS50YXJnZXQ7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW92ZV9zbGlkZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG1vdmVfc2xpZGUsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzX2ZpcnN0X3RpbWUpIHtcclxuICAgICAgICAgICAgICAgIGluaXQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICB2YXIgbW92ZV9zbGlkZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgdmFyIG1vdmVtZW50ICAgICAgPSBlLmNoYW5nZWRUb3VjaGVzID8gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWCA6IGUucGFnZVgsXHJcbiAgICAgICAgICAgICAgICBidG5fcG9zICAgICAgID0gbW92ZW1lbnQgLSB1dGlscy5vZmZzZXQoc2xpZGVyX3dyYXBwZXIpLmxlZnQgLSAxMDtcclxuXHJcbiAgICAgICAgICAgIGJ0bl9wb3MgPSBidG5fcG9zID4gbWF4X3BvcyA/IG1heF9wb3MgOiBidG5fcG9zO1xyXG4gICAgICAgICAgICBidG5fcG9zID0gYnRuX3BvcyA8IDAgPyAwIDogYnRuX3BvcztcclxuXHJcbiAgICAgICAgICAgIGlmKGN1cnJlbnRfYnRuID09PSBidG5fbGVmdCkge1xyXG4gICAgICAgICAgICAgICAgaWYoYnRuX3BvcyA+PSByaWdodF9wb3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBidG5fcG9zID0gcmlnaHRfcG9zIC0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxlZnRfcG9zID0gYnRuX3BvcztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmKGJ0bl9wb3MgPD0gbGVmdF9wb3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBidG5fcG9zID0gbGVmdF9wb3MgKyAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmlnaHRfcG9zID0gYnRuX3BvcztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY3VycmVudF9idG4uc3R5bGUubGVmdCA9IGJ0bl9wb3MgKyAncHgnO1xyXG4gICAgICAgICAgICBjdXJyZW50X2J0bi5xdWVyeVNlbGVjdG9yKCdzcGFuJykuaW5uZXJIVE1MID0gcGFyc2VJbnQobWluX3ZhbHVlICsgKG1heF92YWx1ZSAtIG1pbl92YWx1ZSkgKiBidG5fcG9zIC8gbWF4X3Bvcyk7XHJcblxyXG4gICAgICAgICAgICBiYXIuc3R5bGUud2lkdGggICAgICA9IHJpZ2h0X3BvcyAtIGxlZnRfcG9zICsgJ3B4JztcclxuICAgICAgICAgICAgYmFyLnN0eWxlLm1hcmdpbkxlZnQgPSBsZWZ0X3BvcyArICdweCc7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHZhciBzdG9wX3NsaWRlID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmVfc2xpZGUsIGZhbHNlKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBtb3ZlX3NsaWRlLCBmYWxzZSk7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIGJ0bl9sZWZ0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHN0YXJ0X3NsaWRlLCBmYWxzZSk7XHJcbiAgICAgICAgYnRuX2xlZnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHN0YXJ0X3NsaWRlLCBmYWxzZSk7XHJcbiAgICAgICAgYnRuX3JpZ2h0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHN0YXJ0X3NsaWRlLCBmYWxzZSk7XHJcbiAgICAgICAgYnRuX3JpZ2h0LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBzdGFydF9zbGlkZSwgZmFsc2UpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBzdG9wX3NsaWRlLCBmYWxzZSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHN0b3Bfc2xpZGUsIGZhbHNlKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAvLyB3aGVuIHRoZSBtb3VzZSBnb2VzIG91dHNpZGUgb2YgdGhlIHdpbmRvd1xyXG4gICAgICAgICAgICBpZihlLnJlbGF0ZWRUYXJnZXQgPT09IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKSkge1xyXG4gICAgICAgICAgICAgICAgc3RvcF9zbGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxuICAgIHVwZGF0ZV9maWx0ZXJfY29udHJvbGVycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIHVwZGF0ZSBudW1lcmljIHNsaWRlciBvbiB0aGUgbmV3bHkgYWRkZWQgZWxlbWVudHNcclxuICAgICAgICB1dGlscy5mb3JFYWNoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kb29sbGktc2xpZGVyLXdyYXBwZXInKSwgZnVuY3Rpb24oaW5kZXgsIHNsaWRlcl93cmFwcGVyKSB7XHJcbiAgICAgICAgICAgIG51bWVyaWNfc2xpZGVyKHNsaWRlcl93cmFwcGVyKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcbiAgICBwb3B1bGF0ZV9maWx0ZXJzID0gZnVuY3Rpb24oaW5wdXQpIHtcclxuICAgICAgICB2YXIgaHRtbCA9IHRlbXBsYXRlKGlucHV0KTtcclxuXHJcbiAgICAgICAgaWYoRE9NLmZpbHRlcnNfd3JhcHBlcikge1xyXG4gICAgICAgICAgICBET00uZmlsdGVyc193cmFwcGVyLmlubmVySFRNTCA9IGh0bWw7XHJcblxyXG4gICAgICAgICAgICB1cGRhdGVfZmlsdGVyX2NvbnRyb2xlcnMoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnXCIuZG9vbGxpLWZpbHRlcnMtd3JhcHBlclwiIC0gZG9lc25cXCd0IGV4aXN0cycpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG5cclxuXHJcbi8vIFB1YmxpYyBmdW5jdGlvbnNcclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICB1cGRhdGVfRE9NOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIGlucHV0ICAgICAgICAgICAgICAgPSB7XHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiBbXSxcclxuICAgICAgICAgICAgICAgIGZpbHRlcnNfbGlzdDogW11cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZmlsdGVycyAgICAgICAgICAgICA9IGRhdGEuZmlsdGVycyxcclxuICAgICAgICAgICAgY2F0ZWdvcmllcyAgICAgICAgICA9IGRhdGEuY2F0ZWdvcnlfZmlsdGVycyxcclxuICAgICAgICAgICAgbnVtZXJpYyAgICAgICAgICAgICA9IGRhdGEubnVtZXJpY19maWx0ZXJzLFxyXG4gICAgICAgICAgICB2YWx1ZXMgICAgICAgICAgICAgID0gbnVsbCxcclxuICAgICAgICAgICAgaW5kZXggICAgICAgICAgICAgICA9IDAsXHJcbiAgICAgICAgICAgIG5hbWUgICAgICAgICAgICAgICAgPSAnJyxcclxuICAgICAgICAgICAgaXRlbXMgICAgICAgICAgICAgICA9IG51bGwsXHJcbiAgICAgICAgICAgIGNhdGVnb3JpZXNfZWxlbWVudCAgPSBudWxsLFxyXG4gICAgICAgICAgICBzdWJjYXRlZ29yeV9lbGVtZW50ID0gbnVsbCxcclxuXHJcblxyXG4gICAgICAgICAgICBhZGRfc3ViY2F0ZWdvcmllcyA9IGZ1bmN0aW9uKHN1Yl9jYXRlZ29yeSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDAsIGxlbiA9IHN1Yl9jYXRlZ29yeS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHN1Yl9jYXRlZ29yeVtpXS5zdWJfY2F0ZWdvcmllcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuY29uY2F0KGFkZF9zdWJjYXRlZ29yaWVzKHN1Yl9jYXRlZ29yeVtpXS5zdWJfY2F0ZWdvcmllcykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkX25hbWU6ICAnQ2F0ZWdvcnknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRfdmFsdWU6IHV0aWxzLnVybGVuY29kZShzdWJfY2F0ZWdvcnlbaV0udmFsdWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogc3ViX2NhdGVnb3J5W2ldLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IHN1Yl9jYXRlZ29yeVtpXS5maWx0ZXJfY291bnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAgJ2ZpZWxkX2ZpbHRlcnMnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgLy8gZmllbGQgZmlsdGVyc1xyXG4gICAgICAgIGlmKGZpbHRlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwLCBsZW4gPSBmaWx0ZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrLCBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lID0gZmlsdGVyc1tpXS5maWVsZF9uYW1lO1xyXG4gICAgICAgICAgICAgICAgaW5wdXQuYnV0dG9ucy5wdXNoKHtuYW1lOiBuYW1lLCB0YXJnZXQ6IGluZGV4fSk7ICAgLy8gZ2V0dGluZyB0aGUgbmFtZVxyXG5cclxuICAgICAgICAgICAgICAgIGl0ZW1zID0gZmlsdGVyc1tpXS52YWx1ZXMubWFwKGZ1bmN0aW9uKGVsKSB7ICAgICAgICAvLyBhZGRpbmcgdGhlIGxpbmtcclxuICAgICAgICAgICAgICAgICAgICBlbC5maWVsZF9uYW1lICA9IHV0aWxzLnVybGVuY29kZShuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBlbC5maWVsZF92YWx1ZSA9IHV0aWxzLnVybGVuY29kZShlbC52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwubmFtZSAgICAgICAgPSBlbC52YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIGVsLnR5cGUgICAgICAgID0gJ2ZpZWxkX2ZpbHRlcnMnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWw7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbnB1dC5maWx0ZXJzX2xpc3QucHVzaCh7aXRlbXM6IGl0ZW1zLCBpZDogaW5kZXh9KTsgICAgICAvLyBnZXR0aW5nIHRoZSBsaXN0IG9mIGZpbHRlcnNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8vIGNhdGVnb3JpZXMgZmlsdGVyc1xyXG4gICAgICAgIGlmKGNhdGVnb3JpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBmb3IodmFyIGsgPSAwLCBsZW4xID0gY2F0ZWdvcmllcy5sZW5ndGg7IGsgPCBsZW4xOyBrKyspIHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXNfZWxlbWVudCA9IGNhdGVnb3JpZXNba10udmFsdWVzO1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBqID0gMCwgbGVuMiA9IGNhdGVnb3JpZXNfZWxlbWVudC5sZW5ndGg7IGogPCBsZW4yOyBqKyssIGluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBzdWJjYXRlZ29yeV9lbGVtZW50ID0gY2F0ZWdvcmllc19lbGVtZW50W2pdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHN1YmNhdGVnb3J5X2VsZW1lbnQuZmlsdGVyX2NvdW50ID4gMCkgeyAvLyBvbmx5IGZvciB0aGUgb25lcyB0aGF0IGFyZSBub3QgZW1wdHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuYnV0dG9ucy5wdXNoKHtuYW1lOiBzdWJjYXRlZ29yeV9lbGVtZW50LnZhbHVlLCB0YXJnZXQ6IGluZGV4fSk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldHRpbmcgdGhlIG5hbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuZmlsdGVyc19saXN0LnB1c2goe2l0ZW1zOiBhZGRfc3ViY2F0ZWdvcmllcyhzdWJjYXRlZ29yeV9lbGVtZW50LnN1Yl9jYXRlZ29yaWVzKSwgaWQ6IGluZGV4fSk7ICAgIC8vIGdldHRpbmcgdGhlIGxpc3Qgb2YgZmlsdGVyc1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8vIG51bWVyaWMgZmlsdGVyc1xyXG4gICAgICAgIGlmKG51bWVyaWMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwLCBsZW4gPSBudW1lcmljLmxlbmd0aDsgaSA8IGxlbjsgaSsrLCBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICBpbnB1dC5idXR0b25zLnB1c2goe25hbWU6IG51bWVyaWNbaV0uZmllbGRfbmFtZSwgdGFyZ2V0OiBpbmRleH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlucHV0LmZpbHRlcnNfbGlzdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBudW1lcmljW2ldLmZpZWxkX25hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgIG1pbl92YWx1ZTogbnVtZXJpY1tpXS5taW5fdmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4X3ZhbHVlOiBudW1lcmljW2ldLm1heF92YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbnVtZXJpY19maWx0ZXJzJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBwb3B1bGF0ZV9maWx0ZXJzKGlucHV0KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW50ZXJwcmV0ZV91cmw6IGludGVycHJldGVfdXJsLFxyXG5cclxuICAgIGFkZF9maWx0ZXI6ICAgICBhZGRfZmlsdGVyLFxyXG4gICAgcmVtb3ZlX2ZpbHRlcjogIHJlbW92ZV9maWx0ZXIsXHJcblxyXG4gICAgdG9TdHJpbmc6ICAgICAgIHRvU3RyaW5nXHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbnZhciBjb250cm9scyAgICAgICAgPSByZXF1aXJlKCcuL2NvbnRyb2xzLmpzJyksXHJcbiAgICBsb2FkaW5nICAgICAgICAgPSByZXF1aXJlKCcuL2xvYWRpbmcuanMnKSxcclxuICAgIHVybCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vdXJsX3Byb2NjZXNzaW5nLmpzJyksXHJcbiAgICBsaWdodGJveCAgICAgICAgPSByZXF1aXJlKCcuL2xpZ2h0Ym94LmpzJyk7XHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIHJldHJpdmluZyB0aGUgZGIgaWQgLSB1c2VkIGZvciBhamF4IGNhbGxzXHJcbiAgICAgICAgYWpheF92YXJzLmRiX2lkICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kb29sbGktd3JhcHBlcicpLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xyXG4gICAgICAgIC8vIHJldHJpdmluZyB0aGUgaXRlbWNvdW50IC0gdXNlZCBmb3IgYWpheCBjYWxsc1xyXG4gICAgICAgIGFqYXhfdmFycy5pdGVtY291bnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZG9vbGxpLXdyYXBwZXInKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaXRlbWNvdW50Jyk7XHJcbiAgICAgICAgLy8gcmV0cml2aW5nIHRoZSBsYXlvdXQgLSB1c2VkIGZvciBhamF4IGNhbGxzXHJcbiAgICAgICAgYWpheF92YXJzLmxheW91dCAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kb29sbGktd3JhcHBlcicpLmdldEF0dHJpYnV0ZSgnZGF0YS1sYXlvdXQnKTtcclxuXHJcbiAgICAgICAgLy8gaW5pdGlhbGl6aW5nIHRoZSBsaWdodGJveFxyXG4gICAgICAgIGxpZ2h0Ym94LmluaXQoKTtcclxuXHJcbiAgICAgICAgY29udHJvbHMuaW5pdCgpO1xyXG5cclxuICAgICAgICB1cmwuaW5pdCgpO1xyXG4gICAgfVxyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbnZhciBET00gICAgICAgPSByZXF1aXJlKCcuL3ZhcmlhYmxlcy5qcycpLFxyXG4gICAgdGVtcGxhdGVzID0gcmVxdWlyZSgnLi90ZW1wbGF0ZXMuanMnKVsnSlNUJ10sXHJcblxyXG5cclxuICAgIGluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbGlnaHRib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHJcbiAgICAgICAgbGlnaHRib3guY2xhc3NOYW1lID0gJ2Rvb2xsaS1saWdodGJveCc7XHJcbiAgICAgICAgbGlnaHRib3guaW5uZXJIVE1MID0gdGVtcGxhdGVzWydsaWdodGJveCddKCk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaWdodGJveCk7XHJcblxyXG5cclxuICAgICAgICAvLyBPcGVuaW5nIHRoZSBsaWdodGJveCBvbiBjbGlja1xyXG4gICAgICAgIERPTS53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICB2YXIgYnV0dG9uID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICBpZihidXR0b24gJiYgYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZmEtZXhwYW5kJykpIHtcclxuICAgICAgICAgICAgICAgIHZhciBsaWdodGJveF9jb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRvb2xsaS1saWdodGJveC1jb250ZW50JyksXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2UgICAgICAgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIGJ1dHRvbi5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpLmdldEF0dHJpYnV0ZSgnc3JjJykucmVwbGFjZShET00uaW1hZ2Vfc2hvd19zaXplLCAnJykpO1xyXG4gICAgICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlnaHRib3hfY29udGVudC5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICBsaWdodGJveF9jb250ZW50LmFwcGVuZENoaWxkKGltYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0YWtpbmcgY2FyZSBvZiBwcm9wb3J0aW9ucyByZWxhdGl2ZSB0byB0aGUgd2luZG93XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoKGltYWdlLmNsaWVudFdpZHRoIC8gaW1hZ2UuY2xpZW50SGVpZ2h0KSA8IChET00ud2luZG93X3dpZHRoIC8gRE9NLndpbmRvd19oZWlnaHQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlLnN0eWxlLmhlaWdodCA9IERPTS53aW5kb3dfaGVpZ2h0ICogMC45ICsgJ3B4JztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZS5zdHlsZS53aWR0aCA9IERPTS53aW5kb3dfd2lkdGggKiAwLjkgKyAncHgnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgbGlnaHRib3hfY29udGVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZXNbJ2xvYWRpbmdfdGV4dCddKCk7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZG9vbGxpLWxpZ2h0Ym94Jykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIC8vIENsb3NpbmcgdGhlIGxpZ2h0Ym94IG9uIGZhLWNsb3NlIGNsaWNrXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRvb2xsaS1saWdodGJveCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBpZihlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2Rvb2xsaS1saWdodGJveC1jb250ZW50JykgfHwgZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmYS1jbG9zZScpKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZG9vbGxpLWxpZ2h0Ym94Jykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGZhbHNlKTtcclxuICAgIH07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBpbml0OiBpbml0XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcblxyXG52YXIgdXRpbHMgICAgICAgICAgID0gcmVxdWlyZSgnLi91dGlscy5qcycpLFxyXG4gICAgRE9NICAgICAgICAgICAgID0gcmVxdWlyZSgnLi92YXJpYWJsZXMuanMnKSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIHRlbXBsYXRlcyBsb2NhdGVkIGluIHdvcmRwcmVzcy9kZXYvZG9vbGxpX3BsdWdpbi90ZW1wbGF0ZXNcclxuICAgICAqXHJcbiAgICAgKiBUaGVzZSBhcmUgSlNUcywgYWxyZWFkeSBjb21waWxlZCB0ZW1wbGF0ZXMgKGJ5IGd1bHAtanN0LWNvbmNhdClcclxuICAgICAqL1xyXG4gICAgbG9hZGluZ190ZXh0ICAgID0gcmVxdWlyZSgnLi90ZW1wbGF0ZXMuanMnKVsnSlNUJ11bJ2xvYWRpbmdfdGV4dCddKCksXHJcbiAgICB2aWV3cyAgICAgICAgICAgPSByZXF1aXJlKCcuL3ZpZXdzLmpzJyksXHJcbiAgICBmaWx0ZXJzICAgICAgICAgPSByZXF1aXJlKCcuL2ZpbHRlcnMuanMnKSxcclxuICAgIHNvcnQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vc29ydC5qcycpLFxyXG5cclxuXHJcbiAgICAvLyBTaW5ndWxhclxyXG4gICAgbG9hZF9pdGVtID0gZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICBET00ud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdkb29sbGktc2hvd19maWx0ZXJzJyk7XHJcbiAgICAgICAgRE9NLmNvbnRhaW5lci5pbm5lckhUTUwgPSBsb2FkaW5nX3RleHQ7XHJcbiAgICAgICAgLy8gUmVtb3ZpbmcgdGhlIHBhZ2luYXRpb25cclxuICAgICAgICBET00ucGFnZXIuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZSA6ICAgICAgJ3Bvc3QnLFxyXG4gICAgICAgICAgICBkYXRhVHlwZSA6ICAnanNvbicsXHJcbiAgICAgICAgICAgIHVybCA6ICAgICAgIGFqYXhfdmFycy5hamF4dXJsLFxyXG4gICAgICAgICAgICBkYXRhIDogICAgICB7XHJcbiAgICAgICAgICAgICAgICBhY3Rpb246ICAgICdpdGVtX3ZpZXcnLFxyXG4gICAgICAgICAgICAgICAgbm9uY2U6ICAgICBhamF4X3ZhcnMuaXRlbXNfbG9hZF9ub25jZSxcclxuICAgICAgICAgICAgICAgIGRiX2lkOiAgICAgYWpheF92YXJzLmRiX2lkLFxyXG4gICAgICAgICAgICAgICAgaWQ6ICAgICAgICBpZFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiAgICBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgaWYocmVzcG9uc2UuZGF0YS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIERPTS5jb250YWluZXIuaW5uZXJIVE1MID0gJzxwIGNsYXNzPVwiZG9vbGxpLWVycm9yXCI+U2VydmVyIGVycm9yOiAnICsgcmVzcG9uc2UuZGF0YS5lcnJvciArICc8L3A+JztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlld3MudXBkYXRlKHJlc3BvbnNlLmRhdGEsICdzaW5nbGUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxuICAgIC8vIHBsdXJhbFxyXG4gICAgbG9hZF9pdGVtcyA9IGZ1bmN0aW9uKGV4dHJhX2RhdGEpIHtcclxuICAgICAgICBET00uY29udGFpbmVyLmlubmVySFRNTCA9IGxvYWRpbmdfdGV4dDtcclxuICAgICAgICAvLyBSZW1vdmluZyB0aGUgcGFnaW5hdGlvblxyXG4gICAgICAgIERPTS5wYWdlci5pbm5lckhUTUwgPSAnJztcclxuXHJcbiAgICAgICAgalF1ZXJ5LmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlIDogICAgICAncG9zdCcsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlIDogICdqc29uJyxcclxuICAgICAgICAgICAgdXJsIDogICAgICAgYWpheF92YXJzLmFqYXh1cmwsXHJcbiAgICAgICAgICAgIGRhdGEgOiAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbjogICAgJ2l0ZW1zX2xvYWQnLFxyXG4gICAgICAgICAgICAgICAgYWpheF92YXJzOiBhamF4X3ZhcnMsXHJcbiAgICAgICAgICAgICAgICBub25jZTogICAgIGFqYXhfdmFycy5pdGVtc19sb2FkX25vbmNlLFxyXG4gICAgICAgICAgICAgICAgZXh0cmE6ICAgICBleHRyYV9kYXRhXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6ICAgIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZihyZXNwb25zZS5kYXRhLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgRE9NLmNvbnRhaW5lci5pbm5lckhUTUwgPSAnPHAgY2xhc3M9XCJkb29sbGktZXJyb3JcIj5TZXJ2ZXIgZXJyb3I6ICcgKyByZXNwb25zZS5kYXRhLmVycm9yICsgJzwvcD4nO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3cy51cGRhdGUocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVycy51cGRhdGVfRE9NKHJlc3BvbnNlLmZpbHRlcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNvcnQudXBkYXRlX0RPTShyZXNwb25zZS5kYXRhLmZpZWxkcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgbG9hZF9pdGVtczogbG9hZF9pdGVtcyxcclxuICAgIGxvYWRfaXRlbTogbG9hZF9pdGVtXHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcblxyXG52YXIgdXRpbHMgICAgICAgICAgID0gcmVxdWlyZSgnLi91dGlscy5qcycpLFxyXG4gICAgRE9NICAgICAgICAgICAgID0gcmVxdWlyZSgnLi92YXJpYWJsZXMuanMnKSxcclxuICAgIHRlbXBsYXRlcyAgICAgICA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzLmpzJyksXHJcblxyXG4gICAgYWN0aXZlX3NvcnQgICAgID0gJycsXHJcblxyXG5cclxuICAgIGludGVycHJldGVfdXJsID0gZnVuY3Rpb24oYXJncykge1xyXG4gICAgICAgIGFjdGl2ZV9zb3J0ID0gYXJncztcclxuICAgIH0sXHJcblxyXG5cclxuICAgIHVwZGF0ZV9ET00gPSBmdW5jdGlvbihmaWVsZHMpIHtcclxuICAgICAgICB2YXIgZGF0YV9mb3JfdGVtcGxhdGUgPSBmaWVsZHMubWFwKGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc29ydF9ieSA9ICdhc2MnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgICAgPSAnJyxcclxuICAgICAgICAgICAgICAgICAgICBhY3RpdmUgID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoZWwuaXNfc29ydGFibGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihlbC5maWVsZF9pZCA9PT0gcGFyc2VJbnQoYWN0aXZlX3NvcnQuc29ydF9maWVsZF9pZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc29ydF9ieSA9IChhY3RpdmVfc29ydC5zb3J0X2J5ID09PSAnYXNjJykgPyAnZGVzYycgOiAnYXNjJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlICA9ICdhY3RpdmUnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZWwuaXNfbnVtZXJpY19maWx0ZXJhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnbnVtZXJpYyc7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKGVsLmlzX3RpbWVfZmlsdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ3RpbWUnO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihlbC5pc19kYXRlX3RpbWVfZmlsdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ3RpbWUnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzb3J0X2ZpZWxkX2lkOiBlbC5maWVsZF9pZCwgc29ydF9ieTogc29ydF9ieSwgdmFsdWU6IGVsLmZpZWxkX25hbWUsIGZpZWxkX3R5cGU6IHR5cGUsIGlzX2FjdGl2ZTogYWN0aXZlfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIERPTS5zb3J0X2Ryb3Bkb3duLmlubmVySFRNTCA9IHRlbXBsYXRlc1snSlNUJ11bJ3NvcnRfYnV0dG9ucyddKHtidXR0b25zOiBkYXRhX2Zvcl90ZW1wbGF0ZX0pO1xyXG4gICAgfTtcclxuXHJcblxyXG5cclxuLy8gUHVibGljIGZ1bmN0aW9uc1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGludGVycHJldGVfdXJsOiBpbnRlcnByZXRlX3VybCxcclxuICAgIHVwZGF0ZV9ET006IHVwZGF0ZV9ET01cclxufTsiLCJ0aGlzLkpTVCA9IHtcImZpbHRlcnNfZmluZHdpdGhpblwiOiBmdW5jdGlvbihvYmopIHtcbm9iaiB8fCAob2JqID0ge30pO1xudmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlLCBfX2ogPSBBcnJheS5wcm90b3R5cGUuam9pbjtcbmZ1bmN0aW9uIHByaW50KCkgeyBfX3AgKz0gX19qLmNhbGwoYXJndW1lbnRzLCAnJykgfVxud2l0aCAob2JqKSB7XG5fX3AgKz0gJyAgICAgICAgPGRpdiBjbGFzcz1cImRvb2xsaS1jYXRlZ29yaWVzXCI+XFxyXFxuICAgICAgICAgICAgJztcbiBfLmZvckVhY2goYnV0dG9ucywgZnVuY3Rpb24oYnV0dG9uLCBpbmRleCkgeyA7XG5fX3AgKz0gJ1xcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uICc7XG4gaWYoaW5kZXggPT09IDApIHsgcHJpbnQoJ2NsYXNzPVwiYWN0aXZlXCInKTsgfTtcbl9fcCArPSAnIGRhdGEtdGFyZ2V0PVwiJyArXG4oKF9fdCA9ICggYnV0dG9uLnRhcmdldCApKSA9PSBudWxsID8gJycgOiBfX3QpICtcbidcIj4nICtcbigoX190ID0gKCBidXR0b24ubmFtZSApKSA9PSBudWxsID8gJycgOiBfX3QpICtcbic8L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAnO1xuIH0pOyA7XG5fX3AgKz0gJ1xcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVwiZG9vbGxpLXNlbGVjdFwiPlxcclxcbiAgICAgICAgICAgICc7XG4gXy5mb3JFYWNoKGZpbHRlcnNfbGlzdCwgZnVuY3Rpb24oZmlsdGVyX2xpc3QsIGluZGV4KSB7IDtcbl9fcCArPSAnXFxyXFxuICAgICAgICAgICAgICAgICc7XG4gaWYoZmlsdGVyX2xpc3QudHlwZSA9PT0gJ251bWVyaWNfZmlsdGVycycpIHsgO1xuX19wICs9ICdcXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJqc18nICtcbigoX190ID0gKCBmaWx0ZXJfbGlzdC5pZCApKSA9PSBudWxsID8gJycgOiBfX3QpICtcbicgJztcbiBpZihpbmRleCA9PT0gMCkgeyBwcmludCgnYWN0aXZlJyk7IH07XG5fX3AgKz0gJyBkb29sbGktc2VsZWN0LXN0eWxlLTFcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG9vbGxpLXNsaWRlci13cmFwcGVyXCIgZGF0YS1tYXg9XCInICtcbigoX190ID0gKCBmaWx0ZXJfbGlzdC5tYXhfdmFsdWUgKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nXCIgZGF0YS1taW49XCInICtcbigoX190ID0gKCBmaWx0ZXJfbGlzdC5taW5fdmFsdWUgKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb29sbGktc2xpZGVyLWJhclwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiZG9vbGxpLXNsaWRlci1sZWZ0XCI+PHNwYW4+JyArXG4oKF9fdCA9ICggZmlsdGVyX2xpc3QubWluX3ZhbHVlICkpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJzwvc3Bhbj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImRvb2xsaS1zbGlkZXItcmlnaHRcIj48c3Bhbj4nICtcbigoX190ID0gKCBmaWx0ZXJfbGlzdC5tYXhfdmFsdWUgKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nPC9zcGFuPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS1maWVsZC1uYW1lPVwiJyArXG4oKF9fdCA9ICggZmlsdGVyX2xpc3QubmFtZSApKSA9PSBudWxsID8gJycgOiBfX3QpICtcbidcIj5BcHBseSBmaWx0ZXI8L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAnO1xuIH0gZWxzZSB7IDtcbl9fcCArPSAnXFxyXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwianNfJyArXG4oKF9fdCA9ICggZmlsdGVyX2xpc3QuaWQgKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nICc7XG4gaWYoaW5kZXggPT09IDApIHsgcHJpbnQoJ2FjdGl2ZScpOyB9O1xuX19wICs9ICdcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAnO1xuIF8uZWFjaChmaWx0ZXJfbGlzdC5pdGVtcywgZnVuY3Rpb24oaXRlbSkgeyA7XG5fX3AgKz0gJ1xcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS1maWVsZC1uYW1lPVwiJyArXG4oKF9fdCA9ICggaXRlbS5maWVsZF9uYW1lICkpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJ1wiIGRhdGEtZmllbGQtdmFsdWU9XCInICtcbigoX190ID0gKCBpdGVtLmZpZWxkX3ZhbHVlICkpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJ1wiIGRhdGEtdHlwZT1cIicgK1xuKChfX3QgPSAoIGl0ZW0udHlwZSApKSA9PSBudWxsID8gJycgOiBfX3QpICtcbidcIj48c3Bhbj4nICtcbigoX190ID0gKCBpdGVtLm5hbWUgKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nPC9zcGFuPiA8aT4nICtcbigoX190ID0gKCBpdGVtLmNvdW50ICkpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJyByZXN1bHRzPC9pPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICc7XG4gfSk7IDtcbl9fcCArPSAnXFxyXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgJztcbiB9IDtcbl9fcCArPSAnXFxyXFxuICAgICAgICAgICAgJztcbiB9KTsgO1xuX19wICs9ICdcXHJcXG4gICAgICAgIDwvZGl2Pic7XG5cbn1cbnJldHVybiBfX3Bcbn0sXG5cIml0ZW1faW5fbGlzdFwiOiBmdW5jdGlvbihvYmopIHtcbm9iaiB8fCAob2JqID0ge30pO1xudmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlLCBfX2ogPSBBcnJheS5wcm90b3R5cGUuam9pbjtcbmZ1bmN0aW9uIHByaW50KCkgeyBfX3AgKz0gX19qLmNhbGwoYXJndW1lbnRzLCAnJykgfVxud2l0aCAob2JqKSB7XG5fX3AgKz0gJzxkaXYgY2xhc3M9XCJkb29sbGktaXRlbSBkb29sbGktaXRlbS0nICtcbigoX190ID0gKCBsYXlvdXQgKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XCJkb29sbGktaXRlbS1pbm5lclwiPlxcclxcbiAgICAgICAgJztcbiBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihpdGVtX2ZpZWxkKSB7IDtcbl9fcCArPSAnXFxyXFxuICAgICAgICAgICAgJztcbiBpZihpdGVtX2ZpZWxkLmNvbnRlbnRfdmlldyA9PT0gdHJ1ZSAmJiBpdGVtX2ZpZWxkLnZhbHVlKSB7IDtcbl9fcCArPSAnXFxyXFxuICAgICAgICAgICAgICAgICAgICAnO1xuIGlmKGl0ZW1fZmllbGQudHlwZSA9PT0gJ2ltYWdlJykgeyA7XG5fX3AgKz0gJ1xcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZG9vbGxpLWZpZWxkLXdyYXBwZXIgZG9vbGxpLWltZy1yZXNwb25zaXZlXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCInICtcbigoX190ID0gKCBpZCApKSA9PSBudWxsID8gJycgOiBfX3QpICtcbidcIiB0aXRsZT1cIkl0ZW1cXCdzIGltYWdlXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwiZG9vbGxpLWltZ1wiIHNyYz1cIicgK1xuKChfX3QgPSAoIGl0ZW1fZmllbGQudmFsdWUgKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nJyArXG4oKF9fdCA9ICggaW1hZ2Vfc2hvd19zaXplICkpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJ1wiIGFsdD1cIkltYWdlXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJmYSBmYS1leHBhbmRcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICc7XG4gfSBlbHNlIHsgO1xuX19wICs9ICdcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImRvb2xsaS1maWVsZC13cmFwcGVyXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc7XG4gaWYoaXRlbV9maWVsZC5kaXNwbGF5X2xhYmVsID09PSB0cnVlKSB7IDtcbl9fcCArPSAnXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWw+JyArXG4oKF9fdCA9ICggaXRlbV9maWVsZC5uYW1lICkpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJzwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc7XG4gfSA7XG5fX3AgKz0gJ1xcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnO1xuIGlmKGl0ZW1fZmllbGQuZGF0YV9maWVsZHMuaXNfdGl0bGUgPT09IHRydWUpIHsgO1xuX19wICs9ICdcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMj48YSBocmVmPVwiJyArXG4oKF9fdCA9ICggaWQgKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nXCIgdGl0bGU9XCInICtcbigoX190ID0gKCBpdGVtX2ZpZWxkLnZhbHVlICkpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJ1wiPicgK1xuKChfX3QgPSAoIGl0ZW1fZmllbGQudmFsdWUgKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nPC9hPjwvaDI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc7XG4gfSBlbHNlIHsgO1xuX19wICs9ICdcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPicgK1xuKChfX3QgPSAoIGl0ZW1fZmllbGQudmFsdWUgKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nPC9zcGFuPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnO1xuIH0gO1xuX19wICs9ICdcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XFxyXFxuICAgICAgICAgICAgICAgICAgICAnO1xuIH0gO1xuX19wICs9ICdcXHJcXG4gICAgICAgICAgICAnO1xuIH0gO1xuX19wICs9ICdcXHJcXG4gICAgICAgICc7XG4gfSk7IDtcbl9fcCArPSAnXFxyXFxuICAgICAgICA8YSBocmVmPVwiJyArXG4oKF9fdCA9ICggaWQgKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nXCIgdGl0bGU9XCJWaWV3IGl0ZW1cIj5WaWV3IGl0ZW08L2E+XFxyXFxuICAgIDwvZGl2PlxcclxcbjwvZGl2Plxcclxcbic7XG5cbn1cbnJldHVybiBfX3Bcbn0sXG5cIml0ZW1fdmlld1wiOiBmdW5jdGlvbihvYmopIHtcbm9iaiB8fCAob2JqID0ge30pO1xudmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlLCBfX2ogPSBBcnJheS5wcm90b3R5cGUuam9pbjtcbmZ1bmN0aW9uIHByaW50KCkgeyBfX3AgKz0gX19qLmNhbGwoYXJndW1lbnRzLCAnJykgfVxud2l0aCAob2JqKSB7XG5fX3AgKz0gJzxidXR0b24gY2xhc3M9XCJkb29sbGktYnRuLWJhY2tcIj48aSBjbGFzcz1cImZhIGZhLWFycm93LWxlZnRcIj48L2k+U2VlIGFsbCBpdGVtczwvYnV0dG9uPlxcclxcblxcclxcbjxkaXYgY2xhc3M9XCJkb29sbGktaXRlbSBkb29sbGktaXRlbS1saXN0XCI+XFxyXFxuICAgIDxpZHYgY2xhc3M9XCJkb29sbGktaXRlbS1pbm5lciBjbGVhcmZpeFwiPlxcclxcbiAgICAgICAgJztcbiBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihpdGVtX2ZpZWxkKSB7IDtcbl9fcCArPSAnXFxyXFxuICAgICAgICAgICAgICAgICc7XG4gaWYoaXRlbV9maWVsZC50eXBlID09PSAnaW1hZ2UnKSB7IDtcbl9fcCArPSAnXFxyXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG9vbGxpLWZpZWxkLXdyYXBwZXIgZG9vbGxpLWltYWdlLXdyYXBwZXJcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwiZG9vbGxpLWltZyBkb29sbGktaW1nLXJlc3BvbnNpdmVcIiBzcmM9XCInICtcbigoX190ID0gKCBpdGVtX2ZpZWxkLnZhbHVlICkpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJycgK1xuKChfX3QgPSAoIGltYWdlX3Nob3dfc2l6ZSApKSA9PSBudWxsID8gJycgOiBfX3QpICtcbidcIiBhbHQ9XCJJbWFnZVwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImZhIGZhLWV4cGFuZFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICc7XG4gfSA7XG5fX3AgKz0gJ1xcclxcbiAgICAgICAgICAgIDwvc3Bhbj5cXHJcXG4gICAgICAgICc7XG4gfSk7IDtcbl9fcCArPSAnXFxyXFxuXFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVwiZG9vbGxpLWl0ZW0tdmlldy10ZXh0XCI+XFxyXFxuICAgICAgICAnO1xuIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGl0ZW1fZmllbGQpIHsgO1xuX19wICs9ICdcXHJcXG4gICAgICAgICAgICAgICAgJztcbiBpZihpdGVtX2ZpZWxkLnR5cGUgIT09ICdpbWFnZScpIHsgO1xuX19wICs9ICdcXHJcXG4gICAgICAgICAgICAgICAgICAgICc7XG4gaWYoaXRlbV9maWVsZC52YWx1ZSkgeyA7XG5fX3AgKz0gJ1xcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb29sbGktZmllbGQtd3JhcHBlclwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJkb29sbGktbGFiZWxcIj4nICtcbigoX190ID0gKCBpdGVtX2ZpZWxkLm5hbWUgKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+JyArXG4oKF9fdCA9ICggaXRlbV9maWVsZC52YWx1ZSApKSA9PSBudWxsID8gJycgOiBfX3QpICtcbic8L3NwYW4+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAnO1xuIH0gO1xuX19wICs9ICdcXHJcXG4gICAgICAgICAgICAgICAgJztcbiB9IDtcbl9fcCArPSAnXFxyXFxuICAgICAgICAgICAgPC9zcGFuPlxcclxcbiAgICAgICAgJztcbiB9KTsgO1xuX19wICs9ICdcXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L2Rpdj4nO1xuXG59XG5yZXR1cm4gX19wXG59LFxuXCJpdGVtc19pbl90YWJsZVwiOiBmdW5jdGlvbihvYmopIHtcbm9iaiB8fCAob2JqID0ge30pO1xudmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlLCBfX2ogPSBBcnJheS5wcm90b3R5cGUuam9pbjtcbmZ1bmN0aW9uIHByaW50KCkgeyBfX3AgKz0gX19qLmNhbGwoYXJndW1lbnRzLCAnJykgfVxud2l0aCAob2JqKSB7XG5fX3AgKz0gJzxkaXYgY2xhc3M9XCJkb29sbGktdGFibGUtcmVzcG9uc2l2ZVwiPlxcclxcbiAgICA8dGFibGUgY2xhc3M9XCJkb29sbGktdGFibGUtcmVzcG9uc2l2ZSBkb29sbGktaXRlbS1pbm5lclwiPlxcclxcbiAgICAgICAgPHRoZWFkPlxcclxcbiAgICAgICAgICAgIDx0cj5cXHJcXG4gICAgICAgICAgICAgICAgJztcbiBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmaWVsZCkgeyA7XG5fX3AgKz0gJ1xcclxcbiAgICAgICAgICAgICAgICAgICAgJztcbiBpZihmaWVsZC5jb250ZW50X3ZpZXcgPT09IHRydWUpIHsgO1xuX19wICs9ICdcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+JyArXG4oKF9fdCA9ICggZmllbGQuZmllbGRfbmFtZSApKSA9PSBudWxsID8gJycgOiBfX3QpICtcbic8L3RoPlxcclxcbiAgICAgICAgICAgICAgICAgICAgJztcbiB9IDtcbl9fcCArPSAnXFxyXFxuICAgICAgICAgICAgICAgICc7XG4gfSk7IDtcbl9fcCArPSAnXFxyXFxuICAgICAgICAgICAgPC90cj5cXHJcXG4gICAgICAgIDwvdGhlYWQ+XFxyXFxuICAgICAgICA8dGJvZHk+XFxyXFxuICAgICAgICAgICAgJztcbiBfLmVhY2goaXRlbXMsIGZ1bmN0aW9uKGl0ZW0pIHsgO1xuX19wICs9ICdcXHJcXG4gICAgICAgICAgICAgICAgPHRyPlxcclxcbiAgICAgICAgICAgICAgICAgICAgJztcbiBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbV9maWVsZCA9IGl0ZW0uZmllbGRfdmFsdWVzW2ZpZWxkLmZpZWxkX2lkXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGZpZWxkLmNvbnRlbnRfdmlldyA9PT0gdHJ1ZSkgeyA7XG5fX3AgKz0gJ1xcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJkb29sbGktdGFibGUtZmllbGQtd3JhcHBlclwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJztcbiBpZihmaWVsZC50eXBlID09PSAnaW1hZ2UnICYmIGl0ZW1fZmllbGQpIHsgO1xuX19wICs9ICdcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwiZG9vbGxpLWltZyBkb29sbGktaW1nLXJlc3BvbnNpdmVcIiBzcmM9XCInICtcbigoX190ID0gKCBpdGVtX2ZpZWxkLnZhbHVlICkpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJycgK1xuKChfX3QgPSAoIGltYWdlX3Nob3dfc2l6ZSApKSA9PSBudWxsID8gJycgOiBfX3QpICtcbidcIiBhbHQ9XCJJbWFnZVwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJmYSBmYS1leHBhbmRcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc7XG4gfSBlbHNlIHsgO1xuX19wICs9ICdcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj4nICtcbigoX190ID0gKCBpdGVtX2ZpZWxkICkpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJzwvc3Bhbj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc7XG4gfSA7XG5fX3AgKz0gJ1xcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICc7XG4gfSA7XG5fX3AgKz0gJ1xcclxcbiAgICAgICAgICAgICAgICAgICAgJztcbiB9KTsgO1xuX19wICs9ICdcXHJcXG4gICAgICAgICAgICAgICAgPC90cj5cXHJcXG4gICAgICAgICAgICAnO1xuIH0pOyA7XG5fX3AgKz0gJ1xcclxcbiAgICAgICAgPC90Ym9keT5cXHJcXG4gICAgPC90YWJsZT5cXHJcXG48L2Rpdj4nO1xuXG59XG5yZXR1cm4gX19wXG59LFxuXCJsaWdodGJveFwiOiBmdW5jdGlvbihvYmopIHtcbm9iaiB8fCAob2JqID0ge30pO1xudmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlO1xud2l0aCAob2JqKSB7XG5fX3AgKz0gJzxkaXYgY2xhc3M9XCJkb29sbGktbGlnaHRib3gtd3JhcHBlclwiPlxcclxcbiAgICA8YnV0dG9uIGNsYXNzPVwiZmEgZmEtY2xvc2VcIj48L2J1dHRvbj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cImRvb2xsaS1saWdodGJveC1jb250ZW50XCI+PC9kaXY+XFxyXFxuPC9kaXY+JztcblxufVxucmV0dXJuIF9fcFxufSxcblwibG9hZGluZ190ZXh0XCI6IGZ1bmN0aW9uKG9iaikge1xub2JqIHx8IChvYmogPSB7fSk7XG52YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGU7XG53aXRoIChvYmopIHtcbl9fcCArPSAnPHAgY2xhc3M9XCJkb29sbGktbG9hZGluZ1wiPjxpbWcgc3JjPVwiaHR0cHM6Ly93d3cuZG9vbGxpLmNvbS90aGVtZS9pbWcvYXNzZXRzL2xvYWRlci10cmFucy5naWZcIiBhbHQ9XCJEb29sbGkgcGxlYXNlIHdhaXRcIiAvPkxvYWRpbmcgZGF0YSAuLi4gUGxlYXNlIHdhaXQ8L3A+JztcblxufVxucmV0dXJuIF9fcFxufSxcblwicGFnaW5hdGlvblwiOiBmdW5jdGlvbihvYmopIHtcbm9iaiB8fCAob2JqID0ge30pO1xudmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlLCBfX2ogPSBBcnJheS5wcm90b3R5cGUuam9pbjtcbmZ1bmN0aW9uIHByaW50KCkgeyBfX3AgKz0gX19qLmNhbGwoYXJndW1lbnRzLCAnJykgfVxud2l0aCAob2JqKSB7XG5cbiBpZihwYWdpbmcubGFzdF9wYWdlID4gMSkgeyA7XG5fX3AgKz0gJ1xcclxcbiAgICAnO1xuIGlmKHBhZ2luZy5jdXJyZW50X3BhZ2UgPiAxKSB7IDtcbl9fcCArPSAnXFxyXFxuICAgICAgICA8YSBocmVmPVwiMVwiIHRpdGxlPVwia2V5d29yZHMgZm9yIHRoaXNcIj5GaXJzdDwvYT5cXHJcXG4gICAgICAgIDxhIGhyZWY9XCInICtcbigoX190ID0gKCBwYWdpbmcucHJldmlvdXNfcGFnZSApKSA9PSBudWxsID8gJycgOiBfX3QpICtcbidcIiB0aXRsZT1cIkRvb2xsaSBQYWdlICcgK1xuKChfX3QgPSAoIHBhZ2luZy5wcmV2aW91c19wYWdlICkpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJ1wiPiZsdDs8L2E+XFxyXFxuICAgICc7XG4gfSA7XG5fX3AgKz0gJ1xcclxcblxcclxcblxcclxcbiAgICAnO1xuIF8uZWFjaChwYWdpbmcucGFnZXMsIGZ1bmN0aW9uKHBhZ2UpIHsgO1xuX19wICs9ICdcXHJcXG4gICAgICAgICc7XG4gaWYocGFnZSA9PT0gcGFnaW5nLmN1cnJlbnRfcGFnZSkgeyA7XG5fX3AgKz0gJ1xcclxcbiAgICAgICAgICAgIDxzcGFuPicgK1xuKChfX3QgPSAoIHBhZ2UgKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nPC9zcGFuPlxcclxcbiAgICAgICAgJztcbiB9IGVsc2Ugeztcbl9fcCArPSAnXFxyXFxuICAgICAgICAgICAgPGEgaHJlZj1cIicgK1xuKChfX3QgPSAoIHBhZ2UgKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nXCIgdGl0bGU9XCJEb29sbGkgUGFnZSAnICtcbigoX190ID0gKCBwYWdlICkpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJ1wiPicgK1xuKChfX3QgPSAoIHBhZ2UgKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nPC9hPlxcclxcbiAgICAgICAgJztcbiB9IDtcbl9fcCArPSAnXFxyXFxuICAgICc7XG4gfSk7IDtcbl9fcCArPSAnXFxyXFxuXFxyXFxuXFxyXFxuICAgICc7XG4gaWYocGFnaW5nLm5leHRfcGFnZSA+IDApIHsgO1xuX19wICs9ICdcXHJcXG4gICAgICAgIDxhIGhyZWY9XCInICtcbigoX190ID0gKCBwYWdpbmcubmV4dF9wYWdlICkpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJ1wiIHRpdGxlPVwiRG9vbGxpIFBhZ2UgJyArXG4oKF9fdCA9ICggcGFnaW5nLm5leHRfcGFnZSApKSA9PSBudWxsID8gJycgOiBfX3QpICtcbidcIj4mZ3Q7PC9hPlxcclxcbiAgICAgICAgPGEgaHJlZj1cIicgK1xuKChfX3QgPSAoIHBhZ2luZy5sYXN0X3BhZ2UgKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nXCIgdGl0bGU9XCJEb29sbGkgUGFnZSAnICtcbigoX190ID0gKCBwYWdpbmcubGFzdF9wYWdlICkpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJ1wiPkxhc3Q8L2E+XFxyXFxuICAgICc7XG4gfSA7XG5fX3AgKz0gJ1xcclxcbic7XG4gfSA7XG5cblxufVxucmV0dXJuIF9fcFxufSxcblwic29ydF9idXR0b25zXCI6IGZ1bmN0aW9uKG9iaikge1xub2JqIHx8IChvYmogPSB7fSk7XG52YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGUsIF9faiA9IEFycmF5LnByb3RvdHlwZS5qb2luO1xuZnVuY3Rpb24gcHJpbnQoKSB7IF9fcCArPSBfX2ouY2FsbChhcmd1bWVudHMsICcnKSB9XG53aXRoIChvYmopIHtcblxuIF8uZWFjaChidXR0b25zLCBmdW5jdGlvbihidXR0b24pIHtcclxuICAgIGlmKGJ1dHRvbikgeyA7XG5fX3AgKz0gJ1xcclxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIicgK1xuKChfX3QgPSAoIGJ1dHRvbi5pc19hY3RpdmUgKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nXCIgZGF0YS1zb3J0LWJ5PVwiJyArXG4oKF9fdCA9ICggYnV0dG9uLnNvcnRfYnkgKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nXCIgZGF0YS1zb3J0LWZpZWxkLWlkPVwiJyArXG4oKF9fdCA9ICggYnV0dG9uLnNvcnRfZmllbGRfaWQgKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nXCIgZGF0YS1maWVsZC10eXBlPVwiJyArXG4oKF9fdCA9ICggYnV0dG9uLmZpZWxkX3R5cGUgKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nXCI+JyArXG4oKF9fdCA9ICggYnV0dG9uLnZhbHVlICkpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJzwvYnV0dG9uPjxiciAvPlxcclxcbic7XG4gfVxyXG59KTsgO1xuX19wICs9ICdcXHJcXG4nO1xuXG59XG5yZXR1cm4gX19wXG59fTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuXHJcbnZhciB1dGlscyAgID0gcmVxdWlyZSgnLi91dGlscy5qcycpLFxyXG4gICAgbG9hZGluZyA9IHJlcXVpcmUoJy4vbG9hZGluZy5qcycpLFxyXG4gICAgZmlsdGVycyA9IHJlcXVpcmUoJy4vZmlsdGVycy5qcycpLFxyXG4gICAgc29ydCAgICA9IHJlcXVpcmUoJy4vc29ydC5qcycpLFxyXG4gICAgcHJlZml4ICA9IHJlcXVpcmUoJy4vdmFyaWFibGVzLmpzJykudXJsX3ByZWZpeCxcclxuXHJcblxyXG4gICAgLy8gdXBkYXRpbmcgb3IgYWRkaW5nIChpZiBpdCBkb2Vzbid0IGV4aXN0cykgYSBwcmltaXRpdmUgdmFsdWUgKGxpa2UgcXVlcnksIHBhZ2UsIGV0YylcclxuICAgIHVwZGF0ZV9wcmltaXRpdmVfaW5fdXJsID0gZnVuY3Rpb24ocGFyYW1ldGVycywgYXJncykge1xyXG4gICAgICAgIHZhciBwYXJ0c191bnNwbGl0ICAgPSBwYXJhbWV0ZXJzLFxyXG4gICAgICAgICAgICBwYXJ0cyAgICAgICAgICAgPSAnJyxcclxuICAgICAgICAgICAgb2xkX29uZV9leGlzdHMgID0gZmFsc2UsXHJcbiAgICAgICAgICAgIHR5cGUgICAgICAgICAgICA9ICcnLFxyXG4gICAgICAgICAgICBuZXdfdmFsdWUgICAgICAgPSAnJyxcclxuICAgICAgICAgICAgbmV3X3BhcmFtZW50ZXJzID0gJyc7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaSA9IDAsIGxlbjEgPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjE7IGkrKykge1xyXG4gICAgICAgICAgICBwYXJ0cyAgICAgPSBwYXJ0c191bnNwbGl0LnNwbGl0KCcmJyk7XHJcbiAgICAgICAgICAgIHR5cGUgICAgICA9IGFyZ3NbaV0udHlwZTtcclxuICAgICAgICAgICAgbmV3X3ZhbHVlID0gYXJnc1tpXS52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGZvcih2YXIgaiA9IDAsIGxlbjIgPSBwYXJ0cy5sZW5ndGg7IGogPCBsZW4yOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmKHBhcnRzW2pdLmluZGV4T2YocHJlZml4ICsgdHlwZSkgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG5ld192YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0c1tqXSA9IHBhcnRzW2pdLnNwbGl0KCc9JylbMF0gKyAnPScgKyBuZXdfdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFydHNbal0gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9sZF9vbmVfZXhpc3RzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoIW9sZF9vbmVfZXhpc3RzKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdfcGFyYW1lbnRlcnMgPSBwYXJ0c191bnNwbGl0O1xyXG4gICAgICAgICAgICAgICAgaWYobmV3X3ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3X3BhcmFtZW50ZXJzICs9IChwYXJ0c191bnNwbGl0ICE9PSAnJykgPyAnJicgOiAnJztcclxuICAgICAgICAgICAgICAgICAgICBuZXdfcGFyYW1lbnRlcnMgKz0gcHJlZml4ICsgdHlwZSArICc9JyArIG5ld192YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG5ld19wYXJhbWVudGVycyA9IHBhcnRzLmpvaW4oJyYnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcGFydHNfdW5zcGxpdCA9IG5ld19wYXJhbWVudGVycztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXdfcGFyYW1lbnRlcnM7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBtYXBwaW5nX3VybCA9IGZ1bmN0aW9uKGFyZ3MpIHtcclxuICAgICAgICB2YXIgdXJsICAgPSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtOiAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgcGFnZTogICAgICAgJycsXHJcbiAgICAgICAgICAgICAgICBmaWx0ZXJfdXJsOiAnJyxcclxuICAgICAgICAgICAgICAgIHF1ZXJ5OiAgICAgICcnLFxyXG4gICAgICAgICAgICAgICAgc29ydDogICAgICAgbnVsbFxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgdGVtcCAgPSAnJyxcclxuXHJcbiAgICAgICAgICAgIHBhcnRzID0gYXJncyA/IGFyZ3Muc3BsaXQoJyYnKSA6IFtdO1xyXG5cclxuXHJcbiAgICAgICAgZm9yKHZhciBpID0gMCwgbGVuID0gcGFydHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgaWYocGFydHNbaV0uaW5kZXhPZihwcmVmaXggKyAnaXRlbScpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHVybC5pdGVtID0gcGFydHNbaV0ucmVwbGFjZShwcmVmaXggKyAnaXRlbT0nLCAnJyk7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihwYXJ0c1tpXS5pbmRleE9mKHByZWZpeCArICdwYWdlJykgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgdXJsLnBhZ2UgPSBwYXJ0c1tpXS5yZXBsYWNlKHByZWZpeCArICdwYWdlPScsICcnKTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHdlIGRvbid0IHVzZSBwcmVmaXggaW4gdGhpcyBjb25kaXRpb24gYmVjYXVzZSB3ZSBjYW4gaGF2ZSBkb29sbGktZmllbGRfZmlsdGVycywgZG9vbGxpLW51bWVyaWNfZmlsdGVycywgZXRjIE9SIGRvb2xsaS1xdWVyeVxyXG4gICAgICAgICAgICBpZihwYXJ0c1tpXS5pbmRleE9mKCdmaWx0ZXJzPScpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIGlmKHVybC5maWx0ZXJfdXJsID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHVybC5maWx0ZXJfdXJsICs9IHBhcnRzW2ldLnJlcGxhY2UocHJlZml4LCAnJyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHVybC5maWx0ZXJfdXJsICs9ICcmJyArIHBhcnRzW2ldLnJlcGxhY2UocHJlZml4LCAnJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gcXVlcnlcclxuICAgICAgICAgICAgaWYocGFydHNbaV0uaW5kZXhPZihwcmVmaXggKyAncXVlcnk9JykgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgdXJsLnF1ZXJ5ID0gcGFydHNbaV0ucmVwbGFjZShwcmVmaXggKyAncXVlcnk9JywgJycpO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHNvcnRcclxuICAgICAgICAgICAgaWYocGFydHNbaV0uaW5kZXhPZihwcmVmaXggKyAnc29ydCcpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHVybC5zb3J0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSB1cmwuc29ydCB8fCBbXTtcclxuICAgICAgICAgICAgICAgIHRlbXAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSBwYXJ0c1tpXS5zcGxpdCgnPScpO1xyXG4gICAgICAgICAgICAgICAgdXJsLnNvcnRbdGVtcFswXS5yZXBsYWNlKHByZWZpeCwgJycpXSA9IHRlbXBbMV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB1cmw7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBnZXRfbGluayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB1cmwgICAgID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zcGxpdCgnPycpLFxyXG4gICAgICAgICAgICBwYXJ0cyAgID0gbWFwcGluZ191cmwodXJsWzFdKSxcclxuICAgICAgICAgICAgb3B0aW9ucyA9ICcnO1xyXG5cclxuICAgICAgICBpZihwYXJ0cy5pdGVtKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBwYXJ0cy5pdGVtO1xyXG4gICAgICAgICAgICBsb2FkaW5nLmxvYWRfaXRlbShvcHRpb25zKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZih1cmwubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogICAgICAgcGFydHMucGFnZSxcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJfdXJsOiBwYXJ0cy5maWx0ZXJfdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiAgICAgIHBhcnRzLnF1ZXJ5XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHBhcnRzLnNvcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNvcnQgPScmc29ydF9ieT0nICsgcGFydHMuc29ydC5zb3J0X2J5ICsgJyZzb3J0X2ZpZWxkX2lkPScgKyBwYXJ0cy5zb3J0LnNvcnRfZmllbGRfaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgc29ydC5pbnRlcnByZXRlX3VybChwYXJ0cy5zb3J0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmaWx0ZXJzLmludGVycHJldGVfdXJsKHBhcnRzLmZpbHRlcl91cmwsIHBhcnRzLnF1ZXJ5KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gbWFpbiBpdGVtcyBsb2FkIHdpbGwgaGF2ZSBvcHRpb25zID0gJydcclxuICAgICAgICAgICAgbG9hZGluZy5sb2FkX2l0ZW1zKG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG5cclxuICAgIHNldF9saW5rID0gZnVuY3Rpb24oYXJncykge1xyXG4gICAgICAgIHZhciB0eXBlICAgICAgID0gYXJncy50eXBlLFxyXG4gICAgICAgICAgICB2YWx1ZSAgICAgID0gYXJncy52YWx1ZSxcclxuICAgICAgICAgICAgYmFzZSAgICAgICA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnPycpWzBdLFxyXG4gICAgICAgICAgICBwYXJhbWV0ZXJzID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5yZXBsYWNlKCc/JywgJycpLFxyXG4gICAgICAgICAgICBsaW5rICAgICAgID0gYmFzZSxcclxuXHJcbiAgICAgICAgICAgIHRtcCAgICAgICAgPSBudWxsO1xyXG5cclxuXHJcbiAgICAgICAgaWYodHlwZSA9PT0gJ2ZpbHRlcnMnKSB7XHJcbiAgICAgICAgICAgIGxpbmsgKz0gJz8nICsgYXJncy52YWx1ZTtcclxuICAgICAgICB9IGVsc2UgaWYodHlwZSA9PT0gJ3F1ZXJ5Jykge1xyXG4gICAgICAgICAgICBsaW5rICs9ICc/JyArIHVwZGF0ZV9wcmltaXRpdmVfaW5fdXJsKHBhcmFtZXRlcnMsIFt7dHlwZTogdHlwZSwgdmFsdWU6IHZhbHVlfV0pO1xyXG4gICAgICAgIH0gZWxzZSBpZih0eXBlID09PSAnc29ydCcpIHtcclxuICAgICAgICAgICAgbGluayArPSAnPycgKyB1cGRhdGVfcHJpbWl0aXZlX2luX3VybChwYXJhbWV0ZXJzLCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0eXBlOiAnc29ydF9ieScsICAgICAgIHZhbHVlOiBhcmdzLnNvcnRfYnl9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dHlwZTogJ3NvcnRfZmllbGRfaWQnLCB2YWx1ZTogYXJncy5zb3J0X2ZpZWxkX2lkfVxyXG4gICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmKHZhbHVlICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgbGluayA9ICc/JyArIHByZWZpeCArIHR5cGUgKyAnPScgKyB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaW4gY2FzZSB3ZSBkb24ndCBoYXZlIGFueSBwYXJhbWV0ZXJzIGFmdGVyICc/J1xyXG4gICAgICAgIGlmKGxpbmsgPT09IGJhc2UgKyAnPycpIHtcclxuICAgICAgICAgICAgbGluayA9IGJhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgJycsIGxpbmspO1xyXG4gICAgICAgIGdldF9saW5rKCk7XHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGluaXQ6ICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICBnZXRfbGluaygpO1xyXG5cclxuICAgICAgICAvLyBGb3IgYmFjayBidXR0b25cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGdldF9saW5rKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldF9saW5rOiBzZXRfbGlua1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgLyoqXHJcbiAgICAqIEdldHRpbmcgdGhlIG9mZnNldCBvZiBhIERPTSBlbGVtZW50XHJcbiAgICAgKlxyXG4gICAgICogIyMjIEV4YW1wbGVzOlxyXG4gICAgICpcclxuICAgICAqICAgICB1dGlscy5vZmZzZXQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm15X2VsZW1lbnQnKSk7XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRvbSBlbGVtZW50IChub3QganF1ZXJ5IGVsZW1lbnQpXHJcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IGEgdG9wIC8gbGVmdCBvYmplY3RcclxuICAgICAqL1xyXG4gICAgb2Zmc2V0OiBmdW5jdGlvbihvYmopIHtcclxuICAgICAgICB2YXIgdG9wICA9IDAsXHJcbiAgICAgICAgICAgIGxlZnQgPSAwO1xyXG5cclxuICAgICAgICBpZihvYmoub2Zmc2V0UGFyZW50KSB7XHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIHRvcCAgKz0gb2JqLm9mZnNldFRvcDtcclxuICAgICAgICAgICAgICAgIGxlZnQgKz0gb2JqLm9mZnNldExlZnQ7XHJcbiAgICAgICAgICAgIH0gd2hpbGUgKG9iaiA9IG9iai5vZmZzZXRQYXJlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geyB0b3A6IHRvcCwgbGVmdDogbGVmdCB9O1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIEFkZGluZyBkeW5hbWljYWxseSBhIG5ldyBleHRlcm5hbCBzdHlsZSBpbnRvIHRoZSBodG1sXHJcbiAgICAgKlxyXG4gICAgICogIyMjIEV4YW1wbGVzOlxyXG4gICAgICpcclxuICAgICAqICAgICB1dGlscy5leHRyYV9zdHlsZSgnaHR0cDovL25ldGRuYS5ib290c3RyYXBjZG4uY29tL2ZvbnQtYXdlc29tZS80LjIuMC9jc3MvZm9udC1hd2Vzb21lLm1pbi5jc3MnKTtcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGhlIGFjdHVhbCB1cmwgKGxvY2FsIG9yIGh0dHApXHJcbiAgICAgKi9cclxuICAgIGV4dHJhX3N0eWxlOiBmdW5jdGlvbih1cmwpIHtcclxuICAgICAgICB2YXIgbGlua19jc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcclxuXHJcbiAgICAgICAgbGlua19jc3Muc2V0QXR0cmlidXRlKFwicmVsXCIsIFwic3R5bGVzaGVldFwiKTtcclxuICAgICAgICBsaW5rX2Nzcy5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIHVybCk7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmFwcGVuZENoaWxkKGxpbmtfY3NzKTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBMb29waW5nIHRocm91Z2ggRE9NIE5vZGVMaXN0XHJcbiAgICAgKlxyXG4gICAgICogIyMjIEV4YW1wbGVzOlxyXG4gICAgICpcclxuICAgICAqICB1dGlscy5mb3JFYWNoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJyksIGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7IGNvbnNvbGUubG9nKGluZGV4LCBlbGVtZW50KTsgfSk7XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtBcnJheSwgRnVuY3Rpb24sIFNjb3BlfVxyXG4gICAgICovXHJcbiAgICBmb3JFYWNoOiBmdW5jdGlvbiAoYXJyYXksIGNhbGxiYWNrLCBzY29wZSkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKHNjb3BlLCBpLCBhcnJheVtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIEFKQVhcclxuICAgICAqXHJcbiAgICAgKiAjIyMgRXhhbXBsZXM6XHJcbiAgICAgKlxyXG4gICAgICogICAgICB1dGlscy5hamF4LmdldCh7XHJcbiAgICAgKiAgICAgICAgICB1cmw6ICAgICAnL3Rlc3QucGhwJyxcclxuICAgICAqICAgICAgICAgIGRhdGE6ICAgIHtmb286ICdiYXInfSxcclxuICAgICAqICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCkgeyAvLyB3aGF0IHRvIGRvIG9uIHN1Y2Nlc3M7IH0sXHJcbiAgICAgKiAgICAgICAgICBlcnJvcjogICBmdW5jdGlvbigpIHsgLy8gd2hhdCB0byBkbyBvbiBlcnJvcjsgfVxyXG4gICAgICogICAgICB9KTtcclxuICAgICAqL1xyXG4gICAgYWpheDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGh0dHBfcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCksXHJcbiAgICAgICAgICAgIGdldF9mbiAgID0gbnVsbCxcclxuICAgICAgICAgICAgcG9zdF9mbiAgPSBudWxsLFxyXG4gICAgICAgICAgICBzZW5kX2ZuICA9IG51bGw7XHJcblxyXG4gICAgICAgIHNlbmRfZm4gPSBmdW5jdGlvbih1cmwsIGRhdGEsIG1ldGhvZCwgc3VjY2Vzc19mbiwgZXJyb3JfZm4sIHN5bmMpIHtcclxuICAgICAgICAgICAgdmFyIHggPSBodHRwX3JlcTtcclxuICAgICAgICAgICAgeC5vcGVuKG1ldGhvZCwgdXJsLCBzeW5jKTtcclxuICAgICAgICAgICAgeC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICh4LnJlYWR5U3RhdGUgPT0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHguc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc19mbih4LnJlc3BvbnNlVGV4dClcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcl9mbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYobWV0aG9kID09PSAnUE9TVCcpIHtcclxuICAgICAgICAgICAgICAgIHguc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHguc2VuZChkYXRhKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBnZXRfZm4gPSBmdW5jdGlvbihvYmopIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiBvYmouZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgcXVlcnkucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChvYmouZGF0YVtrZXldKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgIHVybCAgICAgICAgICAgICAgZGF0YSAgbWV0aG9kICAgIHN1Y2Nlc3NfZm4gICAgIGVycm9yX2ZuICAgICAgICBzeW5jXHJcbiAgICAgICAgICAgIHNlbmRfZm4ob2JqLnVybCArICc/JyArIHF1ZXJ5LmpvaW4oJyYnKSwgbnVsbCwgJ0dFVCcsIG9iai5zdWNjZXNzLCBvYmouZXJyb3IsIG9iai5zeW5jKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBwb3N0X2ZuID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVyeSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gb2JqLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHF1ZXJ5LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQob2JqLmRhdGFba2V5XSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vICAgIHVybCAgICAgICAgIGRhdGEgICAgICAgICBtZXRob2QgICAgc3VjY2Vzc19mbiAgICAgZXJyb3JfZm4gICAgICAgIHN5bmNcclxuICAgICAgICAgICAgc2VuZF9mbihvYmoudXJsLCBxdWVyeS5qb2luKCcmJyksICdQT1NUJywgb2JqLnN1Y2Nlc3MsIG9iai5lcnJvciwgb2JqLnN5bmMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB7Z2V0OiBnZXRfZm4sIHBvc3Q6IHBvc3RfZm59O1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIHVybGVuY29kZSBlcXVpdmFsZW50IGZyb20gUEhQXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSAtIHN0cmluZyB0byBiZSBlbmNvZGVkXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IC0gdGhlIGVuY29kZWQgc3RyaW5nXHJcbiAgICAgKi9cclxuICAgIHVybGVuY29kZTogZnVuY3Rpb24oc3RyaW5nKSB7XHJcbiAgICAgICAgc3RyaW5nID0gKHN0cmluZyArICcnKS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICByZXR1cm4gZW5jb2RlVVJJKHN0cmluZylcclxuICAgICAgICAgICAgLnJlcGxhY2UoLyEvZywgICAnJTIxJylcclxuICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgICAnJTI3JylcclxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcKC9nLCAgJyUyOCcpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXCkvZywgICclMjknKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvXFwqL2csICAnJTJBJylcclxuICAgICAgICAgICAgLnJlcGxhY2UoLyUyMC9nLCAnKycpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIHVybGRlY29kZSBlcXVpdmFsZW50IGZyb20gUEhQXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSAtIHN0cmluZyB0byBiZSBkZWNvZGVkXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IC0gdGhlIGRlY29kZWQgc3RyaW5nXHJcbiAgICAgKi9cclxuICAgIHVybGRlY29kZTogZnVuY3Rpb24oc3RyaW5nKSB7XHJcbiAgICAgICAgc3RyaW5nID0gKHN0cmluZyArICcnKS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICByZXR1cm4gZGVjb2RlVVJJKHN0cmluZylcclxuICAgICAgICAgICAgLnJlcGxhY2UoLyUyMS9nLCAgICchJylcclxuICAgICAgICAgICAgLnJlcGxhY2UoLyUyNy9nLCAgICdcXCcnKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvJTI4L2csICAnKCcpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC8lMjkvZywgICcpJylcclxuICAgICAgICAgICAgLnJlcGxhY2UoLyUyQS9nLCAgJyonKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvXFwrL2csICcgJyk7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICogQ2hlY2tpbmcgaWYgdGhlIGVsZW1lbnQgaXMgY29udGFpbmVkIGluc2lkZSBhIHBhcmVudCB3aXRoIGEgY2VydGFpbiBjbGFzc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSAtIGRvbSBlbGVtZW50IChub3QgalF1ZXJ5KVxyXG4gICAgICAgICAgICAgIHtTdHJpbmd9IC0gdGhlIG5hbWUgb2YgdGhlIGNsYXNzIHdlIGxvb2sgZm9yIGluIHRoZSBwYXJlbnRzXHJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSAtIHRydWUgaWYgd2UgZmluZCBpdCwgZmFsc2Ugb3RoZXJ3aXNlXHJcbiAgICAgKi9cclxuICAgIGNsb3Nlc3RfcGFyZW50OiBmdW5jdGlvbihlbGVtZW50LCBwYXJlbnRfbmFtZV9jbGFzcykge1xyXG4gICAgICAgIHZhciBlbCAgICA9IGVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHdoaWxlKGVsLnBhcmVudE5vZGUpIHtcclxuICAgICAgICAgICAgaWYoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmVudF9uYW1lX2NsYXNzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWwgPSBlbC5wYXJlbnROb2RlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHVybF9wcmVmaXg6ICAgICAgICAgICdkb29sbGktJyxcclxuXHJcbiAgICB3aW5kb3dfd2lkdGg6ICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsXHJcbiAgICB3aW5kb3dfaGVpZ2h0OiAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LFxyXG4gICAgaW1hZ2Vfc2hvd19zaXplOiAgICAgJz9maXQ9bWF4Jnc9NDUwJyxcclxuXHJcbiAgICB3cmFwcGVyOiAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZG9vbGxpLXdyYXBwZXInKSxcclxuICAgIGNvbnRhaW5lcjogICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkb29sbGktZGF0YWJhc2UtY29udGFpbmVyJyksXHJcblxyXG4gICAgZmlsdGVyc193cmFwcGVyOiAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRvb2xsaS1maWx0ZXJzLXdyYXBwZXInKSxcclxuICAgIGZpbHRlcnM6ICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kb29sbGktZmlsdGVycycpLFxyXG4gICAgZmlsdGVyX2l0ZW1fY291bnQ6ICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRvb2xsaS1maWx0ZXJzIC5pdGVtX2NvdW50JyksXHJcbiAgICBhY3RpdmVfZmlsdGVyczogICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZG9vbGxpLWFjdGl2ZS1maWx0ZXJzJyksXHJcbiAgICBxdWVyeV9pbnB1dF93cmFwcGVyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZG9vbGxpLXNlYXJjaC1mb3JtJyksXHJcbiAgICBxdWVyeV9pbnB1dDogICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZG9vbGxpLXNlYXJjaC1mb3JtIGlucHV0JyksXHJcblxyXG4gICAgc29ydF9idXR0b246ICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRvb2xsaS1zb3J0JyksXHJcbiAgICBzb3J0X2J1dHRvbl9uYW1lOiAgICAnZG9vbGxpLXNvcnQnLFxyXG4gICAgc29ydF9hY3RpdmU6ICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRvb2xsaS1zb3J0IHNwYW4nKSxcclxuICAgIHNvcnRfZHJvcGRvd246ICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kb29sbGktc29ydC1kcm9wZG93bicpLFxyXG4gICAgc29ydF9kcm9wZG93bl9uYW1lOiAgJ2Rvb2xsaS1zb3J0LWRyb3Bkb3duJyxcclxuXHJcbiAgICBwYWdlcjogICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZG9vbGxpLXBhZ2VyLXdyYXBwZXInKVxyXG59OyIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG5cclxudmFyIHV0aWxzICAgICAgID0gcmVxdWlyZSgnLi91dGlscy5qcycpLFxyXG4gICAgRE9NICAgICAgICAgPSByZXF1aXJlKCcuL3ZhcmlhYmxlcy5qcycpLFxyXG4gICAgdGVtcGxhdGVzICAgPSByZXF1aXJlKCcuL3RlbXBsYXRlcy5qcycpWydKU1QnXSxcclxuXHJcblxyXG5cclxuICAgIGRhdGFfZmllbGRzID0gW10sXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBJdGVtIFZpZXdcclxuICAgICAqXHJcbiAgICAgKiBUYWtlcyB0aGUgcmF3IGRhdGEgb2YgYW4gaXRlbSBhbmQgaW5zZXJ0cyBpdCBpbnRvIHRoZSB0ZW1wbGF0ZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbVxyXG4gICAgICogICAgICBpdGVtICAgICAge0pTT059ICAgIC0gdGhlIGl0ZW0gZnJvbSB0aGUgZGF0YS5pdGVtcyBhcnJheVxyXG4gICAgICogICAgICB2aWV3X3R5cGUge1N0cmluZ30gIC0gdGhlIHR5cGUgb2YgdGhlIGxheW91dCAoJ2dyaWQnIHwgJ2xpc3QnKVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gICAgICAgIHtTdHJpbmd9ICAtIHRoZSB0ZW1wbGF0ZSBmaWVsZCBvdXRcclxuICAgICAqL1xyXG4gICAgaXRlbV92aWV3ID0gZnVuY3Rpb24oaXRlbSwgdmlld190eXBlKSB7XHJcbiAgICAgICAgdmFyIGFuX2l0ZW0gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKHZhciBpID0gMCwgbGVuID0gZGF0YV9maWVsZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHsgLy8gZ29pbmcgdGhyb3VnaCBhbGwgdGhlIGRhdGFfZmllbGRzIG9mIGFuIGl0ZW1cclxuICAgICAgICAgICAgYW5faXRlbS5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGRhdGFfZmllbGRzOiAgICBkYXRhX2ZpZWxkc1tpXSxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICAgICAgICAgICBkYXRhX2ZpZWxkc1tpXS5maWVsZF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogICAgICAgICAgIGRhdGFfZmllbGRzW2ldLnN1YnR5cGUudG9Mb3dlckNhc2UoKSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiAgICAgICAgICBpdGVtLmZpZWxkX3ZhbHVlc1tkYXRhX2ZpZWxkc1tpXS5maWVsZF9pZF1bMF0sXHJcbiAgICAgICAgICAgICAgICBjb250ZW50X3ZpZXc6ICAgZGF0YV9maWVsZHNbaV0uY29udGVudF92aWV3LFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheV9sYWJlbDogIGRhdGFfZmllbGRzW2ldLmRpc3BsYXlfbGFiZWxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih2aWV3X3R5cGUgPT09ICdncmlkJykge1xyXG4gICAgICAgICAgICByZXR1cm4gKHRlbXBsYXRlc1snaXRlbV9pbl9saXN0J10pKHtcclxuICAgICAgICAgICAgICAgIGxheW91dDogICAgICAgICAgYWpheF92YXJzLmxheW91dCxcclxuICAgICAgICAgICAgICAgIGZpZWxkczogICAgICAgICAgYW5faXRlbSxcclxuICAgICAgICAgICAgICAgIGlkOiAgICAgICAgICAgICAgaXRlbS5jb250ZW50X2l0ZW1faWQsXHJcbiAgICAgICAgICAgICAgICBpbWFnZV9zaG93X3NpemU6IERPTS5pbWFnZV9zaG93X3NpemVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuICh0ZW1wbGF0ZXNbJ2l0ZW1fdmlldyddKSh7XHJcbiAgICAgICAgICAgICAgICBmaWVsZHM6ICAgICAgICAgIGFuX2l0ZW0sXHJcbiAgICAgICAgICAgICAgICBpZDogICAgICAgICAgICAgIGl0ZW0uY29udGVudF9pdGVtX2lkLFxyXG4gICAgICAgICAgICAgICAgaW1hZ2Vfc2hvd19zaXplOiBET00uaW1hZ2Vfc2hvd19zaXplXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgLyoqXHJcbiAgICAqIEhhbmRsZXMgdGhlIHJlc3BvbnNlIGZyb20gdGhlIGFqYXggZnVuY3Rpb25cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW1cclxuICAgICAqICAgICAgZGF0YSB7SlNPTn0gLSB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgc2VydmVyXHJcbiAgICAgKiAgICAgIHR5cGVfb2ZfcmVzcG9uc2Uge1N0cmluZ30gLSBkaWZmZXJlbnRpYXRlIGJldHdlZW4gc2luZ2xlIHZpZXcgYW5kIGxpc3Qgdmlld1xyXG4gICAgICovXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKGRhdGEsIHR5cGVfb2ZfcmVzcG9uc2UpIHtcclxuICAgICAgICB2YXIgaXRlbXMgICAgID0gZGF0YS5pdGVtcyA/IGRhdGEuaXRlbXMgOiBudWxsLFxyXG4gICAgICAgICAgICBhbGxfaXRlbXMgPSAnJztcclxuXHJcblxyXG4gICAgICAgIC8vIHNhdmluZyB0aGUgZmllbGRzIGFzIHRoZXknbGwgYmUgdXNlZCBpbiBzaW5nbGUgaXRlbSBhcyB3ZWxsXHJcbiAgICAgICAgZGF0YV9maWVsZHMgPSBkYXRhLmZpZWxkcztcclxuXHJcblxyXG4gICAgICAgIGlmKHR5cGVfb2ZfcmVzcG9uc2UgIT09ICdzaW5nbGUnKSB7XHJcbiAgICAgICAgICAgIC8vIHNob3dpbmcgdGhlIGZpbHRlcnNcclxuICAgICAgICAgICAgRE9NLndyYXBwZXIuY2xhc3NMaXN0LmFkZCgnZG9vbGxpLXNob3dfZmlsdGVycycpO1xyXG5cclxuICAgICAgICAgICAgaWYoYWpheF92YXJzLmxheW91dCA9PT0gJ3RhYmxlJykge1xyXG4gICAgICAgICAgICAgICAgYWxsX2l0ZW1zID0gdGVtcGxhdGVzWydpdGVtc19pbl90YWJsZSddKHtcclxuICAgICAgICAgICAgICAgICAgICBmaWVsZHM6ICAgICAgICAgIGRhdGFfZmllbGRzLFxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAgICAgICAgICAgaXRlbXMsXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2Vfc2hvd19zaXplOiBET00uaW1hZ2Vfc2hvd19zaXplXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGdvaW5nIHRocm91Z2ggYWxsIHRoZSBpdGVtcy5cclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDAsIGxlbiA9IGl0ZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxsX2l0ZW1zICs9IGl0ZW1fdmlldyhpdGVtc1tpXSwgJ2dyaWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gc2hvd2luZyB0aGUgbnVtYmVycyBvZiBpdGVtcyBpbiB0aGUgZmlsdGVyIHNlY3Rpb25cclxuICAgICAgICAgICAgRE9NLmZpbHRlcl9pdGVtX2NvdW50LmlubmVySFRNTCA9IGRhdGEuZmlsdGVyZWRfaXRlbV9jb3VudCArICcgJyArICgoZGF0YS5maWx0ZXJlZF9pdGVtX2NvdW50ID4gMSkgPyAnaXRlbXMnIDogJ2l0ZW0nKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhbGxfaXRlbXMgKz0gaXRlbV92aWV3KGRhdGEsICdsaXN0Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLy8gQWRkaW5nIGV2ZXJ5dGhpbmcgaW4gdGhlIHBhZ2UgKGluIHRoZSBwcm9wZXIgcGxhY2UpO1xyXG4gICAgICAgIERPTS5jb250YWluZXIuaW5uZXJIVE1MID0gYWxsX2l0ZW1zO1xyXG5cclxuICAgICAgICBpZihkYXRhLnBhZ2luZykge1xyXG4gICAgICAgICAgICBET00ucGFnZXIuaW5uZXJIVE1MICs9IHRlbXBsYXRlc1sncGFnaW5hdGlvbiddKHtwYWdpbmc6IGRhdGEucGFnaW5nfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19
