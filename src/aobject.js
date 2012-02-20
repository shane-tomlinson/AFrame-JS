/**
 * The base object of nearly everything.  It is recommended to create all new classes as a subclass
 * of AObject since it provides general functionality such as event binding and teardown housekeeping.
 * All AObjects in the system have a cid, a cid is a unique identifier within the application.
 * If an AObject creates and is responsible for maintaining other AObjects, [addChild](#method_addChild)
 * should be called with the created children.  When this object is torn down, the child object added via addChild will
 * have its teardown function called as well.  This can ensure that all memory is freed and that
 * no references are kept when the object's lifespan has ended.
 *
 *
 * Declaring Configuration Items to Import
 *=========
 *
 * A very common pattern used in AFrame derived objects is to save off a list of
 *	configuration options that an object is created with.  Each class can define
 *	a list of configuration options that should automatically be imported on
 *  object creation.
 *
 * Example Auto-Import of Configuration Items
 *
 *    // Define a class with items to import
 *    var SomeClass = AFrame.Class( {
 *        importconfig: [ 'firstImportedParam', 'secondImportedParam' ]
 *    } );
 *
 *    var someClassInst = SomeClass.create( {
 *        firstImportedParam: "This is imported",
 *        secondImportedParam: "So is this",
 *        thirdParam: "But this is not"
 *    } );
 *
 * Event Usage
 *=========
 *
 * All AFrame.AObject based classes have a built in event mechanism.  Events are
 *  dynamically created, there is no need to explicitly create an event, all that is
 *  needed is to call the object's triggerEvent or bindEvent.
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
 *
 * Declaring Event Bindings
 *========
 *
 * Binding to dependent object's events is another common pattern used in AFrame.
 *  To make this process simpler, it is possible to declare event bindings.  When
 *  declaring event bindings, three pieces of information are needed, the event name,
 *  the name of the object that is triggering the event, and the function (or name of
 *  the member function to bind as a handler.
 *
 * Example Usage:
 *
 *    // bind to two events on insertedObj, event1, and event2.
 *    // event1 has an inline handler.
 *    // event2 uses a class member as a handler.
 *    var Class = AFrame.AObject.extend( {
 *        importconfig: [ 'insertedObj' ],
 *        events: {
 *            'event1 insertedObj': function() {
 *                // Handle event here
 *            },
 *            'event2 insertedObj': 'event2Handler'
 *        },
 *        event2Handler: function() {
 *             // handle event here
 *        }
 *    } );
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
         * Initialize the object.  Note that if a class' create static function is used to create an object, this will be called automatically.
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
            var me=this;
            me.config = config;
            me.cid = config.cid || AFrame.getUniqueID();
            me.children = {};

            importConfig.call( me );
            me.bindEvents();

            /**
             * Triggered when the object is initialized
             * @event onInit
             * @param {AFrame.Event} event - the event object
             */
            me.triggerEvent( 'onInit' );
        },

        /**
         * Check for required configuration options
         * @method checkRequired
         * @param config {object} - configuration
         * @param name {string} - all remaining options are strings of items that are required to be in the configuration object.
         */
        checkRequired: function( config ) {
            var list = [].slice.call(arguments, 1);
            for(var item, index = 0; item = list[index]; ++index) {
                if(!config.hasOwnProperty(item)) {
                    throw "missing config option: " + item;
                }
            }
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
             * @param {AFrame.Event} event - the event
             */
            var me=this;
            me.triggerEvent( 'onTeardown' );

            me.unbindAll();
            me.unbindToAll();
            me.teardownChildren();
            me.config = me.cid = me.children = null;
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
        	if( currClass.prototype.hasOwnProperty( 'importconfig' ) ) {
				var classImports = currClass.prototype.importconfig;
				classImports.forEach( function( importName ) {
					if( AFrame.defined( me.config[ importName ] ) ) {
						me[ importName ] = me.config[ importName ];
					}
				} );
            }
        }, me );
    }

    function bindEvents() {
        var me = this,
            events,
            eventName,
            nameTarget;

        AFrame.Class.walkChain( function( currClass ) {
        	if( currClass.prototype.hasOwnProperty( 'events' ) ) {
				events = currClass.prototype.events;

				for( eventName in events ) {
					nameTarget = getNameAndTarget.call( me, eventName );
					bindHandlers.call( me, nameTarget.name, nameTarget.target, events[ eventName ] );
				}
            }
        }, me );

        function getNameAndTarget( eventName ) {
            var parts = eventName.split( ' ' ),
                target = me[ parts[ 1 ] ] || me;

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
