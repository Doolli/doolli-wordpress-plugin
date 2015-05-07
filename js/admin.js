/* This is the script for the admin */
'use strict';


document.addEventListener('DOMContentLoaded', function() {
    var button      = document.querySelector('.js_validate_url'),
        url         = 'https://api.doolli.com/views/',
        message     = 'Is not valid',
        ok          = '',

        update_html = function(valid) {
            var url_message = document.querySelector('.url_message');

            if(valid) {
                url_message.classList.add('ok');
                url_message.classList.remove('error');
            } else {
                url_message.classList.remove('ok');
                url_message.classList.add('error');
            }

            url_message.innerHTML = message;
        };

    if(button) {
        button.addEventListener('click', function(e) {
            ok = false;

            jQuery.ajax({
                url: url + document.querySelector('input[name="doolli_id"]').value,
                type: "GET",
                contentType: "json",
                dataType: "json",
                data: 'application_key=' + admin_ajax.app_key,
                crossDomain: true,
                success: function(data) {
                    if(!data.error) {
                        message = 'URL is valid';
                        ok = true;
                    }
                    update_html(ok);
                },
                error: function(error){
                    message = 'Server couldn\'t be reached';
                    update_html(ok);
                }
            });
        });
    }
});