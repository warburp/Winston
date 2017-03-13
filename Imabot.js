var Discord = require("discord.js");

var bot = new Discord.Client();

var startTime = Date.now();
let Officer = "222028173213171722";
var fs = require("fs");
var qs = require("querystring");
var giphy_config = {
  "api_key": "dc6zaTOxFJmzC",
  "rating": "r",
  "url": "http://api.giphy.com/v1/gifs/random",
};
var help= [
  "These are the commands Winston has available all are prefixed wtih !",
  "help 				- lists commands like you are seeing now",
  "classguide 		- Follow with spec and class like so Protection Warrior will return the icyviens guide",
  "viewlog 			- provide a raid and date like so Emerald Nightmare 10-6-16 will provide link for the raid log",
  "masterlog          - Lists all available logs",
  "class              - Use to change your discord role to match your class in wow",
  "notclass           -Use to remove a class from discord duh",
  "armory             - Pulls up a link to the armory for the character on the realm provided EX: !armory argent dawn demonburp",
  "M+                 -Links you to a website that has the current M+ affixes for the week",
  "sim               -Follow with realm and character name and Winston will run a simcraft for you",
  "                 ONLY USABLE BY THOSE WITH THE GUILD OFFICER ROLE   ",
  "mute            -Mutes one mentioned user don't mention more you'll have a bad time",
  "unmute         -Does the exact opposite of mute Duh"
];
var SelfAssign = [
  "hunter",
  "demon hunter",
  "mage",
  "paladin",
  "shaman",
  "rogue",
  "monk",
  "warlock",
  "death knight",
  "warrior",
  "priest",
  "druid"
];
var Tank = [
	"protection",
	"vengeance",
	"guardian",
	"blood",
	"brewmaster"
	];
var DPS = [
	"havoc",
	"frost",
	"unholy",
	"feral",
	"balance",
	"shadow",
	"elemental",
	"enhancement",
	"retribution",
	"windwalker",
	"fire",
	"rogue",
	"hunter",
	"warlock",
	];
var Healer = [
	"restoration",
	"holy",
	"mistweaver"
	];
