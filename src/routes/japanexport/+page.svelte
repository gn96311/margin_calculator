<script lang="ts">
    const date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = (date.getDate()).toString().padStart(2, "0");
    const year = date.getFullYear();

    export let data;
    let exportDatas = data.japanDatas;
    let exportLightDatas = data.japanLightDatas;
    let exchange = data.exchangeRate;
    let japanExchange = exchange.find(unit => unit.cur_unit == 'JPY(100)')?.tts || 950;
    let chinaExchange = exchange.find(unit => unit.cur_unit == 'CNH')?.tts || 196;

    let selectedSite, selectedMethod, nowSelectedMethod, selectedSiteFee;

    let priceCost, priceCostInJapan, packagingCost, domesticShippingCost, exportWeight, discountPriceInJapan, shippingPriceInJapan;

    let exportWidth, exportLength, exportHeight, calculatedExportWeight;

    let marketFeeAndVAT, expectedSale, expectedPurchase, netProfit, netProfitWithTax, exportTax;

    let results = {};

    let showDetails = false;

    let isLight = false;

    function toggleDetails() {
        showDetails = !showDetails;
    }

    function formatNumber(num) {
        return num.toLocaleString('en-US');
    }

    function validateCalculate(event) {
        event.preventDefault();

        if (!priceCost || !priceCostInJapan || !packagingCost || !domesticShippingCost || !exportWeight || !discountPriceInJapan || !shippingPriceInJapan || !exportWidth || !exportLength || !exportHeight) {
            alert("모든 필드를 채워주세요.");
            return;
        }

        if (exportWeight <= 0){
            alert("무게는 0kg 이상이어야 합니다.");
            return;
        }

        if (isLight == true){
            if (exportWeight > 1 || ((parseFloat(exportWidth) * parseFloat(exportHeight) * parseFloat(exportLength)) / 6000) > 1){
                alert('Light의 경우, 부피 무게 1kg을 초과하면 안됩니다. 체크를 해제해주세요.');
                return;
            }
        }
        
        results = calculateCost();
    }

    function handleSiteChange(){
        if (selectedSite == 'rakuten') {
            selectedSiteFee = 0.091;
        } else if (selectedSite == 'amazonJP') {
            selectedSiteFee = 0.12;
        } else if (selectedSite == 'Qoo10') {
            selectedSiteFee = 0.10;
        }
    }

    function handleExportMethod() {
        if (selectedMethod == 'ship'){
            nowSelectedMethod = selectedMethod;
        } else if (selectedMethod == 'airplane') {
            nowSelectedMethod = selectedMethod;
        }
    }

    function matchCost() {
        let exportCost;
        let calculatedWeight = (parseFloat(exportWidth) * parseFloat(exportHeight) * parseFloat(exportLength)) / 6000;
        if (calculatedWeight >= exportWeight) {
            calculatedExportWeight = calculatedWeight;
        } else {
            calculatedExportWeight = exportWeight;
        }

        if (isLight == true) {
            let closet = exportLightDatas.find(data => data.weight >= calculatedExportWeight);
            if (!closet) {
                    closet = exportLightDatas[exportLightDatas.length - 1];
                }
            if (nowSelectedMethod == 'ship'){
                exportCost = closet.SHIPPING;
            } else if (nowSelectedMethod == 'airplane') {
                exportCost = closet.AirFreight;
            }
        } else if (isLight == false){
            let closet = exportDatas.find(data => data.weight >= calculatedExportWeight);
            if (!closet) {
                    closet = exportDatas[exportDatas.length - 1];
                }
            if (nowSelectedMethod == 'ship'){
                exportCost = closet.SHIPPING;
            } else if (nowSelectedMethod == 'airplane') {
                exportCost = closet.AirFreight;
            }
        }

        return exportCost;
    }


    function calculateCost() {
        handleExportMethod();
        handleSiteChange();
        let exportCost = matchCost();
        marketFeeAndVAT = ((parseFloat(priceCostInJapan)+parseFloat(shippingPriceInJapan))*selectedSiteFee)+((parseFloat(priceCostInJapan)-parseFloat(discountPriceInJapan))*0.02);
        expectedSale = (parseFloat(priceCostInJapan) - parseFloat(discountPriceInJapan) + parseFloat(shippingPriceInJapan))*(japanExchange/100);
        expectedPurchase = parseFloat(priceCost) + parseFloat(packagingCost) + parseFloat(domesticShippingCost) + 200 + ((exportCost+marketFeeAndVAT)*(japanExchange/100));
        netProfit = expectedSale-expectedPurchase;
        netProfitWithTax = netProfit + (parseFloat(priceCost)*0.1);
        
        return {
            expectedSale: Math.round(expectedSale),
            expectedPurchase: Math.round(expectedPurchase),
            netProfit: Math.round(netProfit),
            netProfitWithTax: Math.round(netProfitWithTax),
            priceCost: parseFloat(priceCost),
            packagingCost: parseFloat(packagingCost),
            domesticShippingCost: parseFloat(domesticShippingCost),
            exportCost: exportCost,
            exportTax: 200,
            marketFeeAndVAT: marketFeeAndVAT,
            priceCostInJapan: priceCostInJapan,
            shippingPriceInJapan: shippingPriceInJapan,
            discountPriceInJapan: discountPriceInJapan,
        };
    }

