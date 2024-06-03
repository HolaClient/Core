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
const consoleWS = require('./console')

async function servers() {
    try {
        let pterodactyl = await db.get("config")
        if (pterodactyl && pterodactyl.domain && pterodactyl.app) {
            try {
                let a = 1;
                let b = 1;
                let c = [];
                while (a <= b) {
                    let d = await fetch(`${pterodactyl.domain}/api/application/servers?per_page=100&page=${a}`, {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${pterodactyl.app}`,
                        },
                    });
                    let e = await d.json();
                    c.push(...e.data);
                    b = e.meta.pagination.total_pages;
                    a++;
                }
                await db.set("pterodactyl-servers", c);
                return c
            } catch (error) {
                return { success: false, error: error }
            }
        } else {
            return { success: false, error: 0 }
        }
    } catch (error) {
        return { success: false, error: error }
    }
};

async function suspend(a, b) {
    try {
        let pterodactyl = await db.get("config")
        if (b) {
            await fetch(`${pterodactyl.domain}/api/application/servers/${a.attributes.id}/details`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${pterodactyl.app}`,
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    "name": a.attributes.name,
                    "user": a.attributes.user,
                    "description": b
                })
            });
        }
        await fetch(`${pterodactyl.domain}/api/application/servers/${a.attributes.id}/suspend`, {
            "method": "POST",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${pterodactyl.app}`,
            }
        });
        core.log(`${a.attributes.name} ${b}`);
    } catch (error) {
        return { success: false, error: error }
    }
};

async function assign(a, b) {
    try {
        let pterodactyl = await db.get("config")
        if (b) {
            await fetch(`${pterodactyl.domain}/api/application/servers/${a.id}/details`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${pterodactyl.app}`,
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    "name": a.name,
                    "user": parseInt(b),
                })
            });
        }
    } catch (error) {
        return { success: false, error: error }
    }
};

async function remove(a) {
    try {
        let pterodactyl = await db.get("config")
        await fetch(`${pterodactyl.domain}/api/application/servers/${a}/force`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${pterodactyl.app}`,
                Accept: "application/json"
            }
        });
        return
    } catch (error) {
        return { success: false, error: error }
    }
};

async function files() {
    try {
        let pterodactyl = await db.get("config")
        if (pterodactyl && pterodactyl.domain && pterodactyl.app) {
            const d = await ptero.servers.getAll()
            await Promise.all(d.map(async (c) => {
                let a = await directory(c, "", pterodactyl);
                let b = await cacheDB.get("pterodactyl-files") || {};
                b[c.attributes.identifier] = a;
                await cacheDB.set("pterodactyl-files", b);
            }));
        }
    } catch (error) {
        return { success: false, error: error }
    }
}

async function directory(f, g, pterodactyl) {
    try {
        let e = [];
        let a = await fetch(`${pterodactyl.domain}/api/client/servers/${f.attributes.identifier}/files/list?directory=${g}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${pterodactyl.acc}`,
            },
        });
        let b = await a.json();
        if (!Array.isArray(b.data)) return e;
        await Promise.all(b.data.map(async (c) => {
            e.push(c);
            if (c.attributes.mimetype === "inode/directory") {
                let d = await directory(f, `${g}/${c.attributes.name}`);
                e.push(d);
            }
        }));
        return e;
    } catch (error) {
        return {};
    }
}

async function changeState(a, b) {
    let pterodactyl = await db.get("config")
    if (pterodactyl && pterodactyl.domain && pterodactyl.acc) {
        try {
            let d = await fetch(`${pterodactyl.domain}/api/client/servers/${a}/power`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${pterodactyl.acc}`,
                },
                body: JSON.stringify({ signal: b })
            });
            return { success: true }
        } catch (error) {
            return { success: false, error: error }
        }
    }
};

async function sendCommand(a, b) {
    let pterodactyl = await db.get("config")
    if (pterodactyl && pterodactyl.domain && pterodactyl.acc) {
        try {
            let d = await fetch(`${pterodactyl.domain}/api/client/servers/${a}/command`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${pterodactyl.acc}`,
                },
                body: JSON.stringify({ command: b })
            });
            if (d.ok) {
                let e = await d.json()
                return { success: true, data: e }
            } else {
                return { success: false, error: d.json() }
            }
        } catch (error) {
            return { success: false, error: error }
        }
    }
};

module.exports = {
    servers, suspend, assign, delete: remove, files, changeState, sendCommand, consoleWS
}