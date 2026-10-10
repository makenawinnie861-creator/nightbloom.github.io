(function () {
  "use strict";

  const C = STUDIO_CONFIG;
  const $ = (sel) => document.querySelector(sel);

  /* ---------- Footer year ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Deposit + Cash App ---------- */
  const depositText = "$" + C.depositAmount;
  $("#depositLabel").textContent = depositText;
  document.querySelectorAll(".js-deposit").forEach((el) => (el.textContent = depositText));
  document.querySelectorAll(".js-cashtag").forEach((el) => (el.textContent = "$" + C.cashTag));
  $("#cashAppBtn").href = "https://cash.app/$" + encodeURIComponent(C.cashTag) + "/" + C.depositAmount;

  /* ---------- 18+ gate ---------- */
  const gate = $("#ageGate");
  let verified = false;
  try { verified = sessionStorage.getItem("ageOk") === "1"; } catch (e) {}
  if (!verified) {
    gate.hidden = false;
    document.body.style.overflow = "hidden";
    $("#gateYes").focus();
  }
  $("#gateYes").addEventListener("click", () => {
    try { sessionStorage.setItem("ageOk", "1"); } catch (e) {}
    gate.hidden = true;
    document.body.style.overflow = "";
  });
  $("#gateNo").addEventListener("click", () => {
    window.location.href = "https://www.google.com";
  });

  /* ---------- Date helpers ---------- */
  const pad = (n) => String(n).padStart(2, "0");
  const toISO = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const parseISO = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const minDate = new Date(today); minDate.setDate(minDate.getDate() + C.minNoticeDays);
  const maxDate = new Date(today); maxDate.setDate(maxDate.getDate() + C.bookingWindowDays);

  const dateInput = $("#date");
  dateInput.min = toISO(minDate);
  dateInput.max = toISO(maxDate);

  const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const openDays = weekdayNames.filter((_, i) => !C.closedWeekdays.includes(i));
  $("#dateHint").textContent = "Open " + openDays.join(", ") + ". Bookings up to " + C.bookingWindowDays + " days ahead.";

  /* ---------- DOB / age ---------- */
  const dobInput = $("#dob");
  const latestDob = new Date(today); latestDob.setFullYear(latestDob.getFullYear() - C.minAge);
  dobInput.max = toISO(latestDob);

  function isAdult(dobStr) {
    if (!dobStr) return false;
    const dob = parseISO(dobStr);
    if (isNaN(dob)) return false;
    return dob <= latestDob;
  }

  /* ---------- Time slots ---------- */
  const slotsEl = $("#slots");

  function dateIsAvailable(str) {
    if (!str) return false;
    const d = parseISO(str);
    if (isNaN(d) || d < minDate || d > maxDate) return false;
    if (C.closedWeekdays.includes(d.getDay())) return false;
    if (C.blockedDates.includes(str)) return false;
    return true;
  }

  function renderSlots() {
    const val = dateInput.value;
    slotsEl.innerHTML = "";
    if (!val) {
      slotsEl.innerHTML = '<span class="slots__empty">Choose a date to see times.</span>';
      return;
    }
    if (!dateIsAvailable(val)) {
      slotsEl.innerHTML = '<span class="slots__empty">We are not available on this date. Please pick another.</span>';
      return;
    }
    const taken = C.bookedSlots[val] || [];
    C.timeSlots.forEach((t) => {
      const label = document.createElement("label");
      label.className = "slot";
      const isTaken = taken.includes(t);
      label.innerHTML =
        '<input type="radio" name="appointment_time" value="' + t + '"' + (isTaken ? " disabled" : "") + " />" +
        "<span>" + t + "</span>";
      slotsEl.appendChild(label);
    });
  }
  dateInput.addEventListener("change", renderSlots);
  renderSlots();

  /* ---------- Validation ---------- */
  const form = $("#bookingForm");
  const statusEl = $("#formStatus");

  function setError(key, msg) {
    const el = document.querySelector('.error[data-for="' + key + '"]');
    if (!el) return;
    el.textContent = msg || "";
    const field = el.closest(".field") || el.parentElement;
    if (field) field.classList.toggle("invalid", !!msg);
  }

  function validate() {
    let ok = true;
    const fail = (key, msg) => { setError(key, msg); ok = false; };
    const clear = (key) => setError(key, "");

    const v = (id) => $("#" + id).value.trim();

    v("name").length < 2 ? fail("name", "Enter your full name.") : clear("name");
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v("email")) ? clear("email") : fail("email", "Enter a valid email address.");
    /^[+()\d\s-]{7,20}$/.test(v("phone")) ? clear("phone") : fail("phone", "Enter a valid phone number.");

    if (!$("#dob").value) fail("dob", "Enter your date of birth.");
    else if (!isAdult($("#dob").value)) fail("dob", "You must be " + C.minAge + " or older to book.");
    else clear("dob");

    v("style") ? clear("style") : fail("style", "Choose a style.");
    v("placement") ? clear("placement") : fail("placement", "Tell us where the tattoo will go.");
    v("idea").length < 10 ? fail("idea", "Describe your idea in a few words.") : clear("idea");

    dateIsAvailable(dateInput.value) ? clear("date") : fail("date", "Pick an available date.");
    document.querySelector('input[name="appointment_time"]:checked') ? clear("slot") : fail("slot", "Pick a time.");

    v("cashapp_name") ? clear("cashapp_name") : fail("cashapp_name", "Enter the name on your Cash App account.");
    $("#paid").checked ? clear("paid") : fail("paid", "Confirm that you sent the deposit.");
    $("#adult").checked ? clear("adult") : fail("adult", "Confirm you are " + C.minAge + " or older.");

    return ok;
  }

  /* ---------- Submit ---------- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.className = "form__status";
    statusEl.textContent = "";

    if (!validate()) {
      statusEl.className = "form__status bad";
      statusEl.textContent = "Please fix the highlighted fields.";
      const firstBad = form.querySelector(".invalid, .error:not(:empty)");
      if (firstBad) firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const btn = $("#submitBtn");
    btn.disabled = true;
    btn.textContent = "Sending...";

    const data = new FormData(form);
    data.append("deposit_amount", depositText);
    data.append("cashapp_tag_paid_to", "$" + C.cashTag);
    data.append("_replyto", $("#email").value.trim());

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      renderSlots();
      statusEl.className = "form__status ok";
      statusEl.textContent = "Request sent. We will confirm your slot by email once we see your deposit.";
    } catch (err) {
      statusEl.className = "form__status bad";
      statusEl.textContent = "Could not send your request. Please try again or email us directly.";
    } finally {
      btn.disabled = false;
      btn.textContent = "Send booking request";
    }
  });
})();
