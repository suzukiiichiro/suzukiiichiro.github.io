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
  //実行
  init(){
    this.addEvents();
  }
}

let custom = new Custom();
custom.init();