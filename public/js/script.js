// // Counter Animation
document.addEventListener("DOMContentLoaded", () => {

  // FAQ Accordion
  const faqItems = document.querySelectorAll("#faq-item");

  faqItems.forEach((item) => {
    const button = item.querySelector("button");
    const content = item.querySelector("#faq-content");
    const icon = button.querySelector("i");

    button.addEventListener("click", () => {
      const isOpen = content.classList.contains("hidden");

      // Close all other FAQs
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.querySelector("#faq-content").classList.add("hidden");
          otherItem.querySelector("i").classList.remove("fa-chevron-up");
          otherItem.querySelector("i").classList.add("fa-chevron-down");
        }
      });

      // Toggle current FAQ
      content.classList.toggle("hidden");
      if (isOpen) {
        icon.classList.remove("fa-chevron-down");
        icon.classList.add("fa-chevron-up");
      } else {
        icon.classList.remove("fa-chevron-up");
        icon.classList.add("fa-chevron-down");
      }
    });
  });
});

// // Smooth scroll for navigation links
// document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//     anchor.addEventListener('click', function (e) {
//         e.preventDefault();
//         document.querySelector(this.getAttribute('href')).scrollIntoView({
//             behavior: 'smooth'
//         });
//     });
// });
