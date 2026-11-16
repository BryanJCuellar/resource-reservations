import MuiButton, { type ButtonProps } from "@mui/material/Button";

export function Button({
  variant = "text",
  size = "medium",
  color = "primary",
  type = "button",
  disableElevation = true,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <MuiButton
      {...props}
      type={type}
      variant={variant}
      size={size}
      color={color}
      disableElevation={disableElevation}
      className={`shrink-0 gap-2 rounded-md font-medium normal-case focus-visible:outline-2 focus-visible:outline-offset-2 ${color === "error" ? "focus-visible:outline-red-600 dark:focus-visible:outline-red-300" : color === "inherit" ? "focus-visible:outline-slate-600 dark:focus-visible:outline-slate-300" : "focus-visible:outline-blue-700 dark:focus-visible:outline-blue-300"} disabled:opacity-50 disabled:text-slate-500 dark:disabled:text-slate-400 ${props.loading && (!props.loadingPosition || props.loadingPosition === "center") ? "[&.MuiButton-loading.Mui-disabled]:text-transparent" : ""} ${
        size === "small" ? "min-h-9 px-3 text-sm" : size === "large" ? "min-h-12 px-4 text-base" : "min-h-11 px-4 text-sm"
      } ${color === "primary" ? (
        variant === "contained"
          ? "bg-blue-700 text-white hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-500 dark:bg-blue-300 dark:text-slate-950 dark:hover:bg-blue-200 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
          : variant === "outlined"
            ? "border-slate-300 text-blue-700 hover:border-blue-700 hover:bg-blue-50 dark:border-slate-600 dark:text-blue-300 dark:hover:border-blue-300 dark:hover:bg-slate-700"
            : "text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-slate-700"
      ) : color === "error" && variant === "outlined" ? "border-red-600 text-red-600 hover:border-red-600 hover:bg-red-50 disabled:border-slate-300 disabled:text-slate-500 dark:border-red-300 dark:text-red-300 dark:hover:border-red-300 dark:hover:bg-red-300/10 dark:disabled:border-slate-600 dark:disabled:text-slate-400" : color === "inherit" && variant === "outlined" ? "border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-700" : ""} ${className}`}
    />
  );
}
