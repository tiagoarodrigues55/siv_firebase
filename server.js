const express = require('express')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const cors = require('cors')
const axios = require('axios')
const api = axios.create({
  baseURL: 'https://us-central1-siv-2021.cloudfunctions.net/app/api',
});

const {
  userJoin,
  getCurrentUser,
} = require('./user');

app.use(cors());

async function getToFirebase(path){
  const response = await api.get(path)
  return response.data
}

async function main(){
  let users = await getToFirebase('/read/users');
  let messages = await getToFirebase('/read/messages');
  const stockTotal = 10000
  let speechesList = []
  let actions = []
  let favorables = []
  let againsts = []
  let lastVote 
  let voteTitle
  let speaker
  let aplausos = []
  let speakers = []
  let postsPreview = []
  let privateDocs = await getToFirebase('/read/privateDocs');
  let delegates = []
  let Docs = await getToFirebase('/read/publicDocs');
  let posts = await getToFirebase('/read/posts');

  const meet = {
    room: '',
    password: ''
  }

  io.on('connection', socket =>{
    console.log('connection')
    socket.on('connected', ({username, representation_type, userId})=>{
      console.log('connected')
      userJoin(socket.id, username)
      if(representation_type==="Mesa"){
        socket.join('Mesa')
      }
      if(representation_type==="Chefe de imprensa"){
        socket.join('Chefe de imprensa')
      }
      if(representation_type==="Staff"){
        socket.join('Staff')
      }
      if(representation_type==="Delegado"){
        socket.join('Delegado')
      }
      if(representation_type==="Jornalista"){
        socket.join('Jornalista')
      }
      if(representation_type==="Investidor"){
        socket.join('Investidor')
        api.get("/read/users").then(({data})=>{
          
          const delegates = data.filter(user=>user.representation_type==="Delegado")
          socket.emit('getDelegates', delegates)
        }).catch(err=>console.log(err))
        socket.emit('getCurrentMoney', async ()=>{
          const user = await api.get(`/read/users/${userId}`).catch(err=>console.log(err))
          console.log('getCurrentMoney',user.data.sivcoins)
          socket.emit('getCurrentMoney', user.data.sivcoins)
        })
        getPositions(userId)
      }
      const cache = {}
      messages.map(msg=>{
        if(msg.author === username){
          !cache[msg.destiny]?cache[msg.destiny] = []:null
          cache[msg.destiny].push({
            position: 'right',
            type: 'text',
            text: msg.content,
            date: msg.date || new Date().getTime(),
        })
  
        }
        if(msg.destiny === username){
          !cache[msg.author]?cache[msg.author] = []:null
          cache[msg.author].push({
            position: 'left',
            type: 'text',
            text: msg.content,
            date: msg.date || new Date(),
        })
        }
      })
      socket.emit('PreviousEmits', {
        speechesList,
        posts,
        lastVote,
        Docs,
      })
      socket.emit("setPrivateDocs", privateDocs)
      socket.emit('setCache', cache)
    })

    //Conexão
    console.log('socket conectado: ' + socket.id)

    //Emits



    if(meet.room !== ''){
      socket.emit('setMeet', meet)
      console.log('emit meetRoom' + meet)
    }

    if(!actions[0]){
      io.to('Mesa').emit('setActions', [])

    }else{
      io.to('Mesa').emit('setActions', actions)
    }
    if(!users[0]){
      main()
      return
    }
    users.map(res=>res.representation_type === 'Delegado' ? delegates.push(res) : null)

    //Chat
    socket.on('sendMessage', ({author, destiny, content, date})=>{
      console.log('sendMessage')
      const Destiny = getCurrentUser(destiny)
      messages.push({author, destiny, content, date})
      api.post('/create/messages', {author, destiny, content, date}).catch(err=>console.log(err))
      if(!Destiny){
        return
      }
      const Messages = []
      messages.map(msg=>{
        if(msg.author === destiny && msg.destiny === author){
          Messages.push({
            position: 'right',
            type: 'text',
            text: msg.content,
            date: msg.date || new Date().getTime(),
        },)
        }
        if(msg.destiny === destiny && msg.author === author){
          Messages.push({
            position: 'left',
            type: 'text',
            text: msg.content,
            date: msg.date || new Date(),
        })
        }
      })
      socket.to(Destiny.id).emit('newMessage', {author, Messages})
    })
    socket.on('changeContat', ({contat, user, cache})=>{
      console.log('changeContat')
      let Messages = []
      if(!user){
        console.log('user is null')
        return
      }
      messages.map(msg=>{
        if(msg.author === user && msg.destiny === contat){
          Messages.push({
            position: 'right',
            type: 'text',
            text: msg.content,
            date: msg.date || new Date().getTime(),
        },)
        }
        if(msg.destiny === user && msg.author === contat){
          Messages.push({
            position: 'left',
            type: 'text',
            text: msg.content,
            date: msg.date || new Date(),
        })
        }
      })
      if(!cache){
        cache = []
      }
      if(Messages.length !== cache.length){
        socket.emit('setMessages', {contat, Messages})
      }

    })



    //Lista de Discursos

    socket.on('newSubscribe', representation =>{
      console.log('newSubscribe')
      speechesList.push(representation)
      io.emit('setSpeechesList', speechesList)
    })
    socket.on('removeSubscribe', () =>{
      console.log('removeSubscribe')
      speechesList.shift()
      io.emit('setSpeechesList', speechesList)
    })

    //Questões e Moções
    socket.on('newAction', action=>{
      console.log('newAction')
      actions.push(action)
      io.to('Mesa').emit('setActions', actions)
    })
    socket.on('removeAction', action=>{
      console.log('removeAction')
      actions = actions.filter(filter)
      if(!actions[0]){
        console.log([])
        io.to('Mesa').emit('setActions', [])
      }else{
        io.to('Mesa').emit('setActions', actions)
      }
      function filter(i){
        if(i.description!==action.description || i.representation !== action.representation){
        console.log(i, action)
        return true
        }else{

          return false
        }
      }
    })

    //Imprensa
    socket.on('post', file=>{
      console.log('post')
      posts.push(file)
      api.post('/create/posts', file).catch(err=>console.log(err))
      io.emit('posts', posts)
    })

    //Votes

    socket.on('newVote', vote=>{
      console.log('newVote')
      io.emit('newVote', vote)
      voteTitle = vote.title
    })
    
    socket.on('responseY', representation=>{
      console.log('responseY')
      favorables.push(representation)
      io.emit('favorables', favorables)
    })
    socket.on('responseN', representation=>{
      console.log('responseN')
      againsts.push(representation)
      io.emit('againsts', againsts)
    })
    socket.on('finishVote', vote=>{
      console.log('finishVote')
      favorables = []
      againsts = []
      lastVote = vote
      vote.title = voteTitle
      api.post('/create/votes', vote).catch(err=>console.log(err))
      io.emit('finishVote', vote)
    })

  
    //Docs
    socket.on('newPrivateDoc', doc=>{
      console.log('newPrivateDoc: ', doc)
      io.emit("newDoc", doc)
      privateDocs.push(doc)
      api.post('/create/privateDocs', doc).catch(err=>console.log(err))
      socket.emit("setPrivateDocs", privateDocs)
    })
    socket.on('newPublicDoc', doc=>{
      console.log('newPublicDoc')
      io.emit("newDoc", doc)
      Docs.push(doc)
      api.post('/create/publicDocs', doc).catch(err=>console.log(err))
      io.emit("setPublicDocs", Docs)
    })

    //Cronometro

    socket.on('startStop', (status)=>{
      console.log('startStop')
      io.emit('chronometer', status)
    })
    socket.on('reset', ()=>{
      console.log('reset')
      io.emit('reset')
    })
    socket.on('setSpeechesTime', (time)=>{
      console.log('setSpeechesTime')
      io.emit('setSpeechesTime', time)
    })
    //PostsPreview

    socket.on('postsPreview', post=>{
      console.log('postPreview')
      postsPreview.push(post)
      io.to("Chefe de imprensa").emit('setPostsPreview', postsPreview)
    })
    socket.on('removePostPreview', post=>{
      console.log('removePostPreview: ')
      postsPreview = postsPreview.filter(filter)
      console.log(postsPreview)
      if(!postsPreview[0]){
        console.log([])
        io.to("Chefe de imprensa").emit('setPostsPreview', [])


      }else{
        console.log(postsPreview[0].name)

        io.to("Chefe de imprensa").emit('setPostsPreview', postsPreview)

      }
      function filter(i){
        if(i.description!==post.description || i.representation !== post.representation){
        console.log(i, post)
        return true
        }else{
          return false
        }
      }
    })

    //login
    socket.on('Cadastro', user=>{
      console.log('Cadastro')
      api.post('/create/users', user).catch(err=>console.log(err))
    })

    socket.on('login', user=>{
      console.log('login')
      api.post('/auth', user).then(res=>{
        socket.emit('login', res.data)
      }).catch(err=>console.log(err))
    })
    socket.on('getUsers', ()=>{
      console.log('getUsers')
      socket.emit('getUsers', users)
    })

    //jitsi
    socket.on("changeSpeaker", ({id, participants})=>{
      console.log('changeSpeaker')
      const participant = participants.find(part=>part.participantId === id.id)
      if(speaker !== participant.displayName){
        const now = new Date().getTime()
        speakers.push({speaker: participant.displayName, date:now})
      }
      speaker = participant.displayName
      console.log(speaker)
      updatePoints()
    })
    socket.on("aplauso", ()=>{
      console.log('aplauso',speaker)
      const now = new Date().getTime()
      aplausos.push({speaker, date: now})
    })

    //Intervenção
    socket.on('live', (link)=>{
      console.log('live')
      io.emit('live', link)
    })

    //investidor
    socket.on('getCurrentMoney', async (userId)=>{
      const user = await api.get(`/read/users/${userId}`).catch(err=>console.log(err))
      console.log('getCurrentMoney',user.data.sivcoins)
      socket.emit('getCurrentMoney', user.data.sivcoins)
    })
    socket.on('getPositions', async (userId)=>{
      console.log('getPositions')
      getPositions(userId)
    })
    socket.on('BuyDelegate', async({quantity, value, delegateId, userId, buy=true})=>{
      console.log('buyDelegates')
      const userResponse = await api.get(`/read/users/${userId}`).catch(err=>console.log(err))
      const delegateResponse = await api.get(`/read/users/${delegateId}`).catch(err=>console.log(err))
      const user = userResponse.data
      const delegate = delegateResponse.data
      const total = Number((quantity * value).toFixed(2))

      if(user.sivcoins < total){
        return
      }
      user.sivcoins = buy?(Number(user.sivcoins) - total).toFixed(2):(Number(user.sivcoins) + total).toFixed(2)
      console.log(`sivcoins: ${user.sivcoins}`)
      position = user.positions.find(position=>position.id === delegateId)
    
      if(position){
        if(!buy && position.quantity - 1<1){
          user.positions.splice(user.positions.indexOf(position), 1)
        }else{
        user.positions[user.positions.indexOf(position)] = buy?{id: delegateId, quantity: position.quantity + 1}:{id: delegateId, quantity: position.quantity - 1}
        }
      }else{
        user.positions.push({id: delegateId, quantity: 1})
      }
      delegate.stock = buy?delegate.stock - quantity:delegate.stock + quantity
      const newPrice = getPrice(delegate.price, delegate.stock, buy)
      delegate.price = newPrice.toFixed(2)
      delegate.lastValorization = buy?delegate.price - newPrice:delegate.price + newPrice

      await api.put(`update/users/${userId}`, user).catch(err=>console.log(err))
      await api.put(`update/users/${delegateId}`, delegate).catch(err=>console.log(err))
      users = await api.get(`/read/users`).catch(err=>console.log(err))
      const delegates = []
      users.data.map(res=>res.representation_type === 'Delegado' ? delegates.push(res) : null)
      socket.emit('getDelegates', delegates)
      socket.emit('getCurrentMoney', user.sivcoins)
      getPositions(userId)
  })
  socket.on('getDelegates', ()=>{
    console.log('getDelegates')
    api.get("/read/users").then(({data})=>{
      const delegates = data.filter(user=>user.representation_type==="Delegado")
      socket.emit('getDelegates', delegates)
    }).catch(err=>console.log(err))
  })
  socket.on('joinApplauses', ()=>{joinApplauses(aplausos)})
  function joinApplauses(applauses){
    console.log('joinApplauses')
    const joinApplauses = []
    let lastSpeaker = ''
    let count = 0
    for(let applause of applauses){
      if(applause.speaker === lastSpeaker){
        count + 1
      }else{
        if(lastSpeaker === ''){
          lastSpeaker = applause.speaker
          count + 1
        }else{
          joinApplauses.push({speaker: lastSpeaker, applauses: count})
          count = 0
          lastSpeaker = applause.speaker
        }
      }
    }
    socket.emit('joinApplauses', joinApplauses) 
  }
  async function getPositions(userId){
    const user = await api.get(`/read/users/${userId}`).catch(err=>console.log(err))
    const users = await api.get(`/read/users`).catch(err=>console.log(err))
    const positions = []
    user.data.positions.map(position=>{
      users.data.map(us=>{
        if(us.id === position.id){
          positions.push({
            id: position.id,
            quantity: position.quantity,
            representation: us.representation,
            points: us.points,
            price: Number(us.price).toFixed(2),
            totalValue: Number(us.price * position.quantity).toFixed(2),
            dividends: Number((position.quantity/stockTotal)*100).toFixed(2)
          })
        }
      })
    })
    socket.emit('getPositions', positions)
  }
  async function updatePoints(){
    const responseUsers = await api.get("/read/users").catch(err=>console.log(err))
    const users = responseUsers.data
    const delegates = users.filter(user=>user.representation_type==="Delegado")
    const investidores = users.filter(user=>user.representation_type==="Investidor")
    for(let delegate of delegates){
      let newPoints = 0
      aplausos.map(({speaker})=>{
        if(speaker === delegate.username){
          newPoints ++ 
        }
      })
      aplausos = []
      delegate.points += newPoints
      const now = new Date().getTime()
      delegate.historyPrice.push({points: newPoints, price: delegate.price, date:now})
      await api.put(`update/users/${delegate.id}`, delegate).catch(err=>console.log(err))
      socket.emit('getDelegates', delegates)
    }
    for(let investidor of investidores){
      let totalPoints = 0
      investidor.positions.map(({id, quantity})=>{
        var newPoints = 0
        aplausos.map(({speaker})=>{
          if(speaker === id){
            newPoints ++ 
          }
        })
        totalPoints += (newPoints * (quantity / stockTotal))
      })
      investidor.points += totalPoints
      await api.put(`update/users/${investidor.id}`, investidor).catch(err=>console.log(err))

    }

  }
  })
  server.listen(process.env.PORT || 3001)




  function getPrice(price, stock, buy = true){
    return price*10000/stock
  }

}
main()
function setAllStocks(number){
  api.get("/read/users").then(({data})=>{
    const delegates = data.filter(user=>user.representation_type==="Delegado")
    delegates.map(async delegate=>{
      delegate.stock = number
      await api.put(`update/users/${delegate.id}`, delegate)
    })
  })
}

