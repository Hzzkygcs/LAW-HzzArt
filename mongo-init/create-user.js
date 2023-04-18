console.log("======= CREATING USER =======");

triggerDatabaseCreation(db);  // for MONGO_INITDB_DATABASE

const initServiceDb = createDatabase("auth-service");
createMainUser(initServiceDb, "auth-service");
const adminServiceDb = createDatabase("admin-service");
createMainUser(adminServiceDb, "admin-service");

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
    const roles = getMainUserRoles([dbName]);
    console.log(roles);
    
    db.createUser({
      user: 'main-user',
      pwd: '391A0777775C663B07E6B5B7E0886D56',
      roles: roles
    });
    console.log(`USER main-user CREATED for ${dbName}`);
}

function getMainUserRoles(initialDatabases){
    const numberOfTestWorker = 0;
    const ret = [];
    
    for (initDb of initialDatabases){
        ret.push({
          role: 'readWrite',
          db: initDb
        });
        
        for (let testWorker=1; testWorker <= numberOfTestWorker; testWorker++){
            ret.push({
              role: 'readWrite',
              db: `${initDb}-test-${testWorker}`
            });
        }
    }
    return ret;
}



