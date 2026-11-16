import { Eye, LoaderCircle } from "lucide-react";
import { useRegister } from "../hooks/useRegister";

const logoUrl = "/locenda-logo.svg";

export const RegisterPage = () => {
  const {
    navigate,
    stepTitleRef,
    step,
    showPwd,
    capsLockOn,
    loading,
    register,
    errors,
    handleShowPwd,
    handleCapsLock,
    handleFormSubmit,
    handleBack,
  } = useRegister();

  const phoneField = register("phone", {
    validate: (value) =>
      /^(?:|\+?(?=[0-9 ()-]*[0-9])[0-9 ()-]+)$/.test(value.trim()) ||
      "Ingresa un teléfono válido",
  });

  return (
    <main className="relative isolate flex min-h-screen flex-col overflow-x-clip bg-slate-50 p-6 text-blue-950 md:px-10 md:py-4 dark:bg-slate-900 dark:text-slate-100">
      {/* Ondas decorativas */}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 900 360"
        preserveAspectRatio="none"
        className="pointer-events-none absolute right-0 top-0 -z-10 h-48 w-full max-w-3xl md:h-72"
      >
        <path
          d="M0 0H900V310C700 355 610 210 430 150S150 65 0 0Z"
          className="fill-blue-100/60 dark:fill-blue-950/60"
        />
        <path
          d="M230 0H900V210C700 265 635 135 470 95S330 40 230 0Z"
          className="fill-blue-200/30 dark:fill-blue-900/20"
        />
      </svg>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1000 320"
        preserveAspectRatio="none"
        className="pointer-events-none absolute bottom-0 left-0 -z-10 h-40 w-full max-w-4xl md:h-64"
      >
        <path
          d="M0 40C180 20 260 220 490 210S810 240 1000 320H0Z"
          className="fill-blue-100/70 dark:fill-blue-950/70"
        />
        <path
          d="M0 130C170 115 260 285 500 265S820 285 1000 320H0Z"
          className="fill-blue-200/40 dark:fill-blue-900/25"
        />
      </svg>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-10 py-10 md:flex-row md:gap-16 md:py-0">
        {/* Lado izquierdo */}
        <section
          aria-label="Locenda: recursos y reservas"
          className="flex w-full min-w-0 max-w-md flex-col gap-12 md:flex-1"
        >
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <img src={logoUrl} alt="Locenda" className="h-auto w-14 shrink-0" />
            <span className="text-3xl font-semibold tracking-tight">
              Locenda
            </span>
          </div>
          <div className="hidden flex-col gap-5 md:flex">
            <p className="text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">
              Tu próxima reserva empieza aquí.
            </p>
            <p className="max-w-sm text-base leading-7 text-slate-600 dark:text-slate-300">
              Crea tu cuenta para solicitar espacios, vehículos y equipos de tu
              empresa.
            </p>
          </div>
        </section>
        {/* Lado derecho */}
        <section
          aria-labelledby="register-title"
          className="flex w-full min-w-0 max-w-md flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 md:flex-1 md:p-8 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/15"
        >
          <div className="flex flex-col gap-3">
            <h1
              id="register-title"
              className="text-2xl font-semibold tracking-tight"
            >
              Crear cuenta
            </h1>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {step === 1
                ? "Completa tus datos para comenzar."
                : "Elige una contraseña para proteger tu cuenta."}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p
              ref={stepTitleRef}
              tabIndex={-1}
              className="rounded-sm text-sm text-slate-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 dark:text-slate-300 dark:focus-visible:outline-blue-300"
            >
              Paso {step} de 2 ·{" "}
              <span className="font-medium text-blue-950 dark:text-slate-100">
                {step === 1 ? "Tus datos" : "Tu contraseña"}
              </span>
            </p>
            <div className="flex gap-2" aria-hidden="true">
              <span className="h-1 flex-1 rounded-sm bg-blue-700 dark:bg-blue-300" />
              <span
                className={`h-1 flex-1 rounded-sm ${step === 2 ? "bg-blue-700 dark:bg-blue-300" : "bg-slate-200 dark:bg-slate-600"}`}
              />
            </div>
          </div>
          <form
            className="flex flex-col gap-5"
            noValidate
            onSubmit={handleFormSubmit}
          >
            <div hidden={step !== 1}>
              <div
                role="group"
                aria-label="Tus datos"
                className="flex flex-col gap-5"
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Nombre completo
                  </label>
                  <div>
                    <input
                      id="name"
                      type="text"
                      className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-blue-950 placeholder:text-slate-500 focus-visible:border-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus-visible:border-blue-300 dark:focus-visible:outline-blue-300"
                      placeholder="Ej. Ana López"
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      {...register("name", {
                        validate: (value) =>
                          value.trim().length > 0 || "Ingresa tu nombre",
                      })}
                    />
                  </div>
                  {errors.name && (
                    <p
                      id="name-error"
                      role="alert"
                      className="text-xs leading-4 text-red-600 dark:text-red-300"
                    >
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Correo
                  </label>
                  <div>
                    <input
                      id="email"
                      type="email"
                      className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-blue-950 placeholder:text-slate-500 focus-visible:border-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus-visible:border-blue-300 dark:focus-visible:outline-blue-300"
                      placeholder="Ej. ana@ejemplo.com"
                      autoComplete="username"
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      {...register("email", {
                        required: "Ingresa tu correo",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Ingresa un correo válido",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p
                      id="email-error"
                      role="alert"
                      className="text-xs leading-4 text-red-600 dark:text-red-300"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Teléfono{" "}
                    <span className="font-normal text-slate-600 dark:text-slate-300">
                      (opcional)
                    </span>
                  </label>
                  <div>
                    <input
                      id="phone"
                      type="tel"
                      className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-blue-950 placeholder:text-slate-500 focus-visible:border-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus-visible:border-blue-300 dark:focus-visible:outline-blue-300"
                      placeholder="Ej. +504 9876-5432"
                      autoComplete="tel"
                      {...phoneField}
                      onChange={(event) => {
                        const input = event.currentTarget;
                        input.value = input.value.replace(/[^0-9+ ()-]/g, "");
                        void phoneField.onChange(event);
                      }}
                      aria-invalid={!!errors.phone}
                      aria-describedby={
                        errors.phone ? "phone-error" : undefined
                      }
                    />
                  </div>
                  {errors.phone && (
                    <p
                      id="phone-error"
                      role="alert"
                      className="text-xs leading-4 text-red-600 dark:text-red-300"
                    >
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div hidden={step !== 2}>
              <div
                role="group"
                aria-label="Tu contraseña"
                className="flex flex-col gap-5"
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    Contraseña
                  </label>
                  <div className="flex items-center rounded-md border border-slate-300 bg-white focus-within:border-blue-700 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-700 dark:border-slate-600 dark:bg-slate-900/40 dark:focus-within:border-blue-300 dark:focus-within:outline-blue-300">
                    <input
                      id="password"
                      type={showPwd === "password" ? "text" : "password"}
                      className="min-w-0 flex-1 rounded-md bg-transparent py-3 pl-4 text-base text-blue-950 placeholder:text-slate-500 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-400"
                      placeholder="Crea una contraseña"
                      autoComplete="new-password"
                      aria-invalid={!!errors.password}
                      aria-describedby={
                        [
                          errors.password ? "password-error" : "password-hint",
                          capsLockOn && "register-caps-lock",
                        ]
                          .filter(Boolean)
                          .join(" ") || undefined
                      }
                      onKeyUp={handleCapsLock}
                      {...register("password", {
                        validate: (value) =>
                          value.trim().length > 0 || "Ingresa tu contraseña",
                        minLength: {
                          value: 8,
                          message:
                            "La contraseña debe tener al menos 8 caracteres",
                        },
                      })}
                    />
                    <button
                      type="button"
                      aria-label="Mostrar contraseña"
                      className="flex w-12 shrink-0 cursor-pointer items-center justify-center self-stretch rounded-md text-slate-600 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-700 dark:text-slate-300 dark:focus-visible:outline-blue-300"
                      onPointerDown={() => handleShowPwd("password")}
                      onPointerUp={() => handleShowPwd(null)}
                      onPointerLeave={() => handleShowPwd(null)}
                      onPointerCancel={() => handleShowPwd(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleShowPwd("password");
                        }
                      }}
                      onKeyUp={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleShowPwd(null);
                        }
                      }}
                      onBlur={() => handleShowPwd(null)}
                    >
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  {!errors.password && (
                    <p
                      id="password-hint"
                      className="text-xs leading-4 text-slate-600 dark:text-slate-300"
                    >
                      Usa al menos 8 caracteres.
                    </p>
                  )}

                  {errors.password && (
                    <p
                      id="password-error"
                      role="alert"
                      className="text-xs leading-4 text-red-600 dark:text-red-300"
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium"
                  >
                    Confirmar contraseña
                  </label>
                  <div className="flex items-center rounded-md border border-slate-300 bg-white focus-within:border-blue-700 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-700 dark:border-slate-600 dark:bg-slate-900/40 dark:focus-within:border-blue-300 dark:focus-within:outline-blue-300">
                    <input
                      id="confirm-password"
                      type={
                        showPwd === "confirm-password" ? "text" : "password"
                      }
                      className="min-w-0 flex-1 rounded-md bg-transparent py-3 pl-4 text-base text-blue-950 placeholder:text-slate-500 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-400"
                      placeholder="Repite tu contraseña"
                      autoComplete="new-password"
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={
                        [
                          errors.confirmPassword && "confirm-password-error",
                          capsLockOn && "register-caps-lock",
                        ]
                          .filter(Boolean)
                          .join(" ") || undefined
                      }
                      onKeyUp={handleCapsLock}
                      {...register("confirmPassword", {
                        required: "Confirma tu contraseña",
                        validate: (value, formValues) =>
                          value === formValues.password ||
                          "Las contraseñas no coinciden",
                      })}
                    />
                    <button
                      type="button"
                      aria-label="Mostrar confirmación de contraseña"
                      className="flex w-12 shrink-0 cursor-pointer items-center justify-center self-stretch rounded-md text-slate-600 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-700 dark:text-slate-300 dark:focus-visible:outline-blue-300"
                      onPointerDown={() => handleShowPwd("confirm-password")}
                      onPointerUp={() => handleShowPwd(null)}
                      onPointerLeave={() => handleShowPwd(null)}
                      onPointerCancel={() => handleShowPwd(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleShowPwd("confirm-password");
                        }
                      }}
                      onKeyUp={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleShowPwd(null);
                        }
                      }}
                      onBlur={() => handleShowPwd(null)}
                    >
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p
                      id="confirm-password-error"
                      role="alert"
                      className="text-xs leading-4 text-red-600 dark:text-red-300"
                    >
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {capsLockOn && (
                  <p
                    id="register-caps-lock"
                    role="status"
                    className="text-sm text-amber-700 dark:text-amber-300"
                  >
                    Bloq Mayús está activado.
                  </p>
                )}
              </div>
            </div>
            <div className="mt-1 flex gap-3">
              {step === 2 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-blue-950 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus-visible:outline-blue-300"
                >
                  Atrás
                </button>
              )}
              <button
                type="submit"
                className="inline-flex min-h-12 min-w-0 flex-1 cursor-pointer items-center justify-center gap-3 rounded-md bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-wait disabled:opacity-60 dark:bg-blue-300 dark:text-slate-950 dark:hover:bg-blue-200 dark:focus-visible:outline-blue-300"
                disabled={loading}
              >
                {step === 1 ? "Continuar" : "Crear cuenta"}
                {loading && (
                  <LoaderCircle
                    className="h-4 w-4 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
          </form>
          <div className="flex flex-wrap items-center justify-center gap-x-1 border-t border-slate-100 pt-5 text-sm dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-300">
              ¿Ya tienes cuenta?
            </p>
            <button
              type="button"
              className="min-h-11 font-medium text-blue-700 cursor-pointer hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
              onClick={() => navigate("/auth/login")}
            >
              Iniciar sesión
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};
