import {useContext, useEffect} from "react";
import {Context} from "../../../../core/context/Context.jsx";
import {Card, CardBody, CardText, CardTitle} from "react-bootstrap";

const DriverLicenseInProfile =()=>{
    const {licenseId,org,userId,setLicenseInform,licenseInform} = useContext(Context);
    useEffect(() => {
        (async () => {
            console.log(licenseId,org,userId)
            if(licenseId !== ""){
                const response = await fetch((`http://localhost:7000/getDriverLicense?organization=${org}&userID=${userId}&licenseId=${licenseId}`));
                const data = await response.json();
                console.log(data)
                setLicenseInform(data);
            }

        })()
    }, [org,userId,licenseId]);
    return (<div  className={"m-4"}>{
        licenseInform.ID === ""?(
            <Card>
                <CardBody>
                    <CardTitle >У вас отсутсвует В/У</CardTitle>
                </CardBody>
                </Card>):
            (<Card className={"text-center"}>
                <p className={"fs-3 fw-bold"}>Водительское Удостоверение</p>
            <CardTitle>ID В/У: {licenseInform.ID.toString()}</CardTitle>
                <CardBody>
                    <CardText>Категория: {licenseInform.Category.toString()}</CardText>
                    <CardText>Срок действия: { (licenseInform.serviceLife)}</CardText>
                </CardBody>
        </Card>)
    }</div>)
}
export {DriverLicenseInProfile}