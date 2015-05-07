<?php
    function script_enqueuer() {
        /**
         * Register style sheet.
         */
        wp_register_style('doolli-styles', plugins_url('Doolli/css/style.css' ));
        wp_enqueue_style('doolli-styles');


        /**
         * Register script files and localize variables.
         */
        $nonce = wp_create_nonce('items_load_nonce');

        // jQuery
        wp_deregister_script('jquery');
        wp_register_script('jquery', '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js', false, '2.1.1', true);
        wp_enqueue_script('jquery');

        // underscore
        wp_deregister_script('underscore');
        wp_register_script('underscore', '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js', false, '1.7.0', true);
        wp_enqueue_script('underscore');

        // script.js
        wp_register_script('app_script', WP_PLUGIN_URL.'/Doolli/js/script.js', array('jquery', 'underscore'), '1.0', true);
        wp_localize_script('app_script', 'ajax_vars', array(
            'ajaxurl'          => admin_url('admin-ajax.php'),
            'items_load_nonce' => $nonce
        ));
        wp_enqueue_script('app_script');
    }

    add_action('wp_enqueue_scripts', 'script_enqueuer');
?>