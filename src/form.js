/**
 * A basic form.  A Form is a Composite of form fields.  Each Field contains at least
 * the following functions, clear, save, reset, validate.  A generic Form is not
 * bound to any data, it is only a collection of form fields.  Note, by default,
 * the form creates an AFrame.Field for each field found.  If specialized field
 * creation is needed, fieldFactory can be overridden through either subclassing
 * or passing in a fieldFactory function to configuration.
 *
 *##Setting up the HTML##
 *
 * Use the "data-field" attribute on an element to specify that an element is a form field
 *
 *    <formset id="nameForm">
 *        <input type="string" name="name" data-field />
 *    </formset>
 *
 *##Working in Javascript##
 *
 *
 *    // Set up the form to look under #nameForm for elements with the "data-field"
 *    //   attribute.  This will find one field in the above HTML
 *    //
 *    var form = AFrame.Form.create( {
 *        target: '#nameForm'
 *    } );
 *
 *    // do some stuff, user enters data.
 *
 *    // Check the validity of the form
 *    var isValid = form.checkValidity();
 *
 *    // do some other stuff.
 *
 *    form.clear();
 *
 *##Using a Specialized fieldFactory##
 *
 *    // Sets up the field constructor, right now there is only one type of field
 *    var fieldFactory = function( element ) {
 *       return AFrame.SpecializedField.create( {
 *           target: element
 *       } );
 *    };
 *
 *    // Set up the form to look under #nameForm for elements with the "data-field"
 *    //   attribute.  This will find one field in the above HTML
 *    //
 *    var form = AFrame.Form.create( {
 *        target: '#nameForm',
 *        fieldFactory: fieldFactory
 *    } );
 *
 *    // the specialized form field factory can be used globally as
 *    // the default factory
 *    AFrame.Form.setDefaultFieldFactory( fieldFactory );
 *
 * @class AFrame.Form
 * @extends AFrame.Display
 * @uses AFrame.EnumerableMixin
 * @constructor
 */
/**
 * The factory to use to create form fields.
 *
 *     // example field factory in a Form's config.
 *     fieldFactory: function( element ) {
 *       return AFrame.SpecializedField.create( {
 *           target: element
 *       } );
 *     };
 *
 * @config fieldFactory
 * @type {function}
 * @default this.fieldFactory;
 */

/**
 * Triggered whenever form is cleared.
 * @event clear
*/
/**
 * Triggered whenever the form data is saved to the model.
 * @event save
*/
/**
 * Triggered whenever the form data is reloaded from the model.
 * @event reset
*/
AFrame.Form = ( function() {
    "use strict";

    var Form = AFrame.Display.extend( AFrame.EnumerableMixin, {
        init: function( config ) {
            var me=this;
            me.fieldFactory = config.fieldFactory || me.fieldFactory || fieldFactory;
            me.elements = [];
            me.fields = [];

            Form.sc.init.call( me, config );

            me.bindFormElements();
        },

        bindFormElements: function() {
            var me=this,
                elements = AFrame.DOM.getDescendentElements( '[data-field]',
                    me.getTarget() );

            AFrame.DOM.forEach( elements, me.bindFormElement, me );
        },

        teardown: function() {
            var me=this;
            me.forEach( function( formField, index ) {
                formField.teardown();
                me.fields[ index ] = null;
            } );
            me.fields = me.elements = null;
            Form.sc.teardown.call( me );
        },

        /**
         * bind a form element to the form
         *
         *    // Bind a field in the given element.
         *    var field = form.bindFormElement( '#button' );
         *
         * @method bindFormElement
         * @param {selector || element} formElement - the form element to bind to.
         * @returns {AFrame.Field}
         */
        bindFormElement: function( formElement ) {
            var me=this,
                target = AFrame.DOM.getElements( formElement ),
                formField = me.fieldFactory( target );

            me.elements.push( target );
            me.fields.push( formField );

            return formField;
        },

        /**
         * Get the form field elements
         *
         *    // Get the form field elements
         *    var fields = form.getFormElements();
         *
         * @method getFormElements
         * @return {array} the form elements
         */
        getFormElements: function() {
            return this.elements;
        },

        /**
         * Get the form fields
         *
         *    // Get the form fields
         *    var fields = form.getFormFields();
         *
         * @method getFormFields
         * @return {array} the form fields
         */
        getFormFields: function() {
            return this.fields;
        },

        /**
         * Validate the form.
         *
         *    // Check the validity of the form
         *    var isValid = form.checkValidity();
         *
         * @method checkValidity
         * @return {boolean} true if form is valid, false otw.
         */
        checkValidity: function() {
            var valid = true;

            for( var index = 0, formField; ( formField = this.fields[ index ] ) && valid; ++index ) {
                valid = formField.checkValidity();
            }

            return valid;
        },

        /**
         * Clear the form, does not affect data
         *
         *    // Clear the form, does not affect data.
         *    form.clear();
         *
         * @method clear
         */
        clear: function() {
            fieldAction.call( this, 'clear' );
        },

        /**
         * Reset the form to its original state
         *
         *    // Resets the form to its original state.
         *    form.reset();
         *
         * @method reset
         */
        reset: function() {
            fieldAction.call( this, 'reset' );
        },

        /**
         * Have all fields save their data if the form is valid
         *
         *    // Have all fields save their data if the form is valid
         *    var saved = form.save();
         *
         * @method save
         * @return {boolean} true if the form was valid and saved, false otw.
         */
        save: function() {
            var me=this,
                valid = me.checkValidity();
            if( valid ) {
                fieldAction.call( me, 'save' );
            }

            return valid;
        },


        /**
        * Iterate through each form field
        * @method forEach
        * @param {function} callback - the callback to call.
        * @param {object} context (optional) - the context to call the callback in
        */
        forEach: function( callback, context ) {
            this.fields && this.fields.forEach( callback, context );
        }
    } );

    /**
    * Set the default field factory.  Overridden factory takes one parameter, element.
    * It should return a {Field}(AFrame.Field.html) compatible object.
    *
    *
    *     // example of overloaded fieldFactory
    *     AFrame.Form.setDefaultFieldFactory( function( element ) {
    *       return AFrame.SpecializedField.create( {
    *           target: element
    *       } );
    *     } );
    *
    *
    * @method Form.setDefaultFieldFactory
    * @param {function} factory
    */
    Form.setDefaultFieldFactory = function( factory ) {
        fieldFactory = factory;
    };

    /**
    * Do an action on all fields.
    * @method fieldAction
    * @private
    */
    function fieldAction( action ) {
        this.forEach( function( formField, index ) {
            formField[ action ]();
        } );

        this.triggerEvent( action );
    }


    /**
    * The factory used to create fields.
    *
    *     // example of overloaded fieldFactory
    *     fieldFactory: function( element ) {
    *       return AFrame.SpecializedField.create( {
    *           target: element
    *       } );
    *     };
    *
    * @method fieldFactory
    * @param {Element} element - element where to create field
    * @return {AFrame.Field} field for element.
    */
    function fieldFactory( element ) {
       return AFrame.Field.create( {
            target: element
       } );
    }

    return Form;
}() );
