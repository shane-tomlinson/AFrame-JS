/**
 * Create an AFrame.Form based object for each item in the list.  Adds the functions [validate](#method_validate), 
 * [save](#method_save), [clear](#method_clear), [reset](#method_reset), and [getForm](#method_getForm) to the 
 * plugged object.  By default, no formFactory method is needed to create forms and a 
 * [AFrame.DataForm](AFrame.DataForm.html) is created for each row.  If a specialty form is needed, 
 * the formFactory configuration parameter can be specified.
 *
 *##Setting up a List##
 *
 *    // ListPluginFormRow with default formFactory
 *    var list = AFrame.construct( {
 *        type: AFrame.List,
 *        config: {
 *            target: '.list'
 *        },
 *        plugins: [
 *            {
 *                type: AFrame.ListPluginFormRow
 *            }
 *        ]
 *    } );
 *       
 *    // ListPluginFormRow with formFactory specified
 *    var list = AFrame.construct( {
 *        type: AFrame.List,
 *        config: {
 *            target: '.list'
 *        },
 *        plugins: [
 *            {
 *                type: AFrame.ListPluginFormRow,
 *                config: {
 *                    formFactory: function( rowElement, data )
 *                        var form = AFrame.construct( {
 *                            type: AFrame.SpecializedForm,
 *                            config: {
 *                                target: rowElement,
 *                                dataSource: data
 *                            }
 *                        } );
 *           
 *                        return form;
 *                  },
 *            }
 *        ]
 *    } );
 *
 *
 *##Using ListPluginFormRow's Functionality##
 * 
 *     // list is an AFrame.List with the AFrame.ListPluginFormRow plugin
 *
 *     // reset all forms in the entire list
 *     list.reset();
 *
 *     // reset one row
 *     list.reset( 0 );
 *
 *     // validate all forms in the entire list
 *     var valid = list.validate();
 *
 *     // validate one row
 *     var valid = list.validate( 0 );
 *       
 *     // save all forms in the entire list
 *     list.save();
 *
 *     // save one row
 *     list.save( 0 );
 * 
 *     // clear all forms in the entire list
 *     list.clear();
 *
 *     // clear one row
 *     list.clear( 0 );
 *
 * @class AFrame.ListPluginFormRow
 * @extends AFrame.Plugin
 * @constructor 
 */
