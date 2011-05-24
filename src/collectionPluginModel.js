/**
* A plugin to a Collection that automates the creation of models.  If all items
*   in a collection share a [Schema](AFrame.Schema.html), instead of creating
*   a model for each insert, the data can be inserted directly and a model will
*   automatically be created.  When doing a "get" on the collection, the models
*   will be returned.  Model creation will occur as soon as data enters the collection,
*   so it happens on insert always before the onBeforeInsert event is triggered.
*   If the collection has CollectionPluginPersistence, the model will be created
*   before the onBeforeAdd event is triggered.
*
*    // Define the schema
*    var schemaConfig = {
*        name: { type: 'text' },
*        employer: { type: 'text', 'def': 'AFrame Foundary' }
*    };
*
*    // create the collection.
*    this.collection = AFrame.CollectionArray.create( {
*        plugins: [ [ AFrame.CollectionPluginModel, {
*            schema: schemaConfig
*        } ] ]
*    } );
*
* @class AFrame.CollectionPluginModel
* @extends AFrame.Plugin
* @constructor
*/
/**
* The schema or schemaConfig to use.
* @config schema
* @type {SchemaConfig || Schema || Model}
*/
/**
* The model factory to use.  If not given, a default model factory is used
*   which creates an AFrame.Model with the data inserted and the schema
*   given.  The factory will be called with two parameters, the data
*   and the schema.
*
*    // example of an overridden model factory function.
*    var modelFactory = function( data, schema ) {
*       return SpecializedMode.create( {
*           data: data,
*           schema: schema
*       } );
*    };
*
* @config modelFactory
* @type {function}
* @default modelFactory
*/
AFrame.CollectionPluginModel = ( function() {
    "use strict";

    var Plugin = AFrame.Plugin.extend( {
        importconfig: [ 'schema' ],

        init: function( config ) {
        	var me=this;
            me.modelFactory = config.modelFactory || createModel;

            Plugin.sc.init.call( me, config );

			me.defaultModelConstructor = AFrame.extendsFrom( me.schema, AFrame.Model ) ? me.schema : AFrame.Model;

            var plugged = me.getPlugged();
            plugged.insert = augmentInsert.bind( me, plugged.insert );

            if( plugged.add ) {
                plugged.add = augmentInsert.bind( me, plugged.add );
            }
        }

    } );

    function augmentInsert( decorated, item, insertAt ) {
        if( !( item instanceof AFrame.Model ) ) {
            item = this.modelFactory( item );
        }

        decorated.call( this.getPlugged(), item, insertAt );
    }

    function createModel( data ) {
		var model = this.defaultModelConstructor.create( {
			schema: this.schema,
			data: data
		} );
        return model;
    }

    return Plugin;
}() );
