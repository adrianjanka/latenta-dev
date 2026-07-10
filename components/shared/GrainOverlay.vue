<template>
  <!-- Übertriebenes Film-Grain – bewusst stark für Analog-Look -->
  <div
    class="grain-motion pointer-events-none fixed inset-0 z-[1000] opacity-[0.28] mix-blend-soft-light dark:opacity-[0.45] dark:mix-blend-overlay"
    aria-hidden="true"
  >
    <svg width="100%" height="100%" class="h-full w-full">
      <filter id="grainNoise" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.95"
          numOctaves="5"
          stitchTiles="stitch"
          result="fine"
        />
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.35"
          numOctaves="3"
          stitchTiles="stitch"
          result="coarse"
        />
        <feBlend in="fine" in2="coarse" mode="multiply" result="mixed" />
        <feColorMatrix
          in="mixed"
          type="matrix"
          values="0 0 0 0 0.55
                  0 0 0 0 0.55
                  0 0 0 0 0.55
                  0 0 0 1.4 0"
          result="contrast"
        />
        <feComponentTransfer in="contrast" result="punch">
          <feFuncA type="linear" slope="1.6" intercept="-0.15" />
        </feComponentTransfer>
      </filter>
      <rect width="100%" height="100%" filter="url(#grainNoise)" />
    </svg>
  </div>
</template>

<style scoped>
.grain-motion {
  animation: grain-drift 3.5s steps(4) infinite;
}
</style>
