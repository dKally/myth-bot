const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Provides information about the user.'),
  async execute(interaction) {
    const user = interaction.user;
    const joinedAt = new Date(interaction.member.joinedAt);

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'short',
    };

    const formattedJoinDate = new Intl.DateTimeFormat('en-US', options).format(joinedAt);

    const embed = {
      title: user.username,
      fields: [
        {
          name: 'Data de entrada no servidor:',
          value: formattedJoinDate,
        },
      ],
      thumbnail: {
        url: user.displayAvatarURL({ dynamic: true, format: 'png' }),
      },
      color: 0x9900ff,
    };

    await interaction.reply({ embeds: [embed] });
  },
};
