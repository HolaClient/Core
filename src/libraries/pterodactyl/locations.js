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

async function locations() {
    let pterodactyl = await db.get("config")
    if (pterodactyl && pterodactyl.domain && pterodactyl.app) {
        try {
            let a = 1;
            let b = 1;
            let c;
            while (a <= b) {
                let d = await fetch(`${pterodactyl.domain}/api/application/locations?include=servers&per_page=100&page=${a}`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${pterodactyl.app}`,
                    },
                });
                let e = await d.json();
                c = e.data || []
                b = e.meta.pagination.total_pages;
                a++;
            }
            await db.set("pterodactyl-locations", c);
            return c
        } catch (error) {
            return { success: false, error: error }
        }
    }
}

async function modifySettings(b, c) {
    let pterodactyl = await db.get("config")
    if (pterodactyl && pterodactyl.domain && pterodactyl.app) {
        try {
            let a = await fetch(`${pterodactyl.domain}/api/application/locations/${b}`, {
                method: "PATCH",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${pterodactyl.app}`,
                },
                body: JSON.stringify(c)
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

async function deleteLocation(b) {
    let pterodactyl = await db.get("config")
    if (pterodactyl && pterodactyl.domain && pterodactyl.app) {
        try {
            let a = await fetch(`${pterodactyl.domain}/api/application/locations/${b}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${pterodactyl.app}`,
                }
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

async function createLocation(b) {
    if (!b.short) return { success: false, error: "Field 'short' is required!" }
    let pterodactyl = await db.get("config")
    if (pterodactyl && pterodactyl.domain && pterodactyl.app) {
        try {
            let a = await fetch(`${pterodactyl.domain}/api/application/locations`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${pterodactyl.app}`,
                },
                body: JSON.stringify({
                    short: b.short,
                    long: b.long
                })
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
    locations, modifySettings, deleteLocation, createLocation
}