</script>

<main>
    <form id="japan-export-calculation" on:submit={validateCalculate}>
        <h2>{year}년 {month}월 {day}일 환율: 100엔(JPY) = {japanExchange} 원(KRW)</h2>
        <label for="price">국내 제품 개당 구매가(원, ₩):</label>
        <input type="text" id="price" name="price" placeholder="19800" bind:value={priceCost} title="국내에서 해당 제품을 얼마에 구매하는가에 대한 가격입니다.">

        <label for="site">판매사이트:</label>
        <select id="site-selector" bind:value={selectedSite} on:change={handleSiteChange}>
            <option value = "Qoo10">큐텐 재팬</option>
            <option value = "amazonJP">아마존 JP</option>
            <option value = "rakuten">라쿠텐</option>
        </select>

        <label for="packaging-cost">제품 포장 비용(원, ₩):</label>
        <input type="text" id="packaging-cost" name="packaging-cost" placeholder="200" bind:value={packagingCost} title="제품 추가 포장 비용입니다.">

        <label for="domestic-shipping-cost">국내 발송 택배비(원, ₩):</label>
        <input type="text" id="domestic-shipping-cost" name="domestic-shipping-cost" placeholder="3000" bind:value={domesticShippingCost} title="한국 내 배송대행지로 보내기 위한 국내 택배 배송비입니다.">

        <div class="flex-container">
            <label for="export-method">수출 방법:</label>
            <div class="light-check-box">
                <label for="light-button">Light 해당 여부 :</label>
                <input type="checkbox" id="light-button" name="light-button" bind:checked={isLight} title="가로 21.3cm, 세로 22.8cm, 높이 3cm, 무게 1kg 이하만 가능합니다.">
            </div>
        </div>
        <select id="export-method-selector" bind:value={selectedMethod} on:change={handleExportMethod}>
            <option value = "ship">해운</option>
            <option value = "airplane">항공</option>
        </select>

        <div class="export-size-padding-container">
        <label for="export-size">수출 제품 사이즈(cm)</label>
            <div class="export-size">
                <div class="export-size-width">
                    <label for="export-size-width">가로</label>
                    <input type="text" id="export-size-width" name="export-size-width" placeholder="20" bind:value={exportWidth} title="제품의 가로 사이즈입니다.">
                </div>
                <div class="export-size-length">
                    <label for="export-size-length">세로</label>
                    <input type="text" id="export-size-length" name="export-size-length" placeholder="20" bind:value={exportLength} title="제품의 세로 사이즈입니다.">
                </div>
                <div class="export-size-height">
                    <label for="export-size-height">높이</label>
                    <input type="text" id="export-size-height" name="export-size-height" placeholder="20" bind:value={exportHeight} title="제품의 높이 사이즈입니다.">
                </div>
            </div>
        </div>

        <label for="export-weight">수출 제품 무게(kg):</label>
        <input type="text" id="export-weight" name="export-weight" placeholder="2" bind:value={exportWeight} title="일본으로 보내는 제품의 무게입니다.(박스 및 포장 포함)">

        <label for="price-cost-in-japan">일본 판매가(엔, ¥):</label>
        <input type="text" id="price-cost-in-japan" name="price-cost-in-japan" placeholder="2980" bind:value={priceCostInJapan} title="일본 마켓에서 판매할 가격입니다.">
        
        <label for="discount-price-in-japan">일본 설정 할인 가격(엔, ¥):</label>
        <input type="text" id="discount-price-in-japan" name="discount-price-in-japan" placeholder="100" bind:value={discountPriceInJapan} title="일본 마켓에서 적용할 할인입니다.(100엔 할인할 예정이면 100)">

        <label for="shipping-price-in-japan">일본 설정 배송비(엔, ¥):</label>
        <input type="text" id="shipping-price-in-japan" name="shipping-price-in-japan" placeholder="770" bind:value={shippingPriceInJapan} title="일본 마켓에서 설정할 배송비입니다.">

        <button type="submit">계산</button>
    </form>
    <aside>
        <p>광고를 위한 공간</p>
    </aside>
