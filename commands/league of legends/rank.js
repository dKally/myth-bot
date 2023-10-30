const { SlashCommandBuilder } = require('discord.js');
const puppeteer = require('puppeteer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Replies the rank from the player!'),
    async execute(interaction) {
        try {
            const browser = await puppeteer.launch({ headless: "new" });
            const page = await browser.newPage();
            await page.goto('https://blitz.gg/lol/profile/br1/KaczL');

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

            await browser.close();

            if (topLineText) {
                const response = `Rank atual: ${topLineText.rank} ${topLineText.pdl}`;
                await interaction.reply(response);
            } else {
                await interaction.reply('Rank não encontrado...');
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('Ocorreu um erro ao buscar o rank do jogador.');
        }
    },
};