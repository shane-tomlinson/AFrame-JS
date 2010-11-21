$( function() {
	var dataContainer = AFrame.construct( {
		type: AFrame.DataContainer,
		config: {
			data: {
				name: 'First Field'
			}
		}
	} );

	var formFieldFactory = function( element ) {
		var field = AFrame.construct( {
			type: AFrame.Field,
			config: {
				target: element,
				fieldName: $( element ).attr( 'data-field' ),
				dataContainer: dataContainer
			}
		} );

		return field;
	};

	var form = AFrame.construct( {
		type: AFrame.Form,
		config: {
			target: $( 'body' ),
			formFieldFactory: formFieldFactory
		}
	} );
	
	var collection = AFrame.construct( {
		type: AFrame.MVCArray,
		plugins: [
			{
				type: AFrame.CollectionPluginPersistence,
				config: {
					loadCallback: PersistenceLayer.load
				}
			}
		]
	} );
	
	var list = AFrame.construct( {
		type: AFrame.List,
		config: {
			target: $( '.userList' ),
			createListElementCallback: function( index, data ) {
				return $( '<li>' + data.id + ' - ' + data.name + '</li>' );
			}
		},
		plugins: [
			{
				type: AFrame.ListPluginBindToCollection,
				config: {
					collection: collection
				}
			}
		]
	} );
	
	collection.load();
} );