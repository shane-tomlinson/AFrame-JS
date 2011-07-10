/*global AFrame, testsToRun, Assert*/
(function() {
    var collection;

    var NetMock = {
        ajax: function(config) {
            this.url = config.url;
            this.type = config.type || 'GET';
            var data = config.data;

            if( this.type === 'GET' && !( data && AFrame.defined( data.id ) ) ) {
                config.success([
                    {
                        'id': 0,
                        name: 'shane'
                    },
                    {
                        'id': 1,
                        name: 'charlotte'
                    }
                ]);
            }

            if( this.type === 'POST' && data ) {
                config.success( data );
            }

            if( this.type === 'DEL' && !( data && AFrame.defined( data.id ) ) ) {
                config.success( data );
            }

            if( this.type === 'PUT' && ( data && AFrame.defined( data.id ) ) ) {
                config.success( data );
            }
        }
    };

    testsToRun.push( {

        name: "TestCase AFrame.CollectionPluginAJAX",

        setUp: function() {
            collection = AFrame.CollectionArray.create({
                plugins: [
                    [ AFrame.CollectionPluginREST, {
                        root: '/test', 
                        net: NetMock           
                    } ]
                ]
            });

        },

        tearDown: function() {
            collection.teardown();
            collection = null;
        },

        'we can load': function() {
            var success = false;
            collection.load( {
                onComplete: function() {
                    success = true;
                }
            } );

            Assert.isTrue( success, 'we managed a round trip load' );

            Assert.areEqual( 'GET', NetMock.type, 'correct type used' );
            Assert.areEqual( '/test', NetMock.url, 'correct load URL called' );
            Assert.areEqual( 2, collection.getCount(), 'we have two items loaded' );
        },

        'we can add': function() {
            var success = false;
            collection.add( {
                name: 'AFrameJS'
            }, {
                onComplete: function( data ) {
                    success = true;
                }
            } );

            Assert.isTrue( success, 'we managed a round trip add' );

            Assert.areEqual( 'POST', NetMock.type, 'correct type used' );
            Assert.areEqual( '/test', NetMock.url, 'correct load URL called' );
            Assert.areEqual( 1, collection.getCount(), 'we have one item loaded' );
        },

        'we can del': function() {
            var success = false;

            collection.add( {
                id: 0,
                name: 'AFrameJS'
            } );


            var success = false;
            collection.del( 0, {
                onComplete: function( data ) {
                    success = true;
                }
            } );

            Assert.isTrue( success, 'we managed a round trip del' );
            Assert.areEqual( 'DEL', NetMock.type, 'correct type used' );
            Assert.areEqual( '/test/0', NetMock.url, 'correct load URL called' );
            Assert.areEqual( 0, collection.getCount(), 'we have no items' );
        },

        'we can save': function() {
            var success = false;

            collection.add( {
                id: 0,
                name: 'AFrameJS'
            } );


            var success = false;
            collection.save( 0, {
                onComplete: function( data ) {
                    success = true;
                }
            } );

            Assert.isTrue( success, 'we managed a round trip save' );
            Assert.areEqual( 'PUT', NetMock.type, 'correct type used' );
            Assert.areEqual( '/test/0', NetMock.url, 'correct load URL called' );
            Assert.areEqual( 1, collection.getCount(), 'we have one item' );
        }

        

    } );

}());
