function testList( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var test = new TestCase( {
		
		name: "TestCase AFrame.List",
		
		setUp: function() {
			this.list = AFrame.construct( {
				type: 'AFrame.List',
				config: {
					target: '#AFrame_List .list',
					template: '#AFrame_List .template'
				}
			} );
		},
		
		tearDown : function () {
			this.list.teardown();
			this.list= null;
			delete this.list;
		},

		testInsert: function() {
			this.list.insert( 0, { field: 'fieldValue'} );
			
		}
	} );

	TestRunner.add( test );
}
    