import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import NavBar from "./components/platform/Navbar";
import { useState } from "react";
import { Flex } from "antd";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <BrowserRouter basename={""}>
      <NavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <div
        className="app-container"
      >
        <Flex vertical style={{padding: '20px'}}>
          <AppRoutes loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        </Flex>
      </div>
    </BrowserRouter>
  );
}

export default App;
