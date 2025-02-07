import {Button} from "react-bootstrap";
import {useContext} from "react";
import {Context} from "../../../../core/context/Context.jsx";

const PayForfeit =()=>{
    const {org,userId} = useContext(Context);
    const toPay  = async ()=> {
        try{
            const response = await fetch("http://localhost:7000/payFine", {
                headers: {"Content-Type": "application/json"},
                method: "POST",
                body: JSON.stringify({
                    organization: org,
                    userID: userId,
                })
            })
            const date = await response.json();
            console.log(date);
            alert(`Штраф успешно оплачен`);
        }catch(err){
            alert(`Не удалось повторите попытку позже, ${err}`)
        }

    }
    return(
        < div  className={"d-flex flex-column justify-content-center align-items-center m-3"}>
        <p className={"text-white fs-3"}> Оплатить штраф</p>
        <Button onClick={toPay} variant={'success'} >Оплатить </Button>
        </div>
     )

}
export {PayForfeit};