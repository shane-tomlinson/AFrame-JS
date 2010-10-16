/**
* Common functions to all arrays
* @class AFrame.ArrayCommonFuncsMixin
* @static
*/
AFrame.ArrayCommonFuncsMixin = {
	/**
	* Get the current count of items.  Should be overridden.
	* @method getCount
	* @return {number} current count
	*/
	getCount: function() { /* Should be overridden */ },
	
	/**
	 * @private
	 * Given an tentative index, get the index the item would be inserted at
	 * @method getActualInsertIndex
	 * @param {number} index - index to check for
	 */
	getActualInsertIndex: function( index ) {
		var len = this.getCount();
		
		if( index < 0 ) {
			index = len + ( index + 1 );
		}
		
		index = Math.max( 0, index );
		index = Math.min( len, index );
		
		return index;
	},

	/**
	 * @private
	 * Given an tentative index, get the index the item would be removed from
	 * @method getActualRemoveIndex
	 * @param {number} index - index to check for
	 */
	getActualRemoveIndex: function( index ) {
		var len = this.getCount();

		if( index < 0 ) {
			index = len + index;
		}

		index = Math.min( len - 1, index );
		index = Math.max( 0, index );
		
		return index;
	}
};