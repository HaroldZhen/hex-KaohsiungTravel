import zipCode from './zipCode.js';
//定義元素DOM
const zoneDrop = document.getElementById('drop-down');
const cardList = document.querySelector('.card-list');
const hotSportList = document.getElementById('hot-sport-list');
const zoneTitle = document.querySelector('.zone-title');
const pageList = document.getElementById('page-list');
const goTopBtn = document.getElementById('goTop');
//定義資料
let currentZipCode = 'all';
let sceneData = [];
let zoneData = [...zipCode.kaohsiungZip.districts];
let hotZone = [
    {
        name: '苓雅區',
        code: 802,
        count: 1,
    },
    {
        name: '三民區',
        code: 807,
        count: 1,
    },
    {
        name: '新興區',
        code: 800,
        count: 1,
    },
    {
        name: '鹽埕區',
        code: 803,
        count: 1,
    },
];

// Run
getRemoteData();

// 取得遠端資料
function getRemoteData(){
	const url = 'https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c';
	fetch(url, {})
		.then((response) => {
				return response.json();
		})
		.then((responseJson) => {
				const result = responseJson.data.XML_Head.Infos.Info;
				result.forEach(infoItem => {
					// 加入對應地區中文名稱
					let zipName = zoneData.find((zoneItem) => {
						//計算景點數量
						if (zoneItem.zip == infoItem.Zipcode) {
							zoneItem.count= (parseInt(zoneItem.count) || 0) + 1;
						}
						return zoneItem.zip == infoItem.Zipcode;
					});
					sceneData.push({
						...infoItem,
						Zipame: zipName.name,
					});
				});
				renderMain(sceneData, currentZipCode);
				renderHotSport(hotZone);
		})
		.catch((err) => {
				console.log('錯誤', err);
				zoneTitle.innerHTML = 'err';
		});
}

// 計算熱門景點次數
function countHotZone(zip) {
	currentZipCode = zip;
	if (zip === 'all' ) {
		return;
	}
	// 熱點
	let newIndex = hotZone.findIndex(item => {
		return item.code == zip;
	});
	if (newIndex >= 0){
		hotZone[newIndex].count++;
	} else {
		let the = zoneData.find(item => item.zip == zip);
		hotZone.unshift({
			name: the.name,
			code: parseInt(the.zip),
			count: 1,
		});
	};
}

// 計算分頁與資料
function pagination(sourceData, current = 1) {
	//檢查頁數上限
	const limit = 10;
	const countPage = Math.ceil(sourceData.length / limit);
	current = (current > countPage) ? current : Math.max(1, current);
	let data = [];
	let start = (current-1) * limit;
	let end = start + limit;

	data = sourceData.slice(start, end);
	return {
		countPage,
		data,
	};
}

// 過濾分區
function filterZone(soruceData, zipCode) {
	let data = [...soruceData];
	if (zipCode !== 'all') {
		data = data.filter(item => item.Zipcode == zipCode);
	}
	return data;
}

// 主要渲然
function renderMain(soruceData, zipCode, currentPage = 1){
	renderTitle(zipCode);
	renderDropdown(zoneData, zipCode);
	let filterData = filterZone(soruceData, zipCode);
	filterData = pagination(filterData, currentPage);
	renderPagintaion(filterData, currentPage);
	renderList(filterData)
	fadeInEffect();
}

//渲然熱門景點
function renderHotSport(soruceData) {
	let template = '';
	let data = [...soruceData];
	data = data.sort((a,b) => b.count - a.count).splice(0,4);
	data.forEach(item => {
		template += `<a class="hotzone" href="#" data-zip="${item.code}">${item.name}</a>`;
	});
	hotSportList.innerHTML = template;
}

//渲然下拉選單
function renderDropdown(sourceData, zipCode) {
	let template = '';
	template += `<option value="all">全部行政區(${sceneData.length})</option>`;
	let isAction = '';
	sourceData.forEach((item) => {
		isAction = (item.zip == zipCode) ? 'selected': '';
		template += `<option value="${item.zip}" ${isAction}>${item.name}(${item.count || 0})</option>`
	})
	zoneDrop.innerHTML = template;
}

