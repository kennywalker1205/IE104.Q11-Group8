// Load cart items từ localStorage
function loadCart() {
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartItems = JSON.parse(localStorage.getItem("cart-items")) || [];
  cartItemsContainer.innerHTML = "";

  cartItems.forEach((item) => {
    console.log("Thêm sản phẩm vào DOM:", item.name, "Size:", item.size, "Số lượng:", item.quantity); //Check trạng thái
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.setAttribute("data-id", item.id); // Lưu id sản phẩm để xử lý tăng/giảm số lượng
    itemDiv.setAttribute("data-size", item.size); // Lưu size nếu có

    // Nếu sản phẩm có size thì hiển thị size
    if (item.size) {
      itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="item-details">
        <h3>${item.name}</h3>
        <p class="price">${item.price.toLocaleString("vi-VN")}đ</p>
        <p class="size">Size: ${item.size}</p>
        <div class="quantity">
            <div class="quantity-controls">
                <button type="button" class="quantity-btn minus">-</button>
                <input type="number" name="quantity" class="quantity-input" value="${
                  item.quantity
                }" min="1" readonly />
                <button type="button" class="quantity-btn plus">+</button>
            </div>
        </div>
      </div>
      <button class="delete-item-btn"><i class="fa-solid fa-trash"></i></button>
    `;
    } else {
      // Sản phẩm không có size
      itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="item-details">
        <h3>${item.name}</h3>
        <p class="price">${item.price.toLocaleString("vi-VN")}đ</p>
        <div class="quantity">
            <div class="quantity-controls">
                <button type="button" class="quantity-btn minus">-</button>
                <input type="number" name="quantity" class="quantity-input" value="${
                  item.quantity
                }" min="1" readonly />
                <button type="button" class="quantity-btn plus">+</button>
            </div>
        </div>
      </div>
      <button class="delete-item-btn"><i class="fa-solid fa-trash"></i></button>
    `;
    }

    cartItemsContainer.appendChild(itemDiv);
  });

  attachCartEvents(); // Gắn sự kiện cho +, -, delete
  checkoutEvent(); // Gắn sự kiện thanh toán
  updateCartCount(); // Cập nhật số lượng giỏ hàng trên header
  updateCartTotal(); // Cập nhật tổng tiền
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

    // Nút tăng số lượng
    plusBtn.addEventListener("click", () => {
      const index = cartItems.findIndex((item) => {
        if (item.size) {
          return item.id === id && item.size === size;
        }
        return item.id === id;
      });
      if (index >= 0) {
        cartItems[index].quantity += 1;
        qtyInput.value = cartItems[index].quantity; // Cập nhật input
        console.log("Tăng số lượng sản phẩm:", cartItems[index].quantity, cartItems[index].name);
        saveCart(cartItems); // Lưu vào localStorage
      }
    });

    // Nút giảm số lượng
    minusBtn.addEventListener("click", () => {
      const index = cartItems.findIndex((item) => {
        if (item.size) {
          return item.id === id && item.size === size;
        }
        return item.id === id;
      });
      if (index >= 0) {
        cartItems[index].quantity -= 1;
        console.log("Giảm số lượng sản phẩm:", cartItems[index].quantity, cartItems[index].name);
        if (cartItems[index].quantity == 0) {
          console.log("Sản phẩm bị xóa");
          cartItems.splice(index, 1); // Xóa sản phẩm nếu quantity = 0
          saveCart(cartItems);
          itemDiv.remove();
          location.reload(); // Load lại trang để cập nhật cart UI
        }
        qtyInput.value = cartItems[index].quantity;
        saveCart(cartItems);
      }
    });

    // Nút xóa sản phẩm
    deleteBtn.addEventListener("click", () => {
      const index = cartItems.findIndex((item) => {
        if (item.size) {
          return item.id === id && item.size === size;
        }
        return item.id === id;
      });
      if (index >= 0) {
        console.log("Xóa sản phẩm:", cartItems[index].name);
        cartItems.splice(index, 1); // Xóa item khỏi mảng
        saveCart(cartItems);
        itemDiv.remove(); // Xóa phần tử khỏi DOM
        location.reload();
      }
    });
  });

  // Xử lý khi chọn voucher từ danh sách
  document.querySelectorAll('input[name="voucher"]').forEach((input) => {
    input.addEventListener("change", () => {
      // Khi chọn voucher từ list, xóa voucher manual
      console.log("Áp dụng Voucher gợi ý:", input.value);
      localStorage.removeItem("manual-voucher-code");
      updateCartTotal(); // Cập nhật lại tổng tiền
    });
  });

  // Xử lý nút áp dụng voucher từ input
  const applyVoucherBtn = document.getElementById("apply-voucher-btn");
  const voucherInput = document.getElementById("discount");
  const voucherError = document.querySelector(".voucher-error");

  // Hàm xử lý áp dụng voucher
  const applyVoucher = () => {
    const code = voucherInput.value.trim();
    console.log("Áp dụng voucher:", code);

    if (code === "") {
      // Nếu input rỗng, xóa voucher manual
      localStorage.removeItem("manual-voucher-code");
      voucherError.style.display = "none";
      updateCartTotal();
      console.log("Voucher input rỗng, bỏ áp dụng");
      return;
    }

    if (isValidVoucher(code)) {
      // Voucher hợp lệ
      console.log("Voucher hợp lệ!"); //Check voucher
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
      console.log("Voucher không hợp lệ!");
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

  updateCartTotal(); // Cập nhật tổng tiền sau khi lưu
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

  switch (code.toUpperCase()) {
    case "WELCOME2025":
      discount = subtotal * 0.1;
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

  cartItems.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  const shippingFee = 30000;

  // Kiểm tra voucher từ input hoặc từ list
  const manualVoucherCode = localStorage.getItem("manual-voucher-code");
  const selectedVoucher = document.querySelector(
    'input[name="voucher"]:checked'
  );
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

  if (subtotalElem)
    subtotalElem.textContent = subtotal.toLocaleString("vi-VN") + "đ";
  if (shippingElem)
    shippingElem.textContent = shippingFee.toLocaleString("vi-VN") + "đ";

  // Hiển thị dòng giảm giá nếu có
  if (discount > 0) {
    if (discountRow) discountRow.style.display = "flex";
    if (discountAmount)
      discountAmount.textContent = "-" + discount.toLocaleString("vi-VN") + "đ";
  } else {
    if (discountRow) discountRow.style.display = "none";
  }

  if (totalElem)
    totalElem.textContent =
      (subtotal + shippingFee - discount).toLocaleString("vi-VN") + "đ";
}

// Popup thông báo Đã đặt hàng
function checkoutEvent() {
  const checkout_button = document.querySelector(".checkout-button");
  const popup = document.getElementById("submitted-popup");

  checkout_button.addEventListener("click", () => {
    console.log("Đã nhấn nút thanh toán");
    popup.classList.remove("hidden");
    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
      popup.classList.add("hidden");
    }, 5000);

    setTimeout(() => {
      localStorage.clear(); // Xóa giỏ hàng sau khi đặt
      console.log("Giỏ hàng đã được xóa sau khi thanh toán"); //Check trạng thái
      window.location.href = "index.html";
    }, 2000);
  });
}

// Khi load trang
document.addEventListener("DOMContentLoaded", () => {
  const cartItems = JSON.parse(localStorage.getItem("cart-items")) || [];

  if (cartItems.length === 0) {
    // Nếu giỏ hàng trống, chuyển sang trang cart-empty
    console.log("Giỏ hàng trống, chuyển sang cart-empty.html");
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
      document.querySelectorAll('input[name="voucher"]').forEach((input) => {
        input.checked = false;
      });
    }
  }
});
