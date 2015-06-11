(function() {
	'use strict';

    var magicFilter = require('../index.js');

	angular
		.module('js-data')
		.service('magicFilter', function(){ return magicFilter.filter; })
		.service('magicFilterTransform', function(){ return magicFilter.transform; });
}());
