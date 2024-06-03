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
 const server = require('../../server')
 
 module.exports = {
     "app": server,
     "cookies": {
        "get": function (req, a) {
            let b = req.headers.cookie;
            if (!b) return null;
            let d = a + "=";
            let ca = b.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(d) == 0) {
                    return decodeURIComponent(c.substring(d.length, c.length));
                }
            }
            return "";
        },
        "set": function (res, a, b) {
            let c = `${encodeURIComponent(a)}=${encodeURIComponent(b)}`;
            c += `; Max-Age=${30 * 24 * 60 * 60}`;
            c += `; Path=/`;
            c += `; Secure`;
            c += `; SameSite=Strict`;
            res.setHeader('Set-Cookie', c);
        },
        "delete": function (res, a) {
            let c = `${encodeURIComponent(a)}=;`;
            c += `; Max-Age=0`;
            c += `; Path=/`;
            c += `; Secure`;
            c += `; SameSite=Strict`;
            res.setHeader('Set-Cookie', c);
        }
     }
 }