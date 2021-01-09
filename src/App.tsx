import { useCallback, useState } from "react";
import './App.css';
import imageSrc from './face-rec.png';

const base64ToBlob = (base64: string) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: '' });
    return blob;
}

function App() {
    const [file, setFile] = useState<Blob | undefined>(undefined);
    const [result, setResult] = useState<Blob | undefined>(undefined);
    const [faceCount, setFaceCount] = useState<number | undefined>(undefined);
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
                    .then((response) => response.json())
                    .then((json) => {
                        setFaceCount(json.faceCount);
                        setResult(base64ToBlob(json.image));
                    })
                    .catch((e) => alert(e));
            }
        },
        [file, setResult]
    );
    return (
        <div className="App">
            <div className={'header'}>
                <img src={imageSrc} alt={'logo'} className={'header__logo'} />
            </div>
            <div className={'content'}>
                <div className={'description'}>
                    <p className={'description__text'}>
                        Привет!
                        <br />
                        Данный сайт позволяет проанализировать изображение, находя на нём лица людей.
                        <br />
                        <span className={'authors'}>
                            Проект разработан в рамках курсовой работы студентов ПИН-171
                            <br />
                            Газиза Саттарова и Сергея Вольтера.
                        </span>
                    </p>
                </div>
                <div className={'app'}>
                    <h3 className={'app__title'}> Чтобы приступить, загрузите файл: </h3>
                    <form onSubmit={handleSubmit}>
                        <input type="file" className={'button__file'} onChange={handleChange} />
                        <input type="submit" className={'button__submit'} disabled={file === undefined} />
                    </form>
                    {faceCount && (
                        <p>Количество найденных лиц: {faceCount}</p>
                    )}
                    {result && (
                        <img className={'app__result'} src={URL.createObjectURL(result)} alt="result" />
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
