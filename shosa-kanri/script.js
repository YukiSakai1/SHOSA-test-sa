// Sample user data
const userData = [
    {
        id: '0001',
        name: 'Nguyen Van A',
        progress: 85,
        lastLogin: '2023/05/17 10:00',
        playTime: 2.5,
        country: 'ベトナム',
        painPoints: ['level:DAY2-イベント3', 'boss:ボス戦'],
        status: 'active',
        chapters: {
            chapter1: 100,
            chapter2: 85,
            chapter3: 70
        },
        minitest: {
            chapter1: { correct: 8, total: 10, lastDate: '2023/05/15' },
            chapter2: { correct: 7, total: 10, lastDate: '2023/05/16' },
            chapter3: { correct: 6, total: 10, lastDate: '2023/05/17' }
        },
        test: {
            chapter1: { passed: true, score: 85, lastDate: '2023/05/15' },
            chapter2: { passed: true, score: 80, lastDate: '2023/05/16' },
            chapter3: { passed: false, score: 60, lastDate: '2023/05/17' }
        }
    },
    {
        id: '0002',
        name: 'Li Wei',
        progress: 45,
        lastLogin: '2023/05/16 15:30',
        playTime: 1.8,
        country: '中国',
        painPoints: ['quest:クエスト12'],
        status: 'active',
        chapters: {
            chapter1: 100,
            chapter2: 80,
            chapter3: 0
        },
        minitest: {
            chapter1: { correct: 9, total: 10, lastDate: '2023/05/14' },
            chapter2: { correct: 8, total: 10, lastDate: '2023/05/15' },
            chapter3: { correct: 0, total: 0, lastDate: '-' }
        },
        test: {
            chapter1: { passed: true, score: 90, lastDate: '2023/05/14' },
            chapter2: { passed: true, score: 85, lastDate: '2023/05/15' },
            chapter3: { passed: false, score: 0, lastDate: '-' }
        }
    },
    {
        id: '0003',
        name: 'Maria Santos',
        progress: 92,
        lastLogin: '2023/05/17 09:45',
        playTime: 3.2,
        country: 'フィリピン',
        painPoints: [],
        status: 'active',
        chapters: {
            chapter1: 100,
            chapter2: 100,
            chapter3: 100
        },
        minitest: {
            chapter1: { correct: 10, total: 10, lastDate: '2023/05/10' },
            chapter2: { correct: 9, total: 10, lastDate: '2023/05/12' },
            chapter3: { correct: 10, total: 10, lastDate: '2023/05/14' }
        },
        test: {
            chapter1: { passed: true, score: 95, lastDate: '2023/05/10' },
            chapter2: { passed: true, score: 92, lastDate: '2023/05/12' },
            chapter3: { passed: true, score: 88, lastDate: '2023/05/14' }
        }
    },
    {
        id: '0004',
        name: 'Raj Sharma',
        progress: 15,
        lastLogin: '2023/05/10 14:20',
        playTime: 0.5,
        country: 'ネパール',
        painPoints: ['level:DAY1-イベント5', 'quest:ヒアリング'],
        status: 'churned',
        chapters: {
            chapter1: 60,
            chapter2: 0,
            chapter3: 0
        },
        minitest: {
            chapter1: { correct: 5, total: 10, lastDate: '2023/05/08' },
            chapter2: { correct: 0, total: 0, lastDate: '-' },
            chapter3: { correct: 0, total: 0, lastDate: '-' }
        },
        test: {
            chapter1: { passed: false, score: 55, lastDate: '2023/05/08' },
            chapter2: { passed: false, score: 0, lastDate: '-' },
            chapter3: { passed: false, score: 0, lastDate: '-' }
        }
    },
    {
        id: '0005',
        name: '山田 太郎',
        progress: 60,
        lastLogin: '2023/05/15 11:00',
        playTime: 1.2,
        country: '日本',
        painPoints: ['level:DAY3-イベント2'],
        status: 'inactive',
        chapters: {
            chapter1: 100,
            chapter2: 100,
            chapter3: 20
        },
        minitest: {
            chapter1: { correct: 9, total: 10, lastDate: '2023/05/10' },
            chapter2: { correct: 8, total: 10, lastDate: '2023/05/12' },
            chapter3: { correct: 4, total: 10, lastDate: '2023/05/14' }
        },
        test: {
            chapter1: { passed: true, score: 88, lastDate: '2023/05/10' },
            chapter2: { passed: true, score: 82, lastDate: '2023/05/12' },
            chapter3: { passed: false, score: 45, lastDate: '2023/05/14' }
        }
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderTable(userData);
    updateStats();
    updateDashboardStats();
    renderChurnTable();
    renderRegionStats();
    renderProgressAnalysis();
    setupEventListeners();
    setupTableSorting();
});

