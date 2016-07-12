$(function() {
    /*
        Instantiates a variant manager object per product on the page displayed.
        The product displayed on the page are available in the acenda js object, 
        with other information (see views/product/acenda.html.twig)
    */
    if(acenda.collection){
        $.each(acenda.products, function(index, product){
            new VariantsManager(product, product.img, true).init();
        });
    }else{
        new VariantsManager(acenda.products[0], acenda.products[0].img, false).init();
    }
});

/* 
    Variable used as a semaphore to control when the main add to cart button on collection page is disabled.
    This variable is common to every instances of VariantsManager (one per product on the page).
    It's being used to prevent user from clicking add to cart on collection page if one 
    of the product of the collection has a unavailable variant selected (that cannot be added to the cart)
*/
var disabled_cart_button = 0;
/*
    JS (fake) class to manage variant selection for a product
*/
function VariantsManager (product, img, isCollection) {
    this.product = product; //Product object as stored in elastic search 
    this.variants = this.product.variants; //Array of variants object
    /*
        Array of variant options:
        [ {name: "size", position: 1, values: ["S","M","L"]}, ... ]
    */
    this.variant_options = this.product.variant_options; 
    /*
        Array of variant images's url:
        [ { _variantId: [imageUrl1, imageUrl2, ...], _variantId2: ... ]
    */
    this.arr_uniq_var_img_url = img.arr_uniq_var_img_url; 
    this.defaultImage = img.default_img; //Url to default product image (displayed when no images available)
    this.videos = this.product.videos; //Array of product videos urls
    this.isCollection = isCollection; //Boolean telling if we're on a collection page
    this.product_id = this.product.id; //Product id
    this.selector = "[id=variation-selector-"+this.product_id+"]"; //CSS selector for the div element containing the variant chips
    this.selectsData = {}; //Object representing the available variant options (reprensenting the chips): { size: ["S","M","L"], color: ...}
    this.selectedValues = {}; //Object holding the currently selected variant options: { size: "M", color: "blue", ...}
    this.disabled = false; //Boolean representing the state of the add to cart button, either enable or disabled
    this.outOfStock = "Out of stock, please try another combination"; //Tooltip text displayed on on variant chip hover when option not availble
    this.currentImage = ""; //Id of the currently displayed image
    /*
        Formats the Number received so it has two decimals
        returns a string
    */
    this.formatPrice = function(price){
        if(Number(price)){
            return Number(price).toFixed(2).toString();
        }else{
            return price;
        }
    }
    /*
        Converts string price to a valid js number
        returns equivalent number or 0 if the string is not a number
    */
    this.getNumber = function(price){
        if(Number(price)){
            return Number(price);
        }else{
            return 0;
        }
    }
    /*
        returns the index of the option selectName and its value optionValue in this.variant_options:
        {"option": i, "value": j}
    */
    this.getOptionIndexes = function(selectName, optionValue){
        for(var i=0; i<this.variant_options.length; i++){
            if(this.variant_options[i].name == selectName){
                if(optionValue){
                    for(var j=0; j<this.variant_options[i].values.length; j++){
                        if(this.variant_options[i].values[j] == optionValue){
                            return {"option": i, "value": j};
                        }
                    }
                }else{
                    return {"option": i};
                }
            }
        }
    }
    /*
        generates and returns the css selector string generated from 
        the product id, and the indexes returned by getOptionIndexes(selectName, optionValue) (see above)
    */
    this.getVariationSelector = function(selectName, optionValue){
        var index = this.getOptionIndexes(selectName, optionValue);
        return "[id=variation-selector-"+this.product_id+"-"+index.option+"-"+index.value+"]";

    }
    /*
        generates and returns the html tag id of the variant chip with option selectName and value optionValue
    */
    this.getVariationValueId = function(selectName, optionValue){
        var index = this.getOptionIndexes(selectName, optionValue);
        return "variation-selector-"+this.product_id+"-"+index.option+"-"+index.value;
    }
    /*
        generates and returns the html tag id of the variant chips div for option selectName
    */
    this.getVariationOptionId = function(selectName){
        var index = this.getOptionIndexes(selectName, null);
        return "variation-selector-"+this.product_id+"-"+index.option;
    }
    /*
        generates and returns the html tag id of the span displaying the value of the option selected
    */
    this.getVariationSelectedId = function(selectName){
        var index = this.getOptionIndexes(selectName, null);
        return "selected-"+index.option+"-"+this.product_id;
    }
    /*
        generates and returns the css selector of the span displaying the value of the option selected
    */
    this.getSelectedValue = function(selectName){
        var index = this.getOptionIndexes(selectName, null);
        return "[id=selected-"+ index.option+"-"+this.product_id+"]";
    }
    /*
        gets and returns the image url for the image id img_id and the image type img_type
    */
    this.getImageUrl = function(img_id, img_type) {
        if (typeof this.arr_uniq_var_img_url['_'+img_id][img_type] != 'undefined') {
            return this.arr_uniq_var_img_url['_'+img_id][img_type];
        }
        else {
            return "";
        }
    }
    /*
        Sets the image for the selected variant
    */
    this.setSelectImage = function(standard_img_url,large_img_url,img_alt) {
        var clonedImg = $('#main-product-image-copy').clone(); //Retrieve a copy of the hidden html element of the image
        img = $('#variant-selected-image-'+this.product_id+' img'); // Retrive the currently displayed html image elemtn 
        clonedImg.attr("id", "main-product-image"); //Set the html id of the cloned html element
        img.remove(); //remove the currently displayed image html element from the dom
        if(standard_img_url){
            clonedImg.attr('src', standard_img_url);
            clonedImg.attr('data-image-zoom', large_img_url);
            clonedImg.attr('alt', img_alt);
            clonedImg.appendTo( "#variant-selected-image-"+this.product_id+' span.isd');  //Append the new image to the dom
            if(!this.isCollection) clonedImg.imageZoom(); //Enable zoom effect on teh new image if not on collection page
        }else{
            clonedImg.appendTo( "#variant-selected-image-"+this.product_id)+' span.isd'; //Append the new image to the dom
        }
    }
    /*
        Adds image to the carousel element of the page, according to the urls provided
    */
    this.addImageToCarousel = function(variant_image_id,standard_img_url,large_img_url,img_alt) {
        var clonedDiv = $('#variant-image-thumbnail-copy').clone();
        clonedDiv.attr("id", variant_image_id);
        clonedDiv.appendTo( "#variant-image-carousel-"+this.product_id );
        $('#'+variant_image_id+" img").attr("src", standard_img_url);
        $('#'+variant_image_id+" img").attr('data-image-swap-src', standard_img_url);
        $('#'+variant_image_id+" img").attr('data-image-swap-zoom', large_img_url);
        $('#'+variant_image_id+" img").attr('alt', large_img_url);
        $('#'+variant_image_id+" img").attr('alt', img_alt);
    }
    /*
        Adds videos to the carousel element of the page, according to the urls provided
    */
    this.addVideosToCarousel = function(videos) {
        var _this = this;
        $.each(videos, function(index, video){
            var clonedDiv = $('#variant-video-copy').clone();
            var id = "product-video-"+_this.product_id+"-"+index;
            clonedDiv.attr("id", id);
            clonedDiv.appendTo( "#variant-image-carousel-"+_this.product_id );
            $('#'+id+" div").attr("data-video-src", video);
        });
        //Set stop video event when clicking on a image of the carousel
        $("[data-image-swap]").click(function() {
            stopVideo();
        });
        initVideoPlayer(); //Initialiaze video player on newly set videos
    }
    /*
        Empties carousel section of the page
    */
    this.resetCarouselSelection = function () {
        $( "#variant-image-carousel-"+this.product_id ).html('');
    }
    /*
        Updates images and videos of the page according to the provided variant object provided
    */
    this.updateImagesAndVideo = function(obj_variant) {
        var images = [];
        if (obj_variant.images.length > 0 ) { //Look for variant images first, or for product images if product images not available
            images = obj_variant.images;
        } else if (typeof this.product.images !== 'undefined' && this.product.images.length > 0) {
            images = this.product.images;
        }
        //If no images where found
        if(images.length == 0){
            if(!this.isCollection) stopVideo();
            this.setSelectImage();
            this.currentImage = "";
        }
        //empties carousel and adds each variant images to it
        this.resetCarouselSelection();
        var i = 0;
        for (key in images) {
            var id = images[key].id;
            var standard_img_url = this.getImageUrl(id,'standard');
            var large_img_url = this.getImageUrl(id,'large');

            if (typeof images[key].alt !== 'undefined')
                var img_alt = images[key].alt;
            else
                var img_alt = '';
            //on first iteration set main image
            if (i == 0){
                if(this.currentImage != id){
                    $('#image-carousel-'+this.product_id).hide();
                    $('#variant-selected-image-'+this.product_id+' img').hide();
                    if(!this.isCollection) stopVideo();
                    this.setSelectImage(standard_img_url,large_img_url,img_alt);
                    this.currentImage = id;
                }
            }
            if(!this.isCollection)
                this.addImageToCarousel(obj_variant.id+'-'+images[key].id,standard_img_url,large_img_url,img_alt);
            i++;
        }
        this.updateVideos();
        var _this = this;
        //The first time the page load and the images are set, wait for
        //the main product image to be loaded before showing it with carousel
        $('#variant-selected-image-'+this.product_id+' img').on("load", function() {
            $('#variant-selected-image-'+_this.product_id+' img').show();
            $('#image-carousel-'+_this.product_id).show();
        });
    }
    /*
        Adds available videos to the carousel
    */
    this.updateVideos = function(){
        if(this.videos && !this.isCollection){
            this.addVideosToCarousel(this.videos);
        }
    }
    /*
        Updates variant available quantity and sku
    */
    this.updateQuantitySku = function(obj_variant) {
        //Hides quantity selector
        $('#div-quantity-'+this.product_id).hide();
        $('#div-quantity-mobile-'+this.product_id).hide();
        //If the product has a valid price and is available => Set new product quandtity limit according to policy set and display quantity seelctor back
        if ( this.getNumber(obj_variant.price) > 0 && typeof obj_variant.inventory_quantity != 'undefined'
            && typeof obj_variant.inventory_minimum_quantity != 'undefined'
            && typeof obj_variant.inventory_policy != 'undefined'
            && obj_variant.has_stock == '1') {
                $('#div-quantity-'+this.product_id).show();
                $('#div-quantity-mobile-'+this.product_id).show();
                $("#variant-input-"+this.product_id).attr('name', 'items['+obj_variant.id+']');
                $("#variant-input-mobile-"+this.product_id).attr('name', 'items['+obj_variant.id+']');
                if(obj_variant.inventory_policy != 'continue'){
                    var limit = !obj_variant.inventory_minimum_quantity ? obj_variant.inventory_quantity : obj_variant.inventory_quantity - obj_variant.inventory_minimum_quantity;
                    $("#variant-input-"+this.product_id).attr('data-limit', limit);
                    $("#variant-input-mobile-"+this.product_id).attr('data-limit', limit);
                }

        }
        //Hides sku, sets it and shows it back
        $('#div-sku-'+this.product_id).hide();
        if (obj_variant.sku) {
            $('#div-sku-'+this.product_id).show();
            $('#variant-sku-'+this.product_id).html(obj_variant.sku);
        }
    }
    /*
        Updates price displayed and availability text
    */
    this.updatePriceAndAvailability = function(obj_variant) {
        //Hides fields
        $('#product-price-'+this.product_id).hide();
        $('#pricing-box-'+this.product_id).hide();
        //If variant has a valid price
        if ( this.getNumber(obj_variant.price) > 0) {
            //Show fileds back and set new price
            $('#product-price-'+this.product_id).show();
            $('#pricing-box-'+this.product_id).show();
            $('#product-price-'+this.product_id).html('$' + this.formatPrice(obj_variant.price));
            $('#product-standard-price-'+this.product_id).hide();
            //If variant has a valid compare price
            if (typeof obj_variant.compare_price != 'undefined' && obj_variant.price != obj_variant.compare_price && this.getNumber(obj_variant.compare_price) > 0) {
                $('#product-standard-price-'+this.product_id).show();
                if(this.isCollection){
                    $('#product-standard-price-'+this.product_id).html('$'+this.formatPrice(obj_variant.compare_price));
                }else{
                    $('#product-standard-price-'+this.product_id).html('$'+this.formatPrice(obj_variant.compare_price));
                }
            }
            $('#save-pricing-'+this.product_id).hide();
            //If variant has a valid save price
            if (typeof obj_variant.save_price != 'undefined' && this.getNumber(obj_variant.save_price) > 1) {
                $('#save-pricing-'+this.product_id).show();
                $('#save-pricing-'+this.product_id).html('Save up to '+'$'+this.formatPrice(obj_variant.save_price)+' ('+obj_variant.save_percent+'%'+')');
            }
            //Updates In Stock text
            var stock_text = this.getStockDescription(obj_variant);
            if(this.isCollection){
                $('#stock-text-'+this.product_id).html(stock_text);
            }else{
                if (stock_text == 'In Stock')
                    $('#stock-text-'+this.product_id).html(stock_text);
                else
                    $('#stock-text-'+this.product_id).html(stock_text);
            }
        }
    }
    /*
        Updates variant description
    */
    this.updateDescription = function(obj_variant){
        if(obj_variant.description){
            $('#variant-description-'+this.product_id).html(obj_variant.description);
        }else{
            $('#variant-description-'+this.product_id).html('');
        }
    }
    /*
        Returns In Stock text from has_stock value (true or false) 
        and whether a custom out of stock message has been set 
        (in inventory_shipping_estimate attribute. Doesn't make sense, I know...)
    */
    this.getStockDescription = function (obj_variant) {
         return obj_variant.has_stock == '1' ? 'In Stock' :  obj_variant.inventory_shipping_estimate ? obj_variant.inventory_shipping_estimate : 'Out of Stock';
    }
    /*
        Updates/Set style state as well as page elements such as product images, and product description fields
        Chips can have for different states (style), whether the option value corresponding 
        to the chip is available and whether teh chip is currently selected:
            - selected, not available
            - not selected, not available
            - selected, available
            - not selected available
    */
    this.updateChips = function(){
        //Iterate through the available variant options selectsData = { size: ["S","M","L"], color: ...}
        //In order to style its cheap according to its current state (current chips selecion and variant availabilities)
        var _this = this;
        $.each(this.selectsData, function(name, optionArray){
            //Builds a new object representing the currenlty selected variant options: { size: "M", color: "blue", material: "leather"}
            //but exluding the current option we are currently at in the loop: selectedValues2 = { size: "M", material: "leather"}
            var selectedValues2 = {}; 
            $.each(_this.selectsData, function(name2, optionArray2){
                if(name2 != name){
                    if(_this.selectedValues[name2]){
                        selectedValues2[name2] = _this.selectedValues[name2];
                    }
                }
            });
            //Gets variant that match the selected values in selectedValues2 { size: "M", material: "leather"}
            var filteredVariants = _this.getFilteredVariants(selectedValues2, false);
            var filteredVariantStock = _this.getFilteredVariants(selectedValues2, true);
            //Gets representation of the variant options available in the variant list filteredVariants
            //generatedSelectsData = { size:["M"], color: ["blue", "grey", "black"], material: ["leather"], }
            var generatedSelectsData = _this.generateSelectsData(filteredVariantStock);
            //Iterate throught the value available for the current variant option
            //we are at in the loop: optionArray = ["white", "gree", "blue", "grey", "black"]
            //and style each corresponding html chips element 
            $.each(optionArray, function(index, value){
                //If the option value is not in generatedSelectsData (like "black" is not ["blue", "grey", "black"] for color)
                //This means this option value is not available for considering the other options values currently selected
                if(generatedSelectsData[name].indexOf(value) < 0){
                    //If the option value (chip) is currently selected
                    if(_this.selectedValues[name] == value){
                        //Then the chip is in the state selected, not available
                        $(_this.getVariationSelector(name, value)).attr("class", "notavailable-selected"); //Set chip class corresponding to its current state
                        $(_this.getVariationSelector(name, value)).tooltip(); //Set tooltip to display since the option value corresponding to the chip is not available
                    }else{
                        //not selected not available
                        $(_this.getVariationSelector(name, value)).attr("class", "notavailable");
                        $(_this.getVariationSelector(name, value)).tooltip();
                    }
                }else{
                    if(_this.selectedValues[name] == value){
                        //selected, available
                        $(_this.getVariationSelector(name, value)).attr("class", "selected");
                        $(_this.getVariationSelector(name, value)).tooltip("destroy"); //Remove the tooltip, the option value corresponding to the chip is available 
                    }else{
                        //not selected available
                        $(_this.getVariationSelector(name, value)).attr("class", "");
                        $(_this.getVariationSelector(name, value)).tooltip("destroy");
                    }
                }
            });

            //Updates value selected html span element, with the currently selected value
            $(_this.getSelectedValue(name)).text(_this.selectedValues[name]);
        });

        //Gets the array of variant that match currently selected values : 
        //selectedValues = {color: "blue", "size": "M", material: "leather"}
        //There should only be one variant matching or none if that combinaison is not available
        var filteredVariants = this.getFilteredVariants(this.selectedValues, false);
        //Set variant description element on teh page of the selected variant
        if(filteredVariants.length == 1){
                var quantityInput = "#variant-input-"+this.product_id; //Gets quatity input css selector
                var quantityInputMobile = "#variant-input-mobile-"+this.product_id; //Gets mobile quatity input css selector
                this.updateImagesAndVideo(filteredVariants[0]);
                this.updateQuantitySku(filteredVariants[0]);
                this.updatePriceAndAvailability(filteredVariants[0]);
                this.updateDescription(filteredVariants[0]);
                //Reset quantity inputs
                if(this.isCollection){
                    $(quantityInput).val(0);
                    $(quantityInputMobile).val(0);
                }else{
                    $(quantityInput).val(1);
                    $(quantityInputMobile).val(1);
                }
            if(filteredVariants[0].has_stock == '0') {
                this.disabled = true;
                this.disableAddToCart(true);
                //disabled_cart_button++; //increases semaphore value
            } else if(this.disabled == true){
                this.disabled = false;
                //disabled_cart_button--; //decreases semaphore value (that represent the add to cart button state on colecion page)
                //if(disabled_cart_button == 0){
                this.disableAddToCart(false);
                //}
            }
        }else{ //If no variant exist for teh currently selected chips
            //Disable the add to cart buttons accordingly
            if(this.disabled == false){
                this.disabled = true;
                this.disableAddToCart(true);
               // disabled_cart_button++; //increases semaphore value
            }
        }
    }
    /*
        Disables or enables add to cart, registry and wishlist buttons
    */
    this.disableAddToCart = function(boolean){
        $('button[value=cart]').attr('disabled',boolean);
        $('button.btn-remove').attr('disabled',boolean);
        $('button.btn-add').attr('disabled',boolean);
        $('input.quantity-selector').attr('disabled',boolean);

        //$('button[value=registry]').attr('disabled',boolean);
        //$('button[value=wishlist]').attr('disabled',boolean);
    }
    /*
        
    */
    this.updateVariants = function(selectName, optionValue){
        if(this.selectedValues[selectName] != optionValue){
            this.selectedValues[selectName] = optionValue;

            var filteredVariants = this.getFilteredVariants(this.selectedValues, false);

            if(filteredVariants.length == 0 ){
                // display the default variant evalable
                var temp = {};
                temp[selectName] = optionValue;
                filteredVariants = this.getFilteredVariants( temp );
                var _this = this;
                //Default selected variant with the new selected value
                if(filteredVariants.length != 0){
                    $.each(this.selectsData, function(selectName, optionArray){
                        _this.selectedValues[selectName] = filteredVariants[0][selectName];
                    });
                }
            }
            this.updateChips();
        }
    }
    /*
        Generates and returns select data (object representing the current available variant options) 
        according to the given variants list filteredVariants:
        { size: ["XS", "M", "L"], color: ["blue", "grey"], ...}
    */
    this.generateSelectsData = function(filteredVariants){
        var selects = {};
        //initialize the object with every existing options
        $.each( this.selectsData, function(optionName, values){
            selects[optionName] = [];
        });
        //Fill every option array with availble values in filteredVariants
        $.each( filteredVariants, function(index, variant){
            $.each( selects, function(optionName, values){
                if( values.indexOf(variant[optionName])<0 )
                    values.push(variant[optionName]);
            });
        });

        return selects;
    }
    /*
        Returns list of valid variants (with valid price and has_stock is true) that match the given filter:
        selectedValues = {size: "M", color: "blue", ...}
    */
    this.getFilteredVariants = function(selectedValues, checkStock){
        var filteredVariants = [];
        var _this = this;
        $.each( this.variants, function(index, variant){
            var passfilter = true;
            if( _this.getNumber(variant.price) > 0 && (variant.has_stock == '1' || checkStock == false)){
                $.each( selectedValues, function(selectName, selectValue){
                    if(selectValue != ""){
                        if(variant[selectName]){
                            if(variant[selectName] != selectValue){
                                passfilter = false;
                            }
                        }else{
                            passfilter = false;
                        }
                    }
                });
            }else{
                passfilter = false;
            }
            if(passfilter) filteredVariants.push(variant);
        });
        return filteredVariants;
    }
    /*
        returns html <a> element with option value optionValue set as text
    */
    this.getATag = function(selectName, optionValue){
        return tag =  $('<a>', {'class': "btn btn-neutral"}).text(optionValue);
    }
    /*
        returns html <a> element with style background-color set with given color
    */
    this.getAColorTag = function(selectName, optionValue, color){
        return tag =  $('<a>', {'class': "btn btn-neutral", "style":"background-color:"+color});
    }
    /*
        takes a slug type string and return a good liking one:
        "screen_size" => "Screen size"
    */
    this.unslugify = function(input){
        var tmpArray = input.split('_');
        for(var i = 0; i < tmpArray.length; i++){
            if (tmpArray[i].length > 2)
                tmpArray[i] = tmpArray[i].substring(0,1).toUpperCase() + tmpArray[i].substring(1);
        }
        return tmpArray.join(" ");
    }
    /*
        Builds and appends variant options chips to the dom
    */
    this.buildChips = function(variant_options){
        //Goes through the variant_options array [ {name: "size", position: 1, values: ["S","M","L"]}, ... ]
        //and build the corresponding variant option html elements
        var _this = this;
        $.each(variant_options, function(index, option){
            //Gets the option name (selectName="size") and teh array of option values (optionArray=["S","M","L"])
            var selectName = option.name;
            var optionArray = option.values;
            //Builds html elements according to the style the chips should have (color chips, or if it's a collection page)
            //Color styling
            if( selectName.toLowerCase() == "color"){
                if(_this.isCollection){
                    var div = $('<div>', {"id": _this.getVariationOptionId(selectName), "class": "p selector-details color-details-collection"});
                }else{
                    var div = $('<div>', {"id": _this.getVariationOptionId(selectName), "class": "p selector-details color-details"});
                }

                var ul = $('<ul>', {"class": "list-inline swatches swatches-color"});
                var span = $('<span>', {"class": "selected-color"}).append(
                                $('<strong>', {}).text(_this.unslugify(selectName) + ":  ")
                            );

            }else{//size (default) styling
                var div = $('<div>', {"id": _this.getVariationOptionId(selectName), "class": "p selector-details size-details"});
                var ul = $('<ul>', {"class": "list-inline swatches swatches-size"});
                var span = $('<span>', {"class": "selected-size"}).append(
                                $('<strong>', {}).text(_this.unslugify(selectName) + ":  ")
                            );
            }
            //Builds a chip html elemtn for each available value available for the option, and appends it to its parent element (previously built) 
            $.each(optionArray, function(index, optionValue){
                ul.append(
                    $('<li>', { "id": _this.getVariationValueId(selectName, optionValue),
                                "class": "",
                                "data-tooltip": "",
                                "data-toggle": "tooltip",
                                "data-original-title": _this.outOfStock
                    })
                    .append(
                            _this.getATag(selectName, optionValue)
                    ).click(function(){ //Attaches event handler updateVariants when chip is clicked
                        _this.updateVariants(selectName, optionValue);
                    })
                );
            });
            //Build the span html elemtn where will be displayed the value of the currently selected option
            var span_selected = $('<span>', {"class": "", "id": _this.getVariationSelectedId(selectName)}).text("");
            //Appends built element to their proper parents
            div.append(span);
            div.append(span_selected);
            div.append(ul);
            //Appends built variant option chips to the dom
            if(_this.isCollection){
                $(_this.selector).append(div);
            }else{
                //var row = $('<div>', {"class": "p"});
                //row.append(div);
                //$(_this.selector).append(row);
                $(_this.selector).append(div);
            }
        });
        //Triggers chips updates so they are styled according the displayed variant
        this.updateChips();
    }
    /*
        Takes a variant options array and returns the the same array of options ordered according to their position attribute:
        [ {name: "size", position: 1, values: ["S","M","L"]}, ... ] => ordered array
    */
    this.orderOptions = function(options){
        var ordered_options = [];
        $.each( options, function(index, option){
            var indexToInsert=0;
            for(var i=0; i<ordered_options.length; i++){
                if(ordered_options[i].position<option.position){
                    //next
                    indexToInsert = i+1;
                }else if(ordered_options[i].position>option.position){
                    break;
                }else if(ordered_options[i].position==option.position){
                    indexToInsert = i;
                    break;
                }
            }
            ordered_options.splice(indexToInsert,0,option);
        });

        return ordered_options;
    }
    /*
        Initializes variant manager system:
            - Orders variant option
            - Builds select data
            - Sets selected variant
            - triggers variant options chips building
    */
    this.init = function(){
        //Orders options
        this.variant_options = this.orderOptions(this.variant_options);
        //Builds selectsData (representation of the available variant options): { size: ["S","M","L"], color: ...}
        var _this = this
        $.each( this.variant_options, function(index, option){
            _this.selectsData[option.name] = [];
            $.each( option.values, function(index, value){
                _this.selectsData[option.name].push(value);
            });
        });

        var selected_variant = this.variants[0];
        //Finds the first variant with a valid price and stock avalaible and set it as the variant to display on page load
        $.each(this.variants, function(index,variant){
            if( _this.getNumber(variant.price) > 0 && variant.has_stock == '1' ){
                selected_variant = variant;
                return false;
            }
        });

        //Sets selected values for variant option on page load according to the selected variant selected_variant (see above)
        $.each(this.selectsData, function(selectName,optionArray){
            _this.selectedValues[selectName] = selected_variant[selectName];
        });

        //Bluilds HTML variant options chips
        this.buildChips(this.variant_options);
    }
}
