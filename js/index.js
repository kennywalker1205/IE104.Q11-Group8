//Hero Banner chạy slide
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slider .slide, .slider .slide-active");
  const prevBtn = document.querySelector(".slider .prev"); 
  const nextBtn = document.querySelector(".slider .next");

  let currentIndex = 0; // Chỉ số slide hiện tại
  let autoSlideInterval; // Biến lưu interval tự động
  const autoSlideDelay = 4000; // Thời gian tự động chuyển slide (ms)
  const manualDelay = 5000; // Thời gian delay sau khi click nút
  const cooldownTime = 1000; // Thời gian cooldown ngăn nhấn nút liên tục (ms)

  // Hàm hiển thị slide
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("slide-active");
      if (i === index) {
        slide.classList.add("slide-active"); // Hiển thị slide theo index
      }
    });
  }

  // Hàm chuyển sang slide kế tiếp
  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length; // Vòng lặp lại khi tới slide cuối
    showSlide(currentIndex);
    cooldownButtons(); // Ngăn nhấn nút quá nhanh
    console.log("Chuyển sang slide tiếp theo");
  }

  // Hàm chuyển về slide trước
  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length; // Vòng lặp khi tới slide đầu
    showSlide(currentIndex);
    cooldownButtons();
    console.log("Chuyển về slide trước");
  }

  // Hàm khởi động auto slide
  function startAutoSlide(delay = autoSlideDelay) {
    clearInterval(autoSlideInterval); // Xóa interval cũ
    autoSlideInterval = setInterval(nextSlide, delay); // Tạo interval mới
    console.log("Khởi động auto slide với delay:", delay, "ms"); //Check khởi động auto slide
  }

  // Hàm ngăn nút trong thời gian cooldown
  function cooldownButtons() {
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    setTimeout(() => {
      prevBtn.disabled = false;
      nextBtn.disabled = false;
    }, cooldownTime);
  }

  // Event cho nút Next
  nextBtn.addEventListener("click", () => {
    nextSlide();
    startAutoSlide(manualDelay); // Khởi động lại auto slide sau khi click
  });

  // Event cho nút Prev
  prevBtn.addEventListener("click", () => {
    prevSlide();
    startAutoSlide(manualDelay); 
  });

  // Khởi động auto slide lần đầu
  startAutoSlide(autoSlideDelay);
});

//Feedback chạy tự động + liên tục
document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".feedback-track"); // Container feedback
  if (!track) return;

  track.innerHTML += track.innerHTML;
  //Nhân đôi nội dung để chạy liên tục không gián đoạn (loop infinite)
});



