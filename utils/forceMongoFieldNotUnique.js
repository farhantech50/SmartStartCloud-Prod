//If MongoDB is forcing a field to be unique, pass the "Collection Handle" and "Field Name" in the function. Need to run it only once.


export const forceMongo = async (collectionHandle,fieldName)=>{
    // Check existing indexes
    const indexes = await collectionHandle.collection.indexes();
     
    // Drop the unique index (if exists)
    await collectionHandle.collection.dropIndex({[fieldName]:1});

    // Create a non-unique index (if required)
    await collectionHandle.collection.createIndex({[fieldName]:1});
}
