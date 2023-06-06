// lado del backend


import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './routers/views.router.js'


import { Server } from 'socket.io';


const app = express();
const httpServer = app.listen(8080, () => console.log('corriendo'));


const io = new Server(httpServer);

app.engine( "handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");


app.use(express.static(__dirname+'/public'));
app.use('/', viewsRouter)


const mensajes = []

io.on('connection', (socket) => {
    console.log('conectado: ' + socket.id);

    socket.on('message', (data) => {
        console.log(data);
        mensajes.push(data);

        console.log(mensajes);
        io.emit( 'imprimir', mensajes );

    })

    // ingreso nuevo usuario
    socket.on('authenticatedUser', (data) => { 
        console.log('se conecto:' + data);
        socket.broadcast.emit( 'ingreso', data);

    })

})

// socket.emit('evento_para_socket_individual', 'este mensaje solo lo debe recibir el socket')
// socket.broadcast.emit('evento_para_todos_menos_el_socket_actual', 'este evento lo verean los socket conectasdos, MENOS el socket actual desde donde se envio el mensaje')
// socketServer.emit('evento_para_todos', 'este evento lo verean todos los socket conectasdos)