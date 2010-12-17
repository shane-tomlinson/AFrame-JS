/**
* Common functions to all arrays
* @class AFrame.ArrayCommonFuncsMixin
* @static
*/
AFrame.ArrayCommonFuncsMixin = {
	/**
	* Get the current count of items.  Should be overridden.
    *
    *    // list is an AFrame.List
    *    var count = list.getCount();
    *
	* @method getCount
	* @return {number} current count
	* @throw 'operation not supported' if not overridden properly.
	*/
	getCount: function() { /* Should be overridden */ 
		throw 'operation not supported';
	},
	
	/**
	 * @private
	 * Given an tentative index, get the index the item would be inserted at
	 * @method getActualInsertIndex
	 * @param {number} index - index to check for
	 */
	getActualInsertIndex: function( index ) {
		var len = this.getCount();

		if( 'undefined' == typeof( index ) ) {
			index = len;
		}
		else if( index < 0 ) {
			index = len + ( index + 1 );
		}
		
		index = Math.max( 0, index );
		index = Math.min( len, index );
		
		return index;
	},

	/**
	 * @private
	 * Given an tentative index, get the item's real index.
	 * @method getActualIndex
	 * @param {number} index - index to check for
	 */
	getActualIndex: function( index ) {
		var len = this.getCount();

		if( index < 0 ) {
			index = len + index;
		}

		index = Math.min( len - 1, index );
		index = Math.max( 0, index );
		
		return index;
	}
};