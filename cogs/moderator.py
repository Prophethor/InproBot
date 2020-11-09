from typing import List, Any

import discord
import asyncio
import json
from discord.ext import commands


class Moderator(commands.Cog):

    def __init__(self, client):
        self.client = client

    #mute, tmpmute, unmute
    @commands.command(
        description="Mutes user indefinitely",
        help="mutes user"
    )
    @commands.has_permissions(administrator=True)
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
    @commands.has_permissions(administrator=True)
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
    @commands.has_permissions(administrator=True)
    async def unmute(self, ctx, member: discord.Member):
        await member.edit(mute=False)
        await ctx.send(f"{member} was unmuted")

    #kick, ban, unban
    @commands.command(
        description="Kicks user from server",
        help="kicks user from server"
    )
    @commands.has_permissions(administrator=True)
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
    @commands.has_permissions(administrator=True)
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
    @commands.has_permissions(administrator=True)
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


    #warn, wnum, wlist, wclear
    @commands.command()
    async def warn(self, ctx, member: discord.Member, *, reason=None):

        with open("../data/warnings.json") as f:
            data = json.load(f)

        if reason is None:
            await ctx.send("Must have a reason for warning")
        else:
            data[ctx.guild.id][member].append(reason)

        with open("../data/warnings.json") as f:
            json.dump(data,f,indent=4)

    @commands.command()
    async def wnum(self,ctx,member: discord.Member):
        with open("../data/warnings.json") as f:
            data = json.load(f)

        if data[ctx.guild.id][member] is None:
            ctx.send(f"{member} has 0 warnings")
        else:
            ctx.send(f"{member} has {len(data[ctx.guild.id][member])} warnings")


    @commands.command()
    async def wlist(self,ctx,member: discord.Member):
        with open("../data/warnings.json") as f:
            data = json.load(f)

        if data[ctx.guild.id][member] is None:
            await ctx.send(f"{member} has no warnings")
        else:
            if len(data[ctx.guild.id][member])>0:
                response = ",\n".join(data[ctx.guild.id][member])
                await ctx.send(response)
            else:
                await ctx.send(f"{member} has no warnings")


    @commands.command()
    async def wclear(self,ctx,member: discord.Member):
        with open("../data/warnings.json") as f:
            data = json.load(f)

        if data[ctx.guild.id][member] is None:
            await ctx.send(f"{member} has no warnings")
        else:
            data[ctx.guild.id][member].clear()
            await ctx.send(f"{member}'s warnings cleared")

def setup(client):
    client.add_cog(Moderator(client))
