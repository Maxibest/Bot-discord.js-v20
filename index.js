require('dotenv').config();
const DiscordClient = require('./src/structures/DiscordClient'); //Importation du client

//Création du client
const client = new DiscordClient();

//Gestion des erreurs non gérées
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

//Initialisation du client
client.initialize().catch(console.error);