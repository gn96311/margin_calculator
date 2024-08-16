<script lang="ts">
    import { tick } from 'svelte';

    const date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = (date.getDate()).toString().padStart(2, "0");
    const year = date.getFullYear();

    export let data;
    let rates = data.datas;
    let exchange = data.exchangeRate;
    let japanExchange = exchange.find(unit => unit.cur_unit == 'JPY(100)')?.tts || 950;
    let chinaExchange = exchange.find(unit => unit.cur_unit == 'CNH')?.tts || 196;

    let selectedSite, selectedSiteFee;

    let chinaImportCost, customsDutyAndSurtax, customsEntireFee, domesticShippingCost, estimatedSales, estimatedPurchase, netProfit, netProfitPerUnit, originMakingCost, importDocumentCost, customsFee, taxablePrice;
    let exchangeRate, priceCost, originalCost, importCount, smallBox, mediumBox, LargeBox, chinaShippingCost, CBM, returnRate, packagingCost, koreaShippingCost;

    let purchaseCost, shippingAndFee, marketFeeAndVAT, packageAndSending, justCBMCost;

    let results = {};

    let showDetails = false;

    let resultDisplayRef;

    function toggleDetails() {
        showDetails = !showDetails;
    }

    function formatNumber(num) {
        return num.toLocaleString('en-US');
    }

    async function validateCalculate(event) {
        event.preventDefault();

        if (!priceCost || !originalCost || !importCount || !smallBox || !mediumBox || !LargeBox || !chinaShippingCost || !CBM || !returnRate || !packagingCost || !koreaShippingCost) {
            alert("모든 필드를 채워주세요.");
            return;
        }

        if (smallBox < 0 || mediumBox < 0|| LargeBox < 0 || (parseFloat(smallBox) + parseFloat(mediumBox) + parseFloat(LargeBox) <= 0)){
            alert("박스 개수는 0개 이상이어야 합니다.");
            return;
        }

        results = calculateCost();

        await tick();

        if (resultDisplayRef) {
            resultDisplayRef.scrollIntoView({ behavior: 'smooth'});
        }
    }

    function handleSiteChange(){
        if (selectedSite == 'coupang') {
            selectedSiteFee = 0.10;
        } else if (selectedSite == 'smartstore') {
            selectedSiteFee = 0.0585;
        } else if (selectedSite == 'ESM') {
            selectedSiteFee = 0.13;
        } else if (selectedSite == '11st') {
            selectedSiteFee = 0.12;
        } else if (selectedSite == 'interpark') {
            selectedSiteFee = 0.13;
        }
    }

    function matchCost() {
        const cbmRounded = Math.round(parseFloat(CBM) * 10) / 10;
        let closet = rates.find(rate => rate.weight >= cbmRounded);

        if (!closet) {
            closet = rates[rates.length - 1];
        }
        
        chinaImportCost = closet.cost.replace(/,/g, '');
    }

    function calculateCost() {
        matchCost();
        handleSiteChange();
        exchangeRate = parseFloat(chinaExchange);
        taxablePrice = (parseFloat(originalCost)*parseFloat(importCount)) * exchangeRate * 1.03;
        originMakingCost = parseFloat(Math.round(1 + (parseFloat(importCount) / 500)) * 8000)
        importDocumentCost = 10000;

        if (taxablePrice * (2/1000) <= 30000) {
            customsFee = 30000;
        } else {
            customsFee = taxablePrice * (2/1000);
        }


        justCBMCost = parseFloat(chinaImportCost);
        chinaImportCost = parseFloat(chinaImportCost) + parseFloat(originMakingCost);
        customsDutyAndSurtax = taxablePrice * 0.18;
        customsEntireFee = customsFee + importDocumentCost + customsDutyAndSurtax;
        domesticShippingCost = (parseFloat(smallBox) * 4000) + (parseFloat(mediumBox) * 6000) + (parseFloat(LargeBox) * 8000);
        marketFeeAndVAT = parseFloat(priceCost)*selectedSiteFee*parseFloat(importCount) * 1.1;
        packageAndSending = parseFloat(packagingCost)*parseFloat(importCount) + parseFloat(koreaShippingCost)*parseFloat(importCount);

        purchaseCost = taxablePrice + parseFloat(chinaShippingCost)*exchangeRate + chinaImportCost + customsEntireFee + domesticShippingCost;
        shippingAndFee = parseFloat(packagingCost)*parseFloat(importCount) + parseFloat(koreaShippingCost)*parseFloat(importCount) + marketFeeAndVAT;

        estimatedSales = parseFloat(priceCost)*(parseFloat(importCount)*(1-(parseFloat(returnRate)/100)));
        estimatedPurchase = purchaseCost + shippingAndFee;

        netProfit = Math.round(estimatedSales - estimatedPurchase);
        netProfitPerUnit = Math.round(netProfit / parseFloat(importCount));

        return {
            chinaImportCost: chinaImportCost,
            customsEntireFee: customsEntireFee,
            domesticShippingCost: domesticShippingCost,
            estimatedSales: estimatedSales,
            estimatedPurchase: estimatedPurchase,
            netProfit: netProfit,
            netProfitPerUnit : netProfitPerUnit,
            taxablePrice: taxablePrice,
            purchaseCost: purchaseCost,
            shippingAndFee: shippingAndFee,
            marketFeeAndVAT: Math.round(marketFeeAndVAT),
            packageAndSending: packageAndSending,
            justCBMCost: justCBMCost,
            originMakingCost: originMakingCost,
            customsFee: customsFee,
            importDocumentCost: importDocumentCost,
            customsDutyAndSurtax: customsDutyAndSurtax,
        };
    }

