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
  checkoutEvent();
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
        // Khi chọn voucher từ list, xóa voucher manual
        localStorage.removeItem("manual-voucher-code");
        updateCartTotal();
      });
    });

    // Xử lý nút áp dụng voucher từ input
    const applyVoucherBtn = document.getElementById("apply-voucher-btn");
    const voucherInput = document.getElementById("discount");
    const voucherError = document.querySelector(".voucher-error");

    // Hàm xử lý áp dụng voucher
    const applyVoucher = () => {
      const code = voucherInput.value.trim();

      if (code === "") {
        // Nếu input rỗng, xóa voucher manual
        localStorage.removeItem("manual-voucher-code");
        voucherError.style.display = "none";
        updateCartTotal();
        return;
      }

      if (isValidVoucher(code)) {
        // Voucher hợp lệ
        localStorage.setItem("manual-voucher-code", code.toUpperCase());
        // Bỏ chọn voucher từ list
        document.querySelectorAll('input[name="voucher"]').forEach((input) => {
          input.checked = false;
        });
        voucherError.textContent = "Áp dụng mã giảm giá thành công!";
        voucherError.className = "voucher-error success";
        voucherError.style.display = "block";
        updateCartTotal();
      } else {
        // Voucher không hợp lệ
        localStorage.removeItem("manual-voucher-code");
        voucherError.textContent = "Mã giảm giá không hợp lệ";
        voucherError.className = "voucher-error error";
        voucherError.style.display = "block";
        updateCartTotal();
      }
    };

    // Xử lý click nút
    if (applyVoucherBtn) {
      applyVoucherBtn.addEventListener("click", applyVoucher);
    }

    // Xử lý nhấn Enter trong ô input
    if (voucherInput) {
      voucherInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          applyVoucher();
        }
      });
    }
}

// Lưu cart vào localStorage và cập nhật cart-count
function saveCart(cartItems) {
  localStorage.setItem("cart-items", JSON.stringify(cartItems));
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  localStorage.setItem("cart-count", totalCount);

  const cartCountSpan = document.querySelector(".cart-count");
  if (cartCountSpan) cartCountSpan.textContent = totalCount;

  updateCartTotal();
}

// Cập nhật cart-count khi load trang
function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem("cart-items")) || [];
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartCountSpan = document.querySelector(".cart-count");
  if (cartCountSpan) cartCountSpan.textContent = totalCount;
}

// Hàm tính giảm giá dựa trên mã voucher
function calculateDiscount(code, subtotal) {
  let discount = 0;
  
  switch(code.toUpperCase()) {
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
    case "FREESHIP":
      discount = 30000;
      break;
    default:
      discount = 0;
  }
  
  return discount;
}

// Hàm kiểm tra mã voucher có hợp lệ không
function isValidVoucher(code) {
  const validCodes = ["WELCOME2025", "SUMMER2025", "SPECIAL500K", "FREESHIP"];
  return validCodes.includes(code.toUpperCase());
}

// Hàm tính tổng tiền bao gồm voucher
function updateCartTotal() {
  const cartItems = JSON.parse(localStorage.getItem("cart-items")) || [];
  let subtotal = 0;

  cartItems.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  const shippingFee = 30000;

  // Kiểm tra voucher từ input hoặc từ list
  const manualVoucherCode = localStorage.getItem("manual-voucher-code");
  const selectedVoucher = document.querySelector('input[name="voucher"]:checked');
  let discount = 0;
  let voucherCode = "";

  if (manualVoucherCode) {
    // Ưu tiên voucher từ input
    voucherCode = manualVoucherCode;
    discount = calculateDiscount(voucherCode, subtotal);
  } else if (selectedVoucher) {
    // Voucher từ list
    voucherCode = selectedVoucher.value;
    discount = calculateDiscount(voucherCode, subtotal);
  }

  const subtotalElem = document.querySelector(".subtotal");
  const totalElem = document.querySelector(".total-price");
  const shippingElem = document.querySelector(".shipping-fee");
  const discountRow = document.querySelector(".discount-row");
  const discountAmount = document.querySelector(".discount-amount");

  if (subtotalElem) subtotalElem.textContent = subtotal.toLocaleString("vi-VN") + "đ";
  if (shippingElem) shippingElem.textContent = shippingFee.toLocaleString("vi-VN") + "đ";
  
  // Hiển thị dòng giảm giá nếu có
  if (discount > 0) {
    if (discountRow) discountRow.style.display = "flex";
    if (discountAmount) discountAmount.textContent = "-" + discount.toLocaleString("vi-VN") + "đ";
  } else {
    if (discountRow) discountRow.style.display = "none";
  }
  
  if (totalElem) totalElem.textContent = (subtotal + shippingFee - discount).toLocaleString("vi-VN") + "đ";
}

// Popup thông báo Đã đặt hàng
function checkoutEvent() {
  const checkout_button = document.querySelector(".checkout-button");
  const popup = document.getElementById("submitted-popup");

  checkout_button.addEventListener("click", () => {
    popup.classList.remove("hidden");
    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
      popup.classList.add("hidden");
    }, 5000);

    setTimeout(() => {
      localStorage.clear();
      window.location.href = "index.html";
    }, 2000);
    
  });
}


// Khi load trang
document.addEventListener("DOMContentLoaded", () => {
  const cartItems = JSON.parse(localStorage.getItem("cart-items")) || [];

  if (cartItems.length === 0) {
    window.location.href = "cart-empty.html";
  } else {
    loadCart();
    
    // Khôi phục voucher manual nếu có
    const manualVoucherCode = localStorage.getItem("manual-voucher-code");
    if (manualVoucherCode) {
      const voucherInput = document.getElementById("discount");
      if (voucherInput) {
        voucherInput.value = manualVoucherCode;
      }
      // Bỏ chọn voucher từ list
      document.querySelectorAll('input[name="voucher"]').forEach(input => {
        input.checked = false;
      });
    }
  }
});
