/**
 * The base object of nearly everything.  It is recommended to create all new classes as a subclass
 * of AObject since it provides general functionality such as event binding and teardown housekeeping.
 * All AObjects in the system have a cid, a cid is a unique identifier within the application.  
 * If an AObject creates and is responsible for maintaining other AObjects, [addChild](#method_addChild) 
 * should be called with the created children.  When this object is torn down, the child object added via addChild will 
 * have its teardown function called as well.  This can ensure that all memory is freed and that
 * no references are kept when the object's lifespan has ended.
 *
 * Events
 *=========
 *
 * All AFrame.AObject based classes have a built in event mechanism.  Events are dynamically created, there is
 *  no need to explicitly create an event, all that is needed is to call either
 *  triggerEvent or bindEvent.
 *
 * Event Example Usage:
 *
 *    // Assume anObject is an AFrame.AObject based object.
 *    // Every AFrame.AObject based object triggers an onInit event 
 *    // when its init function is called.
 *    var onObjectInit = function() {
 *       // called whenever anObject.init is called.
 *    };
 *   
 *    anObject.bindEvent( 'onInit', onObjectInit );
 *    anObject.init();    // calls onObjectInit function
 *

 * @class AFrame.AObject
 * @uses AFrame.ObservablesMixin
 */
/**
 * cid for the object, if not given, a unique id is assigned
 * @config {cid} cid
 */
AFrame.AObject = (function(){ 
    "use strict";
    
    var AObject = AFrame.Class( {
        /**
         * Initialize the object.  Note that if [AFrame.construct](AFrame.html#method_construct) or [AFrame.create](AFrmae.html#method_create)is used, this will be called automatically.
         *
         *    var obj = new AFrame.SomeObject();
         *    obj.init( { name: 'value' } );
         *
         * 
         * @method init
         * @param config {object} - configuration
         * @param config.cid {id} - cid to give to the object, if not given, one is generated.
         */
        init: function( config ) {
            this.config = config;
            this.cid = config.cid || AFrame.getUniqueID();
            this.children = {};
            
            importConfig.call( this );
            this.bindEvents();
            
            /**
             * Triggered when the object is initialized
             * @event onInit
             * @param {AFrame.Event} event - the event object
             */
             this.triggerEvent( 'onInit' );
        },
        
        /**
         * Return the configuration object given in init.
         *
         *     var config = this.getConfig();
         *
         * @method getConfig
         * @return {object} the configuration object
         */
        getConfig: function() {
            return this.config;
        },
        
        /**
         * Override to do any event binding
         * @method bindEvents
         */
        bindEvents: function() {
            bindEvents.call( this );
        },
        
        /**
         * Tear the object down, free any references
         *
         *    this.teardown();
         *
         * @method teardown
         */
        teardown: function() {
            /**
             * triggered whenever tte object is torn down
             * @event onTeardown
             * @param {AFrame.Event} e3vent - the event
             */
            this.triggerEvent( 'onTeardown' );

            this.unbindAll();
            this.unbindToAll();
            this.teardownChildren();
            this.config = this.cid = this.children = null;
        },
        
        teardownChildren: function() {
            for( var cid in this.children ) {
                var child = this.children[ cid ];
                child.teardown();
                AFrame.remove( this.children, cid );
            }
        },
        
        /**
         * Get the CID of the object
         *
         *     var cid = this.getCID();
         *
         * @method getCID
         * @returns {cid}
         */
        getCID: function() {
            return this.cid;
        },
        
        /**
         * Add a child.  All children are torn down on this object's teardown
         *
         *     // childToBeTornDown is an AObject based item created by this AObject.
         *     // childToBeTornDown needs torn down whenever this object is torn down.
         *     this.addChild( childToBeTornDown );
         *
         * @method addChild
         * @param {AObject} child - child object
         */
        addChild: function( child ) {
            this.children[ child.getCID() ] = child;
        },
        
        /**
         * Remove a child.
         *
         *    // childToRemove is a child that this object has already 
         *    // created and no longer needs.
         *    this.removeChild( childToRemove.getCID() );
         *
         * @method removeChild
         * @param {cid} cid - cid of item to remove
         */
        removeChild: function( cid ) {
            AFrame.remove( this.children, cid );
        },
        
        
        /**
        * Create a trigger event proxy function.  Useful to re-broadcast an event or when a DOM 
        *   event should trigger a normal AObject based event.
        *
        *    // use triggerProxy to rebroadcast an event from a child
        *    child.bindEvent( 'eventToProxy', this.triggerProxy( 'eventToProxy' ) );
        *    
        *
        * @method triggerProxy
        * @param {string} eventName - name of event to trigger
        */
        triggerProxy: function( eventName ) {
            return this.triggerEvent.bind( this, eventName );
        }
    }, AFrame.ObservablesMixin );
    
    function importConfig() {
        var me = this;
        AFrame.Class.walkChain( function( currClass ) {
            var classImports = currClass.prototype.importconfig || [];
            classImports.forEach( function( importName ) {
                if( AFrame.defined( me.config[ importName ] ) ) {
                    me[ importName ] = me.config[ importName ];
                }
            } );
        }, me );
    }
    
    function bindEvents() {
        var me = this;
        
        AFrame.Class.walkChain( function( currClass ) {
            var events = currClass.prototype.events || {};
            
            for( var eventName in events ) {
                var nameTarget = getNameAndTarget.call( me, eventName );
                bindHandlers.call( me, nameTarget.name, nameTarget.target, events[ eventName ] );
            }
        }, me );
        
        function getNameAndTarget( eventName ) {
            var parts = eventName.split( ' ' );
            var target = me[ parts[ 1 ] ] || me;
            
            return {
                name: parts[ 0 ],
                target: target
            };
        }
        
        function bindHandlers( name, target, handlers ) {
            handlers = AFrame.array( handlers ) ? handlers : [ handlers ];
            
            handlers.forEach( function( handler ) {
                handler = AFrame.func( handler ) ? handler : me[ handler ];
                target.bindEvent( name, handler, me );
            } );
        }
    }
    

    return AObject;
}() );
