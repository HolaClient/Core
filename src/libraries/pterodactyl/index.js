/**
 *--------------------------------------------------------------------------------
 *  _    _       _        _____ _ _            _      _____              __   __
 * | |  | |     | |      / ____| (_)          | |    / ____|             \ \ / /
 * | |__| | ___ | | __ _| |    | |_  ___ _ __ | |_  | |     ___  _ __ ___ \ V / 
 * |  __  |/ _ \| |/ _` | |    | | |/ _ \ '_ \| __| | |    / _ \| '__/ _ \ > <  
 * | |  | | (_) | | (_| | |____| | |  __/ | | | |_  | |___| (_) | | |  __// . \ 
 * |_|  |_|\___/|_|\__,_|\_____|_|_|\___|_| |_|\__|  \_____\___/|_|  \___/_/ \_\
 *--------------------------------------------------------------------------------
 *
 * https://core.holaclient.io/X
 * https://github.com/HolaClient/Core
 * https://discord.gg/CvqRH9TrYK
 * 
 * @author CR072 <crazymath072.tech>
 * @copyright 2022-2024 HolaClient
 * @version 1
 *--------------------------------------------------------------------------------
 */

const db = require('../../utils/database')
const servers = require('./servers')
const nodes = require('./nodes')
const eggs = require('./eggs')
const locations = require('./locations')
const users = require('./users')

module.exports = {
    "servers": {
        "get": async function (a) {
            let c = await db.get("pterodactyl-servers")
            if (!c) c = await servers.servers()
            let b;
            if (typeof a == "number") {
                b = c.find(i => i.attributes.id === parseInt(a))
            } else {
                b = c.find(i => i.attributes.identifier === a)
            }
            return b ?? ""
        },
        "getAll": async function () {
            let a = await db.get("pterodactyl-servers")
            if (!a) a = await servers.servers()
            return a || []
        },
        "suspend": async function (a, b) {
            return await servers.suspend(a, b) || { success: false, error: 0 }
        },
        "assign": async function (a, b) {
            return await servers.assign(a, b) || { success: false, error: 0 }
        },
        "files": {
            "get": async function (a) {
                let b = await db.get("pterodactyl-files")
                if (!b) b = await servers.files()
                let c = b[a]
                return c ?? []
            },
            "getAll": async function () {
                let c = db.get("pterodactyl-files")
                if (!c) c = await servers.files()
                return c || {}
            },
        },
        "console": servers.consoleWS,
        "changeState": async function (a, b) {
            return await servers.changeState(a, b) || { success: false, error: 0 }
        },
        "sendCommand": async function (a, b) {
            return await servers.sendCommand(a, b) || { success: false, error: 0 }
        }
    },
    "nodes": {
        "get": async function (a) {
            let c = await db.get("pterodactyl-nodes")
            if (!c) c = await nodes.nodes()
            let b = c.find(i => i.attributes.id === parseInt(a))
            return b ?? ""
        },
        "getAll": async function () {
            let a = await db.get("pterodactyl-nodes")
            if (!a) a = await nodes.nodes()
            return a || []
        },
        "getConfig": async function (a) {
            let c = await db.get("pterodactyl-nodes")
            if (!c) c = await nodes.nodes()
            let b = c.find(i => i.attributes.id === parseInt(a))
            return b.attributes.configuration ?? ""
        },
        "getSystemInfo": async function (a) {
            let c = await db.get("pterodactyl-nodes")
            if (!c) c = await nodes.nodes()
            let b = c.find(i => i.attributes.id === parseInt(a))
            return b.attributes.system ?? ""
        },
        "changeLocation": async function (a, b) {
            let c = await nodes.changeLocation(a, b)
            return c
        },
    },
    "nests": {
        "get": async function (a) {
            let c = await db.get("pterodactyl-eggs")
            if (!c) c = await eggs.eggs()
            let b = c.find(i => i.attributes.id === parseInt(a))
            return b ?? ""
        },
        "getAll": async function () {
            let a = await db.get("pterodactyl-eggs")
            if (!a) a = await eggs.eggs()
            return a || []
        }
    },
    "eggs": {
        "get": async function (a) {
            let b = await db.get("pterodactyl-eggs")
            if (!b) b = await eggs.eggs()
                let d;
            b.forEach(i => {
                let c = i.attributes.relationships.eggs.data.find(j => j.attributes.id === parseInt(a))
                if (c) {
                    d = c
                    return c
                }
            });
            return d
        },
        "getAll": async function (b) {
            let a = await db.get("pterodactyl-eggs")
            if (!a) a = await eggs.eggs()
            let c = a.find(i => i.attributes.id === parseInt(b))
            return c.attributes.relationships.eggs.data || []
        }
    },
    "locations": {
        "get": async function (a) {
            let b = await db.get("pterodactyl-locations")
            if (!b) b = await locations.locations()
            let c = b.find(i => i.attributes.id === parseInt(a))
            return c || ""
        },
        "getAll": async function (b) {
            let a = await db.get("pterodactyl-locations")
            if (!a) a = await locations.locations()
            let c = a.find(i => i.attributes.id === parseInt(b))
            return c.attributes.relationships.eggs.data || []
        },
        "modify": locations.modifySettings,
        "create": locations.createLocation,
        "delete": locations.deleteLocation
    },
    "users": {
        "get": async function (a) {
            let c = await db.get("pterodactyl-users")
            if (!c) c = await users.users()
            let b;
            if (typeof a == "number") {
                b = c.find(i => i.attributes.id === parseInt(a))
            } else {
                b = c.find(i => i.attributes.uuid === a)
            }
            return b ?? ""
        },
        "getAll": async function () {
            let a = await db.get("pterodactyl-users")
            if (!a) a = await users.users()
            return a || []
        },
        "modify": async function (a, b) {
            return await users.modify(a, b) || { success: false, error: 0 }
        },
        "delete": async function (a) {
            return await users.delete(a) || { success: false, error: 0 }
        },
        "servers": async function (a) {
            let c = await db.get("pterodactyl-users")
            if (!c) c = await users.users()
            let b;
            if (typeof a == "number") {
                b = c.find(i => i.attributes.id === parseInt(a))
            } else {
                b = c.find(i => i.attributes.uuid === a)
            }
            return b.attributes.relationships.servers.data ?? ""
        },
    },
    "refresh": function () {
        servers.servers(),
        locations.locations(),
        users.users(),
        nodes.nodes(),
        eggs.eggs()
    }
}