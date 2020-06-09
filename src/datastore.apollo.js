// Datastore
// A namespace where users
// could store data related to their
// devices and app

// Pipeline interface
class pipeline{
    // Constructor
    constructor(handlers, name, query) {
        // Configuration
        this.post = handlers.post;
        this.duplex = handlers.duplex;

        // Store the collection name and query
        this.collection = name;
        this.query = query;
    }

    match(filter) {
        // Method to add match stage to 
        // the query and return a new pipeline
        this.query.push({
            type: "match",
            filter: filter
        });

        // Return a new pipeline
        return new pipeline({post: this.post, duplex: this.duplex}, this.collection, this.query);
    }

    project(specs) {
        // Method to add project stage to 
        // the query and return a new pipeline
        this.query.push({
            type: "project",
            specs: specs
        });

        // Return a new pipeline
        return new pipeline({post: this.post, duplex: this.duplex}, this.collection, this.query);
    }

    group(condition, fields) {
        // Method to add group stage to 
        // the query and return a new pipeline
        this.query.push({
            type: "group",
            condition: condition,
            fields: fields
        });

        // Return a new pipeline
        return new pipeline({post: this.post, duplex: this.duplex}, this.collection, this.query);
    }

    sort(specs) {
        // Method to add sort stage to 
        // the query and return a new pipeline
        this.query.push({
            type: "sort",
            specs: specs,
        });

        // Return a new pipeline
        return new pipeline({post: this.post, duplex: this.duplex}, this.collection, this.query);
    }
    
    execute(pageNumber) {
        // Method to finally send request
        // to execute the pipeline
        return this.duplex.send( {
            header: {
                task: "pipelineDocumentsDatastore"
            },
            payload: {
                collection: this.collection,
                pipeline: this.query,
                pageNumber: pageNumber
            }
        });
    }
}

// Collection interface
class collection{
    // Constructor
    constructor(handlers, name) {
        // Configuration
        this.post = handlers.post;
        this.duplex = handlers.duplex;
        this.collection = name;
    }

    insert(documents) {
        // Method to insert documents to datastore
        return this.duplex.send( {
            header: {
                task: "insertDocumentsDatastore"
            },
            payload: {
                collection: this.collection,
                documents: documents
            }
        });
    }

    delete(filter) {
        // Method to delete documents from datastore
        return this.duplex.send( {
            header: {
                task: "deleteDocumentsDatastore"
            },
            payload: {
                collection: this.collection,
                filter: filter
            }
        });
    }

    search(filter, projection, pageNumber) {
        // Method to search documents from datastore
        return this.duplex.send( {
            header: {
                task: "searchDocumentsDatastore"
            },
            payload: {
                collection: this.collection,
                filter: filter,
                projection: projection,
                pageNumber: pageNumber
            }
        });
    }

    pipeline() {
        // Method to setup a pipeline
        // which will allow the users to stage
        // different quaries togehter and execute together
        return new pipeline({post: this.post, duplex: this.duplex}, this.collection, []);
    }
}

// Datastore class
class datastore{
    // Constructor
    constructor(handlers) {
        // Configuration
        this.post = handlers.post;
        this.duplex = handlers.duplex;
    }

    collection(name) {
        // Default method to get
        // reference to a collection by passing in
        // collection name and handlers
        return new collection({post: this.post, duplex: this.duplex}, name);
    }

    listCollections() {
        // Method to list all collections
        return this.duplex.send( {
            header: {
                task: "listCollectionsDatastore"
            }
        });
    }

    dropCollection(name) {
        // Method to drop a collection
        return this.duplex.send( {
            header: {
                task: "dropCollectionDatastore"
            },
            payload: {
                collectionName: name
            }
        });
    }
}

export default datastore;