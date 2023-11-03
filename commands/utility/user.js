const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Get information about a user.')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('User to get information about')
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('target') || interaction.user;

    // Certifique-se de que o usuário é um membro do servidor antes de acessar a data de entrada.
    if (interaction.guild) {
      const member = interaction.guild.members.cache.get(user.id);

      if (member) {
        const embed = {
          title: "**" + user.globalName + "**",
          description: "`@" + user.username + "`",
          fields: [
            {
              name: 'ID:',
              value: user.id,
            },
            {
              name: 'Conta Criada em:',
              value: user.createdAt.toLocaleDateString(),
            },
            {
              name: 'Entrou no Servidor em:',
              value: new Date(member.joinedAt).toLocaleDateString(),
            }
          ],
          thumbnail: {
            url: user.displayAvatarURL({ dynamic: true, format: 'png' }),
          },
          color: 0x9900ff,
        };

        await interaction.reply({ embeds: [embed] });
      } else {
        await interaction.reply('Esse usuário não é membro desse servidor.');
      }
    } else {
      await interaction.reply('Esse comando deve ser executado em um servidor.');
    }
  },
};
