window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  let height = 54;

  if (document.body.scrollTop > height || document.documentElement.scrollTop > height) {
    let region = document.getElementById('region-branding');
    if (!region.classList.contains("onTop")) {
      region.classList.add('onTop');
    }
  } else {
    document.getElementById('region-branding').classList.remove('onTop');
    //document.getElementById('region-branding').style.fontSize = '90px';
  }
}
