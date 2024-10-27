import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { readdirSync as _readdirSync } from 'fs';
import keepAlive from './server.js'; // Si tu server.js contiene lógica para mantener vivo el bot, mantén esto.

// Crear una nueva instancia del cliente con los intents necesarios
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Intents para eventos relacionados con servidores
    GatewayIntentBits.GuildMessages, // Intents para recibir mensajes en los servidores
    GatewayIntentBits.MessageContent // Necesario para leer el contenido de los mensajes
  ]
});

// Inicializa la colección de comandos
client.commands = new Collection();
loadCommands();

// Carga los comandos desde la carpeta './comandos'
async function loadCommands() {
    const commandFiles = _readdirSync('./comandos').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      try {
        const command = await import(`../comandos/${file}`);
        client.commands.set(command.name, command);
        console.log(`Comando cargado: ${command.name}`);
      } catch (error) {
        console.error(`Error al cargar el comando ${file}:`, error);
      }
    }
  }

// Evento 'ready' cuando el bot está en línea
client.once('ready', () => {
  setPresence();
  console.log('¡Wenos diaas!');
});

// Establece la presencia del bot
function setPresence() {
  client.user.setPresence({
    status: 'idle',
    activities: [
      {
        name: 'Whole Lotta Love',
        type: 'LISTENING', // Tipo de presencia actualizado
      }
    ],
  });
}

// Maneja los mensajes
client.on('messageCreate', (message) => { // Cambiado a 'messageCreate'
  const prefix = 'S.';

  // Ignorar mensajes de bots o que no comienzan con el prefijo
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();

  const cmd = client.commands.get(commandName) || 
              client.commands.find(c => c.alias && c.alias.includes(commandName));
    console.log(`Comando buscado: ${commandName}`); // Para verificar qué comando se está buscando
    console.log(`Comando encontrado: ${cmd ? cmd.name : 'No encontrado'}`); // Verifica si el comando fue encontrado            

  if (cmd) {
    cmd.execute(client, message, args).catch(error => {
      console.error(`Error al ejecutar el comando ${commandName}:`, error);
      message.reply('Hubo un error al intentar ejecutar ese comando.');
    });
  } else {
    message.reply('Comando no encontrado: ${commandName}');
  }
});

// Inicia el servidor Express para mantener el bot vivo (si es necesario)
keepAlive();

// Inicia sesión con el token del bot
const mySecret = process.env['TOKEN'];
client.login(mySecret).catch(error => {
  console.error('Error al iniciar sesión:', error);
});
