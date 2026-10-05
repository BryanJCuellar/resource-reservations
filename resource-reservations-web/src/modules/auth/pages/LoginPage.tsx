import { Loader2 } from "lucide-react";
import { useLogin } from "../hooks/useLogin";

export const LoginPage = () => {
  const {
    email,
    password,
    loading,
    errors,
    serverErr,
    setEmail,
    setPassword,
    handleSubmit,
  } = useLogin();

  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-950">
      <div className="w-full max-w-md p-6 border border-white rounded-lg shadow bg-slate-50">
        <h1 className="text-2xl text-gray-800 font-bold text-center mb-5">
          Iniciar sesión
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <>
                <div className="w-full text-red-600 text-sm mt-1">
                  {errors.email}
                </div>
              </>
            )}
          </div>

          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <>
                <div className="w-full text-red-600 text-sm mt-1">
                  {errors.password}
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white border px-3 py-2 rounded-lg inline-flex items-center justify-center gap-2"
          >
            Continuar {loading && <Loader2 className="animate-spin" />}
          </button>

          {serverErr && (
            <div className="bg-red-500 border border-red-800 text-white  p-1">
              {serverErr}
            </div>
          )}
        </form>
      </div>
    </main>
  );
};
