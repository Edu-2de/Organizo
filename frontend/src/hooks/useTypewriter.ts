import { useEffect, useState } from "react";

export function useTypewriterLoop(
  texts: string[],
  typingSpeed = 40,
  deletingSpeed = 28,
  delay = 1200
) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const current = texts[index];

    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(
        () => setDisplayed(current.slice(0, displayed.length + 1)),
        typingSpeed
      );
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(
        () => setDisplayed(current.slice(0, displayed.length - 1)),
        deletingSpeed
      );
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), delay);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, texts, index, typingSpeed, deletingSpeed, delay]);

  return displayed;
}