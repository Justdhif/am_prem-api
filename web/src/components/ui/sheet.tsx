"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | null>(null);

function useSheet() {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error("useSheet must be used within a <Sheet />");
  }
  return context;
}

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function Sheet({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  children,
}: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) setUncontrolledOpen(value);
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({
  asChild,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { setOpen } = useSheet();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        (children.props as any)?.onClick?.(e);
        setOpen(true);
      },
      ...props,
    });
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

export function SheetClose({
  asChild,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { setOpen } = useSheet();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        (children.props as any)?.onClick?.(e);
        setOpen(false);
      },
      ...props,
    });
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(false)}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

const sheetVariants = cva(
  "fixed z-[180] flex flex-col bg-[#090d16] shadow-2xl transition-all",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b border-gray-800",
        bottom: "inset-x-0 bottom-0 border-t border-gray-800",
        left: "inset-y-0 left-0 h-full w-full sm:w-[420px] max-w-full border-r border-gray-800",
        right: "inset-y-0 right-0 h-full w-full sm:w-[420px] max-w-full border-l border-gray-800",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

const sheetMotionTransitions = {
  top: { initial: { y: "-100%" }, animate: { y: 0 }, exit: { y: "-100%" } },
  bottom: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } },
  left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
  right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
};

interface SheetContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sheetVariants> {
  onClose?: () => void;
}

export const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  (
    {
      side = "right",
      className,
      children,
      onClose,
      ...props
    },
    ref
  ) => {
    const { open, setOpen } = useSheet();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    // Lock body scroll when sheet is open
    React.useEffect(() => {
      if (!open) return;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }, [open]);

    // Close on Escape key
    React.useEffect(() => {
      if (!open) return;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
          onClose?.();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, setOpen, onClose]);

    if (!mounted || typeof document === "undefined") return null;

    const chosenSide = side || "right";
    const motionProps = sheetMotionTransitions[chosenSide];

    return createPortal(
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => {
                setOpen(false);
                onClose?.();
              }}
              className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[180] touch-none"
            />

            {/* Sheet Panel */}
            <motion.div
              ref={ref}
              role="dialog"
              aria-modal="true"
              initial={motionProps.initial}
              animate={motionProps.animate}
              exit={motionProps.exit}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className={cn(sheetVariants({ side: chosenSide }), className)}
              {...(props as any)}
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
    );
  }
);
SheetContent.displayName = "SheetContent";

export function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-5 py-3.5 border-b border-gray-800 flex items-center justify-between bg-[#0d121f] shrink-0",
        className
      )}
      {...props}
    />
  );
}

export function SheetTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-sm font-bold text-gray-100", className)}
      {...props}
    />
  );
}

export function SheetDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-[11px] text-gray-400", className)}
      {...props}
    />
  );
}

export function SheetFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "p-4 border-t border-gray-800 bg-[#0d121f] flex items-center justify-end gap-2 shrink-0",
        className
      )}
      {...props}
    />
  );
}
