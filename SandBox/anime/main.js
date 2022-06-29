// スクロール量に応じて線が伸びる
const ScrollLine = () => {
  const line = document.querySelector('.line');
  const scrollTop = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight;
  const viewHeight = document.documentElement.clientHeight;
  const scrollHeight = documentHeight - viewHeight;
  const scroll = (scrollTop / scrollHeight) * 100;

  line.style.height = scroll + 10 + '%';

  if (scroll > 90) {
    line.style.height = '100%';
  }
};

window.onscroll = ScrollLine;

// シャッフルテキスト（ライブラリ使用）
const shuffleText = document.querySelectorAll('.shuffleText_lib');
shuffleText.forEach(text => {
  text = new ShuffleText(text);
  text.start();
});
