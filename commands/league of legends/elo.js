const { SlashCommandBuilder } = require('discord.js');
const puppeteer = require('puppeteer');
const play = require('../../../discord-music-bot-main (cópia)/slash/play');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('elo')
        .setDescription('Insira o nome do player que quer ver o elo.')
        .addStringOption(option =>
            option
                .setName('nome')
                .setDescription('Nome do player')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            let target = interaction.options.getString('nome')
            const browser = await puppeteer.launch({ headless: "new" });
            const page = await browser.newPage();
            await page.goto(`https://blitz.gg/lol/profile/br1/${target}`);
            console.log(`https://blitz.gg/lol/profile/br1/${target}`)
            let player = target

            const topLineText = await page.evaluate(() => {
                const rankElement = document.querySelector('.name');
                const pdlElement = document.querySelector('.points');
                const winRateElement = document.querySelector('.bottom-line');


                if (rankElement && pdlElement && winRateElement) {
                    const rank = rankElement.textContent.trim();
                    const pdl = pdlElement.textContent.trim();
                    const winRate = winRateElement.textContent.trim();
                    return { rank, pdl, winRate };
                } else {
                    return null;
                }
            });

            await browser.close();
            target = ''

            if (topLineText) {
                const response = `**${player}**
Rank atual: ${topLineText.rank} ${topLineText.pdl}
${topLineText.winRate}`;
                await interaction.reply(response);
            } else {
                await interaction.reply('Rank não encontrado...');
            }
            player = ''
        } catch (error) {
            console.error(error);
            await interaction.reply('Ocorreu um erro ao buscar o rank do jogador.');
        }
    },
};