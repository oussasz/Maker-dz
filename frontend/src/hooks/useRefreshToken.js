import axios from "../api/axios";
import useAuth from "../store/authStore";

const useRefreshToken = () => {
  const { setAccessToken, refreshToken } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/refresh", {
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    });

    setAccessToken(response.data.accessToken);

    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;