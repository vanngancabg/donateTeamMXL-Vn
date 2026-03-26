const MEMBERS = [
  {
    id: 'ken-van-ngan',
    displayName: 'Ken (Văn Ngân)',
    realName: 'Nguyễn Văn Ngân',
    role: 'Hỗ trợ tân thủ, quản lý Discord, mod sự kiện.',
    description: 'Hỗ trợ người chơi mới và phụ trách bách khoa toàn thư về MXL.',
    avatar: 'van-ngan.jpg',
    bankName: 'VietinBank',
    accountNumber: '101601626628',
    accountName: 'NGUYEN VAN NGAN',
    defaultInfo: 'Cafe cho VanNgan',
    publicAccount: true,
    links: [
      { label: 'Facebook', url: 'https://www.facebook.com/NguyenVanNgan2018' },
      { label: 'Email', url: 'mailto:vanngancabg@gmail.com' },
      { label: 'Zalo', url: 'https://zalo.me/0936559126' },
      { label: 'Discord', url: 'https://discord.com/users/814485088804143105' }
    ]
  },
  {
    id: 'son-ngoc-son',
    displayName: 'Sơn (Ngọc Sơn)',
    realName: 'Nguyễn Ngọc Sơn',
    role: 'Hỗ trợ tân thủ, xây dựng video hướng dẫn, xây dựng bách khoa toàn thư MXL.',
    description: 'Hỗ trợ người chơi mới, xây dựng video hướng dẫn chơi và phụ trách nội dung bách khoa toàn thư về MXL.',
    avatar: 'ngoc-son.jpg',
    bankName: 'VPBank',
    accountNumber: '123099478',
    accountName: 'NGUYEN NGOC SON',
    defaultInfo: 'Cafe cho NgocSon',
    publicAccount: true,
    links: [
      { label: 'YouTube', url: 'https://www.youtube.com/@realSonNguyen' },
      { label: 'Zalo', url: 'https://zalo.me/0368534210' },
      { label: 'Discord', url: 'https://discord.com/users/481723906710044684' }
    ]
  },
  {
    id: 'lak-tit-hoai-thanh',
    displayName: 'Lắk tít gaming (Hoài Thanh)',
    realName: 'Nguyễn Hoài Thanh',
    role: 'Hỗ trợ tân thủ, Marketing.',
    description: 'Hỗ trợ người chơi mới và livestream game.',
    avatar: 'hoai-thanh.jpg',
    bankName: 'Vietcombank',
    accountNumber: '1027523312',
    accountName: 'NGUYEN HOAI THANH',
    defaultInfo: 'Cafe cho Thanh',
    publicAccount: true,
    links: [
      { label: 'TikTok', url: 'https://www.tiktok.com/@laktitgaming?_r=1&_t=ZS-950ZxoOKDSv' },
      { label: 'Zalo', url: 'https://zalo.me/0935325654' },
      { label: 'Discord', url: 'https://discord.com/users/901870112582287421' },
      { label: 'YouTube', url: 'https://www.youtube.com/@laktitgaming?si=HdQ855WmbsSH6ZGm' }
    ]
  }
];

const TEAM_INFO = {
  teamName: 'Team Hỗ Trợ Cộng Đồng Median XL',
  defaultMemberId: 'ken-van-ngan'
};

const SUPABASE_URL = 'https://mjtfqvmnyhfdgydnvlti.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_7-3VYFlyYd45ii43R0bi7A_5UEDnR20';
const DONATION_TABLE = 'team_donation_logs';

const memberGrid = document.getElementById('memberGrid');
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');
const qrImage = document.getElementById('qrImage');
const qrDownload = document.getElementById('qrDownload');
const popupDonorName = document.getElementById('popupDonorName');
const popupMemberName = document.getElementById('popupMemberName');
const popupAmount = document.getElementById('popupAmount');
const popupInfo = document.getElementById('popupInfo');
const customAmountInput = document.getElementById('customAmount');
const customNameInput = document.getElementById('customName');
const customInfoInput = document.getElementById('customInfo');
const customDonateBtn = document.getElementById('customDonateBtn');
const formattedAmount = document.getElementById('formattedAmount');
const toast = document.getElementById('toast');
const tableBody = document.querySelector('#donateTable tbody');
const lastUpdate = document.getElementById('lastUpdate');
const totalAmount = document.getElementById('totalAmount');
const totalCount = document.getElementById('totalCount');
const topDonor = document.getElementById('topDonor');
const refreshHistoryBtn = document.getElementById('refreshHistoryBtn');

const selectedAvatar = document.getElementById('selectedAvatar');
const selectedDisplayName = document.getElementById('selectedDisplayName');
const selectedRealName = document.getElementById('selectedRealName');
const selectedRole = document.getElementById('selectedRole');
const selectedDescription = document.getElementById('selectedDescription');
const selectedLinks = document.getElementById('selectedLinks');
const selectedBankName = document.getElementById('selectedBankName');
const selectedAccountNumber = document.getElementById('selectedAccountNumber');
const selectedAccountName = document.getElementById('selectedAccountName');

