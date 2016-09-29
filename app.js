const Discord = require("discord.js");

const bot = new Discord.Client();

const token = "INSERT_TOKEN_HERE";

bot.on("ready", ()=>{ console.log(`Bot Ready: Number of channels: ${bot.channels.length}, Number of Servers: ${bot.servers.length}, Number of users: ${bot.users.length}`);});
bot.on("error", e => { console.error(e); });
bot.on("warn", e => { console.warn(e); });
bot.on("debug", e => { console.info(e); });

bot.on("message", function(msg) {

	var  prefix = "!";

	
	// Makes sure author is not another bot. Prevents botception
	if(msg.author.bot) return;

	// Gets Subreddit info (regardless if prefix exists)
	if(msg.content.indexOf("/r/") != -1) {
		var sub = msg.content.match(/\/r\/[^ .]+/);
		if(sub !== null) {
			bot.reply(msg, "www.reddit.com" + sub[0]);
		}
	}

	// Alternate Prefixes (Replaces alternate prefixes with standard "!" so that they may be processed)
	var altPrefixes = ["#"];
	altPrefixes.forEach(function(alt) {
		if(msg.content.startsWith(alt))
			msg.content = prefix + msg.content.slice(1);
	});

	// Checks if message starts with prefix. If not, ends
	if(!msg.content.startsWith(prefix)) return;
	else msg.content = msg.content.slice(1);

	// Preset one word -> response messages
	var responseObject = {
		ayy: "Ayy, lmao!",
		ping: "pong",
		foo: "bar",
		lenny: "( ͡° ͜ʖ ͡°)",
		shrug: "¯\\_(ツ)_/¯",
		tableflip: "(╯°□°）╯︵ ┻━┻",
		unflip: "┬──┬ ノ( ゜-゜ノ)",
		poundsign: "Save the date! TomKat say their I do's on September 23th 2017!",
		boschpartyoftwo: "Save the date! MacaBosch say their I do's on October 7th, 2017!",
		boschpartyof2: "Save the date! MacaBosch say their I do's on October 7th, 2017!"
	};
	if(responseObject[msg.content]) {
		bot.sendMessage(msg, responseObject[msg.content]);
	}
	else if(msg.content.startsWith("help")) {
		var keys = Object.keys(responseObject).reduce(function(prev, curr) { return prev + "\n" + curr; }, "")
		bot.reply(msg, "Help: Use the '!' prefix. List of quick auto-replies:" + keys + "\n!RemindMe uses the format [number] [unit] [message], enter '!RemindMe help' for more info");
	}
	else if(msg.content.startsWith("RemindMe") || msg.content.startsWith("remindme")) {
		var help = "Format: '!RemindMe [number] [units] [message]' Units can be seconds, minutes, hours, days, weeks, months, or years.\nFor shorthand, use s = seconds, mi = minutes, h = hours, d = days, m = months, y = years.";
		var args = msg.content.split(" ");
		if(args[1] === "help" || args[1] === "Help" || args[1] === "HELP" || args.length < 3) {
			bot.reply(msg, help);
			return;
		}
		var reminderMessage = "something?";
		if(args.length > 3)
			reminderMessage = msg.content.split(" ").slice(3).join(" ");
		var num = Number(args[1]);
		// More error checking
		if(isNaN(num) || num < 0) {
			bot.reply(msg, help);
			return;
		}
		var unit = args[2].toLowerCase();
		if(unit[0] === "m" && unit[1] === "i")
			num *= 60;
		else if(unit[0] === "h")
			num *= 3600;
		else if(unit[0] === "d")
			num *= 86400;
		else if(unit[0] === "w")
			num *= 604800;
		else if(unit[0] === "m")
			num *= 2592000;
		else if(unit[0] === "y")
			num *= 31536000;
		num *= 1000;
		console.log(`Reminder set for ${num/1000} seconds`);
		bot.reply(msg, `I will remind you about "${reminderMessage}" in ${args[1]} ${args[2]}`);
		setTimeout(function(){
			bot.reply(msg, `Reminding you about "${reminderMessage}"`);
		}, num);
	}

/* fetch and XMLHttpRequest are not defined
	else if(msg.content.startsWith("joke")) {
		var x = new XMLHttpRequest();
		x.open("GET", "https://www.reddit.com/r/jokes/top.json", false);
		x.send();
		if(x.status < 300) {
			x = JSON.parse(x.responseText);
			var num = Math.floor(Math.random() * 25);
			var joke  = x.data.children[num].data;
			bot.reply(msg, joke.title + "\n\n" + joke.selftext + "\n\nLink: " + joke.url);
		}
		else { 
			console.log("Joke Error: " + err);
			bot.reply(msg, "This is no time for a joke. I also can't reach /r/jokes right now, but that's besides the point. Maybe try later.");
		}
	}
*/

});

function output(error, token) {

	if (error) {
		console.log('There was an error logging in: ' + error);
		return;
	}
	else
		console.log('Logged in. Token: ' + token);
}

bot.loginWithToken(token, output);