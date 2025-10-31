// Trigger CSS Animations when elements are scrolled into view
document.addEventListener("DOMContentLoaded", () => {

	// Use Intersection Observer to determine if objects are within the viewport
	const observer = new IntersectionObserver(entries => {
	  entries.forEach(entry => {
		if (entry.isIntersecting) {
		  entry.target.classList.add('in-view');
		  return;
		}
		entry.target.classList.remove('in-view');
	  });
	});

	// Get all the elements with the .animate class applied
	const allAnimatedElements = document.querySelectorAll('.animate');

	// Add the observer to each of those elements
	allAnimatedElements.forEach((element) => observer.observe(element));

  // Navbar shrink on scroll
  const header = document.querySelector('header');
  if (!header) return; // safely exit if header doesn't exist

  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScrollTop && currentScroll > 150) {
      // Scrolling down past 100px
      header.classList.add('shrink');
    } else if (currentScroll < lastScrollTop - 20) {
      // Scrolling up with a small threshold
      header.classList.remove('shrink');
    }

    lastScrollTop = currentScroll;
  });

}); 


// Lenis Smooth Scrolling
const lenis = new Lenis({
  autoRaf: true,
  // optional: anchors true if using anchor links
  anchors: true,
});

// Hamburger Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});


// Timeline

gsap.registerPlugin(ScrollTrigger);

function initTimelineScroll() {
  const timelineWrapper = document.querySelector('#projects');
  const timeline = timelineWrapper.querySelector('.timeline');
  const events = timeline.querySelectorAll('.event');
  const count = events.length;

  const eventWidth = window.innerWidth;
  const totalScrollWidth = (count - 1) * eventWidth;

    // Helper to find closest event index with dead zone
  function getSnappedIndex(value) {
    const snapPoints = Array.from({length: count}, (_, i) => i / (count - 1));
    let closest = snapPoints.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
    return closest;
  }

  // Main horizontal scroll timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: timelineWrapper,
      start: "top top",
      end: () => `+=${totalScrollWidth}`,
      scrub: 0.5,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      snap: {
        snapTo: getSnappedIndex,
        duration: 0.4,
        ease: "power1.inOut"
      },
      // No active class assignment
      onUpdate: () => {}
    }
  });

  tl.to(timeline, {
    x: () => `-${totalScrollWidth}px`,
    ease: "none"
  });

  // After horizontal scroll completes, release pin to allow vertical scroll
  ScrollTrigger.create({
    trigger: timelineWrapper,
    start: () => `top top+=${totalScrollWidth}`,
    end: () => `top top+=${totalScrollWidth + 1}`, // very short range
    onEnter: () => {
      // Unpin timeline to allow vertical scrolling
      events.forEach(e => {
          gsap.to(e, { scale: 1, duration: 0.4, ease: "power2.out" });
      });

      // Unpin the timeline to restore vertical scroll
      const mainTrigger = ScrollTrigger.getById(tl.scrollTrigger.id);
      if (mainTrigger) {
        mainTrigger.disable(); // disable the horizontal pin
      }
    },
    once: true,
  });
}



// Lenis + ScrollTrigger integration
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);



// Call your init
initTimelineScroll();
