// change main image
function changeImage(imgElement) {
  const mainImage = document.getElementById("mainImage");
  mainImage.src = imgElement.src;

  const thumbnails = document.querySelectorAll(".thumbnail-list img");
  thumbnails.forEach((img) => img.classList.remove("active"));

  imgElement.classList.add("active");
}

// change size
const sizeItems = document.querySelectorAll(".size-list span");

sizeItems.forEach((item) => {
  item.addEventListener("click", () => {
    sizeItems.forEach((size) => size.classList.remove("active"));

    item.classList.add("active");

    console.log("Đã chọn size:", item.textContent);
  });
});

// change number of items
const quantityInput = document.getElementById("quantity");

function increaseQty() {
  let value = parseInt(quantityInput.value);
  quantityInput.value = value + 1;
}

function decreaseQty() {
  let value = parseInt(quantityInput.value);

  if (value > 1) quantityInput.value = value - 1;
}

// accordion animation
const accordions = document.querySelectorAll(".accordion");

accordions.forEach((acc) => {
  acc.addEventListener("click", function () {
    const panel = this.nextElementSibling;

    this.classList.toggle("active");

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
      panel.classList.remove("open");
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
      panel.classList.add("open");
    }
  });
});

// add to cart
function addToCart(event) {
  const button = event.currentTarget;

  const productId = button.getAttribute("data-id");
  const productName = button.getAttribute("data-name");
  const productPrice = parseInt(button.getAttribute("data-price"));
  const productImage = button.getAttribute("data-image");

  const quantityInput = document.getElementById("quantity");
  const cartCountSpan = document.querySelector(".cart-count");

  // kiểm tra size đã chọn
  const selectedSize = document.querySelector(".size-list span.active");
  if (!selectedSize) {
    alert("Vui lòng chọn size trước khi thêm vào giỏ hàng!");
    return;
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
    size: selectedSize.textContent,
    image: productImage
  };

  // kiểm tra trùng sản phẩm
  const existingIndex = cartItems.findIndex(
    (item) => item.id === product.id && item.size === product.size
  );

  if (existingIndex >= 0) {
    cartItems[existingIndex].quantity += quantity;
  } else {
    cartItems.push(product);
  }

  localStorage.setItem("cart-items", JSON.stringify(cartItems));

  const newCount = currentCount + quantity;
  localStorage.setItem("cart-count", newCount);
  cartCountSpan.textContent = newCount;

  location.reload();
}

document.querySelector(".add-to-cart")?.addEventListener("click", addToCart);

document.addEventListener("DOMContentLoaded", () => {
  const cartCountSpan = document.querySelector(".cart-count");
  if (cartCountSpan) {
    cartCountSpan.textContent = localStorage.getItem("cart-count") || 0;
  }
});