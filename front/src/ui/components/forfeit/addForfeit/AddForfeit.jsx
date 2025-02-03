import {Button, Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {useContext} from "react";
import {Context} from "../../../../core/context/Context.jsx";

const AddForfeit = ()=>{
    const {org} = useContext(Context);
    const submitIssueFine =async (event)=>{
        event.preventDefault()
        const userId = event.target[0].value;
        const licenseId = event.target[1].value;
        const response = await fetch("http://localhost:7000/issueFine",{
            headers:{"Content-Type": "application/json",},
            method:"POST",
            body:JSON.stringify({
                organization:org,
                userID:userId,
                licenseId: licenseId,
            })
        });
        const data = await response.json();
        console.log(data)
    }
    return(
        <div style={{margin:"0 auto"}}>
            <Form onSubmit={submitIssueFine}>
                <p className={"text-white fs-3"}>Добавление штрафа</p>
                <FormLabel>Укажите ID пользователя</FormLabel>
                <FormGroup>
                    <FormControl placeholder={"user1"} type={"text"}></FormControl>
                </FormGroup>
                <FormLabel>Укажите номер В/У пользователя</FormLabel>
                <FormGroup>
                    <FormControl placeholder={"111"} type={"number"} min={111}></FormControl>
                </FormGroup>
                <Button type={"submit"} variant={"success"} className={"m-3"}>Добавить штраф</Button>
            </Form>
        </div>
    )
}
export { AddForfeit };