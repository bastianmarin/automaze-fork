const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Chance = require(`chance`);
const chance = new Chance;

module.exports = {
	category: `Fun`,
	scope: `global`,
	type: `slash`,
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Answer questions of your life')
		.addStringOption(option => option.setName('question').setDescription('Ask questions about your life')),
	async execute(client, interaction) {
		if (interaction.client.disallowedChannelIds.includes(interaction.channelId)) {
            await interaction.reply({ content: 'This command is not available here.', ephemeral: true});
            return;
        }
		
		const question = interaction.options.getString('question');
		if (!question) {
			await interaction.reply('You need to provide a question!\n\n> Example: `/8ball` `Gunfus is Fungus?`')
		}
		else {
			const affirmativeResponses = [`It is certain.`, `It is decidedly so.`, `Without a doubt.`, `Yes definitely.`, `You may rely on it.`, `As I see it, yes.`, `Most likely.`, `Outlook good.`, `Yes.`, `Signs point to yes.`];
			const noncommittalResponses = [`Reply hazy, try again.`, `Ask again later.`, `Better not tell you now.`, `Cannot predict now.`, `Concentrate and ask again.`];
			const negativeResponses = [`Don't count on it.`, `My reply is no.`, `My sources say no.`, `Outlook not so good.`, `Very doubtful.`];

			const percent = chance.natural({ min: 1, max: 100 });
			let response;

			if (percent <= 50) {
				response = [affirmativeResponses[Math.floor(Math.random() * affirmativeResponses.length)], `Green`];
			} else if (percent > 50 && percent <= 75) {
				response = [noncommittalResponses[Math.floor(Math.random() * noncommittalResponses.length)], `Yellow`];
			} else {
				response = [negativeResponses[Math.floor(Math.random() * negativeResponses.length)], `Red`];
			}

			function percentToBar(percentile) {
				const filled = Math.floor(percentile / 10);
				const bar = [`*[*`, Array(filled).fill(`▰`), Array(10 - filled).fill(`▱`), `*]*`].flat();
				return bar.join(``);
			}

			const loadingEmbed = new EmbedBuilder()
				.setTitle(`🎱 Predicting the future... 🎱`)
				.setColor(`DarkButNotBlack`);

			const msg = await interaction.reply({ embeds: [loadingEmbed] });

			setTimeout(() => {
				const answerEmbed = new EmbedBuilder()
											.setTitle(question)
											.setColor(response[1])
											.setDescription(`## ${response[0]}\n# ${percentToBar(100 - percent)} - ${100 - percent}% possible`)
											.setFooter({text:'Note: All answers are fake, don\'t take them seriously!'})
				msg.edit({ embeds: [answerEmbed] });
			}, 3000);
		}
	}
}