</script>

<main>
    <form id="china-import-calculation" on:submit={validateCalculate}>
        <div class="exchange-box">
            <h2>{year}년 {month}월 {day}일 환율: 1위안(CNY) = {chinaExchange} 원(KRW)</h2>
        </div>
        <p class="explain-text"> ※ 제목에 마우스를 올리시면 더욱 자세한 설명을 보실 수 있습니다.</p>
        <label for="price" title="국내에서 해당 제품을 얼마에 파는가에 대한 가격입니다.">제품 개당 판매가(원, ₩):</label>
        <input type="text" id="price" name="price" placeholder="19800" bind:value={priceCost} title="국내에서 해당 제품을 얼마에 파는가에 대한 가격입니다.">

        <label for="site">판매사이트:</label>
        <select id="site-selector" bind:value={selectedSite} on:change={handleSiteChange}>
            <option value = "coupang">쿠팡</option>
            <option value = "smartstore">스마트스토어</option>
            <option value = "ESM">지마켓/옥션</option>
            <option value = "11st">11번가</option>
            <option value = "interpark">인터파크</option>
        </select>

        <label for="original-price" title="중국에서 구매한 제품의 1개당 가격입니다.">중국 내 구매 원가(위안, ¥):</label>
        <input type="text" id="original-price" name="original-price" placeholder="10" bind:value={originalCost} title="중국에서 구매한 제품의 1개당 가격입니다.">

        <label for="import-count" title="전체 구매 개수입니다.">수입 개수(단위):</label>
        <input type="text" id="import-count" name="import-count" placeholder="100" bind:value={importCount} title="전체 구매 개수입니다.">

        <label for="china-shipping-cost" title="중국 생산지에서 중국 배송대행지로 보내는데 청구되는 택배비입니다.(1688 같은 경우 사용, 없으면 0)">중국 내 운송비(위안, ¥):</label>
        <input type="text" id="china-shipping-cost" name="china-shipping-cost" placeholder="50" bind:value={chinaShippingCost} title="중국 생산지에서 중국 배송대행지로 보내는데 청구되는 택배비입니다.(1688 같은 경우 사용, 없으면 0)">

        <div class="import-box-padding-container">
        <label for="import-box" title="중국에서 제품을 수입할 때, 발송이 되는 박스의 개수입니다. 국내 수령 비용 계산을 위해 사용됩니다. 30cm 정육면체 박스 3개,  50cm의 정육면체 박스를 5개, 130cm 정육면체 박스 1개를 수입한다면, 소형에 3, 중형에 5, 대형에 1을 적으시면 됩니다.">수입 시, 발송되는 박스 개수:</label>
            <div class="import-box">
                <div class="import-box-small">
                    <label for="box-small" title="부피 40000cm³ 이하(대략 35cm 박스)">소형(박스, 개)</label>
                    <input type="text" id="box-small" name="box-small" placeholder="1" bind:value={smallBox} title="부피 40000cm³ 이하(대략 35cm 박스)">
                </div>
                <div class="import-box-medium">
                    <label for="box-medium" title="부피 100000cm³ 이하(대략 100cm 박스)">중형(박스, 개)</label>
                    <input type="text" id="box-medium" name="box-medium" placeholder="1" bind:value={mediumBox} title="부피 100000cm³ 이하(대략 100cm 박스)">
                </div>
                <div class="import-box-large">
                    <label for="box-large" title="부피 160000cm³ 이하(대략 120cm 박스)">대형(박스, 개)</label>
                    <input type="text" id="box-large" name="box-large" placeholder="1" bind:value={LargeBox} title="부피 160000cm³ 이하(대략 120cm 박스)">
                </div>
            </div>
        </div>

        <label for="cbm" title="부피무게를 뜻하는 것으로서, 이는 중국에서 한국으로 제품을 발송 시 발생하는 비용을 계산하기 위한 수치입니다. 화물의 가로x세로x높이가 각각 1m인 경우, 1CBM 입니다. 만일 50cm 정육면체 박스 10개를 수입한다면 0.5m(가로) X 0.5m(세로) X 0.5m(높이) X 10(개수) = 1.25CBM 입니다.">CBM(모를 경우 CBM 계산기 사용 → <a href="http://cbm.uassetstore.com/#google_vignette" target="_blank">CBM 계산기 링크</a>):</label>
        <input type="text" id="cbm" name="cbm" placeholder="2" bind:value={CBM} title="화물의 가로x세로x높이가 각각 1m인 경우, 1CBM 입니다.">

        <label for="return-rate" title="제품이 반품 또는 불량으로 판매가 없게될 확률입니다, 일반적으로 3% 정도면 문제 없습니다.">반품/불량률(%):</label>
        <input type="text" id="return-rate" name="return-rate" placeholder="3" bind:value={returnRate} title="제품이 반품 또는 불량으로 판매가 없게될 확률입니다, 일반적으로 3% 정도면 문제 없습니다.">

        <label for="packaging-cost" title="국내 발송 전 제품 포장을 위해 개별적으로 들어가는 비용입니다.">개별 제품 포장 비용(박스/비닐봉투, 원):</label>
        <input type="text" id="packaging-cost" name="packaging-cost" placeholder="200" bind:value={packagingCost} title="국내 발송 전 제품 포장을 위해 개별적으로 들어가는 비용입니다.">

        <label for="korea-shipping-cost" title="국내에서 발송하기 위한 택배비입니다.">제품 발송 택배비(원, ₩)</label>
        <input type="text" id="korea-shipping-cost" name="korea-shipping-cost" placeholder="3000" bind:value={koreaShippingCost} title="국내에서 발송하기 위한 택배비입니다.">

        <button type="submit">계산</button>
    </form>
    <aside>
        <p>광고를 위한 공간</p>
    </aside>
