import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <div className={cn("relative group h-full flex flex-col rounded-3xl overflow-hidden", containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 z-0 opacity-100 transition duration-500 will-change-transform",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#ff3333,transparent),radial-gradient(circle_farthest-side_at_100%_0,#ff0000,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#e60000,transparent),radial-gradient(circle_farthest-side_at_0_0,#ff4d4d,#d70018)]"
        )}
      />

      <div className={cn("relative z-10 flex-1 flex flex-col", className)}>{children}</div>
    </div>
  );
};
