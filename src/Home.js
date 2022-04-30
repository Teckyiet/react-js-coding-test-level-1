import "./App.css";
import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

function Home() {
  const [text, setText] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (text === "Ready!" || text.toLowerCase() === "ready!") {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [text]);

  return (
    <div className='App'>
      <header className='App-header'>
        <Link to='/pokedex'>
          <img
            hidden={!isReady}
            src='https://www.freeiconspng.com/uploads/file-pokeball-png-0.png'
            className='App-logo'
            alt='logo'
            style={{ padding: "10px" }}
          />
        </Link>
        <b>
          Requirement: Try to show the hidden image and make it clickable that
          goes to /pokedex when the input below is "Ready!" remember to hide the
          red text away when "Ready!" is in the textbox.
        </b>
        <p>Are you ready to be a pokemon master?</p>
        <input
          type='text'
          name='name'
          onChange={(e) => setText(e.target.value)}
        />
        <span style={{ color: "red" }}>I am not ready yet!</span>
      </header>
    </div>
  );
}

export default Home;
