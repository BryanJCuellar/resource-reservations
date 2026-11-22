import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

interface FilterSelectProps<T extends string | number> {
  id: string;
  labelId: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  size?: "small" | "medium";
  className?: string;
}

export function FilterSelect<T extends string | number>({
  id,
  labelId,
  value,
  options,
  onChange,
  size = "medium",
  className = "",
}: FilterSelectProps<T>) {
  return (
    <Select<T>
      id={id}
      labelId={labelId}
      value={value}
      displayEmpty
      size="small"
      onChange={(event) => {
        const option = options.find(
          (option) => String(option.value) === String(event.target.value),
        );
        if (option) onChange(option.value);
      }}
      className={`rounded-md bg-white text-blue-950 dark:bg-slate-800 dark:text-slate-100 [&_fieldset]:border-slate-300 hover:[&_fieldset]:border-slate-400 [&.Mui-focused_fieldset]:border-blue-700 dark:[&_fieldset]:border-slate-600 dark:hover:[&_fieldset]:border-slate-500 dark:[&.Mui-focused_fieldset]:border-blue-300 [&_svg]:text-slate-500 dark:[&_svg]:text-slate-400 ${size === "small" ? "h-9 text-sm" : "h-11 text-base"} ${className}`}
      MenuProps={{
        slotProps: {
          paper: {
            className:
              "mt-1 rounded-md border border-slate-200 bg-white bg-none text-blue-950 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100",
          },
        },
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}
