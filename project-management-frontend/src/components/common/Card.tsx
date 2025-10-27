import React from "react";
import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={clsx("bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm", className)}>
    {children}
  </div>
);

export const CardHeader: React.FC<CardProps> = ({ children, className }) => (
  <div className={clsx("p-4 border-b border-gray-200 dark:border-gray-700", className)}>
    {children}
  </div>
);

export const CardTitle: React.FC<CardProps> = ({ children, className }) => (
  <h3 className={clsx("text-lg font-semibold text-gray-800 dark:text-gray-100", className)}>
    {children}
  </h3>
);

export const CardContent: React.FC<CardProps> = ({ children, className }) => (
  <div className={clsx("p-4", className)}>{children}</div>
);