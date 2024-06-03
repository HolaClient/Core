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

async function nodes() {
    let pterodactyl = await db.get("config")
    if (pterodactyl && pterodactyl.domain && pterodactyl.app) {
        try {
            let a = 1;
            let b = 1;
            let c = [];
            while (a <= b) {
                let d = await fetch(`${pterodactyl.domain}/api/application/nodes?include=allocations,location,servers&per_page=100&page=${a}`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${pterodactyl.app}`,
                    },
                });
                let e = await d.json();
                let k = {}
                for (let i of e.data) {
                    k = i
                    let f = await fetch(`${pterodactyl.domain}/api/application/nodes/${i.attributes.id}/configuration`, {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${pterodactyl.app}`,
                        },
                    });
                    let g = await f.json()
                    let j;
                    try {
                        let h = await fetch(`${i.attributes.scheme}://${i.attributes.fqdn}:${i.attributes.daemon_listen}/api/system?v=2`, {
                            method: "GET",
                            headers: {
                                Accept: "application/json",
                                Authorization: `Bearer ${g.token}`,
                            },
                        });
                        j = await h.json()
                    } catch (error) {
                        console.error(error)
                    }
                    k.attributes["system"] = j
                    k.attributes["configuration"] = g
                    c.push(k);
                }
                b = e.meta.pagination.total_pages;
                a++;
            }
            await db.set("pterodactyl-nodes", c);
            return c
        } catch (error) {
            return { success: false, error: error }
        }
    }
}

async function changeLocation(b, c) {
    let pterodactyl = await db.get("config")
    if (pterodactyl && pterodactyl.domain && pterodactyl.app) {
        try {
            let e = db.get("pterodactyl-nodes")
            let f = e.find(i => i.attributes.id == parseInt(b))
            let g = f.attributes
            delete g["relationships"]
            delete g["system"]
            delete g["configuration"]
            g["location_id"] = c
            let a = await fetch(`${pterodactyl.domain}/api/application/nodes/${b}`, {
                method: "PATCH",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${pterodactyl.app}`,
                },
                body: JSON.stringify(g)
            });
            if (a.ok) {
                nodes()
                return { success: true }
            } else {
                return { success: false, error: await a.json() };
            }
        } catch (error) {
            return { success: false, error: error }
        }
    }
}

module.exports = {
    nodes, changeLocation
}