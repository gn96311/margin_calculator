<svelte:head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-359815RNLB"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-359815RNLB');
  </script>
</svelte:head>

<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>중국수입/일본수출 마진 계산기</title>
        <meta name="description" content="중국수입/일본수출 마진 계산기를 사용하여 수출 및 수입 마진을 간편하게 계산하세요. 수입/사입/수출을 하는 판매자분들에게 최적의 솔루션을 제공해드립니다."> 
        <link rel="stylesheet" href="styles.css">
        <meta name="keywords" content="수출, 수입, 중국 수입, 일본 수출, 일본 리셀, 중국 사입, 마진 계산기, 손익 분석, 수출입, 무역, 수출입 마진, 수입 마진, 구매대행, 중국 수입 마진 계산, 일본 리셀 마진 계산, 일본 수출 마진 계산">
        <meta property="og:title" content="중국수입/일본수출 마진 계산기">
        <meta property="og:description" content="중국수입/일본수출 마진 계산기를 사용하여 수출 및 수입 마진을 간편하게 계산하세요. 수입/사입/수출을 하는 판매자분들에게 최적의 솔루션을 제공해드립니다.">
        <meta property="og:image" content="https://margin-calculator.site/site-banner.png">
        <meta property="og:url" content="https://margin-calculator.site/">
        <meta property="og:type" content="website">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="중국수입/일본수출 마진 계산기">
        <meta name="twitter:description" content="중국수입/일본수출 마진 계산기를 사용하여 수출 및 수입 마진을 간편하게 계산하세요. 수입/사입/수출을 하는 판매자분들에게 최적의 솔루션을 제공해드립니다.">
        <meta name="twitter:image" content="https://margin-calculator.site/site-banner.png">
        <meta name="robots" content="index,follow">
        <meta name="author" content="GEON KIM">
        <meta name="language" content="ko">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9230486389083844"
            crossorigin="anonymous"></script>
    </head>
    <body>
        <div class="container">
        <header>
            <div class="header-ads">
                <a href="/">
			        <img src="/site-banner.png" alt="margin-calculator.site" width="150" height="100">
		        </a>
                <!-- <div class="header-ads-box"> -->
                <!-- </div> -->
            </div>
            <div class="nav-container">
                <nav>
                    <ul>
                        <li><a href="/">중국 → 한국 <br> 수입 마진 계산기</a></li>
                        <li><a href="/japanexport">한국 → 일본 <br> 수출 마진 계산기</a></li>
                        <li><a href="http://cbm.uassetstore.com/#google_vignette" target="_blank">CBM<br>계산기</a></li>
                    </ul>
                </nav>
            </div>
        </header>
        <slot></slot>
        <footer>
        <!--     <p>광고</p> -->
            <div class="information-box">
                <p> <a href="/about">당사 소개 </a> - <a href="/privacy-policy">개인정보 보호정책</a> - <a href="/sitemap.xml">Sitemap</a> - © 2023 - 2024 by Geon Kim</p> 
        </footer>
        </div>
    </body>
</html>


<style>
    html {
        -webkit-text-size-adjust: 100%;
        font-size: 16px;
        line-height: 1.5;
    }
    

    body {
        font-family: 'Pretendard-Regular', sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 0.01em 16px;
        background-color: #ffffff;
        overflow: auto;
    }

    .nav-container{
        background-color: #93E9B5;
        padding: 10px;
        margin-top: 10px;
        border-radius: 8px;
        font-color: #333333;
        font-size: 15px;
    }

    .container {
        width: 1050px;
        margin: 0 auto;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    header {
        background-color: #fff;
        padding: 20px;
        text-align: center;
        border-bottom: 1px solid #ccc;
        width: 100%;
    }

    .header-ads {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .header-ads-box{
        flex-grow: 1;
        height: 100px;
        display: flex;
        background-color: #ccc;
        margin-left: 20px;
        border-radius: 15px;
    }

    nav ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
    }

    nav ul li {
        margin: 0 20px;
        padding: 3px;
        position: relative;
        transition: background-color 0.3s, font-color 0.3s;
        border-radius: 8px;
    }

    nav ul li:hover{
        background-color: #eeeeee;
        color: #ffffff;
    }

    nav ul li a {
        text-decoration: none;
        color: #333333;
        display: flex;
        align-items: center;
        flex-direction: column;
        text-align: center; 
    }
    nav ul li a:hover {
        color: #ffffff;
    }

    nav ul li:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -20px;
    top: 0;
    height: 100%;
    border-right: 1.5px solid #333333;
    }
    
    footer {
        background-color: #fff;
        padding: 20px;
        text-align: center;
        border-top: 1px solid #ccc;
        width: 100%;
        margin-top: 20px;
    }
</style>
