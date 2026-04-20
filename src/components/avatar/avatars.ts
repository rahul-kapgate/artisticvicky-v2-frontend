export interface AvatarOption {
  id: number;
  name: string;
  svg: string;
}

export const AVATARS: AvatarOption[] = [
  {
    id: 0,
    name: "Oil Painter",
    svg: `<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" fill="#FFF8F0"/>
      <rect x="10" y="14" width="26" height="22" rx="2" fill="#F5DEB3" stroke="#C49A3C" stroke-width="1.5"/>
      <rect x="12" y="16" width="22" height="18" rx="1" fill="#87CEEB"/>
      <ellipse cx="18" cy="28" rx="5" ry="4" fill="#228B22"/>
      <ellipse cx="28" cy="22" rx="4" ry="5" fill="#FF6347"/>
      <rect x="13" y="14" width="24" height="3" rx="1" fill="#8B6914"/>
      <rect x="10" y="36" width="26" height="2" rx="1" fill="#8B6914"/>
      <rect x="22" y="38" width="3" height="8" fill="#C49A3C"/>
      <rect x="36" y="10" width="4" height="28" rx="2" fill="#8B6914"/>
      <ellipse cx="38" cy="10" rx="4" ry="3" fill="#D85A30"/>
      <rect x="36" y="36" width="4" height="3" rx="1" fill="#C49A3C"/>
    </svg>`,
  },
  {
    id: 1,
    name: "Palette",
    svg: `<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" fill="#F0F8FF"/>
      <path d="M28 8 C14 8 6 17 6 26 C6 35 13 42 22 43 C26 43.5 27 41 27 38 C27 35 29 33 32 33 C35 33 38 35 38 38 C38 44 44 46 48 42 C52 38 52 30 48 22 C44 14 37 8 28 8Z" fill="#F5F5DC" stroke="#C8B89A" stroke-width="1.5"/>
      <circle cx="18" cy="16" r="4" fill="#E24B4A"/>
      <circle cx="28" cy="12" r="4" fill="#EF9F27"/>
      <circle cx="38" cy="16" r="4" fill="#97C459"/>
      <circle cx="42" cy="26" r="4" fill="#378ADD"/>
      <circle cx="14" cy="26" r="4" fill="#D4537E"/>
      <circle cx="16" cy="36" r="4" fill="#7F77DD"/>
      <circle cx="28" cy="38" r="3" fill="#5DCAA5"/>
    </svg>`,
  },
  {
    id: 2,
    name: "Watercolour",
    svg: `<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" fill="#FAFAFA"/>
      <ellipse cx="22" cy="20" rx="13" ry="11" fill="#B5D4F4" opacity="0.85"/>
      <ellipse cx="34" cy="24" rx="12" ry="10" fill="#F4C0D1" opacity="0.8"/>
      <ellipse cx="26" cy="34" rx="11" ry="9" fill="#C0DD97" opacity="0.8"/>
      <ellipse cx="22" cy="20" rx="8" ry="7" fill="#85B7EB" opacity="0.6"/>
      <ellipse cx="34" cy="24" rx="7" ry="6" fill="#ED93B1" opacity="0.6"/>
      <ellipse cx="26" cy="34" rx="7" ry="6" fill="#97C459" opacity="0.6"/>
      <rect x="38" y="8" width="3" height="20" rx="1.5" fill="#8B6914"/>
      <ellipse cx="39.5" cy="8" rx="3" ry="2" fill="#D85A30"/>
    </svg>`,
  },
  {
    id: 3,
    name: "Sculptor",
    svg: `<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" fill="#F5F5F0"/>
      <ellipse cx="28" cy="20" rx="11" ry="13" fill="#E8E0D0" stroke="#C8B89A" stroke-width="1"/>
      <ellipse cx="28" cy="20" rx="8" ry="10" fill="#DDD5C5"/>
      <ellipse cx="24" cy="17" rx="2" ry="2.5" fill="#B8A898"/>
      <ellipse cx="32" cy="17" rx="2" ry="2.5" fill="#B8A898"/>
      <path d="M24 23 Q28 26 32 23" stroke="#B8A898" stroke-width="1" fill="none"/>
      <rect x="22" y="32" width="12" height="3" rx="1" fill="#C8B89A"/>
      <rect x="16" y="35" width="24" height="4" rx="1" fill="#B8A898"/>
      <rect x="12" y="39" width="32" height="5" rx="1" fill="#A89888"/>
      <rect x="24" y="8" width="8" height="3" rx="1" fill="#8B6914"/>
      <rect x="40" y="14" width="6" height="2" rx="1" fill="#888780" transform="rotate(-30 40 14)"/>
      <circle cx="46" cy="13" r="3" fill="#666"/>
    </svg>`,
  },
  {
    id: 4,
    name: "Ink Artist",
    svg: `<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" fill="#FFFFFF"/>
      <rect x="8" y="8" width="32" height="40" rx="2" fill="#F8F8F8" stroke="#DDD" stroke-width="1"/>
      <path d="M18 18 Q22 12 26 18 Q30 24 34 16" stroke="#2C2C2A" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M14 28 Q20 22 24 30 Q28 38 34 26" stroke="#2C2C2A" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <circle cx="18" cy="36" r="3" fill="#2C2C2A"/>
      <circle cx="26" cy="34" r="2" fill="#888780"/>
      <circle cx="32" cy="38" r="4" fill="#2C2C2A"/>
      <rect x="38" y="6" width="3" height="22" rx="1.5" fill="#5D3A1A"/>
      <ellipse cx="39.5" cy="6" rx="3.5" ry="2.5" fill="#2C2C2A"/>
      <rect x="38" y="26" width="3" height="4" rx="1" fill="#C49A3C"/>
    </svg>`,
  },
  {
    id: 5,
    name: "Mosaic",
    svg: `<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" fill="#2C2C2A"/>
      <rect x="8" y="8" width="10" height="10" rx="1" fill="#E24B4A"/>
      <rect x="20" y="8" width="10" height="10" rx="1" fill="#EF9F27"/>
      <rect x="32" y="8" width="10" height="10" rx="1" fill="#97C459"/>
      <rect x="8" y="20" width="10" height="10" rx="1" fill="#378ADD"/>
      <rect x="20" y="20" width="10" height="10" rx="1" fill="#D4537E"/>
      <rect x="32" y="20" width="10" height="10" rx="1" fill="#7F77DD"/>
      <rect x="8" y="32" width="10" height="10" rx="1" fill="#5DCAA5"/>
      <rect x="20" y="32" width="10" height="10" rx="1" fill="#F0997B"/>
      <rect x="32" y="32" width="10" height="10" rx="1" fill="#FAC775"/>
      <rect x="14" y="44" width="22" height="5" rx="1" fill="#444441"/>
    </svg>`,
  },
  {
    id: 6,
    name: "Charcoal",
    svg: `<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" fill="#F8F6F0"/>
      <rect x="10" y="10" width="30" height="36" rx="2" fill="#EFEFEF" stroke="#CCC" stroke-width="0.5"/>
      <path d="M16 32 Q20 20 26 28 Q30 34 36 18" stroke="#444" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7"/>
      <path d="M14 38 Q22 28 30 36" stroke="#888" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>
      <line x1="14" y1="42" x2="36" y2="42" stroke="#CCC" stroke-width="1"/>
      <rect x="38" y="16" width="4" height="14" rx="2" fill="#888780"/>
      <rect x="38" y="28" width="4" height="4" rx="1" fill="#444441"/>
      <path d="M38 30 L42 30 L41 34 L39 34Z" fill="#555"/>
    </svg>`,
  },
  {
    id: 7,
    name: "Printmaker",
    svg: `<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" fill="#FFF8E7"/>
      <rect x="8" y="10" width="34" height="36" rx="2" fill="#FFFDF5" stroke="#D4B483" stroke-width="1"/>
      <path d="M16 20 L36 20 L36 22 L16 22Z" fill="#D85A30"/>
      <path d="M16 26 L30 26 L30 28 L16 28Z" fill="#D85A30"/>
      <path d="M16 32 L34 32 L34 34 L16 34Z" fill="#D85A30"/>
      <circle cx="32" cy="27" r="5" fill="#D85A30"/>
      <circle cx="32" cy="27" r="3" fill="#FFF8E7"/>
      <path d="M8 42 Q28 46 50 40" stroke="#C49A3C" stroke-width="1.5" fill="none" opacity="0.5"/>
      <rect x="40" y="8" width="5" height="10" rx="2" fill="#888780"/>
      <rect x="40" y="16" width="5" height="3" rx="1" fill="#D85A30"/>
    </svg>`,
  },
  {
    id: 8,
    name: "Muralist",
    svg: `<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" fill="#E8F4F8"/>
      <rect x="6" y="14" width="44" height="30" rx="2" fill="#F0EDE8" stroke="#C8B89A" stroke-width="1"/>
      <rect x="6" y="14" width="44" height="30" rx="2" fill="#87CEEB" opacity="0.3"/>
      <ellipse cx="20" cy="26" rx="8" ry="7" fill="#97C459" opacity="0.9"/>
      <ellipse cx="36" cy="30" rx="9" ry="8" fill="#EF9F27" opacity="0.85"/>
      <ellipse cx="28" cy="22" rx="6" ry="6" fill="#E24B4A" opacity="0.8"/>
      <rect x="6" y="40" width="44" height="4" rx="1" fill="#C8B89A" opacity="0.5"/>
      <rect x="24" y="44" width="4" height="6" fill="#8B6914"/>
      <rect x="10" y="8" width="4" height="8" rx="1" fill="#888780"/>
      <rect x="38" y="8" width="4" height="8" rx="1" fill="#888780"/>
      <rect x="8" y="8" width="36" height="2" rx="1" fill="#666"/>
      <rect x="30" y="6" width="3" height="16" rx="1.5" fill="#C49A3C"/>
      <ellipse cx="31.5" cy="6" rx="3" ry="2" fill="#D85A30"/>
    </svg>`,
  },
  {
    id: 9,
    name: "Calligrapher",
    svg: `<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" fill="#FDFAF4"/>
      <rect x="8" y="8" width="32" height="40" rx="2" fill="#FFF9EC" stroke="#D4B483" stroke-width="1"/>
      <path d="M14 20 Q20 14 26 20 Q32 26 38 20" stroke="#2C2C2A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M14 30 Q18 26 22 30 L22 38" stroke="#2C2C2A" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M26 28 L26 38 Q26 40 30 40 Q34 40 34 37 Q34 33 30 33 L26 33" stroke="#2C2C2A" stroke-width="2" fill="none" stroke-linecap="round"/>
      <rect x="38" y="4" width="4" height="26" rx="2" fill="#2C2C2A"/>
      <path d="M38 28 L42 28 L40 32Z" fill="#2C2C2A"/>
      <rect x="38" y="4" width="4" height="6" rx="2" fill="#D4B483"/>
    </svg>`,
  },
];