'use strict';

// SETUP DISCORD SHITE //
const discordToken = "<INSERT DISCORD APP TOKEN>";
const {Client, Intents, Events} = require('discord.js');
const discClient = new Client({ intents: [
    Intents.FLAGS.GUILDS, 
    Intents.FLAGS.GUILD_MESSAGES,  
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,  
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
] });

discClient.once('ready', () => console.log('Discord Ready!'));

// Array of discord channel IDs this bot should monitor for topics
const bibeoChannels = [
    "6969696969696969", //general
    "4206969696686969" //Some other channel
]

// Remove IRC relay usernames from messages
const removeUsername = str => {

    // IRC
    if(str.startsWith("<")){
        const e = str.indexOf(">");

        if(e > -1){
            return str.substring(e+1);
        }
    }
    else if(str.startsWith("**<")){
        const e = str.indexOf(">**");

        if(e > -1){
            return str.substring(e+3);
        }
    }

    return str;
}

// SETUP IRC SHITE //
const irc = require('irc');
const ircChannel = "#<INSER IRC CHANNEL NAME>";
const ircClient = new irc.Client('irc.bibeogaem.zone', '<INSERT IRC BOT NAME>', {
    channels: [ircChannel],
});

ircClient.addListener('error', message => console.log('error: ', message));


// DISCORD MESSAGE LISTENER //
discClient.on('messageCreate', message => {
    let msg = message.content.toLowerCase()

    //Get messages from the bibeogaem channels
    if(bibeoChannels.includes(message.channel.id)){

        // TOPIC
        if(msg.startsWith("/topic ")){
            let t = message.content;
            t = t.substring(6).trim();            
            ircClient.send('TOPIC', ircChannel, t);
            console.log("setting topic: ", t);
        }

        // MARKOV
        if(msg.startsWith(".markov")){
          ircClient.say(ircChannel, ".markov");
            console.log("Markov!");
        }

        //ULTRABUTT MESSAGES
        if(msg.startsWith(".ultrabutt")){
          ircClient.say(ircChannel, message.content);
            console.log(message.content);
        }


        // TEST
        if(message.content.startsWith("/test ")){
            let t = message.content;
            console.log("testing: ", t);
        }
    }
});

// Post topic if the :topic: emoji was used to react to a message
discClient.on('messageReactionAdd', (reaction, user) => {
    const name = reaction._emoji.name;
    const id = reaction._emoji.id;

    if(name === "topic"){
        let t = removeUsername(reaction.message.content);
        t = t.trim();            
        ircClient.send('TOPIC', ircChannel, t);
        console.log("setting topic: ", t);
    }
    
});
discClient.login(discordToken);