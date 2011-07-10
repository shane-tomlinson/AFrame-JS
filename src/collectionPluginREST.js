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
                data: item,
                type: 'POST',
                success: options.onComplete
            } );
        },

        deleteCallback: function( item, options ) {
            var me=this;
            me.net.ajax( {
                url: me.root + '/' + item.id,
                type: 'DEL',
                success: options.onComplete
            } );
        },

        saveCallback: function( item, options ) {
            var me=this;
            me.net.ajax( {
                url: me.root + '/' + item.id,
                data: item,
                type: 'PUT',
                success: options.onComplete
            } );
        }
    } );

    return Plugin;
}());