// Render the table with data
function renderTable(data) {
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '';

    data.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox"></td>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${user.progress}%; background-color: ${getProgressColor(user.progress)}"></div>
                </div>
                <span style="font-size: 12px; margin-left: 8px;">${user.progress}%</span>
            </td>
            <td>${renderChapterProgress(user.chapters?.chapter1 || 0)}</td>
            <td>${renderChapterProgress(user.chapters?.chapter2 || 0)}</td>
            <td>${renderChapterProgress(user.chapters?.chapter3 || 0)}</td>
            <td>${user.lastLogin}</td>
            <td>${user.playTime}時間</td>
            <td>${user.country}</td>
            <td>${renderPainPoints(user.painPoints)}</td>
            <td><span class="status-badge ${user.status}">${getStatusText(user.status)}</span></td>
            <td><button class="detail-btn" onclick="showDetail('${user.id}')">詳細</button></td>
        `;
        tbody.appendChild(row);
    });

    updatePaginationInfo(data.length);
}

// Render chapter progress as a mini progress bar
function renderChapterProgress(progress) {
    const color = progress === 100 ? '#27ae60' : (progress >= 50 ? '#f39c12' : '#e74c3c');
    return `
        <div class="chapter-progress-bar">
            <div class="chapter-progress-fill" style="width: ${progress}%; background-color: ${color}"></div>
        </div>
        <span style="font-size: 11px; margin-left: 5px;">${progress}%</span>
    `;
}

// Get progress bar color based on percentage
function getProgressColor(progress) {
    if (progress >= 80) return '#27ae60';
    if (progress >= 50) return '#f39c12';
    return '#e74c3c';
}

// Render pain points as badges
function renderPainPoints(painPoints, userId = null) {
    if (painPoints.length === 0) {
        return '<span style="color: #999; font-size: 12px;">なし</span>';
    }

    return painPoints.map((point, index) => {
        const [type, text] = point.split(':');
        const deleteBtn = userId ? `<button onclick="removePainPoint('${userId}', ${index})" style="background: none; border: none; color: #999; cursor: pointer; margin-left: 5px; font-size: 12px;">×</button>` : '';
        return `<span class="pain-point ${type}">${text}${deleteBtn}</span>`;
    }).join('');
}

// Get status text in Japanese
function getStatusText(status) {
    const statusMap = {
        'active': '継続中',
        'inactive': '休止中',
        'churned': '学習中止'
    };
    return statusMap[status] || status;
}

// Update stats based on current data
function updateStats() {
    const churnedCount = userData.filter(u => u.status === 'churned').length;
    const activeCount = userData.filter(u => u.status === 'active').length;
    const inactiveCount = userData.filter(u => u.status === 'inactive').length;
    const avgProgress = (userData.reduce((sum, u) => sum + u.progress, 0) / userData.length).toFixed(1);
    const painPointCount = userData.reduce((sum, u) => sum + u.painPoints.length, 0);

    document.getElementById('churnedCount').textContent = churnedCount;
    document.getElementById('activeCount').textContent = activeCount;
    document.getElementById('inactiveCount').textContent = inactiveCount;
    document.getElementById('avgProgress').textContent = avgProgress + '%';
    document.getElementById('painPointCount').textContent = painPointCount;
}

// Update pagination info
function updatePaginationInfo(total) {
    const showingInfo = document.getElementById('showingInfo');
    showingInfo.textContent = `全${total}件`;
}

// Setup event listeners
function setupEventListeners() {
    // Search input (only on users page)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterData);
    }

    // Country filter (only on users page)
    const countryFilter = document.getElementById('countryFilter');
    if (countryFilter) {
        countryFilter.addEventListener('change', filterData);
    }

    // Status filter (only on users page)
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterData);
    }

    // Date filters (only on users page)
    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');
    if (dateFrom) {
        dateFrom.addEventListener('change', filterData);
    }
    if (dateTo) {
        dateTo.addEventListener('change', filterData);
    }

    // Select all checkbox (only on users page)
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.row-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }

    // Row checkbox click for highlighting
    document.getElementById('userTableBody').addEventListener('change', function(e) {
        if (e.target.classList.contains('row-checkbox')) {
            const row = e.target.closest('tr');
            if (e.target.checked) {
                row.classList.add('selected');
            } else {
                row.classList.remove('selected');
            }
        }
    });

    // Close modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    document.getElementById('detailModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Sidebar navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');

            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Switch page
            switchPage(page);
        });
    });

    // Export button (only on users page)
    const exportBtn = document.querySelector('#page-users .btn-white');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            const csvContent = "data:text/csv;charset=utf-8," +
                "ID,学習者名,完了レッスン率,最終学習日,学習時間,出身国,ステータス,1章進捗,2章進捗,3章進捗,4章進捗\n" +
                userData.map(u => `${u.id},${u.name},${u.progress}%,${u.lastLogin},${u.playTime}時間,${u.country},${getStatusText(u.status)},${u.chapters?.chapter1 || 0}%,${u.chapters?.chapter2 || 0}%,${u.chapters?.chapter3 || 0}%,${u.chapters?.chapter4 || 0}%`).join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "learner_data.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // New user button (only on users page)
    const newUserBtn = document.querySelector('#page-users .btn-purple');
    if (newUserBtn) {
        newUserBtn.addEventListener('click', function() {
            const newId = String(userData.length + 1).padStart(4, '0');
            const newUserName = prompt('新しい学習者名を入力してください:');
            if (newUserName) {
                const newUser = {
                    id: newId,
                    name: newUserName,
                    progress: 0,
                    lastLogin: new Date().toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
                    playTime: 0,
                    country: 'その他',
                    painPoints: [],
                    status: 'active',
                    chapters: {
                        chapter1: 0,
                        chapter2: 0,
                        chapter3: 0,
                        chapter4: 0
                    },
                    minitest: {
                        chapter1: { correct: 0, total: 0, lastDate: '-' },
                        chapter2: { correct: 0, total: 0, lastDate: '-' },
                        chapter3: { correct: 0, total: 0, lastDate: '-' },
                        chapter4: { correct: 0, total: 0, lastDate: '-' }
                    },
                    test: {
                        chapter1: { passed: false, score: 0, lastDate: '-' },
                        chapter2: { passed: false, score: 0, lastDate: '-' },
                        chapter3: { passed: false, score: 0, lastDate: '-' },
                        chapter4: { passed: false, score: 0, lastDate: '-' }
                    }
                };
                userData.push(newUser);
                renderTable(userData);
                updateStats();
                updateDashboardStats();
                renderChurnTable();
                renderRegionStats();
                renderProgressAnalysis();
                showToast('学習者を追加しました: ' + newUserName, 'success');
            }
        });
    }
}

// Filter data based on search and filters
function filterData() {
    const searchInput = document.getElementById('searchInput');
    const countryFilter = document.getElementById('countryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');

    if (!searchInput || !countryFilter || !statusFilter) return;

    const searchTerm = searchInput.value.toLowerCase();
    const countryValue = countryFilter.value;
    const statusValue = statusFilter.value;

    const filteredData = userData.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) ||
                             user.id.includes(searchTerm);
        const matchesCountry = countryValue === '' || user.country === countryValue;
        const matchesStatus = statusValue === '' || user.status === statusValue;

        let matchesDate = true;
        if (dateFrom && dateFrom.value) {
            const userDate = new Date(user.lastLogin);
            const fromDate = new Date(dateFrom.value);
            matchesDate = matchesDate && userDate >= fromDate;
        }
        if (dateTo && dateTo.value) {
            const userDate = new Date(user.lastLogin);
            const toDate = new Date(dateTo.value);
            matchesDate = matchesDate && userDate <= toDate;
        }

        return matchesSearch && matchesCountry && matchesStatus && matchesDate;
    });

    renderTable(filteredData);
    updateStatsForFiltered(filteredData);
}

// Update stats for filtered data
function updateStatsForFiltered(data) {
    if (data.length === 0) {
        document.getElementById('churnedCount').textContent = '0';
        document.getElementById('activeCount').textContent = '0';
        document.getElementById('inactiveCount').textContent = '0';
        document.getElementById('avgProgress').textContent = '0%';
        document.getElementById('painPointCount').textContent = '0';
        return;
    }

    const churnedCount = data.filter(u => u.status === 'churned').length;
    const activeCount = data.filter(u => u.status === 'active').length;
    const inactiveCount = data.filter(u => u.status === 'inactive').length;
    const avgProgress = (data.reduce((sum, u) => sum + u.progress, 0) / data.length).toFixed(1);
    const painPointCount = data.reduce((sum, u) => sum + u.painPoints.length, 0);

    document.getElementById('churnedCount').textContent = churnedCount;
    document.getElementById('activeCount').textContent = activeCount;
    document.getElementById('inactiveCount').textContent = inactiveCount;
    document.getElementById('avgProgress').textContent = avgProgress + '%';
    document.getElementById('painPointCount').textContent = painPointCount;
}

// Show user detail modal
function showDetail(userId) {
    const user = userData.find(u => u.id === userId);
    if (!user) return;

    const modalContent = document.querySelector('.modal-content');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <div class="modal-info-row">
            <div class="modal-info-label">学習者ID</div>
            <div class="modal-info-value">${user.id}</div>
        </div>
        <div class="modal-info-row">
            <div class="modal-info-label">学習者名</div>
            <div class="modal-info-value">
                <input type="text" id="editName" value="${user.name}">
            </div>
        </div>
        <div class="modal-info-row">
            <div class="modal-info-label">完了レッスン率</div>
            <div class="modal-info-value">
                <input type="number" id="editProgress" value="${user.progress}" min="0" max="100" style="width: 100px;">
                <span style="margin-left: 10px;">%</span>
            </div>
        </div>
        <div class="modal-info-row">
            <div class="modal-info-label">章別進捗</div>
            <div class="modal-info-value">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                    <div>
                        <label style="font-size: 12px; color: #666;">1章</label>
                        <input type="number" id="editChapter1" value="${user.chapters?.chapter1 || 0}" min="0" max="100" style="width: 60px; padding: 6px;">
                        <span style="font-size: 12px;">%</span>
                    </div>
                    <div>
                        <label style="font-size: 12px; color: #666;">2章</label>
                        <input type="number" id="editChapter2" value="${user.chapters?.chapter2 || 0}" min="0" max="100" style="width: 60px; padding: 6px;">
                        <span style="font-size: 12px;">%</span>
                    </div>
                    <div>
                        <label style="font-size: 12px; color: #666;">3章</label>
                        <input type="number" id="editChapter3" value="${user.chapters?.chapter3 || 0}" min="0" max="100" style="width: 60px; padding: 6px;">
                        <span style="font-size: 12px;">%</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-info-row">
            <div class="modal-info-label">小テスト結果</div>
            <div class="modal-info-value">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                    <div>
                        <label style="font-size: 12px; color: #666;">1章</label>
                        <span style="font-size: 13px;">${renderMiniTestScore(user.minitest?.chapter1 || { correct: 0, total: 0 })}</span>
                    </div>
                    <div>
                        <label style="font-size: 12px; color: #666;">2章</label>
                        <span style="font-size: 13px;">${renderMiniTestScore(user.minitest?.chapter2 || { correct: 0, total: 0 })}</span>
                    </div>
                    <div>
                        <label style="font-size: 12px; color: #666;">3章</label>
                        <span style="font-size: 13px;">${renderMiniTestScore(user.minitest?.chapter3 || { correct: 0, total: 0 })}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-info-row">
            <div class="modal-info-label">テスト結果</div>
            <div class="modal-info-value">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                    <div>
                        <label style="font-size: 12px; color: #666;">1章</label>
                        <span style="font-size: 13px;">${renderTestScore(user.test?.chapter1 || { score: 0, passed: false })}</span>
                    </div>
                    <div>
                        <label style="font-size: 12px; color: #666;">2章</label>
                        <span style="font-size: 13px;">${renderTestScore(user.test?.chapter2 || { score: 0, passed: false })}</span>
                    </div>
                    <div>
                        <label style="font-size: 12px; color: #666;">3章</label>
                        <span style="font-size: 13px;">${renderTestScore(user.test?.chapter3 || { score: 0, passed: false })}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-info-row">
            <div class="modal-info-label">1日平均学習時間</div>
            <div class="modal-info-value">
                <input type="number" id="editPlayTime" value="${user.playTime}" min="0" step="0.1" style="width: 100px;">
                <span style="margin-left: 10px;">時間</span>
            </div>
        </div>
        <div class="modal-info-row">
            <div class="modal-info-label">出身国</div>
            <div class="modal-info-value">
                <select id="editCountry">
                    <option value="日本" ${user.country === '日本' ? 'selected' : ''}>日本</option>
                    <option value="中国" ${user.country === '中国' ? 'selected' : ''}>中国</option>
                    <option value="ベトナム" ${user.country === 'ベトナム' ? 'selected' : ''}>ベトナム</option>
                    <option value="フィリピン" ${user.country === 'フィリピン' ? 'selected' : ''}>フィリピン</option>
                    <option value="ネパール" ${user.country === 'ネパール' ? 'selected' : ''}>ネパール</option>
                    <option value="インドネシア" ${user.country === 'インドネシア' ? 'selected' : ''}>インドネシア</option>
                    <option value="ミャンマー" ${user.country === 'ミャンマー' ? 'selected' : ''}>ミャンマー</option>
                    <option value="韓国" ${user.country === '韓国' ? 'selected' : ''}>韓国</option>
                    <option value="その他" ${user.country === 'その他' ? 'selected' : ''}>その他</option>
                </select>
            </div>
        </div>
        <div class="modal-info-row">
            <div class="modal-info-label">ステータス</div>
            <div class="modal-info-value">
                <select id="editStatus">
                    <option value="active" ${user.status === 'active' ? 'selected' : ''}>継続中</option>
                    <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>休止中</option>
                    <option value="churned" ${user.status === 'churned' ? 'selected' : ''}>学習中止</option>
                </select>
            </div>
        </div>
        <div class="modal-info-row">
            <div class="modal-info-label">つまずきポイント</div>
            <div class="modal-info-value">
                <div id="painPointsList">${user.painPoints.length > 0 ? renderPainPoints(user.painPoints, user.id) : 'なし'}</div>
                <div style="margin-top: 10px;">
                    <select id="newPainPointType" style="padding: 6px; margin-right: 5px;">
                        <option value="level">レベル</option>
                        <option value="boss">ボス戦</option>
                        <option value="quest">クエスト</option>
                    </select>
                    <input type="text" id="newPainPointText" placeholder="例: DAY2-イベント3" style="padding: 6px; width: 150px;">
                    <button class="btn btn-purple" onclick="addPainPoint('${user.id}')" style="padding: 6px 12px; font-size: 12px;">追加</button>
                </div>
            </div>
        </div>
        <div class="modal-info-row">
            <div class="modal-info-label">最終学習日</div>
            <div class="modal-info-value">${user.lastLogin}</div>
        </div>
    `;

    // Add footer with buttons
    const existingFooter = modalContent.querySelector('.modal-footer');
    if (existingFooter) {
        existingFooter.remove();
    }

    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    footer.innerHTML = `
        <button class="btn btn-delete" onclick="deleteUser('${user.id}')">削除</button>
        <button class="btn btn-save" onclick="saveUser('${user.id}')">保存</button>
    `;
    modalContent.appendChild(footer);

    document.getElementById('detailModal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
    const footer = document.querySelector('.modal-footer');
    if (footer) {
        footer.remove();
    }
}

// Save user changes
function saveUser(userId) {
    const user = userData.find(u => u.id === userId);
    if (!user) return;

    user.name = document.getElementById('editName').value;
    user.progress = parseInt(document.getElementById('editProgress').value);
    user.playTime = parseFloat(document.getElementById('editPlayTime').value);
    user.country = document.getElementById('editCountry').value;
    user.status = document.getElementById('editStatus').value;

    // Save chapter progress
    if (!user.chapters) {
        user.chapters = {};
    }
    user.chapters.chapter1 = parseInt(document.getElementById('editChapter1').value) || 0;
    user.chapters.chapter2 = parseInt(document.getElementById('editChapter2').value) || 0;
    user.chapters.chapter3 = parseInt(document.getElementById('editChapter3').value) || 0;
    user.chapters.chapter4 = parseInt(document.getElementById('editChapter4').value) || 0;

    renderTable(userData);
    updateStats();
    updateDashboardStats();
    renderChurnTable();
    renderRegionStats();
    renderProgressAnalysis();
    closeModal();
    showToast('学習者情報を保存しました', 'success');
}

// Delete user
function deleteUser(userId) {
    if (confirm('このユーザーを削除してもよろしいですか？')) {
        const index = userData.findIndex(u => u.id === userId);
        if (index > -1) {
            userData.splice(index, 1);
            renderTable(userData);
            updateStats();
            updateDashboardStats();
            renderChurnTable();
            renderRegionStats();
            renderProgressAnalysis();
            closeModal();
            showToast('ユーザーを削除しました', 'success');
        }
    }
}

// Add pain point
function addPainPoint(userId) {
    const user = userData.find(u => u.id === userId);
    if (!user) return;

    const type = document.getElementById('newPainPointType').value;
    const text = document.getElementById('newPainPointText').value;

    if (!text.trim()) {
        showToast('つまずきポイントを入力してください', 'warning');
        return;
    }

    user.painPoints.push(`${type}:${text}`);
    document.getElementById('newPainPointText').value = '';

    // Update the pain points display in modal
    const painPointsList = document.getElementById('painPointsList');
    painPointsList.innerHTML = user.painPoints.length > 0 ? renderPainPoints(user.painPoints, userId) : 'なし';

    // Update table and stats
    renderTable(userData);
    updateStats();
    renderChurnTable();
    renderProgressAnalysis();
    showToast('つまずきポイントを追加しました', 'success');
}

// Remove pain point
function removePainPoint(userId, index) {
    const user = userData.find(u => u.id === userId);
    if (!user) return;

    user.painPoints.splice(index, 1);

    // Update the pain points display in modal
    const painPointsList = document.getElementById('painPointsList');
    painPointsList.innerHTML = user.painPoints.length > 0 ? renderPainPoints(user.painPoints, userId) : 'なし';

    // Update table and stats
    renderTable(userData);
    updateStats();
    renderChurnTable();
}

// Switch page
function switchPage(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => page.style.display = 'none');

    // Show selected page
    const selectedPage = document.getElementById(`page-${pageName}`);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }

    // Update page-specific data
    if (pageName === 'dashboard') {
        updateDashboardStats();
    } else if (pageName === 'churn') {
        renderChurnTable();
    } else if (pageName === 'region') {
        renderRegionStats();
    } else if (pageName === 'progress') {
        renderProgressAnalysis();
    } else if (pageName === 'minitest') {
        renderMiniTestAnalysis();
    } else if (pageName === 'test') {
        renderTestAnalysis();
    }
}

