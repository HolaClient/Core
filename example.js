const hcx = require('./index')
const app = hcx.core.app()

(async () => {
    //Configuring Pterodactyl
    hcx.configure("http://127.0.0.1", "ptla_ScZtiSgjWX7gub30ttK8Gw28ZrKtKqp4T4F3s36YIXj", "ptlc_5i06sPoglPgucLfyIticpCcxOO8vgr0bZeDzB5vYvfM")
    
    //Showing Hello World on all endpoints
    app.all("*", async (req, res) => {
        return res.json({ "hello": "world" })
    });

    //Opening up a websocket
    app.ws("/ws", async (req, res, ws) => {
        try {
            ws.on('message', async (event) => {
                console.log(JSON.parse(event))
            });
            ws.on('close', () => {
                console.log("Connection closed!")
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    //Creating a static endpoint
    app.static('/storage', './storage');

    //Starting the application at port 2001
    app.listen(2001, () => {
        console.log("Server started on port 2001")
    });
})();