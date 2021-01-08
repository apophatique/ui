import { useCallback, useState } from "react";

function App() {
  const [file, setFile] = useState<Blob | undefined>(undefined);
  const [result, setResult] = useState<Blob | undefined>(undefined);
  const handleChange = useCallback((event) => {
    setFile(event.target.files[0]);
  }, [setFile]);
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (file !== undefined) {
        const formData = new FormData();
        formData.set("file", file);
        fetch('http://localhost:8080', {
          method: 'POST',
          body: formData
        })
          .then((response) => response.blob())
          .then((blob) => setResult(blob))
          .catch((e) => alert(e));
      }
    },
    [file, setResult]
  );
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleChange} />
        <input type="submit" disabled={file === undefined} />
      </form>
      {result && (
        <img src={URL.createObjectURL(result)} alt="result" />
      )}
    </div>
  );
}

export default App;
