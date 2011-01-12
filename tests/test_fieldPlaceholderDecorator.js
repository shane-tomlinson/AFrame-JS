(function(){
        var input = document.createElement( 'input' );
        var html5Support = ( 'placeholder' in input );

        testsToRun.push( {

		
		    name: "TestCase AFrame.FieldPlaceholderDecorator",
            
		    testPlaceholderTextHTML5Support: function() {
                if( html5Support ) {
                    var target = $( '#noValueFormElement' );
                    target.val( '' );
                    
                    var textField = AFrame.construct( {
                        type: AFrame.Field,
                        config: {
                            target: target
                        }
                    } );

                    Assert.areSame( '', textField.get(), 'correct get' );
                    Assert.areSame( '', textField.getDisplayed(), 'help text not displayed for browsers supporting HTML5 spec' );
                }
		    },
            
            testPlaceholderTextNoHTML5Support: function() {
                if( !html5Support ) {
                    var target = $( '#noValueFormElement' );
                    target.val( '' );
                    
                    var textField = AFrame.construct( {
                        type: AFrame.Field,
                        config: {
                            target: target
                        }
                    } );

                    Assert.areSame( '', textField.get(), 'correct get' );
                    Assert.areSame( 'No Value Text', textField.getDisplayed(), 'help text displayed' );
                    Assert.isTrue( target.hasClass( 'empty' ), 'empty class name added to help text' );
                    
                    target.trigger( 'focus' );
                    Assert.areSame( '', textField.getDisplayed(), 'when a focus happens, help text is cleared' );
                    
                    target.trigger( 'blur' );
                    Assert.areSame( 'No Value Text', textField.getDisplayed(), 'help text displayed on blur' );
                    Assert.isTrue( target.hasClass( 'empty' ), 'empty class name added to help text' );
                    textField.save();
                    Assert.areSame( '', textField.get(), 'help text is not saved for get' );
                    
                    textField.display( 'New Value' );
                    Assert.isFalse( target.hasClass( 'empty' ), 'empty class name removed with normal text' );
                    
                    target.trigger( 'focus' );
                    Assert.areSame( 'New Value', textField.getDisplayed(), 'when a focus happens, updated value is not cleared' );
                    
                    target.trigger( 'blur' );
                    Assert.areSame( 'New Value', textField.getDisplayed(), 'when blur happens, updated text is not reverted to help text' );
                    
                    textField.set( '' );
                    Assert.areSame( 'No Value Text', textField.getDisplayed(), 'help text displayed when setting display to empty' );
                    Assert.isTrue( target.hasClass( 'empty' ), 'empty class name added to help text' );			
                }
            }

    } );
})();
