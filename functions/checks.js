class Checks {
    static memberHigherThan(highestMember, lowestMember) {
        if (!highestMember) throw new SyntaxError(`You forgot the highest member!`);
        if (!lowestMember) throw new SyntaxError(`You forgot the lowest member!`);
        return highestMember.roles.highest.position > lowestMember.roles.highest.position;
    }

    static memberHigherOrEqualTo(highestMember, lowestMember) {
        if (!highestMember) throw new SyntaxError(`You forgot the highest member!`);
        if (!lowestMember) throw new SyntaxError(`You forgot the lowest member!`);
        return highestMember.roles.highest.position >= lowestMember.roles.highest.position;
    }

    static roleHigherThan(highestRole, lowestRole) {
        if (!highestRole) throw new SyntaxError(`You forgot the highest role!`);
        if (!lowestRole) throw new SyntaxError(`You forgot the lowest role!`);
        return highestRole.position > lowestRole.position;
    }

    static roleHigherOrEqualTo(highestRole, lowestRole) {
        if (!highestRole) throw new SyntaxError(`You forgot the highest role!`);
        if (!lowestRole) throw new SyntaxError(`You forgot the lowest role!`);
        return highestRole.position >= lowestRole.position;
    }

    static hasPermission(member, permission) {
        if (!member) throw new SyntaxError(`You forgot the member!`);
        if (!permission) throw new SyntaxError(`You forgot the permission!`);
        if (typeof permission !== "string") throw new TypeError(`permission is not a string!`);
        return member.hasPermission(permission);
    }

    static hasRole(member, roleOrRoles) {
        if (!member) throw new SyntaxError(`You forgot the member!`);
        if (!roleOrRoles) throw new SyntaxError(`You forgot the role/roles!`);
        if (typeof roleOrRoles === "string" || typeof roleOrRoles === "number") {
            return member.roles.cache.has(roleOrRoles);
        } else if (typeof roleOrRoles === "array") {
            return roleOrRoles.some(r => member.roles.cache.has(r));
        } else {
            throw new TypeError(`Invalid type for roleOrRoles.`);
        }
    }

    static isAuthor(user, author) {
        if (!user) throw new SyntaxError(`You forgot user!`);
        if (!author) throw new SyntaxError(`You forgot author!`);
        return user.id === author.id;
    }

    static isOwner(member) {
        if (!member) throw new SyntaxError(`You forgot member!`);
        return member.user.id === member.guild.ownerId;
    }
    
    static isAdmin(member) {
        if (!member) throw new SyntaxError(`You forgot member!`);
        return member.hasPermission("ADMINISTRATOR");
    }

}

module.exports = Checks();