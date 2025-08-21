import React from "react";

type IconContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const IconContainer = ({ children, className = "" }: IconContainerProps) => (
  <div className={`w-10 h-10 flex items-end justify-center ${className}`}>
    {children}
  </div>
);

export default IconContainer;