let currentMember = MEMBERS.find((member) => member.id === TEAM_INFO.defaultMemberId) || MEMBERS[0];

function formatMoney(amount) {
  return Number(amount).toLocaleString('vi-VN') + ' VND';
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function animateValue(element, endValue, suffix = '') {
  const safeEnd = Number(endValue) || 0;
  const duration = 700;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(progress * safeEnd);
    element.textContent = value.toLocaleString('vi-VN') + suffix;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = safeEnd.toLocaleString('vi-VN') + suffix;
    }
  }

  requestAnimationFrame(update);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function renderMemberCards() {
  memberGrid.innerHTML = '';

  MEMBERS.forEach((member) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'member-card' + (member.id === currentMember.id ? ' active' : '');
    card.dataset.memberId = member.id;
    card.innerHTML = `
      <img src="${escapeHtml(member.avatar)}" alt="${escapeHtml(member.displayName)}" class="member-card-avatar">
      <div class="member-card-content">
        <h3>${escapeHtml(member.displayName)}</h3>
        <p class="member-card-role">${escapeHtml(member.role)}</p>
        <p class="member-card-description">${escapeHtml(member.description)}</p>
      </div>
    `;
    memberGrid.appendChild(card);
  });
}

function renderSelectedMember() {
  selectedAvatar.src = currentMember.avatar;
  selectedAvatar.alt = currentMember.displayName;
  selectedDisplayName.textContent = currentMember.displayName;
  selectedRealName.textContent = currentMember.realName;
  selectedRole.textContent = currentMember.role;
  selectedDescription.textContent = currentMember.description;
  selectedBankName.textContent = currentMember.bankName;
  selectedAccountNumber.textContent = currentMember.publicAccount ? currentMember.accountNumber : 'Liên hệ team để nhận thông tin';
  selectedAccountName.textContent = currentMember.accountName;
  customInfoInput.placeholder = `Để trống sẽ dùng nội dung mặc định: ${currentMember.defaultInfo}`;

  selectedLinks.innerHTML = '';
  currentMember.links.forEach((link) => {
    const anchor = document.createElement('a');
    anchor.href = link.url;
    anchor.target = link.url.startsWith('mailto:') ? '_self' : '_blank';
    anchor.rel = link.url.startsWith('mailto:') ? '' : 'noopener noreferrer';
    anchor.className = 'member-link';
    anchor.textContent = link.label;
    selectedLinks.appendChild(anchor);
  });

  renderMemberCards();
}

function selectMember(memberId) {
  const found = MEMBERS.find((member) => member.id === memberId);
  if (!found) return;
  currentMember = found;
  renderSelectedMember();
}

function buildTransferInfo(defaultInfo) {
  const typedInfo = customInfoInput.value.trim();
  if (!typedInfo) {
    return defaultInfo;
  }

  const hasVietnameseMarks = /[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i.test(typedInfo);
  if (hasVietnameseMarks) {
    alert('Nội dung chuyển khoản không được có dấu tiếng Việt. Ví dụ đúng: Cafe cho VanNgan');
    return null;
  }

  return typedInfo;
}

async function fetchHistory() {
  const url = `${SUPABASE_URL}/rest/v1/${DONATION_TABLE}?select=id,created_at,name,member_name,amount,info&order=created_at.desc&limit=50`;

  const response = await fetch(url, {
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`
    }
  });

  if (!response.ok) {
    throw new Error('Không tải được lịch sử dùng chung.');
  }

  return response.json();
}

async function insertHistory(entry) {
  const url = `${SUPABASE_URL}/rest/v1/${DONATION_TABLE}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      Prefer: 'return=representation'
    },
    body: JSON.stringify([entry])
  });

  if (!response.ok) {
    throw new Error('Không lưu được dữ liệu lên server.');
  }

  const rows = await response.json();
  return rows[0];
}

