const puppeteer=require('puppeteer');

async function parseSearch(page){
    const search= await page.evaluate(()=>{
        const search_results=document.querySelectorAll(".text-wrapper.style-scope.ytd-video-renderer");
        const lists=[];
        search_results.forEach(elements => {
            const vidname=elements.querySelector("h3");
            // const quotetext=quoteinfo[0];
            const channel=elements.querySelector("a.yt-simple-endpoint.style-scope.yt-formatted-string");

            lists.push({
                video_name:vidname.innerText,
                channel_name:channel.innerHTML
            });
        });
        return lists;

    })
    console.log(search);
}

async function autoScroll(page)
{
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 700;
            var timer = setInterval(() => {
                const element=document.querySelectorAll('.style-scope.ytd-video-renderer');
                var scrollHeight = element.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            },200);
        });
    });
}

(async()=>{
    const browser=await puppeteer.launch({headless:false});
    const page=await browser.newPage();
    await page.goto("https://www.youtube.com/results?search_query=programming")


    const result=await parseSearch(page);

    await autoScroll(page);
    console.log(result);
    await browser.close();
})()
console.log("END");