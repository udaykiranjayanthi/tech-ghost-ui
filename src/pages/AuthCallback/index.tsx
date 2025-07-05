import { useEffect, type FC } from "react";
import { useNavigate, useSearchParams } from "react-router";

export const AuthCallback: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Save JWT in localStorage or cookie
      localStorage.setItem("auth_token", token);

      // Redirect to main app/dashboard
      navigate("/");
    } else {
      // Handle error
      console.error("No token found");
      navigate("/");
    }
  }, [navigate, searchParams]);

  return <p>Logging in...</p>;
};
