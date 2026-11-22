import { useId } from "react";
import type { Ref } from "react";
import MuiTextField, { type TextFieldProps } from "@mui/material/TextField";
import { mergeSlotProps, useForkRef } from "@mui/material/utils";

type TextFieldComponentProps = Omit<TextFieldProps, "ref"> & {
  ref?: Ref<HTMLInputElement | HTMLTextAreaElement>;
};

export function TextField({
  id,
  label,
  required,
  disabled,
  error,
  fullWidth,
  multiline,
  size = "small",
  className = "",
  slotProps,
  ref,
  inputRef: externalInputRef,
  ...props
}: TextFieldComponentProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = `${inputId}-label`;
  const inputRef = useForkRef<HTMLInputElement | HTMLTextAreaElement>(ref, externalInputRef);

  return (
    <div className={`flex flex-col gap-2 ${fullWidth ? "w-full" : ""} ${className}`}>
      {label && (
        <label
          id={labelId}
          htmlFor={inputId}
          className={`text-sm font-medium ${error ? "text-red-600 dark:text-red-300" : disabled ? "text-slate-400 dark:text-slate-500" : "text-blue-950 dark:text-slate-100"}`}
        >
          {label}{required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      <MuiTextField
        {...props}
        id={inputId}
        size={size}
        required={required}
        disabled={disabled}
        error={error}
        fullWidth={fullWidth}
        multiline={multiline}
        inputRef={inputRef}
        slotProps={{
          ...slotProps,
          select:
            props.select && label
              ? mergeSlotProps(slotProps?.select, { labelId })
              : slotProps?.select,
          input: mergeSlotProps(slotProps?.input, {
            className: `rounded-md bg-white text-base text-blue-950 dark:bg-slate-800 dark:text-slate-100 [&_fieldset]:border-slate-300 hover:[&_fieldset]:border-slate-400 [&.Mui-focused_fieldset]:border-blue-700 dark:[&_fieldset]:border-slate-600 dark:hover:[&_fieldset]:border-slate-500 dark:[&.Mui-focused_fieldset]:border-blue-300 [&.Mui-error_fieldset]:border-red-600 [&.Mui-error.Mui-focused_fieldset]:border-red-600 [&.Mui-error:hover_fieldset]:border-red-600 dark:[&.Mui-error_fieldset]:border-red-300 dark:[&.Mui-error.Mui-focused_fieldset]:border-red-300 dark:[&.Mui-error:hover_fieldset]:border-red-300 [&.Mui-disabled]:bg-slate-100 dark:[&.Mui-disabled]:bg-slate-800 [&.Mui-disabled_fieldset]:border-slate-200 dark:[&.Mui-disabled_fieldset]:border-slate-700 ${multiline ? "" : size === "small" ? "h-11" : "h-12"}`,
          }),
          htmlInput: mergeSlotProps(slotProps?.htmlInput, {
            className: "placeholder:text-slate-500 placeholder:opacity-100 dark:placeholder:text-slate-400 disabled:[-webkit-text-fill-color:var(--color-slate-500)] dark:disabled:[-webkit-text-fill-color:var(--color-slate-400)]",
          }),
          formHelperText: mergeSlotProps(slotProps?.formHelperText, {
            className: "mt-1 mx-0 text-left text-xs leading-4 text-slate-600 dark:text-slate-300 [&.Mui-error]:text-red-600 dark:[&.Mui-error]:text-red-300",
          }),
        }}
      />
    </div>
  );
}
