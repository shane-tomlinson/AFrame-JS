AFrame.CollectionPluginREST = (function() {
    var Plugin = AFrame.CollectionPluginPersistence.extend( {
        importconfig: [ 'root', 'net' ],
        loadCallback: function( options ) {
            var me=this;
            me.net.ajax( {
                url: me.root,
                success: options.onComplete
            } );
        },

        addCallback: function( item, options ) {
            var me=this;
            me.net.ajax( {
                url: me.root,
                data: getItemData( item ),
                type: 'POST',
                success: function( body, textStatus, xhr ) {
                    var loc = xhr.getResponseHeader( 'Location' );
                    loc = loc.replace( me.root + '/', '' );
                    setItemData( item, 'id', loc );
                    options.onComplete && options.onComplete();
                }
            } );
        },

        deleteCallback: function( item, options ) {
            var me=this;
            me.net.ajax( {
                url: me.root + '/' + getItemID( item ),
                type: 'DELETE',
                success: options.onComplete
            } );
        },

        saveCallback: function( item, options ) {
            var me=this;
            me.net.ajax( {
                url: me.root + '/' + getItemID( item ),
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
        return item.getDataObject ? item.getDataObject() : item;
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
