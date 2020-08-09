module.exports = {
    lang: "english",
    commands: {
        ban: {
            permission: "Manage Bans",
            action: "ban",
            actionHappened: "banned",
        }
    },
    global: {
        permissions: {
            member(command) {
                return `I may be blind, but I don't see ${this.commands[command].permission} amongst your permissions.`;
            },
            bot(command) {
                return `Ehmm... Maybe sort my permissions first? I need the ${this.commands[command].permission} permission.`;
            }
        },
        notDefined: {
            modCommands(modAction) {
                return `Now you see, there is something called telling me who to ${this.commands[modAction].action}.`;
            },
            memberNotInServer: "Now you see, there is something called telling me a member from this server.",
            userNotInCache: "Now you see, there is something called telling me a real member.",
            noReason: "Wait I don't wanna do this without a reason."
        },
        stops: {
            isSelf: `This isn't a good idea...`,
            isModOrAdmin(modAction) {
                return `I wouldn't ${this.commands[modAction].action} this person, if I was you.`;
            },
            isHigher(modAction) {
                return `Hey, I don't think you should ${this.commands[modAction].action} that person.`;
            }
        },
        dms: {
            modActionHappened(guildName, modAction) {
                return `You've been ${this.commands[modAction].actionHappened} from ${guildName}, here is a copy of the log!`;
            }
        },
        modlogs: {
            title(modAction, caseNum) {
                return `Member ${this.commands[modAction].actionHappened} | Case #${caseNum}`;
            },
            willLast(modAction) {
                return `This ${this.commands[modAction].action} will last`;
            }
        }
    }
}