</main>
<div class="explan-box">
    <p style="text-align: left;"><b>제품 개당 판매가(원, ₩)</b> : 국내에서 해당 제품을 얼마에 팔 것인가, 배송비가 별도라면 배송비를 포함해서 적어주세요.<br>(제품가 20000원, 배송비 3000원이면 23000원 적어주시면 됩니다.) </p>
    <p style="text-align: left;"><b>중국 내 구매 원가(위안, ¥)</b> : 중국에서 제품을 구매할 때, 1개당 가격을 적어주시면 됩니다. (100개에 1000위안에 구매 하셨다면, 개당 10위안 입니다.)</p>
    <p style="text-align: left;"><b>수입 개수(단위)</b> : 구매 원가 당 단위(개수)를 적어주시면 됩니다. <br>(1세트에 10개입 10위안 이라면, 1세트가 단위입니다. 그러므로 100세트 구매했으면 100 적으시면 됩니다.)</p>
    <p style="text-align: left;"><b>중국 내 운송비(위안, ¥)</b> : 타오바오에서는 배송비가 없지만, 1688에서 구매를 할 때는 배송비가 추가로 발생할 수 있습니다. 발생하면 적어주시고, 없으면 0 적으시면 됩니다.</p>
    <p style="text-align: left;"><b>포장 박스 개수</b> : 소형/중형/대형으로 나누어져 있고, 부피 40000cm³ 이하(대략 35cm 박스)는 소형, 부피 100000cm³ 이하(대략 100cm 박스)는 중형, 부피 160000cm³ 이하(대략 120cm 박스)는 대형입니다.<br>중국에서 10X10X10cm 크기의 장난감을 350개 구매했고, 중국에서 100개씩 3세트(100cm 박스), 50개 1세트(70cm 박스)로 총 4박스를 보냈다면, 중형에 4를 적으시면 됩니다.</p>
    <p style="text-align: left;"><b>CBM</b> : Cubit Meter로서, 부피를 중량으로 환산하기 위해 사용되는 단위입니다. 가로(m)x세로(m)x높이(m)로 계산하며, 50cm의 정육면체 상자의 경우, 0.5*0.5*0.5 = 0.125CBM 입니다.<br> 위의 100cm 정육면체 상자의 경우, 1*1*1로 1CBM 입니다. 잘 모르겠을 경우에는, <a href="http://cbm.uassetstore.com/#google_vignette" target="_blank">링크</a>의 CBM 계산기를 이용해주세요.</p>
    <p style="text-align: left;"><b>반품/불량률</b> : 수입한 물품이 모두 정상은 아닐 수 있습니다, 운송중 또는 수령 후 파손이 일어나 반품이 되거나 팔 수 없게될 수 있습니다. 일반적으로 3%를 생각하시면 됩니다.</p>
    <p style="text-align: left;"><b>개별 제품 포장 비용(박스/비닐봉투, 원)</b> : 포장용으로 사용되는 박스/비닐봉투의 가격입니다. 20cm 박스 기준으로 개당 250원, 30cm 비닐봉투 기준으로 개당 100원 정도 잡으시면 됩니다. 이외에 다른 기타 포장 비용이 필요하면 개수로 나눠서 더하면 됩니다.</p>
    <p style="text-align: left;"><b>제품 발송 택배비(원, ₩)</b> : 1세트 단위 발송하는데 필요한 국내 택배 발송 비용입니다.</p>
