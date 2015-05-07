<?php
    /**
     * [myMenuPageFunction is a function which adds the HTML page which is required to input the application key into the Wordpress Plugin Setting Page. By Default this is the first page which gets displayed when the DOOLLI Plugin option is selected from the side bar]
     */
    function myMenuPageFunction() {
            GLOBAL $doolli_appkey;
            settings_errors();
            ob_start();
?>

    <!-- HTML Begins Here -->
    <div class="wrap">
        <form action="options.php" method="POST">
            <h2> Doolli Application Key</h2>

            <?php settings_fields( 'wpdoolligroup' ); ?>

            <p>Step 1: If you do not have a Doolli account, sign up on <a href="https://doolli.com/?ref=wp_plugin" target="_blank">Doolli.com</a>.</p>
            <p>Step 2: Create an Application and copy your Application Key or retrieve an already existing Application Key from <a href="https://www.doolli.com/developer#/apps" target="_blank">My Applications</a> and paste it in the form below.</p>
            <p>Step 3: <a href="<?php echo get_site_url(); ?>/wp-admin/admin.php?page=shortcode">Generate Shortcodes</a> and add them to Pages or Posts.</p>
            <strong>Application key</strong>: <input type="text" name="doolli_appkey" style="width: 300px;" value= <?php echo ( $doolli_appkey ); ?>></input><br>
            <p><input type="submit" class="button-primary" value="Save Settings"></input> </p>
        </form>
    </div><!-- HTML Ends Here -->

<?php
        echo ob_get_clean();
    }
?>