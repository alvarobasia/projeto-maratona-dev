(function(win, doc) {
    doc
        .querySelector('header button')
        .addEventListener("click", function (event) {
            doc.querySelector(".form")
                .classList.toggle('hide')
                }, false);
})(window, document);