</div>

{#if results.netProfitPerUnit !== undefined}
    <div id="result-display" bind:this={resultDisplayRef}>
        <p class="result-explain">※ 해당 값은 예상치입니다.</p>
        <p class="result-title">매출: <span class="result-value">{formatNumber(Math.round(results.estimatedSales))} 원</span></p>
        <p class="result-title">매입: <span class="result-value">{formatNumber(Math.round(results.estimatedPurchase))} 원</span></p>
        <p class="result-title">순이익: <span class="result-value">{formatNumber(Math.round(results.netProfit))} 원</span></p>
        <p class="result-title">단위당 순이익: <span class="result-value">{formatNumber(Math.round(results.netProfitPerUnit))} 원</span></p>
        <button class="details-button" on:click={toggleDetails}>
            {showDetails ? '간략히 보기' : '자세히 보기'}
        </button>
        {#if showDetails}
            <div class="details-section">
                <p class="result-title">수입 물류 비용: <span class="result-value">{formatNumber(Math.round(results.chinaImportCost))} 원</span></p>
                <p class="result-subtitle">CBM 물류 비용: <span class="result-subvalue">{formatNumber(Math.round(results.justCBMCost))} 원</span></p>
                <p class="result-subtitle">원산지 표기 비용: <span class="result-subvalue">{formatNumber(Math.round(results.originMakingCost))} 원</span></p>
                <p class="result-title">통관 관련 비용: <span class="result-value">{formatNumber(Math.round(results.customsEntireFee))} 원</span></p>
                <p class="result-subtitle">수입 서류 비용: <span class="result-subvalue">{formatNumber(Math.round(results.importDocumentCost))} 원</span></p>
                <p class="result-subtitle">통관 수수료: <span class="result-subvalue">{formatNumber(Math.round(results.customsFee))} 원</span></p>
                <p class="result-subtitle">관부가세: <span class="result-subvalue">{formatNumber(Math.round(results.customsDutyAndSurtax))} 원</span></p>
                <p class="result-title">국내 수령 택배비: <span class="result-value">{formatNumber(Math.round(results.domesticShippingCost))} 원</span></p>
                <p class="result-title">예상 마켓 수수료(VAT 포함): <span class="result-value">{formatNumber(Math.round(results.marketFeeAndVAT))} 원</span></p>
                <p class="result-title">포장 및 발송 택배비: <span class="result-value">{formatNumber(Math.round(results.packageAndSending))} 원</span></p>
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

    #site-selector {
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

    .explain-text{
        text-align: right;
        font-size: 14px;
    }

    form h2 {
        font-size: 18px;
        padding-right: 16px;
        padding-left: 16px;
    }

    .exchange-box{
        border: 1px solid #ccc;
        box-shadow: 2px 3px 2px rgba(0,0,0,0.1);
        padding-right: 16px;
        padding-legt: 16px;
        border-radius: 8px;
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
        text-align: right;
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

    .import-box-padding-container {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .import-box {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .import-box div {
        flex: 1 1 33%;
        padding-left: 10px;
        padding-right: 10px;
    }
</style>