// Update dashboard stats
function updateDashboardStats() {
    document.getElementById('totalUsers').textContent = userData.length;
    document.getElementById('dashboardActiveCount').textContent = userData.filter(u => u.status === 'active').length;
    document.getElementById('dashboardChurnedCount').textContent = userData.filter(u => u.status === 'churned').length;
}

// Render churn table
function renderChurnTable() {
    const tbody = document.getElementById('churnTableBody');
    tbody.innerHTML = '';

    const churnedUsers = userData.filter(u => u.status === 'churned');
    const lowProgressUsers = userData.filter(u => u.progress < 30 && u.status !== 'churned');

    const allChurnRisks = [...churnedUsers, ...lowProgressUsers];

    allChurnRisks.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.status === 'churned' ? '離脱済み' : '進捗率低（' + user.progress + '%）'}</td>
            <td>${user.painPoints.length > 0 ? renderPainPoints(user.painPoints) : 'なし'}</td>
            <td>${user.lastLogin}</td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('churnPageChurnedCount').textContent = churnedUsers.length;
    document.getElementById('churnPagePainPointCount').textContent = allChurnRisks.reduce((sum, u) => sum + u.painPoints.length, 0);
}

// Render region stats
function renderRegionStats() {
    const countries = {};
    userData.forEach(user => {
        if (!countries[user.country]) {
            countries[user.country] = {
                count: 0,
                totalProgress: 0,
                totalPlayTime: 0
            };
        }
        countries[user.country].count++;
        countries[user.country].totalProgress += user.progress;
        countries[user.country].totalPlayTime += user.playTime;
    });

    const statsContainer = document.getElementById('regionStats');
    statsContainer.innerHTML = '';

    Object.keys(countries).forEach(country => {
        const data = countries[country];
        const avgProgress = (data.totalProgress / data.count).toFixed(1);
        const avgPlayTime = (data.totalPlayTime / data.count).toFixed(1);

        const statCard = document.createElement('div');
        statCard.className = 'stat-card stat-success';
        statCard.innerHTML = `
            <div class="stat-value">${data.count}</div>
            <div class="stat-label">${country}</div>
        `;
        statsContainer.appendChild(statCard);
    });

    const tbody = document.getElementById('regionTableBody');
    tbody.innerHTML = '';

    Object.keys(countries).forEach(country => {
        const data = countries[country];
        const avgProgress = (data.totalProgress / data.count).toFixed(1);
        const avgPlayTime = (data.totalPlayTime / data.count).toFixed(1);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${country}</td>
            <td>${data.count}人</td>
            <td>${avgProgress}%</td>
            <td>${avgPlayTime}時間</td>
        `;
        tbody.appendChild(row);
    });
}

// Render progress analysis
function renderProgressAnalysis() {
    const ranges = {
        '0-25': 0,
        '26-50': 0,
        '51-75': 0,
        '76-100': 0
    };

    userData.forEach(user => {
        if (user.progress <= 25) ranges['0-25']++;
        else if (user.progress <= 50) ranges['26-50']++;
        else if (user.progress <= 75) ranges['51-75']++;
        else ranges['76-100']++;
    });

    document.getElementById('progress0-25').textContent = ranges['0-25'];
    document.getElementById('progress26-50').textContent = ranges['26-50'];
    document.getElementById('progress51-75').textContent = ranges['51-75'];
    document.getElementById('progress76-100').textContent = ranges['76-100'];

    // Render chart
    const chartContainer = document.getElementById('progressChart');
    chartContainer.innerHTML = '';

    const maxCount = Math.max(...Object.values(ranges));

    Object.keys(ranges).forEach(range => {
        const count = ranges[range];
        const height = maxCount > 0 ? (count / maxCount) * 150 : 0;

        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = height + 'px';
        bar.innerHTML = `
            <span class="chart-bar-value">${count}</span>
            <span class="chart-bar-label">${range}%</span>
        `;
        chartContainer.appendChild(bar);
    });

    // Render chapter progress chart
    const chapterStats = {
        chapter1: { total: 0, count: 0 },
        chapter2: { total: 0, count: 0 },
        chapter3: { total: 0, count: 0 },
        chapter4: { total: 0, count: 0 }
    };

    userData.forEach(user => {
        if (user.chapters) {
            if (user.chapters.chapter1 > 0) {
                chapterStats.chapter1.total += user.chapters.chapter1;
                chapterStats.chapter1.count++;
            }
            if (user.chapters.chapter2 > 0) {
                chapterStats.chapter2.total += user.chapters.chapter2;
                chapterStats.chapter2.count++;
            }
            if (user.chapters.chapter3 > 0) {
                chapterStats.chapter3.total += user.chapters.chapter3;
                chapterStats.chapter3.count++;
            }
            if (user.chapters.chapter4 > 0) {
                chapterStats.chapter4.total += user.chapters.chapter4;
                chapterStats.chapter4.count++;
            }
        }
    });

    const chapterChartContainer = document.getElementById('chapterProgressChart');
    chapterChartContainer.innerHTML = '';

    const chapterAverages = {
        chapter1: chapterStats.chapter1.count > 0 ? (chapterStats.chapter1.total / chapterStats.chapter1.count).toFixed(1) : 0,
        chapter2: chapterStats.chapter2.count > 0 ? (chapterStats.chapter2.total / chapterStats.chapter2.count).toFixed(1) : 0,
        chapter3: chapterStats.chapter3.count > 0 ? (chapterStats.chapter3.total / chapterStats.chapter3.count).toFixed(1) : 0,
        chapter4: chapterStats.chapter4.count > 0 ? (chapterStats.chapter4.total / chapterStats.chapter4.count).toFixed(1) : 0
    };

    const maxChapterAvg = Math.max(...Object.values(chapterAverages));

    Object.keys(chapterAverages).forEach((chapter, index) => {
        const avg = chapterAverages[chapter];
        const height = maxChapterAvg > 0 ? (avg / maxChapterAvg) * 150 : 0;
        const chapterName = ['1章', '2章', '3章', '4章'][index];

        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = height + 'px';
        bar.innerHTML = `
            <span class="chart-bar-value">${avg}%</span>
            <span class="chart-bar-label">${chapterName}</span>
        `;
        chapterChartContainer.appendChild(bar);
    });

    // Render table
    const tbody = document.getElementById('progressTableBody');
    tbody.innerHTML = '';

    const sortedUsers = [...userData].sort((a, b) => b.progress - a.progress);

    sortedUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>
                <div class="progress-bar" style="width: 100px;">
                    <div class="progress-fill" style="width: ${user.progress}%; background-color: ${getProgressColor(user.progress)}"></div>
                </div>
                <span style="font-size: 12px; margin-left: 8px;">${user.progress}%</span>
            </td>
            <td>${renderChapterProgress(user.chapters?.chapter1 || 0)}</td>
            <td>${renderChapterProgress(user.chapters?.chapter2 || 0)}</td>
            <td>${renderChapterProgress(user.chapters?.chapter3 || 0)}</td>
            <td>${renderChapterProgress(user.chapters?.chapter4 || 0)}</td>
            <td>${user.playTime}時間</td>
            <td><span class="status-badge ${user.status}">${getStatusText(user.status)}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Render mini test analysis
function renderMiniTestAnalysis() {
    let totalCorrect = 0;
    let totalQuestions = 0;

    userData.forEach(user => {
        if (user.minitest) {
            Object.values(user.minitest).forEach(chapter => {
                totalCorrect += chapter.correct;
                totalQuestions += chapter.total;
            });
        }
    });

    const correctRate = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0;

    document.getElementById('minitestTotal').textContent = totalQuestions;
    document.getElementById('minitestCorrect').textContent = totalCorrect;
    document.getElementById('minitestRate').textContent = correctRate + '%';

    // Render table
    const tbody = document.getElementById('minitestTableBody');
    tbody.innerHTML = '';

    userData.forEach(user => {
        if (!user.minitest) return;

        const c1 = user.minitest.chapter1;
        const c2 = user.minitest.chapter2;
        const c3 = user.minitest.chapter3;
        const c4 = user.minitest.chapter4;

        const userTotalCorrect = c1.correct + c2.correct + c3.correct + c4.correct;
        const userTotalQuestions = c1.total + c2.total + c3.total + c4.total;
        const userRate = userTotalQuestions > 0 ? ((userTotalCorrect / userTotalQuestions) * 100).toFixed(1) : 0;

        const latestDate = [c1.lastDate, c2.lastDate, c3.lastDate, c4.lastDate]
            .filter(d => d !== '-')
            .sort()
            .reverse()[0] || '-';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${renderMiniTestScore(c1)}</td>
            <td>${renderMiniTestScore(c2)}</td>
            <td>${renderMiniTestScore(c3)}</td>
            <td>${renderMiniTestScore(c4)}</td>
            <td><span class="status-badge ${userRate >= 70 ? 'active' : 'inactive'}">${userRate}%</span></td>
            <td>${latestDate}</td>
        `;
        tbody.appendChild(row);
    });
}