var commands = {
/*

	"ping": {
        description: "responds pong, useful for checking if bot is alive",
        process: function(bot, msg, suffix) {
            msg.channel.sendMessage( msg.sender+" pong!");
            if(suffix){
                msg.channel.sendMessage( "note that !ping takes no arguments!");
            }
        }
    },

*/


  "servers": {
    	description: "lists servers bot is connected to",
   	 process: function(bot,msg){
      	msg.channel.sendMessage(bot.guilds);
    	}
  },
  "uptime": {
    	usage: "",
    	description: "returns the amount of time since the bot started",
    	process: function(bot,msg){
      	var now = Date.now();
      	var msec = now - startTime;
      	console.log("Uptime is " + msec + " milliseconds");
      	var days = Math.floor(msec / 1000 / 60 / 60 / 24);
      		msec -= days * 1000 * 60 * 60 * 24;
      	var hours = Math.floor(msec / 1000 / 60 / 60);
      	msec -= hours * 1000 * 60 * 60;
      	var mins = Math.floor(msec / 1000 / 60);
      	msec -= mins * 1000 * 60;
      msec -= mins * 1000 * 60;
      	var secs = Math.floor(msec / 1000);
      	var 		timestr = "";
      if(days > 0) {
        		timestr += days + " days ";
      	}
      	if(hours > 0) {
        		timestr += hours + " hours ";
      	}
      	if(mins > 0) {
        		timestr += mins + " minutes ";
      	}
      	if(secs > 0) {
        timestr += secs + " seconds ";
      }
      msg.channel.sendMessage("Uptime: " + timestr);
    }
  },
  "gif": {
    	usage: "<tags>",
    	description: "returns a random gif matching the tags passed",
    	process: function(bot, msg, suffix) {
      	var tags = suffix.split(" ");
      get_gif(tags, function(id) {
        if (typeof id !== "undefined") {
          const gifEmbed = new Discord.RichEmbed()
            .setColor(0x5b2c6f)
            .setImage( "http://media.giphy.com/media/" + id + "/giphy.gif");
          			msg.channel.sendEmbed(gifEmbed);
        }
        else {
          msg.channel.sendMessage( "Invalid tags, try something different. [Tags: " + (tags ? tags : "Random GIF") + "]");
        }
      });
      msg.delete();
    }
  },
  "classguide": {
    usage: "<spec class>",
    descriptiont: "links the icy veins guide for the class provided",
    process: function(bot,msg,suffix){
      msg.delete();
      if(!suffix){
        				msg.channel.sendMessage("This function requires a suffix example !classguide protection warrior");
      }
      else{
      	msg.delete();
        				suffix = suffix.toLowerCase();
        suffix = suffix.split(" ");
        if (Tank.indexOf(suffix[0]) > -1) {
          suffix = suffix.join("-");
          const TankEmbed = new Discord.RichEmbed()
          					.setColor(0x5B2C6F)
          					.setTitle("Heres your guide!")
          					.setURL("http://www.icy-veins.com/wow/" + suffix + "-pve-tank-guide");
          				msg.channel.sendEmbed(TankEmbed);
        }
        if (DPS.indexOf(suffix[0]) > -1 || DPS.indexOf(suffix[1]) > -1) {
          suffix = suffix.join("-");
          const DPSEmbed = new Discord.RichEmbed()
          					.setColor(0x5B2C6F)
          					.setTitle("Heres your guide!")
          .setURL("http://www.icy-veins.com/wow/" + suffix + "-pve-dps-guide");
          msg.channel.sendEmbed(DPSEmbed);
        }
        if (Healer.indexOf(suffix[0]) > -1){
          suffix = suffix.join("-");
          const HealerEmbed = new Discord.RichEmbed()
          			.setColor(0x5B2C6F)
          			.setTitle("Heres your guide!")
          .setURL("http://www.icy-veins.com/wow/" + suffix + "-pve-healer-guide");
          		msg.channel.sendEmbed(HealerEmbed);
 		      	 }
      }
    }
  },
  "viewlog": {
    usage: "<raid date>",
    	description: "pulls the link for requested log",
    	process: function(bot,msg,suffix){
      		suffix = suffix.toLowerCase();
      suffix = suffix.split(" ");
      		let path = formatPath(suffix);
      console.log(path);
      fs.readFile("../logs/" + path, "utf8", (err, Log) => {
        if(err){
          msg.channel.sendMessage("Could not find log did you spell it right?");
        }
        msg.delete();
        const LogEmbed = new Discord.RichEmbed()
          .setColor(0x5B2C6F)
          .setTitle(suffix)
          .setURL(Log);
        msg.channel.sendEmbed(LogEmbed);
      });
    }
  },
  "masterlog":{
    description: "Lists all available logs",
    process: function(bot,msg){
      msg.delete();
      fs.readFile("../logs/MasterLog.txt", "utf8", (err, suffix) => {
        if(err){
          console.log(err);
          msg.channel.sendMessage( "Could not open file");
        }
        msg.channel.sendMessage(suffix);
      });
    }
  },
  "mute": {
    	process: function(bot,msg, suffix){
      suffix = suffix.split(" ");
      	let member = msg.guild.member(msg.mentions.users.first());
      let punish = msg.guild.channels.find("name", "punish");
      suffix.shift();
      		if(msg.member.roles.has(Officer)){
	 		       let reason = suffix.join(" ");
        member.addRole(msg.guild.roles.find("name", "Anti Spam")).then(console.log(member + " has been muted. By " + msg.author.username)).catch(console.log);
        punish.sendEmbed({
          color: 0xff4500,
          author: {
            name: msg.author.username,
            icon_url: msg.author.avatarURL
          },
          	description: "**User: **" + member.user.username + "\n" +
                       "**Punishment:** Muted\n" +
                       "**Reason: **" + reason,
          timestamp: new Date()
        });
      }
      else{
        msg.channel.sendMessage("I'm afraid I can't let you do that Dave.");
      }
      msg.delete();
    }
  },
  "unmute": {
    process: function(bot,msg){
      let member = msg.guild.member(msg.mentions.users.first());
      if(msg.member.roles.has(Officer)){
        member.removeRole(msg.guild.roles.find("name", "Anti Spam")).then(console.log(member.user.username + " has been unmuted. By " + msg.author.username)).catch(console.log);
      }
      else{
 				       			msg.channel.sendMessage("I'm afraid I can't let you do that Dave.");
      }
      msg.delete();
    	}
  },
  "class":{
    	description: "Assigns a role relating to the user class in WOW",
    	process: function(bot,msg,suffix){
      		let username = msg.author.username;
      let temp = suffix.split(" ");
      let filename = temp.join("") + ".png";
      let member = msg.guild.member(msg.author.id);
     	 	suffix = 		suffix.toLowerCase();
 		    	 	if(SelfAssign.indexOf(suffix) > -1){
        member.addRole(msg.guild.roles.find("name", suffix)).then(console.log(msg.author.username + " has been assigned a class.")).catch(console.log);
        const classSet = new Discord.RichEmbed()
          .setColor(0x1E8449)
          .setTitle(username)
          .setDescription("Is now a " + suffix)
          .setImage("attachment://" + filename);
        msg.channel.sendFile("./Wowicons/" + filename, filename , "", { embed: classSet });
      }
      else{
        msg.channel.sendMessage("Check your Spelling");
      }
      msg.delete();
    }
  },
  "notclass":{
    description: "Removes a role relating to the user class in WOW",
    process: function(bot,msg,suffix){
      let member = msg.guild.member(msg.author.id);
      suffix = suffix.toLowerCase();
      if(SelfAssign.indexOf(suffix) > -1){
        member.removeRole(msg.guild.roles.find("name", suffix)).then(console.log(msg.author.username + " has been unassigned a class.")).catch(console.log);
      }
      else{
        				msg.channel.sendMessage("Check your Spelling");
      }
      msg.delete();
    }
  },
  "sim":{
    description: "test to run a sim",
    process: function(bot,msg,suffix){
      suffix.toLowerCase();
      suffix = suffix.split(" ");
      var child_process = require("child_process");
      msg.delete();
      msg.author.sendMessage("Working. Please allow about 10 minutes for me to DM your results.  Please do not resend command unless I ask you to.");
      if (suffix.length > 2) {
        child_process.exec("C:/Users/Administrator/Documents/SimResults/SimC.bat " + "\"" + suffix[0] + " " + suffix[1] + "\" " + suffix[2], function(err, stdout) {
          if (err) {
          // Ooops.
          // console.log(stderr);
            msg.channel.sendMessage("Something when wrong try again");
            return console.log(err);
          }
        // Done.
          console.log(stdout);
          msg.author.sendFile("C:/Users/Administrator/Documents/SimResults/" + suffix[2] + ".html");
        });
      }
      else {
        child_process.exec("C:/Users/Administrator/Documents/SimResults/SimC.bat " + suffix[0] + " " + suffix[1], function(err, stdout) {
          if (err) {
      // Ooops.
      // console.log(stderr);
            msg.channel.sendMessage("Something when wrong try again");
            return console.log(err);
          }
    // Done.
          console.log(stdout);
          msg.channel.sendFile("C:/Users/Administrator/Documents/SimResults/" + suffix[1] + ".html");
        });
      }
    }
  },
  "armory":{
    description: "pull url for the character provided",
    process: function (bot, msg, suffix){
      suffix = suffix.split(" ");
      let URL = formatURL(suffix);
      msg.channel.sendMessage("http://us.battle.net/wow/en/character/" + URL + "/advanced");
      msg.delete();
    }
 	},
	 "m+":{
    description: "links to current M+ affixes",
    process: function(bot, msg){
      const mPlus = new Discord.RichEmbed()
        .setColor(0x5B2C6F)
        .setTitle("This weeks affixes")
        .setURL("https://mythicpl.us/#this_week");
      msg.channel.sendEmbed(mPlus);
      msg.delete();
    }
  },
};
var Config = {};
try{
  Config = require("./config.json");
} catch(e){ //no config file, use defaults
  Config.debug = true;
  Config.respondToInvalid = true;
}

