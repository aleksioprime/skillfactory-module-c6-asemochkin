const btnAlert = document.querySelector('.j-btn-alert');

btnAlert.addEventListener('click', () => {
    alert(`Размеры экрана\nШирина: ${window.screen.width}\nВысота: ${window.screen.height}`)
});