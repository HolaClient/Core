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

async function eggs() {
    try {
        let pterodactyl = await db.get("config")
        if (pterodactyl && pterodactyl.domain && pterodactyl.app) {
            try {
                let a = 1;
                let b = 1;
                let c = [];
                while (a <= b) {
                    let d = await fetch(`${pterodactyl.domain}/api/application/nests?include=eggs&per_page=100&page=${a}`, {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${pterodactyl.app}`,
                        },
                    });
                    let e = await d.json();
                    for (let i of e.data) {
                        let f = await fetch(`${pterodactyl.domain}/api/application/nests/${i.attributes.id}/eggs?include=config,script,variables`, {
                            method: "GET",
                            headers: {
                                Accept: "application/json",
                                Authorization: `Bearer ${pterodactyl.app}`,
                            },
                        });
                        let g = await f.json()
                        i.attributes.relationships.eggs = g
                        c.push(i)
                    }
                    b = e.meta.pagination.total_pages;
                    a++;
                }
                await db.set("pterodactyl-eggs", c);
                return c
            } catch (error) {
                return { success: false, error: error}
            }
        } else {
            return { success: false, error: 0}
        }
    } catch (error) {
        console.error(error)
        return { success: false, error: error}
    }
};

module.exports = {
    eggs
}