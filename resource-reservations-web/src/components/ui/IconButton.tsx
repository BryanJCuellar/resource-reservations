import MuiIconButton, { type IconButtonProps as MuiIconButtonProps } from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

type IconButtonProps = MuiIconButtonProps & {
  "aria-label": string;
  tooltip?: string;
};

export function IconButton({
  tooltip,
  size = "small",
  type = "button",
  className = "",
  ...props
}: IconButtonProps) {
  const button = (
    <MuiIconButton
      {...props}
      type={type}
      size={size}
      className={`shrink-0 rounded-md text-slate-600 hover:bg-slate-100 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:text-slate-400 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-200 dark:focus-visible:outline-blue-300 dark:disabled:text-slate-500 ${
        size === "large" ? "size-12 [&_svg]:size-5" : size === "medium" ? "size-11 [&_svg]:size-5" : "size-9 [&_svg]:size-4"
      } ${className}`}
    />
  );

  return tooltip ? (
    <Tooltip title={tooltip} arrow>
      {props.disabled ? <span className="inline-flex">{button}</span> : button}
    </Tooltip>
  ) : button;
}
