import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import { useContext } from "react";
import { Context } from "../../../../core/context/Context.jsx";


const AddDriverLicense = () => {
  const { org, userId,setLicenseId } = useContext(Context);
  const submitAddLicense = async (event) => {
    event.preventDefault();
    const licenseId = event.target[0].value;
    const serviceLife = event.target[1].value;
    const category = event.target[2].value;
    try{
      const response = await fetch("http://localhost:7000/addDriverLicense", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          organization: org,
          licenseId: licenseId,
          serviceLife: serviceLife,
          category: category,
          userID: userId,
        }),
      })
      response.json().then((data) => {
        console.log(data);
      });

      setLicenseId(licenseId);
      alert("В/У добавлено")
    }
    catch(error){
    alert(`Ошибка, повторите позже, ${error}`);
  }}


  return (
    <div style={{ width: "25rem",margin:"0 auto" }}>
      <Form
        className={
          "d-flex flex-column "
        }
        onSubmit={submitAddLicense}
      >
        <p className={"text-white fs-4"}>
          Добавление Водительского удостоверения
        </p>
        <FormLabel className={"text-white"}>Укажите ID В/У</FormLabel>
        <FormGroup>
          <FormControl
            type={"number"}
            placeholder={"ID В/У"}
          ></FormControl>
        </FormGroup>
        <FormLabel className={"text-white"}>
          Укажите срок действия В/У
        </FormLabel>
        <FormGroup>
          <FormControl type={"date"} placeholder={"дата, то которого В/У действительны"}></FormControl>
        </FormGroup>
        <FormLabel className={"text-white"}>Укажите категорию В/У</FormLabel>
        <FormGroup>
          <FormControl type={"text"} placeholder={"категория В/У"}></FormControl>
        </FormGroup>
        <Button type={"submit"} variant={"success"} className={"m-2"}>
          Добавить В/У
        </Button>
      </Form>
    </div>
  );
};
export { AddDriverLicense };
