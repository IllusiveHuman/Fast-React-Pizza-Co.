import { Link, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

interface LinkButtonProps {
  children: ReactNode;
  to: string;
}

function LinkButton({ children, to }: LinkButtonProps) {
  const navigate = useNavigate();
  const className = "text-sm text-blue-500 hover:text-blue-600 hover:underline";

  if (to === "-1")
    return (
      <button
        className={className}
        onClick={() => navigate(-1)}>
        {children}
      </button>
    );

  return (
    <Link
      to={to}
      className={className}>
      {children}
    </Link>
  );
}

export default LinkButton;
