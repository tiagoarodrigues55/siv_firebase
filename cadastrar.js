const { Client } = require('pg')
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'sivOn',
  password: 'Tiago2003',
  port: 5432,
})

const users = [
  {
    "data/hora": "29/10/2020 18:26:16",
    "email": "bruno.scaciotti@alunoviva.com.br",
    "Reprsentações": "The Guardian",
    "Nome": "Bruno Lower Scaciotti",
    "representation_type": "Imprensa",
  },
  {
    "data/hora": "29/10/2020 18:41:49",
    "email": "pietravenusfontana@gmail.com",
    "Reprsentações": "Staff",
    "Nome": "Pietra Venus Fontana",
    "representation_type": "Staff",
  },
  {
    "data/hora": "29/10/2020 19:23:08",
    "email": "lia.cadaval@gmail.com",
    "Reprsentações": "Nova Zelandia",
    "Nome": "Lia Cadaval",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "29/10/2020 20:15:03",
    "email": "Joao.poit@alunoviva.com.br",
    "Reprsentações": "Staff",
    "Nome": "Joao Pedro Poit",
    "representation_type": "Staff",
  },
  {
    "data/hora": "30/10/2020 08:54:01",
    "email": "fernanda.rodriguez@alunoviva.com.br",
    "Reprsentações": "Staff",
    "Nome": "Fernanda Pérez Rodriguez",
    "representation_type": "Staff",
  },
  {
    "data/hora": "04/11/2020 09:26:49",
    "email": "183721@vila.com.br",
    "Reprsentações": "The guardian",
    "Nome": "Catalina Gillio",
    "representation_type": "Imprensa",
  },
  {
    "data/hora": "04/11/2020 09:27:38",
    "email": "173473@vila.com.br",
    "Reprsentações": "",
    "Nome": "Manuela Cersosimo Correia do Nascimento",
    "representation_type": "Imprensa",
  },
  {
    "data/hora": "04/11/2020 09:31:40",
    "email": "190647@vila.com.br",
    "Reprsentações": "El Pais",
    "Nome": "Maria Mendes",
    "representation_type": "Imprensa",
  },
  {
    "data/hora": "04/11/2020 09:36:13",
    "email": "101483@vila.com.br",
    "Reprsentações": "Espanha",
    "Nome": "Enzo Mazzo Gianfrancesco",
    "representation_type": "Delegado",
  },

  {
    "data/hora": "04/11/2020 10:00:18",
    "email": "142538@vila.com.br",
    "Reprsentações": "Japão",
    "Nome": "João Rojz Pereira",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "05/11/2020 10:16:26",
    "email": "vitoriacerqsantos@gmail.com",
    "Reprsentações": "Arábia Saudita",
    "Nome": "Vitoria Cerqueira Santos",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "05/11/2020 10:22:42",
    "email": "enzoalvesfrancoassis@gmail.com",
    "Reprsentações": "",
    "Nome": "Enzo Alves Franco De Assis",
    "representation_type": "Imprensa",
  },
  {
    "data/hora": "05/11/2020 11:53:59",
    "email": "eduardo.abrao@alunoviva.com.br",
    "Reprsentações": "El Pais",
    "Nome": "Eduardo Cardoso Abrão",
    "representation_type": "Imprensa",
  },
  {
    "data/hora": "05/11/2020 12:09:33",
    "email": "lucascastilho584@gmail.com",
    "Reprsentações": "Cuba",
    "Nome": "Lucas Castilho",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "05/11/2020 12:23:02",
    "email": "lourenco.brito@alunoviva.com.br",
    "Reprsentações": "Italia",
    "Nome": "Lourenço Nunes de Brito",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "05/11/2020 12:56:33",
    "email": "guidalfabbro@gmail.com",
    "Reprsentações": "India",
    "Nome": "Guilherme De Castro Dal Fabbro",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "05/11/2020 13:05:12",
    "email": "gabriella.cotching@alunoviva.com.br",
    "Reprsentações": "Suécia",
    "Nome": "Gabriella Cotching",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "05/11/2020 14:52:04",
    "email": "Manuela.garcia@alunoviva.com.br",
    "Reprsentações": "Staff",
    "Nome": "Manuela Estanislau Garcia",
    "representation_type": "Staff",
  },
  {
    "data/hora": "05/11/2020 15:06:34",
    "email": "rafamusa.20@gmail.com",
    "Reprsentações": "Staff",
    "Nome": "Rafael Musa Haenel",
    "representation_type": "Staff",
  },
  {
    "data/hora": "06/11/2020 11:10:15",
    "email": "guilhermepiresdestro@gmail.com",
    "Reprsentações": "Rússia",
    "Nome": "Guilherme Pires Destro",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "06/11/2020 11:15:13",
    "email": "060585@vila.com.br",
    "Reprsentações": "Reino Unido",
    "Nome": "Lorena Schaeffer",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "06/11/2020 11:16:14",
    "email": "183698@vila.com.br",
    "Reprsentações": "Israel",
    "Nome": "Pedro Henrique Chamis Epstein",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "06/11/2020 12:47:21",
    "email": "lneisteinp@gmail.com",
    "Reprsentações": "China",
    "Nome": "Luana Neistein",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "06/11/2020 12:58:03",
    "email": "gabrielbredaalves@gmail.com",
    "Reprsentações": "Mark Lemley",
    "Nome": "Gabriel Breda Alves",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "06/11/2020 16:03:53",
    "email": "theomazina@gmail.com",
    "Reprsentações": "Peter Galison",
    "Nome": "Theo Teixeira Mazina Martins",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "06/11/2020 18:11:08",
    "email": "Romanhellena@gmail.com",
    "Reprsentações": "Bélgica",
    "Nome": "Hellena Roman",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "09/11/2020 11:50:07",
    "email": "romulohenrique05@gmail.com",
    "Reprsentações": "Marrocos",
    "Nome": "Rômulo Henrique Peres da Cruz",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "09/11/2020 20:14:33",
    "email": "felipe.galleazzi@alunoviva.com.br",
    "Reprsentações": "Nigéria",
    "Nome": "Felipe Galleazzi",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "10/11/2020 09:56:38",
    "email": "maria.huallem@alunoviva.com.br",
    "Reprsentações": "Equador",
    "Nome": "Maria Luísa Ribeiro Huallem",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "10/11/2020 10:37:39",
    "email": "beatriz.pernambuco@alunoviva.com.br",
    "Reprsentações": "Haiti",
    "Nome": "Beatriz Janoni de Almeida Pernambuco",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "10/11/2020 10:44:02",
    "email": "maria.cassis@alunoviva.com.br",
    "Reprsentações": "Le Monde",
    "Nome": "Maria Carolina Caputo Cassis",
    "representation_type": "Imprensa",
  },
  {
    "data/hora": "10/11/2020 10:45:35",
    "email": "luiz.botosso@alunoviva.com.br",
    "Reprsentações": "Brasil de Fato",
    "Nome": "Luiz Roberto Ormelli Botosso",
    "representation_type": "Imprensa",
  },
  {
    "data/hora": "10/11/2020 19:22:02",
    "email": "sndippolito@gmail.com",
    "Reprsentações": "Brasil de Fato",
    "Nome": "Sofia D’Ippolito",
    "representation_type": "Imprensa",
  },
  {
    "data/hora": "11/11/2020 08:45:32",
    "email": "laura.tartaro@alunoviva.com.br",
    "Reprsentações": "Le Monde",
    "Nome": "Laura Tartaro",
    "representation_type": "Imprensa",
  },
  {
    "data/hora": "11/11/2020 09:06:07",
    "email": "joaomcarrera@alunoviva.com",
    "Reprsentações": "Noruega",
    "Nome": "João Carrera",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "11/11/2020 10:45:52",
    "email": "paloma.kamamoto@alunoviva.com.br",
    "Reprsentações": "El Pais",
    "Nome": "Paloma Ortiz Kamamoto",
    "representation_type": "Imprensa",
  },
  {
    "data/hora": "11/11/2020 11:09:55",
    "email": "victor.russo@alunoviva.com.br",
    "Reprsentações": "Sander Van der Linden",
    "Nome": "Victor Russo",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "11/11/2020 11:33:19",
    "email": "marcos.rodrigues@alunoviva.com.br",
    "Reprsentações": "Austrália",
    "Nome": "Marcos Americano Rodrigues",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "11/11/2020 11:41:09",
    "email": "andre3siviero@gmail.com",
    "Reprsentações": "França",
    "Nome": "André Emleh Siviero",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "11/11/2020 12:21:49",
    "email": "martin.kurlat@alunoviva.com.br",
    "Reprsentações": "The Guardian",
    "Nome": "Martín Kurlat",
    "representation_type": "Imprensa",
  },
  {
    "data/hora": "11/11/2020 15:55:34",
    "email": "gus.arienzo@gmail.com",
    "Reprsentações": "Coreia do Sul",
    "Nome": "Gustavo da Silva Arienzo",
    "representation_type": "Delegado",
  },
  {
    "data/hora": "11/11/2020 16:51:01",
    "email": "nara.nunes@alunoviva.com.br",
    "Reprsentações": "The Guardian",
    "Nome": "Nara Viscardi Storto Nunes",
    "representation_type": "Imprensa",
  },
  
]

