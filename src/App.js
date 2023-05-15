import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [drone, setDrone] = useState(null);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      const drone = new window.Scaledrone("5f1aqlcSfL7kPhaE", {
        data: user,
      });
      setDrone(drone);

      const room = drone.subscribe("observable-room");

      room.on("data", (message, user) => {
        console.log(message);
        setMessages((prevMessages) => [...prevMessages, { message, user }]);
      });
    }
  }, [user]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (message) {
      drone.publish({
        room: "observable-room",
        message,
      });
      setMessage("");
    }
  };
  function randomColor() {
    return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
  }

  const loginUser = (e) => {
    e.preventDefault();
    setUser({
      username: e.target.elements.username.value,
      color: randomColor(),
    });
  };
  return (
    <>
      <div className="App">
        <div className="main-wrapper">
          {user ? (
            <>
              <h1>Chat</h1>
              <div className="chat-container">
                <div className="messages">
                  {messages.map((msg, index) => (
                    <div key={index}>
                      <p>{msg.user.clientData.username}:</p>
                      <span
                        className="message"
                        style={{
                          backgroundColor: msg.user.clientData.color,
                        }}
                      >
                        {msg.message}
                      </span>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={message}
                  onChange={handleMessageChange}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </>
          ) : (
            <>
              <div className="login">
                <form className="login-form" onSubmit={loginUser}>
                  <div>
                    <p>Enter name</p>
                    <input
                      name="username"
                      className="username"
                      type="text"
                    ></input>
                  </div>
                  <div>
                    <button type="submit" className="button">
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
