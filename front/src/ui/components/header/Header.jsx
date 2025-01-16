import {Link} from "react-router-dom";

const Header =() => {
    return (
        <div style={{backgroundColor:"rebeccapurple"}} className={"d-flex flex-grow-1 justify-content-between align-content-between"}>
            <h4 className={"text-white fw-bold fs-1"}>Профессионалы 2025</h4>
            <Link to={"/"} className={"text-decoration-none text-white fs-3"}> Главная страница</Link>
            <Link to={"/profile"} className={"text-decoration-none text-white fs-3"}>Личный кабинет</Link>
        </div>
    )
}
export {Header};