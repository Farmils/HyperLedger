import {useContext, useEffect} from "react";
import {Context} from "../../../../core/context/Context.jsx";
import {Card, CardBody, CardSubtitle, CardText, CardTitle} from "react-bootstrap";

const InfoForCar = ()=>{
const {carInform,carId,org,userId,setCarInform} = useContext(Context);
useEffect(()=>{
    if(carId !== ""){
        (async ()=>{
            const response =await fetch(`http://localhost:7000/getCar?organization=${org}&userID=${userId}&carID=${carId}`)
            const data = await response.json();
            setCarInform(data);
        })()
    }
},[org,userId])
    return (
        <div className={"d-flex flex-column justify-content-center align-items-center"}>
            {
                carInform.CarID === ""?(<Card>
                    <CardBody>
                        <CardText>У вас отсутствует Т/С</CardText>
                    </CardBody>
                </Card>):
                    (<Card className={"text-center"}>
                        <CardTitle>Ваше Т/С</CardTitle>
                        <CardSubtitle className={"p-1"}>ID автомобиля: {carInform.CarID.toString()}</CardSubtitle>
                    <CardBody>
                        <CardText>Категория автомобиля: {carInform.CarCategory.toString()}</CardText>
                        <CardText>Владелец: {carInform.Owner.toString()}</CardText>
                        <CardText>Рыночная стоимость: {carInform.Price.toString()}</CardText>
                        <CardText>Время эксплуатации: {carInform.serviceLife.toString()}</CardText>
                    </CardBody>

                </Card>)
            }
        </div>
    )
}
export {InfoForCar}