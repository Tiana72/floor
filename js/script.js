//Slider

new Swiper('.hero__slider', {
    slidesPerView: 2,
    spaceBetween: 10,
    loop: true,
    navigation: {
        nextEl: '.hero__slider-btn_next',
        prevEl: '.hero__slider-btn_prev',
    },
    autoplay: {
        delay: 3000,
    },
    breakpoints: {
        320: {
            slidesPerView: 1,
        },
        700: {
            spaceBetween: 8,
        },
    },
});

// Calcularor

const calcForm = document.querySelector('.js-calc-form');
const totalSquare = document.querySelector('.js-square');
const totalCost = document.querySelector('.js-cost');
const resultWrapper = document.querySelector('.calc__result-wrapper');
const btnSubmit = document.querySelector('.js-submit');
const calcOrder = document.querySelector('.calc__order');
const tariff = {
    econom: 550,
    comfort: 1400,
    premium: 2700,
}

calcForm.addEventListener('input', () => {
    btnSubmit.disabled = !(calcForm.width.value > 0 && calcForm.length.value > 0);
});

calcForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (calcForm.width.value > 0 && calcForm.length.value > 0) {
        resultWrapper.style.display = 'block';
        calcOrder.classList.add('calc__order_show');
        const square = calcForm.width.value * calcForm.length.value;
        const cost = square * tariff[calcForm.tariff.value];
        totalSquare.textContent = `${square} кв. м`;
        totalCost.textContent = `${cost} руб.`;
    } 
});

// Модальное окно

const scrollController = {
  scrollPosition: 0,
  disabledScroll() {
    scrollController.scrollPosition = window.scrollY;
    document.body.style.cssText = `
      overflow: hidden;
      position: fixed;
      top: -${scrollController.scrollPosition}px;
      left: 0;
      height: 100vh;
      width: 100vw;
      padding-right: ${window.innerWidth - document.body.offsetWidth}px
    `;
    document.documentElement.style.scrollBehavior = 'unset';
  },
  enabledScroll() {
    document.body.style.cssText = '';
    window.scroll({top: scrollController.scrollPosition})
    document.documentElement.style.scrollBehavior = '';
  },
}

const modalController = ({modal, btnOpen, btnClose, time = 300}) => {
    const buttonElems = document.querySelectorAll(btnOpen);
    const modalElem = document.querySelector(modal);
  
    modalElem.style.cssText = `
      display: flex;
      visibility: hidden;
      opacity: 0;
      transition: opacity ${time}ms ease-in-out;
    `;
  
    const closeModal = event => {
      const target = event.target;
  
      if (
        target === modalElem ||
        (btnClose && target.closest(btnClose)) ||
        event.code === 'Escape'
        ) {
        
        modalElem.style.opacity = 0;
  
        setTimeout(() => {
          modalElem.style.visibility = 'hidden';
          scrollController.enabledScroll();
        }, time);
  
        window.removeEventListener('keydown', closeModal);
      }
    }
  
    const openModal = () => {
      modalElem.style.visibility = 'visible';
      modalElem.style.opacity = 1;
      window.addEventListener('keydown', closeModal)
      scrollController.disabledScroll();
    };
  
    buttonElems.forEach(btn => {
      btn.addEventListener('click', openModal);
    });
  
    modalElem.addEventListener('click', closeModal);
  };
  
  modalController({
    modal: '.modal', 
    btnOpen: '.js-button', 
    btnClose: '.modal__close', 
  });

  const phone = document.getElementById('phone');
  const imPhone = new Inputmask('+999(99)999-99-99');
  imPhone.mask(phone);

  const validator = new JustValidate('.modal__form', {
    errorLabelCssClass: 'modal__input-error',
    errorLabelStyle: {
      color: '#FFC700',
    }
  })

  validator.addField('#name', [
    {
      rule: 'required',
      errorMessage: 'Введите Ваше имя',
    },
    {
      rule: 'minLength',
      value: 3,
      errorMessage: 'Минимум 3 символа',
    },
    {
      rule: 'maxLength',
      value: 30,
      errorMessage: 'Максимум 30 символов',
    }
  ]);

  validator.addField('#phone', [
    {
      rule: 'required',
      errorMessage: 'Введите номер телефона',
    },
    {
      validator: value => {
        const number = phone.inputmask.unmaskedvalue();
        return number.length === 12;
      },
      errorMessage: 'Неверный номер телефона',
    }
  ]);

  validator.onSuccess((event) => {
    const form = event.currentTarget
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        name: form.name.value,
        phone: form.phone.value,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((response) => response.json())
    .then((data) => {
      form.reset();
      alert(`Ваша заявка принята под номером ${data.id}`);
    });
  })