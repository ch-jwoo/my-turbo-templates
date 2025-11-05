import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export const Card = ({
  title,
  description,
  children,
  className = "",
  ...props
}: CardProps) => {
  return (
    <div
      className={`border rounded-lg shadow-sm p-6 ${className}`}
      {...props}
    >
      {title && <h3 className="text-xl font-semibold mb-2">{title}</h3>}
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {children}
    </div>
  );
};
