require("dotenv").config();
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const commands = [
    new SlashCommandBuilder()
        .setName("stardrop")
        .setDescription("Ukáže šance ze Star Dropu")
        .addStringOption(option =>
            option.setName("typ")
                .setDescription("Vyber typ Star Dropu")
                .setRequired(true)
                .addChoices(
                    { name: "Common", value: "common" },
                    { name: "Rare", value: "rare" },
                    { name: "Epic", value: "epic" },
                    { name: "Mythic", value: "mythic" },
                    { name: "Legendary", value: "legendary" }
                )
        )
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
    );
})();

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "stardrop") {
        const typ = interaction.options.getString("typ");

        const chances = {
            common: "Coins – 50%\nPower Points – 35%\nCredits – 10%\nBrawler – 5%",
            rare: "Coins – 40%\nPower Points – 35%\nCredits – 15%\nBrawler – 10%",
            epic: "Coins – 30%\nPower Points – 30%\nCredits – 20%\nBrawler – 20%",
            mythic: "Coins – 25%\nCredits – 25%\nSkin – 25%\nBrawler – 25%",
            legendary: "Skin – 35%\nBrawler – 25%\nCredits – 20%\nCoins – 20%"
        };

        const images = {
            common: "SEM_DEJ_IMGUR_LINK",
            rare: "SEM_DEJ_IMGUR_LINK",
            epic: "SEM_DEJ_IMGUR_LINK",
            mythic: "SEM_DEJ_IMGUR_LINK",
            legendary: "SEM_DEJ_IMGUR_LINK"
        };

        const colors = {
            common: 0x2ecc71,
            rare: 0x3498db,
            epic: 0x9b59b6,
            mythic: 0xe84393,
            legendary: 0xf1c40f
        };

        const embed = new EmbedBuilder()
            .setTitle(`⭐ ${typ.toUpperCase()} STAR DROP`)
            .setDescription(chances[typ])
            .setImage(images[typ])
            .setColor(colors[typ])
            .setFooter({ text: "StarDrop Bot • Brawl Stars" });

        await interaction.reply({ embeds: [embed] });
    }
});

client.login(process.env.TOKEN);
