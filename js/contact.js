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


// Popup thông báo Đã submit form 
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form"); 
  const popup = document.getElementById("submitted-popup");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); //Chặn chuyển tiếp

    popup.classList.remove("hidden");
    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
      popup.classList.add("hidden");
    }, 5000);

    form.reset();
  });
});


