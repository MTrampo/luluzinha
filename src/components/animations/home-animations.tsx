'use client';

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomeAnimations() {
  useGSAP(() => {
    // 1. Entrance Animations for Hero Section (Immediate on Load)
    const tlHero = gsap.timeline({ defaults: { ease: "power2.out" } });

    tlHero.fromTo(".animate-hero-text-content", { opacity: 0 }, { opacity: 1, duration: 0.5 })
      .fromTo(".animate-hero-title", { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.3")
      .fromTo(".animate-hero-desc", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
      .fromTo(".animate-hero-buttons", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.5")
      .fromTo(".animate-hero-check", { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 }, "-=0.3")
      .fromTo(".desktop-animate-hero-dell, .mobile-animate-hero-dell", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8 }, "-=0.6")
      .fromTo(".desktop-animate-hero-phone, .mobile-animate-hero-phone", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8 }, "-=0.6");

    // 2. Responsive Scroll-Triggered Animations via matchMedia
    let mm = gsap.matchMedia();

    // Desktop Layout (min-width: 1024px)
    mm.add("(min-width: 1024px)", () => {
      const heroContainer = document.querySelector(".desktop-hero-phone-wrapper") as HTMLElement;
      const targetContainer = document.querySelector(".features-phone-container") as HTMLElement;
      const heroPhone = document.querySelector(".desktop-animate-hero-phone") as HTMLElement;

      if (heroContainer && targetContainer && heroPhone) {
        // Calculate document-relative coordinates using static containers
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        const heroRect = heroContainer.getBoundingClientRect();
        const targetRect = targetContainer.getBoundingClientRect();

        // Calculate centers relative to the document
        const heroCenterX = heroRect.left + heroRect.width / 2 + scrollX;
        const heroCenterY = heroRect.top + heroRect.height / 2 + scrollY;

        const targetCenterX = targetRect.left + targetRect.width / 2 + scrollX;
        const targetCenterY = targetRect.top + targetRect.height / 2 + scrollY;

        // Translation deltas
        const dx = targetCenterX - heroCenterX;
        const dy = targetCenterY - heroCenterY;

        // Make hand waiting/moving mockup visible initially on scroll start
        gsap.set(".animate-moving-hand", { opacity: 1 });
        gsap.set(".animate-final-hand", { opacity: 0 });

        // Scroll Timeline (starts immediately when page is scrolled, ends when features section is in full view)
        const tlScroll = gsap.timeline({
          scrollTrigger: {
            trigger: "main",
            start: "top top",         // Starts immediately when user starts scrolling from top of page
            endTrigger: "#funcionalidades",
            end: "top 25%",           // Ends when features section reaches 25% from viewport top
            scrub: true,              // Links animation progress directly to scroll without latency
          }
        });

        // 1. Phone curve translation & rotation
        tlScroll.to(".desktop-animate-hero-phone", {
          x: dx,
          rotation: -340,
          scale: 0.95,          // scale to match phone size inside mockup-s26-hand
          ease: "power1.inOut",
        }, 0);

        tlScroll.to(".desktop-animate-hero-phone", {
          y: dy,
          ease: "power1.inOut",
        }, 0);

        // 2. Animate features header & cards appearing
        tlScroll.fromTo(".animate-features-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, 0.1);
        tlScroll.fromTo(".animate-features-desc", { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.2);
        tlScroll.fromTo(".animate-feature-card", { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: "power1.inOut", stagger: 0.12, duration: 0.18 }, 0.45);

        // 3. Swap at the end of the scroll trigger (fade out S26 and Moving Hand, fade in combined S26 Hand)
        tlScroll.to(".desktop-animate-hero-phone", { opacity: 0, duration: 0.05 }, 0.95);
        tlScroll.to(".animate-moving-hand", { opacity: 0, duration: 0.05 }, 0.95);
        tlScroll.to(".animate-final-hand", { opacity: 1, duration: 0.05 }, 0.95);
        tlScroll.to(".animate-hand-light", { opacity: 0.5, duration: 0.1 }, 0.95);
      }
    });

    // Mobile Layout (max-width: 1023px)
    mm.add("(max-width: 1023px)", () => {
      // Just make images visible locally, no complex translations
      gsap.set(".animate-moving-hand", { opacity: 0, display: "none" });
      gsap.set(".animate-final-hand", { opacity: 1 });

      const tlMobile = gsap.timeline({
        scrollTrigger: {
          trigger: "#funcionalidades",
          start: "top 75%",
          toggleActions: "play none none none"
        }
      });

      tlMobile.fromTo(".animate-features-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(".animate-features-desc", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
        .fromTo(".animate-final-hand", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6 }, "-=0.2")
        .fromTo(".animate-feature-card", { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.2, duration: 1 }, "-=0.4");
    });

    // 3. Scroll Trigger for 'Why Luluzinha' reasons
    gsap.fromTo(".animate-reason-item",
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        stagger: 0.2,
        duration: 0.6,
        scrollTrigger: {
          trigger: ".animate-reason-item",
          start: "top 85%",
          toggleActions: "play none none none",
        }
      }
    );

    // 4. Scroll Trigger for pricing card
    gsap.fromTo(".animate-pricing-card",
      { opacity: 0, scale: 0.95, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: "#preco",
          start: "top 75%",
          toggleActions: "play none none none",
        }
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return null;
}