</main>

<div class="explan-box">
    <p style="text-align: left;"><b>국내 제품 개당 구매가(원, ₩)</b> : 국내에서 해당 제품을 얼마에 구매하였는지 적으시면 됩니다.</p>
    <p style="text-align: left;"><b>제품 포장 비용(원, ₩)</b> : 제품 발송을 위한 재포장에 들어간 비용을 적으시면 됩니다.</p>
    <p style="text-align: left;"><b>국내 발송 택배비(원, ₩)</b> : 해당 제품을 한국 내 배송대행지(수출회사)로 보내기 위한 비용입니다.</p>
    <p style="text-align: left;"><b>수출 방법</b> : 해운/항공이 있으며, 항공의 경우 유류비가 추가되기 때문에 같은 무게 대비 더 비쌉니다. 또한 가로X세로X높이가 21.3 X 22.8 X 3cm의 제품이라면 Light를 적용하여 발송이 가능하며, 이는 기존 방법보다 저렴합니다. <br>하지만 가로/세로/높이 중 하나라도 기준을 넘어가면 기존 방법으로 배송됩니다.</p>
    <p style="text-align: left;"><b>수출 제품 사이즈/무게</b> : 부피 무게를 측정하기 위함입니다. (가로X세로X높이)/6000의 값과 무게를 비교하여, 더 무거운 쪽으로 책정합니다.</p>
    <p style="text-align: left;"><b>일본 판매가(엔, ¥)</b> : 일본에서 해당 제품을 판매하는 가격입니다.</p>
    <p style="text-align: left;"><b>일본 설정 할인 가격(엔, ¥)</b> : 일본에서 해당 제품을 판매할 때, 얼마를 세일할 지 적으시면 됩니다. 예를들어 3980엔 제품을 판매중이고, 이를 100엔정도 세일하실 예정이라면 100으로 적으시면 됩니다.</p>
    <p style="text-align: left;"><b>일본 설정 배송비(엔, ¥)</b> : 일본에서 해당 제품을 판매할 때, 얼마를 배송비로 측정할 것인지 적으시면 됩니다.</p>
    <p style="text-align: left;">만일 제품을 3980엔에 팔고, 200엔을 할인할 예정이고, 배송비는 700엔을 받는다면 고객님이 지불할 금액은 4480엔입니다.</p>
</div>

