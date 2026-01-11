import {useState} from "react"

interface Student{
    id: number;
    imie: string;
    nazwisko: string;
    rocznik: number|null;
}

export function Studenci(){
    const students: Student[]= [
        {
            id: 1,
            imie: "John",
            nazwisko: "Doe",
            rocznik: 2024
        },
        {
            id: 2,
            imie: "John",
            nazwisko: "Smith",
            rocznik: 2024
        },
        {
            id: 3,
            imie: "Jan",
            nazwisko: "Kowalski",
            rocznik: 2025
        },
        {
            id: 4,
            imie: "Jan",
            nazwisko: "Nowak",
            rocznik: 2026
        }
    ]
    return (
        <table style={{border: "1px solid white"}}>
            <thead>
                <tr>
                    <th>Imie</th>
                    <th>Nazwisko</th>
                    <th>Rocznik</th>
                </tr>
            </thead>
            <tbody>
                {students.map((student) => (
                    <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>{student.imie}</td>
                        <td>{student.nazwisko}</td>
                        <td>{student.rocznik}</td>
                    </tr>
                ))
                }

            </tbody>
        </table>
    )

}

interface AddProps{
    addStudent: (student: Student) => void;
    nextId: number;
}

function Dodawanie({addStudent, nextId}: AddProps){

    const [studentData, setStudentData] = useState<Student>({       
        id: 0,
        imie: "",
        nazwisko: "",
        rocznik: 0
    
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type} = e.target
        setStudentData((prev) => ({
            ...prev,
            [name]: type === "number" ? (value === "" ? null : Number(value)) : value
        }))
    }

    const isFilled = studentData.imie.length > 0 &&
        studentData.nazwisko.length > 0 &&
        studentData.rocznik != 0


    const handleSubmit = () => {
        const newStudent: Student = {
            ...studentData,
            id: nextId
        }

        addStudent(newStudent)
        setStudentData({
            id: 0,
            imie: "",
            nazwisko: "",
            rocznik: null

        })
    }

    return <>
        <label htmlFor="firstname">Imię:</label>
        <input type="text" id="firstname" name="imie" value={studentData.imie} onChange={handleChange}></input>
        <label htmlFor="lastname">Nazwisko:</label>
        <input type="text" id="lastname" name="nazwisko" value={studentData.nazwisko} onChange={handleChange}></input>
        <label htmlFor="year">Rocznik:</label>
        <input type="number" id="year" name="rocznik" value={studentData.rocznik || ""} onChange={handleChange}></input>
        <button disabled={!isFilled} onClick={handleSubmit}>Dodaj </button>
    </>
}

export function StudentManager(){
    const [students, setStudents] = useState<Student[]>([
        {
            id: 1,
            imie: "John",
            nazwisko: "Doe",
            rocznik: 2024
        },
        {
            id: 2,
            imie: "John",
            nazwisko: "Smith",
            rocznik: 2024
        },
        {
            id: 3,
            imie: "Jan",
            nazwisko: "Kowalski",
            rocznik: 2025
        },
        {
            id: 4,
            imie: "Jan",
            nazwisko: "Nowak",
            rocznik: 2026
        }
    ])

    const addStudent = (student: Student) => {
        setStudents([...students, student])
    }

    return <>
        <Dodawanie addStudent={addStudent} nextId={students.length + 1}/>
        <table style={{border: "1px solid white"}}>
            <thead>
                <tr>
                    <th>Imie</th>
                    <th>Nazwisko</th>
                    <th>Rocznik</th>
                </tr>
            </thead>
            <tbody>
                {students.map((student) => (
                    <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>{student.imie}</td>
                        <td>{student.nazwisko}</td>
                        <td>{student.rocznik || "-"}</td>
                    </tr>
                ))
                }

            </tbody>
        </table>
    </>

}