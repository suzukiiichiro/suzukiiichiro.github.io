class Custom {
  constructor() {
    this.ui = {
      //アーカイブの選択
      selectArchives: '#select-archives'
    };
  }
  //イベントを登録
  addEvents() {
    let evChangeArchives = () => {
      document.querySelector(this.ui.selectArchives).addEventListener('change', e => {
        let val = e.currentTarget.value;
        location.href = val;
      }, false);
    };
    evChangeArchives();
  }
  toggleTOC(e) {
    document.querySelector('.tableOfContents').classList.toggle('closeTOC');
  }
  addNew() {
    let current = document.querySelector('.article-list[data-new]');
    if(current) {
      let items = document.querySelectorAll('.article-list .article-item');
      for(let i = 0; i < items.length; i++) {
        if(items[i].dataset.date !== undefined && items[i].dataset.date === current.dataset.new) {
          items[i].classList.add('item-new');
        }
      }
    }
  }
  //アドセンスを遅延読み込み
  googleAd() {
    if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
      let lazyadsense = false;
      window.addEventListener("scroll", () => {
        if ((document.documentElement.scrollTop != 0 && lazyadsense === false) || (document.body.scrollTop != 0 && lazyadsense === false)) {
          {
            let ad = document.createElement('script');
            ad.type = 'text/javascript';
            ad.async = true;
            ad.crossorigin = 'anonymous';
            ad.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8689199204567424';
            let sc = document.getElementsByTagName('script')[0];
            sc.parentNode.insertBefore(ad, sc);
          }
          lazyadsense = true;
        }
      }, true)
    } else {
      let createAdsbygooglejs = document.createElement('script');
      createAdsbygooglejs.async = true;
      createAdsbygooglejs.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8689199204567424";
      createAdsbygooglejs.async = true;
      createAdsbygooglejs.setAttribute('crossorigin', 'anonymous');
      document.body.appendChild(createAdsbygooglejs);
    }
  }
  //実行
  init(){
    this.googleAd();
    this.addEvents();
    this.addNew();
  }
}

let custom = new Custom();
custom.init();