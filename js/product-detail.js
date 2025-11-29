// Thay đổi ảnh khi click thumbnail
function changeImage(imgElement) {
  const mainImage = document.getElementById("mainImage");
  mainImage.src = imgElement.src; // Đổi src ảnh chính

  // Xóa class active trên tất cả thumbnail
  const thumbnails = document.querySelectorAll(".thumbnail-list img");
  thumbnails.forEach((img) => img.classList.remove("active"));
  // Thêm class active cho thumbnail vừa click
  imgElement.classList.add("active");

  console.log("Đã thay đổi ảnh chính:", imgElement.src);
}

// Chọn size
const sizeItems = document.querySelectorAll(".size-list span");

sizeItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Xóa active trên tất cả size
    sizeItems.forEach((size) => size.classList.remove("active"));
    // Thêm active cho size vừa chọn
    item.classList.add("active");

    console.log("Đã chọn size:", item.textContent);
  });
});

// Thay đổi số lượng sản phẩm
const quantityInput = document.getElementById("quantity");

// Tăng số lượng
function increaseQty() {
  let value = parseInt(quantityInput.value);
  quantityInput.value = value + 1;
}

// Giảm số lượng
function decreaseQty() {
  let value = parseInt(quantityInput.value);

  if (value > 1) quantityInput.value = value - 1; // Không cho nhỏ hơn 1
}

// Accordion animation
const accordions = document.querySelectorAll(".accordion");

accordions.forEach((acc) => {
  acc.addEventListener("click", function () {
    const panel = this.nextElementSibling; // Lấy panel liền kề

    this.classList.toggle("active"); // Toggle class active cho accordion

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
      panel.classList.remove("open"); // Ẩn panel
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px"; // Hiển thị panel
      panel.classList.add("open");
    }
  });
});

// Thêm sản phẩm vào giỏ hàng
function addToCart(event) {
  const button = event.currentTarget;

  // Lấy thông tin sản phẩm từ data attribute
  const productId = button.getAttribute("data-id");
  const productName = button.getAttribute("data-name");
  const productPrice = parseInt(button.getAttribute("data-price"));
  const productImage = button.getAttribute("data-image");

  const quantityInput = document.getElementById("quantity");
  const cartCountSpan = document.querySelector(".cart-count");

  // kiểm tra size đã chọn
  const sizeList = document.querySelector(".size-list");
  let selectedSizeText = null;

  if (sizeList) {
    const selectedSize = sizeList.querySelector("span.active");
    if (!selectedSize) {
      alert("Vui lòng chọn size trước khi thêm vào giỏ hàng!");
      return; // Dừng nếu chưa chọn size
    }
    selectedSizeText = selectedSize.textContent;
  }

  const quantity = parseInt(quantityInput.value) || 1;

  // lấy cart-count và cart-items từ localStorage
  let currentCount = parseInt(localStorage.getItem("cart-count")) || 0;
  let cartItems = JSON.parse(localStorage.getItem("cart-items")) || [];

  const product = {
    id: productId,
    name: productName,
    price: productPrice,
    quantity: quantity,
    size: selectedSizeText, 
    image: productImage
  };

  // Kiểm tra sản phẩm trùng
  const existingIndex = cartItems.findIndex((item) => {
    if (sizeList) {
      return item.id === product.id && item.size === product.size;
    }
    return item.id === product.id;
  });

  if (existingIndex >= 0) {
    // Nếu đã có, tăng số lượng
    cartItems[existingIndex].quantity += quantity;
  } else {
    // Nếu chưa có, thêm mới vào giỏ
    cartItems.push(product);
  }

  // Lưu giỏ hàng vào localStorage
  localStorage.setItem("cart-items", JSON.stringify(cartItems));

  // Cập nhật cart-count
  const newCount = currentCount + quantity;
  localStorage.setItem("cart-count", newCount);
  cartCountSpan.textContent = newCount;

  // Reload trang để cập nhật hiển thị giỏ hàng
  location.reload();
}

// Gắn sự kiện click cho nút Add to Cart
document.querySelector(".add-to-cart")?.addEventListener("click", addToCart);

//Cập nhật số lượng sản phẩm trong icon giỏ hàng khi load trang
document.addEventListener("DOMContentLoaded", () => {
  const cartCountSpan = document.querySelector(".cart-count");
  if (cartCountSpan) {
    cartCountSpan.textContent = localStorage.getItem("cart-count") || 0;
  }

  console.log("Đã load số lượng giỏ hàng:", cartCountSpan.textContent); //Kiểm tra load 
});