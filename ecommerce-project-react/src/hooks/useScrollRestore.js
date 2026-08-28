import { useEffect, useState } from "react";


/**
 * Hook para guardar e restaurar a posição de scroll de um elemento.
 * Usa sessionStorage e debounce interno.
 *
 * @param {React.RefObject} ref - referência do elemento que tem scroll
 * @param {string} key - chave única no sessionStorage
 * @param {boolean} enabled - se deve restaurar (ex: depois dos dados carregarem)
 * @returns {boolean} isRestoring - true enquanto restaura, útil para ocultar conteúdo
 */
export function useScrollRestore(ref, key, enabled = true) {
  const [isRestoring, setIsRestoring] = useState(true);

  // Guardar posição (com debounce)
  useEffect(() => {
    const el = ref?.current;
    if (!el) return;

    let timeout;
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        sessionStorage.setItem(key, el.scrollTop.toString());
      }, 200);
    };

    el.addEventListener("scroll", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [ref, key]);

  // Restaurar posição
  useEffect(() => {
    if (!enabled) return;
    const el = ref?.current;
    if (!el) {
      setIsRestoring(false);
      return;
    }

    const saved = sessionStorage.getItem(key);
    if (saved && parseInt(saved) > 0) {
      requestAnimationFrame(() => {
        el.scrollTop = parseInt(saved, 10);
        setIsRestoring(false);
      });
    } else {
      setIsRestoring(false);
    }
  }, [ref, key, enabled]);

  return isRestoring;
}
