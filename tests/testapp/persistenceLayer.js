/**
* Sample persistence layer
* @class PersistenceLayer
* @static
*/
var PersistenceLayer = {
	load: function( meta, callback ) {
		
		if( callback ) {
			callback( PersistenceLayer.SampleData );
		}
	}
};

PersistenceLayer.SampleData = [
	{
		id: 1,
		name: 'Charlotte Tomlinson',
		sex: 'f'
	},
	{
		id: 2,
		name: 'Shane Tomlinson',
		sex: 'm'
	}
];