<?php
    include 'plugin_settings.php';
    include 'plugin_shortcode.php';


    /**
     * [my_plugin_menu comprises of wordpress pre-built functions to add the previously written HTML Pages to the Wordpress Site]
     */
    function my_plugin_menu() {
        add_menu_page( "wp Doolli", "Doolli", "manage_options", "settings", "myMenuPageFunction", plugins_url( 'Doolli\img\doolli_logo.png' ) );
        add_submenu_page( 'settings', 'Settings', 'Application Key', 'manage_options', 'settings', 'myMenuPageFunction' );
        add_submenu_page( "settings", 'Shortcodes', 'Generate Shortcodes', 'manage_options', "shortcode", 'mySubmenuPageFunction' );
    }
    add_action('admin_menu', 'my_plugin_menu');



    /**
     * [sanitize_appkey sanitizes the incoming application key of any invalid characters and converts it to lower-case]
     * @return [string]      [The sanitized key is returned]
     */
    function sanitize_appkey( $key ) {
        $str = sanitize_key( $key );
        return $str;
    }




    /**
     * [wp_doolli_settings registers all the field values into Wordpress Database]
     */
    function wp_doolli_settings() {
          register_setting( 'wpdoolligroup',   'doolli_appkey', 'sanitize_appkey' );
          register_setting( 'wpdoolligroups',  'doolli_id' );
          register_setting( 'wpdoolligroups',  'doolli_itemcount' );
          register_setting( 'wpdoolligroups',  'doolli_layout' );
    }

    add_action('admin_init', 'wp_doolli_settings');



    /**
     * Add css and js for the admin page
     */
    function admin_add_css_and_js() {
        GLOBAL $doolli_appkey;

        wp_register_style('doolli-admin-styles', plugins_url('Doolli/css/admin.css'));
        wp_enqueue_style('doolli-admin-styles');

        wp_register_script('admin_script', plugins_url('/Doolli/js/admin.js'), array('jquery'), true);
        wp_localize_script('admin_script', 'admin_ajax', array(
            'app_key' => $doolli_appkey
        ));
        wp_enqueue_script('admin_script');
    }

    add_action('admin_init', 'admin_add_css_and_js');
?>