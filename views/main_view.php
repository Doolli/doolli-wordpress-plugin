<div class="doolli-wrapper" data-id="<?php echo get_option('doolli_id'); ?>" data-itemcount="<?php echo get_option('doolli_itemcount'); ?>" data-layout="<?php echo get_option('doolli_layout'); ?>">
    <!-- Filters -->
    <div class="doolli-filters">
        <button data-target="doolli-findwithin"><i class="fa fa-search"></i>Find within</button>
        <button class="doolli-sort" data-target="doolli-sort-dropdown"><i class="fa fa-sort"></i><span>Sort by</span></button>
        <!-- <button data-target="doolli-sort"><i class="fa fa-share-alt"></i>Share</button>
        <button data-target="doolli-sort"><i class="fa fa-rss"></i>Subscribe</button>
        <button data-target="doolli-sort"><i class="fa fa-star"></i>Favorite</button> -->
        <button class="doolli-close"><i class="fa fa-close"></i></button>

        <div class="doolli-findwithin">
            <form class="doolli-search-form" action="#" method="post">
                <input type="text" placeholder="Find within" />
            </form>

            <div class="doolli-filters-wrapper">
            </div>

            <div class="doolli-active-filters-wrapper">
                <span>Filters:</span>
                <span class="doolli-active-filters"></span>
            </div>

            <p class="item_count">Items are loading...</p>
        </div>

        <div class="doolli-sort-dropdown"><!-- Here the js (/inc/sort.js) is inserting the buttons  --></div>
    </div> <!-- End of Filters -->

    <!-- Main view -->
    <div id="doolli-database-container" class="doolli-row list-group"></div>

    <div class="clearfix"></div>

    <!-- Pagination -->
    <div class="doolli-pager-wrapper"></div>

    <!-- Powered by -->
    <div class="doolli-logo-wrapper">
        <a href="https://doolli.com/developer"><img src="/wp-content/plugins/Doolli/img/poweredByDoolli.png" alt="Powered by Doolli" height="40" style="box-shadow: none; border: 0;" /></a>
    </div>
</div>