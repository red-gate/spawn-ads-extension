const exec = require('child_process').exec
const os = require('os')
const which = require('which')

const resourceNotFoundExitcode = 2

let spawnCtlExeName = 'spawnctl'
if (os.platform() === "win32") {
    spawnCtlExeName = 'spawnctl.exe'
}

function isSpawnInstalled(){
    try{
        which.sync(spawnCtlExeName)
        return true
    } catch (error) {
        return false
    }
}

function spawnCtlPath(){
    return which.sync(spawnCtlExeName)
}

function getDataContainers(){
    var promise = new Promise(function(resolve, reject){
        if(isSpawnInstalled()){
            const executablePath = spawnCtlPath()
            exec(executablePath + ' get data-containers -o json', function(error, stdout, stderr){
                if(error){
                    if (error.code == resourceNotFoundExitcode){
                        resolve([])
                        return
                    }
                    reject(error)
                    return
                }

                if(stderr){
                    reject(stderr)
                    return
                }

                if(stdout === 'No resources found.'){
                    resolve([])
                    return
                }

                try{
                    var containers = JSON.parse(stdout)
                    resolve(containers.map(x => x.name))
                }
                catch(jsonErr){
                    reject('Error retrieving spawn containers: ' + jsonErr)
                }
            })
        } else {
            reject(`spawnctl is not installed or could not be found. Please ensure spawnctl is installed and available on the path. See https://spawn.cc/docs/getting-started for more information.`)
        }
    })

    return promise
}

function getDataContainerConnectionString(containerName){
    var promise = new Promise(function(resolve, reject){
        if(isSpawnInstalled()) {
            const executablePath = spawnCtlPath()
            exec(executablePath + ` get data-container ${containerName} -o json`, function(error, stdout, stderr){
                if(error){
                    if (error.code == resourceNotFoundExitcode){
                        reject(`No container with name ${containerName} found`)
                        return
                    }
                    reject(error)
                    return
                }

                if(stderr){
                    reject(stderr)
                    return
                }

                if(stdout === 'No resources found.'){
                    reject(`No container with name ${containerName} found`)
                    return
                }

                try{
                    var dataContainer = JSON.parse(stdout)
                    resolve(dataContainer)
                }
                catch(jsonErr){
                    reject(`Error getting connection string for container ${containerName}: ${jsonErr}`)
                }
            })   
        } else {
            reject(`spawnctl is not installed or could not be found. Please ensure spawnctl is installed and available on the path. See https://spawn.cc/docs/getting-started for more information.`)
        }
    })

    return promise
}

function getDataContainerEngine(containerName){
    var promise = new Promise(function(resolve, reject){
        if(isSpawnInstalled()) {
            const executablePath = spawnCtlPath()
            exec(executablePath + ` get data-container ${containerName} -o json`, function(error, stdout, stderr){
                if(error){
                    if (error.code == resourceNotFoundExitcode){
                        reject(`No container with name ${containerName} found`)
                        return
                    }
                    reject(error)
                    return
                }

                if(stderr){
                    reject(stderr)
                    return
                }

                try{
                    var dataContainer = JSON.parse(stdout)
                    resolve(dataContainer.engine)
                }
                catch(jsonErr){
                    reject(`Error getting data container engine for container ${containerName}: ${jsonErr}`)
                }
                
            })
        } else {
            reject(`spawnctl is not installed or could not be found. Please ensure spawnctl is installed and available on the path. See https://spawn.cc/docs/getting-started for more information.`)
        }
    })

    return promise
}

module.exports = {
    getDataContainers,
    getDataContainerConnectionString,
    getDataContainerEngine
}
