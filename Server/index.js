const express = require('express');
const cors = require("cors");
const jwt = require('jsonwebtoken');
const socket_io  = require("socket.io");
const http = require("http")
const HOST = '0.0.0.0';
const {write_log_file,error_message,info_message,success_message,normal_message} = require('./modules/_all_help');
const { send_welcome_page, send_otp_page } = require('./modules/send_server_email');
const { generate_otp, get_otp, clear_otp } = require('./modules/OTP_generate');
const { get_users,get_chats } = require('./modules/mongodb');

const User = get_users(); 
const Chat = get_chats();

const PORT = 4000;
const JWT_SECRET_KEY = 'Jwt_key_for_Chat_x_app';


const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
  }
});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



io.on("connection", (socket) => {

  socket.on("user_info", (data) => {
    console.log("Connected user:", data.user_email);
    socket.user_email = data.user_email; // Store user email in the socket
  });


socket.on('sendNotification', (data) => {
    io.emit('data-updated', { update_email: data.update_email ,
          room_id:data.room_id });
    console.log("send data-updated to",data.update_email);
    
});

socket.on('disconnect', () => {
        console.log('User disconnected ');
    });


});

let test = 0;
app.post('/api/get_chat', async (req, res) => {
  const { chat_id, reverser_email, sender_email } = req.body; // Get emails from the request body

  if (chat_id) {
      try {
          const chatId_2 = chat_id.split('_%_%#%_%_').reverse().join('_%_%#%_%_'); // Reverse the order of the emails

          let chat = await Chat.findOne({
              $or: [
                  { chat_id: chat_id },
                  { chat_id: chatId_2 }
              ]
          });

          // If chat not found, create a new chat
          if (!chat) {
              chat = new Chat({
                  chat_id: chat_id,
                  participants: [sender_email, reverser_email], // Use the sender and reverser emails
                  messages: [],
              });
              await chat.save();
          }
          test++;
          console.log("Start get chats count : -",test);
          
          res.json(chat.messages || chat);
      } catch (error) {
          console.error('Error fetching chat:', error);
          res.status(500).json({ message: 'Internal Server Error' });
      }
  }
});


app.post('/api/send_message', async (req, res) => {
  const { message, reverser_email, sender_email, chat_id } = req.body;

  if (!message || !reverser_email || !sender_email || !chat_id) {
      return res.status(400).json({ message: 'Missing required fields' });
  }

  try {


      const chatId_2 = chat_id.split('_%_%#%_%_').reverse().join('_%_%#%_%_'); 

      let chat = await Chat.findOne({
          $or: [
              { chat_id: chat_id },
              { chat_id: chatId_2 }
          ]
      });

      if (!chat) {
          chat = new Chat({
              chat_id: chat_id,
              participants: [sender_email, reverser_email],
              messages: [],
          });
      }

      const newMessage = {
          message,
          reverser_email,
          sender_email,
          time: new Date()
      };

      chat.messages.push(newMessage);
      await chat.save();

      res.status(200).json({ message: 'Message sent successfully', newMessage });
  } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});





function create_jwt_token(email,username,password){
  let data_for_jwt = {email,username,password}
  let jwt_token = jwt.sign(data_for_jwt,JWT_SECRET_KEY)
  return jwt_token;
}
function check_jwt_token(jwt_token) {
  try {
      const data = jwt.verify(jwt_token, JWT_SECRET_KEY);
      return data; // Return the decoded token data
  } catch (err) {
      console.error(err);
      return null; // Return null if the token is invalid
  }
}


app.get("/", (req, res) => {
  res.send("Hello, server is running!");
});
// /send_welcome_email
app.post("/send_welcome_email", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    await send_welcome_page(email);
    res.status(200).json({ message: `Welcome email sent to ${email}` });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    res.status(500).json({ error: "Failed to send welcome email" });
  }
});

// /send_otp_email - with a already exists
app.post("/send_otp_email", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const existing_user = await User.findOne({ email });
  if (existing_user) {
    return res.status(200).json({ error: "User with this email already exists" });
  }

  try {
    const otp = generate_otp(email); 
    info_message(`An email has been sent to ${email}.OTP is ${otp}.`);

    await send_otp_page(email, otp);
    res.status(200).json({ message: `OTP email sent to ${email}` });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ error: "Failed to send OTP email" });
  }
});

// /send_otp_email - wihout a already exists
app.post("/send_otp_email_if_exists", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const existing_user = await User.findOne({ email });
  if (!existing_user) {
    return res.status(200).json({ error: "User with this email Not  exists" });
  }

  try {
    const otp = generate_otp(email); 
    info_message(`An email has been sent to ${email}.OTP is ${otp}.`);

    await send_otp_page(email, otp);
    res.status(200).json({ message: `OTP email sent to ${email}` });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ error: "Failed to send OTP email" });
  }
});


// Route verify_otp 
app.post("/verify_otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }
  try {
    const storedOtp = get_otp(email);

    if (storedOtp && storedOtp === otp) {
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(200).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});

app.post("/change_user_password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: "Email and new password are required" });
  }

  try {
 
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
});

// /add_user
app.post("/add_user", async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: "Email, username, and password are required" });
  }
  try {

    const existing_user = await User.findOne({ email });
    if (existing_user) {
      return res.status(200).json({ error: "User with this email already exists" });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    let token = create_jwt_token(email,username,password);
    res.status(201).json({ message: "User registered successfully",token});

  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// /login_user
app.post("/login_user", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ error: "Invalid email or password" });
    }
    const isPasswordValid = user.password === password; 

    if (!isPasswordValid) {
      return res.status(200).json({ error: "Invalid email or password" });
    }
    let token = create_jwt_token(user.email, user.username, user.password);
    
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Failed to log in user" });
  }
});

function check_jwt_token(jwt_token) {
  try {
      const data = jwt.verify(jwt_token, JWT_SECRET_KEY);
      return data; // Return the decoded token data
  } catch (err) {
      console.error(err);
      return null; // Return null if the token is invalid
  }
}

// /get_user_data_from_jwt
app.post("/get_user_data_from_jwt", (req, res) => {  
  const jwt_token = req.body.jwt_token;

  if (!jwt_token) {
      return res.status(400).send("JWT token is required");
  }

  const userData = check_jwt_token(jwt_token);

  if (userData) {
      res.json({
          message: "JWT token is valid",
          userData: userData // Include user data if available
      });
  } else {
      res.status(401).send("JWT token is invalid");
  }
});




// / get all users from MongoDB
app.get("/get_users", async (req, res) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users); 
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Start the server
// Start the server














const ADMIN_USERNAME = 'admin';  // Define your admin username
const ADMIN_PASSWORD = 'admin123';


// Route to get all available routes
app.get('/get_routes', (req, res) => {
  const routes = [];

  // Loop through the stack and capture route methods and paths
  app._router.stack.forEach((middleware) => {
    if (middleware.route) { // Routes registered directly on the app
      routes.push({
        method: Object.keys(middleware.route.methods)[0].toUpperCase(),
        path: middleware.route.path
      });
    }
  });

  res.json(routes); // Return the routes as a JSON response
});

// Admin login validation route
app.post('/validate-admin', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});


// 404 page
app.use((req, res) => {
  res.status(404).sendFile(__dirname + '/index_sss.html'); // Replace with the correct path to your 404 HTML file
});

server.listen(PORT,HOST, () => {
  console.log(`\nServer running at http://localhost:${PORT}\n`);
});