{#if results.netProfit !== undefined}
    <div id="result-display">
        <p class="result-explain">※ 해당 값은 예상치입니다.</p>
        <p class="result-title">매출: <span class="result-value">{formatNumber(Math.round(results.expectedSale))} 원</span></p>
        <p class="result-title">매입: <span class="result-value">{formatNumber(Math.round(results.expectedPurchase))} 원</span></p>
        <p class="result-title">판매 순이익: <span class="result-value">{formatNumber(Math.round(results.netProfit))} 원</span></p>
        <p class="result-title">매입 세액 포함 순이익: <span class="result-value">{formatNumber(Math.round(results.netProfitWithTax))} 원</span></p>
        <button class="details-button" on:click={toggleDetails}>
            {showDetails ? '간략히 보기' : '자세히 보기'}
        </button>
        {#if showDetails}
            <div class="details-section">
                <p class="result-title">매출: <span class="result-value">{formatNumber(Math.round(results.expectedSale))} 원</span></p>
                <p class="result-subtitle">판매 금액: <span class="result-subvalue">{formatNumber(Math.round(results.priceCostInJapan*(japanExchange/100)))} 원</span></p>
                <p class="result-subtitle">배송비: <span class="result-subvalue">{formatNumber(Math.round(results.shippingPriceInJapan*(japanExchange/100)))} 원</span></p>
                <p class="result-title">매입: <span class="result-value">{formatNumber(Math.round(results.expectedPurchase))} 원</span></p>
                <p class="result-subtitle">구매 금액: <span class="result-subvalue">{formatNumber(Math.round(results.priceCost))} 원</span></p>
                <p class="result-subtitle">포장비: <span class="result-subvalue">{formatNumber(Math.round(results.packagingCost))} 원</span></p>
                <p class="result-subtitle">국내 배송비: <span class="result-subvalue">{formatNumber(Math.round(results.domesticShippingCost))} 원</span></p>
                <p class="result-subtitle">해외 배송비: <span class="result-subvalue">{formatNumber(Math.round(results.exportCost * (japanExchange/100)))} 원</span></p>
                <p class="result-subtitle">마켓 수수료: <span class="result-subvalue">{formatNumber(Math.round(results.marketFeeAndVAT*(japanExchange/100)))} 원</span></p>
                <p class="result-subtitle">할인 금액: <span class="result-subvalue">{formatNumber(Math.round(results.discountPriceInJapan*(japanExchange/100)))} 원</span></p>
            </div>
        {/if}
    </div>
{/if}

<style>
    main {
        display: flex;
        justify-content: space-between;
        padding: 20px;
        width: 100%;
        gap: 20px;
    }

    .flex-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    .light-check-box {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    label, input {
        white-space: nowrap;
    }

    #light-button{
        margin-top: 5px;
        margin-bottom: 0px;
    }

    .export-size-padding-container {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .export-size {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .export-size div {
        flex: 1 1 33%;
        padding-left: 10px;
        padding-right: 10px;
    }

    #site-selector {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 18px;
    }

    #export-method-selector {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 18px;
    }

    form {
        flex: 1;
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    form h2 {
        font-size: 18px;
        margin-bottom: 20px;
    }

    form label {
        display: block;
        margin: 10px 0 5px;
    }

    form input {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 14px;
    }

    form input::placeholder{
        color: #333333;
        opacity: 0.3;
    }


    form button {
        width: 100%;
        padding: 10px;
        background-color: #93E9B5;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    form button:hover {
        background-color: #218838;
    }

    aside {
        width: 300px;
        background-color: #ccc;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .details-button {
        background-color: #93E9B5;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

    .details-button:hover {
    background-color: #93E9B5;
    }

    #result-display {
        width: 380px;
        background-color: #f9f9f9;
        border: 2px solid #cccccc;
        border-radius: 10px;
        padding: 20px;
        margin-top: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        font-family: 'Pretendard-Regular', sans-serif;
        font-size: 16px;
        color: #333333;
    }

    #result-display p {
        margin: 10px 0;
        display: flex;
        justify-content: space-between;
    }

    #result-display .result-explain{
        font-size: 14px;
        color: #777777;
    }

    #result-display .result-title {
        font-weight: bold;
        font-size: 18px;
        color: #222222;
    }

    #result-display .result-value {
        font-weight: normal;
        font-size: 18px;
        color: #333333;
        text-aling: right;
    }

    #result-display .result-subtitle {
        font-size: 14px;
        color: #555555;
    }

    #result-display .result-subvalue {
        font-size: 14px;
        color: #555555;
        text-align: right;
    }
</style>