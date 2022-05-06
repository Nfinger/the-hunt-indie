import { gsap } from "gsap";
// const preloadFonts = (id) => {
//   return new Promise((resolve) => {
//     WebFont.load({
//       typekit: {
//         id: id,
//       },
//       active: resolve,
//     });
//   });
// };

class Intro {
  constructor(el) {
    this.q = gsap.utils.selector(el);
    // the SVG element
    this.DOM = {
      el: el,
      frame: this.q(".frame"),
      content: this.q(".content"),
      enterCtrl: this.q("button.enter"),
      enterBackground: this.q(".enter__bg"),
    };
    // SVG texts
    this.DOM.circleText = [...this.q("text.circles__text")];
    // total of texts
    this.circleTextTotal = this.DOM.circleText.length;
    // initial setudp
    this.setup();
  }
  setup() {
    // need to set the transform origin in the center
    gsap.set(this.DOM.circleText, { transformOrigin: "50% 50%" });
    // hide on start
    gsap.set(
      [this.DOM.circleText, this.DOM.content.children, this.DOM.frame.children],
      { opacity: 0 }
    );
    // don't allow to hover
    gsap.set(this.DOM.enterCtrl, { pointerEvents: "none" });

    this.initEvents();
  }
  initEvents() {
    // click and hover events for the "enter" button:
    this.enterMouseEnterEv = () => {
      gsap.killTweensOf([this.DOM.enterBackground, this.DOM.circleText]);

      gsap.to(this.DOM.enterBackground, {
        duration: 0.8,
        ease: "power4",
        scale: 1.2,
        opacity: 1,
      });

      gsap.to(this.DOM.circleText, {
        duration: 4,
        ease: "power4",
        rotate: "+=180",
        stagger: {
          amount: -0.3,
        },
      });
    };
    this.enterMouseLeaveEv = () => {
      //gsap.killTweensOf(this.DOM.enterBackground);
      gsap.to(this.DOM.enterBackground, {
        duration: 0.8,
        ease: "power4",
        scale: 1,
      });
    };
    this.enterClickEv = () => this.enter();

    // this.DOM.enterCtrl.addEventListener("mouseenter", this.enterMouseEnterEv);
    // this.DOM.enterCtrl.addEventListener("mouseleave", this.enterMouseLeaveEv);
    // this.DOM.enterCtrl.addEventListener("click", this.enterClickEv);
  }
  // initial (intro) animation
  start() {
    this.startTL = gsap
      .timeline()
      .addLabel("start", 0)
      // scale in the texts & enter button and fade them in
      .to(
        [this.DOM.circleText, this.DOM.enterCtrl],
        {
          duration: 2.5,
          ease: "expo",
          startAt: { opacity: 0, scale: 0.3 },
          scale: 1,
          opacity: 1,
          stagger: {
            amount: 0.5,
          },
        },
        "start"
      )
      // at start+1 allow the hover over the enter ctrl
      .add(
        () => gsap.set(this.DOM.enterCtrl, { pointerEvents: "auto" }),
        "start+=1"
      );

    gsap.to(this.DOM.enterBackground, {
      delay: 2,
      duration: 6,
      ease: "power4",
      scale: 1.2,
      opacity: 1,
    });

    gsap.to(this.DOM.circleText, {
      delay: 2,
      duration: 800,
      repeat: 99,
      repeatDelay: 0,
      ease: "power4",
      rotate: "+=3200",
      stagger: {
        amount: -0.3,
      },
    });
  }
  // animation when clicking the enter button
  enter() {
    // stop the previous timeline
    // this.startTL.kill();
    // remove any event listener on the button
    // this.DOM.enterCtrl.removeEventListener(
    //   "mouseenter",
    //   this.enterMouseEnterEv
    // );
    // this.DOM.enterCtrl.removeEventListener(
    //   "mouseleave",
    //   this.enterMouseLeaveEv
    // );
    // this.DOM.enterCtrl.removeEventListener("click", this.enterClickEv);
    // gsap.set(this.DOM.enterCtrl, { pointerEvents: "none" });
    // show frame and content
    // gsap.set([this.DOM.frame, this.DOM.content], { opacity: 1 });
    // start the animation
    gsap
      .timeline()
      .addLabel("start", 0)
      .to(
        this.DOM.enterCtrl,
        {
          duration: 1.5,
          ease: "expo.inOut",
          scale: 0.7,
          opacity: 0,
        },
        "start"
      )
      .to(
        this.DOM.circleText,
        {
          duration: 1.5,
          ease: "expo.inOut",
          scale: (i) => 1.5 + (this.circleTextTotal - i) * 0.3,
          opacity: 0,
          stagger: {
            amount: 0.2,
          },
        },
        "start"
      )
      // show the content elements
      .to(
        [this.DOM.content.children, this.DOM.frame.children],
        {
          duration: 1,
          ease: "power3.out",
          startAt: { opacity: 0, scale: 0.9 },
          scale: 1,
          opacity: 1,
          stagger: {
            amount: 0.3,
          },
        },
        "start+=1.1"
      );
  }
}

export const start = () => {
  const intro = new Intro(document.querySelector(".circles"));

  // Preload images and fonts
  // remove loader (loading class)
  // start intro animation
  intro.start();
  return intro.enter;
};
