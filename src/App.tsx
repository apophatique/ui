import {useCallback, useState} from "react";
import './App.css';
import imageSrc from './face-rec.png';

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
            <div className={'header'}>
                <img src={imageSrc} alt={'logo'} className={'header__logo'}/>
            </div>

            <div className={'content'}>
                <div className={'description'}>
                    <p className={'description__text'}>
                        Привет!
                        <br/>
                        Данный сайт позволяет проанализировать изображение, находя на нём лица людей.
                        <p className={'authors'}>
                            Проект разработан в рамках курсовой работы студентов ПИН-171
                            <br/> Газиза Саттарова и Сергея Вольтера
                        </p>
                    </p>
                </div>

                <div className={'app'}>
                    <h3 className={'app__title'}> Чтобы приступить, загрузите файл: </h3>
                    <form onSubmit={handleSubmit}>
                        <input type="file" className={'button__file'} onChange={handleChange}/>
                        <input type="submit" className={'button__submit'} disabled={file === undefined}/>
                    </form>
                    {result && (
                        <img src={URL.createObjectURL(result)} alt="result"/>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
