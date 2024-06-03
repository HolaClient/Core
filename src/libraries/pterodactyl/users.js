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
 
 async function users() {
     try {
         let pterodactyl = await db.get("config")
         if (pterodactyl && pterodactyl.domain && pterodactyl.app) {
             try {
                 let a = 1;
                 let b = 1;
                 let c = [];
                 while (a <= b) {
                     let d = await fetch(`${pterodactyl.domain}/api/application/users?per_page=100&page=${a}&include=servers`, {
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
                 await db.set("pterodactyl-users", c);
                 await db.set("lastcache.pterodactyl-users", Date.now());
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
 
 async function modify(a, b) {
     try {
         let pterodactyl = await db.get("config")
         if (b) {
             await fetch(`${pterodactyl.domain}/api/application/users/${a}`, {
                 method: "PATCH",
                 headers: {
                     "Content-Type": "application/json",
                     Authorization: `Bearer ${pterodactyl.app}`,
                     Accept: "application/json"
                 },
                 body: JSON.stringify(b)
             });
             return { success: true }
         }
     } catch (error) {
         return { success: false, error: error }
     }
 };
 
 async function remove(a) {
     try {
         let pterodactyl = await db.get("config")
         await fetch(`${pterodactyl.domain}/api/application/users/${a}`, {
             method: "DELETE",
             headers: {
                 "Content-Type": "application/json",
                 Authorization: `Bearer ${pterodactyl.app}`,
                 Accept: "application/json"
             }
         });
         return { success: true }
     } catch (error) {
         return { success: false, error: error }
     }
 };

 module.exports = {
     users, delete: remove, modify
 }