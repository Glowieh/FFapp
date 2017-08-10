var debug = require('debug')('ffapp:socket-controller');

exports.init = function(io) {
  io.on('connection', (socket) => {
    debug('A user connected');

    socket.on('disconnect', () => {
      debug('A user disconnected');
    });

    socket.on('add-message', (message) => {
      io.emit('message', {type: 'new-message', text: message});
    });
  });
}