AFrame.ListPluginFormRow = function() {
	AFrame.ListPluginFormRow.sc.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.ListPluginFormRow, AFrame.Plugin, {
	init: function( config ) {
		/**
         * The factory function used to create forms.  formFactory will be called once for each
         *	row in the list, it will be called with two parameters, the rowElement and the data
         *	passed in the list's onInsert call.  An AFrame.Form compatible object must be returned.
         *
         *     ...
         *     formFactory: function( rowElement, data ) {
         *          var form = AFrame.construct( {
         *              type: AFrame.SpecializedForm,
         *              config: {
         *                  target: rowElement,
         *                  dataSource: data
         *              }
         *          } );
         *           
         *          return form;
         *      },
         *      ....
         *
		 * @config formFactory
		 * @type {function} (optional)
         * @default this.formFactory
		 */
        this.formFactory = config.formFactory || this.formFactory;
		
		this.forms = [];
		
		AFrame.ListPluginFormRow.sc.init.apply( this, arguments );
	},
    
	setPlugged: function( plugged ) {
		plugged.bindEvent( 'onInsert', this.onInsertRow, this );
		plugged.bindEvent( 'onRemove', this.onRemoveRow, this );
		
		plugged.validate = this.validate.bind( this );
		plugged.save = this.save.bind( this );
		plugged.reset = this.reset.bind( this );
		plugged.clear = this.clear.bind( this );
		plugged.getForm = this.getForm.bind( this );
		
		AFrame.ListPluginFormRow.sc.setPlugged.apply( this, arguments );		
	},
	
	teardown: function() {
		this.forms.forEach( function( form, index ) {
			form.teardown();
			this.forms[ index ] = null;
		}, this );
		
		AFrame.ListPluginFormRow.sc.teardown.apply( this, arguments );		
	},
	
    /**
     * The factory function used to create forms.  formFactory will be called once for each
     *	row in the list, it will be called with two parameters, the rowElement and the data
     *	passed in the list's onInsert call.  An AFrame.Form compatible object must be returned.
     *
     *     ...
     *     formFactory: function( rowElement, data ) {
     *          var form = AFrame.construct( {
     *              type: AFrame.SpecializedForm,
     *              config: {
     *                  target: rowElement,
     *                  dataSource: data
     *              }
     *          } );
     *           
     *          return form;
     *      },
     *      ....
     *
     * @method formFactory
     * @type {function}
     */
    formFactory: function( rowElement, data ) {
        var form = AFrame.construct( {
            type: AFrame.DataForm,
            config: {
                target: rowElement,
                dataSource: data
            }
        } );
        
        return form;
    },
	
	onInsertRow: function( data, index ) {
		var form = this.formFactory( data.rowElement, data );
		this.forms.splice( index, 0, form );
	},
	
	onRemoveRow: function( data, index ) {
		var form = this.forms[ index ];
		form.teardown();
		
		this.forms[ index ] = null;
		this.forms.splice( index, 1 );
	},
	
	/**
	 * Validate a form.
     * 
     *     // list is an AFrame.List with the AFrame.ListPluginFormRow plugin
     *
     *     // validate all forms in the entire list
     *     var valid = list.validate();
     *
     *     // validate one row
     *     var valid = list.validate( 0 );
     *
	 * @method validate
	 * @param {number} index (optional) index of row.  If not given,
	 * validate all rows.
	 * @return {boolean} true if form is valid, false otw.
	 */
	validate: function( index ) {
		var valid = true;
		var form;
		
		if( AFrame.defined( index ) ) {
			form = this.forms[ index ];
			if( form ) {
				valid = form.validate();				
			}
		}
		else {
			for( index = 0; valid && ( form = this.forms[ index ] ); ++index ) {
				valid = form.validate();
			}
		}
		
		return valid;
	},
	
	/**
	 * Save a form's data to its DataContainer
     * 
     *     // list is an AFrame.List with the AFrame.ListPluginFormRow plugin
     *
     *     // save all forms in the entire list
     *     list.save();
     *
     *     // save one row
     *     list.save( 0 );
     *
	 * @method save
	 * @param {number} index (optional) index of row.  If not given,
	 * save all rows.
	 */
	save: function( index ) {
		this.formFunc( index, 'save' );
	},
	
	/**
	 * Reset a form
     * 
     *     // list is an AFrame.List with the AFrame.ListPluginFormRow plugin
     *
     *     // reset all forms in the entire list
     *     list.reset();
     *
     *     // reset one row
     *     list.reset( 0 );
     *
	 * @method reset
	 * @param {number} index (optional) index of row.  If not given,
	 * reset all rows.
	 */
	reset: function( index ) {
		this.formFunc( index, 'reset' );
	},
	
	/**
	 * Clear a form
     * 
     *     // list is an AFrame.List with the AFrame.ListPluginFormRow plugin
     *
     *     // clear all forms in the entire list
     *     list.clear();
     *
     *     // clear one row
     *     list.clear( 0 );
     *
	 * @method clear
	 * @param {number} index (optional) index of row.  If not given,
	 * clear all rows.
	 */
	clear: function( index ) {
		this.formFunc( index, 'clear' );
	},
	
	formFunc: function( index, funcName ) {
		if( AFrame.defined( index ) ) {
			var form = this.forms[ index ];
			if( form ) {
				form[ funcName ]();				
			}
		}
		else {
			this.forms.forEach( function( form, index ) {
				form[ funcName ]();
			} );
		}
	},
    
    /**
    * Get the reference to a form
    * 
    *     // list is an AFrame.List with the AFrame.ListPluginFormRow plugin
    *
    *     // get the form for one row.
    *     var form = list.getForm( 0 );
    *
    * @method getForm
    * @param {number} index - index of form to get
    * @return {AFrame.Form} form if available, undefined otw.
    */
    getForm: function( index ) {
        return this.forms[ index ];
    }
} );