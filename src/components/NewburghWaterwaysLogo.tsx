import React from 'react';

interface NewburghWaterwaysLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const NewburghWaterwaysLogo: React.FC<NewburghWaterwaysLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  // Height classes based on requested size
  const heightClass =
    size === 'sm' ? 'h-7' : size === 'lg' ? 'h-14 sm:h-16' : 'h-10 sm:h-11';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 620 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${heightClass} w-auto`}
        aria-label="Newburgh Waterways Center Logo"
      >
        {/* NEWBURGH - Vibrant Waterways Cyan / Seafoam */}
        <g fill="#2BB4C0">
          {/* N */}
          <path d="M12 12 H36 L68 54 V12 H90 V76 H66 L34 34 V76 H12 Z" />
          {/* E */}
          <path d="M104 12 H154 V27 H126 V37 H150 V51 H126 V61 H154 V76 H104 Z" />
          {/* W */}
          <path d="M166 12 H188 L201 54 L214 12 H236 L249 54 L262 12 H284 L263 76 H241 L225 32 L209 76 H187 Z" />
          {/* B */}
          <path d="M298 12 H332 C345 12 355 17 355 28 C355 35 350 41 341 43 C352 46 358 53 358 61 C358 71 347 76 333 76 H298 Z M320 25 V38 H330 C334 38 337 36 337 32 C337 28 334 25 330 25 Z M320 50 V63 H331 C336 63 339 60 339 56 C339 52 336 50 331 50 Z" />
          {/* U */}
          <path d="M372 12 H394 V52 C394 60 398 64 406 64 C414 64 418 60 418 52 V12 H440 V52 C440 70 427 78 406 78 C385 78 372 70 372 52 Z" />
          {/* R */}
          <path d="M454 12 H488 C501 12 511 19 511 31 C511 41 503 48 493 49 L513 76 H489 L473 52 H476 V52 H474 V36 H486 C489 36 491 34 491 31 C491 28 489 26 486 26 H474 V76 H454 Z" />
          {/* G */}
          <path d="M578 30 H557 C554 26 548 24 542 24 C531 24 523 32 523 44 C523 56 531 64 543 64 C551 64 557 60 558 55 H542 V42 H578 V62 C572 72 559 78 543 78 C518 78 501 64 501 44 C501 24 518 10 543 10 C558 10 571 17 578 30 Z" />
          {/* H */}
          <path d="M592 12 H614 V37 H640 V12 H662 V76 H640 V51 H614 V76 H592 Z" />
        </g>

        {/* Dynamic Golden River Waves */}
        <g stroke="#F5A623" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Wave 1 */}
          <path d="M4 84 C 120 77, 240 85, 360 88 C 460 90, 560 82, 650 78" />
          {/* Wave 2 */}
          <path d="M4 92 C 120 86, 240 93, 360 96 C 460 98, 560 90, 650 86" />
        </g>

        {/* WATERWAYS CENTER - Nautical Navy */}
        <g fill="#242A75">
          {/* W */}
          <path d="M12 99 H24 L32 119 L40 99 H52 L60 119 L68 99 H80 L69 125 H57 L46 106 L35 125 H23 Z" />
          {/* A */}
          <path d="M84 125 L101 99 H113 L130 125 H117 L114 119 H100 L97 125 Z M103 111 H111 L107 104 Z" />
          {/* T */}
          <path d="M133 99 H161 V107 H153 V125 H141 V107 H133 Z" />
          {/* E */}
          <path d="M166 99 H192 V107 H178 V110 H190 V117 H178 V118 H192 V125 H166 Z" />
          {/* R */}
          <path d="M197 99 H215 C222 99 227 102 227 108 C227 113 223 116 218 117 L229 125 H216 L207 118 H208 V118 H207 V113 H213 C215 113 216 111 216 109 C216 107 215 106 213 106 H207 V125 H197 Z" />
          {/* W */}
          <path d="M232 99 H244 L252 119 L260 99 H272 L280 119 L288 99 H300 L289 125 H277 L266 106 L255 125 H243 Z" />
          {/* A */}
          <path d="M304 125 L321 99 H333 L350 125 H337 L334 119 H320 L317 125 Z M323 111 H331 L327 104 Z" />
          {/* Y */}
          <path d="M352 99 H364 L373 112 L382 99 H394 L380 115 V125 H367 V115 Z" />
          {/* S */}
          <path d="M414 104 L404 106 C403 104 400 103 398 103 C395 103 393 105 393 107 C393 109 396 110 401 112 C408 114 413 117 413 121 C413 126 407 127 400 127 C393 127 387 124 386 118 L396 116 C397 119 400 120 402 120 C405 120 407 119 407 117 C407 115 404 114 400 112 C393 110 388 108 388 103 C388 99 394 97 400 97 C407 97 413 100 414 104 Z" />
          {/* C */}
          <path d="M438 117 C437 120 433 122 429 122 C422 122 418 117 418 112 C418 107 422 102 429 102 C433 102 437 104 438 107 L447 104 C444 99 438 97 429 97 C417 97 407 103 407 112 C407 121 417 127 429 127 C438 127 444 125 448 119 Z" />
          {/* E */}
          <path d="M453 99 H479 V107 H465 V110 H477 V117 H465 V118 H479 V125 H453 Z" />
          {/* N */}
          <path d="M484 99 H496 L510 116 V99 H522 V125 H510 L496 108 V125 H484 Z" />
          {/* T */}
          <path d="M526 99 H554 V107 H546 V125 H534 V107 H526 Z" />
          {/* E */}
          <path d="M558 99 H584 V107 H570 V110 H582 V117 H570 V118 H584 V125 H558 Z" />
          {/* R */}
          <path d="M589 99 H607 C614 99 619 102 619 108 C619 113 615 116 610 117 L621 125 H608 L599 118 H600 V118 H599 V113 H605 C607 113 608 111 608 109 C608 107 607 106 605 106 H599 V125 H589 Z" />
        </g>
      </svg>
    </div>
  );
};
