import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const Header = () => {
  const nav = useNavigate();
  return (
    <div
      style={{ backgroundColor: "rebeccapurple" }}
      className={
        "d-flex flex-grow-1 justify-content-between align-content-between"
      }
    >
      <h4 className={"text-white fw-bold fs-1"}>Профессионалы 2025</h4>
      <Link to={"/main"} className={"text-decoration-none text-white fs-3"}>
        {" "}
        Главная страница
      </Link>
      <Link to={"/profile"} className={"text-decoration-none text-white fs-3"}>
        Личный кабинет
      </Link>
      <Link
        className={"btn btn-primary"}
        onClick={() => {
          nav("/");
        }}
      >
        Выход
      </Link>
    </div>
  );
};
export { Header };
