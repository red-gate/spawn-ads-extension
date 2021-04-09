const vscode = require('vscode');
const azdata = require('azdata');
const { v4: uuidv4 } = require('uuid');

const spawnctl = require('./spawnctl')

function activate(context) {
    const connectContainer = vscode.commands.registerCommand('extension.connectSpawnDataContainer', function () {
        spawnctl.getDataContainers().then(dataContainers => {
            if (dataContainers.length === 0) {
                throw 'No data containers exist'
            }
            return dataContainers
        }).then(dataContainers => {
            return vscode.window.showQuickPick(dataContainers)
        }).then(dataContainerName => {
            return spawnctl.getDataContainerEngine(dataContainerName).then(engine => {
                return {dataContainerName, engine}
            })
        }).then(containerDetails => {
            let providerName = undefined

            switch (containerDetails.engine) {
                case 'MSSQL':
                    providerName = 'MSSQL'
                    break
                case 'PostgreSQL':
                    providerName = 'PGSQL'
                    break
                default:
                    throw `Unable to connect to data container ${containerDetails.dataContainerName} because it is an unsupported engine: ${containerDetails.engine}`
            }

            return spawnctl.getDataContainerConnectionString(containerDetails.dataContainerName).then(connectionDetails => {
                if(containerDetails.engine === 'MSSQL'){
                    connectionDetails.host = `${connectionDetails.host},${connectionDetails.port}`
                    connectionDetails.port = null
                }
                return {dataContainerName: containerDetails.dataContainerName, connectionDetails, providerName, engine: containerDetails.engine}
            })
        }).then(containerDetails => {
            const connectionProfile = {
                guid: uuidv4(),
                connectionName: containerDetails.dataContainerName,
                serverName: containerDetails.connectionDetails.host,
                authenticationType: 'SqlLogin',
                groupFullName: '',
                groupId: '',
                password: containerDetails.connectionDetails.password,
                savePassword: true,
                userName: containerDetails.connectionDetails.user,
                providerName: containerDetails.providerName,
                saveProfile: true,
                options: {
                    port: containerDetails.connectionDetails.port
                }
            };
            if(containerDetails.engine === 'MSSQL'){
              connectionProfile.options.trustServerCertificate = true
            }
            azdata.connection.openConnectionDialog(undefined, connectionProfile, { saveConnection: true })
        }).catch(err => {
            vscode.window.showErrorMessage('Failed to get container details: ' + err);
        })
    });

    context.subscriptions.push(connectContainer);
}

function deactivate() {}

exports.activate = activate;
exports.deactivate = deactivate;
