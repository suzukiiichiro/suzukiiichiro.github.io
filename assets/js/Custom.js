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
  //実行
  init(){
    this.addEvents();
    this.addNew();
  }
}

let custom = new Custom();
custom.init();