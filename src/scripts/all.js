import location from './location.js';
// 定義元素DOM
const zoneDrop = document.getElementById('drop-down');
const cardList = document.querySelector('.card-list');
const hotSportList = document.getElementById('hot-sport-list');
const zoneTitle = document.querySelector('.zone-title');
const pageList = document.getElementById('page-list');
const goTopBtn = document.getElementById('goTop');
// 定義資料
let currentZipCode = 0;
const sceneData = [];
const zoneData = [...location.kaohsiungZip.districts];
const defaultHotZone = [802, 807, 800, 803];
const hotZone = zoneData
  .map((item) => ({
    ...item,
    count: 1,
  }))
  .filter((item) => defaultHotZone.includes(item.zip));

// 計算熱門景點次數
function countHotZone(zoneZip) {
  currentZipCode = zoneZip;
  if (zoneZip === 0) {
    return;
  }
  // 熱點
  const newIndex = hotZone.findIndex((item) => item.zip === zoneZip);
  if (newIndex >= 0) {
    hotZone[newIndex].count += 1;
  } else {
    const { name, zip: code } = zoneData.find((item) => item.zip === zoneZip);
    hotZone.unshift({
      name,
      code,
      count: 1,
    });
  }
}

// 計算分頁與資料
function pagination(sourceData, current = 1) {
  let currentPage = current;
  // 檢查頁數上限
  const limit = 10;
  const countPage = Math.ceil(sourceData.length / limit);
  currentPage = currentPage > countPage ? currentPage : Math.max(1, currentPage);
  let data = [];
  const start = (currentPage - 1) * limit;
  const end = start + limit;

  data = sourceData.slice(start, end);
  return {
    countPage,
    data,
  };
}

// 過濾分區
function filterZone(soruceData, zip) {
  let data = [...soruceData];
  if (zip !== 0) {
    data = data.filter((item) => item.zip === zip);
  }
  return data;
}

// 渲然分區的標題
function renderTitle(zip) {
  const zoneName = zoneData.find((zoneItem) => zoneItem.zip === zip);
  zoneTitle.innerHTML = zoneName ? zoneName.name : '全部行政區';
}

// 渲然下拉選單
function renderDropdown(sourceData, zip) {
  let template = '';
  template += `<option value="">全部行政區(${sceneData.length})</option>`;
  let isAction = '';
  sourceData.forEach((item) => {
    isAction = item.zip === zip ? 'selected' : '';
    template += `<option value="${item.zip}" ${isAction}>${item.name}(${item.count || 0})</option>`;
  });
  zoneDrop.innerHTML = template;
}

// 渲然分頁
function renderPagintaion(pageObject, currentPage) {
  const current = parseInt(currentPage, 10);
  let template = '';
  if (currentPage > 1) {
    template += `<li class="link"><a href="#" data-page="${current - 1}" >Prev</a></li>`;
  } else {
    template += '<li class="link unlink"><span>Prev</span></li>';
  }
  for (let i = 1; i <= pageObject.countPage; i += 1) {
    const isHidden = current !== i ? 'hidden' : '';
    if (current === i) {
      template += `<li class="link"><span class="active">${i}</span></li>`;
    } else {
      template += `<li class="link ${isHidden}"><a href="#" data-page="${i}">${i}</a></li>`;
    }
  }
  if (pageObject.countPage > currentPage) {
    template += `<li class="link"><a href="#" data-page="${current + 1}" >Next</a></li>`;
  } else {
    template += '<li class="link unlink"><span>Next</span></li>';
  }
  pageList.innerHTML = template;
}

