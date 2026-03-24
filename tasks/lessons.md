# Lessons Learned

<!-- Format : [date] | ce qui a mal tourné | règle pour l'éviter -->

- [2026-03-23] | Unicode escapes `\u00e9` etc. rendus littéralement dans JSX | Toujours utiliser les caractères UTF-8 directs dans le JSX, jamais de `\uXXXX` dans le texte JSX (les escapes ne fonctionnent que dans les string literals JS, pas dans le texte JSX brut)
- [2026-03-23] | `layoutId` Framer Motion crashait les transitions Next.js App Router | Éviter `layoutId` sur des éléments persistants entre routes (Sidebar), utiliser du CSS classique à la place
- [2026-03-23] | `overflow: hidden` sur gauge-track rognait le thumb du slider | Ne jamais mettre overflow:hidden sur un parent dont les enfants doivent dépasser visuellement
- [2026-03-23] | Dark mode : les couleurs hardcodées (#f0ecf5, etc.) ne s'adaptent pas | Utiliser des CSS custom properties (--gauge-bg) pour tout ce qui doit changer en dark mode
- [2026-03-23] | Default theme était "system" au lieu de "clair" | Toujours vérifier la valeur par défaut du state quand l'utilisateur demande un défaut spécifique
