const fs = require('fs').promises;
const path = require('path');

//Function loadEvents pour charger les événements
async function loadEvents(client) {
    const eventFiles = await fs.readdir(path.join(__dirname, '../events'));
    
    for (const file of eventFiles) {
        if (!file.endsWith('.js')) continue;
        
        const event = require(`../events/${file}`);
        const eventName = file.split('.')[0];
        
        if (event.once) {
            client.once(eventName, (...args) => event.execute(...args, client));
        } else {
            client.on(eventName, (...args) => event.execute(...args, client));
        }
        
        client.events.set(eventName, event);
        console.log(`🌟 Event loaded: ${eventName}`);
    }
}

module.exports = { loadEvents }; 