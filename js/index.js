//Hero Banner chạy slide
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slider .slide, .slider .slide-active");
  const prevBtn = document.querySelector(".slider .prev");
  const nextBtn = document.querySelector(".slider .next");

  let currentIndex = 0;
  let autoSlideInterval;
  const autoSlideDelay = 4000;
  const manualDelay = 5000; 
  const cooldownTime = 1000;   

  // Hàm hiển thị slide
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("slide-active");
      if (i === index) {
        slide.classList.add("slide-active");
      }
    });
  }

  // Hàm chuyển sang slide kế tiếp
  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
    cooldownButtons();
  }

  // Hàm chuyển về slide trước
  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
    cooldownButtons();
  }

  // Hàm khởi động auto slide
  function startAutoSlide(delay = autoSlideDelay) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, delay);
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
    startAutoSlide(manualDelay); 
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
  const track = document.querySelector(".feedback-track");
  if (!track) return;

  track.innerHTML += track.innerHTML;
});



