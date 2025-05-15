document.addEventListener("DOMContentLoaded", () => {
  const burgerButton = document.querySelector(".header__burger");
  const burgerIcon = document.querySelector(".header__burger-icon");
  const navMenu = document.querySelector(".header__nav");
  const navLinks = document.querySelectorAll(".header__nav-link");

  const toggleMenu = () => {
    const isActive = navMenu.classList.toggle("header__nav--active");
    burgerIcon.src = isActive
      ? "./assets/images/icons/close.svg"
      : "./assets/images/icons/burger.svg";
    document.body.style.overflow = isActive ? "hidden" : "";
  };

  burgerButton.addEventListener("click", toggleMenu);

  navLinks.forEach((link) =>
    link.addEventListener("click", () => {
      navMenu.classList.remove("header__nav--active");
      burgerIcon.src = "./assets/images/icons/burger.svg";
      document.body.style.overflow = "";
    }),
  );


  const logoButton = document.querySelector(".header__logo-image");
  logoButton?.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector(".header").scrollIntoView({ behavior: "smooth" });
  });


  const toTopButton = document.getElementById("toTop");
  window.addEventListener("scroll", () => {
    toTopButton.style.display = window.scrollY > 300 ? "flex" : "none";
  });

  toTopButton?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  const sections = document.querySelectorAll("section, footer");
  const highlightMenu = () => {
    const scrollPosition = window.scrollY;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      const isActive =
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight;
      const link = document.querySelector(
        `.header__nav-link[href="#${section.id}"]`,
      );
      link?.classList.toggle("active", isActive);
    });
  };

  window.addEventListener("scroll", highlightMenu);


  document.querySelectorAll(".interactive-area").forEach((area) => {
    area.addEventListener("mouseover", () =>
      console.log("Наведение на область"),
    );
    area.addEventListener("mouseout", () => console.log("Уход с области"));
    area.addEventListener("click", () => alert("Вы кликнули на область!"));
  });

  const images = [
    { src: "./assets/images/gallery/main.png", alt: "Галерея 1" },
    { src: "./assets/images/gallery/photo.jpg", alt: "Галерея 2" },
    { src: "./assets/images/gallery/photo1.jpg", alt: "Галерея 3" },
    { src: "./assets/images/gallery/photo2.jpg", alt: "Галерея 4" },
    { src: "./assets/images/gallery/photo3.jpg", alt: "Галерея 5" },
  ];

  const generateSlides = (images, isThumb = false) =>
    images
      .map(
        (image) =>
          `<div class="swiper-slide">
               <img src="${image.src}" alt="${isThumb ? "Миниатюра " : ""}${image.alt}" />
             </div>`,
      )
      .join("");

  document.querySelector(".gallery-slider .swiper-wrapper").innerHTML =
    generateSlides(images);
  document.querySelector(".gallery-thumbs .swiper-wrapper").innerHTML =
    generateSlides(images, true);

  const slider = new Swiper(".gallery-slider", {
    slidesPerView: 1,
    centeredSlides: true,
    loop: false,
  });

  const thumbs = new Swiper(".gallery-thumbs", {
    slidesPerView: "auto",
    spaceBetween: 5,
    centeredSlides: true,
    loop: false,
    slideToClickedSlide: true,
  });

  slider.controller.control = thumbs;
  thumbs.controller.control = slider;


  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      slider.slideNext(); 
    } else if (event.key === "ArrowLeft") {
      slider.slidePrev(); 
    }
  });


  ymaps.ready(() => {
    const map = new ymaps.Map("yandex-map", {
      center: [60.06918, 30.737708],
      zoom: 16,
    });
    const placemark = new ymaps.Placemark(
      [59.939095, 30.315868],
      { hintContent: "Наш офис", balloonContent: "Мы здесь!" },
      { preset: "islands#icon", iconColor: "#0095b6" },
    );
    map.geoObjects.add(placemark);
  });


  fetch("./map.json")
    .then((response) => response.json()) 
    .then((data) => {
      console.log(data); 


      document.querySelectorAll("svg path, svg rect").forEach((element) => {
        element.addEventListener("click", (event) => {

          const svgDataId = element.getAttribute("data-id");
          const plotData = data.find((plot) => plot.id === svgDataId);


          if (plotData) {

            document.querySelector(".info-box")?.remove();

            const infoBox = document.createElement("div");
            infoBox.className = "info-box";
            infoBox.innerHTML = `
                <button class="info-box-close" style="
                  position: absolute;
                  top: 10px;
                  right: 10px;
                  background: none;
                  border: none;
                  font-size: 16px;
                  cursor: pointer;
                ">&times;</button>
                <strong>Участок: ${plotData.id}</strong><br>
                Площадь: ${plotData.area} м²<br>
                Цена: ${plotData.plot_price} ₽<br>
                За сотку: ${plotData.price_per_hundred_sqm} ₽ <br>
                <span style="color: ${
                  plotData.available === "Свободен"
                    ? "green"
                    : plotData.available === "Продан"
                    ? "red"
                    : "orange"
                };">
                ${
                  plotData.available === "Свободен"
                    ? "Свободен"
                    : plotData.available === "Продан"
                    ? "Продан"
                    : "Забронирован"
                }
                </span>
            `;

            const boundingBox = element.getBoundingClientRect();

            Object.assign(infoBox.style, {
              position: "absolute",
              left: `${boundingBox.left + window.scrollX + boundingBox.width / 2}px`, 
              top: `${boundingBox.bottom + window.scrollY + 10}px`, 
              transform: "translateX(-50%)", 
              backgroundColor: "white",
              padding: "15px",
              border: "1px solid black",
              borderRadius: "5px",
              zIndex: "1000",
            });

            document.body.appendChild(infoBox);

            const closeButton = infoBox.querySelector(".info-box-close");
            closeButton.addEventListener("click", () => infoBox.remove());
            closeButton.addEventListener("mouseover", () => {
              closeButton.style.color = "black";
            });


            setTimeout(() => infoBox.remove(), 10000);
            infoBox.addEventListener("click", () => infoBox.remove());
          } else {
            console.error(`Участок с id "${svgDataId}" не найден в данных.`);
          }
        });
      });

      const textLayer = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );
      textLayer.setAttribute("id", "text-layer");
      textLayer.setAttribute("pointer-events", "none"); 
      document.querySelector("svg").prepend(textLayer); 
      document.querySelectorAll("svg path, svg rect").forEach((element) => {

        const svgDataId = element.getAttribute("data-id");
        const plotData = data.find((plot) => plot.id === svgDataId);

        if (plotData) {
          switch (plotData.available) {
            case "Свободен":
              element.setAttribute("fill", "rgba(9, 172, 9, 0.77)"); 
              break;
            case "Продан":
              element.setAttribute("fill", "rgba(255, 0, 0, 0.77)"); 
              break;
            case "Забронирован":
              element.setAttribute("fill", "rgba(239, 239, 28, 0.77)"); 
              break;
            default:
              element.setAttribute("fill", "rgba(200, 200, 200, 0.4)"); 
          }

          const areaInKm2 = plotData.area; 
          const textNode = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );

          if (svgDataId === "25") {
            textNode.setAttribute(
              "x",
              element.getBBox().x + element.getBBox().width / 2.8
            ); 
            textNode.setAttribute(
              "y",
              element.getBBox().y + element.getBBox().height / 1.9
            ); 
          } else {
            textNode.setAttribute(
              "x",
              element.getBBox().x + element.getBBox().width / 2
            ); 
            textNode.setAttribute(
              "y",
              element.getBBox().y + element.getBBox().height / 2.5
            ); 
          }


          textNode.setAttribute("text-anchor", "middle"); 
          textNode.setAttribute("dominant-baseline", "middle"); 
          textNode.setAttribute("font-size", "9"); 
          textNode.setAttribute("fill", "white"); 
          textNode.setAttribute("font-family", "Roboto, sans-serif"); 
          textNode.setAttribute("class", "svg-text");

          const mainText = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
          mainText.setAttribute("x", textNode.getAttribute("x")); 
          mainText.setAttribute("dy", "0"); 
          mainText.textContent = `${areaInKm2}`; 

          const subText = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
          subText.setAttribute("x", textNode.getAttribute("x")); 
          subText.setAttribute("dy", "1em"); 
          subText.setAttribute("letter-spacing", "0.05em");
          subText.textContent = "сот";

          textNode.appendChild(mainText);
          textNode.appendChild(subText);

          textLayer.appendChild(textNode);
        } else {
          console.error(`Участок с id "${svgDataId}" не найден в данных.`);
        }
      });
    })
    .catch((error) => console.error("Ошибка при загрузке данных:", error));
});
