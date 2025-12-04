/**
 * Smoothly scrolls to a section with proper offset calculation
 * Accounts for fixed header and centers content appropriately
 * @param {string} sectionId - The ID of the target section
 */
export const scrollToSection = (sectionId) => {
  if (!sectionId) return;

  const targetElement = document.getElementById(sectionId);
  if (!targetElement) return;

  // Get the header height (fixed header)
  const header = document.querySelector("header");
  const headerHeight = header ? header.offsetHeight : 80;

  // Get the target element's position
  const elementPosition = targetElement.getBoundingClientRect().top;
  const offsetPosition =
    elementPosition + window.pageYOffset - headerHeight - 40; // 40px extra padding

  // For hero section, scroll to absolute top
  if (sectionId === "hero") {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    return;
  }

  // Smooth scroll to calculated position
  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};
