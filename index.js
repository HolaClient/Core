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

const db = require('./src/utils/database');
const pterodactyl = require('./src/libraries/pterodactyl/index');
const core = require('./src/libraries/core/index');

let config = { configured: false };

const configure = async (domain, app, acc, refresh, interval) => {
    try {
        config = {
            pterodactyl: {
                domain: domain.endsWith("/") ? domain.slice(0, -1) : domain,
                app,
                acc
            },
            configured: true,
            refresh: refresh || true,
            interval: interval ?? 300000
        };
        if (config.refresh == true) {
            setInterval(pterodactyl.refresh, config.interval);
            pterodactyl.refresh();
        }
        await db.set("config", config.pterodactyl);
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
};
module.exports = { config, pterodactyl, core, configure }; 