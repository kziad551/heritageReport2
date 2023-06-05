import { useRouter } from "next/router";
import Link from "next/link";
import "../styles/visits.css";
import { image } from "../public/headerImage/header.png";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <div>
      <nav className="navbar">
        <ul className="nav-links">
          <li
            className={`nav-item ${
              router.asPath === "/visits" ? "active" : ""
            }`}
          >
            <Link href="/visits">
              <span>Visits</span>
            </Link>
          </li>
        </ul>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <div className="container">
        <img
          src="/headerImage/header.png"
          alt="Header Image"
          className="header-image"
        />
      </div>
    </div>
  );
}
