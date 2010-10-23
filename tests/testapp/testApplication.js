$( function() {
	var dataContainer = AFrame.construct( {
		type: 'AFrame.DataContainer',
		config: {
			data: {
				name: 'First Field'
			}
		}
	} );

	var formFieldFactory = function( element ) {
		var field = AFrame.construct( {
			type: 'AFrame.Field',
			config: {
				target: element,
				fieldName: $( element ).attr( 'data-field' ),
				dataContainer: dataContainer
			}
		} );

		return field;
	};

	var form = AFrame.construct( {
		type: 'AFrame.Form',
		config: {
			target: $( 'body' ),
			formFieldFactory: formFieldFactory
		}
	} );
} );