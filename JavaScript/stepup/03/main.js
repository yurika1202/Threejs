class PhotoViewer {
  constructor(rootElm, image) {
    this.rootElm = rootElm;
    this.images = image;
    this.currentIndex = 0;
  }

  init() {
    const nextBtn = document.querySelector('.nextBtn');
    nextBtn.addEventListener('click', () => {
      this.next();
    });

    const prevBtn = document.querySelector('.prevBtn');
    prevBtn.addEventListener('click', () => {
      this.prev();
    });

    this.renderImageUrls();
    this.updatePhoto();
  }

  updatePhoto() {
    const frameElm = this.rootElm.querySelector('.frame');
    const imageIndex = this.currentIndex + 1;
    frameElm.innerHTML = `<div class="currentImage"><p>${imageIndex}枚目</p><img src="${this.images[this.currentIndex]}" /></div>`;
    this.startTimer();
  }

  startTimer() {
    if (this.timerKey) {
      clearTimeout(this.timerKey);
    }

    this.timerKey = setTimeout(() => {
      this.next();
    }, 3000);
  }

  next() {
    const lastIndex = this.images.length - 1;
    if (lastIndex === this.currentIndex) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }
    this.updatePhoto();
  }

  prev() {
    const lastIndex = this.images.length - 1;
    if (this.currentIndex === 0) {
      this.currentIndex = lastIndex;
    } else {
      this.currentIndex--;
    }
    this.updatePhoto();
  }

  renderImageUrls() {
    const imagesEls = this.rootElm.querySelector('.images');
    let imageUrlsHtml = '';
    images.forEach(image => {
      imageUrlsHtml += `<li><a href="${image}" target="_blank">${image}</a>`;
    });
    imagesEls.innerHTML = imageUrlsHtml;
  }
}

const images = ['https://placehold.jp/250x150.png', 'https://placehold.jp/3d4070/ffffff/250x150.png', 'https://placehold.jp/6b8e78/ffffff/250x150.png'];
new PhotoViewer(document.querySelector('.photoViewer'), images).init();
