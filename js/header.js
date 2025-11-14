// Ẩn/hiện header khi cuộn trang
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      // Cuộn xuống → ẩn header
      header.classList.add("hidden");
    } else {
      // Cuộn lên → hiện header
      header.classList.remove("hidden");
    }

    lastScrollY = currentScrollY;
  });
});

// Popup thông báo Tìm kiếm
document.addEventListener("DOMContentLoaded", () => {
  const searchIcon = document.querySelector(".search-icon");
  const popup = document.getElementById("search-popup");

  searchIcon.addEventListener("click", (e) => {
    e.preventDefault();
    popup.classList.remove("hidden");
    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
      popup.classList.add("hidden");
    }, 5000);
  });
});
