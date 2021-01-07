import './App.css';
import React, {useState, useEffect} from "react";

function App() {
    return (
    <div className="App">
      <form method="POST">
        <input type="file" name="image" />
        <input type="submit" />
      </form>
    </div>
  );
}

export default App;