// Render mini test score
function renderMiniTestScore(chapter) {
    if (!chapter || chapter.total === 0) {
        return '<span style="color: #999; font-size: 12px;">-</span>';
    }
    const rate = ((chapter.correct / chapter.total) * 100).toFixed(0);
    const color = rate >= 70 ? '#27ae60' : (rate >= 50 ? '#f39c12' : '#e74c3c');
    return `<span style="color: ${color}; font-weight: bold;">${chapter.correct}/${chapter.total}</span> <span style="font-size: 11px; color: #666;">(${rate}%)</span>`;
}

// Render test analysis
function renderTestAnalysis() {
    let totalPassed = 0;
    let totalTaken = 0;

    userData.forEach(user => {
        if (user.test) {
            Object.values(user.test).forEach(chapter => {
                if (chapter.score > 0) {
                    totalTaken++;
                    if (chapter.passed) {
                        totalPassed++;
                    }
                }
            });
        }
    });

    const passRate = totalTaken > 0 ? ((totalPassed / totalTaken) * 100).toFixed(1) : 0;

    document.getElementById('testTotal').textContent = totalTaken;
    document.getElementById('testPassed').textContent = totalPassed;
    document.getElementById('testRate').textContent = passRate + '%';

    // Render table
    const tbody = document.getElementById('testTableBody');
    tbody.innerHTML = '';

    userData.forEach(user => {
        if (!user.test) return;

        const c1 = user.test.chapter1;
        const c2 = user.test.chapter2;
        const c3 = user.test.chapter3;
        const c4 = user.test.chapter4;

        const chapters = [c1, c2, c3, c4];
        const passedCount = chapters.filter(c => c.passed).length;
        const takenCount = chapters.filter(c => c.score > 0).length;
        const passRate = takenCount > 0 ? ((passedCount / takenCount) * 100).toFixed(1) : 0;

        const latestDate = chapters
            .filter(c => c.lastDate !== '-')
            .map(c => c.lastDate)
            .sort()
            .reverse()[0] || '-';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${renderTestScore(c1)}</td>
            <td>${renderTestScore(c2)}</td>
            <td>${renderTestScore(c3)}</td>
            <td>${renderTestScore(c4)}</td>
            <td><span class="status-badge ${passRate >= 70 ? 'active' : 'inactive'}">${passRate}%</span></td>
            <td>${latestDate}</td>
        `;
        tbody.appendChild(row);
    });
}

// Render test score
function renderTestScore(chapter) {
    if (!chapter || chapter.score === 0) {
        return '<span style="color: #999; font-size: 12px;">-</span>';
    }
    const color = chapter.passed ? '#27ae60' : '#e74c3c';
    return `<span style="color: ${color}; font-weight: bold;">${chapter.score}点</span> <span style="font-size: 11px; color: #666;">(${chapter.passed ? '合格' : '不合格'})</span>`;
}

// Setup table sorting
function setupTableSorting() {
    const sortableHeaders = document.querySelectorAll('.sortable');
    let currentSort = { column: null, direction: 'asc' };

    sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const column = this.getAttribute('data-sort');

            // Toggle direction if clicking same column
            if (currentSort.column === column) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.column = column;
                currentSort.direction = 'asc';
            }

            // Update header classes
            sortableHeaders.forEach(h => {
                h.classList.remove('asc', 'desc');
            });
            this.classList.add(currentSort.direction);

            // Sort and render
            const sortedData = [...userData].sort((a, b) => {
                let aVal = a[column];
                let bVal = b[column];

                if (column === 'status') {
                    aVal = getStatusText(aVal);
                    bVal = getStatusText(bVal);
                }

                if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }

                if (currentSort.direction === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });

            renderTable(sortedData);
        });
    });
}

// Show toast notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px; margin-left: 10px;">&times;</button>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Export all data
function exportAllData() {
    const csvContent = "data:text/csv;charset=utf-8," +
        "ID,ユーザー名,進捗率,最終ログイン,プレイ時間,ログイン国,ステータス,つまずきポイント\n" +
        userData.map(u => `${u.id},${u.name},${u.progress}%,${u.lastLogin},${u.playTime}時間,${u.country},${getStatusText(u.status)},"${u.painPoints.join(';')}"`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "all_user_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('全データをエクスポートしました', 'success');
}

// Clear all data
function clearAllData() {
    if (confirm('本当に全データをクリアしますか？この操作は取り消せません。')) {
        userData.length = 0;
        renderTable(userData);
        updateStats();
        updateDashboardStats();
        renderChurnTable();
        renderRegionStats();
        renderProgressAnalysis();
        showToast('全データをクリアしました', 'warning');
    }
}
