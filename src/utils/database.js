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

const fs = require('fs').promises;
const path = require("path")

function set(a, b) {
    const c = path.join(__dirname, '../../storage/cache/', `${a}.json`);
    return fs.writeFile(c, JSON.stringify(b, null, 2))
        .catch(e => {
            if (e.code === 'ENOENT') {
                return fs.writeFile(c, JSON.stringify(b, null, 2));
            } else {
                console.error('Error in set:', e);
                throw e;
            }
        });
}

function get(a) {
    const c = path.join(__dirname, '../../storage/cache/', `${a}.json`);
    return fs.readFile(c, 'utf-8')
        .then(d => JSON.parse(d || '{}'))
        .catch(f => {
            if (f.code === 'ENOENT') {
                return fs.writeFile(c, JSON.stringify({}, null, 2)).then(() => undefined);
            } else {
                console.error('Error in get:', f);
                throw f;
            }
        });
}

function remove(a) {
    const c = path.join(__dirname, '../../storage/cache/', `${a}.json`);
    return fs.readFile(c, 'utf-8')
        .then(d => {
            const e = JSON.parse(d || '{}');
            if (e !== undefined) {
                delete e;
                return fs.writeFile(c, JSON.stringify(e, null, 2)).then(() => true);
            } else {
                return false;
            }
        })
        .catch(f => {
            console.error('Error in remove:', f);
            throw f;
        });
}

module.exports = { get, set, delete: remove };