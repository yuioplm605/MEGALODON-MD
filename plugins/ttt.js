const { cmd } = require('../command');
const TicTacToe = require('../lib/tictactoe');

const games = {};

cmd({
    pattern: "ttt",
    alias: ["tictactoe"],
    desc: "Jouer au jeu du morpion",
    category: "game",
    filename: __filename,
},
async (conn, mek, m, { from, sender, args, reply }) => {
    const text = args.join(' ');

    // Vérifie si l'utilisateur est déjà dans une partie
    if (Object.values(games).find(room => 
        room.id.startsWith('tictactoe') && 
        [room.game.playerX, room.game.playerO].includes(sender)
    )) {
        return reply('❌ Tu es déjà dans une partie. Tape *surrender* pour abandonner.');
    }

    // Rejoindre une partie existante
    let room = Object.values(games).find(room => 
        room.state === 'WAITING' && 
        (text ? room.name === text : true)
    );

    if (room) {
        room.o = from;
        room.game.playerO = sender;
        room.state = 'PLAYING';

        const arr = room.game.render().map(v => ({
            'X': '❎', 'O': '⭕',
            '1': '1️⃣', '2': '2️⃣', '3': '3️⃣',
            '4': '4️⃣', '5': '5️⃣', '6': '6️⃣',
            '7': '7️⃣', '8': '8️⃣', '9': '9️⃣',
        }[v]));

        const str = `
🎮 *Jeu TicTacToe lancé !*

Tour de @${room.game.currentTurn.split('@')[0]}...

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

▢ *Règles:*
• Fais 3 symboles alignés pour gagner
• Tape un nombre (1-9) pour jouer
• Tape *surrender* pour abandonner
`;

        await conn.sendMessage(from, {
            text: str,
            mentions: [room.game.currentTurn, room.game.playerX, room.game.playerO]
        });
    } else {
        // Crée une nouvelle partie
        room = {
            id: 'tictactoe-' + Date.now(),
            x: from,
            o: '',
            game: new TicTacToe(sender, 'o'),
            state: 'WAITING'
        };

        if (text) room.name = text;

        games[room.id] = room;

        return reply(`⏳ En attente d'un adversaire...\nTape *.ttt ${text || ''}* pour rejoindre.`);
    }
});

// Mouvement ou abandon
cmd({
    pattern: "^(?:[1-9]|surrender|give up)$",
    desc: "Action de jeu TicTacToe",
    fromMe: false,
    type: "game",
},
async (conn, mek, m, { body, sender, from, reply }) => {
    const room = Object.values(games).find(room => 
        room.id.startsWith('tictactoe') && 
        [room.game.playerX, room.game.playerO].includes(sender) && 
        room.state === 'PLAYING'
    );

    if (!room) return;

    const isSurrender = /^(surrender|give up)$/i.test(body);
    if (!isSurrender && !/^[1-9]$/.test(body)) return;

    if (sender !== room.game.currentTurn && !isSurrender) {
        return reply('❌ Ce n’est pas ton tour.');
    }

    let ok = isSurrender ? true : room.game.turn(sender === room.game.playerO, parseInt(body) - 1);
    if (!ok && !isSurrender) {
        return reply('❌ Case déjà prise.');
    }

    let winner = room.game.winner;
    const isTie = room.game.turns === 9;

    const arr = room.game.render().map(v => ({
        'X': '❎', 'O': '⭕',
        '1': '1️⃣', '2': '2️⃣', '3': '3️⃣',
        '4': '4️⃣', '5': '5️⃣', '6': '6️⃣',
        '7': '7️⃣', '8': '8️⃣', '9': '9️⃣',
    }[v]));

    if (isSurrender) {
        winner = sender === room.game.playerX ? room.game.playerO : room.game.playerX;
        await conn.sendMessage(from, {
            text: `🏳️ @${sender.split('@')[0]} a abandonné ! @${winner.split('@')[0]} gagne !`,
            mentions: [sender, winner]
        });
        delete games[room.id];
        return;
    }

    const status = winner
        ? `🎉 @${winner.split('@')[0]} gagne la partie !`
        : isTie
        ? `🤝 Match nul !`
        : `🎲 Tour de @${room.game.currentTurn.split('@')[0]}`;

    const str = `
🎮 *TicTacToe*

${status}

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

▢ ❎ : @${room.game.playerX.split('@')[0]}
▢ ⭕ : @${room.game.playerO.split('@')[0]}

${!winner && !isTie ? 'Tape un chiffre (1-9) ou *surrender*' : ''}
`;

    await conn.sendMessage(room.x, {
        text: str,
        mentions: [room.game.playerX, room.game.playerO, ...(winner ? [winner] : [])]
    });

    if (room.x !== room.o && room.o) {
        await conn.sendMessage(room.o, {
            text: str,
            mentions: [room.game.playerX, room.game.playerO, ...(winner ? [winner] : [])]
        });
    }

    if (winner || isTie) {
        delete games[room.id];
    }
});
