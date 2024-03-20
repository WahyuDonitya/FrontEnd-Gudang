// import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const navigateAndClearTokenAdmin = (navigate) => {
  // const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    localStorage.removeItem("access_token");
    navigate("/authentication/sign-in");
  } else {
    const role = jwtDecode(accessToken);
    if (role.role_id !== 3) {
      localStorage.removeItem("access_token");
      navigate("/authentication/sign-in");
    }
  }
};
