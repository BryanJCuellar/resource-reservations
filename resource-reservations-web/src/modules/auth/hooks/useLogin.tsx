import { useState } from "react";
import type { LoginFormErrors } from "../interfaces";
import { login } from "../services/auth.service";
import { useNavigate } from "react-router";

export const useLogin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [serverErr, setServerErr] = useState<string | null>(null);

  const navigate = useNavigate()

  const validate = () => {
    const e: LoginFormErrors = {};
    if (email.trim() === "") {
      e.email = "El correo es requerido";
    } else if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      e.email = "El correo no es válido";
    }

    if (password.trim() === "") {
      e.password = "La contraseña es requerida";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerErr(null);
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem("reserv-access-t", data.accessToken);
      navigate('/')
    } catch (e) {
      if (e instanceof Error) {
        setServerErr(e.message);
      } else {
        setServerErr("Ocurrio un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    // Props
    email,
    password,
    loading,
    errors,
    serverErr,
    // Setters
    setEmail,
    setPassword,
    // Actions
    handleSubmit,
  };
};
