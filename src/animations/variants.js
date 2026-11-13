export const ease = [0.22, 1, 0.36, 1];
export const easeInOut = [0.65, 0, 0.35, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease, delay },
  }),
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

export const lineReveal = {
  hidden: { y: "110%" },
  show: (i = 0) => ({
    y: "0%",
    transition: { duration: 1.1, ease, delay: 0.08 * i },
  }),
};

export const viewport = { once: true, margin: "0px 0px -12% 0px" };
