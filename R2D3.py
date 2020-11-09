import discord
import os
from discord.ext import commands, tasks
from itertools import cycle

PREFIX = ("!", "yo ")
TOKEN = os.environ['BOT_TOKEN']

client = commands.Bot(command_prefix=PREFIX)
status = cycle(['with my dog', 'with my cat', 'with my hamster'])


@client.event
async def on_ready():
    change_status.start();
    print(f'Logged in as {client.user.name}')


@client.event
async def on_command_error(ctx, error):
    if isinstance(error, commands.CommandNotFound):
        pass


@client.command(
    description="Loads a cog with all it's functionalities so they can be used",
    help="load <cog> -> loads <cog> into the project"
)
@commands.has_permissions(administrator=True)
async def load(ctx, extension):
    client.load_extension(f'cogs.{extension}')


@client.command(
    description="Unloads a cog and all it's functionalities",
    help="unload <cog> -> unloads <cog>"
)
@commands.has_permissions(administrator=True)
async def unload(ctx, extension):
    client.unload_extension(f'cogs.{extension}')


@client.command(
    description="Reloads a cog (needs to be done when cog code is edited)",
    help="reload <cog> -> unloads then loads <cog> again"
)
@commands.has_permissions(administrator=True)
async def reload(ctx, extension):
    client.unload_extension(f'cogs.{extension}')
    client.load_extension(f'cogs.{extension}')


@tasks.loop(seconds=10)
async def change_status():
    await client.change_presence(activity=discord.Game(next(status)))


for filename in os.listdir('./cogs'):
    if filename.endswith('.py'):
        client.load_extension(f'cogs.{filename[:-3]}')

client.run(TOKEN)
