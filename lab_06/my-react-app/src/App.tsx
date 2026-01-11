import {Koszyk, NowyKoszyk} from "./components/koszyk/Koszyk";
import {Licznik, NowyLicznik} from "./components/liczniki/Licznik";
import {Formularz, Hasło, Logowanie} from "./components/formularze/Formularz";
import {SpreadOperator, Ternary} from "./components/inne/Inne";
import {Studenci, StudentManager} from "./components/studenci/Studenci";
import {Licznik as ELicznik, NowyLicznik as ENowyLicznik, Tytul, Odliczanie} from "./components/efekty/Licznik";
import {Komentarze} from "./components/produkty/Komentarz"

export default function App(){
  return <>
    <p>Zad 1.1</p>
    <Koszyk/>
    <p>Zad 1.2</p>
    <NowyKoszyk/>
    <p>Zad 2.1</p>
    <Licznik/>
    <p>Zad 2.2</p>
    <NowyLicznik/>
    <p>Zad 3.1</p>
    <Formularz/>
    <p>Zad 3.2</p>
    <Hasło/>
    <p>Zad 3.3</p>
    <Logowanie/>
    <p>Zad 4.1</p>
    <Ternary/>
    <p>Zad 4.2</p>
    <SpreadOperator/>
    <p>Zad 5.1</p>
    <Studenci/>
    <p>Zad 5.2</p>
    <StudentManager/>
    <p>Zad 6.1</p>
    <ELicznik/>
    <ENowyLicznik/>
    <p>Zad 6.2</p>
    <Tytul/>
    <p>Zad 6.3</p>
    <Odliczanie/>
    <p>Zad 7.1/7.2</p>
    <Komentarze/>
  </>
}