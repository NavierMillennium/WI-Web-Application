import { useState } from "react"

export function Formularz(){
    const [text, setText] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value)
    }
    return <>
        <input type="text" value={text} onChange={handleChange}></input>
        <div>
            {text}
        </div>
    </>
}

export function Hasło(){
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPasswrod] = useState("")
    
    const isSame = password === repeatPassword
    const isChecked = password.length > 1 && repeatPassword.length > 1

    return <>
        <label htmlFor="passwd">Hasło:</label>
        <input type="password" id="passwd" value={password} onChange={e => setPassword(e.target.value)}></input>
        <label htmlFor="rpasswd">Powtórz Hasło:</label>
        <input type="password" id="rpasswd" value={repeatPassword} onChange={e => setRepeatPasswrod(e.target.value)}></input>
        <div>
            {!isChecked ? "Proszę wprowadź hasło!": isSame ? "Hasła poprawne": "Błąd! Podane hasła nie są idenrtyczne" }
        </div>
    </>
}

export function Logowanie(){
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        repeatPassword: ""
    })
    
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setFormData((prev) => (
            {
                ...prev,
                [name]: value
            })
        )
    }
    const isFilled: Boolean =  
        formData.username.length > 0 &&
        formData.password.length > 0 &&
        formData.repeatPassword.length > 0 

    const handleClick = () => {
        if (formData.password === formData.repeatPassword){
            alert("Zalogowano poprawnie")
            return 
        }
        else
            alert("Hasła nie są zgodne!")
    }


    return <>
        <label htmlFor="username">Nazwa użytkownika:</label>
        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange}></input>
        <label htmlFor="passwd">Hasło:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange}></input>
        <label htmlFor="repeatPassword">Powtórz Hasło:</label>
        <input type="password" id="repeatPassword" name="repeatPassword" value={formData.repeatPassword} onChange={handleChange}></input>
        <button disabled={!isFilled} onClick={handleClick}>Zaloguj się </button>
    </>
}