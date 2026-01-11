import {useState} from "react"

export function Licznik(){
    const [counter, setCount] = useState(0)

    return <div>
        <button onClick={() => setCount(counter+1)}>Dodaj</button>
        <h2>Aktualny stan licznika: {counter}</h2>
    </div>
}

const IncButton = ({incCounter}: {incCounter: () => void}) => {
    return <button onClick={incCounter}>Dodaj</button>
}

export function NowyLicznik(){
    const [counter, setCount] = useState(0)

    function incCounter(){
        setCount(prev => prev + 1)
    }
    
    return <div>
        <IncButton incCounter={incCounter}/>
        <h2>Aktualny stan licznika: {counter}</h2>
    </div>
}