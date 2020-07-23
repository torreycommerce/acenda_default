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
	this.isCollection = isCollection; //Boolean telling if we're on a collection page
	this.product_id = this.product.id; //Product id
	this.selector = "[class=variation-selector-"+this.product_id+"]"; //CSS selector for the div element containing the variant chips
	this.selectsData = {}; //Object representing the available variant options (reprensenting the chips): { size: ["S","M","L"], color: ...}
	this.selectedValues = {}; //Object holding the currently selected variant options: { size: "M", color: "blue", ...}
	this.disabled = false; //Boolean representing the state of the add to cart button, either enable or disabled
	this.outOfStock = "Out of stock, please try another combination"; //Tooltip text displayed on on variant chip hover when option not availble
	this.currentImage = ""; //Id of the currently displayed image
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
		//return "[class=variation-selector-"+this.product_id+"-"+index.option+"-"+index.value+"]";
		return $('li.variation-selector-'+this.product_id+"-"+index.option+"-"+index.value);

	}
	this.getVariationSelectBox = function(selectName, optionValue){
		var index = this.getOptionIndexes(selectName, optionValue);
		return $('option.variation-selector-'+this.product_id+"-"+index.option+"-"+index.value);

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
	this.setSelectImage = function(standard_img_url,large_img_url,img_alt) { // 208 + 232
		//console.log('setSelIma')

		if(standard_img_url){
			if(!this.isCollection) {
				//$('#main-product-image').attr('src', standard_img_url).attr('data-image-zoom', large_img_url).attr('alt', img_alt);
			} else {
				$('#variant-selected-image-'+this.product_id+' img').attr('src', standard_img_url);
			}

		}else{
			//console.log('setSelIma: is NOT standard - does this ever happen?')
			$('#variant-selected-image-'+this.product_id+' span.isd .media-object').attr('src', standard_img_url);
		}
	}

	this.showImage = function() {
		img = $('#variant-selected-image-'+this.product_id+' img');
		img.css('visibility','visible');
		img.css('display','block');
	}

	/*
		Updates images and videos of the page according to the provided variant object provided
	*/
	this.updateImagesAndVideo = function(obj_variant) {
		if(typeof obj_variant.images == 'undefined') return;
		var images = [];
		if (obj_variant.images.length > 0 ) { //Look for variant images first, or for product images if product images not available
			images = obj_variant.images;
		} else if (typeof this.product.images !== 'undefined' && this.product.images.length > 0) {
			images = this.product.images;
		}
		//If no images where found
		if(images.length == 0){
			if(!this.isCollection && $.fn.stopVideo) stopVideo();
			this.setSelectImage();
			this.currentImage = "";
		}
		//empties carousel and adds each variant images to it
		var i = 0;
		//
		var vHTML = "";
		var htmlHeroic = "";
		var htmlHeroicNav = "";
		var htmlSilentGal = "";
		//
		for (key in images) {
			var id = images[key].id;
			var standard_img_url = this.getImageUrl(id,'standard');
			var large_img_url = this.getImageUrl(id,'large');
			var retina_img_url = this.getImageUrl(id,'retina');

			if (typeof images[key].alt !== 'undefined')
				var img_alt = images[key].alt;
			else
				var img_alt = '';
			//on first iteration set main image
			if (i == 0){
				if(this.currentImage != id){
					if(!this.isCollection && $.fn.stopVideo) stopVideo();
					this.setSelectImage(standard_img_url,large_img_url,img_alt);
					this.currentImage = id;
				}
			}
			if(!this.isCollection) {
				if (!$('#product-images .variation[data-vid='+obj_variant.id+']').length) {
					vHTML += '<div class="d-none"><div class="acaro"><div class="image-space"><img class="img-fluid isd" src="'+standard_img_url+'" width="450" height="450" alt=""></div></div></div>';
					if ($('.url-1-product').length) {
						htmlHeroic += '<div class="d-none"><div class="acaro"><div class="easyzoom easyzoom--overlay"><div class="image-space"><a target=_blank href="'+retina_img_url+'" tabindex="-1"><img class="img-fluid isd" src="'+standard_img_url+'" width="600" height="600" alt=""></a></div></div></div></div>';
					} else {
						htmlHeroic += '<div class="d-none"><div class="acaro"><div class="image-space"><img class="img-fluid isd" src="'+standard_img_url+'" width="600" height="600" alt=""></div></div></div>';
					}
					if (images.length > 1) {
				        htmlHeroicNav += '<div class="d-none"><div class="acaro"><div class="image-space"><img class="img-fluid isd" src="'+standard_img_url+'" width="600" height="600" alt=""></div></div></div>'
					}
					htmlSilentGal += '<div class="ztrig" id="ztrig-'+obj_variant.id+'-'+i+'" data-size="1500x1500" data-href="'+retina_img_url+'" data-med-size="600x600"><img class="img-fluid isd" src="'+standard_img_url+'" width="600" height="600" alt=""></div>';
				}
			}
			i++;
		}
		//
		if(!this.isCollection) {
			if (!$('#product-images .variation[data-vid='+obj_variant.id+']').length) {
				vHTML = '<div class="active variation" data-vid="'+obj_variant.id+'"><div class="slick slick-heroic slick-heroic-go" id="slick-heroic-'+obj_variant.id+'">' + htmlHeroic + '</div><div class="ss-contain"><div class="slick slick-heroic-nav slick-heroic-nav-go" id="slick-heroic-nav-'+obj_variant.id+'">' + htmlHeroicNav + '</div></div><div class="silent-gal" id="silent-gal-'+obj_variant.id+'" data-pswp-uid="'+obj_variant.id+'"><div class="image-space">' + htmlSilentGal + '</div></div></div>';
				$('#product-images .variations').append(vHTML);
				$('#product-images .variation[data-vid='+obj_variant.id+']').siblings().removeClass('active');

				if ($('.slick-heroic.slick-heroic-go').length) {
					if (typeof productSlick === "function" && slickReady == 1) {
						//console.log('pS call 252')
						productSlick();
					}
				}
			}
		}
		//
		var _this = this;

	}
	/*
		Updates variant available quantity and sku
	*/
	this.updateQuantitySku = function(obj_variant) {
		//Hides quantity selector
		//If the product has a valid price and is available => Set new product quandtity limit according to policy set and display quantity seelctor back
		if ( this.getNumber(obj_variant.price) > 0 && typeof obj_variant.inventory_quantity != 'undefined'
			&& typeof obj_variant.inventory_minimum_quantity != 'undefined'
			&& typeof obj_variant.inventory_policy != 'undefined'
			&& obj_variant.has_stock == '1') {
				$("#variant-input-"+this.product_id).attr('name', 'items['+obj_variant.id+']');
				if(obj_variant.inventory_policy != 'continue'){
					var limit = !obj_variant.inventory_minimum_quantity ? obj_variant.inventory_quantity : obj_variant.inventory_quantity - obj_variant.inventory_minimum_quantity;
					$("#variant-input-"+this.product_id).attr('max', limit);
				}

		}
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
	this.updateChips = function(inorganic){
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
						$(_this.getVariationSelector(name, value)).removeClass('not-avail').removeClass('selected').addClass('disabled not-avail-sel');
						$(_this.getVariationSelectBox(name, value))/*.attr('disabled',true)*/.removeClass('not-avail').removeClass('selected').addClass('disabled not-avail-sel');
						//$(_this.getVariationSelectBox(name, value)).parent().val('');
						$(_this.getVariationSelectBox(name, value)).parent().val(value);
					}else{
						//not selected not available
						$(_this.getVariationSelector(name, value)).removeClass('not-avail-sel').removeClass('selected').addClass('disabled not-avail');
						$(_this.getVariationSelectBox(name, value))/*.attr('disabled',true)*/.removeClass('not-avail-sel').removeClass('selected').addClass('disabled not-avail');
					}
				}else{
					if(_this.selectedValues[name] == value){
						//selected, available
						$(_this.getVariationSelector(name, value)).removeClass('disabled').removeClass('not-avail').removeClass('not-avail-sel').addClass('selected');
						$(_this.getVariationSelectBox(name, value))/*.attr('disabled',false)*/.removeClass('disabled').removeClass('not-avail').removeClass('not-avail-sel').addClass('selected');
						$(_this.getVariationSelectBox(name, value)).parent().val(value);
					}else{
						//not selected available
						$(_this.getVariationSelector(name, value)).removeClass('disabled').removeClass('not-avail').removeClass('not-avail-sel').removeClass('selected');
						$(_this.getVariationSelectBox(name, value))/*.attr('disabled',false)*/.removeClass('disabled').removeClass('not-avail').removeClass('not-avail-sel').removeClass('selected');
					}
				}
			});

			//Updates value selected html span element, with the currently selected value
			$(_this.getSelectedValue(name)).text(_this.selectedValues[name]);
			//
		});

		//Gets the array of variant that match currently selected values : 
		//selectedValues = {color: "blue", "size": "M", material: "leather"}
		//There should only be one variant matching or none if that combinaison is not available
		var filteredVariants = this.getNonFilteredVariants(this.selectedValues);
		//Set variant description element on teh page of the selected variant
		if(filteredVariants.length == 1){
			var desired_id = filteredVariants[0].id;

			var quantityInput = "#variant-input-"+this.product_id; //Gets quatity input css selector
			var extCSS = "#singleProduct";
			if(this.isCollection){
				var extCSS = ".piece-"+this.product_id;
			}
			//
			$(extCSS+' .variation[data-vid='+desired_id+']').siblings().removeClass('active');
			$(extCSS+' .variation[data-vid='+desired_id+']').addClass('active');
			//
			this.updateImagesAndVideo(filteredVariants[0]);
			this.updateQuantitySku(filteredVariants[0]);
			//
			//Reset quantity inputs
			if(this.isCollection){
				$(quantityInput).val(0);
			}else{
				$(quantityInput).val(1);
			}
			//
			if(filteredVariants[0].has_stock == '0' || this.getNumber(filteredVariants[0].price) <= 0) {
				this.disabled = true;
				this.disableAddToCart(true);

			} else {
				if (!$('button[value=cart]').hasClass('virg')) {
					//console.log('NOT too early - 437b')
					this.disabled = false;
					this.disableAddToCart(false);
				} else {
					//console.log('too early - AVERT - 440')
				}
			}
			//
			//
			if ($('#singleProduct').length && $('.url-1-product').length) {
				//console.log('change URL v9: '+filteredVariants[0].id);
				if (inorganic !== 1) {
					//console.log('organic')
					updateQueryStringParam('variant',filteredVariants[0].id);
				} else {
					//console.log('inorganic')
					//$('select.vopt').trigger('change');
				}
			}
		}else{ //If no variant exist for teh currently selected chips
			//Disable the add to cart buttons accordingly
			this.disabled = true;
			this.disableAddToCart(true);
		}
	}
	/*
		Disables or enables add to cart, registry and wishlist buttons
	*/
	this.disableAddToCart = function(boolean){
		//console.log('dATC: id:'+this.product_id+' bool: '+boolean)
		var extCSS = "#singleProduct";
		if(this.isCollection){
			var extCSS = ".piece-"+this.product_id;
		}
		//
		
		$(extCSS+' button[value=cart]').attr('disabled',boolean);
		$(extCSS+' .btn-remove').attr('disabled',boolean);
		$(extCSS+' .btn-add').attr('disabled',boolean);
		$(extCSS+' .quantity-selector').attr('disabled',boolean);
		if ($(extCSS+' .quantity-selector').val() <= $(extCSS+' .quantity-selector').attr('min')) $(extCSS+' .btn-remove').attr('disabled',true);
	}
	/*
		
	*/
	this.updateVariants = function(selectName, optionValue){
		if(this.selectedValues[selectName] != optionValue){
			this.selectedValues[selectName] = optionValue;

			var filteredVariants = this.getNonFilteredVariants(this.selectedValues);
			
			if(filteredVariants.length == 0 ){
				// display the default variant evalable
				var temp = {};
				temp[selectName] = optionValue;
				filteredVariants = this.getFilteredVariants( temp );
				var _this = this;
				//Default selected variant with the new selected value
				if(filteredVariants.length != 0){
					//console.log('inner fV length is not 0')
					$.each(this.selectsData, function(selectName, optionArray){
						_this.selectedValues[selectName] = filteredVariants[0][selectName];
					});
				}
			}
			this.updateChips();
			//
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
		//console.log('gFV, product_id: '+this.product_id)
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
		Returns list of valid variants that only match the given filter:
		selectedValues = {size: "M", color: "blue", ...}
	*/
	this.getNonFilteredVariants = function(selectedValues){
		//console.log('gFV, product_id: '+this.product_id)
		var filteredVariants = [];
		var _this = this;
		$.each( this.variants, function(index, variant){
			var passfilter = true;
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
			if(passfilter) filteredVariants.push(variant);
		});
		return filteredVariants;
	}
	
	/* rerig buildChips */
	this.beChips = function(variant_options){
		//console.log('beChips')
		var _this = this;
		$.each(variant_options, function(index, option){
			var selectName = option.name;
			var optionArray = option.values;
			//
			$.each(optionArray, function(index, optionValue){
				$('html').on('click', '.variation-selector-'+_this.product_id+' *[data-name="'+selectName+'"] *[data-index="'+index+'"]', function() {
					//console.log('detected beChip click')
					_this.updateVariants(selectName, optionValue);
				});
			});
			//
			$(document).on('change', 'select.vopt-'+selectName, function() {
				//console.log('val is: '+$(this).val())
				_this.updateVariants(selectName, $(this).val());
			});
		});
		//
		this.updateChips(1)
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
		if (desire.color) {
			//console.log('desire: '+desire.color);
			$.each(this.variants, function(index,variant){
				//console.log('var col: '+variant.color)
				if( _this.getNumber(variant.price) > 0 && variant.has_stock == '1' && variant.color == desire.color ){
					//console.log('desire this one, select it: '+variant.color);
					selected_variant = variant;
					return false;
				}
			});
			
		} else if (desire.variant) {
		    $.each(this.variants, function(index,variant){
				//console.log('var col: '+variant.color)
				if( variant.id == desire.variant ){
					//console.log('desire this one, select it: '+variant.color);
					selected_variant = variant;
					return false;
				}
			});

		} else {
			$.each(this.variants, function(index,variant){
				if( _this.getNumber(variant.price) > 0 && variant.has_stock == '1' ){
					selected_variant = variant;
					return false;
				}
			});
		}
		//
		//
		//Sets selected values for variant option on page load according to the selected variant selected_variant (see above)
		$.each(this.selectsData, function(selectName,optionArray){
			_this.selectedValues[selectName] = selected_variant[selectName];
		});

		//Builds HTML variant options chips
		this.beChips(this.variant_options);
		//
		//
		//
		if ($('.slick-heroic.slick-heroic-go').length) {
			if (typeof productSlick === "function" && slickReady == 1) {
				//console.log('pS call 801')
				productSlick();
			}
		}
		//
		if ($('.video').length) {
			$('.video').attr("data-video-src", $('.video').attr("data-video-src"));
			IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/video-player.js",function(){
				IncludeJavaScript("https://www.youtube.com/iframe_api",function(){
					//Set stop video event when clicking on a image of the carousel
					$("[data-image-swap]").click(function() {
						stopVideo();
					});
					initVideoPlayer();
				});
			});
		}
	}
}



