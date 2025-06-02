const { SlashCommandBuilder } = require("@discordjs/builders");
const Command = require(`../structures/Command`);

class JokeCommand extends Command {
  constructor() {
    super({
      name: "joke",
      description: "Je te raconte une blague",
    });
  
    this.data = new SlashCommandBuilder()
    .setName("joke")
    .setDescription("Je te raconte une blague");
  }
  async execute(exec) {
    try {
      const response = await fetch("https://v2.jokeapi.dev/joke/Any?lang=fr");
      const data = await response.json();

      let joke;

      if (data.type === "single") {
        joke = data.joke;
      } else {
        joke = `${data.setup}\n||${data.delivery}||`;
      }

      await exec.reply(joke); 
    } catch (err) {
      console.error("Une erreur est survenue lors de la récupération de la blague :", err);
      await exec.reply({content: "😅 Désolé j'ai eu un petit souci, essaie plus tard !", flags: 64});
    }
  }
};

module.exports = new JokeCommand();
