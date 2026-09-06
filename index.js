require("dotenv").config();
const {Client,GatewayIntentBits,REST,Routes,SlashCommandBuilder,EmbedBuilder}=require("discord.js");

const keys=["DISCORD_TOKEN","CLIENT_ID","GUILD_ID","OWNER_ROLE_ID","MODERATOR_ROLE_ID","ADMIN_ROLE_ID","VERIFICATION_CHANNEL_ID"];
for(const k of keys) if(!process.env[k]){console.error(`Missing ${k}`);process.exit(1);}

const roles=[
 {id:process.env.OWNER_ROLE_ID,name:"Owner"},
 {id:process.env.MODERATOR_ROLE_ID,name:"Moderator"},
 {id:process.env.ADMIN_ROLE_ID,name:"Admin"}
];

const command=new SlashCommandBuilder().setName("staff").setDescription("Beyond SMP staff systems")
 .addSubcommand(s=>s.setName("verify").setDescription("Generate a temporary staff verification code"));

const client=new Client({intents:[GatewayIntentBits.Guilds,GatewayIntentBits.GuildMembers]});

client.once("ready",async()=>{
 console.log(`Logged in as ${client.user.tag}`);
 const rest=new REST({version:"10"}).setToken(process.env.DISCORD_TOKEN);
 await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID,process.env.GUILD_ID),{body:[command.toJSON()]});
 console.log("Registered /staff verify");
});

client.on("interactionCreate",async i=>{
 if(!i.isChatInputCommand()||i.commandName!=="staff"||i.options.getSubcommand()!=="verify") return;
 const role=roles.find(r=>i.member.roles.cache.has(r.id));
 if(!role){return i.reply({content:"❌ You do not have an eligible Beyond SMP staff role.",ephemeral:true});}
 const code=`BSMP-${Math.random().toString(36).slice(2,6).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
 const expires=Date.now()+600000;
 await i.reply({content:`✅ **Staff role detected:** ${role.name}\n🔑 **Verification code:** \`${code}\`\n⏱️ This code expires in **10 minutes**.`,ephemeral:true});
 const ch=await client.channels.fetch(process.env.VERIFICATION_CHANNEL_ID);
 if(!ch?.isTextBased()){console.error("Verification channel unavailable");return;}
 const embed=new EmbedBuilder().setTitle("🔐 Staff Verification Used").addFields(
  {name:"Discord",value:`${i.user} (\`${i.user.username}\`)`},
  {name:"Discord ID",value:`\`${i.user.id}\``},
  {name:"Staff Role",value:role.name},
  {name:"Verification Code",value:`\`${code}\``},
  {name:"Expires",value:`<t:${Math.floor(expires/1000)}:R>`}
 ).setTimestamp().setFooter({text:"BSMP Systems • Staff Verification"});
 await ch.send({embeds:[embed]});
 console.log(`[STAFF VERIFY] ${i.user.tag} | ${role.name} | ${code}`);
});
client.login(process.env.DISCORD_TOKEN);
