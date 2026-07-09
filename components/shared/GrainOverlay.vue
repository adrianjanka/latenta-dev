<template>
  <div
    class="pointer-events-none fixed inset-0 z-[1000] hidden opacity-[0.05] mix-blend-overlay dark:block"
    aria-hidden="true"
  >
    <svg width="100%" height="100%" class="h-full w-full">
      <filter id="grainNoise">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grainNoise)" />
    </svg>
  </div>
</template>
