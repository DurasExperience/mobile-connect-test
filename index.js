const app = require( 'express' )()
const http = require( 'http' ).Server( app )
const io = require( 'socket.io' )( http )

const rooms = {}

app.set('view engine', 'ejs')

app.get( '/', ( req, res ) => {
  res.render( __dirname + '/index.ejs' )
})

io.on( 'connection', ( socket ) => {

  socket.on( 'createRoom', ( id, cb ) => {

    rooms[ id ] = {}
    rooms[ id ].socket = io.of( `/${ id }` )
    rooms[ id ].socket.on( 'connection', ( socket ) => {
      socket.emit( 'synchronisedMobile' )
    })
    cb()

  } )
  
  socket.on( 'join', ( id, cb ) => {

    let authorized = false
    if( id in rooms ) {
      authorized = true
      rooms[ id ].socket.emit( 'synchronisedDesktop' )
    }
    cb( authorized )

  })

})

http.listen( 3000, () => {
  console.log( 'listening on *:3000' )
})