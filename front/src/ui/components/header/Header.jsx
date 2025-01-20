import { Link } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../../../core/context/Context.jsx";

const Header = () => {
  const { userId, setUserId } = useContext(Context);
  return (
    <div
      style={{ backgroundColor: "rebeccapurple" }}
      className={
        "d-flex flex-grow-1 justify-content-between align-content-between"
      }
    >
      <h4 className={"text-white fw-bold fs-1"}>Профессионалы 2025</h4>
      {userId === "" ? (
        <></>
      ) : (
        <>
          <Link to={"/main"} className={"text-decoration-none text-white fs-3"}>
            {" "}
            Главная страница
          </Link>
          <Link
            to={"/profile"}
            className={"text-decoration-none text-white fs-3"}
          >
            Личный кабинет
          </Link>
          <Link
            className={"btn btn-primary"}
            to={"/"}
            onClick={() => {
              setUserId("");
            }}
          >
            Выход
          </Link>
        </>
      )}
      {userId === "" && (
        <Link
          className={"btn btn-primary"}
          to={"/"}
          onClick={() => {
            setUserId("");
          }}
        >
          Выход
        </Link>
      )}
    </div>
  );
};
export { Header };
