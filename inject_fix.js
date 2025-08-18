// 自動替換 Made with MyST 文字
(function() {
    function replaceMystText() {
        var html = document.body.innerHTML;
        if (html.includes("Made with MyST")) {
            html = html.replace(/Made with MyST/g, "Made by ZKPunk");
            document.body.innerHTML = html;
            console.log("Replaced 'Made with MyST' with 'Made by ZKPunk'");
        }
    }
    
    // 頁面加載完成後執行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', replaceMystText);
    } else {
        replaceMystText();
    }
    
    // 監控動態內容變化
    var observer = new MutationObserver(function(mutations) {
        var shouldReplace = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldReplace = true;
            }
        });
        
        if (shouldReplace) {
            setTimeout(replaceMystText, 100);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();