bot.on("message", function (msg) {
	//check if message is a command
  if(msg.author.id != bot.user.id && (msg.content[0] === "!")){
    var cmdTxt = msg.content.split (" ")[0].substring(1);
    cmdTxt = cmdTxt.toLowerCase();
    var suffix = msg.content.substring(cmdTxt.length+2);//add one for the ! and one for the space
    var cmd = commands[cmdTxt];
    if (cmdTxt === "help"){
      msg.delete();
      msg.author.sendMessage(help.join("\n"));
    }
    else if(cmd) {
      try{ cmd.process(bot,msg,suffix);}catch(e){
        if(Config.debug){
          msg.channel.sendMessage( "command " + cmdTxt + " failed :(\n" + e.stack);
        }
      }
    }
  }
});
function get_gif(tags, func) {
  var params = {
    "api_key": giphy_config.api_key,
    "rating": giphy_config.rating,
    "format": "json",
    "limit": 1
  };
  var query = qs.stringify(params);
  if (tags !== null) {
    query += "&tag=" + tags.join("+");
  }
  //wouldnt see request lib if defined at the top for some reason:
  var request = require("request");
  console.log(query);
  request(giphy_config.url + "?" + query, function (error, response, body) {
    console.log(arguments);
    if (error || response.statusCode !== 200) {
      console.error("giphy: Got error: " + body);
      console.log(error);
      console.log(response);
    }
    else {
      try{
        var responseObj = JSON.parse(body);
        func(responseObj.data.id);
      }
      catch(err){
        func(undefined);
      }
    }
  }.bind(this));
}
function formatURL(arr){
  var outStr = "";
  if (arr.length === 1) {
    outStr = arr[0];
  } else if (arr.length === 2) {
        //joins all with "-" but no commas
    outStr = arr.join("/");
  } else if (arr.length > 2) {
    outStr = arr.slice(0, -1).join("-") + "/" + arr.slice(-1);
  }
  return outStr;
}
function formatPath(arr){
  var outStr = "";
  outStr = arr.slice(0, -2).join("") + "/" + arr.slice(-2).join("/") + ".txt";
  return outStr;
}
bot.login("MjMzNjM0OTczNzg0MDgwMzg0.C2pdHQ.byiglU_uxOK0unw3wr2dOwU7s-M");
