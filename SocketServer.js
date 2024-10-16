let onlineUsers = [];

export default function(socket, io) {
  // User joins or opens the application
  socket.on('join', (user) => {
    socket.join(user);

    // Add the joined user to online users if not already present
    if (!onlineUsers.some((u) => u.userId === user)) {
      console.log(`User ${user} is now online`);
      onlineUsers.push({ userId: user, socketId: socket.id });
    }

    // Send online users list to the frontend
    socket.emit('get-online-users', onlineUsers);
  });

  // Send socket id to all users
  io.emit('setup socket', socket.id);

  // User disconnect event
  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log(`User with socket ID ${socket.id} has just disconnected`);
    io.emit('get-online-users', onlineUsers);
  });

  // Join a conversation room
  socket.on('join conversation', (conversation) => {
    socket.join(conversation);
  });

  // Send and receive messages
  socket.on('send message', (message) => {
    let conversation = message?.conversation;

    if (!conversation || !conversation.users) {
      console.log('Conversation or users missing');
      return;
    }

    console.log(`Conversation: ${conversation._id}`);

    // Send the message to all users in the conversation except the sender
    conversation.users.forEach((user) => {
      if (user._id === message.sender._id) return; // Skip the sender
      socket.to(user._id).emit('receive message', message);
    });
  });

  // Typing event
  socket.on('typing', (conversation) => {
    console.log(`User typing in conversation: ${conversation._id}`);
    socket.in(conversation).emit('typing', conversation);
  });

  // Stop typing event
  socket.on('stop typing', (conversation) => {
    console.log(`User stopped typing in conversation: ${conversation._id}`);
    socket.in(conversation).emit('stop typing', conversation);
  });

  // Call user
  socket.on('call user', (data) => {
    let user_id = data?.userToCall;
    let user_socket = onlineUsers.find((user) => user.userId == user_id);

    if (!user_socket) {
      console.log(`User with ID ${user_id} not found`);
      return;
    }

    io.to(user_socket.socketId).emit('call user', {
      signal: data?.signal,
      from: data.from,
      name: data.name,
      picture: data.picture,
    });
  });

  // answer user
  socket.on('answer call' , (data) => {
    io.to(data.to).emit('call accepted' , data.signal)

  })
}
