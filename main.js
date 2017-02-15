(function($, getNamespace){
	function HorizontalGallery(customOptions){
		var defaultOptions = {
			element: null,
			arrowLeftSelector: '.horizontal-scroll-arrow.horizontal-scroll-arrow-left',
			arrowRightSelector: '.horizontal-scroll-arrow.horizontal-scroll-arrow-right',
			listSelector: '.horizontal-scroll-list',
			listElementSelector: 'li',
			arrowAnimationTime: 200,
			arrowVisibleClass: 'horizontal-scroll-arrow-visible'
		};

		var options = $.extend({}, defaultOptions, customOptions);

		if(options.element === null){
			throw new Error('element must be specified');
		}

		var $element = $(options.element);
		var $arrowLeft = $element.find(options.arrowLeftSelector);
		var $arrowRight = $element.find(options.arrowRightSelector);
		var $list = $element.find(options.listSelector);

		var getElementPositionLeft = function($element){
			return $element.position().left + parseFloat($element.css('margin-left'));
		};

		var getListElements = function(){
			return $list.find(options.listElementSelector);
		};

		var getElementByIndex = function(index){
			return getListElements().eq(index);
		};

		var getFurthestVisibleIndexRight = function(){
			var candidateIndex = 0;
			var $candidateElement = getElementByIndex(candidateIndex);
			var foundIndex = false;

			while(candidateIndex < getListElements().length && !foundIndex){

				if(getElementPositionLeft($candidateElement) + $candidateElement.outerWidth() > $list.outerWidth()){
					foundIndex = true;
				}

				candidateIndex++;
				$candidateElement = getElementByIndex(candidateIndex);
			}

			return candidateIndex - 1;
		};

		var getFurthestVisibleIndexLeft = function(){
			var candidateIndex = getListElements().length - 1;
			var $candidateElement = getElementByIndex(candidateIndex);
			var foundIndex = false;

			while(candidateIndex >= 0 && !foundIndex){

				if(getElementPositionLeft($candidateElement) < 0){
					foundIndex = true;
				}

				candidateIndex--;
				$candidateElement = getElementByIndex(candidateIndex);
			}

			return candidateIndex + 1;
		};

		var scrollTo = function(scrollLeft){
			$list.animate({
				scrollLeft: scrollLeft
			}, options.arrowAnimationTime);
		};

		var onArrowLeftClick = function(){
			var index = getFurthestVisibleIndexLeft();
			var wantedScrollLeft = $list.scrollLeft()
				+ getElementPositionLeft(getElementByIndex(index))
				- $list.outerWidth()
				+ getElementByIndex(index).outerWidth()
				+ parseFloat($list.css('padding-right'));
			var usedScrollLeft;

			if(wantedScrollLeft < 0){
				usedScrollLeft = 0;
			}else{
				usedScrollLeft = wantedScrollLeft;
			}

			scrollTo(usedScrollLeft);
		};

		var onArrowRightClick = function(){
			var index = getFurthestVisibleIndexRight();
			var wantedScrollLeft = $list.scrollLeft() 
				+ getElementPositionLeft(getElementByIndex(index))
				- parseFloat($list.css('padding-left'));
			var maxScrollLeft = getMaxScrollLeft();
			var usedScrollLeft;

			if(wantedScrollLeft > maxScrollLeft){
				usedScrollLeft = maxScrollLeft;
			}else{
				usedScrollLeft = wantedScrollLeft;
			}

			scrollTo(usedScrollLeft);
		};

		var getMaxScrollLeft = function(){
			var $firstElement = getElementByIndex(0);
			var $lastElement = getElementByIndex(getListElements().length - 1);//assuming there's at least one element

			if($lastElement.length == 0){
				return 0;
			}else{
				//$element.position().left takes padding and margin into account

				//assuming the direct parent is the list container
				return $lastElement.position().left
					- $firstElement.position().left 
					+ $lastElement.outerWidth(true)
					+ parseFloat($list.css('padding-left'))
					+ parseFloat($list.css('padding-right'))
					- $list.outerWidth();
			}
		};

		var toggleArrows = function(customScrollTarget){
			var scrollTarget = arguments.length >= 1?customScrollTarget:$list.scrollLeft();

			if($list.scrollLeft() <= 0){
				$arrowLeft.removeClass(options.arrowVisibleClass);
			}else{
				$arrowLeft.addClass(options.arrowVisibleClass);
			}

			if($list.scrollLeft() >= getMaxScrollLeft()){
				$arrowRight.removeClass(options.arrowVisibleClass);
			}else{
				$arrowRight.addClass(options.arrowVisibleClass);
			}
		};

		var onListScroll = function(){
			toggleArrows();
		};

		var onWindowResize = function(){
			toggleArrows();
		};

		var destroy = function(){
			// don't destroy HTML because it was created externally but remove anything that this library did
			$arrowLeft.off('click', onArrowLeftClick);
			$arrowRight.off('click', onArrowRightClick);
			$list.off('scroll', onListScroll);
			$(window).off('resize', onWindowResize);
		};

		var recalculate = function(){
			toggleArrows();
		};

		$arrowLeft.on('click', onArrowLeftClick);
		$arrowRight.on('click', onArrowRightClick);
		$list.on('scroll', onListScroll);
		$(window).on('resize', onWindowResize);

		toggleArrows();

		return {
			destroy: destroy,
			recalculate: recalculate
		};
	}

	getNamespace('com.valueblended').HorizontalGallery = HorizontalGallery;
})(jQuery, com.gottocode.getNamespace);