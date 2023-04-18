console.log("======= CREATING USER =======");

triggerDatabaseCreation(db);
createDatabase("admin-service");

function createDatabase(databaseName){
    const localDb = db.getSiblingDB(databaseName);
    triggerDatabaseCreation(localDb);
    console.log(`A NEW DATABASE: ${databaseName} CREATED`)
}

function triggerDatabaseCreation(localDb){
    localDb.createCollection("init");
    console.log(`DATABASE: ${localDb} CREATION IS TRIGGERED`)
}


function createMainUser(){
    const roles = getMainUserRoles();
    console.log(roles);
    
    db.createUser({
      user: 'main-user',
      pwd: '391A0777775C663B07E6B5B7E0886D56',
      roles: roles
    });
    console.log("USER main-user CREATED");
}

function getMainUserRoles(){
    const initialDatabases = ["auth-service", "admin-service"];
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


createMainUser();
