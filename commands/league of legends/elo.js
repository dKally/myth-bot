const { SlashCommandBuilder, MessageEmbed } = require('discord.js');
const puppeteer = require('puppeteer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('elo')
        .setDescription('Insira o nome do jogador para ver o elo.')
        .addStringOption(option =>
            option
                .setName('nome')
                .setDescription('Nome do jogador')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const target = interaction.options.getString('nome');
            const browser = await puppeteer.launch({ headless: "new" });
            const page = await browser.newPage();
            await page.goto(`https://blitz.gg/lol/profile/br1/${target}`);
            await new Promise(resolve => setTimeout(resolve, 500));

            let player = target;

            const topLineText = await page.evaluate(() => {
                const rankElement = document.querySelector('.name');
                const pdlElement = document.querySelector('.points');

                if (rankElement && pdlElement) {
                    const rank = rankElement.textContent.trim();
                    const pdl = pdlElement.textContent.trim();
                    return { rank, pdl };
                } else {
                    return null;
                }
            });

            const winRates = await page.evaluate(() => {
                const winRateElement = document.querySelector('.bottom-line');

                if (winRateElement) {
                    const spans = winRateElement.querySelectorAll('span');
                    const winRateTexts = [];

                    spans.forEach(span => {
                        winRateTexts.push(span.textContent.trim());
                    });

                    return winRateTexts;
                } else {
                    return null;
                }
            });

            await browser.close();

            if (topLineText) {
                const embed = {
                    title:`Elo de ${player}`,
                    fields:[
                        {
                            name:'Rank Atual:',
                            value: topLineText.rank + topLineText.pdl
                        },{
                            name:'WinRate',
                            value: winRates[0] + ' ' + winRates[1]
                        }
                    ]
                }

                await interaction.reply({
                    embeds: [embed],
                });
            } else {
                await interaction.reply('Rank não encontrado...');
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('Ocorreu um erro ao buscar o rank do jogador.');
        }
    },
};
