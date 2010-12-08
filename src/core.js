/**
 * The main AFrame module.  All AFrame related items are under this.
 * @module AFrame
*/

if( !Function.prototype.bind ) {
	Function.prototype.bind = function( context ) {
		var callback = this;
		return function() {
			return callback.apply( context, arguments );
		};
	};
}
  
/**
* Run a function over each element in the array.  Comes from http://userscripts.org/topics/2304?page=1#posts-9660
* @method Array.prototype.forEach
* @param {function} callback - callback to call on each member of the array.  Function will be called with three parameters, item, index, and "this"
* @param {object} context (optional) - optional context to call function in
*/
if (!Array.prototype.forEach)
{
  Array.prototype.forEach = function( callback, context )
  {
    var len = this.length;
	if( typeof callback != "function" ) {
      throw new TypeError();
	}

	for (var i = 0, item; item = this[ i ]; ++i) {
      if ( i in this ) {
		callback.call( context, item, i, this );
      }
    }
  };
}

/**
* if not included in the browsers implementation, add it - finds the index of an element in the array
* @method Array.prototype.indexOf
* @param {variant} element to search for
* @return {number} index if found, -1 otw.
*/
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
	from = from < 0 ? Math.ceil(from) : Math.floor(from);
    if (from < 0) {
      from += len;
	}

    for (; from < len; from++) {
		if (from in this && this[from] === elt) {
			return from;
		}
    }
    return -1;
  };
}

/**
* Convert a Date object to an ISO8601 formatted string
* @method Date.prototype.toISOString
* @return {string} ISO8601 formatted date
*/
if(!Date.prototype.toISOString) {
	Date.prototype.toISOString = function() {
		var pad_two = function(n) {
			return (n < 10 ? '0' : '') + n;
		};
		var pad_three = function(n) {
			return (n < 100 ? '0' : '') + (n < 10 ? '0' : '') + n;
		};
		return [
			this.getUTCFullYear(),
			'-',
			pad_two(this.getUTCMonth() + 1),
			'-',
			pad_two(this.getUTCDate()),
			'T',
			pad_two(this.getUTCHours()),
			':',
			pad_two(this.getUTCMinutes()),
			':',
			pad_two(this.getUTCSeconds()),
			'.',
			pad_three(this.getUTCMilliseconds()),
			'Z'
		].join('');
	};
}

if( !window.console ) {
	window.console = function() {	// do a whole lotta nothin 
	};
}
