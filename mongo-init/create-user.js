console.log("======= CREATING USER =======");

triggerDatabaseCreation(db);  // for MONGO_INITDB_DATABASE

const initServiceDb = createDatabase("auth-service");
createMainUser(initServiceDb, "auth-service");
const adminServiceDb = createDatabase("admin-service");
createMainUser(adminServiceDb, "admin-service");
const exportCollectionOrchestration = createDatabase("export-collection-orchestration");
createMainUser(exportCollectionOrchestration, "export-collection-orchestration");

function createDatabase(databaseName){
    const currDb = db.getSiblingDB(databaseName);
    triggerDatabaseCreation(currDb);
    console.log(`A NEW DATABASE: ${databaseName} CREATED`)
    return currDb;
}

function triggerDatabaseCreation(currDb){
    currDb.createCollection("init");
    console.log(`DATABASE: ${currDb} CREATION IS TRIGGERED`)
}


function createMainUser(db, dbName){
    const roles = getMainUserRoles(db, [dbName]);
    console.log(roles);

    db.createUser({
      user: 'main-user',
      pwd: '391A0777775C663B07E6B5B7E0886D56',
      roles: roles
    });
    db.grantRolesToUser("main-user", ["listCollectionsRole"])
    console.log(`USER main-user CREATED for ${dbName}`);
}

function getMainUserRoles(db, initialDatabases){
    const numberOfTestWorker = 0;
    const ret = [];
    const previlegesForNewRole = [];
    ret.push({
        role: "readWriteAnyDatabase", db: "admin"
    })

    for (initDb of initialDatabases){
        previlegesForNewRole.push({
            resource: { db: initDb, collection: "" },
            actions: ["listCollections"]
        });
        ret.push({
          role: 'readWrite',
          db: initDb
        });
        // ret.push({
        //   role: 'listCollections',
        //   db: initDb
        // });

        for (let testWorker=1; testWorker <= numberOfTestWorker; testWorker++){
            ret.push({
              role: 'readWrite',
              db: `${initDb}-test-${testWorker}`
            });

             // TODO UPDATE
        }
    }

    db.createRole({
        role: "listCollectionsRole",
        privileges: [
            { resource: { anyResource: true }, actions: ["listCollections"] }
        ],
        roles: []
    });
    return ret;
}



