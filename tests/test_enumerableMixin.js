testsToRun.push( {
	 
		name: "TestCase AFrame.EnumerableMixin",
        
        setUp: function() {
            this.enumerable = {
                data: [],
                forEach: function( callback ) {
                    this.data.forEach( callback );
                }
            };
            
            AFrame.mixin( this.enumerable, AFrame.EnumerableMixin );
        },

        testFilter: function() {
            var items = [ {
				cid: 1,
				field: 'field1'
			}, {
				cid: 2,
				field: 'field2',
                duplicate: 'duplicate'
			}, {
				cid: 3,
				field: 'field3',
                duplicate: 'duplicate'
			} ];
            
            this.enumerable.data = items;
            
            var filteredSet = this.enumerable.filter( function( item, cid ) {
                return item.field == 'field3';
            } );
            
            Assert.isArray( filteredSet, 'filtered set is an array' );
            Assert.areEqual( 1, filteredSet.length, 'filtered set has one found item' );
            Assert.areEqual( items[ 2 ], filteredSet[ 0 ], 'item is the correct item found' );

            filteredSet = this.enumerable.filter( function( item, cid ) {
                return item.field == 'field4';
            } );
            
            Assert.isArray( filteredSet, 'filtered set is an array' );
            Assert.areEqual( 0, filteredSet.length, 'filtered set has no found items' );

            filteredSet = this.enumerable.filter( function( item, cid ) {
                return item.duplicate == 'duplicate';
            } );
            
            Assert.areEqual( 2, filteredSet.length, 'filtered set has two found items' );
        },
        
        testSearch: function() {
            var items = [ {
				cid: 1,
				field: 'field1'
			}, {
				cid: 2,
				field: 'field2',
                duplicate: 'duplicate'
			}, {
				cid: 3,
				field: 'field3',
                duplicate: 'duplicate'
			} ];
            
            this.enumerable.data = items;
            
            var item = this.enumerable.search( function( item, cid ) {
                return item.field == 'field3';
            } );
            
            Assert.areEqual( items[ 2 ], item, 'item is the correct item found' );

            item = this.enumerable.search( function( item, cid ) {
                return item.field == 'field4';
            } );
            
            Assert.isUndefined( item, 'item was not found, return undefined' );

            item = this.enumerable.search( function( item, cid ) {
                return item.duplicate == 'duplicate';
            } );
            
            Assert.areEqual( item, items[ 1 ], 'with duplicate items, first item is returned' );
        }
        
		

} );
