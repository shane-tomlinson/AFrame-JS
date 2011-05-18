(function() {
    var schemaConfig = {
        name: { type: 'text' },
        employer: { type: 'text', 'def': 'AFrame Foundary' }
    };

    var testModel = AFrame.Class( AFrame.Model, {
    	schema: schemaConfig
    } );

    testsToRun.push( {

            name: "TestCase AFrame.CollectionPluginModel",

            setUp: function() {
                this.collection = AFrame.create( AFrame.CollectionArray, {
                    plugins: [ AFrame.CollectionPluginPersistence,
                        [ AFrame.CollectionPluginModel, {
                            schema: schemaConfig
                        } ]
                    ]
                } );
            },

            teardDown: function() {
                this.collection.teardown();
            },

            testInsertData: function() {
                this.collection.insert( {
                    name: 'Shane Tomlinson',
                } );

                var model = this.collection.get( 0 );

                Assert.areSame( true, model instanceof AFrame.Model, 'Inserted data creates a model' );

                Assert.areSame( 'Shane Tomlinson', model.get( 'name' ) );

                // use default value
                Assert.areSame( 'AFrame Foundary', model.get( 'employer' ) );
            },

            testInsertModel: function() {
                var model =  AFrame.create( AFrame.Model, {
                    schema: schemaConfig,
                    data: {
                        name: 'Shane Tomlinson'
                    }
                } );

                this.collection.insert( model );

                var model = this.collection.get( 0 );

                Assert.areSame( 'Shane Tomlinson', model.get( 'name' ) );
            },

            testAddData: function() {
                var beforeAddItem;
                this.collection.bindEvent( 'onBeforeAdd', function( event ) {
                    beforeAddItem = event.item;
                } );

                this.collection.add( {
                    name: 'Shane Tomlinson',
                } );

                var model = this.collection.get( 0 );
                Assert.areSame( true, beforeAddItem instanceof AFrame.Model, 'Inserted data creates a model' );
            },

            testAddModel: function() {
                var beforeAddItem;
                this.collection.bindEvent( 'onBeforeAdd', function( event ) {
                    beforeAddItem = event.item;
                } );

                var model =  AFrame.create( AFrame.Model, {
                    schema: schemaConfig,
                    data: {
                        name: 'Shane Tomlinson'
                    }
                } );

                this.collection.add( model );

                var model = this.collection.get( 0 );
                Assert.areSame( model, beforeAddItem, 'Inserted uses given model' );
            },

            testAddNotAddedIfNoPersistencePlugin: function() {
                var collection = AFrame.create( AFrame.CollectionArray, {
                    plugins: [
                        [ AFrame.CollectionPluginModel, {
                            schema: schemaConfig
                        } ]
                    ]
                } );

                Assert.isUndefined( collection.add, 'add not added, no persistence plugin' );
            },

            testUseModelForSchema: function() {
                var TestModel = AFrame.Class( AFrame.Model, {
					schema: schemaConfig
				} );

                var collection = AFrame.create( AFrame.CollectionArray, {
                    plugins: [ AFrame.CollectionPluginPersistence,
                        [ AFrame.CollectionPluginModel, {
                            schema: TestModel
                        } ]
                    ]
                } );

				collection.add( {
					name: 'Shane Tomlinson'
				} );

				var model = collection.get( 0 );
				Assert.isTrue( model instanceof TestModel, 'new model is an instace of TestModel' );

            }


    } );

    function OverrideModel( data ) {
        var data = data;
        this.get = function( name ) {
            return data[ name ];
        };
    };

    var modelFactory = function( data ) {
        return new OverrideModel( data );
    };

    testsToRun.push( {

            name: "TestCase AFrame.CollectionPluginModel with overridden modelFactory",

            setUp: function() {
                this.collection = AFrame.create( AFrame.CollectionArray, {
                    plugins: [ [ AFrame.CollectionPluginModel, {
                        schema: schemaConfig,
                        modelFactory: modelFactory
                    } ] ]
                } );
            },

            teardDown: function() {
                this.collection.teardown();
            },

            testInsertData: function() {
                this.collection.insert( {
                    name: 'Shane Tomlinson',
                } );

                var model = this.collection.get( 0 );

                Assert.areSame( true, model instanceof OverrideModel, 'Inserted data creates an overridden model' );

                Assert.areSame( 'Shane Tomlinson', model.get( 'name' ) );
            }
    } );
}() );
