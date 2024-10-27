export async function execute(client, message, args) {
    const username = message.author.username; // Obtiene el nombre de usuario
    const customGreeting = args.length ? args.join(' ') : 'querido usuario'; // Mensaje personalizado
    const greetings = [
        `¡Muy buenas, ${username}! ${customGreeting}.`,
        `¡Hola, ${username}! ¿Cómo estás? ${customGreeting}.`,
        `¡Salud, ${username}! ¿Qué tal tu día? ${customGreeting}.`,
    ];
    
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    await message.channel.send(randomGreeting); // Espera a que se envíe el mensaje
}