//渲然分區的標題
function renderTitle(zipCode) {
	let zoneName = zoneData.find((zoneItem) => zoneItem.zip == zipCode)
	zoneTitle.innerHTML = (zoneName) ? zoneName.name : '全部行政區';
}

// 渲然分頁
function renderPagintaion(pageObject, currentPage) {
	const current = parseInt(currentPage);
	let template = '';
	if (currentPage > 1) {
			template += `<li class="link"><a href="#" data-page="${current - 1}" >Prev</a></li>`;
	} else {
			template += `<li class="link unlink"><span>Prev</span></li>`;
	}
	for (let i = 1; i <= pageObject.countPage; i++) {
		let isHidden = (current !== i) ? 'hidden' : '';
		if (current === i){
			template += `<li class="link"><span class="active">${i}</span></li>`;
		} else {
			template += `<li class="link ${isHidden}"><a href="#" data-page="${i}">${i}</a></li>`;
		}
	};
	if (pageObject.countPage > currentPage) {
			template += `<li class="link"><a href="#" data-page="${current + 1}" >Next</a></li>`;
	} else {
			template += `<li class="link unlink"><span>Next</span></li>`;
	}
	pageList.innerHTML = template;
}

// 渲然景點清單
function renderList(sourceData) {
	let template = '';
	let { data } = sourceData;
	data.forEach(item => {
		let tickeTemplte = '';
		if (item.Ticketinfo !== "") {
			tickeTemplte = `<div><img src="./img/icons_tag.png" alt="">${item.Ticketinfo}</div>`;
		}
		template += `<li class="card-item">
				<a href="#" class="card-header" style="background-image: url('${item.Picture1}');">
						<h4>${item.Name}</h4>
						<p></p>
				</a>
				<ul class="card-body">
						<li>
								<img src="./img/icons_clock.png" alt="">
								<p>${item.Opentime}</p>
						</li>
						<li>
								<img src="./img/icons_pin.png" alt="">
								<p>${item.Add}</p>
						</li>
						<li>
								<div>
										<img src="./img/icons_phone.png" alt=""><a href="tel:${item.Tel}">${item.Tel}</a>
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

//淡入動畫
function fadeInEffect(){
	const cardItem = document.querySelectorAll('.card-item');
	let sec = 50;
	cardItem.forEach(function(item) {
		setTimeout(() => {
			item.classList.add('active');
		},sec);
		sec += 120;
	});
}

//監聽事件：下拉選單切換
zoneDrop.addEventListener('change', changeZone);
function changeZone(event) {
	const zip = event.target.value;
	renderMain(sceneData, zip);
	countHotZone(zip);
	renderHotSport(hotZone);
}

//監聽事件：分頁
pageList.addEventListener('click', switchPage);
function switchPage(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'A') {
        return;
    }
    const currentPage = e.target.dataset.page;
    renderMain(sceneData, currentZipCode, currentPage);
}

//監聽事件：熱門景點
hotSportList.addEventListener('click', switchZone);
function switchZone(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'A') {
        return;
    }
    const zipCode = e.target.dataset.zip;
    renderMain(sceneData, zipCode);
		countHotZone(zipCode);
		renderHotSport(hotZone);
}

//回到頂端
goTopBtn.addEventListener('click', function(e) {
	e.preventDefault();
	window.scrollTo({
		top: 0,
		behavior: "smooth"
	});
});

// 依網站位置顯示或隱藏Top
window.onscroll = function() {
	goTopBtn.style.visibility="hidden";
	let pageOffset = document.documentElement.scrollTop || document.body.scrollTop;
	if (pageOffset >= 300){
		goTopBtn.style.visibility="visible";
	} else{
		goTopBtn.style.visibility="hidden";
	}
};