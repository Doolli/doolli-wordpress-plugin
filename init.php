<?php
    /**
     * Plugin Name: Doolli
     * Plugin URI: https://www.doolli.com
     * Description: This plugin will help you generate shortcodes and embed Doolli Views in your Wordpress Posts and Pages. This plugin requires a <a href="https://www.doolli.com" target="_blank">Doolli account</a> and a <a href="https://www.doolli.com/developer/#/apps" target="blank">Application Key</a> (both are free.) After you have your account, application key, and have activated the plugin, go to the Doolli settings page to save your key and start creating shortcodes!
     * Version: 1.0
     * Author: Doolli
     * Author URI: https://www.doolli.com
     * License: A "Slug" license name e.g. GPL2
     */


    /**
     * GLOBAL Variables which retrieves their value from wordpress database -> option table.
     * $doolli_appkey gets the application key from the database.
     * $doolli_url gets the URL from the database.
     * $doolli_itemcount gets the item count number from the database.
     * $doolli_layout gets the layout from the database.
     * $doolli_dbid gets the database ID from the database.
     * $doolli_itemid gets the item ID from the database.
     * $base_url gets the base URL without db/item ID from the database.
     */
    $doolli_appkey    = get_option('doolli_appkey');
    $doolli_id        = get_option('doolli_id');
    $doolli_itemcount = get_option('doolli_itemcount');
    $doolli_layout    = get_option('doolli_layout');;

    include'inc/admin/admin.php';


    /**
     * [doolli_shortcode creates the shortcode to be used in Wordpress post. This function calls the javascript files which further utilized web-services to display the data]
     * @param  [array] $atts [The user-entered attributes such as item-id,item-count,database-id,layout]
     */
    function doolli_shortcode( $atts ) {
        update_option('doolli_id',        $atts['id'] );
        update_option('doolli_itemcount', $atts['items_per_page'] );
        update_option('doolli_layout',    $atts['layout'] );

        ob_start();
        include'views/main_view.php';
        return ob_get_clean();
    }

    add_shortcode('doolli','doolli_shortcode');

    include'doolli.php';

?>