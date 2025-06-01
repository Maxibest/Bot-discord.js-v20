//class Command pour les commandes slash
class Command {
    constructor(options) {
        this.name = options.name;
        this.description = options.description;
        this.category = options.category;
        this.permissions = options.permissions || [];
        this.cooldown = options.cooldown || 3000;
    }

    async execute(interaction) {
        throw new Error(`Command ${this.name} doesn't have an execute() method`);
    }
}

module.exports = Command; 