// 渲然景點清單
function renderList(sourceData) {
  let template = '';
  const { data } = sourceData;
  data.forEach((item) => {
    let tickeTemplte = '';
    if (item.Ticketinfo !== '') {
      tickeTemplte = `<div><img src="./images/icons_tag.png" alt="">${item.Ticketinfo}</div>`;
    }
    template += `<li class="card-item">
				<a href="#" class="card-header" style="background-image: url('${item.Picture1}');">
						<h4>${item.Name}</h4>
						<p></p>
				</a>
				<ul class="card-body">
						<li>
								<img src="./images/icons_clock.png" alt="">
								<p>${item.Opentime}</p>
						</li>
						<li>
								<img src="./images/icons_pin.png" alt="">
								<p>${item.Add}</p>
						</li>
						<li>
								<div>
										<img src="./images/icons_phone.png" alt=""><a href="tel:${item.Tel}">${item.Tel}</a>
								</div>
						</li>
						<li>
						${tickeTemplte}
						</li>
				</ul>
		</li>`;
  });
  cardList.innerHTML = template;
}

// 淡入動畫
function fadeInEffect() {
  const cardItem = document.querySelectorAll('.card-item');
  let sec = 50;
  cardItem.forEach((item) => {
    setTimeout(() => {
      item.classList.add('active');
    }, sec);
    sec += 120;
  });
}

// 主要渲然
function renderMain(soruceData, zip, currentPage = 1) {
  renderTitle(zip);
  renderDropdown(zoneData, zip);
  let filterData = filterZone(soruceData, zip);
  filterData = pagination(filterData, currentPage);
  renderPagintaion(filterData, currentPage);
  renderList(filterData);
  fadeInEffect();
}

// 渲然熱門景點
function renderHotSport(soruceData) {
  let template = '';
  let data = [...soruceData];
  data = data.sort((a, b) => b.count - a.count).splice(0, 4);
  data.forEach((item) => {
    template += `<a class="hotzone" href="#" data-zip="${item.zip}">${item.name}</a>`;
  });
  hotSportList.innerHTML = template;
}

function changeZone(event) {
  const zip = parseInt(event.target.value, 10) || 0;
  renderMain(sceneData, zip);
  countHotZone(zip);
  renderHotSport(hotZone);
}

function switchPage(e) {
  e.preventDefault();
  if (e.target.nodeName !== 'A') {
    return;
  }
  const currentPage = e.target.dataset.page;
  renderMain(sceneData, currentZipCode, currentPage);
}

function switchZone(e) {
  e.preventDefault();
  if (e.target.nodeName !== 'A') {
    return;
  }
  const zip = parseInt(e.target.dataset.zip, 10) || 0;
  renderMain(sceneData, zip);
  countHotZone(zip);
  renderHotSport(hotZone);
}

// 依網站位置顯示或隱藏Top
window.onscroll = function () {
  goTopBtn.style.visibility = 'hidden';
  const pageOffset = document.documentElement.scrollTop || document.body.scrollTop;
  if (pageOffset >= 300) {
    goTopBtn.style.visibility = 'visible';
  } else {
    goTopBtn.style.visibility = 'hidden';
  }
};

// 取得遠端資料
function getRemoteData() {
  const url = 'https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c';
  fetch(url, {})
    .then((response) => response.json())
    .then((responseJson) => {
      const result = responseJson.data.XML_Head.Infos.Info;
      result.forEach((infoItem) => {
        // 加入對應地區中文名稱
        const zipCode = parseInt(infoItem.Zipcode, 10) || 0;
        const zipName = zoneData.find((zoneItem, index) => {
          // 計算景點數量
          if (zoneItem.zip === zipCode) {
            zoneData[index].count = (parseInt(zoneData[index].count, 10) || 0) + 1;
          }
          return zoneItem.zip === zipCode;
        });
        sceneData.push({
          ...infoItem,
          Zipame: zipName.name,
          zip: zipCode,
        });
      });
      renderMain(sceneData, currentZipCode);
      renderHotSport(hotZone);
    })
    .catch((err) => {
      // console.log('錯誤', err);
      zoneTitle.innerHTML = 'err';
    });
}

// Run
getRemoteData();
// 監聽事件：下拉選單切換
zoneDrop.addEventListener('change', changeZone);
// 監聽事件：熱門景點
hotSportList.addEventListener('click', switchZone);
// 監聽事件：分頁
pageList.addEventListener('click', switchPage);

// 回到頂端
goTopBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});
