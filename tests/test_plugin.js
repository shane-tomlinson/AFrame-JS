testsToRun.push( {

		name: "TestCase AFrame.Plugin",

		setUp: function() {

			this.pluggedObject = AFrame.AObject.create();
			this.plugin = AFrame.Plugin.create( {
                plugged: this.pluggedObject
			} );
		},

		tearDown : function () {
			this.pluggedObject.teardown();
			this.pluggedObject = null;
			delete this.pluggedObject;

			this.plugin.teardown();
			this.plugin = null;
			delete this.plugin;

		},

		testPlugged: function() {
			var plugged = this.plugin.getPlugged();

			Assert.isObject( plugged, 'plugged is an object' );
			Assert.areEqual( plugged, this.pluggedObject, 'plugged object correctly set' );
		},

		testTeardownOnPluggedTeardown: function() {
			var pluginTeardown = false;
			this.plugin.bindEvent( 'onTeardown', function() {
				pluginTeardown = true;
			} );

			this.pluggedObject.teardown();

			Assert.isTrue( pluginTeardown, 'plugin was torn down' );
		},

        testOnPluggedInit: function() {
            var onPluggedInitCalled = false;
            var Plugin = AFrame.Plugin.extend( {
                onPluggedInit: function() {
                    onPluggedInitCalled = true;
                }
            } );

            var item = AFrame.AObject.create( {
                plugins: [ Plugin ]
            } );

            Assert.isTrue( onPluggedInitCalled, 'onPluggedInit automatically called' );
        }
} );
