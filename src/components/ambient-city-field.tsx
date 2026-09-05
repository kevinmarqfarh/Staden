"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR =
  "a, button, summary, input, select, textarea, [role='button']";

type Point = {
  x: number;
  y: number;
};

export function AmbientCityField() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const currentRef = useRef<Point>({ x: 0, y: 0 });
  const targetRef = useRef<Point>({ x: 0, y: 0 });

  useEffect(() => {
    const field = fieldRef.current;
    const main = field?.closest("main");

    if (!field || !(main instanceof HTMLElement)) return;

    const finePointerQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );
    const reduceMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const setPosition = ({ x, y }: Point) => {
      field.style.setProperty("--ambient-x", `${x}px`);
      field.style.setProperty("--ambient-y", `${y}px`);
    };

    const seedPosition = () => {
      const position = {
        x: window.innerWidth * 0.58,
        y: Math.min(window.innerHeight * 0.42, 430),
      };
      currentRef.current = position;
      targetRef.current = position;
      setPosition(position);
    };

    const stopFrame = () => {
      if (frameRef.current === null) return;
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };

    const moveTowardsTarget = () => {
      const current = currentRef.current;
      const target = targetRef.current;
      const next = {
        x: current.x + (target.x - current.x) * 0.18,
        y: current.y + (target.y - current.y) * 0.18,
      };

      currentRef.current = next;
      setPosition(next);

      if (
        Math.abs(target.x - next.x) > 0.35 ||
        Math.abs(target.y - next.y) > 0.35
      ) {
        frameRef.current = window.requestAnimationFrame(moveTowardsTarget);
      } else {
        currentRef.current = target;
        setPosition(target);
        frameRef.current = null;
      }
    };

    const moveTo = (point: Point, immediate = false) => {
      targetRef.current = point;

      if (immediate) {
        stopFrame();
        currentRef.current = point;
        setPosition(point);
        return;
      }

      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(moveTowardsTarget);
      }
    };

    const pulse = () => {
      if (reduceMotionQuery.matches) return;

      field.getAnimations().forEach((animation) => animation.cancel());
      field.animate(
        [
          { opacity: 0.34, filter: "blur(22px)" },
          { opacity: 0.78, filter: "blur(12px)", offset: 0.36 },
          { opacity: 0.48, filter: "blur(18px)" },
        ],
        {
          duration: 360,
          easing: "cubic-bezier(.16, 1, .3, 1)",
        },
      );
    };

    const activateTemporarily = () => {
      field.dataset.active = "true";

      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
      }

      settleTimerRef.current = window.setTimeout(() => {
        field.dataset.active = "false";
        settleTimerRef.current = null;
      }, 720);
    };

    const pointFromElement = (element: Element) => {
      const rect = element.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointerQuery.matches || reduceMotionQuery.matches) return;
      field.dataset.active = "true";
      moveTo({ x: event.clientX, y: event.clientY });
    };

    const onPointerLeave = () => {
      field.dataset.active = "false";
    };

    const onPointerDown = (event: PointerEvent) => {
      if (reduceMotionQuery.matches) return;
      const target = event.target;
      const interactive =
        target instanceof Element ? target.closest(INTERACTIVE_SELECTOR) : null;

      if (!interactive || !main.contains(interactive)) return;

      moveTo({ x: event.clientX, y: event.clientY }, !finePointerQuery.matches);
      activateTemporarily();
      pulse();
    };

    const onClick = (event: MouseEvent) => {
      if (event.detail !== 0 || reduceMotionQuery.matches) return;
      const target = event.target;
      const interactive =
        target instanceof Element ? target.closest(INTERACTIVE_SELECTOR) : null;

      if (!interactive || !main.contains(interactive)) return;

      moveTo(pointFromElement(interactive), true);
      activateTemporarily();
      pulse();
    };

    const onVisibilityChange = () => {
      if (document.hidden) stopFrame();
    };

    const onResize = () => {
      const target = targetRef.current;
      moveTo(
        {
          x: Math.min(target.x, window.innerWidth),
          y: Math.min(target.y, window.innerHeight),
        },
        true,
      );
    };

    seedPosition();
    main.addEventListener("pointermove", onPointerMove, { passive: true });
    main.addEventListener("pointerleave", onPointerLeave, { passive: true });
    main.addEventListener("pointerdown", onPointerDown, { passive: true });
    main.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      stopFrame();
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
      }
      main.removeEventListener("pointermove", onPointerMove);
      main.removeEventListener("pointerleave", onPointerLeave);
      main.removeEventListener("pointerdown", onPointerDown);
      main.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      className="ambient-city-field"
      data-active="false"
      ref={fieldRef}
      aria-hidden="true"
    />
  );
}
