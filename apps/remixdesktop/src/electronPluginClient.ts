import { ClientConnector, connectClient, applyApi, Client, PluginClient } from '@remixproject/plugin'
import type { Message, Api, ApiMap } from '@remixproject/plugin-utils'
import { IRemixApi } from '@remixproject/plugin-api'
import { ipcMain } from 'electron'
import { mainWindow } from '.'

export class ElectronPluginConnector implements ClientConnector {

    /** Send a message to the engine */
    send(message: Partial<Message>) {
        console.log('ElectronPluginConnector send', message)
        mainWindow.webContents.send('fsClient:send', message)
    }

    /** Listen to message from the engine */
    on(cb: (message: Partial<Message>) => void) {
        console.log('ElectronPluginConnector on', cb)
    }
}

export const createClient = <
    P extends Api,
    App extends ApiMap = Readonly<IRemixApi>
>(client: PluginClient<P, App> = new PluginClient()): Client<P, App> => {
    const c = client as any
    connectClient(new ElectronPluginConnector(), c)
    applyApi(c)
    return c
}