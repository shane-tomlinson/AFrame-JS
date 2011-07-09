jQuery(function() {
    window.Assert = {
        deepEqual: function( expected, check, message ) {
            deepEqual( expected, check, message );
        },

        areEqual: function( expected, check, message ) {
            equal( check, expected, message );
        },

        areNotEqual: function( expected, check, message ) {
            notEqual( check, expected, message );
        },

        areSame: function( expected, check, message ) {
            strictEqual( true, check === expected, message );
        },

        isUndefined: function( check, message ) {
            strictEqual( typeof check, 'undefined', message );
        },

        isNotUndefined: function( check, message ) {
            notStrictEqual( typeof check, 'undefined', message );
        },

        isTrue: function( check, message ) {
            strictEqual( true, check, message );
        },

        isFalse: function( check, message ) {
            strictEqual( false, check, message );
        },

        isString: function( check, message ) {
            strictEqual( {}.toString.apply( check ), '[object String]', message );
        },

        isFunction: function( check, message ) {
            strictEqual( {}.toString.apply( check ), '[object Function]', message );
        },

        isObject: function( check, message ) {
            strictEqual( typeof check, 'object', message );
        },

        isArray: function( check, message ) {
            strictEqual( {}.toString.apply( check ), '[object Array]', message );
        },

        isNumber: function( check, message ) {
            strictEqual( {}.toString.apply( check ), '[object Number]', message );
        }
    };

    var reserved = [ 'name', 'setUp', 'tearDown' ];

    function createTest( testConfig ) {
        var config = {};
        if( testConfig.setUp ) {
            config.setup = testConfig.setUp;
        }

        if( testConfig.tearDown ) {
            config.teardown = testConfig.tearDown;
        }

        module( testConfig.name, config );

        for( var key in testConfig ) {
            if( testConfig.hasOwnProperty( key ) && reserved.indexOf( key ) === -1 ) {
                test( key, testConfig[ key ] );
            }
        }
    }

    testsToRun.forEach( createTest );

});

