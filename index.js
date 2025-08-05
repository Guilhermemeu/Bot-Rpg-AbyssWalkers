require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const { Client,
  GatewayIntentBits
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ]
});

client.on('ready', () => {
  console.log(`Bot Online como ${client.user.tag}!`);
});

const db = new sqlite3.Database('./dados.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado ao banco de dados SQLite.');
});

db.run(`
      CREATE TABLE IF NOT EXISTS dados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      resiliencia INTEGER DEFAULT 0,
      bravura INTEGER DEFAULT 0,
      adaptacao INTEGER DEFAULT 0,
      curiosidade INTEGER DEFAULT 0,
      vontade INTEGER DEFAULT 0);
  `)

/*----------------| Criar |----------------*/

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content.startsWith('!criar')) {
    const ficha = message.content.split(' ').slice(1);

    if (ficha.length !== 6) {
      return message.reply('Por favor, forneça o nome e os atributos separadas por espaço.\nEx: !criar NomePersonagem 1 2 3 1 1');


    }
    db.run(
      `INSERT INTO dados (nome, resiliencia, bravura, adaptacao, curiosidade, vontade) VALUES (?, ?, ?, ?, ?, ?)`,
      ficha)
    message.reply(`${ficha[0]} Foi criado com sucesso`)

  };
});

/*----------------| Apagar |----------------*/
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content.startsWith('!apagar')) {
    const apagar = message.content.split(' ').slice(1);
    if (apagar.length !== 1) {
      return message.reply('Digite o nome do personagem para apaga-lo.\nEx: !apagar Nomepersonagem');
    }
    db.run(
      `DELETE FROM dados WHERE nome = '${apagar[0]}'`
    )
    message.reply(`${apagar} Foi apagado com sucesso`)
  };
});


/*----------------| Rolar status |----------------*/



function RodarAtributo(atributo) {


  let i = 0 // Lado de fora a cada 
  var InprepAtri = 0
  var Dado, DadosRodar, bonus;

  if (atributo === 0) {
    Dado = 4
    DadosRodar = 2
    bonus = -1
  }
  else if (atributo === 1) {
    Dado = 6
    DadosRodar = 2
    bonus = -2
  }
  else if (atributo === 2) {
    Dado = 6
    DadosRodar = 2
    bonus = 0
  }
  else if (atributo === 3) {
    Dado = 8
    DadosRodar = 2
    bonus = 1
  } else { return 0 }

  while (i < DadosRodar) {
    const atualAtri = Math.floor(Math.random() * (Dado - 1)) + 1
    InprepAtri = InprepAtri + atualAtri;
    i++; // quando ficar igual ao total de dados

    if (i === DadosRodar) {
      const Total = Math.floor((InprepAtri + bonus) / 3)
      return Total
    }
  }

};

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content.startsWith('!preparar')) {
    const NomePreparar = message.content.split(' ').slice(1);

    if (NomePreparar.length !== 1) {
      return message.reply('Digite o nome do personagem que deseja rodar os status \nEx: !preparar Padaria');
    }

    const RowR = await new Promise((resolve, reject) => {
      db.get(`SELECT resiliencia FROM dados WHERE nome = ?`, [NomePreparar[0]],
        (err, rowR) => {
          if (err) reject(err);
          else resolve(rowR);
        }
      );
    });

    console.log("[DEBUG] Valor de 'resiliencia':", RowR?.resiliencia); // Mostra apenas o atributo

    let resilienciaValue = 0;

    if (RowR && RowR.resiliencia !== null && RowR.resiliencia !== undefined) {
      resilienciaValue = RowR?.resiliencia;
    }
    const Res = RodarAtributo(resilienciaValue);

    /*----------------------------------------------------------------------*/

    const RowB = await new Promise((resolve, reject) => {
      db.get(`SELECT bravura FROM dados WHERE nome = ?`, [NomePreparar[0]],
        (err, rowB) => {
          if (err) reject(err);
          else resolve(rowB);
        }
      );
    });

    console.log("[DEBUG] Valor de 'bravura':", RowB?.bravura); // Mostra apenas o atributo

    let BravuraValue = 0;

    if (RowB && RowB.bravura !== null && RowB.bravura !== undefined) {
      BravuraValue = RowB?.bravura;
    }
    const Bra = RodarAtributo(BravuraValue);

    /*----------------------------------------------------------------------*/


    const RowA = await new Promise((resolve, reject) => {
      db.get(`SELECT adaptacao FROM dados WHERE nome = ?`, [NomePreparar[0]],
        (err, rowA) => {
          if (err) reject(err);
          else resolve(rowA);
        }
      );
    });

    console.log("[DEBUG] Valor de 'adaptacao':", RowA?.adaptacao); // Mostra apenas o atributo

    let adaptacaoValue = 0;

    if (RowA && RowA.adaptacao !== null && RowA.adaptacao !== undefined) {
      adaptacaoValue = RowA?.adaptacao;
    }
    const Ada = RodarAtributo(adaptacaoValue);

    /*----------------------------------------------------------------------*/

    const RowC = await new Promise((resolve, reject) => {
      db.get(`SELECT curiosidade FROM dados WHERE nome = ?`, [NomePreparar[0]],
        (err, rowC) => {
          if (err) reject(err);
          else resolve(rowC);
        }
      );
    });

    console.log("[DEBUG] Valor de 'curiosidade':", RowC?.curiosidade); // Mostra apenas o atributo

    let curiosidadeValue = 0;

    if (RowC && RowC.curiosidade !== null && RowC.curiosidade !== undefined) {
      curiosidadeValue = RowC?.curiosidade;
    }
    const Curio = RodarAtributo(curiosidadeValue);

    /*----------------------------------------------------------------------*/

    const RowV = await new Promise((resolve, reject) => {
      db.get(`SELECT vontade FROM dados WHERE nome = ?`, [NomePreparar[0]],
        (err, rowV) => {
          if (err) reject(err);
          else resolve(rowV);
        }
      );
    });

    console.log("[DEBUG] Valor de 'curiosidade':", RowV?.vontade); // Mostra apenas o atributo

    let VontadeValue = 0;

    if (RowV && RowV.vontade !== null && RowV.vontade !== undefined) {
      VontadeValue = RowV?.vontade;
    }
    const Von = RodarAtributo(VontadeValue);

    message.reply(`Os status de ${NomePreparar[0]} neste momento são:\n\nResiliencia: ${Res}\nBravura: ${Bra}\nAdaptação: ${Ada}\nCuriosidade: ${Curio}\nVontade: ${Von}`);
  };
/*--------------------------------------------------------*/ 

  client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (message.content.startsWith('!oi')) {
      message.reply('O/')
    };
    
  });






});

client.login(process.env.TOKEN); 