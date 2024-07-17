const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");
require("dotenv").config();
const TOKEN = process.env.TOKEN;

const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const commands = [
  {
    name: "help",
    description:
      "Gives you all the details about what commands to use to retrive information",
  },
  {
    name: "company",
    description: "Will provide the leetcode questions asked by the company",
    options: [
      {
        name: "comp",
        type: 3,
        description: "Company leetcode questions",
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

// registering a command

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

// creating the functionality of the command
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === "help") {
    await interaction.reply(
      "Use !!YOUR_LEETCODE_ID TO GET THE INFORMATION ABOUT YOUR LEETCODE PROFILE .  "
    );
  }

  if (commandName === "company") {
    const company = options.getString("comp");

    await interaction.reply(
      `https://github.com/hxu296/leetcode-company-wise-problems-2022/blob/main/companies/${company}.csv`
    );
  }
});

client.on("messageCreate", async (message) => {
  if (message.content == "!LEETCODERANK") {
    message.channel.send(
      "Please Provide me your leetcode Id so i can process further. Mention your Id after !!"
    );
  } else if (message.content.startsWith(`!!`)) {
    let resource = message.content.substring(2);
    message.channel.send(`Finding The rank of Id ${resource}`);
    let response = await fetch(
      `https://leetcode-stats-api.herokuapp.com/${resource}`
    );
    let data = await response.json();
    const rank = data.ranking;
    const total_solved = data.totalSolved;
    if (rank && total_solved) {
      message.channel.send(`RANKING : ${rank}
Total Questions Solved : ${total_solved}
  `);
    } else {
      message.channel.send(
        `Sorry we are unable to get your rank . Please verify your id or please try again later.`
      );
    }
  }
});

client.login(TOKEN);
