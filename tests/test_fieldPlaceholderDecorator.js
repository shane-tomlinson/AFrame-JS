(function(){
        var input = document.createElement( 'input' );
        var html5Support = ( 'placeholder' in input );

        testsToRun.push( {


		    name: "TestCase AFrame.FieldPlaceholderDecorator",

		    testPlaceholderTextHTML5Support: function() {
                if( html5Support ) {
                    var target = jQuery( '#noValueFormElement' );
                    target.val( '' );

                    var textField = AFrame.Field.create( {
                        target: target
                    } );

                    Assert.areSame( '', textField.get(), 'correct get' );
                    Assert.areSame( '', textField.getDisplayed(), 'help text not displayed for browsers supporting HTML5 spec' );
                }
		    },

            testPlaceholderTextNoHTML5Support: function() {
                if( !html5Support ) {
                    var target = jQuery( '#noValueFormElement' );
                    target.val( '' );

                    var textField = AFrame.Field.create( {
                        target: '#noValueFormElement'
                    } );

                    //Assert.isUndefined( textField.get(), 'correct get' );
                    Assert.areSame( 'No Value Text', target.val(), 'help text displayed' );
                    Assert.areSame( '', textField.getDisplayed(), 'getDisplayed returns empty string when help text displayed' );
                    Assert.isTrue( target.hasClass( 'empty' ), 'empty class name added to help text' );

                    AFrame.DOM.fireEvent( '#noValueFormElement', 'focus' );
                    Assert.areSame( '', target.val(), 'when a focus happens, help text is cleared' );

                    AFrame.DOM.fireEvent( '#noValueFormElement', 'blur' );
                    Assert.areSame( 'No Value Text', target.val(), 'help text displayed when setting display to empty' );
                    Assert.areSame( '', textField.getDisplayed(), 'getDisplayed returns empty when help text displayed' );
                    Assert.isTrue( target.hasClass( 'empty' ), 'empty class name added to help text' );
                    textField.save();
                    //Assert.isUndefined( textField.get(), 'help text is not saved for get' );

                    textField.display( 'New Value' );
                    Assert.isFalse( target.hasClass( 'empty' ), 'empty class name removed with normal text' );

                    AFrame.DOM.fireEvent( '#noValueFormElement', 'focus' );
                    Assert.areSame( 'New Value', textField.getDisplayed(), 'when a focus happens, updated value is not cleared' );

                    AFrame.DOM.fireEvent( '#noValueFormElement', 'blur' );
                    Assert.areSame( 'New Value', textField.getDisplayed(), 'when blur happens, updated text is not reverted to help text' );

                    textField.set( '' );
                    Assert.areSame( 'No Value Text', target.val(), 'help text displayed when setting display to empty' );
                    Assert.areSame( '', textField.get(), 'setting help text to empty does now allow get to be help text' );
                    Assert.areSame( '', textField.getDisplayed(), 'getDisplayed returns empty string with placeholder' );
                    Assert.isTrue( target.hasClass( 'empty' ), 'empty class name added to help text' );
                    Assert.areSame( '', textField.get(), 'help text is not used for "get" after a "set(\'\')"' );


                }
            }

    } );
})();