function prodExtras() {
	var iseVariant;

	$(document).on('keyup','.stock .form-control-eis', function() {
		$(this).removeClass('is-invalid');
	});
	$(document).on('click','.stock .btn-eis', function() {
		iseVariant = $(this).parents('.variation').data('vid');
		var email = $(this).parents('.variation').find('.form-control-eis').val();
		if (!email || !validateEmailAddress(email)) {
			$(this).parents('.variation').find('.form-control-eis').addClass('is-invalid');
			$('body').append('<div class="flash-note affix alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Please enter a valid email address.</div>');
			return false;
		}
		$(this).prop('disabled', true).addClass('wait'); //setting disabled overrides the data-dismiss attribute, use js below.

		var variant_id = iseVariant;
		var email = $(this).parents('.variation').find('.form-control-eis').val();
		submitInStockEmail(email, variant_id);
	});

	function submitInStockEmail(email, variant_id)
	{
		$.post(acendaBaseUrl + '/api/instockemail', {
			email: email,
			variant_id: variant_id
		}).done(function(response) {
			$('.btn-eis').prop('disabled', false).removeClass('wait');
			$('body').append('<div class="flash-note affix alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Thank you for submitting your email. You will be notified when the product variant is in stock.</div>');
		}).fail(function(response) {
			var error = 'undefined error';
			$('.btn-eis').prop('disabled', false).removeClass('wait');
			//console.log(response.responseJSON.error.email[0]);
			if (typeof response.responseJSON.error.email[0] != 'undefined') {
				error = response.responseJSON.error.email[0];
			}
			$('.variation[data-vid='+variant_id+']').find('.form-control-eis').addClass('is-invalid');
			$('body').append('<div class="flash-note affix alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + error + '</div>');
		});
	}

	prodExtras = function() {};
}
prodExtras();