import discord
import asyncio
from discord.ext import commands
from utils import checks


class Moderator(commands.Cog):

    def __init__(self, client):
        self.client = client

    #mute, tmpmute, unmute
    @commands.command(
        description="Mutes user indefinitely",
        help="mutes user"
    )
    @checks.can_mute()
    async def mute(self, ctx, member: discord.Member, *, reason=None):
        await member.edit(mute=True,reason=reason)
        if reason is None:
            await ctx.send(f"{member} was muted indefinitely")
        else:
            await ctx.send(f"{member} was muted indefinitely because: {reason}")

    @commands.command(
        name="tmpmute",
        aliases=["tmute"],
        description="Mutes user for a definite period of time",
        help="mutes user for given number of minutes"
    )
    @checks.can_mute()
    async def temporary_mute(self, ctx, member: discord.Member, time, *, reason=None):
        await member.edit(mute=True)

        if reason is None:
            await ctx.send(f"{member} was muted for {float(time)} minutes")
        else:
            await ctx.send(f"{member} was muted for {float(time)} minutes because: {reason}")

        await asyncio.sleep(float(time) * 60)
        await member.edit(mute=False)

    @commands.command(
        description="Unmutes muted user",
        help="unmutes user"
    )
    @checks.can_mute()
    async def unmute(self, ctx, member: discord.Member):
        await member.edit(mute=False)
        await ctx.send(f"{member} was unmuted")

    #kick, ban, unban
    @commands.command(
        description="Kicks user from server",
        help="kicks user from server"
    )
    @checks.can_kick()
    async def kick(self, ctx, member: discord.Member, *, reason=None):
        await member.kick(reason=reason)

        if reason is None:
            await ctx.send(f"{member} was kicked")
        else:
            await ctx.send(f"{member} was kicked because: {reason}")

    @commands.command(
        description="Bans user from server, kicking him, deleting all of his messages and permitting reentry",
        help="bans user from server"
    )
    @checks.can_ban()
    async def ban(self, ctx, member: discord.Member, *, reason=None):
        await member.ban(reason=reason)

        if reason is None:
            await ctx.send(f"{member} was banned")
        else:
            await ctx.send(f"{member} was banned because: {reason}")

    @commands.command(
        description="Unbans user from server, reenabling him to enter the server",
        help="unbans user (format username#tag because you can't mention them)"
    )
    @checks.can_ban()
    async def unban(self, ctx, *, member):
        banned_members = await ctx.guild.bans()
        name, number = member.split('#')
        found = False
        for ban_entry in banned_members:
            user = ban_entry.user
            if (user.name, user.discriminator) == (name, number):
                await ctx.guild.unban(user)
                await ctx.send(f"{member} was unbanned")
                found = True
        if not found:
            ctx.send("No such user")

    @commands.command(
        description="Deletes given number of messages in the channel it's called.",
        help="deletes last <count> messages"
    )
    @checks.can_managemsg()
    async def clear(self, ctx, count: int):
        await ctx.message.channel.purge(limit=count+1)
        await ctx.send(f"{count} messages deleted")

    @commands.command(
        description="Messages a user with a warning considering their bad behaviour.",
        help="dms a user with reason"
    )
    @checks.can_kick()
    async def warn(self,ctx,user:discord.Member,*,reason=None):
        if reason is None:
            await ctx.send("You need to specify a reason")
        else:
            await user.send(reason)

    @commands.Cog.listener()
    async def on_message(self,message):
        if message.author != self.client:
            nono_words = [
                "Ugren",
                "ugren",
                "peepee poopoo",
                "nigga",
                "nigger",
                "disproportionate",
                "Ugrenovic",
                "ugrenovic"
            ]
            for word in nono_words:
                if message.content.find(word)!=-1:
                    await message.channel.purge(limit=1)
                    word = word[:1]+'*'+word[2:]
                    await message.author.send(f"You used a nono word in that message: {word}")
                    await message.channel.send("Oopsie, that message contained a nono word")



def setup(client):
    client.add_cog(Moderator(client))