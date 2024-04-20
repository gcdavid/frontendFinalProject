//Navbar functionality
const primaryNavigation = document.querySelector(".nav-list");
const navLinks = document.querySelectorAll(".nav-item");
const navToggle = document.querySelector(".mobile-nav-toggle");
const navImg = document.querySelector("#menu-img");

let visibility = primaryNavigation.getAttribute("data-visible") === "true";

const openMenu = () => {
  visibility = true;
  primaryNavigation.setAttribute("data-visible", true);
  navToggle.setAttribute("aria-expanded", true);
  navImg.src = "assets/svg/close.svg";
};

const closeMenu = () => {
  visibility = false;
  primaryNavigation.setAttribute("data-visible", false);
  navToggle.setAttribute("aria-expanded", false);
  navImg.src = "assets/svg/menu.svg";
};

navLinks.forEach((navLink) => {
  navLink.addEventListener("click", () => {
    if (visibility) {
      closeMenu();
    }
  });
});

navToggle.addEventListener("click", () => {
  if (visibility) {
    closeMenu();
  } else {
    openMenu();
  }
});
