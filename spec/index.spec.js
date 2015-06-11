var magicFilter = require('../index.js');

describe("magicFilterTransform", function() {
    var magicFilterTransform = magicFilter.transform;

    var rules = [
        {
            key: 'fooid',
            value: 'foo',
            replacement: '123' 
        }, {
            key: 'barid',
            value: 'bar',
            replacement: '456' 
        }
    ];

    var filterParams = {
        fooid: 'foo',
        barid: 'bar'
    };

    it("can transform a single rule", function() {
        expect(magicFilterTransform(rules[0], filterParams)).toEqual({
            where: {
                fooid: { '==': '123' },
                barid: { '==': 'bar' }
            }
        });
    });

    it("can transform an array of rules", function() {
        expect(magicFilterTransform(rules, filterParams)).toEqual({
            where: {
                fooid: { '==': '123' },
                barid: { '==': '456' }
            }
        });
    });

    it("can transform an function that returns rules", function() {
        expect(magicFilterTransform(function(){ return rules; }, filterParams)).toEqual({
            where: {
                fooid: { '==': '123' },
                barid: { '==': '456' }
            }
        });
    });
    
    
    it("can transform based upon operators", function() {
        var rulesOperators = {
            key: 'barid',
            value: 'bar',
            replacement: {
                '!=': { '==': '456' }
            }
        };

        var filterParamsOperators = { where: {
            barid: { '!=': 'bar' }
        }};

        expect(magicFilterTransform(rulesOperators, filterParamsOperators)).toEqual({
            where: {
                barid: { '==': '456' }
            }
        });
    });

    it("should ignore nonspecified operators", function() {
        var rulesOperators = {
            key: 'barid',
            value: 'bar',
            replacement: {
                '!=': { '==': '456' }
            }
        };

        var filterParamsOperators = { 
            where: {
                barid: { 'in': 'bar' }
            }
        };

        expect(magicFilterTransform(rulesOperators, filterParamsOperators)).toEqual({
            where: {
                barid: {
                    'in': 'bar'
                }
            }
        });
    });
});

describe("magicFilter", function() {
    var params = { 
        fooid: 'foo'
    };

    it("should ignore the transform if no rules are set", function() {
        var filterFn = magicFilter.filter.bind({
            defaults: { defaultFilter: function(){ return arguments[2]; }}
        });

        expect(filterFn(null, null, params, {})).toEqual(params);
    });

    it("should use the provided rules", function() {

        var filterFn = magicFilter.filter.bind({
            defaults: { defaultFilter: function(){ return arguments[2]; }}
        });

        var options = {
            magicFilterRules: {
                key: 'fooid',
                value: 'foo',
                replacement: '123' 
            }
        };

        expect(filterFn(null, null, params, options)).toEqual({
            where: { fooid: { '==': '123' } }
        });
    });
});

