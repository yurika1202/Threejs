class Parallax {
  constructor(root) {
    this.parallaxTargets = [...root];
    this.windowHeight = window.innerHeight;
  }

  init() {
    window.addEventListener(
      'scroll',
      () => {
        const scrollTop = window.scrollY;

        for (const target of this.parallaxTargets) {
          const targetOffsetTop = target.offsetTop;
          const scrollStart = targetOffsetTop - this.windowHeight;
          const parallaxElm = target.querySelector('.parallaxElm');
          parallaxElm.style.transform = scrollTop > scrollStart ? `translate3d(0, ${(scrollTop - targetOffsetTop) * 0.25}px, 0)` : `translate3d(0, 0, 0)`;
        }
      },
      { passive: true }
    );
  }
}
new Parallax(document.querySelectorAll('.parallaxElmWrap')).init();
