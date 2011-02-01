/**
* A plugin to a Collection that automates the creation of models.  If all items
*   in a collection share a [Schema](AFrame.Schema.html), instead of creating
*   a model for each insert, the data can be inserted directly and a model will
*   automatically be created.  When doing a "get" on the collection, the models
*   will be returned.
*
*
*    // Define the schema
*    var schemaConfig = {
*        name: { type: 'text' },
*        employer: { type: 'text', 'def': 'AFrame Foundary' }
*    };
*    
*    // create the collection.
*    this.collection = AFrame.construct( {
*        type: AFrame.CollectionArray,
*        plugins: [ {
*            type: AFrame.CollectionPluginModel,
*            config: {
*                schema: schemaConfig
*            }
*        } ]
*    } );
* 
* @class AFrame.CollectionPluginModel
* @extends AFrame.Plugin
* @constructor
*/
/**
* The schema or schemaConfig to use.
* @config schema
* @type {SchemaConfig || Schema}
*/
/**
* The model factory to use.  If not given, a default model factory is used
*   which creates an AFrame.Model with the data inserted and the schema
*   given.  The factory will be called with two parameters, the data 
*   and the schema.
*
*    // example of an overridden model factory function.
*    var modelFactory = function( data, schema ) {
*       return AFrame.construct( {
*           type: SpecializedModel,
*           config: {
*               data: data,
*               schema: schema
*           } 
*       } );
*    };
*
* @config modelFactory
* @type {function}
* @default modelFactory
*/
AFrame.CollectionPluginModel = ( function() {
    "use strict";
    
    var Plugin = function() {
        Plugin.sc.constructor.call( this );
    };
    AFrame.extend( Plugin, AFrame.Plugin, {
        init: function( config ) {
            this.schema = config.schema;
            this.modelFactory = config.modelFactory || createModel;
            
            Plugin.sc.init.call( this, config );
        },
        
        setPlugged: function( plugged ) {
            this.decoratedInsert = plugged.insert;
            plugged.insert = this.insert.bind( this );
            
            Plugin.sc.setPlugged.call( this, plugged );
        },
        
        insert: function( item, insertAt ) {
            if( !( item instanceof AFrame.Model ) ) {
                item = this.modelFactory( item, this.schema );
            }
            
            this.decoratedInsert.call( this.getPlugged(), item, insertAt );
        }
    } );
    
    function createModel( data, schema ) {
        var model = AFrame.construct( {
            type: AFrame.Model,
            config: {
                schema: schema,
                data: data
            }
        } );
        return model;
    }
    
    return Plugin;
}() );