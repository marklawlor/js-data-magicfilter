# js-data-magicfilter

js-data-magicfilter is a replacement filter function for a js-data resource.

## Example usage

```
var magicfilter = require('js-data-magicfilter').filter;

var magicfilterRules = function(){
	// External helper function;
	var activeAccountID = getActiveAccountID();
	var activeAccountClientIDs = activeAccountClientIDs();

	return [
		{
			key: 'id',
			value: 'active',
			replacement: activeAccountID
		},
		{
			key: 'id',
			value: 'clients',
			replacement: {
				'==': { 'in': activeAccountClientIDs },
				'!=': { 'notin': activeAccountClientIDs },
			}
		}
	];
}

DS.defineResource({
	name: 'account',
	magicfilterRules: magicfilterRules,
	defaultFilter: magicfilter
});

DS.filter('account', { id: 'active'}); // Will get the active account
DS.filter('account', { id: 'clients'}); // Will get the active accounts clients
```

## Angular

If you are using Angular.JS two services are included in the 'js-data' module, magicFilter and magicFilterTransform.

These are the filter and transform functions.

## Development

```
npm test // runs tests
npm start // run tests & watches for changes
```
