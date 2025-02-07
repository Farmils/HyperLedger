import {Button} from "react-bootstrap";
import {useContext} from "react";
import {Context} from "../../../../core/context/Context.jsx";

const RenewLicense = () => {
    const {org,licenseId,userId} = useContext(Context);
    const renewLicense = async () => {
        try{
            const response = await fetch("http://localhost:7000/renewLicense",{
                headers:{"Content-Type":"application/json"},
                method:"POST",
                body:JSON.stringify({
                    organization:org,
                    userID:userId,
                    licenseId:licenseId,
                    currentDate:new Date(new Date().getTime()).toLocaleString(),
                })
            })
            const date = await response.json();
            console.log(date);
            alert(`В/У продлено`);
        }catch (e){
            alert(`Ошибка, повторите операцию позже, ${e}`)
        }

    }
    return(
    <>
        <p className={"fs-3 text-white"}>Продление В/У</p>
        <Button onClick={renewLicense} className={"m-2"}>Продлить срок действия В/У</Button>
    </>
)
}
export { RenewLicense }