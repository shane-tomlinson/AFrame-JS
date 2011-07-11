AFrame.CollectionPluginREST = (function() {
    var Plugin = AFrame.CollectionPluginPersistence.extend( {
        importconfig: [ 'url', 'net' ],
        loadCallback: function( options ) {
            var me=this;
            me.net.ajax( {
                url: me.url,
                success: options.onComplete
            } );
        },

        addCallback: function( item, options ) {
            var me=this;
            me.net.ajax( {
                url: me.url,
                data: getItemData( item ),
                type: 'POST',
                success: function( body, textStatus, xhr ) {
                    var loc = xhr.getResponseHeader( 'Location' );
                    loc = loc.replace( me.url + '/', '' );
                    setItemData( item, 'id', loc );
                    options.onComplete && options.onComplete();
                }
            } );
        },

        deleteCallback: function( item, options ) {
            var me=this;
            me.net.ajax( {
                url: me.url + '/' + getItemID( item ),
                type: 'DELETE',
                success: options.onComplete
            } );
        },

        saveCallback: function( item, options ) {
            var me=this;
            me.net.ajax( {
                url: me.url + '/' + getItemID( item ),
                data: getItemData( item ),
                type: 'PUT',
                success: options.onComplete
            } );
        }
    } );

    function getItemID( item ) {
        return item.get ? item.get( 'id' ) : item.id;
    }

    function getItemData( item ) {
        return item.toJSON ? item.toJSON() : item;
    }

    function setItemData( item, key, data ) {
        if( item.set ) {
            item.set( key, data );
        }
        else {
            item[ key ] = data;
        }
    }

    return Plugin;
}());
