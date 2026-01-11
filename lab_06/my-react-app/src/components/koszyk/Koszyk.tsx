import Produkt from "./Produkt"

export function Koszyk(){
    return <div>
        <h2>Mój Koszyk</h2>
        <ul>
            <Produkt key="1" nazwa="jabłko"/>
            <Produkt key="2" nazwa="jabłko"/>
            <Produkt key="3" nazwa="gruszka"/>
            <Produkt key="4" nazwa="limonka"/>
            <Produkt key="5" nazwa="banan"/>
        </ul>
    </div>
}


export function NowyKoszyk(){
    const products: string[] = ["jabłko", "gruszka", "cytryna", "limonka", "banan"]
    
    return <div>
        <h2>Mój Koszyk</h2>
        <ul>
            {products.map((nazwa, index) => <Produkt key={index} nazwa={nazwa}/>)}
        </ul>
    </div>
}