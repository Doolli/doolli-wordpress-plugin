<?php
    function ajax_handling($nonce, $url) {
        if($nonce && !wp_verify_nonce($_REQUEST['nonce'], $nonce)) { exit('No naughty business please'); }

        if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            return curl_fn($url);
        } else {
            header('Location: ' . $_SERVER['HTTP_REFERER']);    /* If the call was made without AJAX, then we simply send the user back to where they came from */
        }

        die(); /* Always end your scripts with a die() function, to ensure that you get back the proper output. If you don’t include this, you will always get back a -1 string along with the results. */
    };



    /**=====================================================================================================================================
    * Items load
     */

    add_action('wp_ajax_items_load', 'items_load');               /* function will fire if a logged-IN user initiates the action */
    add_action('wp_ajax_nopriv_items_load', 'items_load');        /* function will fire if a logged-OUT user initiates the action */

    function items_load() {
        GLOBAL $doolli_appkey;

        $extra       = $_POST['extra'];
        $ajax_vars   = $_POST['ajax_vars'];


        $filter_url       = '';
        $page             = '';
        $query            = '';
        $sort             = '';
        $doolli_itemcount = 15;

        if(isset($ajax_vars)) {
            if(isset($ajax_vars['db_id']) && $ajax_vars['db_id']) {
                $doolli_db_id = $ajax_vars['db_id'];
            }

            if(isset($ajax_vars['itemcount']) && $ajax_vars['itemcount']) {
                $doolli_itemcount = $ajax_vars['itemcount'];
            }
        }

        if(isset($extra)) {
            if(isset($extra['filter_url']) && $extra['filter_url']) {
                $filter_url  = '&' . $extra['filter_url'];
            }

            if(isset($extra['page']) && $extra['page']) {
                $page = '&page=' . $extra['page'];
            }

            if(isset($extra['query']) && $extra['query']) {
                $query = '&query=' . $extra['query'];
            }

            if(isset($extra['sort']) && $extra['sort']) {
                $sort = $extra['sort'];
            }
        }

        $url         = 'https://api.doolli.com/views/' . $doolli_db_id . '?application_key=' . $doolli_appkey . '&count=' . $doolli_itemcount . $filter_url . $page . $query . $sort;
        $url_filters = 'https://api.doolli.com/view_filters/' . $doolli_db_id . '?application_key=' . $doolli_appkey . $filter_url . $query;


        $result['success']          = true;
        $result['data']             = ajax_handling('items_load_nonce', $url);
        $result['filters']          = ajax_handling('items_load_nonce', $url_filters);

        echo json_encode($result); /* It is an AJAX call so we return <=> echo the json encoded result */
        die();
    }



    /**=====================================================================================================================================
    * Item load
     */

    add_action('wp_ajax_item_view', 'item_view');           /* function will fire if a logged-IN user initiates the action */
    add_action('wp_ajax_nopriv_item_view', 'item_view');    /* function will fire if a logged-OUT user initiates the action */

    function item_view() {
        GLOBAL $doolli_appkey;

        $id    = preg_replace('/[^a-zA-Z0-9]/', '', $_POST['id']); // id should only contians letters and numbers
        $db_id = preg_replace('/[^0-9]/', '', $_POST['db_id']);    // id should only contians numbers

        $url = 'https://api.doolli.com/items/' . $id . '?application_key=' . $doolli_appkey;

        $result['success'] = true;
        $result['data']    = ajax_handling('items_load_nonce', $url);


        // HOTFIX - a second call to get the fields array (with info about the fields)
        $url                      = 'https://api.doolli.com/views/' . $db_id . '?application_key=' . $doolli_appkey . '&count=0';
        $result['data']['fields'] = ajax_handling('items_load_nonce', $url)['fields'];


        echo json_encode($result); /* It is an AJAX call so we return <=> echo the json encoded result */
        die();
    }
?>