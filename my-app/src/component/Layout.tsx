import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { NetworkManager, axiosInstance } from "../services/NetworkManager";
export const Layout = () => {
  const [isloading, setIsloading] = useState(true);
  const navigate = useNavigate();

  const getUserMeta = async () => {
    try {
      const response = await NetworkManager.getUserMeta();
      if (response.data.code === 200) {
        const user = response.data.user;
        localStorage.setItem("orgid", user.org_data[0].organization_id);
        setIsloading(false);
        localStorage.setItem("user_name", user.name);
        localStorage.setItem("user_email", user.email);
        axiosInstance.defaults.headers["APIKEY"] =
          localStorage.getItem("apikey");
        axiosInstance.defaults.headers["ORGID"] =
          user.org_data[0].organization_id;
        navigate("/home/dashboard");
      }
    } catch (error) {
      console.log("error is: ", error);
      setIsloading(false);
    }
  };

  useEffect(() => {
    getUserMeta();
  }, []);

  if (isloading) return <div>Loading...!!</div>;

  return <Outlet />;
};