async function renderHistory() {
  tableBody.innerHTML = '<tr><td colspan="5">Đang tải dữ liệu...</td></tr>';

  try {
    const history = await fetchHistory();
    tableBody.innerHTML = '';

    if (!history.length) {
      tableBody.innerHTML = '<tr><td colspan="5">Chưa có dữ liệu dùng chung.</td></tr>';
      totalAmount.textContent = '0 VND';
      totalCount.textContent = '0';
      topDonor.textContent = 'Chưa có dữ liệu';
      lastUpdate.textContent = 'Chưa có dữ liệu';
      return;
    }

    const total = history.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const latest = history[0];

    animateValue(totalAmount, total, ' VND');
    totalCount.textContent = String(history.length);
    topDonor.textContent = `${latest.member_name || '---'} · ${formatMoney(latest.amount)}`;
    lastUpdate.textContent = 'Cập nhật: ' + new Date().toLocaleString('vi-VN');

    history.forEach((item) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${new Date(item.created_at).toLocaleString('vi-VN')}</td>
        <td>${escapeHtml(item.name || 'Ẩn danh')}</td>
        <td>${escapeHtml(item.member_name || '---')}</td>
        <td>${formatMoney(item.amount)}</td>
        <td>${escapeHtml(item.info)}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    tableBody.innerHTML = '<tr><td colspan="5">Không tải được dữ liệu dùng chung.</td></tr>';
    totalAmount.textContent = '0 VND';
    totalCount.textContent = '0';
    topDonor.textContent = 'Lỗi tải dữ liệu';
    lastUpdate.textContent = 'Không thể kết nối server';
    showToast('Không tải được dữ liệu dùng chung.');
  }
}

function openPopup(qrLink, donorName, memberName, amount, info) {
  qrImage.src = qrLink;
  qrDownload.href = qrLink;
  popupDonorName.textContent = donorName;
  popupMemberName.textContent = memberName;
  popupAmount.textContent = formatMoney(amount);
  popupInfo.textContent = info;
  popup.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

function closePopup() {
  popup.classList.add('hidden');
  overlay.classList.add('hidden');
  qrImage.src = '';
  qrDownload.href = '#';
  popupDonorName.textContent = '---';
  popupMemberName.textContent = '---';
  popupAmount.textContent = '---';
  popupInfo.textContent = '---';
}

async function createQr(amount) {
  const safeAmount = Number(amount);
  const donorName = customNameInput.value.trim() || 'Ẩn danh';
  const info = buildTransferInfo(currentMember.defaultInfo);

  if (!info) {
    return;
  }

  if (!safeAmount || safeAmount < 10000) {
    alert('Số tiền tối thiểu là 10.000 VND.');
    return;
  }

  const qrLink = `https://img.vietqr.io/image/${currentMember.bankName}-${currentMember.accountNumber}-compact2.jpg?amount=${safeAmount}&addInfo=${encodeURIComponent(info)}&accountName=${encodeURIComponent(currentMember.accountName)}`;

  try {
    await insertHistory({
      name: donorName,
      member_name: currentMember.displayName,
      amount: safeAmount,
      info
    });

    await renderHistory();
    openPopup(qrLink, donorName, currentMember.displayName, safeAmount, info);
  } catch (error) {
    showToast('Không lưu được dữ liệu dùng chung.');
    openPopup(qrLink, donorName, currentMember.displayName, safeAmount, info);
  }
}

function handleCustomDonate() {
  createQr(customAmountInput.value);
}

function updateDonateButtonState() {
  const amount = Number(customAmountInput.value);
  const isValid = amount >= 10000;

  customDonateBtn.disabled = !isValid;
  customDonateBtn.classList.toggle('disabled', !isValid);
}

function updateFormattedAmount() {
  const value = customAmountInput.value;
  formattedAmount.textContent = value ? formatMoney(value) : '';
  updateDonateButtonState();
}

async function copyAccountNumber() {
  if (!currentMember.publicAccount) {
    showToast('Thành viên này không hiển thị công khai số tài khoản.');
    return;
  }

  try {
    await navigator.clipboard.writeText(currentMember.accountNumber);
    showToast(`Đã copy số tài khoản của ${currentMember.displayName}!`);
  } catch (error) {
    showToast('Không copy tự động được. Hãy copy thủ công nhé.');
  }
}

function registerEvents() {
  const amountButtons = document.querySelectorAll('.donate-buttons button');

  amountButtons.forEach((button) => {
    button.addEventListener('click', () => {
      amountButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      customAmountInput.value = button.dataset.amount;
      updateFormattedAmount();
      customAmountInput.focus();
    });
  });

  memberGrid.addEventListener('click', (event) => {
    const target = event.target.closest('.member-card');
    if (!target) return;
    selectMember(target.dataset.memberId);
  });

  document.getElementById('customDonateBtn').addEventListener('click', handleCustomDonate);
  document.getElementById('copyAccountBtn').addEventListener('click', copyAccountNumber);
  document.getElementById('closePopupBtn').addEventListener('click', closePopup);
  refreshHistoryBtn.addEventListener('click', renderHistory);
  overlay.addEventListener('click', closePopup);

  customAmountInput.addEventListener('input', () => {
    amountButtons.forEach((item) => item.classList.remove('active'));
    updateFormattedAmount();
  });

  customInfoInput.addEventListener('input', updateDonateButtonState);
  customNameInput.addEventListener('input', updateDonateButtonState);
}

renderSelectedMember();
registerEvents();
renderHistory();
updateFormattedAmount();
updateDonateButtonState();
