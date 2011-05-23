$(function() {
    // Instead of creating a model, create a SchemaConfig.
    // A Model in AFrame is an instance of data combined
    // with a Schema.  The schema config will be used when
    // creating the model.
    var friendSchemaConfig = {
        name: { type: 'text' }
    };

    // Our friends collection is an array.  Instead of binding
    // directly to an event on the collection, when creating
    // the list, we bind the list to the collection.
    // The ListPluginBindToCollection will take care of
    // updating of the list.
    var friendsCollection = AFrame.CollectionArray.create( {
        plugins: [ [ AFrame.CollectionPluginModel, {
             schema: friendSchemaConfig
        } ] ]
    } );

    // This is the friends list.  It is bound to the
    // friendsCollection, so any time a model is added or
    //  removed from the friends collection, the list will update.
    var friendsList = AFrame.List.create( {
        target: '#friendList',
        listElementFactory: function( model, index ) {
            return AFrame.DOM.createElement( 'li',
                model.get( 'name' ) );
        },
        plugins: [ [ AFrame.ListPluginBindToCollection, {
             collection: friendsCollection
        } ] ]
    } );

    // we insert into the friendsCollection once we
    // have a name.  The list will be updated automatically.
    $( '#add-friend' ).click( function( event ) {
           var friend_name = prompt("Who is your friend?");
           // A new model will be created when adding
           // to the friend collection.
           friendsCollection.insert( { name: friend_name } );
    } );
});
