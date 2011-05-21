
testsToRun.push( {
    name: 'TestCase AFrame.Class',

    testNewClassNoBase: function() {
        var proto = {
            init: function() {
            }
        };
        var Class = AFrame.Class( proto );

        Assert.isFunction( Class );
        Assert.areSame( Class, Class.prototype.constructor, 'prototype constructor is set' );
        Assert.areSame( proto.init, Class.prototype.init, 'init uses the init we defined' );
    },

    testNewClassBase: function() {
        var proto = {
            init: function() {}
        };

        var constCalled = false;
        function MockBase() {
            constCalled = true;
        }
        MockBase.prototype = {
            constructor: MockBase,
            init: function() {
            }
        };

        var Class = AFrame.Class( MockBase, proto );
        Assert.isFunction( Class );
        Assert.isTrue( Class === Class.prototype.constructor, 'prototype constructor is set' );
        Assert.areSame( proto.init, Class.prototype.init, 'init uses the init we defined' );

        var instance = AFrame.create( Class );

        Assert.isTrue( instance instanceof MockBase, 'new class is instance of AObject' );
        Assert.isTrue( constCalled, 'base constructor is called' );
    },

    testNewClassMultipleMixins: function() {
        var mixin1 = {
            init: function() {}
        };

        var mixin2 = {
            func2: function() {}
        };

        var Class = AFrame.Class( mixin1, mixin2 );

        Assert.isFunction( Class.prototype.init, 'init added to Class' );
        Assert.isFunction( Class.prototype.func2, 'func2 added to Class' );

    },

    testWalkChain: function() {
        var instance = AFrame.create( SubClass ), depth = 0;
        AFrame.Class.walkChain( function( currClass ) {
            depth++;
        }, instance );

        Assert.areEqual( 2, depth, 'SubClass has a class depth of 2' );
    },

    testClassCreate: function() {
    	var Class = AFrame.Class( AFrame.AObject, {
    		importconfig: [ 'color' ],
    		getColor: function() {
				return this.color;
    		}
    	} );

    	var inst = Class.create( { color: 'green' } );
    	Assert.isTrue( inst instanceof Class, 'Class created with Class.create()' );
    	Assert.areEqual( 'green', inst.getColor(), 'options passed to constructor' );
    },

    testClassCreateNotAddedIfNoInit: function() {
  	var Class = AFrame.Class( {
    		importconfig: [ 'color' ],
    		getColor: function() {
				return this.color;
    		}
    	} );
		Assert.isUndefined( Class.create, 'create not added to Class without init' );
      }
} );

