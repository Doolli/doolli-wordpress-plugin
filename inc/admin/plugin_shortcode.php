<?php
    /**
     * [mySubmenuPageFunction adds another HTML Sub-Page to the Plugin Configuration Panel]
     */
    function mySubmenuPageFunction() {
        global $doolli_id;
        global $doolli_itemcount;
        global $doolli_layout;
        settings_errors();
        ob_start();
?>
    <!-- HTML Begins Here -->
    <style>#database-options {border: 1px solid #CCC;padding-left: 10px;margin: 10px 0;}#database-options-note {color: #CCC;} </style>
    <div class="wrap">
        <form action="options.php" method="POST" class="doolli-form">
            <h2>Doolli Shortcodes</h2>

            <?php settings_fields( 'wpdoolligroups' ); ?>
            <p>This plugin renders a Doolli View inside a Wordpress Page or Post. It is recommended that you turn off the sidebar(s), if possible, when using a Doolli Shortcode. <strong>This rendered Doolli View will not include design settings from Doolli or widgets added to the page. It is intended to inherit your Wordpress Theme.</strong><p>
            <p><strong>Note:</strong> this plugin requires that you have an <a href="https://www.doolli.com/developer#/apps" target="_blank">Application Key</a> from <a href="https://www.doolli.com" target="_blank">Doolli.com</a>. Make sure it is <a href="<?php echo get_site_url(); ?>/wp-admin/admin.php?page=settings">added to the plugin</a> before using Doolli shortcodes.</p>
            <h3>How to Use</h3>
            <ol>
                <li><strong>Get the ID of the View you want to show.</strong> You can find the ID of the View you want to show by going to <a href="https://www.doolli.com/launch" target="_blank">My Databases</a> and finding the View under the Database or going to your <a href="https://www.doolli.com/user" target="_blank">profile</a> and selecting a View (only published views show up on your profile.) When you look at the View in your browser, <strong>select and copy the ID from the URL</strong> in the address bar. It will be the digits following www.doolli.com/.<br/><br/><strong>Example:</strong><br/><img src="<?php echo plugins_url('Doolli/img/screenshot.png'); ?>" alt="Database ID Screenshot" id="doolli-plugin-example" width="381" /></li>
                <li><strong>Paste or enter the ID of the view into the View ID input below.</strong> To make sure the View ID is valid and you have access to it, you can click the "Validate" button and check the response.</li>
                <li><strong>Select layout and item options.</strong> You can change the layout when viewing a page of items in the View. The individual item view is the same for all layouts. You can also adjust the items per page (Note: the grid layout is 3 columns wide so you should choose a multiple of 3.)</li>
                <li><strong>Click the "Generate Shortcode" button.</strong></li>
                <li><strong>Select and copy the Doolli shortcode.</strong> The newly generated shortcode will be displayed inside the Generated Shortcode fieldset. Copy everything, including the square brackets. <strong>Example:</strong> [doolli id="3000" layout="grid" items_per_page="12"]</li>
                <li><strong>Add to a Page or Post.</strong> Create a new Wordpress Page or Post and paste the shortcode into the textarea on the editor and publish the Page or Post.</li>
            </ol>
            <h3>Doolli Shortcode Generator</h3>
            <fieldset id="database-options">
                <legend>Shortcode Options</legend>
                <p>
                    <label for="url">View ID</label>
                    <input type="number" class="js_url" name="doolli_id" min="1" value="<?php echo $doolli_id; ?>">
                    <span class="url_message"></span>
                    <button type="button" name="validate" class="button-secondary js_validate_url">Validate</button>
                </p>
                <p>
                    Layout: &nbsp;
                    <input type="radio" name="doolli_layout" value="grid" <?php echo $doolli_layout == "grid" ? 'checked' : ''; ?>> Grid &nbsp;
                    <input type="radio" name="doolli_layout" value="list" <?php echo $doolli_layout == "list" ? 'checked' : ''; ?>> List &nbsp;
                    <input type="radio" name="doolli_layout" value="table" <?php echo $doolli_layout == "table" ? 'checked' : ''; ?>> Table &nbsp;
                </p>
                <p>
                    Items per page : <input id="countinput" type="number" min="0" max="50" step="1"  name="doolli_itemcount" value="<?php echo $doolli_itemcount; ?>" />
                </p>
                <p><input id="genshortcode" type="submit" class="button-primary" value="Generate Shortcode" /></p>
            </fieldset>


            <!-- Display the shortcode -->
            <fieldset id="database-options">
                <legend>Generated Shortcode</legend>
                <p><span id="shortcode">[doolli id="<?php echo $doolli_id . "\"" . " layout=" . "\"" . $doolli_layout . "\"" . " items_per_page=" . "\"" . $doolli_itemcount . "\"" . "]"; ?></span></p>
            </fieldset>
        </form>
    </div><!-- HTML Ends Here -->

<?php
        echo ob_get_clean();
    }
?>