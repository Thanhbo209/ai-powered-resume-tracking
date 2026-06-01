import type { ReactNode } from "react";
import React, { createContext, useContext, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";

interface AccordionContextType {
  activeItems: string[];
  toggleItem: (id: string) => void;
  isItemActive: (id: string) => boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined,
);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion");
  }
  return context;
};

interface AccordionProps {
  children: ReactNode;
  defaultOpen?: string;
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  defaultOpen,
  allowMultiple = false,
  className = "",
}) => {
  const [activeItems, setActiveItems] = useState<string[]>(
    defaultOpen ? [defaultOpen] : [],
  );

  const toggleItem = (id: string) => {
    setActiveItems((prev) => {
      if (allowMultiple) {
        return prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id];
      } else {
        return prev.includes(id) ? [] : [id];
      }
    });
  };

  const isItemActive = (id: string) => activeItems.includes(id);

  return (
    <AccordionContext.Provider
      value={{ activeItems, toggleItem, isItemActive }}
    >
      <div className={`space-y-3 ${className}`}>{children}</div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  children,
  className = "",
}) => {
  const { isItemActive } = useAccordion();
  const isActive = isItemActive(id);

  return (
    <div
      className={cn(
        "glass-panel border-white/5 overflow-hidden transition-all duration-300",
        isActive
          ? "border-indigo-500/20 bg-slate-900/40 glow-indigo"
          : "hover:border-white/10 hover:bg-slate-900/20",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface AccordionHeaderProps {
  itemId: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  itemId,
  children,
  className = "",
  icon,
  iconPosition = "right",
}) => {
  const { toggleItem, isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);

  const defaultIcon = (
    <ChevronDown
      className={cn(
        "w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0",
        {
          "rotate-180 text-indigo-400": isActive,
        },
      )}
    />
  );

  const handleClick = () => {
    toggleItem(itemId);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full px-6 py-4 text-left focus:outline-none flex items-center justify-between cursor-pointer select-none transition-colors duration-200",
        className,
      )}
    >
      <div className="flex items-center space-x-3 w-full">
        {iconPosition === "left" && (icon || defaultIcon)}
        <div className="flex-1 w-full">{children}</div>
      </div>
      {iconPosition === "right" && (icon || defaultIcon)}
    </button>
  );
};

interface AccordionContentProps {
  itemId: string;
  children: ReactNode;
  className?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
  itemId,
  children,
  className = "",
}) => {
  const { isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);

  return (
    <div
      className={cn(
        "grid transition-all duration-300 ease-in-out border-t border-white/5",
        isActive
          ? "grid-rows-[1fr] opacity-100 bg-slate-950/20"
          : "grid-rows-[0fr] opacity-0 pointer-events-none",
        className,
      )}
    >
      <div className="overflow-hidden">
        <div className="px-6 py-5 text-left">{children}</div>
      </div>
    </div>
  );
};
