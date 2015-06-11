/**
 * Expands the shorthand properites of a JSData Query object
 * into their expanded 'where' form
 *
 * @param {object} params - JSData Query object
 * @return {object} The transformed Query object
 */
function expandFilterParams(params){
    // These keys are not shorthand queries, don't touch them
    var reservedKeys = [
        'where',
        'orderBy',
        'offset',
        'limit'
    ];

    params.where = params.where || {};

    Object.keys(params).forEach(function(key){
        if(reservedKeys.indexOf(key) >= 0){
            return;
        }

        params.where[key] = {
            '==': params[key]
        };
        delete params[key];
    });

    return params;
}

/**
 * Transforms a JSData Query object using a set of magicFilterRules
 *
 * @param {array|object|function} rules - An array of rule objects or a single rule object or a function that returns either an array of rules or a single rule
 * @param {string} rule.key - Attribute to match
 * @param {string} rule.value- Attribute value to match
 * @param {*|Object} rule.replacement - Either a single value or an object of replacements using the operator as a key and the replacement as the value
 * @param {object} params - JSData query object
 * @return {object}
 */
function transform(rules, params){
    params = expandFilterParams(params);
    var where = params.where;

    rules = typeof rules === 'function' ? rules() : rules;
    rules = Array.isArray(rules) ? rules : [rules];

    rules.forEach(function(rule){
        var key = rule.key;
        var value = rule.value;
        var replacement = rule.replacement;

        Object.keys(where[key]).forEach(function(operator){
            // Only process attributes where the key & values match
            if(where[key][operator] !== value){
                return; 
            }

            // If the replacement object doesn't contain the current operator, skip it
            if(typeof replacement === 'object' && Object.keys(replacement).indexOf(operator) < 0){
                return;
            }

            var replacementOp = operator;

            // Check if we are replacing the operator, if so remove the old one
            if(typeof replacement === 'object' && replacement[operator]){
                delete where[key][operator];
                replacementOp = Object.keys(replacement[operator])[0];
            }

            // Apply it to our where query object
            if(typeof replacement === 'object'){
                where[key][replacementOp] = replacement[operator][replacementOp];
            } else {
                where[key][replacementOp] = replacement;
            }
        });
    });

    params.where = where;

    return params;
}

function filter(collection, resourceName, params, options){
    params = transform(options.magicFilterRules || [], params);

    return this.defaults.defaultFilter(collection, resourceName, params, options);
}

module.exports = {
    filter: filter,
    transform: transform
};
