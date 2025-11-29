// Popup thông báo Đã submit form 
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form"); 
  const popup = document.getElementById("submitted-popup");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); //Chặn chuyển tiếp

    // Hiển thị popup thông báo đã submit
    popup.classList.remove("hidden");
    popup.classList.add("show");

    // Ẩn popup sau 5 giây
    setTimeout(() => {
      popup.classList.remove("show");
      popup.classList.add("hidden");
    }, 5000); 

    form.reset(); // Reset lại form sau khi submit
    console.log("Form đã được reset sau khi submit");
  });
});


