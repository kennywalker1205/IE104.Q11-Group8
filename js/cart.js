// Load cart items từ localStorage
function loadCart() {
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartItems = JSON.parse(localStorage.getItem("cart-items")) || [];
  cartItemsContainer.innerHTML = "";

  cartItems.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.setAttribute("data-id", item.id);
    itemDiv.setAttribute("data-size", item.size);

    if(item.size) {
      itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="item-details">
        <h3>${item.name}</h3>
        <p class="price">${item.price.toLocaleString("vi-VN")}đ</p>
        <p class="size">Size: ${item.size}</p>
        <div class="quantity">
            <div class="quantity-controls">
                <button type="button" class="quantity-btn minus">-</button>
                <input type="number" name="quantity" class="quantity-input" value="${item.quantity}" min="1" readonly />
                <button type="button" class="quantity-btn plus">+</button>
            </div>
        </div>
      </div>
      <button class="delete-item-btn"><i class="fa-solid fa-trash"></i></button>
    `;
    } else {
      itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="item-details">
        <h3>${item.name}</h3>
        <p class="price">${item.price.toLocaleString("vi-VN")}đ</p>
        <div class="quantity">
            <div class="quantity-controls">
                <button type="button" class="quantity-btn minus">-</button>
                <input type="number" name="quantity" class="quantity-input" value="${item.quantity}" min="1" readonly />
                <button type="button" class="quantity-btn plus">+</button>
            </div>
        </div>
      </div>
      <button class="delete-item-btn"><i class="fa-solid fa-trash"></i></button>
    `;
    }

    cartItemsContainer.appendChild(itemDiv);
  });

  attachCartEvents();
  updateCartCount();
  updateCartTotal();
}

// Gắn sự kiện cho +, -, delete
function attachCartEvents() {
  const cartItems = JSON.parse(localStorage.getItem("cart-items")) || [];

  document.querySelectorAll(".cart-item").forEach((itemDiv) => {
    const id = itemDiv.getAttribute("data-id");
    const size = itemDiv.getAttribute("data-size");

    const plusBtn = itemDiv.querySelector(".plus");
    const minusBtn = itemDiv.querySelector(".minus");
    const qtyInput = itemDiv.querySelector(".quantity-input");
    const deleteBtn = itemDiv.querySelector(".delete-item-btn");

    plusBtn.addEventListener("click", () => {
      const index = cartItems.findIndex((item) => {
        if(item.size) {
          return item.id === id && item.size === size;
        }
        return item.id === id;
      });
      if (index >= 0) {
        cartItems[index].quantity += 1;
        qtyInput.value = cartItems[index].quantity;
        saveCart(cartItems);
      }
    });

    minusBtn.addEventListener("click", () => {
      const index = cartItems.findIndex((item) => {
        if(item.size) {
          return item.id === id && item.size === size;
        }
        return item.id === id;
      });
      if (index >= 0) {
        cartItems[index].quantity -= 1;
        if(cartItems[index].quantity == 0) {
          cartItems.splice(index, 1);
          saveCart(cartItems);
          itemDiv.remove();
        }
        qtyInput.value = cartItems[index].quantity;
        saveCart(cartItems);
      }
    });

    deleteBtn.addEventListener("click", () => {
      const index = cartItems.findIndex((item) => {
        if(item.size) {
          return item.id === id && item.size === size;
        }
        return item.id === id;
      });
      if (index >= 0) {
        cartItems.splice(index, 1);
        saveCart(cartItems);
        itemDiv.remove();
      }
    });
  });

    document.querySelectorAll('input[name="voucher"]').forEach((input) => {
      input.addEventListener("change", () => {
        updateCartTotal();
      });
    });
}

// Lưu cart vào localStorage và cập nhật cart-count
function saveCart(cartItems) {
  localStorage.setItem("cart-items", JSON.stringify(cartItems));
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  localStorage.setItem("cart-count", totalCount);

  const cartCountSpan = document.querySelector(".cart-count");
  if (cartCountSpan) cartCountSpan.textContent = totalCount;

  updateCartTotal();
  location.reload();
}

// Cập nhật cart-count khi load trang
function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem("cart-items")) || [];
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartCountSpan = document.querySelector(".cart-count");
  if (cartCountSpan) cartCountSpan.textContent = totalCount;
}

// Hàm tính tổng tiền bao gồm voucher
function updateCartTotal() {
  const cartItems = JSON.parse(localStorage.getItem("cart-items")) || [];
  let subtotal = 0;

  cartItems.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  const shippingFee = 30000;

  // Voucher
  const selectedVoucher = document.querySelector('input[name="voucher"]:checked');
  let discount = 0;

  if (selectedVoucher) {
    const code = selectedVoucher.value;
    switch(code) {
      case "WELCOME2025":
        discount = subtotal * 0.10;
        if (discount > 1000000) discount = 1000000;
        break;
      case "SUMMER2025":
        discount = subtotal * 0.15;
        if (discount > 700000) discount = 700000;
        break;
      case "SPECIAL500K":
        if (subtotal >= 5000000) discount = 500000;
        break;
      default:
        discount = 0;
    }
  }

  const subtotalElem = document.querySelector(".subtotal");
  const totalElem = document.querySelector(".total-price");
  const shippingElem = document.querySelector(".shipping-fee");

  if (subtotalElem) subtotalElem.textContent = subtotal.toLocaleString("vi-VN") + "đ";
  if (shippingElem) shippingElem.textContent = shippingFee.toLocaleString("vi-VN") + "đ";
  if (totalElem) totalElem.textContent = (subtotal + shippingFee - discount).toLocaleString("vi-VN") + "đ";
}

// Popup thông báo Đã đặt hàng
document.addEventListener("DOMContentLoaded", () => {
  const checkout_button = document.querySelector(".checkout-button"); 
  const popup = document.getElementById("submitted-popup");

  checkout_button.addEventListener("click", (e) => {
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


// Khi load trang
document.addEventListener("DOMContentLoaded", () => {
  const cartItems = JSON.parse(localStorage.getItem("cart-items")) || [];

  if (cartItems.length === 0) {
    window.location.href = "cart-empty.html";
  } else {
    loadCart();
  }
});
