import { cloneElement, ReactElement, useRef, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Label } from "@/components/ui/label";

interface FormRowProps {
  children: ReactElement;
  label?: string;
  error?: string | null;
}

const FormRow = ({ children, label, error }: FormRowProps) => {
  const [isOpenPassword, setIsOpenPassword] = useState<boolean>(false);
  const inputType = useRef(children.props.type);

  const typePasswordInput =
    inputType.current === "password"
      ? isOpenPassword
        ? { type: "text" }
        : { type: "password" }
      : {};
  const id = children.props.name;

  return (
    <div className="grid gap-2">
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        {cloneElement(children, { id, ...typePasswordInput })}

        {inputType.current === "password" && (
          <div
            className="absolute right-4 top-[8%] z-10 translate-y-[15%] cursor-pointer"
            onClick={() => setIsOpenPassword((open) => !open)}
          >
            {isOpenPassword ? (
              <EyeIcon className="h-6 w-6" />
            ) : (
              <EyeOffIcon className="h-6 w-6" />
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="-my-1 text-sm font-semibold text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormRow;
