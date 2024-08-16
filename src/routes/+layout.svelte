<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>수출/수입 마진 계산기</title>
        <link rel="stylesheet" href="styles.css">
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
                <div class="header-ads-box">
                </div>
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
            <p>광고</p>
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
