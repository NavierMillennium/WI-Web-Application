import { useEffect, useState, useRef } from "react"

export function Licznik() {
    const [counter, setCount] = useState(0)

    useEffect(() => console.log("Hello World"))
    useEffect(() => {
        console.log("Licznik zwiększył się do: ", counter);
    }, [counter]);

    return <div>
        <button onClick={() => setCount(counter + 1)}>Dodaj</button>
        <h2>Aktualny stan licznika: {counter}</h2>
    </div>
}

const IncButton = ({ incCounter }: { incCounter: () => void }) => {
    return <button onClick={incCounter}>Dodaj</button>
}

export function NowyLicznik() {
    const [counter, setCount] = useState(0)

    useEffect(() => console.log("Hello World"))
    useEffect(() => {
        console.log("Licznik zwiększył się do: ", counter);
    }, [counter]);

    function incCounter() {
        setCount(prev => prev + 1)
    }

    return <div>
        <IncButton incCounter={incCounter} />
        <h2>Aktualny stan licznika: {counter}</h2>
    </div>
}

export function Tytul() {
    const [title, setTitle] = useState("")

    useEffect(() => {
        document.title = title
    }, [title])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    return <>
        <label htmlFor="title">Tytuł:</label>
        <input type="text" id="title" name="title" value={title} onChange={handleChange}></input>
    </>
}


export function Odliczanie() {
    const [time, setTime] = useState<number>(15);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    useEffect(() => {
        if (!isRunning || time === 0) return;
        const interval = setInterval(() => {
            setTime((prev) => {
                const next = +(prev - 0.1).toFixed(1);
                return next > 0 ? next : 0;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [isRunning, time]);

    const counted = time === 0;

    const handleClick = () => {
        if (!counted) setIsRunning((prev) => !prev);
    };

    const buttonText = counted
        ? "Odliczanie zakończone"
        : isRunning
            ? "STOP"
            : "START";

    return (
        <>
            <div>
                <h2>Licznik: {time.toFixed(1)} sek</h2>
            </div>
            <button disabled={counted} onClick={handleClick}>
                {buttonText}
            </button>
        </>
    );
}