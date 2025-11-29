// Ẩn/hiện header khi cuộn trang
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      // Cuộn xuống -> ẩn header
      console.log("Cuộn xuống ẩn Header");
      header.classList.add("hidden");
    } else {
      // Cuộn lên -> hiện header
      console.log("Cuộn lên hiện Header");
      header.classList.remove("hidden");
    }

    lastScrollY = currentScrollY; // Cập nhật vị trí scroll mới
  });
});

// Popup thông báo Tìm kiếm
document.addEventListener("DOMContentLoaded", () => {
  const searchIcon = document.querySelector(".search-icon"); // Icon tìm kiếm
  const popup = document.getElementById("search-popup"); // Popup tìm kiếm

  searchIcon.addEventListener("click", (e) => {
    e.preventDefault(); //Chặn chuyển tiếp

    // Hiển thị popup
    popup.classList.remove("hidden");
    popup.classList.add("show");
    console.log("Hiện popup tìm kiếm");

    // Ẩn popup sau 5 giây
    setTimeout(() => {
      popup.classList.remove("show");
      popup.classList.add("hidden");
    }, 5000);
  });
});

// Chuyển đổi Nav Menu (Responsive)
const burger = document.querySelector(".burger"); //Nút burger
const mobileMenu = document.querySelector(".mobile-menu"); 
const overlay = document.querySelector(".mobile-overlay"); 
const closeBtn = document.querySelector(".close-menu");
const drop = document.querySelector(".mobile-dropdown");

/* mở menu */
burger.onclick = () => {
  console.log("Mở menu Burger");
  mobileMenu.classList.add("active");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden"; // Chặn scroll body
};

/* đóng menu */
closeBtn.onclick = overlay.onclick = () => {
  console.log("Đóng menu Burger");
  mobileMenu.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "auto"; // Cho phép scroll body
};

/* mở dropdown */
drop.addEventListener("click", () => {
  drop.classList.toggle("open");
});

// Cập nhật số hàng trong giỏ hàng
document.addEventListener("DOMContentLoaded", () => {
  const cartItems = JSON.parse(localStorage.getItem("cart-items")) || []; // Lấy giỏ hàng từ localStorage
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0); // Tổng số sản phẩm

  const cartCountSpan = document.querySelector(".cart-count"); // Span hiển thị số lượng
  if (cartCountSpan) {
    cartCountSpan.textContent = totalCount; // Cập nhật hiển thị
    console.log("Cập nhật số hàng trong giỏ: " + totalCount);
  }
});
