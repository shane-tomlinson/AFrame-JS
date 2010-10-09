/**
 * A hash object that triggers events whenever inserting, removing, etc.
 * @class AFrame.MVCHash
 * @extends AFrame.AObject
 * @constructor
 */
AFrame.MVCHash = function() {
	AFrame.MVCHash.superclass.constructor.apply( this, arguments );
}

AFrame.extend( AFrame.MVCHash, AFrame.AObject, {
      init: function( config ) {
	  this.hash = {};
	  
	  AFrame.MVCHash.superclass.init.apply( this, arguments );
      },
      
      /**
       * set an item in the hash
       * @method set
       * @param {id} id - id to set item at.
       * @param {variant} item - item to set
       */
      set: function( id, item ) {
	  var data = {
	      id: id,
	      item: item,
	      previousItem: this.get( id )
	  };
	  
	  this.triggerEvent( 'onBeforeSet', data );
	  this.hash[ id ] = item;
	  this.triggerEvent( 'onSet', data );
      },
      
      /**
       * Get an item from the hash
       * @method get
       * @param {id} id - id of item to get
       * @return {variant} item if it exists, undefined otw.
       */
      get: function( id ) {
	  return this.hash[ id ];
      },
      
      /**
       * Remove an item from the store.
       * @method remove
       * @param {id} id - id of item to remove
       * @return {variant} item if it exists, undefined otw.
       */
      remove: function( id ) {
	  var item = this.get( id );
	  
	  if( item ) {
	    var data = {
		id: id,
		item: item
	    };
	    
	    this.triggerEvent( 'onBeforeRemove', data );
	    AFrame.remove( this.hash, id );
	    this.triggerEvent( 'onRemove', data );
	  }
	  
	  return item;
      }
} );