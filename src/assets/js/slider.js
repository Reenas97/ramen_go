function setupSlider(containerId, trackId, dotsId) {
    const sliderContainer = document.getElementById(containerId)
    const sliderTrack = document.getElementById(trackId)
    const sliderItems = Array.from(sliderTrack.children)
    const sliderWidth = sliderItems[0].offsetWidth + 10
    const numItems = sliderItems.length
    const visibleWidth = 220 + 10
    let currentIndex = 0
    let touchStartX = 0

    const sliderDotsContainer = document.getElementById(dotsId)

    function moveToIndex(index) {
        if (index < 0 || index >= numItems) return
        const offset = -index * visibleWidth
        sliderTrack.style.transform = `translateX(${offset}px)`
        currentIndex = index
        updateDots()
    }

    function updateDots() {
        const dots = Array.from(document.querySelectorAll(`#${dotsId} .dot`))
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
              dot.classList.add('active')
            } else {
              dot.classList.remove('active')
            }
        })
    }

    function createDots() {
        for (let i = 0; i < numItems; i++) {
            const dot = document.createElement('div')
            dot.classList.add('dot');
            dot.addEventListener('click', () => moveToIndex(i))
            sliderDotsContainer.appendChild(dot)
        }
        updateDots()
    }

    createDots();

    function next() {
        currentIndex = (currentIndex + 1) % numItems
        moveToIndex(currentIndex)
    }

    function prev() {
        currentIndex = (currentIndex - 1 + numItems) % numItems
        moveToIndex(currentIndex)
    }

    //suporte para swipe
    sliderContainer.addEventListener('touchstart', handleTouchStart)
    sliderContainer.addEventListener('touchmove', handleTouchMove)
    sliderContainer.addEventListener('touchend', handleTouchEnd)

    function handleTouchStart(event) {
        touchStartX = event.touches[0].clientX
    }

    function handleTouchMove(event) {
        const touchMoveX = event.touches[0].clientX
        const moveDistance = touchStartX - touchMoveX
        const offset = -currentIndex * visibleWidth + moveDistance

        if ((currentIndex === 0 && moveDistance < 0) || (currentIndex === numItems - 1 && moveDistance > 0)) {
          return
        }

    }

    function handleTouchEnd(event) {
        const touchEndX = event.changedTouches[0].clientX
        const moveDistance = touchStartX - touchEndX   

        if (Math.abs(moveDistance) > sliderWidth / 2) {
          if (moveDistance > 0 && currentIndex < numItems - 1) {
            next()
          } else if (moveDistance < 0 && currentIndex > 0) {
            prev()
          }
        } else {
          moveToIndex(currentIndex)
      }
    }

  }

setupSlider('sliderContainerBroths', 'broths', 'sliderDotsBroths')
setupSlider('sliderContainerProteins', 'proteins', 'sliderDotsProteins')
