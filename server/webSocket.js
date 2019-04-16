const WebSocket = require('ws')
const wss = new WebSocket.Server({ server })

wss.on('connection', (ws, req) => {
  console.log('connected')
  console.log(wss.clients.size)

  const timer = setInterval(() => {
    if (ws.readyState !== 1) {
      clearInterval(timer)
      return
    }

    ws.send(JSON.stringify({
      type: 'chat',
      content: 'hello'
    }))
  }, 1000)

  ws.on('message', msg => {
    console.log('received: %s', msg)

    msg = JSON.parse(msg)
    console.log(msg.type)

    wss.clients.forEach(client => {
      console.log(client)
    })
  })

  ws.on('close', () => {
    console.log(new Date(), 'closed')
  })

  ws.on('error', error => {
    console.error(error)
  })
})