const usersCorrigido = []
for(i of users){
  if(i.representation_type === 'Delegado'){
    usersCorrigido.push({
      username: i.Nome,
      email: i.email,
      representation_type: i.representation_type,
      newspaper_group: null,
      representation: i.Reprsentações,
      password: Math.floor(Math.random() * 8999) + 1000
  
    })
  }
  if(i.representation_type === 'Staff'){
    usersCorrigido.push({
      username: i.Nome,
      email: i.email,
      representation_type: i.representation_type,
      newspaper_group: null,
      representation: `Staff-${i.Nome.split(' ')[0]}`,
      password: Math.floor(Math.random() * 8999) + 1000
  
    })
  }
  if(i.representation_type === 'Imprensa'){
    usersCorrigido.push({
      username: i.Nome,
      email: i.email,
      representation_type: i.representation_type,
      representation: `${i.Reprsentações}-${i.Nome.split(' ')[0]}`,
      newspaper_group: i.Reprsentações,
      password: Math.floor(Math.random() * 8999) + 1000
  
    })
  }
  if(i.representation_type === 'Investidor'){
    usersCorrigido.push({
      username: i.Nome,
      email: i.email,
      representation_type: i.representation_type,
      newspaper_group: null,
      representation: `Investidor-${i.Nome.split(' ')[0]}`,
      newspaper_group: i.Reprsentações,
      password: 1234
  
    })
  }

}
;(async () =>{
  if(process.env.BANCO){
  await client.connect()
for(user of usersCorrigido){
  const text = 'INSERT INTO users(username, email, password, newspaper_group, representation_type, representation) VALUES($1, $2, $3, $4, $5, $6) RETURNING *'
  const values = [user.username, user.email, user.password,user.newspaper_group, user.representation_type, user.representation]
  // callback

  
    client.query(text, values, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(res.rows)
    }
  })
}
  }else{
    
  }
  })()

   