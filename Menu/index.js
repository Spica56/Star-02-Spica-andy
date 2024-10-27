import { Client, Collection } from 'discord.js';
import keepAlive from './server.js';
import { readdirSync as _readdirSync } from 'fs';

const client = new Client();
const express = require("express")().get("/", (req, res) => res.send("Bot Activado")).listen(3000);

// Inicializa la colección de comandos
client.commands = new Collection();
loadCommands();

// Carga los comandos desde la carpeta './comandos'
function loadCommands() {
  const commandFiles = _readdirSync('./comandos').filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    try {
      const command = require(`./comandos/${file}`);
      client.commands.set(command.name, command);
      console.log(`Comando cargado: ${command.name}`);
    } catch (error) {
      console.error(`Error al cargar el comando ${file}:`, error);
    }
  }
}

// Evento 'ready'
client.on('ready', () => {
  setPresence();
  console.log('¡Wenos diaas!');
});

// Establece la presencia del bot
function setPresence() {
  client.user.setPresence({
    status: 'idle',
    activity: {
      name: 'Whole Lotta Love',
      type: 'LISTENING',
    },
  });
}

// Maneja los mensajes
client.on('message', (message) => {
  const prefix = 'Star, ';
  
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();

  const cmd = client.commands.get(commandName) || 
              client.commands.find(c => c.alias && c.alias.includes(commandName));

  if (cmd) {
    cmd.execute(client, message, args).catch(error => {
      console.error(`Error al ejecutar el comando ${commandName}:`, error);
      message.reply('Hubo un error al intentar ejecutar ese comando.');
    });
  } else {
    message.reply('Comando no encontrado.');
  }
});

// Inicia sesión con el token
const mySecret = process.env['TOKEN'];
client.login(mySecret).catch(error => {
  console.error('Error al iniciar sesión:', error);
});
