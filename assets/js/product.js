$(function() {
    /*
        Instantiate a variant manager object per product on the page displayed.
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
        Format the Number received so it has two decimals
        return a string
    */
    this.formatPrice = function(price){
        if(Number(price)){
            return Number(price).toFixed(2).toString();
        }else{
            return price;
        }
    }
    /*
        Convert string price to a valid js number
        return equivalent number or 0 if the string is not a number
    */
    this.getNumber = function(price){
        if(Number(price)){
            return Number(price);
        }else{
            return 0;
        }
    }
    /*
        return the index of the option selectName and its value optionValue in this.variant_options:
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
        generate and return the css selector string generated from 
        the product id, and the indexes returned by getOptionIndexes(selectName, optionValue) (see above)
    */
    this.getVariationSelector = function(selectName, optionValue){
        var index = this.getOptionIndexes(selectName, optionValue);
        return "[id=variation-selector-"+this.product_id+"-"+index.option+"-"+index.value+"]";

    }
    /*
        generate and return the html tag id of the variant chip with option selectName and value optionValue
    */
    this.getVariationValueId = function(selectName, optionValue){
        var index = this.getOptionIndexes(selectName, optionValue);
        return "variation-selector-"+this.product_id+"-"+index.option+"-"+index.value;
    }
    /*
        generate and return the html tag id of the variant chips div for option selectName
    */
    this.getVariationOptionId = function(selectName){
        var index = this.getOptionIndexes(selectName, null);
        return "variation-selector-"+this.product_id+"-"+index.option;
    }
    /*
        generate and return the html tag id of the span displaying the value of the option selected
    */
    this.getVariationSelectedId = function(selectName){
        var index = this.getOptionIndexes(selectName, null);
        return "selected-"+index.option+"-"+this.product_id;
    }
    /*
        generate and return the css selector of the span displaying the value of the option selected
    */
    this.getSelectedValue = function(selectName){
        var index = this.getOptionIndexes(selectName, null);
        return "[id=selected-"+ index.option+"-"+this.product_id+"]";
    }
    /*
        get and return the image url for the image id img_id and the image type img_type
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
        Set the image for the selected variant
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
            clonedImg.appendTo( "#variant-selected-image-"+this.product_id);  //Append the new image to the dom
            if(!this.isCollection) clonedImg.imageZoom(); //Enable zoom effect on teh new image if not on collection page
        }else{
            clonedImg.appendTo( "#variant-selected-image-"+this.product_id); //Append the new image to the dom
        }
    }
    /*
        Add image to the carousel element of the page, according to the urls provided
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
        Add videos to the carousel element of the page, according to the urls provided
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
        Empty carousel section of the page
    */
    this.resetCarouselSelection = function () {
        $( "#variant-image-carousel-"+this.product_id ).html('');
    }
    /*
        Update images and videos of teh page according to the provided variant object provided
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
        //empty carousel and add each variant images and to it
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
        Add available videos to the carousel
    */
    this.updateVideos = function(){
        if(this.videos && !this.isCollection){
            this.addVideosToCarousel(this.videos);
        }
    }
    /*
        Update variant available quantity and sku
    */
    this.updateQuantitySku = function(obj_variant) {
        //Hide quantity selector
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
        //Hide sku, set it and show it back
        $('#div-sku-'+this.product_id).hide();
        if (obj_variant.sku) {
            $('#div-sku-'+this.product_id).show();
            $('#variant-sku-'+this.product_id).html(obj_variant.sku);
        }
    }
    this.updatePriceAndAvailability = function(obj_variant) {
        $('#product-price-'+this.product_id).hide();
        $('#pricing-box-'+this.product_id).hide();
        if ( this.getNumber(obj_variant.price) > 0) {
            $('#product-price-'+this.product_id).show();
            $('#pricing-box-'+this.product_id).show();
            $('#product-price-'+this.product_id).html('$' + this.formatPrice(obj_variant.price));
            $('#product-standard-price-'+this.product_id).hide();
            if (typeof obj_variant.compare_price != 'undefined' && obj_variant.price != obj_variant.compare_price && this.getNumber(obj_variant.compare_price) > 0) {
                $('#product-standard-price-'+this.product_id).show();
                if(this.isCollection){
                    $('#product-standard-price-'+this.product_id).html('$'+this.formatPrice(obj_variant.compare_price));
                }else{
                    $('#product-standard-price-'+this.product_id).html('$'+this.formatPrice(obj_variant.compare_price));
                }
            }
            $('#save-pricing-'+this.product_id).hide();
            if (typeof obj_variant.save_price != 'undefined' && this.getNumber(obj_variant.save_price) > 1) {
                $('#save-pricing-'+this.product_id).show();
                $('#save-pricing-'+this.product_id).html('Save up to '+'$'+this.formatPrice(obj_variant.save_price)+' ('+obj_variant.save_percent+'%'+')');
            }
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
    this.updateDescription = function(obj_variant){
        if(obj_variant.description){
            $('#variant-description-'+this.product_id).html(obj_variant.description);
        }else{
            $('#variant-description-'+this.product_id).html('');
        }
    }
    this.getStockDescription = function (obj_variant) {
         return obj_variant.has_stock == '1' ? 'In Stock' :  obj_variant.inventory_shipping_estimate ? obj_variant.inventory_shipping_estimate : 'Out of Stock';
    }
    this.updateChips = function(){
        var _this = this;
        $.each(this.selectsData, function(name, optionArray){
            var selectedValues2 = {};

            $.each(_this.selectsData, function(name2, optionArray2){
                if(name2 != name){
                    if(_this.selectedValues[name2]){
                        selectedValues2[name2] = _this.selectedValues[name2];
                    }
                }
            });

            var filteredVariants = _this.getFilteredVariants(selectedValues2);
            var generatedSelectsData = _this.generateSelectsData(filteredVariants);

            $.each(optionArray, function(index, value){

                if(generatedSelectsData[name].indexOf(value) < 0){
                    if(_this.selectedValues[name] == value){
                        // Selected, not available
                        $(_this.getVariationSelector(name, value)).attr("class", "notavailable-selected");
                        $(_this.getVariationSelector(name, value)).tooltip();
                    }else{
                        //not selected not available
                        $(_this.getVariationSelector(name, value)).attr("class", "notavailable");
                        $(_this.getVariationSelector(name, value)).tooltip();
                    }
                }else{
                    if(_this.selectedValues[name] == value){
                        //Selected, available
                        $(_this.getVariationSelector(name, value)).attr("class", "selected");
                        $(_this.getVariationSelector(name, value)).tooltip("destroy");
                    }else{
                        //not Selected available
                        $(_this.getVariationSelector(name, value)).attr("class", "");
                        $(_this.getVariationSelector(name, value)).tooltip("destroy");
                    }
                }
            });

            //Update option value selected
            $(_this.getSelectedValue(name)).text(_this.selectedValues[name]);
        });

        //hide and show variant div to display proper variant picture
        var filteredVariants = this.getFilteredVariants(this.selectedValues);

        if(filteredVariants.length == 1){
                var quantityInput = "#variant-input-"+this.product_id;
                var quantityInputMobile = "#variant-input-mobile-"+this.product_id;
                // this.resetSelection();
                this.updateImagesAndVideo(filteredVariants[0]);
                this.updateQuantitySku(filteredVariants[0]);
                this.updatePriceAndAvailability(filteredVariants[0]);
                this.updateDescription(filteredVariants[0]);

                if(this.isCollection){
                    $(quantityInput).val(0);
                    $(quantityInputMobile).val(0);
                }else{
                    $(quantityInput).val(1);
                    $(quantityInputMobile).val(1);
                }
            //Disable/Enable button according to variants availability
            if(this.disabled == true){
                this.disabled = false;
                disabled_cart_button--;
                if(disabled_cart_button == 0){
                    this.disableAddToCart(false);
                }
            }
        }else{
            if(this.disabled == false){
                this.disabled = true;
                this.disableAddToCart(true);
                disabled_cart_button++;
            }
        }
    }
    this.disableAddToCart = function(boolean){
        $('button[value=cart]').attr('disabled',boolean);
        $('button[value=registry]').attr('disabled',boolean);
        $('button[value=wishlist]').attr('disabled',boolean);
    }
    this.updateVariants = function(selectName, optionValue){
        if(this.selectedValues[selectName] != optionValue){
            this.selectedValues[selectName] = optionValue;

            var filteredVariants = this.getFilteredVariants(this.selectedValues);

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
    this.generateSelectsData = function(filteredVariants){
        var selects = {};
        $.each( this.selectsData, function(optionName, values){
            selects[optionName] = [];
        });
        $.each( filteredVariants, function(index, variant){
            $.each( selects, function(optionName, values){
                if( values.indexOf(variant[optionName])<0 )
                    values.push(variant[optionName]);
            });
        });

        return selects;
    }
    this.getFilteredVariants = function(selectedValues){
        var filteredVariants = [];
        var _this = this;
        $.each( this.variants, function(index, variant){
            var passfilter = true;
            if( _this.getNumber(variant.price) > 0 && variant.has_stock == '1' ){
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
    this.getATag = function(selectName, optionValue){
        return tag =  $('<a>', {'class': ""}).text(optionValue);
    }
    this.getAColorTag = function(selectName, optionValue, color){
        return tag =  $('<a>', {'class': "", "style":"background-color:"+color});
    }
    this.unslugify = function(input){
        var tmpArray = input.split('_');
        for(var i = 0; i < tmpArray.length; i++){
            if (tmpArray[i].length > 2)
                tmpArray[i] = tmpArray[i].substring(0,1).toUpperCase() + tmpArray[i].substring(1);
        }
        return tmpArray.join(" ");
    }
    this.buildChips = function(variant_options){
        var _this = this;
        $.each(variant_options, function(index, option){
            var selectName = option.name;
            var optionArray = option.values;
            //Color styling
            if( selectName.toLowerCase() == "color"){
                if(_this.isCollection){
                    var div = $('<div>', {"id": _this.getVariationOptionId(selectName), "class": "color-details-collection"});
                }else{
                    var div = $('<div>', {"id": _this.getVariationOptionId(selectName), "class": "color-details"});
                }

                var ul = $('<ul>', {"class": "swatches Color"});
                var span = $('<span>', {"class": "selected-color"}).append(
                                $('<strong>', {}).text(_this.unslugify(selectName) + ":  ")
                            );

            }else{//size (default) styling
                var div = $('<div>', {"id": _this.getVariationOptionId(selectName), "class": "size-details"});
                var ul = $('<ul>', {"class": "swatches-size Size"});
                var span = $('<span>', {"class": "selected-size"}).append(
                                $('<strong>', {}).text(_this.unslugify(selectName) + ":  ")
                            );
            }

            $.each(optionArray, function(index, optionValue){
                ul.append(
                    $('<li>', { "id": _this.getVariationValueId(selectName, optionValue),
                                "class": "",
                                "data-tooltip": "",
                                "data-toggle": "tooltip",
                                "title": _this.outOfStock
                    })
                    .append(
                            _this.getATag(selectName, optionValue)
                    ).click(function(){
                        _this.updateVariants(selectName, optionValue);
                    })
                );
            });

            var span_selected = $('<span>', {"class": "", "id": _this.getVariationSelectedId(selectName)}).text("");

            div.append(span);
            div.append(span_selected);
            div.append(ul);

            if(_this.isCollection){
                $(_this.selector).append(div);
            }else{
                var row = $('<div>', {"class": "row col-md-12"});
                row.append(div);
                $(_this.selector).append(row);
            }
        });

        this.updateChips();
    }
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
    this.init = function(){
        //Options ordering
        this.variant_options = this.orderOptions(this.variant_options);
        //Build selectsData
        var _this = this
        $.each( this.variant_options, function(index, option){
            _this.selectsData[option.name] = [];
            $.each( option.values, function(index, value){
                _this.selectsData[option.name].push(value);
            });
        });

        var selected_variant = this.variants[0];

        $.each(this.variants, function(index,variant){
            if( _this.getNumber(variant.price) > 0 && variant.has_stock == '1' ){
                selected_variant = variant;
                return false;
            }
        });

        //Default selected variant
        $.each(this.selectsData, function(selectName,optionArray){
            _this.selectedValues[selectName] = selected_variant[selectName];
        });

        //Bluilding HTML Select elements
        this.buildChips(this.variant_options);
    }
}
