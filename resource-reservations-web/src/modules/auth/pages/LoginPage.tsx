import { Eye, LoaderCircle } from "lucide-react";
import { useLogin } from "../hooks/useLogin";

const logoUrl = "/locenda-logo.svg";

export const LoginPage = () => {
  const {
    navigate,
    emailRef,
    passwordRef,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    errors,
    showPwd,
    capsLockOn,
    handleShowPwd,
    handleCapsLock,
    handleSubmit,
  } = useLogin();

  return (
    <main className="relative isolate flex min-h-screen flex-col overflow-x-clip bg-slate-50 p-6 text-blue-950 md:p-10 dark:bg-slate-900 dark:text-slate-100">
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

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-10 py-10 md:flex-row md:gap-16 md:py-12">
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
              Tu lugar para
              <br />
              reservar.
            </p>
            <p className="max-w-sm text-base leading-7 text-slate-600 dark:text-slate-300">
              Solicita espacios, vehículos y equipos de tu empresa en el horario
              que necesitas.
            </p>
          </div>
        </section>

        {/* Lado derecho */}
        <section
          aria-labelledby="login-title"
          className="flex w-full min-w-0 max-w-md flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 md:flex-1 md:p-8 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/15"
        >
          <div className="flex flex-col gap-3">
            <h1
              id="login-title"
              className="text-2xl font-semibold tracking-tight"
            >
              Iniciar sesión
            </h1>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Ingresa a tu cuenta para continuar.
            </p>
          </div>
          <form
            className="flex flex-col gap-5"
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Correo
              </label>
              <div>
                <input
                  id="email"
                  ref={emailRef}
                  name="email"
                  type="email"
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-blue-950 placeholder:text-slate-500 focus-visible:border-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus-visible:border-blue-300 dark:focus-visible:outline-blue-300"
                  placeholder="Ingresa tu correo"
                  autoComplete="username"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="text-xs leading-4 text-red-600 dark:text-red-300"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Contraseña
              </label>
              <div className="flex items-center rounded-md border border-slate-300 bg-white focus-within:border-blue-700 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-700 dark:border-slate-600 dark:bg-slate-900/40 dark:focus-within:border-blue-300 dark:focus-within:outline-blue-300">
                <input
                  id="password"
                  ref={passwordRef}
                  name="password"
                  type={showPwd ? "text" : "password"}
                  className="min-w-0 flex-1 rounded-md bg-transparent py-3 pl-4 text-base text-blue-950 placeholder:text-slate-500 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-400"
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    [
                      capsLockOn && "password-caps-lock",
                      errors.password && "password-error",
                    ]
                      .filter(Boolean)
                      .join(" ") || undefined
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={handleCapsLock}
                />
                <button
                  type="button"
                  aria-label="Mostrar contraseña"
                  className="flex w-12 shrink-0 items-center justify-center self-stretch rounded-md cursor-pointer text-slate-600 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-700 dark:text-slate-300 dark:focus-visible:outline-blue-300"
                  onPointerDown={() => handleShowPwd(true)}
                  onPointerUp={() => handleShowPwd(false)}
                  onPointerLeave={() => handleShowPwd(false)}
                  onPointerCancel={() => handleShowPwd(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleShowPwd(true);
                    }
                  }}
                  onKeyUp={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleShowPwd(false);
                    }
                  }}
                  onBlur={() => handleShowPwd(false)}
                >
                  <Eye className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              {capsLockOn && (
                <p
                  id="password-caps-lock"
                  role="status"
                  className="text-sm text-amber-700 dark:text-amber-300"
                >
                  Bloq Mayús está activado.
                </p>
              )}
              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="text-xs leading-4 text-red-600 dark:text-red-300"
                >
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="mt-1 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-md bg-blue-700 px-4 py-3 text-sm font-semibold text-white cursor-pointer hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-wait disabled:opacity-60 dark:bg-blue-300 dark:text-slate-950 dark:hover:bg-blue-200 dark:focus-visible:outline-blue-300"
              disabled={loading}
            >
              {loading ? "Ingresando…" : "Continuar"}
              {loading && (
                <LoaderCircle
                  className="h-4 w-4 animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />
              )}
            </button>
          </form>
          <div className="flex flex-wrap items-center justify-center gap-x-1 border-t border-slate-100 pt-5 text-sm dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-300">
              ¿No tienes cuenta?
            </p>
            <button
              type="button"
              className="min-h-11 font-medium text-blue-700 cursor-pointer hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
              onClick={() => navigate("/auth/register")}
            >
              Crear cuenta
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};
