import {Button, Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";

const AddForfeit = ()=>{
    return(
        <div style={{margin:"0 auto"}}>
            <Form>
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