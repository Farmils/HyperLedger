import {Button, Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {useContext} from "react";
import {Context} from "../../../../core/context/Context.jsx";

const AddCar = () => {
    const {org,userId,licenseId,setCarId,setCarInform} = useContext(Context);
    const submitAddCar = async (event) => {
        event.preventDefault();
        const carId = event.target[0].value;
        const carCategory = event.target[1].value;
        const price = event.target[2].value;
        const serviceLife = event.target[3].value;
        const response = await fetch("http://localhost:7000/addCar", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                organization:org,
                carID:carId,
                userID:userId,
                carCategory:carCategory,
                price:price,
                serviceLife:serviceLife,
                licenseId:licenseId,
            })
        })
        const data = await response.json()
        console.log(data)
        setCarInform(data);
        setCarId(carId);
        alert(`Т/С добавлено`)
    }
    return (
        <div style={{width:'25rem'}} >
            <p className={"text-white fs-4 m-3"}>Добавление Транспортного средства</p>
            <Form className={"d-flex flex-column "} onSubmit={submitAddCar}>
                <FormGroup>
                    <FormLabel className={"text-white"}>Укажите ID Транспортного средства</FormLabel>
                    <FormControl placeholder={"ID Т/С"} type={"text"}></FormControl>
                </FormGroup>
                <FormGroup>
                    <FormLabel className={"text-white"}>Укажите категорию Транспортного средства</FormLabel>
                    <FormControl type={"text"} placeholder={"категория Т/С"}></FormControl>
                </FormGroup>
                <FormGroup>
                    <FormLabel className={"text-white"}>Укажите рыночную стоимость Транспортного средства</FormLabel>
                    <FormControl type={"number"} placeholder={"рыночная стоимость Т/С"}></FormControl>
                </FormGroup>
                <FormGroup>
                    <FormLabel className={"text-white"}>Укажите срок эксплуатации Транспортного средства</FormLabel>
                    <FormControl type={"data"} placeholder={"сколько лет эксплуатируется автомобиль"}></FormControl>
                </FormGroup>
                <Button type={"submit"} variant={"success"} className={"m-2 "}>
                    Добавить транспортное средство
                </Button>
            </Form>
        </div>
    )
}
export { AddCar }