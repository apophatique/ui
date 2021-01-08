import './App.css';
import React, { useCallback, useState } from "react";

function App() {
    const [file, setFile] = useState<Blob>(new Blob());
    const [response, setResponse] = useState<Blob>(new Blob());
    const handleChange = useCallback((event) => {
        setFile(event.target.files[0]);
    }, [setFile]);
    const handleSubmit = useCallback(() => {
        const formData = new FormData();
        formData.set("file", file);
        fetch('http://localhost:8080/', {
            method: 'POST',
            body: formData
        })
            .then((response) => response.blob())
            .then((blob) => {
                alert(blob);
                setResponse(blob);
            })
            .catch((e) => alert(JSON.stringify(e)));
    }, [file, setResponse]);
    return (
        <div className="App">
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleChange} />
            <input type="submit" />
          </form>
        </div>
    );
}

export default App;
