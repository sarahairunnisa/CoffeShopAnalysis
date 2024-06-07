document.addEventListener("DOMContentLoaded", function () {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'navigation.html', true);
  xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
          document.getElementById('navigation').innerHTML = xhr.responseText;
          highlightActiveLink();
          adjustPadding();
      }
  };
  xhr.send();
});

function highlightActiveLink() {
  var navLinks = document.querySelectorAll('.menu a');
  var currentPage = window.location.href.split('/').pop();

  navLinks.forEach(function(link) {
    var linkPage = link.getAttribute('href');

    link.classList.remove('active-link');

    if (linkPage === currentPage || (linkPage === 'index.html' && currentPage === '')) {
      link.classList.add('active-link');
    }
  });
}

function adjustPadding() {
  var navHeight = document.getElementById('navigation').offsetHeight;
  var landingPage = document.querySelector('.landing-page');
  var pageWrapper = document.querySelector('.page-wrapper');

  if (landingPage) {
    landingPage.style.paddingTop = navHeight - 21 + 'px';
  }

  if (pageWrapper) {
    pageWrapper.style.paddingTop = navHeight - 21 + 'px';
  }
}

window.addEventListener('hashchange', highlightActiveLink);
