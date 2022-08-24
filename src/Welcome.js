import { Link } from "react-router-dom";
import "./profile.css";
import { useHistory } from "react-router-dom";
import home from "./assets/home.png";

function Welcome() {
  const history = useHistory();

  return (
    <div className="center">
      <div className="profile">
        <Link to="/">
          <img alt="homepage" src={home} width="50px" />
        </Link>
        <h1>Welcome</h1>
        <div className="buttons">
          <button className="dummy" onClick={() => history.push("/upload")}>
            Upload Audio
          </button>
          <button className="dummy" onClick={() => history.push("/record")}>
            Record Audio
          </button>
          <button className="dummy" onClick={() => history.push("/profile")}>
            Access Database
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
