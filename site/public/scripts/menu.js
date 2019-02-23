/* Shows the menu if they click on a buttom */

const menu = document.querySelector('.menu.outside')
const toggle = menu.querySelector('.toggle')

toggle.addEventListener('click', () => {
  menu.classList.toggle('show')
})
