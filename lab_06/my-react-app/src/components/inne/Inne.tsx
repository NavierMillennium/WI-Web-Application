import {useState} from "react"

export function Ternary(){
    let a:boolean = true;
    let b:boolean = false

    return <>
        <div>
            Stwierdzenie a jest {a ? "prawdziwe": "fałszywe"}.
        </div>
        <div>
            Stwierdzenie b jest {b ? "prawdziwe": "fałszywe"}.
        </div>
    </>
}

export function SpreadOperator(){
    const [productData, setProductData] = useState(
        {
            nazwa: "Pomidor",
            cena: 50 
        }
    )
    const handleClick = () => {
        setProductData(
            (prev) => ({
                ...prev,
                cena: productData.cena === 50 ? 100 : 50
            })
        )
    }

    return <>
            <div>
                Aktualnie: <span>{productData.nazwa}</span>
                Cena: <span>{productData.cena}</span>
            </div>
            <button onClick={handleClick}>Zmień cenę</button>
        </>
    

}
