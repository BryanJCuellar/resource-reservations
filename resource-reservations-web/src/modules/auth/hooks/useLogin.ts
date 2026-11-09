import { useRef, useState } from "react";
import type { LoginFormErrors } from "../interfaces";
import { useNavigate } from "react-router";
import { useAuth } from "../store/hooks/useAuth";
import { toast } from "sonner";
import { toErr } from "../../../shared/utils";

export const useLogin = () => {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const [showPwd, setShowPwd] = useState<boolean>(false);
  const [capsLockOn, setCapsLockOn] = useState<boolean>(false);

  const { handleLogin } = useAuth();

  const handleShowPwd = (show: boolean) => setShowPwd(show);

  const handleCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockOn(e.getModifierState("CapsLock") ?? false);
  };

  const validate = () => {
    const e: LoginFormErrors = {};
    if (email.trim().length === 0) {
      e.email = "Ingresa tu correo";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = "Ingresa un correo válido";
    }

    if (password.length < 8) {
      e.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (password.trim().length === 0) {
      e.password = "Ingresa tu contraseña";
    }

    setErrors(e);
    if (e.email) {
      emailRef.current?.focus();
    } else if (e.password) {
      passwordRef.current?.focus();
    }
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await handleLogin(email, password);
      toast.dismiss();
      toast.success("Sesión iniciada");
      navigate("/home");
    } catch (error) {
      toast.error(toErr(error), { duration: 8000 });
    } finally {
      setLoading(false);
    }
  };

  return {
    // Props
    navigate,
    emailRef,
    passwordRef,
    email,
    password,
    loading,
    errors,
    showPwd,
    capsLockOn,
    setEmail,
    setPassword,
    // Actions
    handleShowPwd,
    handleCapsLock,
    handleSubmit,
  };
};
