import { useCallback, useState } from "react";
import './App.css';

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
    return new Blob(byteArrays, { type: '' });
}

function App() {
    const [source, setSource] = useState<Blob | undefined>(undefined);
    const [result, setResult] = useState<Blob | undefined>(undefined);
    const [carCount, setCarCount] = useState<number | undefined>(undefined);
    const handleSelectFile = useCallback((event) => {
        setSource(event.target.files[0]);
    }, [setSource]);
    const handleSubmitForm = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (source !== undefined) {
                const formData = new FormData();
                formData.set("file", source);
                fetch('http://localhost:8080', {
                    method: 'POST',
                    body: formData
                })
                    .then((response) => response.json())
                    .then((json) => {
                        setCarCount(json.carCount);
                        setResult(base64ToBlob(json.image));
                    })
                    .catch((e) => alert(e));
            }
        },
        [source, setResult]
    );
    return (
        <div className="App">
            <div className={'header'}>
                <h1>&#127950; Подсчет количества машин на фотографии &#127950;</h1>
            </div>
            <div className={'content'}>
                <div className={'left-side'}>
                    <p className={'left-side__text'}>
                        Разработчик: Исаков Александр<br />
                        Группа: ПИН-171<br />
                        Кафедра: <a href="https://omgtu.ru/general_information/faculties/faculty_of_information_technology_and_computer_systems/department_of_automated_systems_of_information_processing_and_management/">АСОИУ</a>
                    </p>
                    <p className={'left-side__text'}>
                        1) Выберите файл с изображением нажатием кнопки "Choose File"<br />
                        2) Подтвердите выбор нажатием кнопки "Submit"<br />
                        3) В случае успеха результат появится в правой части страницы, в случае неудачи будет выведена ошибка
                    </p>
                    <form onSubmit={handleSubmitForm}>
                        <input type="file" className={'left-side__file-select-block'} onChange={handleSelectFile} />
                        <input type="submit" className={'left-side__submit-button'} disabled={source === undefined} />
                    </form>
                </div>
                <div className={'right-side'}>
                    {carCount && (
                        <p>Количество найденных машин: {carCount}</p>
                    )}
                    {result && (
                        <img className={'right-side__result'} src={URL.createObjectURL(result)} alt="result" />
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
