import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function Icon() {
  return (
    <div className="h-4 w-[13px] flex-shrink-0 flex items-center justify-center">
      <svg
        fill="none"
        viewBox="0 0 15 18"
        className="block w-[13px] h-4 flex-shrink-0"
      >
        <path
          d="M6.90909 8.38462V0.846155H4.15599V3.98521C4.15599 4.81364 3.48442 5.48521 2.65599 5.48521H0.852273V8.38462H4.25348H6.90909Z"
          fill="#1F2221"
        />
        <path
          d="M8.09091 8.38462V0.846155H10.844V3.98521C10.844 4.81364 11.5156 5.48521 12.344 5.48521H14.1477V8.38462H10.7465H8.09091Z"
          fill="#1F2221"
        />
        <path
          d="M6.90909 9.61538V17.1538H4.15599V14.0148C4.15599 13.1864 3.48442 12.5148 2.65599 12.5148H0.852273V9.61538H4.25348H6.90909Z"
          fill="#1F2221"
        />
        <path
          d="M8.09091 9.61538V17.1538H10.844V14.0148C10.844 13.1864 11.5156 12.5148 12.344 12.5148H14.1477V9.61538H10.7465H8.09091Z"
          fill="#1F2221"
        />
      </svg>
    </div>
  );
}

function FlipCharacter({
  targetChar,
  animationTrigger,
  delay = 0,
}: {
  targetChar: string;
  animationTrigger: number;
  delay?: number;
}) {
  const [displayChar, setDisplayChar] = useState(targetChar);
  const [isFlipping, setIsFlipping] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Reset if no animation trigger
    if (animationTrigger === 0) {
      setDisplayChar(targetChar);
      setIsFlipping(false);
      return;
    }

    // Start animation after delay
    timerRef.current = setTimeout(() => {
      setIsFlipping(true);
      let flipCount = 0;
      const maxFlips = 5 + Math.floor(Math.random() * 3);

      const flip = () => {
        if (flipCount >= maxFlips) {
          setDisplayChar(targetChar);
          setIsFlipping(false);
          return;
        }

        // Show random letter
        let randomLetter;
        do {
          randomLetter = letters[Math.floor(Math.random() * letters.length)];
        } while (randomLetter === targetChar && targetChar !== " ");

        setDisplayChar(randomLetter);
        flipCount++;

        // Schedule next flip
        timerRef.current = setTimeout(flip, 50);
      };

      flip();
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [animationTrigger, targetChar, delay]);

  return (
    <motion.span
      className="font-mono text-[13px] font-normal leading-[100%] inline-block text-[#1F2221]"
      style={{
        transformOrigin: "center",
      }}
      animate={{
        rotateX: isFlipping ? [0, -10, 10, 0] : 0,
        scale: isFlipping ? [1, 0.95, 1.05, 1] : 1,
      }}
      transition={{
        duration: isFlipping ? 0.1 : 0,
        ease: "easeInOut",
      }}
    >
      {displayChar === " " ? "\u00A0" : displayChar}
    </motion.span>
  );
}

export function PresentedByStytch() {
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [hasInitialAnimated, setHasInitialAnimated] = useState(false);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);
  const initialAnimationRef = useRef<NodeJS.Timeout | null>(null);

  const text = "Presented by Stytch";

  // Trigger initial animation on mount
  useEffect(() => {
    // Delay the initial animation slightly to ensure component is fully mounted
    initialAnimationRef.current = setTimeout(() => {
      setAnimationTrigger(1);
      setHasInitialAnimated(true);

      // Set a brief cooldown after initial animation
      setIsInCooldown(true);
      cooldownRef.current = setTimeout(() => {
        setIsInCooldown(false);
      }, 1500); // Slightly longer cooldown after initial animation
    }, 200); // Small delay to ensure smooth initial render

    return () => {
      if (initialAnimationRef.current) {
        clearTimeout(initialAnimationRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    // Prevent rapid triggering and ensure initial animation has completed
    if (isInCooldown || !hasInitialAnimated) return;

    setIsInCooldown(true);
    setAnimationTrigger((prev) => prev + 1);

    // Clear existing cooldown
    if (cooldownRef.current) {
      clearTimeout(cooldownRef.current);
    }

    // Set cooldown period
    cooldownRef.current = setTimeout(() => {
      setIsInCooldown(false);
    }, 1200);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cooldownRef.current) {
        clearTimeout(cooldownRef.current);
      }
      if (initialAnimationRef.current) {
        clearTimeout(initialAnimationRef.current);
      }
    };
  }, []);

  return (
    <Link
      href="https://stytch.com?utm_source=client.dev"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div
        className="bg-[rgb(178,214,222)] w-[188px] cursor-pointer p-2 hover:bg-[rgb(158,194,202)] rounded-md"
        onMouseEnter={handleMouseEnter}
      >
        <div className="flex items-center gap-2">
          <Icon />
          <div className="flex">
            {text.split("").map((char, index) => (
              <FlipCharacter
                key={index}
                targetChar={char}
                animationTrigger={animationTrigger}
                delay={index * 45}
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
