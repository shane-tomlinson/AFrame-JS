(function() {
    var schemaConfig = {
        name: { type: 'text' },
        employer: { type: 'text', 'def': 'AFrame Foundary' }
    };
    
    testsToRun.push( {
            
            name: "TestCase AFrame.CollectionPluginModel",
            
            setUp: function() {
                this.collection = AFrame.construct( {
                    type: AFrame.CollectionArray,
                    plugins: [ {
                        type: AFrame.CollectionPluginModel,
                        config: {
                            schema: schemaConfig
                        }
                    } ]
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
                var model =  AFrame.construct( {
                    type: AFrame.Model,
                    config: {
                        schema: schemaConfig,
                        data: {
                            name: 'Shane Tomlinson'
                        }
                    }
                } );
                
                this.collection.insert( model );
                
                var model = this.collection.get( 0 );
                
                Assert.areSame( 'Shane Tomlinson', model.get( 'name' ) );                
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
                this.collection = AFrame.construct( {
                    type: AFrame.CollectionArray,
                    plugins: [ {
                        type: AFrame.CollectionPluginModel,
                        config: {
                            schema: schemaConfig,
                            modelFactory: modelFactory
                        }
                    } ]
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
            },
    } );
}() );
