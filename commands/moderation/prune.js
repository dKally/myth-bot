const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('apagar')
		.setDescription('Apagar até 99 mensagens.')
		.addIntegerOption(option => option.setName('quantidade').setDescription('Número de mensagems')),
	async execute(interaction) {
		const amount = interaction.options.getInteger('quantidade');

		if (amount < 1 || amount > 99) {
			return interaction.reply({ content: 'You need to input a number between 1 and 99.', ephemeral: true });
		}
		await interaction.channel.bulkDelete(amount, true).catch(error => {
			console.error(error);
			interaction.reply({ content: 'There was an error trying to prune messages in this channel!', ephemeral: true });
		});

		return interaction.reply({ content: `Successfully pruned \`${amount}\` messages.`, ephemeral: true });
	},
};