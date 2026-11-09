import { useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { RegisterUserForm } from "../interfaces";
import { registerUser } from "../services/auth.service";
import { toast } from "sonner";
import { toErr } from "../../../shared/utils";
import { useNavigate } from "react-router";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export const useRegister = () => {
  const navigate = useNavigate();
  const stepTitleRef = useRef<HTMLParagraphElement>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [showPwd, setShowPwd] = useState<string | null>(null);
  const [capsLockOn, setCapsLockOn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleShowPwd = (show: string | null) => setShowPwd(show);

  const handleCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockOn(e.getModifierState("CapsLock") ?? false);
  };

  const changeStep = (nextStep: 1 | 2) => {
    setStep(nextStep);
    setShowPwd(null);
    setCapsLockOn(false);
    requestAnimationFrame(() => stepTitleRef.current?.focus());
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const userForm: RegisterUserForm = {
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
      phone: data.phone.trim() || undefined,
    };
    setLoading(true);
    try {
      await registerUser(userForm);
      toast.dismiss();
      toast.success("Cuenta creada exitosamente");
      navigate("/auth/login");
    } catch (error) {
      toast.error(toErr(error), { duration: 8000 });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (step === 1) {
      const valid = await trigger(["name", "email", "phone"], {
        shouldFocus: true,
      });
      if (valid) changeStep(2);
      return;
    }
    if (step === 2) {
      const valid = await trigger(["password", "confirmPassword"], {
        shouldFocus: true,
      });
      if (!valid) return;
    }
    await handleSubmit(onSubmit)(event);
  };

  return {
    // Props
    navigate,
    stepTitleRef,
    step,
    showPwd,
    capsLockOn,
    loading,
    // RHF
    register,
    errors,
    // Actions
    handleShowPwd,
    handleCapsLock,
    handleFormSubmit,
    handleBack: () => changeStep(1),
  };
};
